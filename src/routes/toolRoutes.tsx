
import { Suspense, lazy } from "react"
import WebTools from "@/pages/WebTools"

const WhiteNoise = lazy(() => import("@/pages/tools/WhiteNoise"))
const BMICalculator = lazy(() => import("@/pages/tools/BMICalculator"))
const BodyFatCalculator = lazy(() => import("@/pages/tools/BodyFatCalculator"))
const BMRCalculator = lazy(() => import("@/pages/tools/BMRCalculator"))
const BiologicalAgeCalculator = lazy(() => import("@/pages/tools/BiologicalAgeCalculator"))
const HRVCalculator = lazy(() => import("@/pages/tools/HRVCalculator"))
const BreathingRateCalculator = lazy(() => import("@/pages/tools/BreathingRateCalculator"))
const CalorieCalculator = lazy(() => import("@/pages/tools/CalorieCalculator"))
const MacroCalculator = lazy(() => import("@/pages/tools/MacroCalculator"))
const WaterIntakeCalculator = lazy(() => import("@/pages/tools/WaterIntakeCalculator"))
const BinauralBeats = lazy(() => import("@/pages/tools/BinauralBeats"))
const NatureSounds = lazy(() => import("@/pages/tools/NatureSounds"))
const FocusTimer = lazy(() => import("@/pages/tools/FocusTimer"))
const ColorMatch = lazy(() => import("@/pages/tools/ColorMatch"))
const BrainMatch3 = lazy(() => import("@/pages/tools/BrainMatch3"))
const ReactionTime = lazy(() => import("@/pages/tools/ReactionTime"))
const MemoryCards = lazy(() => import("@/pages/tools/MemoryCards"))
const SequenceMemory = lazy(() => import("@/pages/tools/SequenceMemory"))
const WordScramble = lazy(() => import("@/pages/tools/WordScramble"))
const MentalRotation = lazy(() => import("@/pages/tools/MentalRotation"))
const Reversi = lazy(() => import("@/pages/tools/Reversi"))
const BreathingExercises = lazy(() => import("@/pages/tools/BreathingExercises"))
const StressCheck = lazy(() => import("@/pages/tools/StressCheck"))
const SleepCalculator = lazy(() => import("@/pages/tools/SleepCalculator"))
const CaffeineCalculator = lazy(() => import("@/pages/tools/CaffeineCalculator"))
const WithdrawalTracker = lazy(() => import("@/pages/tools/WithdrawalTracker"))

export const toolRoutes = {
  path: "/tools",
  children: [
    {
      path: "",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <WebTools />
        </Suspense>
      ),
    },
    {
      path: "white-noise",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <WhiteNoise />
        </Suspense>
      ),
    },
    {
      path: "bmi-calculator",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <BMICalculator />
        </Suspense>
      ),
    },
    {
      path: "body-fat-calculator",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <BodyFatCalculator />
        </Suspense>
      ),
    },
    {
      path: "bmr-calculator",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <BMRCalculator />
        </Suspense>
      ),
    },
    {
      path: "biological-age-calculator",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <BiologicalAgeCalculator />
        </Suspense>
      ),
    },
    {
      path: "hrv-calculator",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <HRVCalculator />
        </Suspense>
      ),
    },
    {
      path: "breathing-rate-calculator",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <BreathingRateCalculator />
        </Suspense>
      ),
    },
    {
      path: "calorie-calculator",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <CalorieCalculator />
        </Suspense>
      ),
    },
    {
      path: "macro-calculator",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <MacroCalculator />
        </Suspense>
      ),
    },
    {
      path: "water-intake-calculator",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <WaterIntakeCalculator />
        </Suspense>
      ),
    },
    {
      path: "binaural-beats",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <BinauralBeats />
        </Suspense>
      ),
    },
    {
      path: "nature-sounds",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <NatureSounds />
        </Suspense>
      ),
    },
    {
      path: "focus-timer",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <FocusTimer />
        </Suspense>
      ),
    },
    {
      path: "color-match",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <ColorMatch />
        </Suspense>
      ),
    },
    {
      path: "brain-match",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <BrainMatch3 />
        </Suspense>
      ),
    },
    {
      path: "reaction-time",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <ReactionTime />
        </Suspense>
      ),
    },
    {
      path: "memory-cards",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <MemoryCards />
        </Suspense>
      ),
    },
    {
      path: "sequence-memory",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <SequenceMemory />
        </Suspense>
      ),
    },
    {
      path: "word-scramble",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <WordScramble />
        </Suspense>
      ),
    },
    {
      path: "mental-rotation",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <MentalRotation />
        </Suspense>
      ),
    },
    {
      path: "reversi",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <Reversi />
        </Suspense>
      ),
    },
    {
      path: "breathing-exercises",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <BreathingExercises />
        </Suspense>
      ),
    },
    {
      path: "stress-check",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <StressCheck />
        </Suspense>
      ),
    },
    {
      path: "sleep-calculator",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <SleepCalculator />
        </Suspense>
      ),
    },
    {
      path: "caffeine-calculator",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <CaffeineCalculator />
        </Suspense>
      ),
    },
    {
      path: "withdrawal-tracker",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <WithdrawalTracker />
        </Suspense>
      ),
    },
    {
      path: ":toolSlug",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <WebTools />
        </Suspense>
      ),
    }
  ],
}
