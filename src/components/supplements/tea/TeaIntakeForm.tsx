
import { useState } from "react"
import { useAuth } from "@/components/AuthProvider"
import { useToast } from "@/hooks/use-toast"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Info } from "lucide-react"

type Form = {
  teaName: string;
  brewingMethod: "hot_steep" | "cold_brew" | "gongfu" | "western";
  steepTime: string;
  waterTemperature: string;
  amount: string;
  rating: string;
  effects: string;
  notes: string;
}

export function TeaIntakeForm() {
  const { session } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [form, setForm] = useState<Form>({
    teaName: "",
    brewingMethod: "hot_steep",
    steepTime: "",
    waterTemperature: "",
    amount: "",
    rating: "5",
    effects: "",
    notes: ""
  })

  // Fetch tea suggestions from the database
  const { data: teaSuggestions } = useQuery({
    queryKey: ['herbal-teas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('herbal_teas')
        .select('name, optimal_temp_celsius, steep_time_range_seconds')
        .order('name')
      
      if (error) throw error
      return data
    }
  })

  const logTeaMutation = useMutation({
    mutationFn: async (values: Form) => {
      if (!session?.user?.id) throw new Error("User not authenticated")

      const { error } = await supabase
        .from('herbal_tea_logs')
        .insert({
          user_id: session.user.id,
          tea_name: values.teaName,
          brewing_method: values.brewingMethod,
          steep_time_seconds: parseInt(values.steepTime),
          water_temperature: parseInt(values.waterTemperature),
          amount_grams: parseFloat(values.amount),
          rating: parseInt(values.rating),
          effects: values.effects ? values.effects.split(',').map(e => e.trim()) : [],
          notes: values.notes,
        })

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tea-logs'] })
      toast({
        title: "Success",
        description: "Tea intake logged successfully",
      })
      setForm({
        teaName: "",
        brewingMethod: "hot_steep",
        steepTime: "",
        waterTemperature: "",
        amount: "",
        rating: "5",
        effects: "",
        notes: ""
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to log tea intake",
        variant: "destructive",
      })
      console.error("Error logging tea:", error)
    }
  })

  const handleTeaSelection = (teaName: string) => {
    const selectedTea = teaSuggestions?.find(t => t.name === teaName)
    if (selectedTea) {
      setForm(prev => ({
        ...prev,
        teaName,
        waterTemperature: selectedTea.optimal_temp_celsius?.toString() || "",
        steepTime: selectedTea.steep_time_range_seconds?.[0]?.toString() || ""
      }))
    } else {
      setForm(prev => ({
        ...prev,
        teaName
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.teaName) {
      toast({
        title: "Error",
        description: "Please enter the tea name",
        variant: "destructive",
      })
      return
    }
    logTeaMutation.mutate(form)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Log Tea Intake</CardTitle>
        <CardDescription>Track your tea consumption and its effects</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="teaName">Tea Name *</Label>
              <Select
                value={form.teaName}
                onValueChange={handleTeaSelection}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select or enter tea name" />
                </SelectTrigger>
                <SelectContent>
                  {teaSuggestions?.map((tea) => (
                    <SelectItem key={tea.name} value={tea.name}>
                      {tea.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="brewingMethod">Brewing Method</Label>
              <Select 
                value={form.brewingMethod}
                onValueChange={value => setForm(prev => ({ ...prev, brewingMethod: value as Form["brewingMethod"] }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hot_steep">Hot Steep</SelectItem>
                  <SelectItem value="cold_brew">Cold Brew</SelectItem>
                  <SelectItem value="gongfu">Gongfu</SelectItem>
                  <SelectItem value="western">Western</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="steepTime">Steep Time (seconds)</Label>
              <Input
                id="steepTime"
                type="number"
                value={form.steepTime}
                onChange={e => setForm(prev => ({ ...prev, steepTime: e.target.value }))}
                placeholder="Enter steep time"
              />
              {form.teaName && teaSuggestions?.find(t => t.name === form.teaName)?.steep_time_range_seconds && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  Recommended: {teaSuggestions.find(t => t.name === form.teaName)?.steep_time_range_seconds[0]}-
                  {teaSuggestions.find(t => t.name === form.teaName)?.steep_time_range_seconds[1]} seconds
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="waterTemperature">Water Temperature (°C)</Label>
              <Input
                id="waterTemperature"
                type="number"
                value={form.waterTemperature}
                onChange={e => setForm(prev => ({ ...prev, waterTemperature: e.target.value }))}
                placeholder="Enter temperature"
              />
              {form.teaName && teaSuggestions?.find(t => t.name === form.teaName)?.optimal_temp_celsius && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  Recommended: {teaSuggestions.find(t => t.name === form.teaName)?.optimal_temp_celsius}°C
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount (grams)</Label>
              <Input
                id="amount"
                type="number"
                step="0.1"
                value={form.amount}
                onChange={e => setForm(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="Enter amount in grams"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rating">Rating (1-5)</Label>
              <div className="pt-2">
                <Slider
                  value={[parseInt(form.rating)]}
                  onValueChange={([value]) => setForm(prev => ({ ...prev, rating: value.toString() }))}
                  max={5}
                  min={1}
                  step={1}
                />
              </div>
              <p className="text-sm text-center mt-2">{form.rating} / 5</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="effects">Effects (comma-separated)</Label>
              <Input
                id="effects"
                value={form.effects}
                onChange={e => setForm(prev => ({ ...prev, effects: e.target.value }))}
                placeholder="e.g., calming, energizing, focus"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={form.notes}
                onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Add any additional notes"
              />
            </div>
          </div>

          <Button type="submit" className="w-full">Log Tea Intake</Button>
        </form>
      </CardContent>
    </Card>
  )
}
