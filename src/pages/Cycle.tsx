
import { CyclePhasePrediction } from "@/components/cycle/CyclePhasePrediction"
import { CycleTracking } from "@/components/cycle/CycleTracking"

const CyclePage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Cycle Tracking</h1>
      <div className="grid gap-6">
        <CyclePhasePrediction />
        <CycleTracking />
      </div>
    </div>
  );
};

export default CyclePage;
