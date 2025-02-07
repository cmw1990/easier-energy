
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TopNav } from "@/components/layout/TopNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Activity } from "lucide-react";

const HRVCalculator = () => {
  const [age, setAge] = useState<string>('');
  const [rmssd, setRMSSD] = useState<string>('');
  const [sdnn, setSDNN] = useState<string>('');
  const [hrvScore, setHrvScore] = useState<number | null>(null);
  const [interpretation, setInterpretation] = useState<string>('');

  const calculateHRVScore = () => {
    const ageNum = parseFloat(age);
    const rmssdNum = parseFloat(rmssd);
    const sdnnNum = parseFloat(sdnn);
    
    if (ageNum && rmssdNum && sdnnNum) {
      // Simplified HRV score calculation based on RMSSD and SDNN
      // This is a basic model - real implementations would use more complex algorithms
      const baseScore = (rmssdNum + sdnnNum) / 2;
      
      // Age adjustment factor (simplified)
      const ageAdjustment = Math.max(100 - ageNum, 50) / 100;
      
      // Calculate final score (0-100 scale)
      const score = Math.min(100, Math.max(0, baseScore * ageAdjustment));
      setHrvScore(Math.round(score));
      
      // Interpret the score
      if (score >= 80) {
        setInterpretation("Excellent HRV. Your autonomic nervous system shows great balance.");
      } else if (score >= 60) {
        setInterpretation("Good HRV. Your stress resilience is above average.");
      } else if (score >= 40) {
        setInterpretation("Moderate HRV. Consider lifestyle factors that might be affecting recovery.");
      } else {
        setInterpretation("Low HRV. Focus on recovery, sleep quality, and stress management.");
      }
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
                <Activity className="w-6 h-6 text-primary" />
                <CardTitle>HRV Score Calculator</CardTitle>
              </div>
              <CardDescription>
                Calculate your Heart Rate Variability score based on RMSSD and SDNN measurements.
                HRV is a key indicator of autonomic nervous system health and stress resilience.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                <Label htmlFor="rmssd">RMSSD (ms)</Label>
                <Input
                  id="rmssd"
                  type="number"
                  placeholder="Enter RMSSD value"
                  value={rmssd}
                  onChange={(e) => setRMSSD(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sdnn">SDNN (ms)</Label>
                <Input
                  id="sdnn"
                  type="number"
                  placeholder="Enter SDNN value"
                  value={sdnn}
                  onChange={(e) => setSDNN(e.target.value)}
                />
              </div>

              <Button 
                className="w-full"
                onClick={calculateHRVScore}
                disabled={!age || !rmssd || !sdnn}
              >
                Calculate HRV Score
              </Button>

              {hrvScore !== null && (
                <Card className="mt-4">
                  <CardContent className="pt-6">
                    <div className="text-center space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Your HRV Score</p>
                        <p className="text-3xl font-bold text-primary">{hrvScore}</p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p>{interpretation}</p>
                      </div>
                      <div className="text-xs text-muted-foreground mt-4">
                        <p>Reference Ranges:</p>
                        <p>80-100: Excellent</p>
                        <p>60-79: Good</p>
                        <p>40-59: Moderate</p>
                        <p>&lt;40: Needs Improvement</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>About HRV</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Heart Rate Variability (HRV) is the variation in time between successive heartbeats. It's a powerful indicator of autonomic nervous system function, stress resilience, and recovery status. RMSSD (Root Mean Square of Successive Differences) and SDNN (Standard Deviation of NN intervals) are two key measurements used to calculate HRV. Higher scores generally indicate better stress resilience and recovery capacity.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HRVCalculator;
