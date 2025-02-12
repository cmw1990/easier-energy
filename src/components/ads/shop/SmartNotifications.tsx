
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, TrendingUp, MessageCircle } from 'lucide-react';
import { CustomerBehavior } from "@/types/ConsultationTypes";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export function CustomerEngagement() {
  const { data: customerData } = useQuery({
    queryKey: ['customer-behavior-analysis'],
    queryFn: async () => {
      const { data } = await supabase
        .from('customer_behavior_analysis')
        .select('*')
        .single();

      if (!data) return null;

      // Transform the data to match CustomerBehavior type
      return {
        id: data.id,
        vendor_id: data.vendor_id,
        behavior_patterns: {
          active_users: data.behavior_patterns?.active_users || 0,
          engagement_rate: data.behavior_patterns?.engagement_rate || 0,
          response_rate: data.behavior_patterns?.response_rate || 0,
          peak_hours: data.behavior_patterns?.peak_hours || [],
          segments: data.behavior_patterns?.segments || []
        },
        customer_segments: {
          new: data.customer_segments?.new || 0,
          returning: data.customer_segments?.returning || 0,
          inactive: data.customer_segments?.inactive || 0
        },
        revenue_trends: {
          daily: data.revenue_trends?.daily || [],
          weekly: data.revenue_trends?.weekly || [],
          monthly: data.revenue_trends?.monthly || []
        },
        created_at: data.created_at
      } as CustomerBehavior;
    }
  });

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
          <div className="w-full">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          </div>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {customerData?.behavior_patterns?.active_users || 0}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
          <div className="w-full">
            <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
          </div>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {customerData?.behavior_patterns?.engagement_rate || 0}%
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
          <div className="w-full">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
          </div>
          <MessageCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {customerData?.behavior_patterns?.response_rate || 0}%
          </div>
        </CardContent>
      </Card>

      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Segment Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={customerData?.behavior_patterns?.segments || []}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {customerData?.behavior_patterns?.segments?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
