
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TopNav } from "@/components/layout/TopNav"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Battery, Coffee, Clock } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type CaffeineDrink = {
  name: string
  caffeine: number
  volume: number
}

const DRINKS: CaffeineDrink[] = [
  { name: "Coffee (Regular)", caffeine: 95, volume: 240 },
  { name: "Espresso", caffeine: 63, volume: 30 },
  { name: "Green Tea", caffeine: 28, volume: 240 },
  { name: "Black Tea", caffeine: 47, volume: 240 },
  { name: "Energy Drink", caffeine: 80, volume: 250 },
  { name: "Cola", caffeine: 34, volume: 355 },
]

export default function CaffeineCalculator() {
  const [selectedDrink, setSelectedDrink] = useState<CaffeineDrink>(DRINKS[0])
  const [weight, setWeight] = useState("")
  const [cups, setCups] = useState("1")
  const [result, setResult] = useState<{
    totalCaffeine: number
    safeLimit: number
    isOverLimit: boolean
    metabolizeTime: number
  } | null>(null)

  const calculateCaffeine = () => {
    const userWeight = parseFloat(weight)
    const numCups = parseInt(cups)
    
    if (!userWeight || !numCups) return

    const totalCaffeine = selectedDrink.caffeine * numCups
    const safeLimit = userWeight * 6 // 6mg per kg is generally considered safe
    const metabolizeTime = totalCaffeine * 0.083 // ~5 hours to metabolize 50% of caffeine

    setResult({
      totalCaffeine,
      safeLimit,
      isOverLimit: totalCaffeine > safeLimit,
      metabolizeTime
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="container mx-auto p-4 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Coffee className="h-6 w-6 text-brown-500" />
              <CardTitle>Caffeine Calculator</CardTitle>
            </div>
            <CardDescription>
              Calculate your caffeine intake and metabolism based on your consumption
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Select Drink</Label>
                  <Select 
                    value={selectedDrink.name}
                    onValueChange={(value) => setSelectedDrink(DRINKS.find(d => d.name === value)!)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DRINKS.map((drink) => (
                        <SelectItem key={drink.name} value={drink.name}>
                          {drink.name} ({drink.caffeine}mg / {drink.volume}ml)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Number of Cups/Servings</Label>
                  <Input
                    type="number"
                    min="1"
                    value={cups}
                    onChange={(e) => setCups(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Your Weight (kg)</Label>
                  <Input
                    type="number"
                    placeholder="Enter your weight"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                </div>

                <Button onClick={calculateCaffeine} className="w-full">
                  Calculate
                </Button>
              </div>

              {result && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Results</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Total Caffeine</Label>
                      <div className="flex items-center gap-2 text-xl font-bold">
                        <Battery className={`h-5 w-5 ${result.isOverLimit ? 'text-red-500' : 'text-green-500'}`} />
                        {result.totalCaffeine}mg
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Safe daily limit: {result.safeLimit.toFixed(0)}mg
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Time to Metabolize</Label>
                      <div className="flex items-center gap-2 text-xl font-bold">
                        <Clock className="h-5 w-5" />
                        {result.metabolizeTime.toFixed(1)} hours
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Until caffeine levels drop to 25%
                      </p>
                    </div>

                    {result.isOverLimit && (
                      <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
                        <p className="text-sm text-red-600 dark:text-red-400">
                          Warning: This exceeds the recommended daily limit for your weight
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
