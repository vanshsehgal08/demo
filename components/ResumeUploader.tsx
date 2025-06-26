"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { createInterview } from "@/lib/actions/general.action";
import { FileUp, Loader2 } from "lucide-react";

interface ResumeUploaderProps {
  userId: string;
}

const ResumeUploader = ({ userId }: ResumeUploaderProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [pdfText, setPdfText] = useState("");
  const [pdfjsLib, setPdfjsLib] = useState<any>(null);

  useEffect(() => {
    // Dynamically import PDF.js only on the client side
    const loadPdfJs = async () => {
      const pdfjs = await import('pdfjs-dist');
      // Use the local worker file
      pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
      setPdfjsLib(pdfjs);
    };
    loadPdfJs();
  }, []);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !pdfjsLib) return;

    setIsLoading(true);
    const reader = new FileReader();

    reader.onload = async function () {
      try {
        const typedArray = new Uint8Array(reader.result as ArrayBuffer);
        const pdf = await pdfjsLib.getDocument(typedArray).promise;

        let textContent = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const strings = content.items.map((item: any) => item.str);
          textContent += strings.join(" ") + "\n";
        }

        setPdfText(textContent);
        await generateQuestions(textContent);
      } catch (error) {
        console.error("Error processing PDF:", error);
      } finally {
        setIsLoading(false);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const generateQuestions = async (resumeText: string) => {
    try {
      console.log("Sending resume text to generate questions...");
      const response = await fetch("/api/gemini/generate-resume-questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resumeText }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API error: ${errorData.error || response.statusText}`);
      }

      const data = await response.json();
      console.log("Received questions from API:", data);

      // Validate questions array
      if (!data.questions || !Array.isArray(data.questions)) {
        throw new Error("Invalid questions data received from API");
      }

      if (data.questions.length < 15) {
        console.warn(`Warning: Received only ${data.questions.length} questions, expected 15-18`);
      }

      // Log each question for debugging
      data.questions.forEach((q: string, index: number) => {
        console.log(`Question ${index + 1}:`, q);
      });

      const interview = {
        role: "Resume-Based Interview",
        type: "resume",
        level: "Custom",
        techstack: ["Resume Analysis"],
        questions: data.questions,
        userId,
        finalized: true,
        createdAt: new Date().toISOString(),
      };

      console.log("🔍 Creating interview with data:", {
        ...interview,
        questionsCount: interview.questions.length,
        firstQuestion: interview.questions[0],
        lastQuestion: interview.questions[interview.questions.length - 1],
        type: interview.type
      });

      const { success, interviewId, error } = await createInterview(interview);

      if (!success) {
        console.error("❌ Failed to create interview:", error);
        throw new Error(`Failed to create interview: ${error}`);
      }

      if (interviewId) {
        console.log("✅ Interview created successfully with ID:", interviewId);
        router.push(`/interview/${interviewId}`);
      } else {
        console.error("❌ No interview ID returned from createInterview");
        throw new Error("No interview ID returned from createInterview");
      }
    } catch (error) {
      console.error("❌ Error in generateQuestions:", error);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Resume-Based Interview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col items-center justify-center w-full">
            <label
              htmlFor="resume-upload"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {isLoading ? (
                  <Loader2 className="w-8 h-8 mb-4 text-gray-500 animate-spin" />
                ) : (
                  <FileUp className="w-8 h-8 mb-4 text-gray-500" />
                )}
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">PDF (MAX. 10MB)</p>
              </div>
              <input
                id="resume-upload"
                type="file"
                className="hidden"
                accept=".pdf"
                onChange={handleFile}
                disabled={isLoading}
              />
            </label>
          </div>
          {isLoading && (
            <div className="text-center text-sm text-gray-500">
              Processing your resume...
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ResumeUploader; 