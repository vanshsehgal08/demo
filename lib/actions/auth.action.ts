"use server";

import { auth, db } from "@/firebase/admin";
import { SignUpParams, SignInParams, User } from "@/types";
import { cookies } from "next/headers";

// Session duration (1 week)
const SESSION_DURATION = 60 * 60 * 24 * 7;

// Set session cookie
export async function setSessionCookie(idToken: string) {
  const cookieStore = await cookies();

  // Create session cookie
  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: SESSION_DURATION * 1000, // milliseconds
  });

  // Set cookie in the browser
  cookieStore.set("session", sessionCookie, {
    maxAge: SESSION_DURATION,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
}

export async function signUp(params: SignUpParams) {
  const { uid, name, email } = params;

  try {
    // check if user exists in db
    const userRecord = await db.collection("users").doc(uid).get();
    if (userRecord.exists)
      return {
        success: false,
        message: "User already exists. Please sign in.",
      };

    // save user to db
    await db.collection("users").doc(uid).set({
      name,
      email,
      // profileURL,
      // resumeURL,
    });

    return {
      success: true,
      message: "Account created successfully. Please sign in.",
    };
  } catch (error: any) {
    console.error("Error creating user:", error);

    // Handle Firebase specific errors
    if (error.code === "auth/email-already-exists") {
      return {
        success: false,
        message: "This email is already in use",
      };
    }

    return {
      success: false,
      message: "Failed to create account. Please try again.",
    };
  }
}

export async function signIn(params: SignInParams) {
  const { email, idToken } = params;

  try {
    // Verify the ID token to get user info from Firebase Auth
    const decodedClaims = await auth.verifyIdToken(idToken);
    const uid = decodedClaims.uid;

    // Check if user exists in our Firestore 'users' collection
    const userRef = db.collection("users").doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      // If user doesn't exist in DB, create their document (for new Google sign-ups)
      await userRef.set({
        name: decodedClaims.name || email?.split('@')[0] || 'User',
        email: decodedClaims.email || email,
        // Add other fields you need, e.g., profile image URL from decodedClaims.picture
        createdAt: new Date().toISOString(),
      });
    }

    // Now that user is confirmed in DB, set the session cookie
    await setSessionCookie(idToken);

    return { success: true };
  } catch (error: any) {
    console.error("Error signing in:", error);
    return {
      success: false,
      message: error.message || "Failed to log into account. Please try again.",
    };
  }
}

// Sign out user by clearing the session cookie
export async function signOut() {
  const cookieStore = await cookies();

  cookieStore.delete("session");
}

// Get current user from session cookie
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();

  const sessionCookie = cookieStore.get("session")?.value;
  if (!sessionCookie) return null;

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

    // get user info from db
    const userRecord = await db
      .collection("users")
      .doc(decodedClaims.uid)
      .get();
    if (!userRecord.exists) return null;

    return {
      ...userRecord.data(),
      id: userRecord.id,
    } as User;
  } catch (error) {
    console.log(error);

    // Invalid or expired session
    return null;
  }
}

// Check if user is authenticated
export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}

export async function updateUserProfile(userId: string, data: { name: string }) {
  try {
    await db.collection("users").doc(userId).update({
      name: data.name,
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, message: "Failed to update profile" };
  }
}

interface CategoryScore {
  name: string;
  score: number;
  comment: string;
}

interface SkillProgress {
  communication: number;
  technicalKnowledge: number;
  problemSolving: number;
  culturalFit: number;
  confidenceAndClarity: number;
  totalScore: number;
  latestFeedback?: {
    strengths: string[];
    areasForImprovement: string[];
    finalAssessment: string;
  };
}

export async function getUserSkillProgress(userId: string): Promise<SkillProgress> {
  try {
    const feedbackSnapshot = await db
      .collection("feedback")
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .limit(1)
      .get();

    if (feedbackSnapshot.empty) {
      return {
        communication: 0,
        technicalKnowledge: 0,
        problemSolving: 0,
        culturalFit: 0,
        confidenceAndClarity: 0,
        totalScore: 0
      };
    }

    const latestFeedback = feedbackSnapshot.docs[0].data();
    const categoryScores = latestFeedback.categoryScores as CategoryScore[];

    // Map category scores to their respective fields
    const scores = categoryScores.reduce((acc, category) => {
      switch (category.name) {
        case "Communication Skills":
          acc.communication = category.score;
          break;
        case "Technical Knowledge":
          acc.technicalKnowledge = category.score;
          break;
        case "Problem Solving":
          acc.problemSolving = category.score;
          break;
        case "Cultural Fit":
          acc.culturalFit = category.score;
          break;
        case "Confidence and Clarity":
          acc.confidenceAndClarity = category.score;
          break;
      }
      return acc;
    }, {
      communication: 0,
      technicalKnowledge: 0,
      problemSolving: 0,
      culturalFit: 0,
      confidenceAndClarity: 0,
      totalScore: latestFeedback.totalScore || 0,
      latestFeedback: {
        strengths: latestFeedback.strengths || [],
        areasForImprovement: latestFeedback.areasForImprovement || [],
        finalAssessment: latestFeedback.finalAssessment || ""
      }
    });

    return scores;
  } catch (error) {
    console.error("Error fetching skill progress:", error);
    return {
      communication: 0,
      technicalKnowledge: 0,
      problemSolving: 0,
      culturalFit: 0,
      confidenceAndClarity: 0,
      totalScore: 0
    };
  }
}
