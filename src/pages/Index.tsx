import { AchievementWall } from "@/components/achievements/AchievementWall";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { MeditationStats } from "@/components/meditation/MeditationStats";
import { GroupSession } from "@/components/social/GroupSession";
import { MeditationAudioPlayer } from "@/components/audio/MeditationAudioPlayer";
import { BackgroundMusicPlayer } from "@/components/audio/BackgroundMusicPlayer";
import { MotivationSection } from "@/components/motivation/MotivationSection";
import { motion } from "framer-motion";

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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-6 space-y-6"
    >
      <h1 className="text-3xl font-bold">Welcome</h1>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <AchievementWall />
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <MeditationStats />
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <GroupSession />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <MeditationAudioPlayer />
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.0 }}
        >
          <BackgroundMusicPlayer />
        </motion.div>
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <MotivationSection />
      </motion.div>
    </motion.div>
  );
}