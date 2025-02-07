
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/components/AuthProvider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { 
  Zap, 
  Moon, 
  Wind, 
  Brain, 
  Coffee,
  Sun,
  Flower,
  Heart,
  Star,
  Timer,
  Share2 
} from "lucide-react"
import { Database } from "@/types/supabase"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

type EnergyPlan = Database['public']['Tables']['energy_plans']['Row']
type EnergyPlanComponent = Database['public']['Tables']['energy_plan_components']['Row']
type EnergyPlanProgress = Database['public']['Tables']['energy_plan_progress']['Row']

interface EnergyPlanWithComponents extends Omit<EnergyPlan, 'energy_plan_components'> {
  energy_plan_components: EnergyPlanComponent[]
}

const PlanTypeIcons = {
  quick_boost: Zap,
  sustained_energy: Coffee,
  mental_clarity: Brain,
  physical_energy: Star,
  morning_routine: Sun,
  deep_relaxation: Flower,
  stress_relief: Heart,
  wind_down: Wind,
  sleep_prep: Moon,
  recovery: Timer,
  meditation: Flower,
} as const

const CategoryColors = {
  charged: "bg-orange-100 text-orange-800 dark:bg-orange-900/30",
  recharged: "bg-blue-100 text-blue-800 dark:bg-blue-900/30"
} as const

const EnergyPlans = () => {
  const { session } = useAuth()
  const { toast } = useToast()
  const [selectedTab, setSelectedTab] = useState("discover")
  const [selectedCategory, setSelectedCategory] = useState<'charged' | 'recharged' | null>(null)
  const queryClient = useQueryClient()

  const { data: publicPlans, isLoading: isLoadingPublic } = useQuery({
    queryKey: ['energy-plans', 'public', selectedCategory] as const,
    queryFn: async () => {
      let query = supabase
        .from('energy_plans')
        .select(`
          *,
          energy_plan_components (
            id,
            component_type,
            order_number,
            duration_minutes
          )
        `)
        .eq('visibility', 'public')
        .order('likes_count', { ascending: false })
      
      if (selectedCategory) {
        query = query.eq('category', selectedCategory)
      }
      
      const { data, error } = await query
      if (error) throw error
      return data as EnergyPlanWithComponents[]
    }
  })

  const { data: myPlans, isLoading: isLoadingMyPlans } = useQuery({
    queryKey: ['energy-plans', 'my-plans', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return []
      
      const { data, error } = await supabase
        .from('energy_plans')
        .select(`
          *,
          energy_plan_components (
            id,
            component_type,
            order_number,
            duration_minutes
          )
        `)
        .eq('created_by', session.user.id)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data as EnergyPlanWithComponents[]
    },
    enabled: !!session?.user?.id
  })

  const { data: savedPlans, isLoading: isLoadingSaved } = useQuery({
    queryKey: ['energy-plans', 'saved', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return []
      
      const { data, error } = await supabase
        .from('user_saved_plans')
        .select(`
          plan_id,
          energy_plans (
            *,
            energy_plan_components (
              id,
              component_type,
              order_number,
              duration_minutes
            )
          )
        `)
        .eq('user_id', session.user.id)
      
      if (error) throw error
      return data.map(item => item.energy_plans) as EnergyPlanWithComponents[]
    },
    enabled: !!session?.user?.id
  })

  const { data: planProgress } = useQuery({
    queryKey: ['energy-plans', 'progress', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return []
      
      const { data, error } = await supabase
        .from('energy_plan_progress')
        .select('*')
        .eq('user_id', session.user.id)
      
      if (error) throw error
      return data as EnergyPlanProgress[]
    },
    enabled: !!session?.user?.id
  })

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
        description: "Failed to save the plan. Please try again.",
        variant: "destructive"
      })
    }
  })

  const sharePlanMutation = useMutation({
    mutationFn: async (plan: EnergyPlanWithComponents) => {
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

  const calculateProgress = (plan: EnergyPlanWithComponents) => {
    if (!planProgress || !plan.energy_plan_components.length) return 0
    
    const completedSteps = planProgress.filter(
      p => p.plan_id === plan.id && p.completed_at
    ).length
    
    return (completedSteps / plan.energy_plan_components.length) * 100
  }

  const renderPlanCard = (plan: EnergyPlanWithComponents) => {
    const Icon = PlanTypeIcons[plan.plan_type] || Brain
    const progress = calculateProgress(plan)
    const isSaved = savedPlans?.some(saved => saved.id === plan.id)

    return (
      <Card key={plan.id} className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-full">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-xl">{plan.title}</CardTitle>
            </div>
            <div className="flex gap-2">
              <Badge variant="secondary" className={CategoryColors[plan.category]}>
                {plan.category === 'charged' ? 'Energy Boost' : 'Recovery & Rest'}
              </Badge>
              {plan.is_expert_plan && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Expert Plan
                </Badge>
              )}
            </div>
          </div>
          <CardDescription>{plan.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              {plan.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
            
            {progress > 0 && (
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Progress</div>
                <Progress value={progress} className="h-2" />
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Star className="h-4 w-4" />
                {plan.likes_count} likes
              </div>
              
              <div className="flex gap-2">
                {!isSaved && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => savePlanMutation.mutate(plan.id)}
                  >
                    Save Plan
                  </Button>
                )}
                
                {session?.user?.id === plan.created_by && plan.visibility !== 'public' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => sharePlanMutation.mutate(plan)}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                )}
                
                <Button size="sm">View Details</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

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
          <div className="flex gap-2">
            <Button
              variant={selectedCategory === 'charged' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(
                selectedCategory === 'charged' ? null : 'charged'
              )}
            >
              <Zap className="h-4 w-4 mr-2" />
              Charged
            </Button>
            <Button
              variant={selectedCategory === 'recharged' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(
                selectedCategory === 'recharged' ? null : 'recharged'
              )}
            >
              <Moon className="h-4 w-4 mr-2" />
              Recharged
            </Button>
          </div>
          <Button>Create New Plan</Button>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
          <TabsTrigger value="discover">Discover Plans</TabsTrigger>
          <TabsTrigger value="my-plans">My Plans</TabsTrigger>
          <TabsTrigger value="saved">Saved Plans</TabsTrigger>
        </TabsList>

        <TabsContent value="discover" className="space-y-4">
          {isLoadingPublic ? (
            <div>Loading plans...</div>
          ) : (
            publicPlans?.map(renderPlanCard)
          )}
        </TabsContent>

        <TabsContent value="my-plans" className="space-y-4">
          {!session?.user ? (
            <Card>
              <CardContent className="pt-6">
                <p>Please sign in to view your plans</p>
              </CardContent>
            </Card>
          ) : isLoadingMyPlans ? (
            <div>Loading your plans...</div>
          ) : (
            myPlans?.map(renderPlanCard)
          )}
        </TabsContent>

        <TabsContent value="saved" className="space-y-4">
          {!session?.user ? (
            <Card>
              <CardContent className="pt-6">
                <p>Please sign in to view saved plans</p>
              </CardContent>
            </Card>
          ) : isLoadingSaved ? (
            <div>Loading saved plans...</div>
          ) : (
            savedPlans?.map(renderPlanCard)
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default EnergyPlans
