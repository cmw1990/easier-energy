
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CBTExercises } from "@/components/cbt/CBTExercises";
import { ConsultationBooking } from "@/components/mentalHealth/ConsultationBooking";
import { ProfessionalDirectory } from "@/components/mentalHealth/ProfessionalDirectory";
import { MoodTracker } from "@/components/mentalHealth/MoodTracker";
import { TherapyDashboard } from "@/components/mentalHealth/TherapyDashboard";
import { useAuth } from "@/components/AuthProvider";
import { Brain, Users, Calendar, Activity, LineChart } from "lucide-react";

export default function MentalHealth() {
  const { session } = useAuth();

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Brain className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Mental Health Support</h1>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid grid-cols-2 lg:grid-cols-5 gap-4">
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
          <TabsTrigger value="exercises" className="gap-2">
            <Brain className="h-4 w-4" />
            CBT Exercises
          </TabsTrigger>
          <TabsTrigger value="mood" className="gap-2">
            <LineChart className="h-4 w-4" />
            Mood Tracking
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

        <TabsContent value="exercises">
          <CBTExercises />
        </TabsContent>

        <TabsContent value="mood">
          <MoodTracker />
        </TabsContent>
      </Tabs>
    </div>
  );
}
