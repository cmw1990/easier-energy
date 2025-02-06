
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/components/AuthProvider"

import Layout from "@/components/layout/Layout"
import NotFound from "@/components/layout/NotFound"
import Index from "@/pages/Index"
import Auth from "@/pages/Auth"
import LandingPage from "@/pages/LandingPage"
import CBTPage from "@/pages/CBT"
import BreathingPage from "@/pages/Breathing"
import CaffeinePage from "@/pages/Caffeine"
import DashboardPage from "@/pages/Dashboard"
import DistractionBlockerPage from "@/pages/DistractionBlocker"
import ExercisePage from "@/pages/Exercise"
import EyeExercisesPage from "@/pages/EyeExercises"
import FocusPage from "@/pages/Focus"
import FoodPage from "@/pages/Food"
import MeditationPage from "@/pages/Meditation"
import MotivationPage from "@/pages/Motivation"
import NicotinePage from "@/pages/Nicotine"
import QuitPlanPage from "@/pages/QuitPlan"
import RecoveryPage from "@/pages/Recovery"
import RelaxPage from "@/pages/Relax"
import SleepPage from "@/pages/Sleep"
import SleepTrackPage from "@/pages/SleepTrack"
import SobrietyPage from "@/pages/Sobriety"
import SubstanceLogPage from "@/pages/SubstanceLog"
import SupplementsPage from "@/pages/Supplements"
import SupportPage from "@/pages/Support"
import WebTools from "@/pages/WebTools"
import WhiteNoise from "@/pages/tools/WhiteNoise"
import BreathingGame from "@/components/games/BreathingGame"
import BalloonJourney from "@/components/games/BalloonJourney"
import ZenGarden from "@/components/games/ZenGarden"
import DevelopmentTools from "@/pages/DevelopmentTools"

const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/desktop",
    element: <Index />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  // Public web tools routes
  {
    path: "/tools",
    children: [
      {
        path: "",
        element: <WebTools />,
      },
      {
        path: "white-noise",
        element: <WhiteNoise />,
      },
      {
        path: ":toolSlug",
        element: <WebTools />,
      }
    ],
  },
  // Standalone breathing game routes outside the main layout
  {
    path: "/breathing-pufferfish",
    element: <BreathingGame />,
  },
  {
    path: "/breathing-balloon",
    element: <BalloonJourney />,
  },
  {
    path: "/breathing-zen",
    element: <ZenGarden />,
  },
  // Main app routes (protected)
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
        element: <DashboardPage />,
      },
      {
        path: "breathing",
        element: <BreathingPage />,
      },
      {
        path: "caffeine",
        element: <CaffeinePage />,
      },
      {
        path: "cbt",
        element: <CBTPage />,
      },
      {
        path: "development",
        element: <DevelopmentTools />,
      },
      {
        path: "distraction-blocker",
        element: <DistractionBlockerPage />,
      },
      {
        path: "exercise",
        element: <ExercisePage />,
      },
      {
        path: "eye-exercises",
        element: <EyeExercisesPage />,
      },
      {
        path: "focus",
        element: <FocusPage />,
      },
      {
        path: "food",
        element: <FoodPage />,
      },
      {
        path: "meditation",
        element: <MeditationPage />,
      },
      {
        path: "motivation",
        element: <MotivationPage />,
      },
      {
        path: "nicotine",
        element: <NicotinePage />,
      },
      {
        path: "quit-plan",
        element: <QuitPlanPage />,
      },
      {
        path: "recovery",
        element: <RecoveryPage />,
      },
      {
        path: "relax",
        element: <RelaxPage />,
      },
      {
        path: "sleep",
        element: <SleepPage />,
      },
      {
        path: "sleep-track",
        element: <SleepTrackPage />,
      },
      {
        path: "sobriety",
        element: <SobrietyPage />,
      },
      {
        path: "substance-log",
        element: <SubstanceLogPage />,
      },
      {
        path: "supplements",
        element: <SupplementsPage />,
      },
      {
        path: "support",
        element: <SupportPage />,
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
