
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const verificationFormSchema = z.object({
  subscriber_id: z.string().min(1, "Subscriber ID is required"),
  policy_number: z.string().min(1, "Policy number is required"),
});

export function InsuranceCoverageVerification() {
  const { toast } = useToast();
  const [isChecking, setIsChecking] = useState(false);

  const form = useForm<z.infer<typeof verificationFormSchema>>({
    resolver: zodResolver(verificationFormSchema),
  });

  async function onSubmit(values: z.infer<typeof verificationFormSchema>) {
    setIsChecking(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please log in to verify coverage",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("insurance_eligibility_checks").insert({
        client_insurance_id: user.id,
        professional_id: user.id, // This should be updated with the actual professional's ID
        status: "pending",
        coverage_details: values,
      });

      if (error) throw error;

      toast({
        title: "Verification initiated",
        description: "Your coverage verification request has been submitted",
      });
    } catch (error) {
      console.error("Error verifying coverage:", error);
      toast({
        title: "Error verifying coverage",
        description: "There was an error verifying your coverage. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  }

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Verify Insurance Coverage</CardTitle>
          <CardDescription>
            Enter your insurance details to verify your coverage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="subscriber_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subscriber ID</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="policy_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Policy Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button type="submit" disabled={isChecking}>
                  {isChecking ? "Checking..." : "Verify Coverage"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
