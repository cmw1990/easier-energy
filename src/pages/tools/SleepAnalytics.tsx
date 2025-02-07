
import React from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TopNav } from "@/components/layout/TopNav"
import { ToolAnalyticsWrapper } from "@/components/tools/ToolAnalyticsWrapper"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts"
import { format } from "date-fns"
import { Brain, Moon, Sun, Activity, Percent, Clock } from "lucide-react"

type SleepAnalyticsSummary = {
  id: string
  date: string
  average_quality: number
  total_sleep_hours: number
  environment_score: number
  sleep_debt_hours: number
  sleep_efficiency: number
  consistency_score: number
}

export default function SleepAnalytics() {
  const { data: sleepAnalytics, isLoading } = useQuery({
    queryKey: ["sleep_analytics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sleep_analytics_summaries")
        .select("*")
        .order("date", { ascending: true })
        .limit(30)

      if (error) throw error
      return data as SleepAnalyticsSummary[]
    },
  })

  const { data: combinedData } = useQuery({
    queryKey: ["sleep_combined_data"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sleep_combined_data")
        .select("*")
        .order("date", { ascending: true })
        .limit(30)

      if (error) throw error
      return data
    },
  })

  const chartData = sleepAnalytics?.map(record => ({
    date: format(new Date(record.date), "MMM dd"),
    sleepHours: record.total_sleep_hours,
    quality: record.average_quality,
    efficiency: record.sleep_efficiency,
    consistency: record.consistency_score,
  }))

  const getLatestMetric = (metric: keyof SleepAnalyticsSummary) => {
    if (!sleepAnalytics?.length) return null
    return sleepAnalytics[sleepAnalytics.length - 1][metric]
  }

  return (
    <ToolAnalyticsWrapper 
      toolName="sleep-analytics"
      toolType="tracking"
      toolSettings={{}}
    >
      <div className="min-h-screen bg-background">
        <TopNav />
        <div className="container mx-auto p-4 space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Sleep Quality
                </CardTitle>
                <Brain className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {getLatestMetric("average_quality")?.toFixed(1)}/10
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Sleep Duration
                </CardTitle>
                <Moon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {getLatestMetric("total_sleep_hours")?.toFixed(1)}h
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Sleep Debt
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {getLatestMetric("sleep_debt_hours")?.toFixed(1)}h
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sleep Trends</CardTitle>
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
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="sleepHours" 
                        stroke="#8884d8" 
                        name="Sleep Hours"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="quality" 
                        stroke="#82ca9d" 
                        name="Quality"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="efficiency" 
                        stroke="#ffc658" 
                        name="Efficiency %"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    No sleep data available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Sleep Efficiency</CardTitle>
                <Percent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">
                  {getLatestMetric("sleep_efficiency")?.toFixed(1)}%
                </div>
                <p className="text-sm text-muted-foreground">
                  Percentage of time in bed spent sleeping
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Sleep Consistency</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">
                  {getLatestMetric("consistency_score")?.toFixed(1)}/10
                </div>
                <p className="text-sm text-muted-foreground">
                  Measure of sleep/wake time consistency
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ToolAnalyticsWrapper>
  )
}
