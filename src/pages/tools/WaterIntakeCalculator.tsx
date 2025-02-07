
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TopNav } from "@/components/layout/TopNav"

export default function WaterIntakeCalculator() {
  const [weight, setWeight] = useState("")
  const [activityLevel, setActivityLevel] = useState("moderate")
  const [climate, setClimate] = useState("temperate")
  const [waterIntake, setWaterIntake] = useState<number | null>(null)

  const calculateWaterIntake = () => {
    if (!weight) return
    
    // Base calculation: 30ml per kg of body weight
    let intake = Number(weight) * 30

    // Activity level adjustments
    const activityMultipliers = {
      sedentary: 1,
      light: 1.1,
      moderate: 1.2,
      active: 1.3,
      veryActive: 1.4
    }

    intake *= activityMultipliers[activityLevel as keyof typeof activityMultipliers]

    // Climate adjustments
    const climateMultipliers = {
      cold: 0.9,
      temperate: 1,
      hot: 1.1,
      veryHot: 1.2
    }

    intake *= climateMultipliers[climate as keyof typeof climateMultipliers]

    // Convert to liters and round to 1 decimal
    setWaterIntake(Math.round(intake / 100) / 10)
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="container mx-auto p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Daily Water Intake Calculator</CardTitle>
            <CardDescription>
              Calculate your recommended daily water intake based on your weight, activity level, and climate
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Enter your weight"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="activityLevel">Activity Level</Label>
              <Select value={activityLevel} onValueChange={setActivityLevel}>
                <SelectTrigger id="activityLevel">
                  <SelectValue placeholder="Select activity level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                  <SelectItem value="light">Light Activity</SelectItem>
                  <SelectItem value="moderate">Moderate Activity</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="veryActive">Very Active</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="climate">Climate</Label>
              <Select value={climate} onValueChange={setClimate}>
                <SelectTrigger id="climate">
                  <SelectValue placeholder="Select climate" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cold">Cold</SelectItem>
                  <SelectItem value="temperate">Temperate</SelectItem>
                  <SelectItem value="hot">Hot</SelectItem>
                  <SelectItem value="veryHot">Very Hot</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={calculateWaterIntake} className="w-full">
              Calculate Water Intake
            </Button>

            {waterIntake !== null && (
              <div className="mt-6 p-4 bg-secondary rounded-lg">
                <h3 className="text-xl font-semibold">Recommended Daily Water Intake</h3>
                <p className="mt-2 text-2xl font-bold">{waterIntake} liters</p>
                <p className="mt-2">This equals approximately:</p>
                <ul className="list-disc list-inside mt-1 space-y-1 text-sm text-muted-foreground">
                  <li>{Math.round(waterIntake * 4)} glasses (250ml each)</li>
                  <li>{Math.round(waterIntake * 1000)} milliliters</li>
                  <li>{Math.round(waterIntake * 33.8)} fluid ounces</li>
                </ul>
                <p className="mt-4 text-sm text-muted-foreground">
                  Note: This is a general guideline. Actual needs may vary based on diet, health conditions, and other factors. Listen to your body and consult healthcare professionals for personalized advice.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
