
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/components/AuthProvider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"

const VENDOR_RULES = `
1. Product Quality Standards:
   - All products must be authentic and as described
   - Products must meet applicable safety standards
   - Clear product descriptions and accurate images required

2. Shipping and Delivery:
   - Accurate processing times must be maintained
   - Proper packaging to ensure safe delivery
   - Valid tracking numbers must be provided

3. Customer Service:
   - Respond to customer inquiries within 24 hours
   - Professional communication at all times
   - Fair and transparent return policy required

4. Compliance:
   - Adhere to all applicable laws and regulations
   - Maintain required licenses and permits
   - Proper tax reporting and collection

5. Platform Policies:
   - Maintain accurate inventory levels
   - No prohibited items or services
   - Commission fees as agreed upon

Violation of these rules may result in suspension or termination of vendor privileges.
`;

export function VendorSettings() {
  const { session } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    business_registration: '',
    tax_id: '',
    return_policy: '',
    shipping_policy: '',
    customer_service_email: '',
    customer_service_phone: '',
    rules_accepted: false
  });

  const { data: vendor, isLoading } = useQuery({
    queryKey: ['vendor-settings', session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .eq('claimed_by', session?.user?.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id
  });

  useEffect(() => {
    if (vendor) {
      setSettings({
        business_registration: vendor.business_registration || '',
        tax_id: vendor.tax_id || '',
        return_policy: vendor.return_policy || '',
        shipping_policy: vendor.shipping_policy || '',
        customer_service_email: vendor.customer_service_email || '',
        customer_service_phone: vendor.customer_service_phone || '',
        rules_accepted: vendor.rules_accepted || false
      });
    }
  }, [vendor]);

  const saveSettings = async () => {
    try {
      const { error } = await supabase
        .from('vendors')
        .update({
          ...settings,
          rules_accepted_at: settings.rules_accepted ? new Date().toISOString() : null
        })
        .eq('claimed_by', session?.user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Settings saved successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return <div>Loading settings...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
          <CardDescription>
            Provide your business details and documentation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="business_registration">Business Registration Number</Label>
            <Input
              id="business_registration"
              value={settings.business_registration}
              onChange={(e) => setSettings(s => ({ ...s, business_registration: e.target.value }))}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="tax_id">Tax ID</Label>
            <Input
              id="tax_id"
              value={settings.tax_id}
              onChange={(e) => setSettings(s => ({ ...s, tax_id: e.target.value }))}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Policies</CardTitle>
          <CardDescription>
            Set up your store policies
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="return_policy">Return Policy</Label>
            <Textarea
              id="return_policy"
              value={settings.return_policy}
              onChange={(e) => setSettings(s => ({ ...s, return_policy: e.target.value }))}
              rows={4}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="shipping_policy">Shipping Policy</Label>
            <Textarea
              id="shipping_policy"
              value={settings.shipping_policy}
              onChange={(e) => setSettings(s => ({ ...s, shipping_policy: e.target.value }))}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Customer Service</CardTitle>
          <CardDescription>
            Contact information for customer support
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="customer_service_email">Support Email</Label>
            <Input
              id="customer_service_email"
              type="email"
              value={settings.customer_service_email}
              onChange={(e) => setSettings(s => ({ ...s, customer_service_email: e.target.value }))}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="customer_service_phone">Support Phone</Label>
            <Input
              id="customer_service_phone"
              type="tel"
              value={settings.customer_service_phone}
              onChange={(e) => setSettings(s => ({ ...s, customer_service_phone: e.target.value }))}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Vendor Rules and Terms</CardTitle>
          <CardDescription>
            Review and accept our vendor rules and terms
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <pre className="whitespace-pre-wrap text-sm">
              {VENDOR_RULES}
            </pre>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="rules_accepted"
              checked={settings.rules_accepted}
              onCheckedChange={(checked) => setSettings(s => ({ ...s, rules_accepted: checked }))}
            />
            <Label htmlFor="rules_accepted">
              I accept the vendor rules and terms
            </Label>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={saveSettings} size="lg">
          Save Settings
        </Button>
      </div>
    </div>
  );
}
