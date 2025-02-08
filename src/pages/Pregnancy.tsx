
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { format } from "date-fns"
import { Baby, Calendar, Activity, Brain, Heart } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"

type PregnancyData = {
  id: string
  due_date: string
  current_stage: 'preconception' | 'first_trimester' | 'second_trimester' | 'third_trimester' | 'postpartum'
  last_period_date: string | null
  is_high_risk: boolean
  healthcare_provider: string | null
  energy_support_needed: boolean
  focus_support_needed: boolean
}

const PregnancyPage = () => {
  const { toast } = useToast()
  const navigate = useNavigate()
  
  const { data: pregnancyData, isLoading } = useQuery({
    queryKey: ['pregnancy-tracking'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pregnancy_tracking')
        .select('*')
        .single()

      if (error) {
        console.error('Error fetching pregnancy data:', error)
        return null
      }

      return data as PregnancyData
    }
  })

  const { data: recentLogs } = useQuery({
    queryKey: ['pregnancy-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pregnancy_logs')
        .select('*')
        .order('date', { ascending: false })
        .limit(7)

      if (error) {
        console.error('Error fetching pregnancy logs:', error)
        return []
      }

      return data
    }
  })

  const handleEnergyPlanClick = () => {
    navigate('/energy-plans')
  }

  const handleFocusToolsClick = () => {
    navigate('/focus')
  }

  const handleLogDaily = () => {
    // This would open a modal or navigate to logging page
    toast({ 
      title: "Coming Soon!", 
      description: "Daily logging functionality will be available soon.",
      variant: "default"
    })
  }

  return (
    <div className="space-y-4 container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Baby className="h-5 w-5 text-pink-500" />
            Pregnancy Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading pregnancy data...</p>
          ) : pregnancyData ? (
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="font-semibold mb-2">Key Information</h3>
                <div className="space-y-2">
                  <p className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    Due Date: {format(new Date(pregnancyData.due_date), 'MMMM d, yyyy')}
                  </p>
                  <p className="capitalize">Current Stage: {pregnancyData.current_stage.replace(/_/g, ' ')}</p>
                  {pregnancyData.healthcare_provider && (
                    <p>Healthcare Provider: {pregnancyData.healthcare_provider}</p>
                  )}
                  <div className="flex flex-col gap-2 mt-4">
                    {pregnancyData.energy_support_needed && (
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={handleEnergyPlanClick}
                      >
                        View Energy Support Plans
                      </Button>
                    )}
                    {pregnancyData.focus_support_needed && (
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={handleFocusToolsClick}
                      >
                        Access Focus Tools
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Quick Actions</h3>
                <div className="space-y-2">
                  <Button 
                    onClick={handleLogDaily}
                    className="w-full"
                  >
                    Log Daily Entry
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <p className="mb-4">No pregnancy tracking data found. Would you like to start tracking?</p>
              <Button onClick={() => toast({ 
                title: "Coming Soon!", 
                description: "Pregnancy tracking setup will be available soon."
              })}>
                Set Up Tracking
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              Recent Measurements
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentLogs?.length ? (
              <div className="space-y-2">
                {recentLogs.map((log: any) => (
                  <div key={log.id} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                    <span>{format(new Date(log.date), 'MMM d')}</span>
                    <div className="flex gap-4">
                      {log.weight_kg && <span>{log.weight_kg} kg</span>}
                      {log.blood_pressure_systolic && (
                        <span>{log.blood_pressure_systolic}/{log.blood_pressure_diastolic}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No recent measurements logged</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Wellness Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Sleep Quality</span>
                <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full" 
                    style={{ width: `${(recentLogs?.[0]?.sleep_quality || 0) * 10}%` }}
                  />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>Energy Level</span>
                <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500 rounded-full" 
                    style={{ width: `${(recentLogs?.[0]?.energy_level || 0) * 10}%` }}
                  />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span>Mood Rating</span>
                <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-purple-500 rounded-full" 
                    style={{ width: `${(recentLogs?.[0]?.mood_rating || 0) * 10}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default PregnancyPage
