
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Activity, Brain, Heart, Moon, Sun, Loader2 } from "lucide-react"
import type { PregnancyWellnessCorrelationsRow } from "@/types/supabase"

interface PregnancyWellnessAnalysisProps {
  correlations?: PregnancyWellnessCorrelationsRow | null
}

export const PregnancyWellnessAnalysis = ({ correlations }: PregnancyWellnessAnalysisProps) => {
  if (!correlations) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Wellness Analysis</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No wellness data available yet. Continue logging your daily entries to see patterns and insights.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-pink-500" />
          Wellness Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {correlations?.energy_pattern && (
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <Sun className="h-5 w-5 text-yellow-500 mt-1" />
              <div className="flex-1">
                <h4 className="font-medium">Energy Pattern</h4>
                <p className="text-sm text-muted-foreground">{correlations.energy_pattern.summary}</p>
              </div>
            </div>
            <Progress value={70} className="h-2" />
          </div>
        )}

        {correlations?.focus_pattern && (
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <Brain className="h-5 w-5 text-blue-500 mt-1" />
              <div className="flex-1">
                <h4 className="font-medium">Focus Pattern</h4>
                <p className="text-sm text-muted-foreground">{correlations.focus_pattern.summary}</p>
              </div>
            </div>
            <Progress value={85} className="h-2" />
          </div>
        )}

        {correlations?.activity_impact && (
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <Activity className="h-5 w-5 text-green-500 mt-1" />
              <div className="flex-1">
                <h4 className="font-medium">Activity Impact</h4>
                <p className="text-sm text-muted-foreground">
                  {typeof correlations.activity_impact === 'string' 
                    ? correlations.activity_impact
                    : JSON.stringify(correlations.activity_impact)}
                </p>
              </div>
            </div>
            <Progress value={60} className="h-2" />
          </div>
        )}

        {correlations?.nutrition_impact && (
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <Heart className="h-5 w-5 text-rose-500 mt-1" />
              <div className="flex-1">
                <h4 className="font-medium">Nutrition Impact</h4>
                <p className="text-sm text-muted-foreground">
                  {typeof correlations.nutrition_impact === 'string'
                    ? correlations.nutrition_impact
                    : JSON.stringify(correlations.nutrition_impact)}
                </p>
              </div>
            </div>
            <Progress value={75} className="h-2" />
          </div>
        )}

        {correlations?.sleep_pattern && (
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <Moon className="h-5 w-5 text-indigo-500 mt-1" />
              <div className="flex-1">
                <h4 className="font-medium">Sleep Pattern</h4>
                <p className="text-sm text-muted-foreground">
                  {typeof correlations.sleep_pattern === 'string'
                    ? correlations.sleep_pattern
                    : correlations.sleep_pattern?.summary}
                </p>
              </div>
            </div>
            <Progress value={80} className="h-2" />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
