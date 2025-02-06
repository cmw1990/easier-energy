
import React from 'react';
import { MoodOverview } from '@/components/MoodOverview';
import { EnergyPatternAnalysis } from '@/components/health/EnergyPatternAnalysis';
import { TailoredRecommendations } from '@/components/health/TailoredRecommendations';
import { ActivityTracker } from '@/components/health/ActivityTracker';
import { WaterIntakeTracker } from '@/components/health/WaterIntakeTracker';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      {/* Mood and Energy Overview */}
      <div className="grid gap-6 md:grid-cols-2">
        <MoodOverview />
        <WaterIntakeTracker />
      </div>
      
      {/* Health Tracking Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <ActivityTracker />
        <EnergyPatternAnalysis />
      </div>
      
      {/* Personalized Recommendations */}
      <TailoredRecommendations />
    </div>
  );
};

export default Dashboard;
