import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TopNav } from "@/components/layout/TopNav";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const BodyFatCalculator = () => {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [waist, setWaist] = useState('');
  const [neck, setNeck] = useState('');
  const [height, setHeight] = useState('');
  const [hip, setHip] = useState(''); // Only for females
  const [bodyFat, setBodyFat] = useState<number | null>(null);
  const { toast } = useToast();

  const calculateBodyFat = () => {
    if (!waist || !neck || !height || (gender === 'female' && !hip)) {
      toast({
        title: "Missing measurements",
        description: "Please fill in all required measurements.",
        variant: "destructive"
      });
      return;
    }

    const w = parseFloat(waist);
    const n = parseFloat(neck);
    const h = parseFloat(height);
    
    if (gender === 'male') {
      // U.S. Navy Method for males
      const bodyFatPercentage = 495 / (1.0324 - 0.19077 * Math.log10(w - n) + 0.15456 * Math.log10(h)) - 450;
      setBodyFat(parseFloat(bodyFatPercentage.toFixed(1)));
    } else {
      // U.S. Navy Method for females
      const hipMeasurement = parseFloat(hip);
      const bodyFatPercentage = 495 / (1.29579 - 0.35004 * Math.log10(w + hipMeasurement - n) + 0.22100 * Math.log10(h)) - 450;
      setBodyFat(parseFloat(bodyFatPercentage.toFixed(1)));
    }
  };

  const getCategory = (bf: number) => {
    if (gender === 'male') {
      if (bf < 6) return 'Essential Fat';
      if (bf < 14) return 'Athletes';
      if (bf < 18) return 'Fitness';
      if (bf < 25) return 'Average';
      return 'Above Average';
    } else {
      if (bf < 14) return 'Essential Fat';
      if (bf < 21) return 'Athletes';
      if (bf < 25) return 'Fitness';
      if (bf < 32) return 'Average';
      return 'Above Average';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="container mx-auto p-4 space-y-4">
        <h1 className="text-4xl font-bold text-center mb-8">Body Fat Calculator</h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Enter Your Measurements</CardTitle>
              <CardDescription>
                All measurements should be in centimeters (cm)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Gender</Label>
                <div className="flex gap-4">
                  <Button
                    variant={gender === 'male' ? 'default' : 'outline'}
                    onClick={() => setGender('male')}
                  >
                    Male
                  </Button>
                  <Button
                    variant={gender === 'female' ? 'default' : 'outline'}
                    onClick={() => setGender('female')}
                  >
                    Female
                  </Button>
                </div>
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

              {gender === 'female' && (
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

              <Button className="w-full" onClick={calculateBodyFat}>
                Calculate Body Fat
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Results</CardTitle>
              <CardDescription>
                Using the U.S. Navy Method
              </CardDescription>
            </CardHeader>
            <CardContent>
              {bodyFat !== null && (
                <div className="space-y-4">
                  <div className="text-2xl font-bold">
                    Body Fat: {bodyFat}%
                  </div>
                  <div className="text-lg">
                    Category: {getCategory(bodyFat)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>Body Fat Percentage Categories ({gender === 'male' ? 'Men' : 'Women'}):</p>
                    <ul className="list-disc list-inside mt-2">
                      {gender === 'male' ? (
                        <>
                          <li>Essential Fat: 2-5%</li>
                          <li>Athletes: 6-13%</li>
                          <li>Fitness: 14-17%</li>
                          <li>Average: 18-24%</li>
                          <li>Above Average: 25%+</li>
                        </>
                      ) : (
                        <>
                          <li>Essential Fat: 10-13%</li>
                          <li>Athletes: 14-20%</li>
                          <li>Fitness: 21-24%</li>
                          <li>Average: 25-31%</li>
                          <li>Above Average: 32%+</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BodyFatCalculator;