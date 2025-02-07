import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { TopNav } from "@/components/layout/TopNav";

const BMRCalculator = () => {
  const { toast } = useToast();
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState("male");
  const [activityLevel, setActivityLevel] = useState("sedentary");
  const [bmr, setBmr] = useState<number | null>(null);
  const [tdee, setTdee] = useState<number | null>(null);

  const calculateBMR = () => {
    if (!age || !weight || !height) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to calculate BMR.",
        variant: "destructive",
      });
      return;
    }

    const heightInCm = parseFloat(height);
    const weightInKg = parseFloat(weight);
    const ageInYears = parseFloat(age);

    let calculatedBMR: number;

    // Mifflin-St Jeor Equation
    if (gender === "male") {
      calculatedBMR = 10 * weightInKg + 6.25 * heightInCm - 5 * ageInYears + 5;
    } else {
      calculatedBMR = 10 * weightInKg + 6.25 * heightInCm - 5 * ageInYears - 161;
    }

    // Calculate TDEE based on activity level
    const activityMultipliers = {
      sedentary: 1.2, // Little or no exercise
      light: 1.375, // Light exercise 1-3 times/week
      moderate: 1.55, // Moderate exercise 3-5 times/week
      active: 1.725, // Heavy exercise 6-7 times/week
      veryActive: 1.9, // Very heavy exercise, physical job
    };

    const calculatedTDEE = calculatedBMR * activityMultipliers[activityLevel as keyof typeof activityMultipliers];

    setBmr(Math.round(calculatedBMR));
    setTdee(Math.round(calculatedTDEE));

    toast({
      title: "Calculation Complete",
      description: "Your BMR and TDEE have been calculated successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="container mx-auto p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>BMR & TDEE Calculator</CardTitle>
            <CardDescription>
              Calculate your Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="gender">Gender</Label>
                <RadioGroup
                  id="gender"
                  value={gender}
                  onValueChange={setGender}
                  className="flex space-x-4 mt-2"
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="activity">Activity Level</Label>
                <Select value={activityLevel} onValueChange={setActivityLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select activity level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                    <SelectItem value="light">Lightly active (1-3 days/week)</SelectItem>
                    <SelectItem value="moderate">Moderately active (3-5 days/week)</SelectItem>
                    <SelectItem value="active">Very active (6-7 days/week)</SelectItem>
                    <SelectItem value="veryActive">Extra active (very active & physical job)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={calculateBMR} className="w-full">Calculate</Button>

              {bmr !== null && tdee !== null && (
                <div className="space-y-4 mt-6">
                  <div className="p-4 bg-primary/10 rounded-lg">
                    <h3 className="font-semibold text-lg">Your Results</h3>
                    <p className="mt-2">
                      <span className="font-medium">Basal Metabolic Rate (BMR):</span>{" "}
                      {bmr} calories/day
                    </p>
                    <p className="mt-1">
                      <span className="font-medium">Total Daily Energy Expenditure (TDEE):</span>{" "}
                      {tdee} calories/day
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>BMR is the number of calories your body burns at rest to maintain basic life functions.</p>
                    <p>TDEE includes BMR plus calories burned through daily activities and exercise.</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BMRCalculator;