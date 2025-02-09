
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";

export function ConsultationBooking() {
  const { session } = useAuth();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedProfessional, setSelectedProfessional] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const { data: professionals } = useQuery({
    queryKey: ['available-professionals'],
    queryFn: async () => {
      const { data } = await supabase
        .from('mental_health_professionals')
        .select('*')
        .eq('is_available', true)
        .eq('verification_status', 'approved');
      return data;
    }
  });

  const { data: availableSlots } = useQuery({
    queryKey: ['available-slots', selectedProfessional, selectedDate],
    queryFn: async () => {
      // Here you would implement logic to get available time slots
      // This is a simplified example
      return [
        "09:00", "10:00", "11:00", "14:00", "15:00", "16:00"
      ];
    },
    enabled: !!selectedProfessional && !!selectedDate
  });

  const bookSession = async () => {
    if (!selectedProfessional || !selectedDate || !selectedTime || !session?.user?.id) {
      toast({
        title: "Missing information",
        description: "Please select all required fields",
        variant: "destructive"
      });
      return;
    }

    const sessionDate = new Date(selectedDate);
    const [hours, minutes] = selectedTime.split(':');
    sessionDate.setHours(parseInt(hours), parseInt(minutes));

    const { error } = await supabase
      .from('consultation_sessions')
      .insert({
        professional_id: selectedProfessional,
        client_id: session.user.id,
        session_date: sessionDate.toISOString(),
        duration_minutes: 60,
        session_type: 'video',
        status: 'scheduled'
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to book session. Please try again.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Session booked successfully!"
      });
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Select Professional</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {professionals?.map((professional) => (
            <div
              key={professional.id}
              className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                selectedProfessional === professional.id
                  ? 'bg-primary/10 border-primary'
                  : 'hover:bg-muted'
              }`}
              onClick={() => setSelectedProfessional(professional.id)}
            >
              <h3 className="font-medium">{professional.full_name}</h3>
              <p className="text-sm text-muted-foreground">{professional.title}</p>
              <p className="text-sm text-muted-foreground mt-1">
                ${professional.consultation_fee}/session
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {selectedProfessional && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Select Date</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          {selectedDate && (
            <Card>
              <CardHeader>
                <CardTitle>Available Times</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  {availableSlots?.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {selectedTime && (
            <Button 
              className="w-full" 
              size="lg"
              onClick={bookSession}
            >
              Book Session
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
