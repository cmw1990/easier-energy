import { Card } from "@/components/ui/card";
import { Coffee } from "lucide-react";

const Caffeine = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">Caffeine Tracker</h1>
      
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Coffee className="h-6 w-6 text-brown-600" />
          <h2 className="text-2xl font-semibold">Daily Intake</h2>
        </div>
        <p className="text-gray-500">Coming soon: Track your caffeine intake and get personalized recommendations.</p>
      </Card>
    </div>
  );
};

export default Caffeine;