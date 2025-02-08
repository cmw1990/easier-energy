
import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Plan, ProgressRecord } from "@/types/energyPlans"
import { Brain, Coffee, Flower, Heart, Moon, Share2, Star, Sun, Timer, Target, Wind, Zap } from "lucide-react"

const PlanTypeIcons: Record<string, any> = {
  energizing_boost: Zap,
  sustained_focus: Coffee,
  mental_clarity: Brain,
  physical_vitality: Target,
  deep_relaxation: Flower,
  stress_relief: Heart,
  evening_winddown: Wind,
  sleep_preparation: Moon,
  meditation: Sun,
}

const CategoryColors = {
  charged: "bg-orange-100 text-orange-800 dark:bg-orange-900/30",
  recharged: "bg-blue-100 text-blue-800 dark:bg-blue-900/30"
} as const

interface PlanCardProps {
  plan: Plan
  progress?: ProgressRecord[]
  onSave?: (planId: string) => void
  onShare?: (plan: Plan) => void
  isSaved?: boolean
  showActions?: boolean
}

export const PlanCard = ({ plan, progress, onSave, onShare, isSaved, showActions = true }: PlanCardProps) => {
  const Icon = PlanTypeIcons[plan.plan_type] || Brain
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const calculateProgress = () => {
    if (!progress || !plan.energy_plan_components.length) return 0
    const completedSteps = progress.filter(p => p.plan_id === plan.id && p.completed_at).length
    return (completedSteps / plan.energy_plan_components.length) * 100
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
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
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Timer className="h-4 w-4" />
              {plan.estimated_duration_minutes} minutes
            </div>
            <div className="flex items-center gap-1">
              <Target className="h-4 w-4" />
              Energy Level {plan.energy_level_required}/10
            </div>
          </div>

          {(plan.recommended_time_of_day?.length || plan.suitable_contexts?.length) && (
            <div className="space-y-2">
              {plan.recommended_time_of_day?.length ? (
                <div className="flex flex-wrap gap-2">
                  {plan.recommended_time_of_day.map(time => (
                    <Badge key={time} variant="outline">{time}</Badge>
                  ))}
                </div>
              ) : null}
              
              {plan.suitable_contexts?.length ? (
                <div className="flex flex-wrap gap-2">
                  {plan.suitable_contexts.map(context => (
                    <Badge key={context} variant="outline">{context}</Badge>
                  ))}
                </div>
              ) : null}
            </div>
          )}
          
          {plan.tags.length > 0 && (
            <div className="flex gap-2">
              {plan.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          
          {progress && progress.length > 0 && (
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Progress</div>
              <Progress value={calculateProgress()} className="h-2" />
            </div>
          )}
          
          {showActions && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Star className="h-4 w-4" />
                {plan.likes_count} likes
              </div>
              
              <div className="flex gap-2">
                {!isSaved && onSave && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSave(plan.id)}
                  >
                    Save Plan
                  </Button>
                )}
                
                {onShare && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onShare(plan)}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                )}
                
                <Button size="sm">View Details</Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
