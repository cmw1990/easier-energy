import { Card } from "@/components/ui/card";
import { Brain } from "lucide-react";

const Focus = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">Focus Test</h1>
      
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="h-6 w-6 text-secondary" />
          <h2 className="text-2xl font-semibold">Reaction Time Test</h2>
        </div>
        <p className="text-gray-500">Coming soon: Test your reaction time and track your focus levels.</p>
      </Card>
    </div>
  );
};

export default Focus;