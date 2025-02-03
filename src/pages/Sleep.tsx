import { Card } from "@/components/ui/card";
import { Moon } from "lucide-react";

const Sleep = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">Sleep Support</h1>
      
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Moon className="h-6 w-6 text-blue-400" />
          <h2 className="text-2xl font-semibold">Sleep Recommendations</h2>
        </div>
        <p className="text-gray-500">Coming soon: Personalized sleep recommendations and tracking.</p>
      </Card>
    </div>
  );
};

export default Sleep;