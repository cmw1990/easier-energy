
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
import { useAuth } from "@/components/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  Brain, 
  Users, 
  Calendar, 
  Activity, 
  LineChart,
  MessagesSquare,
  Package,
  AlertTriangle 
} from "lucide-react";

export default function MentalHealth() {
  const { session } = useAuth();
  const [userRole, setUserRole] = useState<'client' | 'professional' | null>(null);

  const { data: profile } = useQuery({
    queryKey: ['user-profile', session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session?.user?.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id
  });

  useEffect(() => {
    if (profile?.role) {
      setUserRole(profile.role as 'client' | 'professional');
    }
  }, [profile]);

  if (userRole === 'professional') {
    return <ProfessionalDashboard />;
  }

  if (userRole === 'client') {
    return <ClientDashboard />;
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Brain className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Mental Health Support</h1>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid grid-cols-2 lg:grid-cols-8 gap-4">
          <TabsTrigger value="dashboard" className="gap-2">
            <Activity className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="professionals" className="gap-2">
            <Users className="h-4 w-4" />
            Find Professional
          </TabsTrigger>
          <TabsTrigger value="consultations" className="gap-2">
            <Calendar className="h-4 w-4" />
            Consultations
          </TabsTrigger>
          <TabsTrigger value="packages" className="gap-2">
            <Package className="h-4 w-4" />
            Packages
          </TabsTrigger>
          <TabsTrigger value="groups" className="gap-2">
            <MessagesSquare className="h-4 w-4" />
            Support Groups
          </TabsTrigger>
          <TabsTrigger value="exercises" className="gap-2">
            <Brain className="h-4 w-4" />
            CBT Exercises
          </TabsTrigger>
          <TabsTrigger value="mood" className="gap-2">
            <LineChart className="h-4 w-4" />
            Mood Tracking
          </TabsTrigger>
          <TabsTrigger value="emergency" className="gap-2">
            <AlertTriangle className="h-4 w-4" />
            Emergency
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <TherapyDashboard />
        </TabsContent>

        <TabsContent value="professionals">
          <ProfessionalDirectory />
        </TabsContent>

        <TabsContent value="consultations">
          <ConsultationBooking />
        </TabsContent>

        <TabsContent value="packages">
          <ConsultationPackages />
        </TabsContent>

        <TabsContent value="groups">
          <SupportGroups />
        </TabsContent>

        <TabsContent value="exercises">
          <CBTExercises />
        </TabsContent>

        <TabsContent value="mood">
          <MoodTracker />
        </TabsContent>

        <TabsContent value="emergency">
          <EmergencyResources />
        </TabsContent>
      </Tabs>
    </div>
  );
}
