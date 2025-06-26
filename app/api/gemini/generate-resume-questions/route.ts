import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Set the endpoint in the environment variable if needed, otherwise use default
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function POST(req: Request) {
  try {
    const { resumeText } = await req.json();

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `You are an expert HR interviewer. Based on the following resume, generate 15-18 relevant interview questions that comprehensively cover the candidate's experience, skills, and background. Format the response as a JSON array of strings.

Resume:
${resumeText}

Generate a diverse set of questions that cover:
1. Technical Skills (4-5 questions)
   - Specific technologies mentioned
   - Technical problem-solving abilities
   - Technical decision-making

2. Work Experience (4-5 questions)
   - Past projects and achievements
   - Role-specific responsibilities
   - Team collaboration and leadership

3. Education & Background (2-3 questions)
   - Academic achievements
   - Relevant coursework
   - Learning journey

4. Soft Skills & Behavioral (3-4 questions)
   - Communication abilities
   - Problem-solving approach
   - Team dynamics
   - Leadership style

5. Career Goals & Motivation (2-3 questions)
   - Career progression
   - Professional development
   - Future aspirations

Requirements:
- Questions should be specific to the candidate's experience
- Mix of technical and behavioral questions
- Questions should be challenging but fair
- Each question should help assess a different aspect of the candidate's profile
- Questions should be clear and well-structured
- Avoid generic questions - make them specific to the resume content

Return only the JSON array of questions.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    let questions;
    try {
      const cleanedText = text.replace(/```json\s*|\s*```/g, '').trim();
      questions = JSON.parse(cleanedText);
      
      if (!Array.isArray(questions)) {
        throw new Error("Parsed response is not an array");
      }
    } catch (parseError) {
      const questionMatches = text.match(/\d+\.\s*([^?\n]+[?])/g);
      if (questionMatches) {
        questions = questionMatches.map(q => q.replace(/^\d+\.\s*/, '').trim());
      } else {
        questions = text.split('\n')
          .map(line => line.trim())
          .filter(line => line && line.endsWith('?'));
      }
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error("No valid questions were generated");
    }

    if (questions.length < 15) {
      const additionalPrompt = `Based on the same resume, generate ${15 - questions.length} more interview questions that are different from these existing questions: ${JSON.stringify(questions)}. Return only the JSON array of additional questions.`;
      
      const additionalResult = await model.generateContent(additionalPrompt);
      const additionalResponse = await additionalResult.response;
      const additionalText = additionalResponse.text();
      
      try {
        const cleanedAdditionalText = additionalText.replace(/```json\s*|\s*```/g, '').trim();
        const additionalQuestions = JSON.parse(cleanedAdditionalText);
        if (Array.isArray(additionalQuestions)) {
          questions = [...questions, ...additionalQuestions];
        }
      } catch (error) {
        throw new Error("Failed to parse additional questions");
      }
    }

    return NextResponse.json({ questions });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to generate questions", details: error?.message || "Unknown error" },
      { status: 500 }
    );
  }
} 