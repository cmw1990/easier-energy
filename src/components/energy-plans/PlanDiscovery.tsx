
import { Plan, PlanCategory, ProgressRecord } from "@/types/energyPlans"
import { PlanList } from "./PlanList"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

interface PlanDiscoveryProps {
  selectedCategory: PlanCategory | null
  progress?: ProgressRecord[]
  onSavePlan: (id: string) => void
  savedPlans?: Plan[]
}

export const PlanDiscovery = ({ 
  selectedCategory, 
  progress,
  onSavePlan,
  savedPlans 
}: PlanDiscoveryProps) => {
  // Fetch public plans
  const { data: publicPlans, isLoading: isLoadingPublic } = useQuery<Plan[]>({
    queryKey: ['energy-plans', 'public', selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from('energy_plans')
        .select(`
          *,
          energy_plan_components (*)
        `)
        .eq('visibility', 'public')
        .order('likes_count', { ascending: false })
      
      if (selectedCategory) {
        query = query.eq('category', selectedCategory)
      }
      
      const { data, error } = await query
      if (error) throw error
      return data as Plan[]
    }
  })

  return (
    <PlanList
      plans={publicPlans}
      progress={progress}
      isLoading={isLoadingPublic}
      onSavePlan={onSavePlan}
      savedPlans={savedPlans}
    />
  )
}
