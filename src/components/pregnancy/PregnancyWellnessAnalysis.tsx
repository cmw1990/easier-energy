
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Activity, Brain, Heart } from "lucide-react"
import type { PregnancyWellnessCorrelationsRow } from "@/types/supabase"

interface PregnancyWellnessAnalysisProps {
  correlations?: PregnancyWellnessCorrelationsRow | null
}

export const PregnancyWellnessAnalysis = ({ correlations }: PregnancyWellnessAnalysisProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Wellness Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {correlations?.energy_pattern && (
          <div className="flex items-start gap-3">
            <Heart className="h-5 w-5 text-rose-500 mt-1" />
            <div>
              <h4 className="font-medium">Energy Pattern</h4>
              <p className="text-sm text-muted-foreground">{correlations.energy_pattern.summary}</p>
            </div>
          </div>
        )}

        {correlations?.focus_pattern && (
          <div className="flex items-start gap-3">
            <Brain className="h-5 w-5 text-blue-500 mt-1" />
            <div>
              <h4 className="font-medium">Focus Pattern</h4>
              <p className="text-sm text-muted-foreground">{correlations.focus_pattern.summary}</p>
            </div>
          </div>
        )}

        {correlations?.activity_impact && (
          <div className="flex items-start gap-3">
            <Activity className="h-5 w-5 text-green-500 mt-1" />
            <div>
              <h4 className="font-medium">Activity Impact</h4>
              <p className="text-sm text-muted-foreground">
                {typeof correlations.activity_impact === 'string' 
                  ? correlations.activity_impact
                  : JSON.stringify(correlations.activity_impact)}
              </p>
            </div>
          </div>
        )}

        {correlations?.nutrition_impact && (
          <div className="space-y-2">
            <h4 className="font-medium">Nutrition Impact</h4>
            <p className="text-sm text-muted-foreground">
              {typeof correlations.nutrition_impact === 'string'
                ? correlations.nutrition_impact
                : JSON.stringify(correlations.nutrition_impact)}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
