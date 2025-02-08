
import { useState } from "react"
import { useAuth } from "@/components/AuthProvider"
import { useToast } from "@/hooks/use-toast"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export function TeaIntakeForm() {
  const { session } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [form, setForm] = useState({
    teaName: "",
    brewingMethod: "hot_steep",
    steepTime: "",
    waterTemperature: "",
    amount: "",
    rating: "5",
    effects: "",
    notes: ""
  })

  const logTeaMutation = useMutation({
    mutationFn: async (values: typeof form) => {
      const { error } = await supabase
        .from('herbal_tea_logs')
        .insert({
          user_id: session?.user?.id,
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
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="teaName">Tea Name *</Label>
              <Input
                id="teaName"
                value={form.teaName}
                onChange={e => setForm(prev => ({ ...prev, teaName: e.target.value }))}
                placeholder="Enter tea name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="brewingMethod">Brewing Method</Label>
              <Select 
                value={form.brewingMethod}
                onValueChange={value => setForm(prev => ({ ...prev, brewingMethod: value }))}
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
              <Select 
                value={form.rating}
                onValueChange={value => setForm(prev => ({ ...prev, rating: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Rate tea" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map(rating => (
                    <SelectItem key={rating} value={rating.toString()}>
                      {rating}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

          <Button type="submit">Log Tea Intake</Button>
        </form>
      </CardContent>
    </Card>
  )
}
