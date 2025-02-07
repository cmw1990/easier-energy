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
  Share2,
  Plus 
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Define flat types without circular references
type PlanComponent = {
  id: string
  component_type: string
  order_number: number
  duration_minutes: number | null
  step_number?: number
  completion_criteria?: any
}

type Plan = {
  id: string
  created_at: string
  updated_at: string
  created_by: string
  title: string
  description: string | null
  plan_type: 'quick_boost' | 'sustained_energy' | 'mental_clarity' | 'physical_energy' | 'morning_routine' | 'deep_relaxation' | 'stress_relief' | 'wind_down' | 'sleep_prep' | 'recovery' | 'meditation'
  category: 'charged' | 'recharged'
  visibility: 'private' | 'public' | 'shared'
  is_expert_plan: boolean
  tags: string[]
  likes_count: number
  saves_count: number
  duration_estimate_minutes?: number
  energy_level_required?: number
  recommended_time_of_day?: string[]
  suitable_contexts?: string[]
  energy_plan_components: PlanComponent[]
}

type Progress = {
  id: string
  user_id: string
  plan_id: string
  component_id: string
  completed_at: string | null
  created_at: string
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

const NewPlanDialog = ({ onPlanCreated }: { onPlanCreated: () => void }) => {
  const { session } = useAuth()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    plan_type: "quick_boost" as Plan["plan_type"],
    category: "charged" as Plan["category"],
    tags: [] as string[],
    visibility: "private" as Plan["visibility"],
    duration_estimate_minutes: 30,
    energy_level_required: 5,
  })

  const createPlanMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (!session?.user) throw new Error("Not authenticated")
      
      const { error } = await supabase
        .from('energy_plans')
        .insert({
          ...data,
          created_by: session.user.id,
        })

      if (error) throw error
    },
    onSuccess: () => {
      toast({
        title: "Plan Created",
        description: "Your new energy plan has been created"
      })
      onPlanCreated()
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create plan",
        variant: "destructive"
      })
    }
  })

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create New Plan
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Energy Plan</DialogTitle>
          <DialogDescription>
            Create a new energy plan to share with others or keep for yourself
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input 
              value={formData.title}
              onChange={e => setFormData(d => ({ ...d, title: e.target.value }))}
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={formData.description || ""}
              onChange={e => setFormData(d => ({ ...d, description: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Category</Label>
              <Select 
                value={formData.category}
                onValueChange={val => setFormData(d => ({ ...d, category: val as "charged" | "recharged" }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="charged">Charged</SelectItem>
                  <SelectItem value="recharged">Recharged</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Type</Label>
              <Select
                value={formData.plan_type}
                onValueChange={val => setFormData(d => ({ ...d, plan_type: val as Plan["plan_type"] }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quick_boost">Quick Boost</SelectItem>
                  <SelectItem value="sustained_energy">Sustained Energy</SelectItem>
                  <SelectItem value="mental_clarity">Mental Clarity</SelectItem>
                  <SelectItem value="physical_energy">Physical Energy</SelectItem>
                  <SelectItem value="morning_routine">Morning Routine</SelectItem>
                  <SelectItem value="deep_relaxation">Deep Relaxation</SelectItem>
                  <SelectItem value="stress_relief">Stress Relief</SelectItem>
                  <SelectItem value="wind_down">Wind Down</SelectItem>
                  <SelectItem value="sleep_prep">Sleep Prep</SelectItem>
                  <SelectItem value="recovery">Recovery</SelectItem>
                  <SelectItem value="meditation">Meditation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Duration (minutes)</Label>
              <Input 
                type="number"
                min={5}
                max={180}
                value={formData.duration_estimate_minutes}
                onChange={e => setFormData(d => ({ ...d, duration_estimate_minutes: parseInt(e.target.value) }))}
              />
            </div>
            <div>
              <Label>Energy Level Required (1-10)</Label>
              <Input
                type="number"
                min={1}
                max={10} 
                value={formData.energy_level_required}
                onChange={e => setFormData(d => ({ ...d, energy_level_required: parseInt(e.target.value) }))}
              />
            </div>
          </div>
          <div>
            <Label>Visibility</Label>
            <Select
              value={formData.visibility}
              onValueChange={val => setFormData(d => ({ ...d, visibility: val as "private" | "public" | "shared" }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="shared">Shared</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button 
            className="w-full"
            onClick={() => createPlanMutation.mutate(formData)}
          >
            Create Plan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const EnergyPlans = () => {
  const { session } = useAuth()
  const { toast } = useToast()
  const [selectedTab, setSelectedTab] = useState("discover")
  const [selectedCategory, setSelectedCategory] = useState<'charged' | 'recharged' | null>(null)
  const queryClient = useQueryClient()

  const { data: publicPlans, isLoading: isLoadingPublic } = useQuery<Plan[]>({
    queryKey: ['energy-plans', 'public', selectedCategory],
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
      return data as Plan[]
    }
  })

  const { data: myPlans, isLoading: isLoadingMyPlans } = useQuery<Plan[]>({
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
      return data as Plan[]
    },
    enabled: !!session?.user?.id
  })

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
      return data.map(item => item.energy_plans) as Plan[]
    },
    enabled: !!session?.user?.id
  })

  const { data: planProgress } = useQuery<Progress[]>({
    queryKey: ['energy-plans', 'progress', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return []
      
      const { data, error } = await supabase
        .from('energy_plan_progress')
        .select('*')
        .eq('user_id', session.user.id)
      
      if (error) throw error
      return data as Progress[]
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

  const calculateProgress = (plan: Plan) => {
    if (!planProgress || !plan.energy_plan_components.length) return 0
    
    const completedSteps = planProgress.filter(
      p => p.plan_id === plan.id && p.completed_at
    ).length
    
    return (completedSteps / plan.energy_plan_components.length) * 100
  }

  const renderPlanCard = (plan: Plan) => {
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
          <NewPlanDialog onPlanCreated={() => {
            queryClient.invalidateQueries({ queryKey: ['energy-plans'] })
          }} />
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
