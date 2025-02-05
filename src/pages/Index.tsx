import { AchievementWall } from "@/components/achievements/AchievementWall";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { MeditationStats } from "@/components/meditation/MeditationStats";
import GomokuGame from "@/components/games/GomokuGame";
import BrainMatch3 from "@/components/games/BrainMatch3";

export default function Index() {
  const navigate = useNavigate();
  const { session } = useAuth();

  if (!session) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-4">Welcome to Mind Mate</h1>
          <p className="mb-4">Please sign in to access all features.</p>
          <Button onClick={() => navigate("/login")}>Sign In</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Welcome</h1>
      <AchievementWall />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MeditationStats />
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Brain Training</h2>
          <div className="space-y-4">
            <GomokuGame />
            <BrainMatch3 />
          </div>
        </Card>
      </div>
    </div>
  );
}