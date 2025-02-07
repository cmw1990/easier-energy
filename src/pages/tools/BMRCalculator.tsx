import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TopNav } from "@/components/layout/TopNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator } from "lucide-react";

const BMRCalculator = () => {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [activityLevel, setActivityLevel] = useState<string>('1.2');
  const [bmr, setBMR] = useState<number | null>(null);
  const [tdee, setTDEE] = useState<number | null>(null);

  const calculateBMR = () => {
    const heightInCm = parseFloat(height);
    const weightInKg = parseFloat(weight);
    const ageInYears = parseFloat(age);
    const activity = parseFloat(activityLevel);
    
    if (heightInCm > 0 && weightInKg > 0 && ageInYears > 0) {
      let bmrValue: number;
      
      // Harris-Benedict Equation
      if (gender === 'male') {
        bmrValue = 88.362 + (13.397 * weightInKg) + (4.799 * heightInCm) - (5.677 * ageInYears);
      } else {
        bmrValue = 447.593 + (9.247 * weightInKg) + (3.098 * heightInCm) - (4.330 * ageInYears);
      }
      
      setBMR(Math.round(bmrValue));
      setTDEE(Math.round(bmrValue * activity));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="container mx-auto p-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Calculator className="w-6 h-6 text-primary" />
                <CardTitle>BMR & TDEE Calculator</CardTitle>
              </div>
              <CardDescription>
                Calculate your Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Gender</Label>
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant={gender === 'male' ? 'default' : 'outline'}
                    onClick={() => setGender('male')}
                  >
                    Male
                  </Button>
                  <Button
                    type="button"
                    variant={gender === 'female' ? 'default' : 'outline'}
                    onClick={() => setGender('female')}
                  >
                    Female
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="age">Age (years)</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Enter your age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="Enter your height in centimeters"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="Enter your weight in kilograms"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="activity">Activity Level</Label>
                <select
                  id="activity"
                  className="w-full p-2 border rounded-md"
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(e.target.value)}
                >
                  <option value="1.2">Sedentary (little or no exercise)</option>
                  <option value="1.375">Lightly active (light exercise 1-3 days/week)</option>
                  <option value="1.55">Moderately active (moderate exercise 3-5 days/week)</option>
                  <option value="1.725">Very active (hard exercise 6-7 days/week)</option>
                  <option value="1.9">Extra active (very hard exercise & physical job)</option>
                </select>
              </div>

              <Button 
                className="w-full"
                onClick={calculateBMR}
                disabled={!height || !weight || !age}
              >
                Calculate BMR & TDEE
              </Button>

              {bmr !== null && tdee !== null && (
                <Card className="mt-4">
                  <CardContent className="pt-6">
                    <div className="text-center space-y-4">
                      <div>
                        <p className="text-lg font-medium">Your Basal Metabolic Rate (BMR):</p>
                        <p className="text-2xl font-bold text-primary">{bmr} calories/day</p>
                        <p className="text-sm text-muted-foreground">
                          This is the number of calories your body burns at rest
                        </p>
                      </div>
                      <div>
                        <p className="text-lg font-medium">Your Total Daily Energy Expenditure (TDEE):</p>
                        <p className="text-2xl font-bold text-primary">{tdee} calories/day</p>
                        <p className="text-sm text-muted-foreground">
                          This is your estimated daily calorie needs based on your activity level
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BMRCalculator;