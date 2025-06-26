import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

export async function POST(request: Request) {
  try {
    const { role, type, level, techstack, duration, numQuestions, jobDescription, resumeContent } = await request.json();

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    let finalNumQuestions: number;
    if (numQuestions) {
      finalNumQuestions = parseInt(numQuestions as string);
    } else if (duration) {
      finalNumQuestions = Math.ceil(duration / 5);
    } else {
      finalNumQuestions = 5; // Default to 5 questions if neither is provided
    }

    let prompt = `Generate ${finalNumQuestions} interview questions for a ${level} ${role} position. 
    The interview type is ${type} and should focus on the following technologies: ${techstack.join(", ")}.
    
    `;

    if (jobDescription) {
      prompt += `The following job description is provided to tailor the questions: ${jobDescription}\n\n`;
    }

    // Placeholder for resume content integration
    if (resumeContent) {
      prompt += `The candidate's resume content is provided to tailor the questions: ${resumeContent}\n\n`;
    }

    prompt += `Requirements:
    1. Questions should be appropriate for the ${level} level
    2. For technical questions, focus on ${techstack.join(", ")}
    3. For behavioral questions, focus on relevant soft skills
    4. For mixed questions, include both technical and behavioral aspects
    5. Questions should be clear and specific
    6. Each question should be on a new line
    7. Do not include any explanations or additional text, just the questions

    Format the response as a simple list of questions, one per line.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const questions = response.text().split("\n").filter((q: string) => q.trim());

    return NextResponse.json({ questions });
  } catch (error) {
    console.error("Error generating questions:", error);
    return NextResponse.json(
      { error: "Failed to generate questions" },
      { status: 500 }
    );
  }
} 