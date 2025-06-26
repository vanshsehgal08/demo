import { Metadata } from "next";
import Agent from "@/components/Agent";
import InterviewForm from "@/components/InterviewForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { User } from "../../../types";

export const metadata: Metadata = {
  title: "Create Interview | AI Mock Interviews",
  description: "Create and start your personalized AI mock interview",
};

export default async function InterviewPage() {
  const user = (await getCurrentUser()) as User | null;
  console.log("User object in InterviewPage:", user);
  console.log("User ID passed to Agent:", user?.id);

  return (
    <div className="container max-w-6xl pt-0 pb-0 space-y-4">
      <div className="flex items-center justify-between -mt-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Interview</h1>
          <p className="text-muted-foreground mt-2">
            Start your personalized AI mock interview experience
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">AI Powered</span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="ai" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="ai">AI Generated</TabsTrigger>
          <TabsTrigger value="custom">Custom Form</TabsTrigger>
        </TabsList>
        <TabsContent value="ai">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10 p-8">
            <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
            <div className="relative">
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg mb-6">
                <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                  Note: The AI-generated interview feature is currently disabled due to external API usage limits and associated costs.
                  Use Custom Form to create your own interview.
                </p>
              </div>
              <div className="opacity-50 pointer-events-none">
                <Agent userName={user?.name!} userId={user?.id} type="generate" />
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="custom">
          <InterviewForm userId={user?.id!} />
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Tips for Success</CardTitle>
            <CardDescription>Make the most of your interview experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">Be Specific</h4>
                <p className="text-sm text-muted-foreground">
                  Provide clear details about the role and skills you want to practice
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">Clear Audio</h4>
                <p className="text-sm text-muted-foreground">
                  Ensure you're in a quiet environment with good microphone quality
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">Camera Ready</h4>
                <p className="text-sm text-muted-foreground">
                  Position yourself in a well-lit area with a neutral background
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>What to Expect</CardTitle>
            <CardDescription>Your interview journey</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-medium">
                1
              </div>
              <div>
                <h4 className="font-medium">Role Selection</h4>
                <p className="text-sm text-muted-foreground">
                  Choose the position you want to practice for
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-medium">
                2
              </div>
              <div>
                <h4 className="font-medium">Skill Focus</h4>
                <p className="text-sm text-muted-foreground">
                  Specify the key skills you want to be tested on
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-medium">
                3
              </div>
              <div>
                <h4 className="font-medium">Interview Start</h4>
                <p className="text-sm text-muted-foreground">
                  Begin your personalized interview experience
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
