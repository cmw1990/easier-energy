import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TopNav } from "@/components/layout/TopNav"

export default function BodyFatCalculator() {
  const [gender, setGender] = useState<"male" | "female">("male")
  const [age, setAge] = useState("")
  const [weight, setWeight] = useState("")
  const [height, setHeight] = useState("")
  const [neck, setNeck] = useState("")
  const [waist, setWaist] = useState("")
  const [hip, setHip] = useState("")
  const [bodyFat, setBodyFat] = useState<number | null>(null)

  const calculateBodyFat = () => {
    if (!age || !weight || !height || !neck || !waist || (gender === "female" && !hip)) {
      return
    }

    let result: number
    if (gender === "male") {
      result = 495 / (1.0324 - 0.19077 * Math.log10(parseFloat(waist) - parseFloat(neck)) + 0.15456 * Math.log10(parseFloat(height))) - 450
    } else {
      result = 495 / (1.29579 - 0.35004 * Math.log10(parseFloat(waist) + parseFloat(hip) - parseFloat(neck)) + 0.22100 * Math.log10(parseFloat(height))) - 450
    }

    setBodyFat(Math.round(result * 10) / 10)
  }

  const getBodyFatCategory = (bf: number) => {
    if (gender === "male") {
      if (bf < 6) return "Essential Fat"
      if (bf < 14) return "Athletes"
      if (bf < 18) return "Fitness"
      if (bf < 25) return "Average"
      return "Obese"
    } else {
      if (bf < 14) return "Essential Fat"
      if (bf < 21) return "Athletes"
      if (bf < 25) return "Fitness"
      if (bf < 32) return "Average"
      return "Obese"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="container mx-auto p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Body Fat Calculator</CardTitle>
            <CardDescription>
              Calculate your body fat percentage using the U.S. Navy method
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup
              value={gender}
              onValueChange={(value) => setGender(value as "male" | "female")}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male">Male</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female">Female</Label>
              </div>
            </RadioGroup>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age (years)</Label>
                <Input
                  id="age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Enter your age"
                />
              </div>

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
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="Enter your height"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="neck">Neck Circumference (cm)</Label>
                <Input
                  id="neck"
                  type="number"
                  value={neck}
                  onChange={(e) => setNeck(e.target.value)}
                  placeholder="Measure around neck"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="waist">Waist Circumference (cm)</Label>
                <Input
                  id="waist"
                  type="number"
                  value={waist}
                  onChange={(e) => setWaist(e.target.value)}
                  placeholder="Measure around waist"
                />
              </div>

              {gender === "female" && (
                <div className="space-y-2">
                  <Label htmlFor="hip">Hip Circumference (cm)</Label>
                  <Input
                    id="hip"
                    type="number"
                    value={hip}
                    onChange={(e) => setHip(e.target.value)}
                    placeholder="Measure around hips"
                  />
                </div>
              )}
            </div>

            <Button onClick={calculateBodyFat} className="w-full">
              Calculate Body Fat
            </Button>

            {bodyFat !== null && (
              <div className="mt-6 p-4 bg-secondary rounded-lg">
                <h3 className="text-xl font-semibold">Results</h3>
                <p className="mt-2">Your body fat percentage: {bodyFat}%</p>
                <p className="mt-1">Category: {getBodyFatCategory(bodyFat)}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}