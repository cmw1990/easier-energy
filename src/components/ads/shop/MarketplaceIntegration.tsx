
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MarketplaceMetrics {
  id: string
  metrics_data: {
    total_revenue: number
    total_orders: number 
    conversion_rate: number
  }
}

export function MarketplaceIntegration() {
  const { data: metrics } = useQuery({
    queryKey