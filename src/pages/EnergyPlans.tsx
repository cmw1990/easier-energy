
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/components/AuthProvider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Brain, Zap, Moon, Wind, Focus, Coffee } from "lucide-react"

type EnergyPlan = {
  id: string
  title: string
  description: string
  plan_type: 'recharge' | 'energize' | 'recovery' | 'sleep' | 'focus' | 'destress'
  visibility: 'private' | 'public' | 'shared'
  is_expert_plan: boolean
  tags: string[]
  likes_count: number
  saves_count: number
  created_at: string
}

const PlanTypeIcons = {
  recharge: Zap,
  energize: Coffee,
  recovery: Wind,
  sleep: Moon,
  focus: Brain,
  destress: Wind,
}

const EnergyPlans = () => {
  const { session } = useAuth()
  const { toast } = useToast()
  const [selectedTab, setSelectedTab] = useState("discover")

  const { data: publicPlans, isLoading: isLoadingPublic } = useQuery({
    queryKey: ['energy-plans', 'public'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('energy_plans')
        .select('*')
        .eq('visibility', 'public')
        .order('likes_count', { ascending: false })
      
      if (error) throw error
      return data as EnergyPlan[]
    }
  })

  const { data: myPlans, isLoading: isLoadingMyPlans } = useQuery({
    queryKey: ['energy-plans', 'my-plans', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return []
      
      const { data, error } = await supabase
        .from('energy_plans')
        .select('*')
        .eq('created_by', session.user.id)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data as EnergyPlan[]
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
          energy_plans (*)
        `)
        .eq('user_id', session.user.id)
      
      if (error) throw error
      return data.map(item => item.energy_plans) as EnergyPlan[]
    },
    enabled: !!session?.user?.id
  })

  const handleSavePlan = async (planId: string) => {
    if (!session?.user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save plans",
        variant: "destructive"
      })
      return
    }

    try {
      const { error } = await supabase
        .from('user_saved_plans')
        .insert({
          user_id: session.user.id,
          plan_id: planId
        })

      if (error) throw error

      toast({
        title: "Plan Saved",
        description: "The energy plan has been saved to your collection"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save the plan. Please try again.",
        variant: "destructive"
      })
    }
  }

  const renderPlanCard = (plan: EnergyPlan) => {
    const Icon = PlanTypeIcons[plan.plan_type] || Brain

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
            {plan.is_expert_plan && (
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                Expert Plan
              </span>
            )}
          </div>
          <CardDescription>{plan.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {plan.tags.map((tag) => (
                <span key={tag} className="px-2 py-1 text-xs bg-primary/10 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSavePlan(plan.id)}
              >
                Save Plan
              </Button>
              <Button size="sm">View Details</Button>
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
        <Button>Create New Plan</Button>
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
