
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Package, Clock } from "lucide-react";
import { ConsultationPackages } from "@/components/mentalHealth/packages/ConsultationPackages";

export function ClientConsultationDashboard() {
  const { session } = useAuth();

  const { data: upcomingSessions } = useQuery({
    queryKey: ['upcoming-sessions', session?.user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('consultation_sessions')
        .select(`
          *,
          professional:profiles!consultation_sessions_professional_id_fkey(full_name)
        `)
        .eq('client_id', session?.user?.id)
        .gte('scheduled_start', new Date().toISOString())
        .order('scheduled_start')
        .limit(5);
      return data;
    },
    enabled: !!session?.user?.id
  });

  const { data: activePackages } = useQuery({
    queryKey: ['active-packages', session?.user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('package_purchases')
        .select(`
          *,
          package:consultation_packages!package_purchases_package_id_fkey(name, description),
          professional:profiles!package_purchases_professional_id_fkey(full_name)
        `)
        .eq('client_id', session?.user?.id)
        .eq('status', 'active')
        .gte('expires_at', new Date().toISOString());
      return data;
    },
    enabled: !!session?.user?.id
  });

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Sessions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingSessions?.length ? (
              upcomingSessions.map((session) => (
                <div key={session.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{session.professional?.full_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(session.scheduled_start).toLocaleString()}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Join
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No upcoming sessions</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Active Packages
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activePackages?.length ? (
              activePackages.map((pkg) => (
                <div key={pkg.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{pkg.package?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        with {pkg.professional?.full_name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{pkg.sessions_remaining} sessions left</p>
                      <p className="text-xs text-muted-foreground">
                        Expires {new Date(pkg.expires_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button className="w-full" variant="outline">
                    Book Session
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center space-y-2">
                <p className="text-muted-foreground">No active packages</p>
                <Button variant="outline">Browse Packages</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Available Packages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ConsultationPackages />
        </CardContent>
      </Card>
    </div>
  );
}
