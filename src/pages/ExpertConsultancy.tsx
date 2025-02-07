
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Award, Star } from "lucide-react"
import { Database } from "@/types/supabase"

type ExpertProfile = Database['public']['Tables']['expert_profiles']['Row'] & {
  profiles: {
    full_name: string | null
    avatar_url: string | null
  }
}

const ExpertConsultancy = () => {
  const { data: experts, isLoading } = useQuery({
    queryKey: ['experts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('expert_profiles')
        .select(`
          id,
          credentials,
          specialties,
          verification_status,
          verified_at,
          profiles (
            full_name,
            avatar_url
          )
        `)
        .eq('verification_status', 'approved')
      
      if (error) throw error
      return data as ExpertProfile[]
    }
  })

  return (
    <div className="container max-w-6xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Expert Consultancy</h1>
          <p className="text-muted-foreground">
            Get personalized energy plans from verified experts
          </p>
        </div>
        <Button>Apply as Expert</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div>Loading experts...</div>
        ) : (
          experts?.map((expert) => (
            <Card key={expert.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-4">
                  {expert.profiles.avatar_url ? (
                    <img
                      src={expert.profiles.avatar_url}
                      alt={expert.profiles.full_name || 'Expert'}
                      className="w-12 h-12 rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                  )}
                  <div>
                    <CardTitle>{expert.profiles.full_name || 'Anonymous Expert'}</CardTitle>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>Verified Expert</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Specialties</h3>
                    <div className="flex flex-wrap gap-2">
                      {expert.specialties.map((specialty) => (
                        <Badge key={specialty} variant="secondary">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Credentials</h3>
                    <div className="space-y-1">
                      {expert.credentials.map((credential) => (
                        <div key={credential} className="text-sm text-muted-foreground">
                          • {credential}
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button className="w-full">Request Consultation</Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

export default ExpertConsultancy
