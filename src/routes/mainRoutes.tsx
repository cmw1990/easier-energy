import { RouteObject } from "react-router-dom";
import CreateEnergyPlanPage from "@/pages/CreateEnergyPlanPage";
import EnergyPlans from "@/pages/EnergyPlans";
import AdBlockingPage from "@/pages/AdBlockingPage";
import AdsDashboard from "@/pages/AdsDashboard";
import Pregnancy from "@/pages/Pregnancy";
import MoodTracker from "@/pages/MoodTracker";
import InsuranceDashboard from "@/pages/insurance/Dashboard";
import InsuranceClaimSubmission from "@/pages/insurance/SubmitClaim";
import InsuranceCoverageVerification from "@/pages/insurance/VerifyCoverage";
import ClientManagement from "@/pages/mentalHealth/clients/ClientManagement";
import ProfessionalDashboard from "@/pages/mentalHealth/professional/ProfessionalDashboard";

export const mainRoutes: RouteObject = {
  path: "/",
  children: [
    {
      index: true,
      element: <EnergyPlans />,
    },
    {
      path: "energy-plans",
      element: <EnergyPlans />,
    },
    {
      path: "energy-plans/create",
      element: <CreateEnergyPlanPage />,
    },
    {
      path: "ad-blocking",
      element: <AdBlockingPage />,
    },
    {
      path: "ads-dashboard",
      element: <AdsDashboard />,
    },
    {
      path: "pregnancy",
      element: <Pregnancy />,
    },
    {
      path: "mood-tracker",
      element: <MoodTracker />,
    },
    {
      path: "insurance/dashboard",
      element: <InsuranceDashboard />,
    },
    {
      path: "insurance/submit-claim",
      element: <InsuranceClaimSubmission />,
    },
    {
      path: "insurance/verify-coverage",
      element: <InsuranceCoverageVerification />,
    },
    {
      path: "clients",
      element: <ClientManagement />,
    },
    {
      path: "professional-dashboard",
      element: <ProfessionalDashboard />,
    },
  ],
};
