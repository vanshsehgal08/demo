import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { Trash2 } from "lucide-react";

import { Button } from "./ui/button";
import DisplayTechIcons from "./DisplayTechIcons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import DeleteInterviewButton from "./DeleteInterviewButton";

import { cn, getRandomInterviewCover } from "@/lib/utils";
import { getFeedbackByInterviewId } from "@/lib/actions/general.action";

interface InterviewCardProps {
  interviewId?: string;
  userId?: string;
  role: string;
  type: string;
  techstack: string[];
  createdAt?: string;
}

const InterviewCard = async ({
  interviewId,
  userId,
  role,
  type,
  techstack,
  createdAt,
}: InterviewCardProps) => {
  const feedback =
    userId && interviewId
      ? await getFeedbackByInterviewId({
          interviewId,
          userId,
        })
      : null;

  const normalizedType = /mix/gi.test(type) ? "Mixed" : type;

  const badgeColor =
    {
      Behavioral: "bg-light-400",
      Mixed: "bg-light-600",
      Technical: "bg-light-800",
    }[normalizedType as keyof typeof badgeColor] || "bg-light-600";

  const formattedDate = dayjs(
    feedback?.createdAt || createdAt || Date.now()
  ).format("MMM D, YYYY");

  return (
    <div
      className="
        relative
        group
        rounded-xl
        shadow-lg
        overflow-hidden
        transition-all duration-300 ease-in-out
        hover:shadow-xl
        hover:-translate-y-1
        border border-gray-700/70
        dark:border-zinc-800/70
        hover:border-primary/80
        dark:hover:border-primary-foreground/80
        w-full max-w-sm mx-auto md:max-w-none
      "
    >
      <div
        className="
          relative
          dark-gradient
          rounded-xl
          min-h-[400px]
          flex flex-col
          p-6
          gap-8
          justify-between
          transition-all duration-300
          group-hover:scale-[1.01]
        "
      >
        {/* Type Badge */}
        <div
          className={cn(
            "absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide",
            badgeColor,
            "shadow-md"
          )}
        >
          <p className="badge-text ">{normalizedType}</p>
        </div>

        {/* Delete Button - only show if user owns interview */}
        {userId && interviewId && (
          <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <DeleteInterviewButton interviewId={interviewId} userId={userId} />
          </div>
        )}

        {/* Cover Image */}
        <div className="flex flex-col items-center justify-start pt-4 flex-grow">
          <Image
            src={getRandomInterviewCover()}
            alt="cover-image"
            width={140}
            height={140}
            className="
              rounded-full
              object-cover
              size-28 md:size-32
              shadow-lg
              border-4 border-primary/60
              transition-all duration-300
              group-hover:scale-105
              group-hover:shadow-xl
            "
          />

          {/* Text content container with fixed height and overflow hidden */}
          <div className="flex flex-col items-center text-center h-[200px] overflow-hidden">
            {/* Interview Role */}
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <h3 className="mt-4 text-xl md:text-2xl font-bold capitalize leading-tight line-clamp-2">
                    {role} Interview
                  </h3>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-black">{role} Interview</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Date & Score */}
            <div className="flex flex-row gap-6 mt-3 items-center text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Image
                  src="/calendar.svg"
                  width={18}
                  height={18}
                  alt="calendar"
                  className="opacity-70"
                />
                <p>{formattedDate}</p>
              </div>

              <div className="flex items-center gap-2">
                <Image src="/star.svg" width={18} height={18} alt="star" className="opacity-70" />
                <p className="font-semibold text-primary">{feedback?.totalScore || "---"}/100</p>
              </div>
            </div>

            {/* Feedback or Placeholder Text */}
            <p className="line-clamp-3 text-sm text-muted-foreground mt-4">
              {feedback?.finalAssessment ||
                "You haven't taken this interview yet. Take it now to improve your skills."}
            </p>
          </div>

        </div>

        {/* Footer section: Tech Icons & Button */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-gray-700/50 dark:border-zinc-800/50">
          <DisplayTechIcons techStack={techstack} />

          <Button className="btn-primary w-full sm:w-auto transform transition-transform duration-300 group-hover:scale-105">
            <Link
              href={
                feedback
                  ? `/interview/${interviewId}/feedback`
                  : `/interview/${interviewId}`
              }
            >
              {feedback ? "Check Feedback" : "View Interview"}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InterviewCard;