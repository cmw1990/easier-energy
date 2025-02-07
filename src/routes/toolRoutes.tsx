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
const BreathTraining = lazy(() => import("@/pages/tools/BreathTraining"))
const MouthTaping = lazy(() => import("@/pages/tools/MouthTaping"))
const RedLightTherapy = lazy(() => import("@/pages/tools/RedLightTherapy"))
const NootropicsDatabase = lazy(() => import("@/pages/tools/NootropicsDatabase"))
const ColdTherapy = lazy(() => import("@/pages/tools/ColdTherapy"))
const EMFProtection = lazy(() => import("@/pages/tools/EMFProtection"))
const BlueLightBlockers = lazy(() => import("@/pages/tools/BlueLightBlockers"))
const Grounding = lazy(() => import("@/pages/tools/Grounding"))
const SleepGuide = lazy(() => import("@/pages/tools/SleepGuide"))
const SleepGuideArticle = lazy(() => import("@/pages/tools/SleepGuideArticle"))
const SleepTracking = lazy(() => import("@/pages/tools/SleepTracking"))
const SleepHygieneChecklist = lazy(() => import("@/pages/tools/SleepHygieneChecklist"))
const SleepEnvironment = lazy(() => import("@/pages/tools/SleepEnvironment"))
const SleepAnalytics = lazy(() => import("@/pages/tools/SleepAnalytics"))
const SleepGoals = lazy(() => import("@/pages/tools/SleepGoals"))

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
      path: "breath-training-devices",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <BreathTraining />
        </Suspense>
      ),
    },
    {
      path: "mouth-taping-guide",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <MouthTaping />
        </Suspense>
      ),
    },
    {
      path: "red-light-therapy",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <RedLightTherapy />
        </Suspense>
      ),
    },
    {
      path: "nootropics-database",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <NootropicsDatabase />
        </Suspense>
      ),
    },
    {
      path: "cold-therapy-tools",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <ColdTherapy />
        </Suspense>
      ),
    },
    {
      path: "emf-protection",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <EMFProtection />
        </Suspense>
      ),
    },
    {
      path: "blue-light-blockers",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <BlueLightBlockers />
        </Suspense>
      ),
    },
    {
      path: "grounding-earthing",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <Grounding />
        </Suspense>
      ),
    },
    {
      path: "sleep-guide",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <SleepGuide />
        </Suspense>
      ),
    },
    {
      path: "sleep-guide/:slug",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <SleepGuideArticle />
        </Suspense>
      ),
    },
    {
      path: "sleep-tracking",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <SleepTracking />
        </Suspense>
      ),
    },
    {
      path: "sleep-hygiene",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <SleepHygieneChecklist />
        </Suspense>
      ),
    },
    {
      path: "sleep-environment",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <SleepEnvironment />
        </Suspense>
      ),
    },
    {
      path: "sleep-analytics",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <SleepAnalytics />
        </Suspense>
      ),
    },
    {
      path: "sleep-goals",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <SleepGoals />
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
