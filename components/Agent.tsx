"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mic } from "lucide-react";

import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import { interviewer } from "@/constants";
import { createFeedback } from "@/lib/actions/general.action";
import { AgentProps, SavedMessage } from "@/types";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

const Agent = ({
  userName,
  userId,
  interviewId,
  feedbackId,
  type,
  questions,
}: AgentProps) => {
  const router = useRouter();
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState<string>("");

  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
    };

    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
    };

    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => {
      console.log("speech start");
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      console.log("speech end");
      setIsSpeaking(false);
    };

    const onError = (error: Error) => {
      console.log("Error:", error);
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }

    const handleGenerateFeedback = async (messages: SavedMessage[]) => {
      console.log("handleGenerateFeedback");

      const { success, feedbackId: id } = await createFeedback({
        interviewId: interviewId!,
        userId: userId!,
        transcript: messages,
        feedbackId,
      });

      if (success && id) {
        router.push(`/interview/${interviewId}/feedback`);
      } else {
        console.log("Error saving feedback");
        router.push("/");
      }
    };

    if (callStatus === CallStatus.FINISHED) {
      if (type === "generate") {
        router.push("/");
      } else if (type === "interview" && messages.length > 0) {
        handleGenerateFeedback(messages);
      }
    }
  }, [messages, callStatus, feedbackId, interviewId, router, type, userId]);

  const handleCall = async () => {
    console.log("=== Starting Vapi Call ===");
    console.log("Current props:", {
      userName,
      userId,
      interviewId,
      feedbackId,
      type,
      questions
    });

    setCallStatus(CallStatus.CONNECTING);
    console.log("Call status set to CONNECTING");

    if (type === "generate") {
      console.log("Starting generate type call...");
      const variableValues = {
        username: userName,
        userid: userId || "",
      };
      console.log("Variable values being sent to Vapi:", variableValues);

      try {
      await vapi.start(
        undefined,
        {
            variableValues: variableValues,
            clientMessages: ["transcript"] as any,
          serverMessages: [],
        },
        undefined,
        process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!
      );
        console.log("✅ Vapi start successful for generate type");
      } catch (error) {
        console.error("❌ Error starting Vapi call:", error);
        setCallStatus(CallStatus.INACTIVE);
      }
    } else {
      console.log("Starting interview type call...");
      let formattedQuestions = "";
      if (questions) {
        formattedQuestions = questions
          .map((question: string) => `- ${question}`)
          .join("\n");
      }
      console.log("Formatted questions:", formattedQuestions);

      try {
      await vapi.start(interviewer, {
        variableValues: {
          questions: formattedQuestions,
        },
        clientMessages: ["transcript"] as any,
        serverMessages: [],
      });
        console.log("✅ Vapi start successful for interview type");
      } catch (error) {
        console.error("❌ Error starting Vapi call:", error);
        setCallStatus(CallStatus.INACTIVE);
      }
    }
  };

  const handleDisconnect = () => {
    console.log("=== Disconnecting Vapi Call ===");
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
    console.log("✅ Vapi call stopped");
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* AI Interviewer Card */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10 p-8">
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
          <div className="relative flex flex-col items-center">
            <div className="relative">
              <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white/20 shadow-xl">
                <Image
                  src="/AIAvatar.png"
                  alt="AI Interviewer"
                  fill
                  className="object-cover"
                />
              </div>
              {isSpeaking && (
                <div className="absolute inset-0 rounded-full animate-ping bg-primary/20" />
              )}
            </div>
            <h3 className="mt-6 text-xl font-semibold">AI Interviewer</h3>
            <p className="text-sm text-muted-foreground text-center mt-2">
              Your personalized interview assistant
            </p>
          </div>
        </div>

        {/* User Profile Card */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10 p-8">
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
          <div className="relative flex flex-col items-center">
            <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-white/20 shadow-xl">
              <Image
                src="/userAvatar.png"
                alt="Your Profile"
                fill
                className="object-cover"
              />
            </div>
            <h3 className="mt-6 text-xl font-semibold">{userName}</h3>
            <p className="text-sm text-muted-foreground text-center mt-2">
              Ready for your interview
            </p>
          </div>
        </div>
      </div>

      {messages.length > 0 && (
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10 p-6">
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
          <div className="relative">
            <p
              key={lastMessage}
              className={cn(
                "text-lg text-center transition-opacity duration-500",
                "animate-fadeIn opacity-100"
              )}
            >
              {lastMessage}
            </p>
          </div>
        </div>
      )}

      <div className="flex justify-center">
        {callStatus !== "ACTIVE" ? (
          <button
            className={cn(
              "relative px-8 py-3 rounded-full font-medium transition-all duration-200",
              "bg-primary text-primary-foreground hover:bg-primary/90",
              "shadow-lg hover:shadow-xl",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              callStatus === "CONNECTING" && "animate-pulse"
            )}
            onClick={() => handleCall()}
            disabled={callStatus === "CONNECTING"}
          >
            <span className="relative flex items-center gap-2">
              {callStatus === "INACTIVE" || callStatus === "FINISHED" ? (
                <>
                  <Mic className="w-5 h-5" />
                  Start Interview
                </>
              ) : (
                "Connecting..."
              )}
            </span>
          </button>
        ) : (
          <button
            className="relative px-8 py-3 rounded-full font-medium transition-all duration-200 bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg hover:shadow-xl"
            onClick={() => handleDisconnect()}
          >
            End Interview
          </button>
        )}
      </div>
    </div>
  );
};

export default Agent;
