
import { RouteObject } from "react-router-dom";
import CreateEnergyPlanPage from "@/pages/CreateEnergyPlanPage";
import EnergyPlans from "@/pages/EnergyPlans";
import Pregnancy from "@/pages/Pregnancy";
import LandingPage from "@/pages/LandingPage";
import { InsuranceDashboard } from "@/pages/insurance/Dashboard";
import { InsuranceClaimSubmission } from "@/pages/insurance/SubmitClaim";
import { InsuranceCoverageVerification } from "@/pages/insurance/VerifyCoverage";

export const mainRoutes: RouteObject[] = [
  {
    path: "/",
    children: [
      {
        index: true,
        element: <LandingPage />,
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
        path: "pregnancy",
        element: <Pregnancy />,
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
    ],
  }
];
