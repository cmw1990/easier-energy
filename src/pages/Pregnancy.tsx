
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { format } from "date-fns"
import { Baby, Calendar, Activity, Brain, Heart, Moon, Sun, Droplet, Nutrition } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type PregnancyData = {
  id: string
  due_date: string
  current_stage: 'preconception' | 'first_trimester' | 'second_trimester' | 'third_trimester' | 'postpartum'
  last_period_date: string | null
  is_high_risk: boolean
  healthcare_provider: string | null
  energy_support_needed: boolean
  focus_support_needed: boolean
  wellness_goals: string[] | null
}

const PregnancyPage = () => {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [selectedTab, setSelectedTab] = useState("overview")
  
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

  const { data: wellnessCorrelations } = useQuery({
    queryKey: ['pregnancy-wellness-correlations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pregnancy_wellness_correlations')
        .select('*')
        .order('date', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (error) {
        console.error('Error fetching wellness correlations:', error)
        return null
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
    navigate('/pregnancy-log')
  }

  const handleSleepClick = () => {
    navigate('/tools/Sleep')
  }

  const handleMeditationClick = () => {
    navigate('/Meditation')
  }

  const handleNutritionClick = () => {
    navigate('/Food')
  }

  return (
    <div className="space-y-4 container mx-auto p-4">
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="wellness">Wellness</TabsTrigger>
          <TabsTrigger value="tracking">Tracking</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Baby className="h-5 w-5 text-pink-500" />
                Pregnancy Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p>Loading pregnancy data...</p>
              ) : pregnancyData ? (
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <h3 className="font-semibold">Key Information</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <p className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          Due Date: {format(new Date(pregnancyData.due_date), 'MMMM d, yyyy')}
                        </p>
                        <p className="capitalize flex items-center gap-2">
                          <Activity className="h-4 w-4 text-muted-foreground" />
                          Stage: {pregnancyData.current_stage.replace(/_/g, ' ')}
                        </p>
                        {pregnancyData.healthcare_provider && (
                          <p className="flex items-center gap-2">
                            <Heart className="h-4 w-4 text-muted-foreground" />
                            Provider: {pregnancyData.healthcare_provider}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        {pregnancyData.wellness_goals && (
                          <div>
                            <p className="text-sm font-medium">Wellness Goals</p>
                            <ul className="list-disc list-inside text-sm text-muted-foreground">
                              {pregnancyData.wellness_goals.map((goal, index) => (
                                <li key={index}>{goal}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={handleSleepClick}
                    >
                      <Moon className="mr-2 h-4 w-4" />
                      Sleep Tracking
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={handleMeditationClick}
                    >
                      <Brain className="mr-2 h-4 w-4" />
                      Meditation
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={handleNutritionClick}
                    >
                      <Nutrition className="mr-2 h-4 w-4" />
                      Nutrition
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <p className="mb-4">No pregnancy tracking data found. Would you like to start tracking?</p>
                  <Button onClick={() => navigate('/pregnancy-setup')}>
                    Set Up Tracking
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wellness">
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
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>Sleep Quality</span>
                      <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full" 
                          style={{ width: `${(recentLogs?.[0]?.sleep_quality || 0) * 10}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Energy Level</span>
                      <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500 rounded-full" 
                          style={{ width: `${(recentLogs?.[0]?.energy_level || 0) * 10}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Mood Rating</span>
                      <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-purple-500 rounded-full" 
                          style={{ width: `${(recentLogs?.[0]?.mood_rating || 0) * 10}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {wellnessCorrelations && (
                    <div className="pt-4 border-t">
                      <h4 className="font-medium mb-2">Wellness Insights</h4>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        {wellnessCorrelations.energy_pattern && (
                          <p>Energy: {wellnessCorrelations.energy_pattern.summary}</p>
                        )}
                        {wellnessCorrelations.sleep_pattern && (
                          <p>Sleep: {wellnessCorrelations.sleep_pattern.summary}</p>
                        )}
                        {wellnessCorrelations.focus_pattern && (
                          <p>Focus: {wellnessCorrelations.focus_pattern.summary}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tracking">
          <Card>
            <CardHeader>
              <CardTitle>Daily Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <Button 
                  onClick={handleLogDaily}
                  className="w-full"
                >
                  Log Daily Entry
                </Button>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-medium mb-2">Today's Stats</h4>
                    {recentLogs?.[0] ? (
                      <div className="space-y-2">
                        <p>Water: {recentLogs[0].water_intake_ml}ml</p>
                        <p>Exercise: {recentLogs[0].exercise_minutes} mins</p>
                        <p>Symptoms: {recentLogs[0].symptoms?.join(', ') || 'None recorded'}</p>
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No data logged today</p>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Weekly Progress</h4>
                    <Progress value={70} className="mb-2" />
                    <p className="text-sm text-muted-foreground">5/7 days logged this week</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="support">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Energy & Focus Support</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pregnancyData?.energy_support_needed && (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={handleEnergyPlanClick}
                    >
                      <Sun className="mr-2 h-4 w-4" />
                      View Energy Support Plans
                    </Button>
                  )}
                  {pregnancyData?.focus_support_needed && (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={handleFocusToolsClick}
                    >
                      <Brain className="mr-2 h-4 w-4" />
                      Access Focus Tools
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Wellness Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate('/tools/meditation')}
                  >
                    <Brain className="mr-2 h-4 w-4" />
                    Pregnancy Meditations
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate('/tools/exercises')}
                  >
                    <Activity className="mr-2 h-4 w-4" />
                    Safe Exercises
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default PregnancyPage
