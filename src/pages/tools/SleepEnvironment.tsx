
import React, { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TopNav } from "@/components/layout/TopNav"
import { ToolAnalyticsWrapper } from "@/components/tools/ToolAnalyticsWrapper"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Thermometer, Droplet, VolumeX, Sun, Wind, CloudFog } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { format } from "date-fns"

type SleepEnvironmentLog = {
  id: string
  temperature: number
  humidity: number
  noise_level: number
  light_level: number
  ventilation_rating: number
  comfort_rating: number
  notes: string
  date: string
  created_at: string
  updated_at: string
}

export default function SleepEnvironment() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [temperature, setTemperature] = useState("")
  const [humidity, setHumidity] = useState("")
  const [noiseLevel, setNoiseLevel] = useState("")
  const [lightLevel, setLightLevel] = useState("")
  const [ventilationRating, setVentilationRating] = useState("")
  const [comfortRating, setComfortRating] = useState("")
  const [notes, setNotes] = useState("")

  const { data: environmentLogs, isLoading } = useQuery({
    queryKey: ["sleep_environment_logs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sleep_environment_logs")
        .select("*")
        .order("date", { ascending: false })
        .limit(7)

      if (error) throw error
      return data as SleepEnvironmentLog[]
    },
  })

  const addEnvironmentLog = useMutation({
    mutationFn: async (values: {
      temperature: number
      humidity: number
      noise_level: number
      light_level: number
      ventilation_rating: number
      comfort_rating: number
      notes: string
    }) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { error } = await supabase.from("sleep_environment_logs").insert([
        {
          user_id: user.id,
          ...values,
        },
      ])

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sleep_environment_logs"] })
      toast({
        title: "Environment log added",
        description: "Your sleep environment data has been recorded successfully.",
      })
      // Reset form
      setTemperature("")
      setHumidity("")
      setNoiseLevel("")
      setLightLevel("")
      setVentilationRating("")
      setComfortRating("")
      setNotes("")
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to record environment data. Please try again.",
        variant: "destructive",
      })
      console.error("Error adding environment log:", error)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const values = {
      temperature: parseFloat(temperature),
      humidity: parseFloat(humidity),
      noise_level: parseFloat(noiseLevel),
      light_level: parseFloat(lightLevel),
      ventilation_rating: parseInt(ventilationRating),
      comfort_rating: parseInt(comfortRating),
      notes,
    }

    // Validation
    if (
      !temperature || !humidity || !noiseLevel || !lightLevel ||
      !ventilationRating || !comfortRating
    ) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    if (values.ventilation_rating < 1 || values.ventilation_rating > 5 ||
        values.comfort_rating < 1 || values.comfort_rating > 5) {
      toast({
        title: "Invalid ratings",
        description: "Ratings must be between 1 and 5.",
        variant: "destructive",
      })
      return
    }

    addEnvironmentLog.mutate(values)
  }

  const chartData = environmentLogs?.map((log) => ({
    date: format(new Date(log.date), "MMM dd"),
    temperature: log.temperature,
    humidity: log.humidity,
    noise: log.noise_level,
    light: log.light_level,
  })).reverse()

  return (
    <ToolAnalyticsWrapper 
      toolName="sleep-environment"
      toolType="tracking"
      toolSettings={{}}
    >
      <div className="min-h-screen bg-background">
        <TopNav />
        <div className="container mx-auto p-4 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CloudFog className="h-6 w-6" />
                  Log Environment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="temperature">Temperature (°C)</Label>
                    <div className="flex items-center gap-2">
                      <Thermometer className="h-4 w-4 text-muted-foreground" />
                      <Input
                        id="temperature"
                        type="number"
                        step="0.1"
                        value={temperature}
                        onChange={(e) => setTemperature(e.target.value)}
                        placeholder="Enter room temperature"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="humidity">Humidity (%)</Label>
                    <div className="flex items-center gap-2">
                      <Droplet className="h-4 w-4 text-muted-foreground" />
                      <Input
                        id="humidity"
                        type="number"
                        step="1"
                        min="0"
                        max="100"
                        value={humidity}
                        onChange={(e) => setHumidity(e.target.value)}
                        placeholder="Enter humidity level"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="noiseLevel">Noise Level (dB)</Label>
                    <div className="flex items-center gap-2">
                      <VolumeX className="h-4 w-4 text-muted-foreground" />
                      <Input
                        id="noiseLevel"
                        type="number"
                        step="1"
                        value={noiseLevel}
                        onChange={(e) => setNoiseLevel(e.target.value)}
                        placeholder="Enter noise level"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lightLevel">Light Level (lux)</Label>
                    <div className="flex items-center gap-2">
                      <Sun className="h-4 w-4 text-muted-foreground" />
                      <Input
                        id="lightLevel"
                        type="number"
                        step="1"
                        value={lightLevel}
                        onChange={(e) => setLightLevel(e.target.value)}
                        placeholder="Enter light level"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ventilationRating">Ventilation Rating (1-5)</Label>
                    <div className="flex items-center gap-2">
                      <Wind className="h-4 w-4 text-muted-foreground" />
                      <Input
                        id="ventilationRating"
                        type="number"
                        min="1"
                        max="5"
                        value={ventilationRating}
                        onChange={(e) => setVentilationRating(e.target.value)}
                        placeholder="Rate ventilation"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="comfortRating">Overall Comfort Rating (1-5)</Label>
                    <Input
                      id="comfortRating"
                      type="number"
                      min="1"
                      max="5"
                      value={comfortRating}
                      onChange={(e) => setComfortRating(e.target.value)}
                      placeholder="Rate overall comfort"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Input
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add any additional notes"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={addEnvironmentLog.isPending}
                  >
                    {addEnvironmentLog.isPending ? "Saving..." : "Log Environment"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Environment Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  {chartData && chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="temperature" 
                          stroke="#8884d8" 
                          name="Temperature" 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="humidity" 
                          stroke="#82ca9d" 
                          name="Humidity" 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="noise" 
                          stroke="#ffc658" 
                          name="Noise" 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="light" 
                          stroke="#ff7300" 
                          name="Light" 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground">
                      No environment data available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Optimal Sleep Environment</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 list-disc list-inside text-muted-foreground">
                  <li>Temperature: 18-22°C (65-72°F)</li>
                  <li>Humidity: 30-50%</li>
                  <li>Noise Level: Below 30 dB</li>
                  <li>Light Level: Below 5 lux</li>
                  <li>Ensure good ventilation for fresh air</li>
                  <li>Consider using blackout curtains</li>
                  <li>Use white noise if ambient noise is an issue</li>
                  <li>Keep electronics away from the bed</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ToolAnalyticsWrapper>
  )
}
