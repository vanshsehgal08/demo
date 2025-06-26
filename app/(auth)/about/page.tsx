"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Brain,
  Users,
  MessageSquare,
  Trophy,
  ArrowRight,
  CheckCircle,
  FileText,
  Sparkles,
  Target,
  Clock,
} from "lucide-react";

export default function AboutPage() {
  const router = useRouter();

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent drop-shadow-sm">
          Master Your Interviews with AI-Powered Practice
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Our platform provides realistic mock interviews, instant AI feedback, and personalized insights to help you build confidence and excel in any job interview.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        <Card className="p-6 hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-primary/50 rounded-xl">
          <Brain className="w-12 h-12 mb-4 text-primary" />
          <h3 className="text-xl font-semibold mb-2">Realistic AI Interviewer</h3>
          <p className="text-muted-foreground leading-relaxed">
            Practice with an AI that simulates real interview dynamics, helping you get comfortable and confident.
          </p>
        </Card>

        <Card className="p-6 hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-primary/50 rounded-xl">
          <FileText className="w-12 h-12 mb-4 text-primary" />
          <h3 className="text-xl font-semibold mb-2">Resume-Based Interviews</h3>
          <p className="text-muted-foreground leading-relaxed">
            Upload your resume to get personalized interview questions tailored to your experience and skills.
          </p>
        </Card>

        <Card className="p-6 hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-primary/50 rounded-xl">
          <MessageSquare className="w-12 h-12 mb-4 text-primary" />
          <h3 className="text-xl font-semibold mb-2">Instant, Detailed Feedback</h3>
          <p className="text-muted-foreground leading-relaxed">
            Receive immediate, comprehensive feedback on your performance, covering communication, technical skills, and more.
          </p>
        </Card>

        <Card className="p-6 hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-primary/50 rounded-xl">
          <Trophy className="w-12 h-12 mb-4 text-primary" />
          <h3 className="text-xl font-semibold mb-2">Track Your Improvement</h3>
          <p className="text-muted-foreground leading-relaxed">
            Monitor your progress over time with detailed analytics and skill breakdowns to identify areas for growth.
          </p>
        </Card>

        <Card className="p-6 hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-primary/50 rounded-xl">
          <Target className="w-12 h-12 mb-4 text-primary" />
          <h3 className="text-xl font-semibold mb-2">Customized Practice</h3>
          <p className="text-muted-foreground leading-relaxed">
            Choose from various interview types, roles, and difficulty levels to match your career goals.
          </p>
        </Card>

        <Card className="p-6 hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-primary/50 rounded-xl">
          <Clock className="w-12 h-12 mb-4 text-primary" />
          <h3 className="text-xl font-semibold mb-2">Flexible Scheduling</h3>
          <p className="text-muted-foreground leading-relaxed">
            Practice anytime, anywhere with our on-demand interview platform that fits your schedule.
          </p>
        </Card>
      </div>

      {/* Resume-Based Interview Section */}
      <div className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Resume-Based Interview Experience</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Get personalized interview questions based on your actual experience and skills
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">AI-Powered Analysis</h3>
                <p className="text-muted-foreground">
                  Our AI analyzes your resume to generate relevant questions that match your experience level and skills.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Comprehensive Coverage</h3>
                <p className="text-muted-foreground">
                  Questions cover technical skills, work experience, education, soft skills, and career goals.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Realistic Practice</h3>
                <p className="text-muted-foreground">
                  Practice with questions that mirror what you'll face in real interviews for your target roles.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Time-Saving</h3>
                <p className="text-muted-foreground">
                  No need to manually create questions - get a complete set of relevant questions instantly.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Trophy className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Skill Development</h3>
                <p className="text-muted-foreground">
                  Identify and improve areas where you need more practice or preparation.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Confidence Building</h3>
                <p className="text-muted-foreground">
                  Practice with personalized questions to build confidence in your interview skills.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-8 text-center tracking-tight">
          Why Choose Our AI Interview Platform?
        </h2>
        <div className="grid md:grid-cols-2 gap-y-8 gap-x-6">
          <div className="flex items-start gap-4">
            <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold mb-2">Tailored Interview Experiences</h3>
              <p className="text-muted-foreground leading-relaxed">
                Practice for specific roles, industries, and experience levels with customized interview scenarios.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold mb-2">AI That Adapts to You</h3>
              <p className="text-muted-foreground leading-relaxed">
                Our AI interviewer adjusts its questions and style based on your responses, providing a dynamic practice environment.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold mb-2">Actionable Feedback for Growth</h3>
              <p className="text-muted-foreground leading-relaxed">
                Get clear, specific feedback on your strengths and areas for improvement to guide your preparation.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold mb-2">Flexible & Convenient Practice</h3>
              <p className="text-muted-foreground leading-relaxed">
                Access practice interviews anytime, anywhere, and repeat sessions as often as you need.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-6">
          Ready to Transform Your Interview Skills?
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="gap-2 cursor-pointer"
            onClick={() => router.push("/sign-up")}
          >
            Get Started <ArrowRight className="w-4 h-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="cursor-pointer"
            onClick={() => {
              const featuresSection = document.querySelector(".grid");
              featuresSection?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
}
