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
      path: ":toolSlug",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <WebTools />
        </Suspense>
      ),
    }
  ],
}
