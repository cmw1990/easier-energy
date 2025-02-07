
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TopNav } from "@/components/layout/TopNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Brain } from "lucide-react";

const BiologicalAgeCalculator = () => {
  const [age, setAge] = useState<string>('');
  const [bloodPressure, setBloodPressure] = useState<string>('');
  const [restingHeartRate, setRestingHeartRate] = useState<string>('');
  const [vo2Max, setVo2Max] = useState<string>('');
  const [biologicalAge, setBiologicalAge] = useState<number | null>(null);
  const [healthScore, setHealthScore] = useState<number | null>(null);

  const calculateBiologicalAge = () => {
    // This is a simplified calculation for demonstration
    // Real biological age calculations would involve more complex algorithms
    const chronologicalAge = parseFloat(age);
    const systolicBP = parseFloat(bloodPressure);
    const hrResting = parseFloat(restingHeartRate);
    const vo2MaxValue = parseFloat(vo2Max);
    
    if (chronologicalAge && systolicBP && hrResting && vo2MaxValue) {
      // Basic calculation incorporating key health metrics
      const bpFactor = (120 - systolicBP) / 2; // Optimal BP is around 120
      const hrFactor = (70 - hrResting) / 2; // Optimal resting HR around 70
      const vo2Factor = (vo2MaxValue - 30) / 2; // VO2 max baseline of 30
      
      const bioAge = chronologicalAge - (bpFactor + hrFactor + vo2Factor) / 3;
      setBiologicalAge(Math.max(Math.round(bioAge * 10) / 10, 0));
      
      // Calculate health score (0-100)
      const score = Math.min(100, Math.max(0, 
        70 + // Base score
        (bpFactor * 1.5) + // BP contribution
        (hrFactor * 1.5) + // HR contribution
        (vo2Factor * 2) // VO2 max contribution
      ));
      setHealthScore(Math.round(score));
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
                <Brain className="w-6 h-6 text-primary" />
                <CardTitle>Biological Age Calculator</CardTitle>
              </div>
              <CardDescription>
                Calculate your biological age based on key health metrics. This tool provides an estimate of how your body age compares to your chronological age.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="age">Chronological Age (years)</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Enter your current age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bloodPressure">Systolic Blood Pressure (mmHg)</Label>
                <Input
                  id="bloodPressure"
                  type="number"
                  placeholder="Enter your systolic blood pressure"
                  value={bloodPressure}
                  onChange={(e) => setBloodPressure(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="heartRate">Resting Heart Rate (bpm)</Label>
                <Input
                  id="heartRate"
                  type="number"
                  placeholder="Enter your resting heart rate"
                  value={restingHeartRate}
                  onChange={(e) => setRestingHeartRate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vo2max">VO2 Max (ml/kg/min)</Label>
                <Input
                  id="vo2max"
                  type="number"
                  placeholder="Enter your VO2 max"
                  value={vo2Max}
                  onChange={(e) => setVo2Max(e.target.value)}
                />
              </div>

              <Button 
                className="w-full"
                onClick={calculateBiologicalAge}
                disabled={!age || !bloodPressure || !restingHeartRate || !vo2Max}
              >
                Calculate Biological Age
              </Button>

              {biologicalAge !== null && healthScore !== null && (
                <Card className="mt-4">
                  <CardContent className="pt-6">
                    <div className="text-center space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Your Biological Age</p>
                        <p className="text-3xl font-bold text-primary">{biologicalAge} years</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Health Score</p>
                        <p className="text-2xl font-semibold text-primary">{healthScore}/100</p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p>This is an estimated calculation based on provided metrics.</p>
                        <p>Consult healthcare professionals for accurate assessments.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>About Biological Age</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Biological age differs from chronological age and reflects how well your body functions compared to average fitness and health markers. Key factors include cardiovascular health (blood pressure, resting heart rate), fitness level (VO2 max), and various biomarkers. This calculator provides a simplified estimate - for a more accurate assessment, consider comprehensive blood work and professional medical evaluation.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BiologicalAgeCalculator;
