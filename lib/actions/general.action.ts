"use server";

import { generateObject } from "ai";
import { google } from "@ai-sdk/google";

import { db } from "@/firebase/admin";
import { feedbackSchema } from "@/constants";
import { QueryDocumentSnapshot, QuerySnapshot, CollectionReference, Query } from "firebase-admin/firestore";
import { Interview, CreateFeedbackParams, Feedback, GetFeedbackByInterviewIdParams, GetLatestInterviewsParams } from "@/types";

const interviewConverter = {
  toFirestore: (interview: Interview) => interview,
  fromFirestore: (snapshot: QueryDocumentSnapshot) =>
    ({
      id: snapshot.id,
      ...snapshot.data(),
    } as Interview),
};

export async function createFeedback(params: CreateFeedbackParams) {
  const { interviewId, userId, transcript, feedbackId } = params;

  try {
    const formattedTranscript = transcript
      .map(
        (sentence: { role: string; content: string }) =>
          `- ${sentence.role}: ${sentence.content}\n`
      )
      .join("");

    const { object } = await generateObject({
      model: google("gemini-2.0-flash-001", {
        structuredOutputs: false,
      }),
      schema: feedbackSchema,
      prompt: `
        You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don\'t be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
        Transcript:
        ${formattedTranscript}

        Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
        - **Communication Skills**: Clarity, articulation, structured responses.
        - **Technical Knowledge**: Understanding of key concepts for the role.
        - **Problem-Solving**: Ability to analyze problems and propose solutions.
        - **Cultural & Role Fit**: Alignment with company values and job role.
        - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.
        `,
      system:
        "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories",
    });

    const feedback = {
      interviewId: interviewId,
      userId: userId,
      totalScore: object.totalScore,
      categoryScores: object.categoryScores,
      strengths: object.strengths,
      areasForImprovement: object.areasForImprovement,
      finalAssessment: object.finalAssessment,
      createdAt: new Date().toISOString(),
    };

    let feedbackRef;

    if (feedbackId) {
      feedbackRef = db.collection("feedback").doc(feedbackId);
    } else {
      feedbackRef = db.collection("feedback").doc();
    }

    await feedbackRef.set(feedback);

    return { success: true, feedbackId: feedbackRef.id };
  } catch (error) {
    console.error("Error saving feedback:", error);
    return { success: false };
  }
}

export async function getInterviewById(id: string): Promise<Interview | null> {
  const interview = await db.collection("interviews").doc(id).get();

  return interview.data() as Interview | null;
}

export async function getFeedbackByInterviewId(
  params: GetFeedbackByInterviewIdParams
): Promise<Feedback | null> {
  const { interviewId, userId } = params;

  const querySnapshot = await db
    .collection("feedback")
    .where("interviewId", "==", interviewId)
    .where("userId", "==", userId)
    .limit(1)
    .get();

  if (querySnapshot.empty) return null;

  const feedbackDoc = querySnapshot.docs[0];
  return { id: feedbackDoc.id, ...feedbackDoc.data() } as Feedback;
}

export async function getLatestInterviews(
  params: GetLatestInterviewsParams
): Promise<Interview[] | null> {
  const { userId, limit = 20 } = params;

  // Get all interviews except user's own
  const interviews = await db
    .collection("interviews")
    .withConverter(interviewConverter)
    .orderBy("createdAt", "desc")
    .where("finalized", "==", true)
    .limit(limit * 2) // Get more to account for filtering
    .get();

  // Filter interviews based on type and userId
  const filteredInterviews = interviews.docs
    .map(doc => doc.data())
    .filter(interview => {
      // Never show resume interviews in available interviews
      if (interview.type === "resume") {
        return false;
      }
      // For non-resume interviews, show to everyone except the owner
      return interview.userId !== userId;
    })
    .slice(0, limit);

  return filteredInterviews;
}

export async function getInterviewsByUserId(
  userId: string
): Promise<Interview[] | null> {
  // Get all interviews for this user
  const interviews = await db
    .collection("interviews")
    .withConverter(interviewConverter)
    .where("userId", "==", userId)
    .orderBy("createdAt", "desc")
    .get();

  return interviews.docs.map(doc => doc.data());
}

export const createInterview = async (interview: Omit<Interview, "id">) => {
  try {
    // Validate required fields
    if (!interview.questions || !Array.isArray(interview.questions)) {
      throw new Error("Interview questions must be an array");
    }

    if (interview.questions.length === 0) {
      throw new Error("Interview must have at least one question");
    }

    if (!interview.userId) {
      throw new Error("Interview must have a userId");
    }

    // Validate each question
    interview.questions.forEach((question, index) => {
      if (typeof question !== 'string' || !question.trim()) {
        throw new Error(`Invalid question at index ${index}`);
      }
    });

    const docRef = await db.collection("interviews").add(interview);
    return { success: true, interviewId: docRef.id };
  } catch (error: any) {
    return { 
      success: false, 
      error: error.message || "Failed to create interview" 
    };
  }
};

export const deleteInterview = async (interviewId: string, userId: string) => {
  try {
    // First verify that the interview belongs to the user
    const interview = await db.collection("interviews").doc(interviewId).get();
    
    if (!interview.exists) {
      return { success: false, error: "Interview not found" };
    }

    const interviewData = interview.data();
    if (interviewData?.userId !== userId) {
      return { success: false, error: "Unauthorized to delete this interview" };
    }

    // Delete the interview
    await db.collection("interviews").doc(interviewId).delete();

    // Also delete any associated feedback
    const feedbackSnapshot = await db
      .collection("feedback")
      .where("interviewId", "==", interviewId)
      .get();

    const deletePromises = feedbackSnapshot.docs.map(doc => doc.ref.delete());
    await Promise.all(deletePromises);

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting interview:", error);
    return { 
      success: false, 
      error: error.message || "Failed to delete interview" 
    };
  }
};