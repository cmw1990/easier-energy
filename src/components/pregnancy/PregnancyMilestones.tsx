
import { useQuery } from "@tanstack/react-query"
import { format } from "date-fns"
import { Baby, Calendar, Heart, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/components/AuthProvider"
import { useToast } from "@/hooks/use-toast"

export const PregnancyMilestones = () => {
  const { session } = useAuth()
  const { toast } = useToast()

  const { data: milestones, isLoading } = useQuery({
    queryKey: ['pregnancy-milestones'],
    queryFn: async () => {
      if (!session?.user?.id) return null
      
      const { data, error } = await supabase
        .from('pregnancy_milestones')
        .select('*')
        .eq('user_id', session.user.id)
        .order('achieved_at', { ascending: false })

      if (error) {
        console.error('Error fetching milestones:', error)
        return null
      }

      return data
    },
    enabled: !!session?.user?.id
  })

  const handleShareMilestone = async (id: string) => {
    if (!session?.user?.id) return

    const { error } = await supabase
      .from('pregnancy_milestones')
      .update({ celebration_shared: true })
      .eq('id', id)
      .eq('user_id', session.user.id)

    if (error) {
      toast({
        title: "Error",
        description: "Failed to share milestone",
        variant: "destructive"
      })
      return
    }

    toast({
      title: "Success",
      description: "Milestone shared successfully!"
    })
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Baby className="h-5 w-5 text-pink-500" />
          Pregnancy Milestones
        </CardTitle>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Milestone
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>Loading milestones...</p>
        ) : milestones && milestones.length > 0 ? (
          <div className="space-y-4">
            {milestones.map((milestone) => (
              <div 
                key={milestone.id} 
                className="flex items-start justify-between p-4 rounded-lg border bg-card"
              >
                <div className="space-y-1">
                  <h4 className="font-medium">{milestone.custom_title || milestone.milestone_type}</h4>
                  <p className="text-sm text-muted-foreground">{milestone.description}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(milestone.achieved_at), 'MMM d, yyyy')}
                    {milestone.week_number && (
                      <span className="ml-2">Week {milestone.week_number}</span>
                    )}
                  </div>
                </div>
                {!milestone.celebration_shared && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleShareMilestone(milestone.id)}
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            No milestones recorded yet. Add your first milestone to start tracking your pregnancy journey!
          </p>
        )}
      </CardContent>
    </Card>
  )
}
