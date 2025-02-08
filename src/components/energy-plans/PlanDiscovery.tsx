
import { Plan, PlanCategory, ProgressRecord } from "@/types/energyPlans";
import { PlanList } from "./PlanList";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";

interface PlanDiscoveryProps {
  selectedCategory: PlanCategory | null;
  progress?: ProgressRecord[];
  onSavePlan: (id: string) => void;
  savedPlans?: Plan[];
  currentCyclePhase?: string;
  biometricData?: {
    energyLevel?: number;
    stressLevel?: number;
    sleepQuality?: number;
    mood?: string;
  };
}

export const PlanDiscovery = ({ 
  selectedCategory, 
  progress,
  onSavePlan,
  savedPlans,
  currentCyclePhase,
  biometricData
}: PlanDiscoveryProps) => {
  const { session } = useAuth();

  // Fetch public plans
  const { data: publicPlans, isLoading: isLoadingPublic } = useQuery<Plan[]>({
    queryKey: ['energy-plans', 'public', selectedCategory, currentCyclePhase],
    queryFn: async () => {
      let query = supabase
        .from('energy_plans')
        .select(`
          *,
          energy_plan_components (*)
        `)
        .eq('visibility', 'public')
        .order('likes_count', { ascending: false });
      
      if (selectedCategory) {
        query = query.eq('category', selectedCategory);
      }

      // Filter plans based on biometric requirements if available
      if (currentCyclePhase) {
        query = query.contains('cycle_phase_recommendations', [currentCyclePhase]);
      }
      
      const { data, error } = await query;
      if (error) throw error;

      // Client-side filtering based on biometric requirements
      return (data as Plan[]).filter(plan => {
        if (!plan.biometricRequirements || !biometricData) return true;

        const requirements = plan.biometricRequirements;
        return (
          (!requirements.energyLevel || biometricData.energyLevel >= requirements.energyLevel) &&
          (!requirements.stressLevel || biometricData.stressLevel <= requirements.stressLevel) &&
          (!requirements.sleepQuality || biometricData.sleepQuality >= requirements.sleepQuality)
        );
      });
    },
    enabled: !!session?.user?.id
  });

  return (
    <PlanList
      plans={publicPlans}
      progress={progress}
      isLoading={isLoadingPublic}
      onSavePlan={onSavePlan}
      savedPlans={savedPlans}
    />
  );
};
