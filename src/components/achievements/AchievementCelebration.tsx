import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Star, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import confetti from 'canvas-confetti';

interface AchievementCelebrationProps {
  title: string;
  description: string;
  points: number;
  icon: string;
  onComplete?: () => void;
}

export const AchievementCelebration = ({
  title,
  description,
  points,
  icon,
  onComplete
}: AchievementCelebrationProps) => {
  const { toast } = useToast();

  useEffect(() => {
    // Show toast notification
    toast({
      title: "Achievement Unlocked!",
      description: title,
      duration: 5000,
    });

    // Trigger confetti effect
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Call onComplete after animation
    const timer = setTimeout(() => {
      onComplete?.();
    }, 5000);

    return () => clearTimeout(timer);
  }, [title, onComplete, toast]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center z-50 bg-background/80"
      >
        <Card className="p-6 max-w-sm w-full bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="relative">
              <Trophy className="w-16 h-16 text-primary" />
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity
                }}
                className="absolute -top-2 -right-2"
              >
                <Sparkles className="w-6 h-6 text-yellow-500" />
              </motion.div>
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold">{title}</h3>
              <p className="text-sm text-muted-foreground">{description}</p>
              <div className="flex items-center justify-center gap-2 text-yellow-500">
                <Star className="w-5 h-5" />
                <span className="font-bold">+{points} points</span>
              </div>
            </div>
          </motion.div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};