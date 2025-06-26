import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";
import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getInterviewsByUserId,
  getLatestInterviews,
  getFeedbackByInterviewId,
} from "@/lib/actions/general.action";
import { ServerAvatar, ServerAvatarFallback } from "@/components/ui/server-avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calendar, Star, User as UserIcon, PlusCircle, TrendingUp } from "lucide-react";
import { headers } from "next/headers";
import { db } from "@/firebase/admin";
import { cn } from "@/lib/utils";
import type { User } from "../../types";

function filterInterviews(interviews: any[], search: string) {
  if (!search) return interviews;
  const q = search.toLowerCase();
  return interviews.filter((interview: any) =>
    interview.role?.toLowerCase().includes(q) ||
    interview.type?.toLowerCase().includes(q) ||
    (Array.isArray(interview.techstack)
      ? interview.techstack.join(", ").toLowerCase().includes(q)
      : (interview.techstack || "").toLowerCase().includes(q))
  );
}

async function Home() {
  const headersList = await headers();
  const url = headersList.get("x-url") || "";
  const search = url ? new URL(url, "http://localhost").searchParams.get("search") || "" : "";
  const user = (await getCurrentUser()) as User | null;
  const [userInterviews, allInterview] = await Promise.all([
    getInterviewsByUserId(user?.id || ''),
    getLatestInterviews({ userId: user?.id || '' }),
  ]);

  // Fetch feedback for both user's interviews and available interviews
  const recentInterviewsWithFeedback = await Promise.all([
    // User's own interviews
    ...(userInterviews || []).slice(0, 5).map(async (interview) => {
      const feedback = await getFeedbackByInterviewId({
        interviewId: interview.id,
        userId: user?.id || '',
      });
      return { ...interview, feedback };
    }),
    // Available interviews
    ...(allInterview || []).slice(0, 5).map(async (interview) => {
      const feedback = await getFeedbackByInterviewId({
        interviewId: interview.id,
        userId: user?.id || '',
      });
      return { ...interview, feedback };
    })
  ]);

  // Sort by creation date and take the most recent 5
  const sortedRecentInterviews = recentInterviewsWithFeedback
    .filter(interview => interview.feedback) // Only include interviews with feedback
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const filteredUserInterviews = filterInterviews(userInterviews || [], search);
  const filteredAllInterview = filterInterviews(allInterview || [], search);
  const hasPastInterviews = filteredUserInterviews.length > 0;
  const hasUpcomingInterviews = filteredAllInterview.length > 0;
  // Stats
  const totalInterviews = userInterviews?.length || 0;
  // Fetch all feedback for the user and calculate average score
  let avgScore = 0;
  if (user?.id) {
    const userIdString = user.id; // Ensure userId is a string
    const feedbackSnapshot = await db
      .collection("feedback")
      .where("userId", "==", userIdString)
      .get();
    const feedbacks = feedbackSnapshot.docs.map(doc => doc.data());
    if (feedbacks.length > 0) {
      avgScore = Math.round(
        feedbacks.reduce((acc, f) => acc + (f.totalScore || 0), 0) / feedbacks.length
      );
    }
  }
  const lastInterview = userInterviews && userInterviews.length > 0
    ? userInterviews[0]
    : null;

  return (
    <div className="-mt-15 container mx-auto py-4 md:py-6 space-y-6 md:space-y-10 px-4 md:px-6">
      {/* Hero Section */}
      <section className="relative flex flex-col md:flex-row items-center justify-between bg-white/60 dark:bg-background/60 backdrop-blur-lg rounded-2xl md:rounded-3xl shadow-xl p-4 md:p-8 mb-4 md:mb-8 overflow-hidden">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 w-full md:w-auto">
          <ServerAvatar className="h-16 w-16 md:h-20 md:w-20 border-4 border-background" fallback={user?.name?.[0] || "U"}>
            <ServerAvatarFallback className="text-2xl md:text-3xl">{user?.name?.[0] || "U"}</ServerAvatarFallback>
          </ServerAvatar>
          <div className="text-center md:text-left">
            <h1 className="text-2xl md:text-4xl font-extrabold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent drop-shadow-sm">
              Welcome back, {user?.name?.split(" ")[0] || "User"}!
            </h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-md">
              Ready to ace your next interview? Practice, track your progress, and get instant feedback.
            </p>
            <Button asChild className="mt-4 btn-primary w-full md:w-auto">
              <Link href="/interview">
                <PlusCircle className="w-4 h-4 mr-2" /> Create Interview
              </Link>
            </Button>
          </div>
        </div>
        <Image
          src="/interview.png"
          alt="Interview Illustration"
          width={180}
          height={180}
          className="hidden md:block absolute right-8 bottom-0 drop-shadow-xl opacity-80"
        />
      </section>

      {/* Stats Overview */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-8">
        <div className="rounded-xl md:rounded-2xl bg-white/70 dark:bg-background/70 backdrop-blur-lg shadow p-4 md:p-6 flex items-center gap-3 md:gap-4">
          <UserIcon className="w-6 h-6 md:w-8 md:h-8 text-primary" />
          <div>
            <div className="text-xl md:text-2xl font-bold">{totalInterviews}</div>
            <div className="text-xs md:text-sm text-muted-foreground">Created Interviews</div>
          </div>
        </div>
        <div className="rounded-xl md:rounded-2xl bg-white/70 dark:bg-background/70 backdrop-blur-lg shadow p-4 md:p-6 flex items-center gap-3 md:gap-4">
          <Star className="w-6 h-6 md:w-8 md:h-8 text-yellow-500" />
          <div>
            <div className="text-xl md:text-2xl font-bold">{avgScore}%</div>
            <div className="text-xs md:text-sm text-muted-foreground">Average Score</div>
          </div>
        </div>
        <div className="rounded-xl md:rounded-2xl bg-white/70 dark:bg-background/70 backdrop-blur-lg shadow p-4 md:p-6 flex items-center gap-3 md:gap-4">
          <Calendar className="w-6 h-6 md:w-8 md:h-8 text-blue-500" />
          <div>
            <div className="text-xl md:text-2xl font-bold">{lastInterview ? new Date(lastInterview.createdAt).toLocaleDateString() : "-"}</div>
            <div className="text-xs md:text-sm text-muted-foreground">Last Interview</div>
          </div>
        </div>
      </section>

      {/* Interview Tabs */}
      <section id="interview-tabs" className="bg-white/60 dark:bg-background/60 backdrop-blur-lg rounded-xl md:rounded-2xl shadow-xl p-4 md:p-6">
        <Tabs defaultValue={hasPastInterviews ? "your" : "available"} className="w-full">
          <TabsList className="mb-4 md:mb-6 bg-background/80 rounded-lg md:rounded-xl p-1 flex gap-2">
            <TabsTrigger value="your" className="flex-1 cursor-pointer text-sm md:text-base">Your Interviews</TabsTrigger>
            <TabsTrigger value="available" className="flex-1 cursor-pointer text-sm md:text-base">Available Interviews</TabsTrigger>
          </TabsList>
          <TabsContent value="your">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {hasPastInterviews ? (
                filteredUserInterviews.map((interview) => (
                  <InterviewCard
                    key={interview.id}
                    userId={user?.id || ''}
                    interviewId={interview.id}
                    role={interview.role}
                    type={interview.type}
                    techstack={interview.techstack}
                    createdAt={interview.createdAt}
                  />
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-8 md:py-12">
                  <Image src="/error-state.png" alt="No interviews" width={100} height={100} className="mb-4 opacity-70" />
                  <p className="text-muted-foreground text-base md:text-lg">You haven't taken any interviews yet</p>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="available">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {hasUpcomingInterviews ? (
                filteredAllInterview.map((interview) => (
                  <InterviewCard
                    key={interview.id}
                    userId={user?.id || ''}
                    interviewId={interview.id}
                    role={interview.role}
                    type={interview.type}
                    techstack={interview.techstack}
                    createdAt={interview.createdAt}
                  />
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-8 md:py-12">
                  <Image src="/error-state.png" alt="No interviews" width={100} height={100} className="mb-4 opacity-70" />
                  <p className="text-muted-foreground text-base md:text-lg">There are no interviews available</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Recent Activity/Feedback */}
      <section className="bg-white/60 dark:bg-background/60 backdrop-blur-lg rounded-xl md:rounded-2xl shadow-xl p-4 md:p-6 mt-16 md:mt-32">
        <h2 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-primary" /> Recent Activity & Feedback
        </h2>
        <div className="flex flex-col gap-3 md:gap-4">
          {sortedRecentInterviews && sortedRecentInterviews.length > 0 ? (
            sortedRecentInterviews.map((interviewWithFeedback: any) => (
              <div key={interviewWithFeedback.id} className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4 p-3 md:p-4 rounded-lg md:rounded-xl bg-background/80 shadow-sm">
                <ServerAvatar className="h-8 w-8 md:h-10 md:w-10" fallback={user?.name?.[0] || "U"}>
                  <ServerAvatarFallback className="text-sm md:text-lg">{user?.name?.[0] || "U"}</ServerAvatarFallback>
                </ServerAvatar>
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
                    <span className="font-semibold capitalize text-sm md:text-base">{interviewWithFeedback.role}</span>
                    <span className="text-xs text-muted-foreground">{new Date(interviewWithFeedback.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span className={cn("inline-block px-2 py-0.5 rounded text-xs font-medium", interviewWithFeedback.feedback?.totalScore > 0 ? "bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200" : "bg-muted text-muted-foreground")}>Score: {interviewWithFeedback.feedback?.totalScore || "-"}%</span>
                    {interviewWithFeedback.feedback?.strengths?.slice(0, 2).map((s: string, i: number) => (
                      <span key={i} className="inline-block px-2 py-0.5 rounded bg-green-50 dark:bg-green-700 text-green-700 dark:text-green-300 text-xs font-medium">{s}</span>
                    ))}
                    {interviewWithFeedback.feedback?.areasForImprovement?.slice(0, 1).map((a: string, i: number) => (
                      <span key={i} className="inline-block px-2 py-0.5 rounded bg-red-50 dark:bg-red-700 text-red-700 dark:text-red-300 text-xs font-medium">{a}</span>
                    ))}
                  </div>
                </div>
                <Button asChild variant="outline" size="sm" className="w-full md:w-auto">
                  <Link href={`/interview/${interviewWithFeedback.id}/feedback`}>View</Link>
                </Button>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-6 md:py-8">
              <Image src="/error-state.png" alt="No activity" width={80} height={80} className="mb-2 opacity-70" />
              <p className="text-muted-foreground text-sm md:text-base">No recent activity yet</p>
            </div>
          )}
        </div>
      </section>

      {/* Floating Action Button (FAB) for Create Interview */}
      <Button
        asChild
        className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 rounded-full shadow-lg bg-black text-white hover:bg-black/90 border border-black p-0 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center text-2xl md:text-3xl transition-all duration-200"
        style={{ boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)" }}
      >
        <Link href="/interview">
          <PlusCircle className="w-6 h-6 md:w-8 md:h-8 text-white" />
        </Link>
      </Button>
    </div>
  );
}

export default Home;
