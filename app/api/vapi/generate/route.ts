import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { NextRequest } from 'next/server';

import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";

export async function POST(request: NextRequest) {
  console.log("=== Vapi Generate API Route Started ===");
  let type, role, level, techstack, amount, userid;

  try {
    console.log("Attempting to parse request body...");
    const body = await request.json();
    console.log("Raw request body:", body);
    
    ({ type, role, level, techstack, amount, userid } = body);
    console.log("Extracted values:", {
      type,
      role,
      level,
      techstack,
      amount,
      userid
    });

    // Validate required fields
    if (!userid) {
      console.error("❌ Missing userid in request");
      return new Response(JSON.stringify({ success: false, error: "User ID is required" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    console.log("✅ User ID validation passed");

  } catch (error) {
    console.error("❌ Error parsing JSON from Vapi request:", error);
    return new Response(JSON.stringify({ success: false, error: "Invalid JSON format received" }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    console.log("Generating interview questions...");
    const { text: questions } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `You are a highly specialized AI designed to generate interview questions. Your ONLY task is to output a JSON array of strings, where each string is a single interview question. Do NOT include any other text, preambles, explanations, or conversational filler outside the JSON array.

        Generate questions for a job interview based on the following criteria:
        - Job Role: ${role}
        - Experience Level: ${level}
        - Tech Stack: ${techstack}
        - Interview Type Focus (Behavioral/Technical/Mixed): ${type}
        - Number of Questions: ${amount}

        Ensure each question is clearly phrased. Do NOT use special characters like \"/\" or \"*\" that might interfere with voice assistants.

        Output format MUST be a JSON array of strings, like this example:
        [\"Question 1: Describe your experience with X.\", \"Question 2: How do you handle Y situations?\"]
        `,
    });
    console.log("Raw AI response:", questions);

    let parsedQuestions: string[] = [];
    const jsonString = questions.replace(/^```json\s*|\s*```$/g, '').trim();
    console.log("Cleaned JSON string:", jsonString);

    try {
      parsedQuestions = JSON.parse(jsonString);
      if (!Array.isArray(parsedQuestions)) {
        throw new Error("Parsed questions is not an array.");
      }
      console.log("✅ Successfully parsed questions:", parsedQuestions);
    } catch (parseError) {
      console.error("❌ Error parsing questions JSON from AI:", parseError);
      console.error("Raw AI questions response:", questions);
      return new Response(JSON.stringify({ success: false, error: "Failed to parse AI generated questions" }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    console.log("Creating interview document...");
    const interview = {
      role: role,
      type: type,
      level: level,
      techstack: techstack.split(","),
      questions: parsedQuestions,
      userId: userid,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };
    console.log("Interview object to be saved:", interview);

    await db.collection("interviews").add(interview);
    console.log("✅ Interview successfully saved to database");

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("❌ Unexpected error in generate API:", error);
    return new Response(JSON.stringify({ success: false, error: error }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function GET() {
  return Response.json({ success: true, data: "Thank you!" }, { status: 200 });
}
