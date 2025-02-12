
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ShieldCheck } from "lucide-react";
import type { InsuranceProvider, InsuranceEligibilityCheck } from "@/types/insurance";

export const InsuranceVerification = ({ 
  sessionId,
  clientId,
  professionalId 
}: { 
  sessionId: string;
  clientId: string;
  professionalId: string;
}) => {
  const { toast } = useToast();
  const [selectedInsurance, setSelectedInsurance] = useState<string>("");
  const [isVerifying, setIsVerifying] = useState(false);

  // Fetch client's insurance information
  const { data: insuranceOptions, isLoading: isLoadingInsurance } = useQuery({
    queryKey: ['client-insurance', clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('client_insurance')
        .select(`
          id,
          insurance_providers (
            id,
            name,
            verification_method
          )
        `)
        .eq('client_id', clientId);

      if (error) throw error;
      return data;
    }
  });

  // Fetch verification status if exists
  const { data: verificationStatus, isLoading: isLoadingVerification } = useQuery({
    queryKey: ['insurance-verification', selectedInsurance],
    enabled: !!selectedInsurance,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('insurance_eligibility_checks')
        .select('*')
        .eq('client_insurance_id', selectedInsurance)
        .eq('professional_id', professionalId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "no rows returned"
      return data as InsuranceEligibilityCheck;
    }
  });

  const verifyInsurance = async () => {
    try {
      setIsVerifying(true);
      
      const { data, error } = await supabase.rpc(
        'check_insurance_eligibility',
        {
          _insurance_id: selectedInsurance,
          _professional_id: professionalId,
          _service_type: 'consultation'
        }
      );

      if (error) throw error;

      toast({
        title: "Verification initiated",
        description: "Insurance verification is in progress.",
      });

    } catch (error) {
      console.error('Error verifying insurance:', error);
      toast({
        title: "Verification failed",
        description: "Could not verify insurance. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const renderVerificationStatus = () => {
    if (!verificationStatus) return null;

    const statusColors = {
      pending: "bg-yellow-100 text-yellow-800",
      verified: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800"
    };

    return (
      <div className={`mt-4 p-4 rounded-lg ${statusColors[verificationStatus.status]}`}>
        <div className="font-medium">Status: {verificationStatus.status}</div>
        {verificationStatus.error_message && (
          <div className="mt-2 text-sm">{verificationStatus.error_message}</div>
        )}
        {verificationStatus.coverage_details && (
          <div className="mt-2 space-y-1 text-sm">
            <div>Copay: ${verificationStatus.copay_amount || 0}</div>
            <div>Coinsurance: {verificationStatus.coinsurance_percentage || 0}%</div>
            <div>Remaining Deductible: ${verificationStatus.deductible_remaining || 0}</div>
          </div>
        )}
      </div>
    );
  };

  if (isLoadingInsurance) {
    return <div>Loading insurance information...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5" />
          Insurance Verification
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Insurance</label>
          <Select
            value={selectedInsurance}
            onValueChange={setSelectedInsurance}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select insurance provider" />
            </SelectTrigger>
            <SelectContent>
              {insuranceOptions?.map((option: any) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.insurance_providers.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedInsurance && (
          <Button
            onClick={verifyInsurance}
            disabled={isVerifying}
            className="w-full"
          >
            {isVerifying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              'Verify Insurance'
            )}
          </Button>
        )}

        {renderVerificationStatus()}
      </CardContent>
    </Card>
  );
};
