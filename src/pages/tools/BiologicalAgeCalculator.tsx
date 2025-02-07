
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TopNav } from "@/components/layout/TopNav"

export default function BiologicalAgeCalculator() {
  const [gender, setGender] = useState<"male" | "female">("male")
  const [age, setAge] = useState("")
  const [systolic, setSystolic] = useState("")
  const [diastolic, setDiastolic] = useState("")
  const [restingHR, setRestingHR] = useState("")
  const [exercise, setExercise] = useState("")
  const [smoking, setSmoking] = useState<"yes" | "no">("no")
  const [biologicalAge, setBiologicalAge] = useState<number | null>(null)

  const calculateBiologicalAge = () => {
    if (!age || !systolic || !diastolic || !restingHR || !exercise) {
      return
    }

    // Basic biological age calculation based on various factors
    let baseAge = parseFloat(age)
    let ageModifier = 0

    // Blood pressure impact
    const systolicNum = parseFloat(systolic)
    const diastolicNum = parseFloat(diastolic)
    if (systolicNum > 140 || diastolicNum > 90) {
      ageModifier += 4
    } else if (systolicNum < 120 && diastolicNum < 80) {
      ageModifier -= 2
    }

    // Resting heart rate impact
    const hrNum = parseFloat(restingHR)
    if (hrNum > 80) {
      ageModifier += 3
    } else if (hrNum < 60) {
      ageModifier -= 2
    }

    // Exercise impact (hours per week)
    const exerciseHours = parseFloat(exercise)
    if (exerciseHours >= 5) {
      ageModifier -= 3
    } else if (exerciseHours < 2) {
      ageModifier += 2
    }

    // Smoking impact
    if (smoking === "yes") {
      ageModifier += 8
    }

    setBiologicalAge(Math.max(0, baseAge + ageModifier))
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="container mx-auto p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Biological Age Calculator</CardTitle>
            <CardDescription>
              Estimate your biological age based on various health factors
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
                <Label htmlFor="age">Chronological Age (years)</Label>
                <Input
                  id="age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Enter your age"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="systolic">Systolic Blood Pressure (mmHg)</Label>
                <Input
                  id="systolic"
                  type="number"
                  value={systolic}
                  onChange={(e) => setSystolic(e.target.value)}
                  placeholder="Enter systolic pressure"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="diastolic">Diastolic Blood Pressure (mmHg)</Label>
                <Input
                  id="diastolic"
                  type="number"
                  value={diastolic}
                  onChange={(e) => setDiastolic(e.target.value)}
                  placeholder="Enter diastolic pressure"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="restingHR">Resting Heart Rate (bpm)</Label>
                <Input
                  id="restingHR"
                  type="number"
                  value={restingHR}
                  onChange={(e) => setRestingHR(e.target.value)}
                  placeholder="Enter resting heart rate"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="exercise">Exercise (hours/week)</Label>
                <Input
                  id="exercise"
                  type="number"
                  value={exercise}
                  onChange={(e) => setExercise(e.target.value)}
                  placeholder="Hours of exercise per week"
                />
              </div>

              <div className="space-y-2">
                <Label>Do you smoke?</Label>
                <RadioGroup
                  value={smoking}
                  onValueChange={(value) => setSmoking(value as "yes" | "no")}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="smoke-yes" />
                    <Label htmlFor="smoke-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="smoke-no" />
                    <Label htmlFor="smoke-no">No</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <Button onClick={calculateBiologicalAge} className="w-full">
              Calculate Biological Age
            </Button>

            {biologicalAge !== null && (
              <div className="mt-6 p-4 bg-secondary rounded-lg">
                <h3 className="text-xl font-semibold">Results</h3>
                <p className="mt-2">Your estimated biological age: {biologicalAge} years</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  This is an estimate based on the provided health factors. Consult healthcare professionals for a more accurate assessment.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

