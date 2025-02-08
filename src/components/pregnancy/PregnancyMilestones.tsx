
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import { Baby, Calendar, Heart, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/components/AuthProvider"
import { useToast } from "@/hooks/use-toast"
import { PregnancyMilestoneForm } from "./PregnancyMilestoneForm"
import { AchievementCelebration } from "@/components/achievements/AchievementCelebration"
import type { PregnancyMilestone } from "@/types/supabase"

export const PregnancyMilestones = () => {
  const { session } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [formOpen, setFormOpen] = useState(false)
  const [celebratingMilestone, setCelebratingMilestone] = useState<PregnancyMilestone | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

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
        toast({
          title: "Error",
          description: "Failed to load milestones",
          variant: "destructive"
        })
        return null
      }

      return data as PregnancyMilestone[]
    },
    enabled: !!session?.user?.id
  })

  const addMilestoneMutation = useMutation({
    mutationFn: async (milestone: Omit<PregnancyMilestone, 'id' | 'user_id' | 'created_at' | 'celebration_shared'>) => {
      if (!session?.user?.id) throw new Error("Not authenticated")
      
      const { data, error } = await supabase
        .from('pregnancy_milestones')
        .insert([{
          milestone_type: milestone.milestone_type,
          custom_title: milestone.custom_title,
          description: milestone.description,
          achieved_at: milestone.achieved_at,
          week_number: milestone.week_number,
          category: milestone.category,
          photo_urls: milestone.photo_urls,
          user_id: session.user.id,
          celebration_shared: false
        }])
        .select()
        .single()

      if (error) throw error
      return data as PregnancyMilestone
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['pregnancy-milestones'] })
      toast({
        title: "Success",
        description: "Milestone added successfully!"
      })
      setFormOpen(false)
      setCelebratingMilestone(data)
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add milestone",
        variant: "destructive"
      })
    }
  })

  const shareMilestoneMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!session?.user?.id) return null
      
      const { error } = await supabase
        .from('pregnancy_milestones')
        .update({ celebration_shared: true })
        .eq('id', id)
        .eq('user_id', session.user.id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pregnancy-milestones'] })
      toast({
        title: "Success",
        description: "Milestone shared successfully!"
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to share milestone",
        variant: "destructive"
      })
    }
  })

  const handleAddMilestone = (values: any) => {
    addMilestoneMutation.mutate(values)
  }

  const handleShareMilestone = (id: string) => {
    shareMilestoneMutation.mutate(id)
  }

  const categories = milestones 
    ? [...new Set(milestones.map(m => m.category).filter(Boolean))]
    : []

  const filteredMilestones = selectedCategory
    ? milestones?.filter(m => m.category === selectedCategory)
    : milestones

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Baby className="h-5 w-5 text-pink-500" />
          Pregnancy Milestones
        </CardTitle>
        <div className="flex gap-2">
          {categories.length > 0 && (
            <select 
              className="border rounded px-2 py-1"
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value || null)}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          )}
          <PregnancyMilestoneForm 
            open={formOpen}
            onOpenChange={setFormOpen}
            onSubmit={handleAddMilestone}
          />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>Loading milestones...</p>
        ) : filteredMilestones && filteredMilestones.length > 0 ? (
          <div className="space-y-4">
            {filteredMilestones.map((milestone) => (
              <div 
                key={milestone.id} 
                className="flex items-start justify-between p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
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
                  {milestone.category && (
                    <span className="inline-block px-2 py-1 text-xs rounded-full bg-pink-100 text-pink-800">
                      {milestone.category}
                    </span>
                  )}
                  {milestone.photo_urls && milestone.photo_urls.length > 0 && (
                    <div className="flex gap-2 mt-2">
                      {milestone.photo_urls.map((url, index) => (
                        <img 
                          key={index}
                          src={url} 
                          alt={`Milestone photo ${index + 1}`}
                          className="w-16 h-16 object-cover rounded"
                        />
                      ))}
                    </div>
                  )}
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

      {celebratingMilestone && (
        <AchievementCelebration
          title="New Milestone!"
          description={`Congratulations on reaching: ${celebratingMilestone.custom_title || celebratingMilestone.milestone_type}`}
          points={50}
          icon="baby"
          onComplete={() => setCelebratingMilestone(null)}
        />
      )}
    </Card>
  )
}
