
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Pill, Clock, Plus, X } from "lucide-react";
import { format } from "date-fns";

export const MedicationReminders = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [reminders, setReminders] = useState<any[]>([]);
  const [newReminder, setNewReminder] = useState({
    medication_name: "",
    dosage: "",
    frequency: "daily",
    reminder_time: "",
  });

  useEffect(() => {
    if (session?.user) {
      loadReminders();
    }
  }, [session?.user]);

  const loadReminders = async () => {
    try {
      const { data, error } = await supabase
        .from('medication_reminders')
        .select('*')
        .eq('user_id', session?.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReminders(data || []);
    } catch (error) {
      console.error('Error loading reminders:', error);
      toast({
        title: "Error loading reminders",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  const addReminder = async () => {
    if (!newReminder.medication_name || !newReminder.dosage || !newReminder.reminder_time) return;

    try {
      const { error } = await supabase.from('medication_reminders').insert({
        user_id: session?.user.id,
        medication_name: newReminder.medication_name,
        dosage: newReminder.dosage,
        frequency: newReminder.frequency,
        reminder_times: [newReminder.reminder_time],
      });

      if (error) throw error;

      toast({
        title: "Reminder added",
        description: "Your medication reminder has been created"
      });

      setNewReminder({
        medication_name: "",
        dosage: "",
        frequency: "daily",
        reminder_time: ""
      });
      loadReminders();
    } catch (error) {
      console.error('Error adding reminder:', error);
      toast({
        title: "Error adding reminder",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  const deleteReminder = async (id: string) => {
    try {
      const { error } = await supabase
        .from('medication_reminders')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Reminder deleted",
        description: "The medication reminder has been removed"
      });

      loadReminders();
    } catch (error) {
      console.error('Error deleting reminder:', error);
      toast({
        title: "Error deleting reminder",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Pill className="h-5 w-5 text-blue-500" />
          Medication Reminders
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label>Medication Name</Label>
            <Input
              placeholder="Enter medication name"
              value={newReminder.medication_name}
              onChange={(e) => setNewReminder({ ...newReminder, medication_name: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label>Dosage</Label>
            <Input
              placeholder="Enter dosage"
              value={newReminder.dosage}
              onChange={(e) => setNewReminder({ ...newReminder, dosage: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label>Reminder Time</Label>
            <Input
              type="time"
              value={newReminder.reminder_time}
              onChange={(e) => setNewReminder({ ...newReminder, reminder_time: e.target.value })}
            />
          </div>
          <Button onClick={addReminder} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Reminder
          </Button>
        </div>

        <div className="space-y-2">
          {reminders.map((reminder) => (
            <Card key={reminder.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="font-medium">{reminder.medication_name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {reminder.dosage} • {reminder.frequency}
                  </p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    {reminder.reminder_times?.[0]}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteReminder(reminder.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
