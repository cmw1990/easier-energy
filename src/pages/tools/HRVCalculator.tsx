import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TopNav } from "@/components/layout/TopNav"
import { Heart } from "lucide-react"

export default function HRVCalculator() {
  const [rmssd, setRmssd] = useState<string>("")
  const [rrIntervals, setRrIntervals] = useState<string>("")
  const [hrvScore, setHrvScore] = useState<number | null>(null)
  const [hrvCategory, setHrvCategory] = useState<string>("")

  const calculateHRV = () => {
    if (!rrIntervals) return

    // Convert comma-separated string to array of numbers
    const intervals = rrIntervals.split(",").map(Number)
    
    // Calculate RMSSD (Root Mean Square of Successive Differences)
    let sumSquaredDiff = 0
    for (let i = 0; i < intervals.length - 1; i++) {
      const diff = intervals[i + 1] - intervals[i]
      sumSquaredDiff += diff * diff
    }
    const calculatedRmssd = Math.sqrt(sumSquaredDiff / (intervals.length - 1))
    setRmssd(calculatedRmssd.toFixed(2))

    // Calculate HRV Score (simplified version)
    const score = Math.round((calculatedRmssd / 100) * 100)
    setHrvScore(score)

    // Determine HRV Category
    if (score < 20) {
      setHrvCategory("Very Low")
    } else if (score < 40) {
      setHrvCategory("Low")
    } else if (score < 60) {
      setHrvCategory("Moderate")
    } else if (score < 80) {
      setHrvCategory("Good")
    } else {
      setHrvCategory("Excellent")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="container mx-auto p-4 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-primary" />
              <CardTitle>HRV Calculator</CardTitle>
            </div>
            <CardDescription>
              Calculate your Heart Rate Variability (HRV) using R-R intervals. Enter your R-R intervals in milliseconds, separated by commas.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="rrIntervals">R-R Intervals (ms)</Label>
              <Input
                id="rrIntervals"
                type="text"
                value={rrIntervals}
                onChange={(e) => setRrIntervals(e.target.value)}
                placeholder="e.g., 825,832,819,834,826,832"
              />
              <p className="text-sm text-muted-foreground">
                Enter at least 2 consecutive R-R intervals
              </p>
            </div>

            <Button onClick={calculateHRV} className="w-full">
              Calculate HRV
            </Button>

            {hrvScore !== null && (
              <div className="mt-6 p-4 bg-secondary rounded-lg">
                <h3 className="text-xl font-semibold">Results</h3>
                <div className="mt-2 space-y-2">
                  <p>RMSSD: {rmssd} ms</p>
                  <p>HRV Score: {hrvScore}</p>
                  <p>Category: {hrvCategory}</p>
                  <div className="mt-4 text-sm text-muted-foreground">
                    <p>Interpretation:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Very Low: May indicate stress or poor recovery</li>
                      <li>Low: Room for improvement in recovery</li>
                      <li>Moderate: Average HRV level</li>
                      <li>Good: Indicates good recovery and health</li>
                      <li>Excellent: Optimal heart rate variability</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}