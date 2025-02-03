import { Card } from "@/components/ui/card";
import { Battery, Brain, Coffee, Heart, Moon } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const energyScore = 85; // This would come from actual tracking

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">Welcome to The Well-Charged</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Energy Score</h2>
            <Battery className="h-6 w-6 text-energy-high" />
          </div>
          <div className="text-5xl font-bold text-energy-high">{energyScore}%</div>
          <p className="text-sm text-gray-500">Your energy level is optimal</p>
        </Card>

        <Link to="/breathing">
          <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold">Breathing Exercise</h2>
            </div>
            <p className="text-sm text-gray-500">Start a guided breathing session</p>
          </Card>
        </Link>

        <Link to="/focus">
          <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-secondary" />
              <h2 className="text-2xl font-semibold">Focus Test</h2>
            </div>
            <p className="text-sm text-gray-500">Measure your current focus level</p>
          </Card>
        </Link>

        <Link to="/sleep">
          <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-2">
              <Moon className="h-6 w-6 text-blue-400" />
              <h2 className="text-2xl font-semibold">Sleep Support</h2>
            </div>
            <p className="text-sm text-gray-500">Track and improve your sleep</p>
          </Card>
        </Link>

        <Link to="/caffeine">
          <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-2">
              <Coffee className="h-6 w-6 text-brown-600" />
              <h2 className="text-2xl font-semibold">Caffeine Tracker</h2>
            </div>
            <p className="text-sm text-gray-500">Monitor your caffeine intake</p>
          </Card>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;