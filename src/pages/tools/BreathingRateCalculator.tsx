
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TopNav } from "@/components/layout/TopNav"

export default function BreathingRateCalculator() {
  const [breathCount, setBreathCount] = useState("")
  const [timeInSeconds, setTimeInSeconds] = useState(30)
  const [isCountingBreaths, setIsCountingBreaths] = useState(false)
  const [breathingRate, setBreathingRate] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState(30)

  const startCounting = () => {
    setIsCountingBreaths(true)
    setTimeLeft(timeInSeconds)
    setBreathCount("")
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setIsCountingBreaths(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const calculateBreathingRate = () => {
    if (!breathCount) return
    
    // Convert to breaths per minute
    const breathsPerMinute = (Number(breathCount) * 60) / timeInSeconds
    setBreathingRate(Math.round(breathsPerMinute * 10) / 10)
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="container mx-auto p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Breathing Rate Calculator</CardTitle>
            <CardDescription>
              Measure your breathing rate by counting breaths over a set time period
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="timeSelect">Measurement Duration (seconds)</Label>
              <Input
                id="timeSelect"
                type="number"
                value={timeInSeconds}
                onChange={(e) => setTimeInSeconds(Number(e.target.value))}
                min={15}
                max={60}
                disabled={isCountingBreaths}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="breathCount">Number of Breaths Counted</Label>
              <Input
                id="breathCount"
                type="number"
                value={breathCount}
                onChange={(e) => setBreathCount(e.target.value)}
                placeholder="Enter breath count"
                disabled={isCountingBreaths}
              />
            </div>

            <div className="flex gap-4">
              {!isCountingBreaths ? (
                <Button onClick={startCounting} className="w-full">
                  Start Counting ({timeInSeconds}s)
                </Button>
              ) : (
                <Button disabled className="w-full">
                  Time Remaining: {timeLeft}s
                </Button>
              )}
            </div>

            <Button
              onClick={calculateBreathingRate}
              disabled={!breathCount || isCountingBreaths}
              className="w-full"
            >
              Calculate Breathing Rate
            </Button>

            {breathingRate !== null && (
              <div className="mt-6 p-4 bg-secondary rounded-lg">
                <h3 className="text-xl font-semibold">Results</h3>
                <p className="mt-2">Your breathing rate: {breathingRate} breaths per minute</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Normal adult breathing rate at rest is typically between 12-20 breaths per minute.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
