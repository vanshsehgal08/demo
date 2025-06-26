import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";

import {
  getFeedbackByInterviewId,
  getInterviewById,
} from "@/lib/actions/general.action";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, Calendar, Lightbulb, Sparkles } from "lucide-react";

const Feedback = async ({ params }: RouteParams) => {
  const { id } = await params;
  const user = await getCurrentUser();

  const interview = await getInterviewById(id);
  if (!interview) redirect("/");

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user?.id!,
  });

  if (!feedback) {
    return <div className="container max-w-4xl mx-auto py-12 text-center text-muted-foreground">Feedback not found for this interview.</div>
  }

  return (
    <div className="container max-w-6xl pt-0 pb-6 space-y-4">
      <div className="flex flex-col items-center justify-center text-center space-y-2 mb-8 -mt-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight capitalize">Feedback for {interview.role} Interview</h1>
        <p className="text-muted-foreground text-lg">Detailed analysis and scores from your mock interview.</p>
      </div>

      <Card className="bg-white/60 dark:bg-background/60 backdrop-blur-lg shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl font-semibold">Overall Summary</CardTitle>
          <Star className="w-6 h-6 text-yellow-500" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary">{feedback.totalScore || "---"}</span>
              <span className="text-muted-foreground">/ 100</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Calendar className="w-4 h-4" />
              <span>
                {feedback.createdAt
                  ? dayjs(feedback.createdAt).format("MMM D, YYYY h:mm A")
                  : "N/A"}
              </span>
            </div>
          </div>
          <CardDescription>{feedback.finalAssessment}</CardDescription>
        </CardContent>
      </Card>

      <Card className="bg-white/60 dark:bg-background/60 backdrop-blur-lg shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Category Breakdown</CardTitle>
          <CardDescription>Scores and comments for each skill category.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {feedback.categoryScores?.map((category, index) => (
              <div key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
                <p className="font-semibold flex items-center gap-2">
                  <span className="w-5 h-5 flex items-center justify-center bg-primary/10 text-primary rounded-full text-xs font-medium">{index + 1}</span>
                  {category.name} - {category.score}/100
                </p>
                <p className="text-muted-foreground text-sm mt-1">{category.comment}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white/60 dark:bg-background/60 backdrop-blur-lg shadow-xl">
          <CardHeader className="flex flex-row items-center gap-2">
            <Lightbulb className="w-5 h-5 text-green-500" />
            <CardTitle className="text-xl font-semibold">Strengths</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              {feedback.strengths?.map((strength, index) => (
                <li key={index}>{strength}</li>
              ))}
            </ul>
            {(!feedback.strengths || feedback.strengths.length === 0) && <p className="text-muted-foreground">No strengths identified.</p>}
          </CardContent>
        </Card>

        <Card className="bg-white/60 dark:bg-background/60 backdrop-blur-lg shadow-xl">
          <CardHeader className="flex flex-row items-center gap-2">
            <Sparkles className="w-5 h-5 text-red-500" />
            <CardTitle className="text-xl font-semibold">Areas for Improvement</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              {feedback.areasForImprovement?.map((area, index) => (
                <li key={index}>{area}</li>
              ))}
            </ul>
            {(!feedback.areasForImprovement || feedback.areasForImprovement.length === 0) && <p className="text-muted-foreground">No areas for improvement identified.</p>}
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
        <Button asChild variant="outline" className="px-8 py-3 text-base">
          <Link href="/">Back to dashboard</Link>
        </Button>

        <Button asChild className="px-8 py-3 text-base btn-primary">
          <Link href={`/interview/${id}`}>Retake Interview</Link>
        </Button>
      </div>
    </div>
  );
};

export default Feedback;
