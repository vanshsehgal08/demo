import { getCurrentUser } from "@/lib/actions/auth.action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ServerAvatar, ServerAvatarFallback } from "@/components/ui/server-avatar";
import ProfileTabs from "./components/ProfileTabs";
import SkillProgress from "./components/SkillProgress";
import { getUserSkillProgress } from "@/lib/actions/auth.action";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Award, Clock, Star } from "lucide-react";

const ProfilePage = async () => {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const skillProgress = await getUserSkillProgress(user.id);

  return (
    <div className="container mx-auto pt-0 pb-0 space-y-8">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-background rounded-xl p-8">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
        <div className="relative">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <ServerAvatar className="h-24 w-24 border-4 border-background" fallback={user.name?.[0] || "U"}>
              <ServerAvatarFallback className="text-2xl">{user.name?.[0] || "U"}</ServerAvatarFallback>
            </ServerAvatar>
            <div className="flex-1 space-y-2">
              <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                <h1 className="text-3xl font-bold">{user.name}</h1>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="px-3 py-1">
                    <Star className="w-3 h-3 mr-1" />
                    Pro Member
                  </Badge>
                  <Badge variant="outline" className="px-3 py-1">
                    <Calendar className="w-3 h-3 mr-1" />
                    Joined 2024
                  </Badge>
                </div>
              </div>
              <p className="text-muted-foreground text-lg">{user.email}</p>
            </div>
            <Button variant="outline" size="lg" className="hidden md:flex">
              Edit Profile
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{skillProgress.totalScore}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Available Interviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
          </CardContent>
        </Card>
      </div>

      {/* Skill Progress */}
      <div className="max-w-4xl mx-auto">
        <SkillProgress skills={skillProgress} />
      </div>

      {/* Settings Tabs */}
      <ProfileTabs user={user} />
    </div>
  );
};

export default ProfilePage;

