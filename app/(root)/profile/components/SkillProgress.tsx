"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Info, TrendingUp, TrendingDown, Minus } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SkillProgressProps {
  skills: {
    communication: number;
    technicalKnowledge: number;
    problemSolving: number;
    culturalFit: number;
    confidenceAndClarity: number;
    totalScore: number;
    latestFeedback?: {
      strengths: string[];
      areasForImprovement: string[];
      finalAssessment: string;
    };
  };
}

const SkillProgress = ({ skills }: SkillProgressProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getTrendIcon = (score: number) => {
    if (score >= 80) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (score >= 60) return <Minus className="w-4 h-4 text-yellow-500" />;
    return <TrendingDown className="w-4 h-4 text-red-500" />;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Skill Progress</CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-5 h-5 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Your skill scores based on recent interviews</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">Communication Skills</p>
                  {getTrendIcon(skills.communication)}
                </div>
                <Badge variant="secondary" className="font-medium">
                  {skills.communication}%
                </Badge>
              </div>
              <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getScoreColor(skills.communication)}`}
                  style={{ width: `${skills.communication}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">Technical Knowledge</p>
                  {getTrendIcon(skills.technicalKnowledge)}
                </div>
                <Badge variant="secondary" className="font-medium">
                  {skills.technicalKnowledge}%
                </Badge>
              </div>
              <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getScoreColor(skills.technicalKnowledge)}`}
                  style={{ width: `${skills.technicalKnowledge}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">Problem Solving</p>
                  {getTrendIcon(skills.problemSolving)}
                </div>
                <Badge variant="secondary" className="font-medium">
                  {skills.problemSolving}%
                </Badge>
              </div>
              <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getScoreColor(skills.problemSolving)}`}
                  style={{ width: `${skills.problemSolving}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">Cultural Fit</p>
                  {getTrendIcon(skills.culturalFit)}
                </div>
                <Badge variant="secondary" className="font-medium">
                  {skills.culturalFit}%
                </Badge>
              </div>
              <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getScoreColor(skills.culturalFit)}`}
                  style={{ width: `${skills.culturalFit}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">Confidence and Clarity</p>
                  {getTrendIcon(skills.confidenceAndClarity)}
                </div>
                <Badge variant="secondary" className="font-medium">
                  {skills.confidenceAndClarity}%
                </Badge>
              </div>
              <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getScoreColor(skills.confidenceAndClarity)}`}
                  style={{ width: `${skills.confidenceAndClarity}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {skills.latestFeedback && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Latest Feedback</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-medium mb-3 text-sm text-muted-foreground">Strengths</h4>
              <div className="flex flex-wrap gap-2">
                {skills.latestFeedback.strengths.map((strength, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1">
                    {strength}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-3 text-sm text-muted-foreground">Areas for Improvement</h4>
              <div className="flex flex-wrap gap-2">
                {skills.latestFeedback.areasForImprovement.map((area, index) => (
                  <Badge key={index} variant="outline" className="px-3 py-1 text-red-500 border-red-500">
                    {area}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-3 text-sm text-muted-foreground">Final Assessment</h4>
              <p className="text-sm leading-relaxed">
                {skills.latestFeedback.finalAssessment}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SkillProgress; 