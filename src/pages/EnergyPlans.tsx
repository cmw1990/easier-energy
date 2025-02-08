import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/components/AuthProvider"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { NewPlanDialog } from "@/components/energy-plans/NewPlanDialog"
import { PlanList } from "@/components/energy-plans/PlanList"
import { PlanFilters } from "@/components/energy-plans/PlanFilters"
import type { Plan, PlanCategory } from "@/types/energyPlans"
import { CelebrityPlanGallery } from "@/components/energy-plans/CelebrityPlanGallery"

const EnergyPlans = () => {
  const { session } = useAuth()
  const { toast } = useToast()
  const [selectedTab, setSelectedTab] = useState("discover")
  const [selectedCategory, setSelectedCategory] = useState<PlanCategory | null>(null)
  const queryClient = useQueryClient()

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

  // Fetch celebrity plans
  const { data: celebrityPlans, isLoading: isLoadingCelebrity } = useQuery<Plan[]>({
    queryKey: ['energy-plans', 'celebrity'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('energy_plans')
        .select(`
          *,
          energy_plan_components (*)
        `)
        .not('celebrity_name', 'is', null)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data as Plan[]
    }
  })

  // Fetch user's plans
  const { data: myPlans, isLoading: isLoadingMyPlans } = useQuery<Plan[]>({
    queryKey: ['energy-plans', 'my-plans', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return []
      
      const { data, error } = await supabase
        .from('energy_plans')
        .select(`
          *,
          energy_plan_components (*)
        `)
        .eq('created_by', session.user.id)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data as Plan[]
    },
    enabled: !!session?.user?.id
  })

  // Fetch saved plans
  const { data: savedPlans, isLoading: isLoadingSaved } = useQuery<Plan[]>({
    queryKey: ['energy-plans', 'saved', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return []
      
      const { data, error } = await supabase
        .from('user_saved_plans')
        .select(`
          plan_id,
          energy_plans (
            *,
            energy_plan_components (*)
          )
        `)
        .eq('user_id', session.user.id)
      
      if (error) throw error
      return data.map(item => item.energy_plans) as Plan[]
    },
    enabled: !!session?.user?.id
  })

  // Fetch progress records
  const { data: planProgress } = useQuery<ProgressRecord[]>({
    queryKey: ['energy-plans', 'progress', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return []
      
      const { data, error } = await supabase
        .from('energy_plan_progress')
        .select('*')
        .eq('user_id', session.user.id)
      
      if (error) throw error
      return data as ProgressRecord[]
    },
    enabled: !!session?.user?.id
  })

  // Save plan mutation
  const savePlanMutation = useMutation({
    mutationFn: async (planId: string) => {
      if (!session?.user) throw new Error("Not authenticated")
      
      const { error } = await supabase
        .from('user_saved_plans')
        .insert({
          user_id: session.user.id,
          plan_id: planId
        })

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['energy-plans', 'saved'] })
      toast({
        title: "Plan Saved",
        description: "The energy plan has been saved to your collection"
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save the plan",
        variant: "destructive"
      })
    }
  })

  // Share plan mutation
  const sharePlanMutation = useMutation({
    mutationFn: async (plan: Plan) => {
      if (!session?.user) throw new Error("Not authenticated")
      
      const { error } = await supabase
        .from('energy_plans')
        .update({ visibility: 'public' })
        .eq('id', plan.id)
        .eq('created_by', session.user.id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['energy-plans'] })
      toast({
        title: "Plan Shared",
        description: "Your plan is now visible to others"
      })
    }
  })

  return (
    <div className="container max-w-6xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Energy Plans</h1>
          <p className="text-muted-foreground">
            Discover and share energy optimization plans
          </p>
        </div>
        <div className="flex gap-4">
          <PlanFilters 
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
          <NewPlanDialog onPlanCreated={() => {
            queryClient.invalidateQueries({ queryKey: ['energy-plans'] })
          }} />
        </div>
      </div>

      <CelebrityPlanGallery
        plans={celebrityPlans}
        onSavePlan={(id) => savePlanMutation.mutate(id)}
        savedPlans={savedPlans}
      />

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
          <TabsTrigger value="discover">Discover Plans</TabsTrigger>
          <TabsTrigger value="my-plans">My Plans</TabsTrigger>
          <TabsTrigger value="saved">Saved Plans</TabsTrigger>
        </TabsList>

        <TabsContent value="discover">
          <PlanList
            plans={publicPlans}
            progress={planProgress}
            isLoading={isLoadingPublic}
            onSavePlan={(id) => savePlanMutation.mutate(id)}
            savedPlans={savedPlans}
          />
        </TabsContent>

        <TabsContent value="my-plans">
          {!session?.user ? (
            <Card>
              <CardContent className="pt-6">
                <p>Please sign in to view your plans</p>
              </CardContent>
            </Card>
          ) : (
            <PlanList
              plans={myPlans}
              progress={planProgress}
              isLoading={isLoadingMyPlans}
              onSharePlan={(plan) => sharePlanMutation.mutate(plan)}
            />
          )}
        </TabsContent>

        <TabsContent value="saved">
          {!session?.user ? (
            <Card>
              <CardContent className="pt-6">
                <p>Please sign in to view saved plans</p>
              </CardContent>
            </Card>
          ) : (
            <PlanList
              plans={savedPlans}
              progress={planProgress}
              isLoading={isLoadingSaved}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default EnergyPlans
