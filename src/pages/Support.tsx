import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Users, Phone, Calendar, MessageSquare } from "lucide-react";

export default function Support() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [contact, setContact] = useState("");
  const [isEmergency, setIsEmergency] = useState(false);

  const { data: supportNetwork } = useQuery({
    queryKey: ['support-network'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('support_network')
        .select('*')
        .eq('user_id', session?.user?.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const { data: sessions } = useQuery({
    queryKey: ['support-sessions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('support_sessions')
        .select('*')
        .eq('is_private', false)
        .order('session_date', { ascending: true })
        .limit(5);
      
      if (error) throw error;
      return data;
    },
  });

  const addSupport = useMutation({
    mutationFn: async () => {
      if (!session?.user?.id) throw new Error("Must be logged in");
      
      const { error } = await supabase
        .from('support_network')
        .insert([{
          user_id: session.user.id,
          supporter_name: name,
          relationship,
          contact_info: contact,
          is_emergency_contact: isEmergency,
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['support-network'] });
      toast({
        title: "Contact added",
        description: "Support contact has been added successfully.",
      });
      setName("");
      setRelationship("");
      setContact("");
      setIsEmergency(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add support contact. Please try again.",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Support Network</h1>
        <Button variant="outline" onClick={() => navigate('/sobriety')}>
          Back to Dashboard
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Add Support Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contact name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="relationship">Relationship</Label>
              <Input
                id="relationship"
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                placeholder="e.g., Sponsor, Family, Friend"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact">Contact Information</Label>
              <Input
                id="contact"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Phone number or email"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="emergency"
                checked={isEmergency}
                onCheckedChange={(checked) => setIsEmergency(checked as boolean)}
              />
              <Label htmlFor="emergency">Emergency Contact</Label>
            </div>

            <Button 
              className="w-full" 
              onClick={() => addSupport.mutate()}
              disabled={addSupport.isPending}
            >
              {addSupport.isPending ? "Adding..." : "Add Contact"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Support Sessions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {sessions?.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div>
                  <p className="font-medium">{session.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(session.session_date).toLocaleDateString()}
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Join
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Support Network</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {supportNetwork?.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div className="flex items-center gap-4">
                  {contact.is_emergency_contact ? (
                    <Phone className="h-6 w-6 text-red-500" />
                  ) : (
                    <MessageSquare className="h-6 w-6 text-blue-500" />
                  )}
                  <div>
                    <p className="font-medium">{contact.supporter_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {contact.relationship}
                    </p>
                  </div>
                </div>
                <p className="text-sm">{contact.contact_info}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}