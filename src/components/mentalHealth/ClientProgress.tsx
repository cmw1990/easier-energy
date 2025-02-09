
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Target, Plus } from "lucide-react";

interface ClientProgressProps {
  sessionId: string;
  clientId: string;
}

export function ClientProgress({ sessionId, clientId }: ClientProgressProps) {
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [progress, setProgress] = useState({
    progress_rating: 5,
    notes: "",
    homework: "",
    next_steps: ""
  });

  const { data: existingProgress } = useQuery({
    queryKey: ['client-progress', sessionId],
    queryFn: async () => {
      const { data } = await supabase
        .from('consultation_progress')
        .select('*')
        .eq('session_id', sessionId)
        .single();
      return data;
    },
    onSuccess: (data) => {
      if (data) {
        setProgress({
          progress_rating: data.progress_rating || 5,
          notes: data.notes || "",
          homework: data.homework || "",
          next_steps: data.next_steps || ""
        });
      }
    }
  });

  const updateProgress = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from('consultation_progress')
        .upsert({
          session_id: sessionId,
          professional_id: session?.user?.id,
          client_id: clientId,
          ...progress
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-progress'] });
      toast({
        title: "Success",
        description: "Progress updated successfully"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update progress",
        variant: "destructive"
      });
      console.error('Progress error:', error);
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Client Progress Tracking
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Progress Rating (1-10)</label>
          <Input
            type="number"
            min="1"
            max="10"
            value={progress.progress_rating}
            onChange={(e) => setProgress(prev => ({ 
              ...prev, 
              progress_rating: parseInt(e.target.value) 
            }))}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Progress Notes</label>
          <Textarea
            value={progress.notes}
            onChange={(e) => setProgress(prev => ({ ...prev, notes: e.target.value }))}
            placeholder="Document client's progress..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Homework/Exercises</label>
          <Textarea
            value={progress.homework}
            onChange={(e) => setProgress(prev => ({ ...prev, homework: e.target.value }))}
            placeholder="Assign homework or exercises..."
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Next Steps</label>
          <Textarea
            value={progress.next_steps}
            onChange={(e) => setProgress(prev => ({ ...prev, next_steps: e.target.value }))}
            placeholder="Outline next steps and goals..."
          />
        </div>

        <Button 
          onClick={() => updateProgress.mutate()}
          disabled={updateProgress.isPending}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          {updateProgress.isPending ? "Updating..." : "Update Progress"}
        </Button>
      </CardContent>
    </Card>
  );
}
