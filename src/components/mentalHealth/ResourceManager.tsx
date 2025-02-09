
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Plus, Edit2, Trash2 } from "lucide-react";

export function ResourceManager() {
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<string | null>(null);
  const [newResource, setNewResource] = useState({
    title: "",
    content: "",
    category: "",
    is_public: false
  });

  const { data: resources } = useQuery({
    queryKey: ['professional-resources', session?.user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('professional_resources')
        .select('*')
        .eq('created_by', session?.user?.id)
        .order('created_at', { ascending: false });
      return data;
    },
    enabled: !!session?.user?.id
  });

  const createResource = useMutation({
    mutationFn: async (resourceData: typeof newResource) => {
      const { data, error } = await supabase
        .from('professional_resources')
        .insert([{
          ...resourceData,
          created_by: session?.user?.id
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['professional-resources'] });
      setNewResource({
        title: "",
        content: "",
        category: "",
        is_public: false
      });
      toast({
        title: "Success",
        description: "Resource created successfully"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create resource",
        variant: "destructive"
      });
      console.error('Resource error:', error);
    }
  });

  const updateResource = useMutation({
    mutationFn: async (resourceData: any) => {
      const { data, error } = await supabase
        .from('professional_resources')
        .update(resourceData)
        .