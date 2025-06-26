import { Metadata } from "next";
import ResumeUploader from "@/components/ResumeUploader";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { Sparkles, Lightbulb, Target, Clock, Users, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Resume-Based Interview | AI Mock Interviews",
  description: "Upload your resume and get personalized interview questions",
};

export default async function ResumeQAPage() {
  const user = await getCurrentUser();

  return (
    <div className="container max-w-6xl pt-0 pb-0 space-y-8">
      <div className="flex items-center justify-between -mt-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Resume-Based Interview</h1>
          <p className="text-muted-foreground mt-2">
            Upload your resume to get personalized interview questions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">AI Powered</span>
          </div>
        </div>
      </div>

      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10 p-8">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
        <div className="relative">
          <ResumeUploader userId={user?.id!} />
        </div>
      </div>

      {/* Tips and Tricks Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-white/60 dark:bg-background/60 backdrop-blur-lg shadow-xl">
          <CardHeader className="flex flex-row items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <CardTitle className="text-xl font-semibold">Preparation Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Review your resume thoroughly before the interview</li>
              <li>Prepare specific examples for each achievement</li>
              <li>Practice explaining technical concepts clearly</li>
              <li>Research the company and role requirements</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-white/60 dark:bg-background/60 backdrop-blur-lg shadow-xl">
          <CardHeader className="flex flex-row items-center gap-2">
            <Target className="w-5 h-5 text-blue-500" />
            <CardTitle className="text-xl font-semibold">Answer Strategy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Use the STAR method for behavioral questions</li>
              <li>Quantify your achievements with metrics</li>
              <li>Connect your experience to the role requirements</li>
              <li>Be honest about areas you're still learning</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-white/60 dark:bg-background/60 backdrop-blur-lg shadow-xl">
          <CardHeader className="flex flex-row items-center gap-2">
            <Clock className="w-5 h-5 text-green-500" />
            <CardTitle className="text-xl font-semibold">Time Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Keep answers concise and focused</li>
              <li>Allocate 2-3 minutes per question</li>
              <li>Practice timing your responses</li>
              <li>Leave room for follow-up questions</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-white/60 dark:bg-background/60 backdrop-blur-lg shadow-xl">
          <CardHeader className="flex flex-row items-center gap-2">
            <Users className="w-5 h-5 text-purple-500" />
            <CardTitle className="text-xl font-semibold">Communication</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Maintain professional body language</li>
              <li>Listen carefully to questions</li>
              <li>Ask for clarification when needed</li>
              <li>Show enthusiasm and engagement</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-white/60 dark:bg-background/60 backdrop-blur-lg shadow-xl">
          <CardHeader className="flex flex-row items-center gap-2">
            <Award className="w-5 h-5 text-orange-500" />
            <CardTitle className="text-xl font-semibold">Technical Excellence</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Explain your technical decisions</li>
              <li>Discuss problem-solving approaches</li>
              <li>Share learning experiences</li>
              <li>Highlight technical achievements</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="bg-white/60 dark:bg-background/60 backdrop-blur-lg shadow-xl">
          <CardHeader className="flex flex-row items-center gap-2">
            <Sparkles className="w-5 h-5 text-pink-500" />
            <CardTitle className="text-xl font-semibold">Unique Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Create a personal "brag book" of achievements</li>
              <li>Record and review your practice sessions</li>
              <li>Prepare questions for the interviewer</li>
              <li>Research industry trends and challenges</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 