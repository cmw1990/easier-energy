
import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Activity, Weight, Heart, Apple, Moon, Brain, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/components/AuthProvider"
import type { PregnancyMetric } from "@/types/supabase"

type MetricCategory = 'weight' | 'blood_pressure' | 'nutrition' | 'exercise' | 'sleep' | 'mood'

const METRIC_CATEGORIES: { value: MetricCategory; label: string; icon: React.ElementType }[] = [
  { value: 'weight', label: 'Weight', icon: Weight },
  { value: 'blood_pressure', label: 'Blood Pressure', icon: Heart },
  { value: 'nutrition', label: 'Nutrition', icon: Apple },
  { value: 'exercise', label: 'Exercise', icon: Activity },
  { value: 'sleep', label: 'Sleep', icon: Moon },
  { value: 'mood', label: 'Mood', icon: Brain },
]

export function PregnancyMetrics() {
  const { session } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [selectedCategory, setSelectedCategory] = useState<MetricCategory>('weight')
  const [newMetric, setNewMetric] = useState({ value: '', notes: '' })

  const { data: metrics, isLoading } = useQuery({
    queryKey: ['pregnancy-metrics', selectedCategory],
    queryFn: async () => {
      if (!session?.user?.id) return null
      
      const { data, error } = await supabase
        .from('pregnancy_metrics')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('metric_category', selectedCategory)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error fetching metrics:', error)
        toast({
          title: "Error loading metrics",
          description: "Failed to load your pregnancy metrics",
          variant: "destructive"
        })
        return null
      }

      // Transform the data to match PregnancyMetric type
      return data.map(metric => ({
        id: metric.id,
        user_id: metric.user_id,
        date: metric.created_at,
        value: metric.value,
        notes: metric.notes || '',
        category: metric.category,
        metric_category: metric.metric_category,
        photo_url: metric.photo_url,
        created_at: metric.created_at
      })) as PregnancyMetric[]
    },
    enabled: !!session?.user?.id
  })

  const addMetricMutation = useMutation({
    mutationFn: async (metricData: { value: number, notes: string }) => {
      if (!session?.user?.id) throw new Error("Not authenticated")
      
      const { data, error } = await supabase
        .from('pregnancy_metrics')
        .insert([{
          user_id: session.user.id,
          value: metricData.value,
          notes: metricData.notes,
          metric_category: selectedCategory,
          metric_type: selectedCategory, // Required field from schema
          category: selectedCategory, // Required field from schema
          created_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pregnancy-metrics'] })
      setNewMetric({ value: '', notes: '' })
      toast({
        title: "Success",
        description: "Metric added successfully",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add metric",
        variant: "destructive"
      })
    }
  })

  const handleAddMetric = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMetric.value) return
    
    addMetricMutation.mutate({
      value: parseFloat(newMetric.value),
      notes: newMetric.notes
    })
  }

  const getMetricUnit = (category: MetricCategory) => {
    switch (category) {
      case 'weight':
        return 'kg'
      case 'blood_pressure':
        return 'mmHg'
      case 'exercise':
        return 'minutes'
      default:
        return ''
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-pink-500" />
          Pregnancy Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex gap-4">
            <Select
              value={selectedCategory}
              onValueChange={(value: MetricCategory) => setSelectedCategory(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select metric" />
              </SelectTrigger>
              <SelectContent>
                {METRIC_CATEGORIES.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <form onSubmit={handleAddMetric} className="flex gap-2 flex-1">
              <div className="flex-1">
                <Label htmlFor="value" className="sr-only">Value</Label>
                <Input
                  id="value"
                  type="number"
                  placeholder={`Enter ${selectedCategory} value`}
                  value={newMetric.value}
                  onChange={(e) => setNewMetric(prev => ({ ...prev, value: e.target.value }))}
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="notes" className="sr-only">Notes</Label>
                <Input
                  id="notes"
                  placeholder="Add notes (optional)"
                  value={newMetric.notes}
                  onChange={(e) => setNewMetric(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>
              <Button type="submit" disabled={addMetricMutation.isPending}>
                {addMetricMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Add'
                )}
              </Button>
            </form>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : metrics && metrics.length > 0 ? (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metrics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) => format(new Date(date), 'MMM d')}
                  />
                  <YAxis
                    label={{ 
                      value: getMetricUnit(selectedCategory), 
                      angle: -90, 
                      position: 'insideLeft' 
                    }}
                  />
                  <Tooltip
                    labelFormatter={(date) => format(new Date(date), 'PPP')}
                    formatter={(value: number) => [
                      `${value}${getMetricUnit(selectedCategory)}`,
                      selectedCategory
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#ec4899"
                    strokeWidth={2}
                    dot={{ fill: '#ec4899' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No {selectedCategory} data recorded yet. Start tracking your progress!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
