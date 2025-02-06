import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Timer, Heart, ChartLine } from 'lucide-react';
import { AnimatedExerciseDisplay } from './AnimatedExerciseDisplay';
import { useToast } from '@/hooks/use-toast';

interface ExerciseSet {
  name: string;
  type: 'quick' | 'endurance' | 'coordination' | 'relaxation';
  duration: number;
  contractionTime: number;
  relaxationTime: number;
  repetitions: number;
  description: string;
  targetMuscles: string[];
  benefits: string[];
}

const exerciseSets: ExerciseSet[] = [
  {
    name: "Quick Response Training",
    type: "quick",
    duration: 300,
    contractionTime: 1,
    relaxationTime: 2,
    repetitions: 15,
    description: "Fast-twitch muscle fiber activation for improved reactivity",
    targetMuscles: ["Fast-twitch muscle fibers", "Pelvic floor"],
    benefits: ["Improved muscle reactivity", "Better stress response"]
  },
  {
    name: "Endurance Builder",
    type: "endurance",
    duration: 420,
    contractionTime: 10,
    relaxationTime: 10,
    repetitions: 12,
    description: "Long-hold exercises for building muscle endurance",
    targetMuscles: ["Deep pelvic floor muscles", "Core stabilizers"],
    benefits: ["Enhanced endurance", "Improved muscle tone"]
  },
  {
    name: "Coordination Complex",
    type: "coordination",
    duration: 360,
    contractionTime: 3,
    relaxationTime: 3,
    repetitions: 20,
    description: "Coordinated movement patterns for better muscle control",
    targetMuscles: ["Pelvic floor", "Lower abdominals", "Deep core"],
    benefits: ["Better muscle coordination", "Improved functional strength"]
  },
  {
    name: "Relaxation Focus",
    type: "relaxation",
    duration: 300,
    contractionTime: 5,
    relaxationTime: 15,
    repetitions: 10,
    description: "Focus on complete muscle relaxation between contractions",
    targetMuscles: ["Pelvic floor", "Supporting muscles"],
    benefits: ["Enhanced relaxation", "Reduced muscle tension"]
  }
];

export const SpecializedTrainingExercises = () => {
  const [selectedExercise, setSelectedExercise] = useState<ExerciseSet | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [currentRep, setCurrentRep] = useState(1);
  const [timeLeft, setTimeLeft] = useState(0);
  const { toast } = useToast();

  const startExercise = (exercise: ExerciseSet) => {
    setSelectedExercise(exercise);
    setCurrentRep(1);
    setTimeLeft(exercise.duration);
    setIsActive(true);
  };

  const completeExercise = () => {
    toast({
      title: "Exercise Complete!",
      description: `Great job completing ${selectedExercise?.name}!`,
    });
    setIsActive(false);
    setSelectedExercise(null);
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Heart className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Specialized Training</h3>
      </div>

      {!selectedExercise ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exerciseSets.map((exercise) => (
            <Button
              key={exercise.name}
              variant="outline"
              className="p-4 h-auto flex flex-col items-start gap-2"
              onClick={() => startExercise(exercise)}
            >
              <span className="font-medium">{exercise.name}</span>
              <span className="text-sm text-muted-foreground">
                {exercise.description}
              </span>
            </Button>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatedExerciseDisplay
            imageUrl="/placeholder.svg"
            exerciseType={selectedExercise.type}
            isActive={isActive}
            progress={(currentRep / selectedExercise.repetitions) * 100}
            instructions={[
              `Contract for ${selectedExercise.contractionTime}s`,
              `Relax for ${selectedExercise.relaxationTime}s`,
              `Complete ${selectedExercise.repetitions} repetitions`,
              "Focus on proper form and breathing"
            ]}
          />

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{currentRep}/{selectedExercise.repetitions} reps</span>
            </div>
            <Progress 
              value={(currentRep / selectedExercise.repetitions) * 100}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Target Muscles</h4>
              <div className="flex flex-wrap gap-2">
                {selectedExercise.targetMuscles.map((muscle) => (
                  <span
                    key={muscle}
                    className="px-2 py-1 bg-primary/10 rounded-full text-sm"
                  >
                    {muscle}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Benefits</h4>
              <div className="flex flex-wrap gap-2">
                {selectedExercise.benefits.map((benefit) => (
                  <span
                    key={benefit}
                    className="px-2 py-1 bg-secondary/10 rounded-full text-sm"
                  >
                    {benefit}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setSelectedExercise(null)}
            >
              Back to Exercises
            </Button>
            <Button
              variant="default"
              onClick={completeExercise}
              className="gap-2"
            >
              <ChartLine className="h-4 w-4" />
              Complete Exercise
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};