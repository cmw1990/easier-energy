
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Baby, Calendar, Activity, Brain, Heart, Moon, Sun, Droplet } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/components/AuthProvider"
import { PregnancyMilestones } from "@/components/pregnancy/PregnancyMilestones"
import { PregnancyWellnessAnalysis } from "@/components/pregnancy/PregnancyWellnessAnalysis"
import type { PregnancyWellnessCorrelationsRow } from "@/types/supabase"

const PregnancyPage = () => {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [selectedTab, setSelectedTab] = useState("overview")
  const { session } = useAuth()

  const { data: pregnancyData, isLoading } = useQuery({
    queryKey: ['pregnancy-tracking'],
    queryFn: async () => {
      if (!session?.user?.id) return null
      
      const { data, error } = await supabase
        .from('pregnancy_tracking')
        .select('*')
        .eq('user_id', session.user.id)
        .single()

      if (error) {
        console.error('Error fetching pregnancy data:', error)
        return null
      }

      return data
    },
    enabled: !!session?.user?.id
  })

  const { data: wellnessCorrelations } = useQuery<PregnancyWellnessCorrelationsRow>({
    queryKey: ['pregnancy-wellness-correlations'],
    queryFn: async () => {
      if (!session?.user?.id) return null
      
      const { data, error } = await supabase
        .from('pregnancy_wellness_correlations')
        .select('*')
        .eq('user_id', session.user.id)
        .order('date', { ascending: false })
        .limit(1)
        .maybeSingle()
      
      if (error) throw error
      return data
    },
    enabled: !!session?.user?.id
  })

  const handleLogDaily = () => {
    navigate('/pregnancy-log')
  }

  return (
    <div className="space-y-4 container mx-auto p-4">
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="wellness">Wellness</TabsTrigger>
          <TabsTrigger value="tracking">Tracking</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
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
                        {pregnancyData.due_date && (
                          <p className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            Due Date: {new Date(pregnancyData.due_date).toLocaleDateString()}
                          </p>
                        )}
                        <p className="capitalize flex items-center gap-2">
                          <Activity className="h-4 w-4 text-muted-foreground" />
                          Stage: {pregnancyData.current_stage?.replace(/_/g, ' ')}
                        </p>
                        {pregnancyData.healthcare_provider && (
                          <p className="flex items-center gap-2">
                            <Heart className="h-4 w-4 text-muted-foreground" />
                            Provider: {pregnancyData.healthcare_provider}
                          </p>
                        )}
                      </div>
                    </div>
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
          <PregnancyWellnessAnalysis correlations={wellnessCorrelations} />
        </TabsContent>

        <TabsContent value="tracking">
          <Card>
            <CardHeader>
              <CardTitle>Daily Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleLogDaily}
                className="w-full"
              >
                Log Daily Entry
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="milestones">
          <PregnancyMilestones />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default PregnancyPage
