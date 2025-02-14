
import { RouteObject } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Dashboard } from "@/pages/Dashboard";
import { InsuranceDashboard } from "@/pages/insurance/Dashboard";
import { SubmitClaim } from "@/pages/insurance/SubmitClaim";
import { VerifyCoverage } from "@/pages/insurance/VerifyCoverage";
import EnergyPlans from "@/pages/EnergyPlans";
import { EnergyPlanDetailsPage } from "@/pages/EnergyPlanDetailsPage";
import { CreateEnergyPlanPage } from "@/pages/CreateEnergyPlanPage";
import { EditEnergyPlanPage } from "@/pages/EditEnergyPlanPage";
import { UserProfilePage } from "@/pages/UserProfilePage";
import { SettingsPage } from "@/pages/SettingsPage";
import { PregnancyDashboard } from "@/pages/pregnancy/PregnancyDashboard";
import { PregnancyWellnessLog } from "@/pages/pregnancy/PregnancyWellnessLog";
import { PregnancyMilestonesPage } from "@/pages/pregnancy/PregnancyMilestonesPage";
import { CreatePregnancyMilestonePage } from "@/pages/pregnancy/CreatePregnancyMilestonePage";
import { EditPregnancyMilestonePage } from "@/pages/pregnancy/EditPregnancyMilestonePage";
import { ShopPage } from "@/pages/shop/ShopPage";
import { ProductDetailsPage } from "@/pages/shop/ProductDetailsPage";
import { CheckoutPage } from "@/pages/shop/CheckoutPage";
import { OrdersPage } from "@/pages/shop/OrdersPage";
import { ConsultationsPage } from "@/pages/consultations/ConsultationsPage";
import { BookConsultationPage } from "@/pages/consultations/BookConsultationPage";
import { ConsultationDetailsPage } from "@/pages/consultations/ConsultationDetailsPage";
import { ProfessionalsPage } from "@/pages/consultations/ProfessionalsPage";
import { ProfessionalDetailsPage } from "@/pages/consultations/ProfessionalDetailsPage";
import { VendorDashboard } from "@/pages/vendor/VendorDashboard";
import { VendorProductsPage } from "@/pages/vendor/VendorProductsPage";
import { VendorOrdersPage } from "@/pages/vendor/VendorOrdersPage";
import { VendorAnalyticsPage } from "@/pages/vendor/VendorAnalyticsPage";
import { VendorPromotionsPage } from "@/pages/vendor/VendorPromotionsPage";
import { VendorSettingsPage } from "@/pages/vendor/VendorSettingsPage";
import { VendorConsultationsPage } from "@/pages/vendor/VendorConsultationsPage";
import { VendorClientsPage } from "@/pages/vendor/VendorClientsPage";
import { VendorResourcesPage } from "@/pages/vendor/VendorResourcesPage";
import { VendorFinancialsPage } from "@/pages/vendor/VendorFinancialsPage";
import { VendorSupportPage } from "@/pages/vendor/VendorSupportPage";
import { VendorLoyaltyProgramPage } from "@/pages/vendor/VendorLoyaltyProgramPage";
import { VendorSmartNotificationsPage } from "@/pages/vendor/VendorSmartNotificationsPage";
import { VendorMessagesPage } from "@/pages/vendor/VendorMessagesPage";

export const mainRoutes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "insurance",
        element: <InsuranceDashboard />,
      },
      {
        path: "insurance/submit-claim",
        element: <SubmitClaim />,
      },
      {
        path: "insurance/verify",
        element: <VerifyCoverage />,
      },
      {
        path: "energy-plans",
        element: <EnergyPlans />,
      },
      {
        path: "energy-plans/:id",
        element: <EnergyPlanDetailsPage />,
      },
      {
        path: "energy-plans/create",
        element: <CreateEnergyPlanPage />,
      },
      {
        path: "energy-plans/:id/edit",
        element: <EditEnergyPlanPage />,
      },
      {
        path: "profile",
        element: <UserProfilePage />,
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
      {
        path: "pregnancy",
        element: <PregnancyDashboard />,
      },
      {
        path: "pregnancy/wellness-log",
        element: <PregnancyWellnessLog />,
      },
      {
        path: "pregnancy/milestones",
        element: <PregnancyMilestonesPage />,
      },
      {
        path: "pregnancy/milestones/create",
        element: <CreatePregnancyMilestonePage />,
      },
      {
        path: "pregnancy/milestones/:id/edit",
        element: <EditPregnancyMilestonePage />,
      },
      {
        path: "shop",
        element: <ShopPage />,
      },
      {
        path: "shop/:id",
        element: <ProductDetailsPage />,
      },
      {
        path: "checkout",
        element: <CheckoutPage />,
      },
      {
        path: "orders",
        element: <OrdersPage />,
      },
      {
        path: "consultations",
        element: <ConsultationsPage />,
      },
      {
        path: "consultations/book",
        element: <BookConsultationPage />,
      },
      {
        path: "consultations/:id",
        element: <ConsultationDetailsPage />,
      },
      {
        path: "professionals",
        element: <ProfessionalsPage />,
      },
      {
        path: "professionals/:id",
        element: <ProfessionalDetailsPage />,
      },
      {
        path: "vendor/dashboard",
        element: <VendorDashboard />,
      },
      {
        path: "vendor/products",
        element: <VendorProductsPage />,
      },
      {
        path: "vendor/orders",
        element: <VendorOrdersPage />,
      },
      {
        path: "vendor/analytics",
        element: <VendorAnalyticsPage />,
      },
      {
        path: "vendor/promotions",
        element: <VendorPromotionsPage />,
      },
      {
        path: "vendor/settings",
        element: <VendorSettingsPage />,
      },
      {
        path: "vendor/consultations",
        element: <VendorConsultationsPage />,
      },
      {
        path: "vendor/clients",
        element: <VendorClientsPage />,
      },
      {
        path: "vendor/resources",
        element: <VendorResourcesPage />,
      },
      {
        path: "vendor/financials",
        element: <VendorFinancialsPage />,
      },
      {
        path: "vendor/support",
        element: <VendorSupportPage />,
      },
      {
        path: "vendor/loyalty-program",
        element: <VendorLoyaltyProgramPage />,
      },
      {
        path: "vendor/smart-notifications",
        element: <VendorSmartNotificationsPage />,
      },
      {
        path: "vendor/messages",
        element: <VendorMessagesPage />,
      },
    ],
  },
];
