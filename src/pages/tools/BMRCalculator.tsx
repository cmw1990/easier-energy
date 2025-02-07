import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calculator } from "lucide-react"

const BMRCalculator = () => {
  const [age, setAge] = useState("")
  const [weight, setWeight] = useState("")
  const [height, setHeight] = useState("")
  const [gender, setGender] = useState("male")
  const [activityLevel, setActivityLevel] = useState("sedentary")
  const [result, setResult] = useState<{ bmr: number; tdee: number } | null>(null)

  const calculateBMR = () => {
    const w = parseFloat(weight)
    const h = parseFloat(height)
    const a = parseFloat(age)

    if (isNaN(w) || isNaN(h) || isNaN(a)) {
      return
    }

    let bmr
    if (gender === "male") {
      bmr = 88.362 + (13.397 * w) + (4.799 * h) - (5.677 * a)
    } else {
      bmr = 447.593 + (9.247 * w) + (3.098 * h) - (4.330 * a)
    }

    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9
    }

    const tdee = bmr * activityMultipliers[activityLevel as keyof typeof activityMultipliers]

    setResult({
      bmr: Math.round(bmr),
      tdee: Math.round(tdee)
    })
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calculator className="h-6 w-6 text-primary" />
            <CardTitle>BMR & TDEE Calculator</CardTitle>
          </div>
          <CardDescription>
            Calculate your Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age (years)</Label>
              <Input
                id="age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Enter age"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Enter weight"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="Enter height"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="activity">Activity Level</Label>
            <Select value={activityLevel} onValueChange={setActivityLevel}>
              <SelectTrigger id="activity">
                <SelectValue placeholder="Select activity level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                <SelectItem value="light">Light (exercise 1-3 times/week)</SelectItem>
                <SelectItem value="moderate">Moderate (exercise 3-5 times/week)</SelectItem>
                <SelectItem value="active">Active (exercise 6-7 times/week)</SelectItem>
                <SelectItem value="veryActive">Very Active (hard exercise daily)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={calculateBMR} className="w-full">Calculate</Button>

          {result && (
            <div className="mt-4 space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">BMR</CardTitle>
                    <CardDescription>Basal Metabolic Rate</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-primary">{result.bmr} calories/day</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">TDEE</CardTitle>
                    <CardDescription>Total Daily Energy Expenditure</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-primary">{result.tdee} calories/day</p>
                  </CardContent>
                </Card>
              </div>
              <Card className="mt-4">
                <CardContent className="pt-4">
                  <p className="text-sm text-muted-foreground">
                    Your BMR is the number of calories your body burns at rest. Your TDEE includes calories burned through daily activities and exercise.
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default BMRCalculator