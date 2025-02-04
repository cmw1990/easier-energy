import { DeskExercises } from "@/components/exercises/DeskExercises";
import { DeskYoga } from "@/components/exercises/DeskYoga";
import { WalkingExercise } from "@/components/exercises/WalkingExercise";
import { RunningExercise } from "@/components/exercises/RunningExercise";
import { StretchExercise } from "@/components/exercises/StretchExercise";

const Exercise = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Exercise</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <DeskExercises />
        <DeskYoga />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <WalkingExercise />
        <RunningExercise />
        <StretchExercise />
      </div>
    </div>
  );
};

export default Exercise;