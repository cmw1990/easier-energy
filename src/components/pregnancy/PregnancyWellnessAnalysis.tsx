
import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Brain, Heart, Moon } from "lucide-react"
import type { PregnancyWellnessCorrelationsRow } from "@/types/supabase"

interface PregnancyWellnessAnalysisProps {
  correlations?: PregnancyWellnessCorrelationsRow | null
}

export const PregnancyWellnessAnalysis = ({ correlations }: PregnancyWellnessAnalysisProps) => {
  const analysisScore = useMemo(() => {
    if (!correlations) return 0
    const patterns = [
      correlations.energy_pattern,
      correlations.focus_pattern,
      correlations.sleep_pattern
    ]
    const validPatterns = patterns.filter(p => p?.confidence)
    if (!validPatterns.length) return 0
    return validPatterns.reduce((acc, curr) => acc + (curr?.confidence || 0), 0) / validPatterns.length * 100
  }, [correlations])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Wellness Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Analysis Confidence</span>
            <span>{Math.round(analysisScore)}%</span>
          </div>
          <Progress value={analysisScore} />
        </div>

        <div className="space-y-4">
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

          {correlations?.sleep_pattern && (
            <div className="flex items-start gap-3">
              <Moon className="h-5 w-5 text-purple-500 mt-1" />
              <div>
                <h4 className="font-medium">Sleep Pattern</h4>
                <p className="text-sm text-muted-foreground">{correlations.sleep_pattern.summary}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
