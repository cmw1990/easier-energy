import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/components/AuthProvider"
import { Suspense, lazy } from "react"
import Layout from "@/components/layout/Layout"
import NotFound from "@/components/NotFound"
import Index from "@/pages/Index"
import Auth from "@/pages/Auth"
import LandingPage from "@/pages/LandingPage"

// Lazy load all the other pages
const BathingPage = lazy(() => import("@/pages/Bathing"))
const CBTPage = lazy(() => import("@/pages/CBT"))
const BreathingPage = lazy(() => import("@/pages/Breathing"))
const CaffeinePage = lazy(() => import("@/pages/Caffeine"))
const DashboardPage = lazy(() => import("@/pages/Dashboard"))
const DistractionBlockerPage = lazy(() => import("@/pages/DistractionBlocker"))
const Exercise = lazy(() => import("@/pages/Exercise"))
const EyeExercisesPage = lazy(() => import("@/pages/EyeExercises"))
const FocusPage = lazy(() => import("@/pages/Focus"))
const FoodPage = lazy(() => import("@/pages/Food"))
const MeditationPage = lazy(() => import("@/pages/Meditation"))
const MotivationPage = lazy(() => import("@/pages/Motivation"))
const NicotinePage = lazy(() => import("@/pages/Nicotine"))
const QuitPlanPage = lazy(() => import("@/pages/QuitPlan"))
const RecoveryPage = lazy(() => import("@/pages/Recovery"))
const RelaxPage = lazy(() => import("@/pages/Relax"))
const SleepPage = lazy(() => import("@/pages/Sleep"))
const SleepTrackPage = lazy(() => import("@/pages/SleepTrack"))
const SobrietyPage = lazy(() => import("@/pages/Sobriety"))
const SubstanceLogPage = lazy(() => import("@/pages/SubstanceLog"))
const SupplementsPage = lazy(() => import("@/pages/Supplements"))
const SupportPage = lazy(() => import("@/pages/Support"))
const WebTools = lazy(() => import("@/pages/WebTools"))
const WhiteNoise = lazy(() => import("@/pages/tools/WhiteNoise"))
const BreathingGame = lazy(() => import("@/components/games/BreathingGame"))
const BalloonJourney = lazy(() => import("@/components/games/BalloonJourney"))
const ZenGarden = lazy(() => import("@/components/games/ZenGarden"))
const DevelopmentTools = lazy(() => import("@/pages/DevelopmentTools"))
const BMICalculator = lazy(() => import("@/pages/tools/BMICalculator"))
const BiologicalAgeCalculator = lazy(() => import("@/pages/tools/BiologicalAgeCalculator"))

const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
    errorElement: <NotFound />,
  },
  {
    path: "/desktop",
    element: <Index />,
  },
  {
    path: "/login",
    element: <Auth />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/development",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <DevelopmentTools />
      </Suspense>
    ),
    errorElement: <NotFound />,
  },
  {
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
        path: ":toolSlug",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <WebTools />
          </Suspense>
        ),
      }
    ],
  },
  // Public game routes
  {
    path: "/breathing-pufferfish",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <BreathingGame />
      </Suspense>
    ),
  },
  {
    path: "/breathing-balloon",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <BalloonJourney />
      </Suspense>
    ),
  },
  {
    path: "/breathing-zen",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <ZenGarden />
      </Suspense>
    ),
  },
  {
    path: "/eye-exercises",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <EyeExercisesPage />
      </Suspense>
    ),
  },
  // Protected app routes
  {
    path: "/app",
    element: (
      <AuthProvider>
        <Layout />
      </AuthProvider>
    ),
    errorElement: <NotFound />,
    children: [
      {
        path: "",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <DashboardPage />
          </Suspense>
        ),
      },
      {
        path: "breathing",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <BreathingPage />
          </Suspense>
        ),
      },
      {
        path: "caffeine",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <CaffeinePage />
          </Suspense>
        ),
      },
      {
        path: "cbt",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <CBTPage />
          </Suspense>
        ),
      },
      {
        path: "development",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <DevelopmentTools />
          </Suspense>
        ),
      },
      {
        path: "distraction-blocker",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <DistractionBlockerPage />
          </Suspense>
        ),
      },
      {
        path: "exercise",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Exercise />
          </Suspense>
        ),
      },
      {
        path: "eye-exercises",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <EyeExercisesPage />
          </Suspense>
        ),
      },
      {
        path: "eye-care",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <EyeExercisesPage />
          </Suspense>
        ),
      },
      {
        path: "focus",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <FocusPage />
          </Suspense>
        ),
      },
      {
        path: "food",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <FoodPage />
          </Suspense>
        ),
      },
      {
        path: "meditation",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <MeditationPage />
          </Suspense>
        ),
      },
      {
        path: "motivation",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <MotivationPage />
          </Suspense>
        ),
      },
      {
        path: "nicotine",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <NicotinePage />
          </Suspense>
        ),
      },
      {
        path: "quit-plan",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <QuitPlanPage />
          </Suspense>
        ),
      },
      {
        path: "recovery",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <RecoveryPage />
          </Suspense>
        ),
      },
      {
        path: "relax",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <RelaxPage />
          </Suspense>
        ),
      },
      {
        path: "sleep",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <SleepPage />
          </Suspense>
        ),
      },
      {
        path: "sleep-track",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <SleepTrackPage />
          </Suspense>
        ),
      },
      {
        path: "sobriety",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <SobrietyPage />
          </Suspense>
        ),
      },
      {
        path: "substance-log",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <SubstanceLogPage />
          </Suspense>
        ),
      },
      {
        path: "supplements",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <SupplementsPage />
          </Suspense>
        ),
      },
      {
        path: "support",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <SupportPage />
          </Suspense>
        ),
      },
      {
        path: "bathing",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <BathingPage />
          </Suspense>
        ),
      },
    ],
  },
])

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
    </QueryClientProvider>
  )
}

export default App
