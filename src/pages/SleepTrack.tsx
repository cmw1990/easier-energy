import { Card } from "@/components/ui/card";
import { AlarmClock } from "lucide-react";

const SleepTrack = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">Sleep Tracking</h1>
      
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlarmClock className="h-6 w-6 text-blue-400" />
          <h2 className="text-2xl font-semibold">Sleep Log</h2>
        </div>
        <p className="text-gray-500">Coming soon: Track your sleep patterns and quality.</p>
      </Card>
    </div>
  );
};

export default SleepTrack;