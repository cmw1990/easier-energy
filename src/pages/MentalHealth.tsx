
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import CBTExercises from "@/components/cbt/CBTExercises";
import { ConsultationBooking } from "@/components/mentalHealth/ConsultationBooking";
import { ProfessionalDirectory } from "@/components/mentalHealth/ProfessionalDirectory";
import { MoodTracker } from "@/components/mentalHealth/MoodTracker";
import { TherapyDashboard } from "@/components/mentalHealth/TherapyDashboard";
import { SupportGroups } from "@/components/mentalHealth/groups/SupportGroups";
import { EmergencyResources } from "@/components/mentalHealth/crisis/EmergencyResources";
import { ConsultationPackages } from "@/components/mentalHealth/packages/ConsultationPackages";
import { ProfessionalDashboard } from "@/components/mentalHealth/professionals/ProfessionalDashboard";
import { ClientDashboard } from "@/components/mentalHealth/clients/ClientDashboard";
import { TreatmentPlanManager } from "@/components/mentalHealth/treatment/TreatmentPlanManager";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { 
  Brain, 
  Users, 
  Calendar, 
  Activity, 
  LineChart,
  MessagesSquare,
  Package,
  AlertTriangle,
  Loader2,
  ClipboardList
} from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const tabVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

export default function MentalHealth() {
  const { session } = useAuth();
  const { toast } = useToast();
  const [userRole, setUserRole] = useState<'client' | 'professional' | null>(null);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['user-profile', session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session?.user?.id)
        .single();
      
      if (error) {
        toast({
          title: "Error loading profile",
          description: "Please try again later",
          variant: "destructive"
        });
        throw error;
      }
      return data;
    },
    enabled: !!session?.user?.id
  });

  useEffect(() => {
    if (profile?.role) {
      setUserRole(profile.role as 'client' | 'professional');
    }
  }, [profile]);

  if (isLoading) {
    return (
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="container mx-auto p-4 space-y-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <h1 className="text-3xl font-bold">Loading...</h1>
        </div>
        <div className="grid gap-4">
          <Skeleton className="h-12 w-full animate-pulse" />
          <Skeleton className="h-[200px] w-full animate-pulse" />
          <Skeleton className="h-[200px] w-full animate-pulse" />
        </div>
      </motion.div>
    );
  }

  if (userRole === 'professional') {
    return <ProfessionalDashboard />;
  }

  if (userRole === 'client') {
    return <ClientDashboard />;
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="container mx-auto p-4 space-y-6"
    >
      <motion.div 
        variants={fadeIn}
        className="flex items-center gap-2 mb-6"
      >
        <Brain className="h-8 w-8 text-primary animate-pulse" />
        <h1 className="text-3xl font-bold">Mental Health Support</h1>
      </motion.div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <motion.div variants={stagger}>
          <TabsList className="grid grid-cols-2 lg:grid-cols-8 gap-4">
            {[
              { value: "dashboard", icon: <Activity className="h-4 w-4" />, label: "Dashboard" },
              { value: "professionals", icon: <Users className="h-4 w-4" />, label: "Find Professional" },
              { value: "consultations", icon: <Calendar className="h-4 w-4" />, label: "Consultations" },
              { value: "packages", icon: <Package className="h-4 w-4" />, label: "Packages" },
              { value: "groups", icon: <MessagesSquare className="h-4 w-4" />, label: "Support Groups" },
              { value: "exercises", icon: <Brain className="h-4 w-4" />, label: "CBT Exercises" },
              { value: "mood", icon: <LineChart className="h-4 w-4" />, label: "Mood Tracking" },
              { value: "emergency", icon: <AlertTriangle className="h-4 w-4" />, label: "Emergency" }
            ].map((tab) => (
              <motion.div key={tab.value} variants={tabVariants}>
                <TabsTrigger 
                  value={tab.value} 
                  className="gap-2 hover-lift subtle-scale"
                >
                  {tab.icon}
                  {tab.label}
                </TabsTrigger>
              </motion.div>
            ))}
          </TabsList>
        </motion.div>

        <motion.div variants={fadeIn}>
          <TabsContent value="dashboard">
            <Card className="elegant-card">
              <TherapyDashboard />
            </Card>
          </TabsContent>

          <TabsContent value="professionals">
            <Card className="elegant-card">
              <ProfessionalDirectory />
            </Card>
          </TabsContent>

          <TabsContent value="consultations">
            <Card className="elegant-card">
              <ConsultationBooking />
            </Card>
          </TabsContent>

          <TabsContent value="packages">
            <Card className="elegant-card">
              <ConsultationPackages />
            </Card>
          </TabsContent>

          <TabsContent value="groups">
            <Card className="elegant-card">
              <SupportGroups />
            </Card>
          </TabsContent>

          <TabsContent value="exercises">
            <Card className="elegant-card">
              <CBTExercises />
            </Card>
          </TabsContent>

          <TabsContent value="mood">
            <Card className="elegant-card">
              <MoodTracker />
            </Card>
          </TabsContent>

          <TabsContent value="emergency">
            <Card className="elegant-card">
              <EmergencyResources />
            </Card>
          </TabsContent>
        </motion.div>
      </Tabs>
    </motion.div>
  );
}
