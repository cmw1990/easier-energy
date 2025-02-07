import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TopNav } from "@/components/layout/TopNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator } from "lucide-react";

const BMICalculator = () => {
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [bmi, setBMI] = useState<number | null>(null);
  const [category, setCategory] = useState<string>('');

  const calculateBMI = () => {
    const heightInMeters = parseFloat(height) / 100;
    const weightInKg = parseFloat(weight);
    
    if (heightInMeters > 0 && weightInKg > 0) {
      const bmiValue = parseFloat((weightInKg / (heightInMeters * heightInMeters)).toFixed(1));
      setBMI(bmiValue);
      
      // Determine BMI category
      if (bmiValue < 18.5) setCategory('Underweight');
      else if (bmiValue < 25) setCategory('Normal weight');
      else if (bmiValue < 30) setCategory('Overweight');
      else setCategory('Obese');
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
                <CardTitle>BMI Calculator</CardTitle>
              </div>
              <CardDescription>
                Calculate your Body Mass Index (BMI) to assess if your weight is in a healthy range.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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

              <Button 
                className="w-full"
                onClick={calculateBMI}
                disabled={!height || !weight}
              >
                Calculate BMI
              </Button>

              {bmi !== null && (
                <Card className="mt-4">
                  <CardContent className="pt-6">
                    <div className="text-center space-y-2">
                      <p className="text-2xl font-bold text-primary">{bmi}</p>
                      <p className="text-lg font-medium">{category}</p>
                      <p className="text-sm text-muted-foreground">
                        BMI Categories:<br />
                        Underweight = &lt;18.5<br />
                        Normal weight = 18.5–24.9<br />
                        Overweight = 25–29.9<br />
                        Obese = BMI of 30 or greater
                      </p>
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

export default BMICalculator;