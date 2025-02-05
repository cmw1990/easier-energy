import { useEffect } from "react";
import { useAchievements } from "./useAchievements";
import { useToast } from "./use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useAchievementTriggers = () => {
  const { updateProgress } = useAchievements();
  const { toast } = useToast();

  // Track meditation sessions
  useEffect(() => {
    const meditationChannel = supabase
      .channel('meditation_progress')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'meditation_progress'
        },
        async (payload) => {
          const duration = payload.new.completed_duration;
          if (duration >= 10) {
            await updateProgress.mutateAsync({
              achievementId: 'meditation-milestone',
              progress: duration
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(meditationChannel);
    };
  }, [updateProgress]);

  // Track focus sessions
  useEffect(() => {
    const focusChannel = supabase
      .channel('productivity_metrics')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'productivity_metrics'
        },
        async (payload) => {
          const focusDuration = payload.new.focus_duration;
          if (focusDuration >= 25) {
            await updateProgress.mutateAsync({
              achievementId: 'focus-milestone',
              progress: focusDuration
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(focusChannel);
    };
  }, [updateProgress]);

  // Track mood logs
  useEffect(() => {
    const moodChannel = supabase
      .channel('mood_logs')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'mood_logs'
        },
        async () => {
          await updateProgress.mutateAsync({
            achievementId: 'mood-tracking',
            progress: 1
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(moodChannel);
    };
  }, [updateProgress]);

  // Track exercise completion
  useEffect(() => {
    const exerciseChannel = supabase
      .channel('exercise_tracking')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'exercise_tracking'
        },
        async (payload) => {
          const duration = payload.new.duration_seconds;
          if (duration >= 300) { // 5 minutes
            await updateProgress.mutateAsync({
              achievementId: 'exercise-milestone',
              progress: Math.floor(duration / 60)
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(exerciseChannel);
    };
  }, [updateProgress]);

  // Track daily streaks
  useEffect(() => {
    const checkinsChannel = supabase
      .channel('daily_checkins')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'daily_checkins'
        },
        async () => {
          await updateProgress.mutateAsync({
            achievementId: 'daily-streak',
            progress: 1
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(checkinsChannel);
    };
  }, [updateProgress]);

  return null;
};