
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TopNav } from "@/components/layout/TopNav"

export default function CalorieCalculator() {
  const [gender, setGender] = useState<"male" | "female">("male")
  const [age, setAge] = useState("")
  const [weight, setWeight] = useState("")
  const [height, setHeight] = useState("")
  const [activityLevel, setActivityLevel] = useState("sedentary")
  const [goal, setGoal] = useState("maintain")
  const [calories, setCalories] = useState<number | null>(null)

  const calculateCalories = () => {
    if (!age || !weight || !height) return
    
    // BMR calculation using Mifflin-St Jeor Equation
    let bmr = 10 * Number(weight) + 6.25 * Number(height) - 5 * Number(age)
    bmr = gender === "male" ? bmr + 5 : bmr - 161

    // Activity multipliers
    const activityMultipliers = {
      sedentary: 1.2, // Little or no exercise
      light: 1.375, // Light exercise 1-3 days/week
      moderate: 1.55, // Moderate exercise 3-5 days/week
      active: 1.725, // Heavy exercise 6-7 days/week
      veryActive: 1.9 // Very heavy exercise, physical job
    }

    let tdee = bmr * activityMultipliers[activityLevel as keyof typeof activityMultipliers]

    // Adjust based on goal
    switch (goal) {
      case "lose":
        tdee -= 500 // Create a 500 calorie deficit
        break
      case "gain":
        tdee += 500 // Create a 500 calorie surplus
        break
    }

    setCalories(Math.round(tdee))
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="container mx-auto p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Daily Calorie Calculator</CardTitle>
            <CardDescription>
              Calculate your recommended daily calorie intake based on your goals and activity level
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
                <Label htmlFor="activityLevel">Activity Level</Label>
                <Select value={activityLevel} onValueChange={setActivityLevel}>
                  <SelectTrigger id="activityLevel">
                    <SelectValue placeholder="Select activity level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                    <SelectItem value="light">Light (1-3 days/week)</SelectItem>
                    <SelectItem value="moderate">Moderate (3-5 days/week)</SelectItem>
                    <SelectItem value="active">Active (6-7 days/week)</SelectItem>
                    <SelectItem value="veryActive">Very Active (intense exercise)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="goal">Goal</Label>
                <Select value={goal} onValueChange={setGoal}>
                  <SelectTrigger id="goal">
                    <SelectValue placeholder="Select your goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lose">Lose Weight</SelectItem>
                    <SelectItem value="maintain">Maintain Weight</SelectItem>
                    <SelectItem value="gain">Gain Weight</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={calculateCalories} className="w-full">
              Calculate Daily Calories
            </Button>

            {calories !== null && (
              <div className="mt-6 p-4 bg-secondary rounded-lg">
                <h3 className="text-xl font-semibold">Results</h3>
                <p className="mt-2">Recommended daily calorie intake: {calories} calories</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  This is an estimate based on your inputs. Adjust your intake based on your progress and consult with healthcare professionals for personalized advice.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
