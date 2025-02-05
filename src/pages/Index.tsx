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
import { HealthImprovements } from "@/components/sobriety/HealthImprovements";
import { CravingTracker } from "@/components/sobriety/CravingTracker";
import { MoodOverview } from "@/components/MoodOverview";
import { WithdrawalTracker } from "@/components/sobriety/WithdrawalTracker";
import { TriggerPatternAnalysis } from "@/components/sobriety/TriggerPatternAnalysis";
import { Battery, Brain, Coffee, Moon, Wind, Gamepad2 } from "lucide-react";
import { motion } from "framer-motion";
import { GameAssetsGenerator } from "@/components/GameAssetsGenerator";
import { ReproductiveHealthExercises } from "@/components/exercises/ReproductiveHealthExercises";
import { ExerciseRoutine } from "@/components/exercises/ExerciseRoutine";
import { AdvancedExercisePatterns } from "@/components/exercises/AdvancedExercisePatterns";
import { ExerciseProgressChart } from "@/components/exercises/ExerciseProgressChart";

export default function Index() {
  const navigate = useNavigate();
  const { session } = useAuth();

  if (!session) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-4">Welcome to Energy Support</h1>
          <p className="mb-4">Sign in to access your personal energy dashboard.</p>
          <Button onClick={() => navigate("/login")}>Sign In</Button>
        </Card>
        <div className="flex justify-center">
          <GameAssetsGenerator />
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-4 md:p-6 space-y-6"
    >
      <div className="flex justify-center mb-6">
        <GameAssetsGenerator />
      </div>

      {/* Add Balloon Adventure Game Button */}
      <Card className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center gap-3 mb-4">
          <Gamepad2 className="h-6 w-6 text-pink-500" />
          <h2 className="text-2xl font-bold">Balloon Adventure</h2>
        </div>
        <p className="text-muted-foreground mb-4">
          Embark on a dreamy journey through the clouds in this breath-controlled balloon adventure.
        </p>
        <div className="flex gap-4">
          <Button 
            onClick={() => navigate("/breathing-balloon")}
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Gamepad2 className="mr-2 h-4 w-4" />
            Start Adventure
          </Button>
          <GameAssetsGenerator />
        </div>
      </Card>

      {/* Energy Overview Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="col-span-full lg:col-span-2"
        >
          <Card className="p-4 bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20">
            <div className="flex items-center gap-3 mb-4">
              <Battery className="h-6 w-6 text-emerald-500" />
              <h2 className="text-2xl font-bold">Energy Score</h2>
            </div>
            <MoodOverview />
          </Card>
        </motion.div>

        {/* Quick Access Tools */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="col-span-1"
        >
          <Card className="p-4 h-full">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="h-5 w-5 text-purple-500" />
              <h3 className="font-semibold">Focus Tools</h3>
            </div>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/focus")}>
                <Coffee className="h-4 w-4 mr-2" />
                Focus Session
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/meditation")}>
                <Wind className="h-4 w-4 mr-2" />
                Quick Meditation
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => navigate("/sleep")}>
                <Moon className="h-4 w-4 mr-2" />
                Power Nap
              </Button>
            </div>
          </Card>
        </motion.div>

        {/* Audio Tools with Reproductive Health Exercises */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="col-span-1"
        >
          <div className="space-y-4">
            <BackgroundMusicPlayer />
            <ReproductiveHealthExercises />
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="col-span-1"
        >
          <div className="space-y-4">
            <ExerciseRoutine
              routineName="Daily Energy Training"
              exercises={[
                {
                  name: "Pelvic Floor Warm-up",
                  type: "breathing",
                  sets: 1,
                  reps: 10,
                  holdDuration: 5,
                  restDuration: 3,
                  instructions: [
                    "Find a comfortable position",
                    "Take deep breaths",
                    "Focus on relaxing your pelvic floor",
                    "Maintain good posture"
                  ]
                },
                {
                  name: "Basic Strengthening",
                  type: "kegel_basic",
                  sets: 3,
                  reps: 10,
                  holdDuration: 5,
                  restDuration: 5,
                  instructions: [
                    "Contract your pelvic floor muscles",
                    "Hold for 5 seconds",
                    "Release completely",
                    "Rest for 5 seconds"
                  ]
                },
                {
                  name: "Advanced Training",
                  type: "kegel_advanced",
                  sets: 2,
                  reps: 15,
                  holdDuration: 2,
                  restDuration: 3,
                  instructions: [
                    "Quick, strong contractions",
                    "Focus on full release",
                    "Maintain breathing",
                    "Keep your core relaxed"
                  ]
                },
                {
                  name: "Core Integration",
                  type: "core_strength",
                  sets: 3,
                  reps: 12,
                  holdDuration: 5,
                  restDuration: 10,
                  instructions: [
                    "Engage your core muscles",
                    "Coordinate with pelvic floor",
                    "Maintain neutral spine",
                    "Breathe steadily"
                  ]
                },
                {
                  name: "Cool Down",
                  type: "relaxation",
                  sets: 1,
                  reps: 1,
                  holdDuration: 300,
                  restDuration: 0,
                  instructions: [
                    "Progressive muscle relaxation",
                    "Focus on breathing",
                    "Release any tension",
                    "Stay mindful and present"
                  ]
                }
              ]}
            />
          </div>
        </motion.div>
      </div>

      {/* Advanced Exercise Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <AdvancedExercisePatterns />
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <ExerciseProgressChart />
        </motion.div>
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2"
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

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <HealthImprovements />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="lg:col-span-2"
        >
          <TriggerPatternAnalysis />
        </motion.div>
      </div>

      {/* Achievement Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        <AchievementWall />
      </motion.div>

      {/* Support Tools */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.0 }}
        >
          <CravingTracker />
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          <WithdrawalTracker />
        </motion.div>
      </div>
    </motion.div>
  );
}
