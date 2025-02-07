import { Suspense, lazy } from "react"
import WebTools from "@/pages/WebTools"

const WhiteNoise = lazy(() => import("@/pages/tools/WhiteNoise"))
const BMICalculator = lazy(() => import("@/pages/tools/BMICalculator"))
const BiologicalAgeCalculator = lazy(() => import("@/pages/tools/BiologicalAgeCalculator"))
const HRVCalculator = lazy(() => import("@/pages/tools/HRVCalculator"))
const BMRCalculator = lazy(() => import("@/pages/tools/BMRCalculator"))
const BodyFatCalculator = lazy(() => import("@/pages/tools/BodyFatCalculator"))

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
      path: "bmr-calculator",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <BMRCalculator />
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
      path: ":toolSlug",
      element: (
        <Suspense fallback={<div>Loading...</div>}>
          <WebTools />
        </Suspense>
      ),
    }
  ],
}