import Image from "next/image";
import { redirect } from "next/navigation";

import Agent from "@/components/Agent";
import { getRandomInterviewCover } from "@/lib/utils";
import DeleteInterviewButton from "@/components/DeleteInterviewButton";

import {
  getFeedbackByInterviewId,
  getInterviewById,
} from "@/lib/actions/general.action";
import { getCurrentUser } from "@/lib/actions/auth.action";
import DisplayTechIcons from "@/components/DisplayTechIcons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { User } from "@/types";

interface RouteParams {
  params: {
    id: string;
  };
}

const InterviewDetails = async ({ params }: RouteParams) => {
  const { id } = params;

  const userData = await getCurrentUser();
  if (!userData) redirect("/");

  const interview = await getInterviewById(id);
  if (!interview) redirect("/");

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: userData.id,
  });

  const feedbackIdToPass = feedback?.id;

  const normalizedType = /mix/gi.test(interview.type) ? "Mixed" : interview.type;

  const badgeColor =
    {
      Behavioral: "bg-light-400",
      Mixed: "bg-light-600",
      Technical: "bg-light-800",
    }[normalizedType] || "bg-light-600";

  return (
    <div className="container max-w-6xl pt-0 pb-6 space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 -mt-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight capitalize">{interview.role} Interview</h1>
          <div className="flex items-center gap-4 text-muted-foreground text-sm">
            <div className="flex items-center gap-2">
              <Image
                src={getRandomInterviewCover()}
                alt="cover-image"
                width={20}
                height={20}
                className="rounded-full object-cover size-5"
              />
              <span>Interview Details</span>
            </div>
            <div className="flex items-center gap-2">
              <DisplayTechIcons techStack={interview.techstack} />
            </div>
             <span className={cn("px-2 py-1 rounded-md text-xs font-medium", badgeColor)}>{normalizedType}</span>
          </div>
        </div>
        {interview.userId === userData.id && (
          <DeleteInterviewButton interviewId={id} userId={userData.id} />
        )}
      </div>

      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10 p-8">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
        <div className="relative">
          <Agent
            userName={userData.name}
            userId={userData.id}
            interviewId={id}
            type="interview"
            questions={interview.questions}
            feedbackId={feedbackIdToPass}
          />
        </div>
      </div>
    </div>
  );
};

export default InterviewDetails;
