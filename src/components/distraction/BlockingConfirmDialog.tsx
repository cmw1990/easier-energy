import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";

interface BlockingConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: "block" | "allow";
}

export function BlockingConfirmDialog({
  open,
  onOpenChange,
  action,
}: BlockingConfirmDialogProps) {
  const { toast } = useToast();
  const { session } = useAuth();

  const handleConfirm = async () => {
    if (!session?.user?.id) return;

    try {
      const { error } = await supabase
        .from('distraction_blocking')
        .update({ is_active: action === 'block' })
        .eq('user_id', session.user.id);

      if (error) throw error;

      toast({
        title: `${action === 'block' ? 'Blocked' : 'Allowed'} all distractions`,
        description: `Successfully ${action === 'block' ? 'blocked' : 'allowed'} all distractions.`,
      });
    } catch (error) {
      console.error('Error updating blocking rules:', error);
      toast({
        title: "Error updating blocking rules",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {action === 'block' ? 'Block All Distractions?' : 'Allow All Distractions?'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {action === 'block'
              ? "This will activate all your blocking rules. You won't be able to access blocked content until you allow it again."
              : "This will temporarily disable all your blocking rules. You'll have full access to all content."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>
            {action === 'block' ? 'Block All' : 'Allow All'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}