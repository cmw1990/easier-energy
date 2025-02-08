
import { Plan, PlanCategory, ProgressRecord, LifeSituation } from "@/types/energyPlans";
import { PlanList } from "./PlanList";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";

interface PlanDiscoveryProps {
  selectedCategory: PlanCategory | null;
  progress?: ProgressRecord[];
  onSavePlan: (id: string) => void;
  savedPlans?: Plan[];
  currentLifeSituation?: LifeSituation;
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
  currentLifeSituation,
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

      // Filter by life situation if specified
      if (currentLifeSituation) {
        query = query.contains('suitable_life_situations', [currentLifeSituation]);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Plan[];
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
