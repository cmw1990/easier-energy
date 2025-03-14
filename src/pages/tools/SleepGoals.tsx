
import React from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TopNav } from "@/components/layout/TopNav"
import { ToolAnalyticsWrapper } from "@/components/tools/ToolAnalyticsWrapper"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Moon, Clock, Bell } from "lucide-react"
import { format, parse } from "date-fns"
import { Database } from "@/integrations/supabase/types"

type SleepGoal = Database['public']['Tables']['sleep_goals']['Row']

export default function SleepGoals() {
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data: sleepGoal, isLoading } = useQuery({
    queryKey: ['sleep_goals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sleep_goals')
        .select('*')
        .limit(1)
        .single()
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching sleep goals:', error)
        return null
      }
      
      return data as SleepGoal
    }
  })

  const updateGoalsMutation = useMutation({
    mutationFn: async (values: {
      target_sleep_duration: number
      target_bedtime: string
      target_wake_time: string
    }) => {
      if (sleepGoal?.id) {
        const { error } = await supabase
          .from('sleep_goals')
          .update(values)
          .eq('id', sleepGoal.id)
        
        if (error) throw error
      } else {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('User not authenticated')
        
        const { error } = await supabase
          .from('sleep_goals')
          .insert({
            user_id: user.id,
            target_sleep_duration: values.target_sleep_duration,
            target_bedtime: values.target_bedtime,
            target_wake_time: values.target_wake_time
          })
        
        if (error) throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sleep_goals'] })
      toast({
        title: "Goals Updated",
        description: "Your sleep goals have been saved successfully."
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update sleep goals. Please try again.",
        variant: "destructive"
      })
      console.error('Error updating sleep goals:', error)
    }
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const values = {
      target_sleep_duration: Number(formData.get('duration')),
      target_bedtime: formData.get('bedtime') as string,
      target_wake_time: formData.get('wakeTime') as string,
    }

    updateGoalsMutation.mutate(values)
  }

  const formatTimeForInput = (timeString: string | undefined) => {
    if (!timeString) return ""
    try {
      const date = parse(timeString, 'HH:mm:ss', new Date())
      return format(date, 'HH:mm')
    } catch {
      return ""
    }
  }

  return (
    <ToolAnalyticsWrapper 
      toolName="sleep-goals"
      toolType="tracking"
      toolSettings={{}}
    >
      <div className="min-h-screen bg-background">
        <TopNav />
        <div className="container mx-auto p-4">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Moon className="h-6 w-6" />
                Sleep Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="duration">Target Sleep Duration (hours)</Label>
                  <Input
                    id="duration"
                    name="duration"
                    type="number"
                    min="4"
                    max="12"
                    step="0.5"
                    defaultValue={sleepGoal?.target_sleep_duration || 8}
                    className="max-w-xs"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bedtime">Target Bedtime</Label>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="bedtime"
                      name="bedtime"
                      type="time"
                      defaultValue={formatTimeForInput(sleepGoal?.target_bedtime) || "22:30"}
                      className="max-w-xs"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="wakeTime">Target Wake Time</Label>
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="wakeTime"
                      name="wakeTime"
                      type="time"
                      defaultValue={formatTimeForInput(sleepGoal?.target_wake_time) || "06:30"}
                      className="max-w-xs"
                    />
                  </div>
                </div>

                <Button 
                  type="submit"
                  disabled={updateGoalsMutation.isPending}
                  className="w-full md:w-auto"
                >
                  {updateGoalsMutation.isPending ? "Saving..." : "Save Goals"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tips for Healthy Sleep Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                <li>Most adults need 7-9 hours of sleep per night</li>
                <li>Try to go to bed and wake up at the same time every day</li>
                <li>Allow for a 15-30 minute wind-down period before your target bedtime</li>
                <li>Consider your natural circadian rhythm when setting sleep goals</li>
                <li>Adjust goals gradually by 15-minute increments</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolAnalyticsWrapper>
  )
}
