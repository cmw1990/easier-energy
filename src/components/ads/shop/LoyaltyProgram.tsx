
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Trophy, Gift, Users } from 'lucide-react';
import { useAuth } from "@/components/AuthProvider";

interface LoyaltyTier {
  name: string;
  points_required: number;
  benefits: string[];
}

interface LoyaltyReward {
  name: string;
  points_cost: number;
  description: string;
}

interface LoyaltyProgram {
  id: string;
  program_name: string;
  points_ratio: number;
  tiers: LoyaltyTier[];
  rewards: LoyaltyReward[];
}

export function LoyaltyProgram() {
  const { session } = useAuth();

  const { data: vendorId } = useQuery({
    queryKey: ['vendor-id', session?.user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('vendors')
        .select('id')
        .eq('claimed_by', session?.user?.id)
        .single();
      return data?.id;
    },
    enabled: !!session?.user?.id
  });

  const { data: programData, isLoading } = useQuery({
    queryKey: ['loyalty-program', vendorId],
    queryFn: async () => {
      const { data } = await supabase
        .from('vendor_loyalty_programs')
        .select('*')
        .eq('vendor_id', vendorId)
        .single();
      return data as LoyaltyProgram;
    },
    enabled: !!vendorId
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Loyalty Program
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : programData ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">{programData.program_name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {programData.points_ratio} points per $1 spent
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Users className="h-4 w-4" />
                  <h4 className="font-medium">Membership Tiers</h4>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {programData.tiers?.map((tier: LoyaltyTier) => (
                    <div key={tier.name} className="p-4 rounded-lg border bg-card">
                      <h5 className="font-medium">{tier.name}</h5>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {tier.points_required} points required
                      </p>
                      <ul className="mt-2 text-sm space-y-1">
                        {tier.benefits?.map((benefit: string) => (
                          <li key={benefit}>{benefit}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Gift className="h-4 w-4" />
                  <h4 className="font-medium">Available Rewards</h4>