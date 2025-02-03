import React from 'react';
import { MoodOverview } from '@/components/MoodOverview';
import { EnergyPatternAnalysis } from '@/components/health/EnergyPatternAnalysis';
import { TailoredRecommendations } from '@/components/health/TailoredRecommendations';
import { ActivityTracker } from '@/components/health/ActivityTracker';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      {/* Mood and Energy Overview */}
      <MoodOverview />
      
      {/* Activity Tracking */}
      <ActivityTracker />
      
      {/* Energy Pattern Analysis */}
      <EnergyPatternAnalysis />
      
      {/* Personalized Recommendations */}
      <TailoredRecommendations />
    </div>
  );
};

export default Dashboard;