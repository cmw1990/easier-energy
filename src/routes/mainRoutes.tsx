import { Suspense, lazy } from "react"
import Layout from "@/components/layout/Layout"
import NotFound from "@/components/NotFound"
import Desktop from "@/pages/Desktop"
import Auth from "@/pages/Auth"
import LandingPage from "@/pages/LandingPage"
import { AuthProvider } from "@/components/AuthProvider"
import { VendorAdDashboard } from "@/components/ads/VendorAdDashboard"

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
const DevelopmentTools = lazy(() => import("@/pages/DevelopmentTools"))
const Directory = lazy(() => import("@/pages/Directory"))
const NootropicsDatabase = lazy(() => import("@/pages/tools/NootropicsDatabase"))
const CaffeineCalculator = lazy(() => import("@/pages/tools/CaffeineCalculator"))
const TeaDatabase = lazy(() => import("@/pages/tools/TeaDatabase"))
const EnergyEnhancement = lazy(() => import("@/pages/tools/EnergyEnhancement"))
const Sleep = lazy(() => import("@/pages/tools/Sleep"))
const Light = lazy(() => import("@/pages/tools/Light"))
const SleepAnalytics = lazy(() => import("@/pages/tools/SleepAnalytics"))
const WhyUs = lazy(() => import("@/pages/WhyUs"))
const EnergyPlansPage = lazy(() => import("@/pages/EnergyPlans"))
const ExpertConsultancyPage = lazy(() => import("@/pages/ExpertConsultancy"))
const CyclePage = lazy(() => import("@/pages/Cycle"))
const PregnancyPage = lazy(() => import("@/pages/Pregnancy"))
const ShopPage = lazy(() => import("@/pages/Shop"))
const MentalHealthPage = lazy(() => import("@/pages/MentalHealth"))

export const mainRoutes = [
  {
    path: "/",
    element: <LandingPage />,
    errorElement: <NotFound />,
  },
  {
    path: "/vendor/ads",
    element: (
      <AuthProvider>
        <Layout>
          <VendorAdDashboard />
        </Layout>
      </AuthProvider>
    ),
  },
  {
    path: "/vendor/ads/dashboard",
    element: (
      <AuthProvider>
        <Layout>
          <VendorAdDashboard />
        </Layout>
      </AuthProvider>
    ),
  },
  {
    path: "/desktop",
    element: <Desktop />,
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
    path: "/why-us",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <WhyUs />
      </Suspense>
    ),
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
      {
        path: "directory",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Directory />
          </Suspense>
        ),
      },
      {
        path: "tools/nootropics",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <NootropicsDatabase />
          </Suspense>
        ),
      },
      {
        path: "tools/caffeine-calculator",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <CaffeineCalculator />
          </Suspense>
        ),
      },
      {
        path: "tools/tea-database",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <TeaDatabase />
          </Suspense>
        ),
      },
      {
        path: "tools/energy-enhancement",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <EnergyEnhancement />
          </Suspense>
        ),
      },
      {
        path: "tools/sleep",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Sleep />
          </Suspense>
        ),
      },
      {
        path: "tools/light",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Light />
          </Suspense>
        ),
      },
      {
        path: "tools/sleep-analytics",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <SleepAnalytics />
          </Suspense>
        ),
      },
      {
        path: "energy-plans",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <EnergyPlansPage />
          </Suspense>
        ),
      },
      {
        path: "expert-consultancy",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <ExpertConsultancyPage />
          </Suspense>
        ),
      },
      {
        path: "cycle",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <CyclePage />
          </Suspense>
        ),
      },
      {
        path: "pregnancy",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <PregnancyPage />
          </Suspense>
        ),
      },
      {
        path: "shop",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <ShopPage />
          </Suspense>
        ),
      },
      {
        path: "mental-health",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <MentalHealthPage />
          </Suspense>
        ),
      },
    ],
  },
]
