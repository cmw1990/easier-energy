
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TopNav } from "@/components/layout/TopNav"

interface MacroSplit {
  protein: number
  carbs: number
  fats: number
}

export default function MacroCalculator() {
  const [calories, setCalories] = useState("")
  const [dietType, setDietType] = useState("balanced")
  const [macros, setMacros] = useState<MacroSplit | null>(null)

  const calculateMacros = () => {
    if (!calories) return
    
    const totalCalories = Number(calories)
    let macroSplit: MacroSplit

    switch (dietType) {
      case "lowCarb":
        macroSplit = {
          protein: Math.round((totalCalories * 0.30) / 4), // 30% protein
          carbs: Math.round((totalCalories * 0.20) / 4),   // 20% carbs
          fats: Math.round((totalCalories * 0.50) / 9)     // 50% fats
        }
        break
      case "highProtein":
        macroSplit = {
          protein: Math.round((totalCalories * 0.40) / 4), // 40% protein
          carbs: Math.round((totalCalories * 0.40) / 4),   // 40% carbs
          fats: Math.round((totalCalories * 0.20) / 9)     // 20% fats
        }
        break
      case "ketogenic":
        macroSplit = {
          protein: Math.round((totalCalories * 0.20) / 4), // 20% protein
          carbs: Math.round((totalCalories * 0.05) / 4),   // 5% carbs
          fats: Math.round((totalCalories * 0.75) / 9)     // 75% fats
        }
        break
      default: // balanced
        macroSplit = {
          protein: Math.round((totalCalories * 0.30) / 4), // 30% protein
          carbs: Math.round((totalCalories * 0.45) / 4),   // 45% carbs
          fats: Math.round((totalCalories * 0.25) / 9)     // 25% fats
        }
    }

    setMacros(macroSplit)
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="container mx-auto p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Macro Calculator</CardTitle>
            <CardDescription>
              Calculate your recommended macronutrient intake based on your daily calorie goals
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="calories">Daily Calorie Target</Label>
              <Input
                id="calories"
                type="number"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                placeholder="Enter your daily calorie target"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dietType">Diet Type</Label>
              <Select value={dietType} onValueChange={setDietType}>
                <SelectTrigger id="dietType">
                  <SelectValue placeholder="Select diet type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="balanced">Balanced</SelectItem>
                  <SelectItem value="lowCarb">Low Carb</SelectItem>
                  <SelectItem value="highProtein">High Protein</SelectItem>
                  <SelectItem value="ketogenic">Ketogenic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={calculateMacros} className="w-full">
              Calculate Macros
            </Button>

            {macros && (
              <div className="mt-6 p-4 bg-secondary rounded-lg space-y-4">
                <h3 className="text-xl font-semibold">Daily Macro Targets</h3>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-background rounded-lg">
                    <p className="text-lg font-semibold">{macros.protein}g</p>
                    <p className="text-sm text-muted-foreground">Protein</p>
                  </div>
                  <div className="text-center p-4 bg-background rounded-lg">
                    <p className="text-lg font-semibold">{macros.carbs}g</p>
                    <p className="text-sm text-muted-foreground">Carbs</p>
                  </div>
                  <div className="text-center p-4 bg-background rounded-lg">
                    <p className="text-lg font-semibold">{macros.fats}g</p>
                    <p className="text-sm text-muted-foreground">Fats</p>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  <p>Based on a {dietType} diet distribution:</p>
                  <ul className="list-disc list-inside mt-2">
                    <li>Protein: 4 calories per gram</li>
                    <li>Carbohydrates: 4 calories per gram</li>
                    <li>Fats: 9 calories per gram</li>
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
