
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TopNav } from "@/components/layout/TopNav";
import { ArrowRight, Book, Layout, Shield, Zap, Brain, Wind, Coffee, Battery, Wrench } from "lucide-react";

const NavigationGuide = () => {
  const routes = [
    {
      section: "Main Pages",
      routes: [
        {
          path: "/",
          name: "Landing Page",
          description: "Main entry point showcasing platform features and tools",
          icon: Layout
        },
        {
          path: "/dashboard",
          name: "Dashboard",
          description: "User's personal dashboard with overview of their progress and tools",
          icon: Battery
        },
        {
          path: "/tools",
          name: "Tools Directory",
          description: "Directory of all available wellness and productivity tools",
          icon: Wrench
        },
      ]
    },
    {
      section: "Energy & Performance",
      routes: [
        {
          path: "/energy-plans",
          name: "Energy Plans",
          description: "Browse and manage energy optimization plans",
          icon: Zap
        },
        {
          path: "/tools/white-noise",
          name: "White Noise Generator",
          description: "Customizable white noise for focus and productivity",
          icon: Wind
        },
        {
          path: "/tools/caffeine-guide",
          name: "Caffeine Guide",
          description: "Optimize caffeine intake for better energy management",
          icon: Coffee
        },
      ]
    },
    {
      section: "Insurance & Protection",
      routes: [
        {
          path: "/insurance",
          name: "Insurance Dashboard",
          description: "Overview of insurance coverage and claims",
          icon: Shield
        },
        {
          path: "/insurance/submit-claim",
          name: "Submit Claim",
          description: "Submit and track insurance claims",
          icon: Shield
        },
        {
          path: "/insurance/verify",
          name: "Verify Coverage",
          description: "Check insurance coverage and eligibility",
          icon: Shield
        },
      ]
    },
    {
      section: "Enhancement Tools",
      routes: [
        {
          path: "/tools/supplement-guide",
          name: "Supplement Guide",
          description: "Comprehensive nootropics and supplements database",
          icon: Brain
        },
        {
          path: "/ad-blocker",
          name: "Ad Blocker",
          description: "Control and manage ad blocking settings",
          icon: Shield
        },
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-8">
          <Book className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Navigation Guide</h1>
        </div>
        <p className="text-muted-foreground mb-8">
          This guide provides an overview of all pages and their purposes in the application.
          Use it for development reference and site structure understanding.
        </p>

        <div className="space-y-8">
          {routes.map((section) => (
            <div key={section.section}>
              <h2 className="text-xl font-semibold mb-4">{section.section}</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {section.routes.map((route) => (
                  <Link key={route.path} to={route.path}>
                    <Card className="h-full hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-primary/10 rounded-full">
                            <route.icon className="h-5 w-5 text-primary" />
                          </div>
                          <CardTitle className="text-lg">{route.name}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>{route.description}</CardDescription>
                        <div className="flex items-center gap-1 text-sm text-primary mt-2">
                          <span>Visit</span>
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NavigationGuide;
