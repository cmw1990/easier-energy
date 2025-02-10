
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Users, 
  Calendar, 
  Target, 
  ClipboardList,
  MessageSquare,
  Settings
} from "lucide-react";
import { SchedulingRules } from "../scheduling/SchedulingRules";
import { ClientProgress } from "../ClientProgress";
import { SessionNotes } from "../SessionNotes";
import { ConsultationMessaging } from "../ConsultationMessaging";
import { TreatmentPlanManager } from "../treatment/TreatmentPlanManager";
import { ClientGoalsManager } from "../goals/ClientGoalsManager";

export function ProfessionalDashboard() {
  const { session } = useAuth();
  const [selectedClient, setSelectedClient] = useState<string | null>(null);

  const { data: clients } = useQuery({
    queryKey: ['professional-clients', session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('consultation_sessions')
        .select(`
          client_id,
          clients:profiles!client_id(
            id,
            full_name,
            avatar_url
          )
        `)
        .eq('professional_id', session?.user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id
  });

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              My Clients
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {clients?.map((session) => (
              <div
                key={session.client_id}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedClient === session.client_id
                    ? 'bg-primary/10 border-primary'
                    : 'hover:bg-muted'
                }`}
                onClick={() => setSelectedClient(session.client_id)}
              >
                <div className="flex items-center gap-4">
                  {session.clients?.avatar_url && (
                    <img
                      src={session.clients.avatar_url}
                      alt={session.clients.full_name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <p className="font-medium">{session.clients?.full_name}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {selectedClient && (
          <div className="md:col-span-2">
            <Tabs defaultValue="progress" className="space-y-4">
              <TabsList>
                <TabsTrigger value="progress" className="gap-2">
                  <Target className="h-4 w-4" />
                  Progress
                </TabsTrigger>
                <TabsTrigger value="notes" className="gap-2">
                  <ClipboardList className="h-4 w-4" />
                  Notes
                </TabsTrigger>
                <TabsTrigger value="treatment" className="gap-2">
                  <Calendar className="h-4 w-4" />
                  Treatment
                </TabsTrigger>
                <TabsTrigger value="goals" className="gap-2">
                  <Target className="h-4 w-4" />
                  Goals
                </TabsTrigger>
                <TabsTrigger value="chat" className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Chat
                </TabsTrigger>
              </TabsList>

              <TabsContent value="progress">
                <ClientProgress 
                  clientId={selectedClient} 
                  sessionId="" // TODO: Pass latest session ID
                />
              </TabsContent>

              <TabsContent value="notes">
                <SessionNotes 
                  sessionId="" // TODO: Pass latest session ID
                  clientId={selectedClient}
                />
              </TabsContent>

              <TabsContent value="treatment">
                <TreatmentPlanManager clientId={selectedClient} />
              </TabsContent>

              <TabsContent value="goals">
                <ClientGoalsManager clientId={selectedClient} />
              </TabsContent>

              <TabsContent value="chat">
                <ConsultationMessaging 
                  recipientId={selectedClient}
                  recipientName={clients?.find(c => c.client_id === selectedClient)?.clients?.full_name || ''}
                />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Practice Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SchedulingRules />
        </CardContent>
      </Card>
    </div>
  );
}
