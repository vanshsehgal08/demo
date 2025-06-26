"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { createInterview } from "@/lib/actions/general.action";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const InterviewForm = ({ userId }: { userId: string }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [questionInputType, setQuestionInputType] = useState("duration"); // 'duration' or 'numQuestions'
  const [formData, setFormData] = useState({
    role: "",
    type: "Technical",
    level: "Junior",
    techstack: "",
    duration: "30", // in minutes
    numQuestions: "5",
    jobDescription: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload: any = {
        role: formData.role,
        type: formData.type,
        level: formData.level,
        techstack: formData.techstack.split(",").map((tech) => tech.trim()),
        jobDescription: formData.jobDescription,
      };

      if (questionInputType === "duration") {
        payload.duration = parseInt(formData.duration);
      } else {
        payload.numQuestions = parseInt(formData.numQuestions);
      }

      const response = await fetch("/api/gemini/generate-questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const { questions } = await response.json();

      const interview = {
        role: formData.role,
        type: formData.type,
        level: formData.level,
        techstack: formData.techstack.split(",").map((tech) => tech.trim()),
        questions,
        userId,
        finalized: true,
        createdAt: new Date().toISOString(),
      };

      const { success, interviewId } = await createInterview(interview);

      if (success && interviewId) {
        router.push(`/interview/${interviewId}`);
      }
    } catch (error) {
      console.error("Error creating interview:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create Custom Interview</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input
              id="role"
              placeholder="e.g., Frontend Developer, Data Scientist, Product Manager"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Interview Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) =>
                setFormData({ ...formData, type: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select interview type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Technical">Technical</SelectItem>
                <SelectItem value="Behavioral">Behavioral</SelectItem>
                <SelectItem value="Mixed">Mixed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="level">Experience Level</Label>
            <Select
              value={formData.level}
              onValueChange={(value) =>
                setFormData({ ...formData, level: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select experience level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Junior">Junior</SelectItem>
                <SelectItem value="Mid-level">Mid-level</SelectItem>
                <SelectItem value="Senior">Senior</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="techstack">Tech Stack (comma-separated)</Label>
            <Input
              id="techstack"
              placeholder="e.g., React, TypeScript, Node.js"
              value={formData.techstack}
              onChange={(e) =>
                setFormData({ ...formData, techstack: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="questionInputType">Question Input Type</Label>
            <Tabs defaultValue="duration" onValueChange={setQuestionInputType} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="duration">Duration</TabsTrigger>
                <TabsTrigger value="numQuestions">Number of Questions</TabsTrigger>
              </TabsList>
              <TabsContent value="duration">
                <Label htmlFor="duration">Interview Duration (minutes)</Label>
                <Select
                  value={formData.duration}
                  onValueChange={(value) =>
                    setFormData({ ...formData, duration: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </TabsContent>
              <TabsContent value="numQuestions">
                <Label htmlFor="numQuestions">Number of Questions</Label>
                <Input
                  id="numQuestions"
                  type="number"
                  placeholder="e.g., 10"
                  value={formData.numQuestions}
                  onChange={(e) =>
                    setFormData({ ...formData, numQuestions: e.target.value })
                  }
                  min="1"
                  required
                />
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobDescription">Job Description (Optional)</Label>
            <Textarea
              id="jobDescription"
              placeholder="Paste the job description here..."
              value={formData.jobDescription}
              onChange={(e) =>
                setFormData({ ...formData, jobDescription: e.target.value })
              }
              rows={5}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Interview"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default InterviewForm; 