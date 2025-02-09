
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ProfessionalDirectory() {
  const [specialty, setSpecialty] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: professionals, isLoading } = useQuery({
    queryKey: ['mental-health-professionals', specialty, searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('mental_health_professionals')
        .select('*')
        .eq('verification_status', 'approved')
        .eq('is_available', true);

      if (specialty) {
        query = query.contains('specialties', [specialty]);
      }

      if (searchQuery) {
        query = query.ilike('full_name', `%${searchQuery}%`);
      }

      const { data } = await query;
      return data;
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="md:w-1/3"
        />
        <Select value={specialty} onValueChange={setSpecialty}>
          <SelectTrigger className="md:w-1/3">
            <SelectValue placeholder="Filter by specialty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Specialties</SelectItem>
            <SelectItem value="anxiety">Anxiety</SelectItem>
            <SelectItem value="depression">Depression</SelectItem>
            <SelectItem value="stress">Stress Management</SelectItem>
            <SelectItem value="adhd">ADHD</SelectItem>
            <SelectItem value="relationships">Relationships</SelectItem>
            <SelectItem value="trauma">Trauma</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <p>Loading...</p>
        ) : professionals?.map((professional) => (
          <Card key={professional.id}>
            <CardHeader>
              <CardTitle>{professional.full_name}</CardTitle>
              <p className="text-sm text-muted-foreground">{professional.title}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium">Specialties:</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {professional.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs rounded-full bg-primary/10"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium">Experience:</p>
                <p className="text-sm text-muted-foreground">
                  {professional.years_experience} years
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Consultation Fee:</p>
                <p className="text-sm text-muted-foreground">
                  ${professional.consultation_fee}/session
                </p>
              </div>
              <Button className="w-full">Book Consultation</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
