import { BreathingVisualizer } from "@/components/breathing/BreathingVisualizer";
import { BreathingTechniques } from "@/components/breathing/BreathingTechniques";

const Breathing = () => {
  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-8">
      <BreathingVisualizer />
      <BreathingTechniques />
    </div>
  );
};

export default Breathing;