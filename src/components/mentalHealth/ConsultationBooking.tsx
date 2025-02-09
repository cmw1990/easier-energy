
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { Badge } from "@/components/ui/badge";
import { ProfessionalAvailability, ConsultationSession } from "@/types/supabase";
import { addDays, format, parse, isSameDay, startOfDay } from "date-fns";

export function ConsultationBooking() {
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
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

  const { data: availability } = useQuery({
    queryKey: ['professional-availability', selectedProfessional, selectedDate],
    queryFn: async () => {
      if (!selectedProfessional || !selectedDate) return null;
      
      const dayOfWeek = selectedDate.getDay();
      const { data } = await supabase
        .from('professional_availability')
        .select('*')
        .eq('professional_id', selectedProfessional)
        .eq('day_of_week', dayOfWeek)
        .eq('is_available', true);
      
      return data;
    },
    enabled: !!selectedProfessional && !!selectedDate
  });

  const { data: existingBookings } = useQuery({
    queryKey: ['existing-bookings', selectedProfessional, selectedDate],
    queryFn: async () => {
      if (!selectedProfessional || !selectedDate) return null;
      
      const { data } = await supabase
        .from('consultation_sessions')
        .select('*')
        .eq('professional_id', selectedProfessional)
        .gte('session_date', startOfDay(selectedDate).toISOString())
        .lt('session_date', addDays(startOfDay(selectedDate), 1).toISOString());
      
      return data;
    },
    enabled: !!selectedProfessional && !!selectedDate
  });

  const bookingMutation = useMutation({
    mutationFn: async (sessionData: Partial<ConsultationSession>) => {
      const { data, error } = await supabase
        .from('consultation_sessions')
        .insert([sessionData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['existing-bookings'] });
      toast({
        title: "Success",
        description: "Session booked successfully!"
      });
      setSelectedTime(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to book session. Please try again.",
        variant: "destructive"
      });
      console.error('Booking error:', error);
    }
  });

  const getAvailableTimeSlots = () => {
    if (!availability || !selectedDate) return [];
    
    const bookedTimes = new Set(
      existingBookings?.map(booking => 
        format(new Date(booking.session_date), 'HH:mm')
      ) || []
    );

    const slots: string[] = [];
    availability.forEach(slot => {
      const startTime = parse(slot.start_time, 'HH:mm:ss', new Date());
      const endTime = parse(slot.end_time, 'HH:mm:ss', new Date());
      let currentTime = startTime;

      while (currentTime < endTime) {
        const timeStr = format(currentTime, 'HH:mm');
        if (!bookedTimes.has(timeStr)) {
          slots.push(timeStr);
        }
        currentTime = addDays(currentTime, 1/24); // Add 1 hour
      }
    });

    return slots;
  };

  const handleBooking = async () => {
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

    bookingMutation.mutate({
      professional_id: selectedProfessional,
      client_id: session.user.id,
      session_date: sessionDate.toISOString(),
      duration_minutes: 60,
      session_type: 'video',
      status: 'scheduled'
    });
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
              <div className="flex items-center gap-4">
                {professional.avatar_url && (
                  <img
                    src={professional.avatar_url}
                    alt={professional.full_name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
                <div>
                  <h3 className="font-medium">{professional.full_name}</h3>
                  <p className="text-sm text-muted-foreground">{professional.title}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {professional.specialties.map((specialty, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
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
                disabled={(date) => {
                  const dayOfWeek = date.getDay();
                  return !availability?.some(slot => slot.day_of_week === dayOfWeek);
                }}
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
                  {getAvailableTimeSlots().map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      onClick={() => setSelectedTime(time)}
                      className="w-full"
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
              onClick={handleBooking}
              disabled={bookingMutation.isPending}
            >
              {bookingMutation.isPending ? "Booking..." : "Book Session"}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
