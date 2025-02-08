
import { useAuth } from "@/components/AuthProvider"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format } from "date-fns"
import { Info } from "lucide-react"

export function TeaTracker() {
  const { session } = useAuth()

  const { data: logs, isLoading } = useQuery({
    queryKey: ['tea-logs'],
    queryFn: async () => {
      if (!session?.user?.id) throw new Error("User not authenticated")

      const { data, error } = await supabase
        .from('herbal_tea_logs')
        .select('*')
        .eq('user_id', session.user.id)
        .order('consumed_at', { ascending: false })
        .limit(10)

      if (error) throw error
      return data
    },
    enabled: !!session?.user?.id,
  })

  const { data: teas } = useQuery({
    queryKey: ['herbal-teas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('herbal_teas')
        .select('*')
        .order('name')
      
      if (error) throw error
      return data
    }
  })

  const { data: equipment } = useQuery({
    queryKey: ['tea-equipment'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tea_equipment')
        .select('*')
        .order('name')
      
      if (error) throw error
      return data
    }
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <Tabs defaultValue="history" className="w-full space-y-6">
      <TabsList className="grid grid-cols-3 w-full">
        <TabsTrigger value="history">History</TabsTrigger>
        <TabsTrigger value="library">Tea Library</TabsTrigger>
        <TabsTrigger value="equipment">Equipment</TabsTrigger>
      </TabsList>

      <TabsContent value="history">
        {!logs?.length ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">No tea intake logged yet</p>
            </CardContent>
          </Card>
        ) : (
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-4">
              {logs.map((log) => (
                <Card key={log.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{log.tea_name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-sm text-muted-foreground">
                            {log.amount_grams}g - {log.brewing_method}
                          </p>
                          {log.water_temperature && (
                            <Badge variant="outline">{log.water_temperature}°C</Badge>
                          )}
                          {log.steep_time_seconds && (
                            <Badge variant="outline">{Math.round(log.steep_time_seconds / 60)}min</Badge>
                          )}
                        </div>
                        {log.effects && log.effects.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {log.effects.map((effect, index) => (
                              <Badge key={index} variant="secondary">{effect}</Badge>
                            ))}
                          </div>
                        )}
                        {log.notes && (
                          <p className="mt-2 text-sm text-muted-foreground">{log.notes}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <Badge variant={log.rating >= 4 ? "default" : "secondary"}>
                          Rating: {log.rating}/5
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(new Date(log.consumed_at), 'MMM d, yyyy h:mm a')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </TabsContent>

      <TabsContent value="library">
        <div className="grid gap-6">
          {/* Traditional Teas Section */}
          <Card>
            <CardHeader>
              <CardTitle>Traditional & Alternative Teas</CardTitle>
              <CardDescription>Comprehensive guide to various tea types and their properties</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teas?.map((tea) => (
                  <Card key={tea.id} className="overflow-hidden">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{tea.name}</CardTitle>
                          <Badge className="mt-1">{tea.category}</Badge>
                        </div>
                        {tea.caffeine_content_mg && (
                          <Badge variant="outline">
                            {tea.caffeine_content_mg}mg caffeine
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">{tea.description}</p>
                      
                      {tea.benefits && tea.benefits.length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-1">Benefits:</p>
                          <div className="flex flex-wrap gap-1">
                            {tea.benefits.map((benefit) => (
                              <Badge key={benefit} variant="secondary">
                                {benefit}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="pt-2 border-t space-y-2">
                        <div className="flex items-center text-sm">
                          <Info className="w-4 h-4 mr-2" />
                          <span>Steep: {tea.steep_time_range_seconds?.[0]/60}-{tea.steep_time_range_seconds?.[1]/60} min at {tea.optimal_temp_celsius}°C</span>
                        </div>
                        {tea.water_quality_notes && (
                          <p className="text-sm text-muted-foreground">{tea.water_quality_notes}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Brewing Guide Section */}
          <Card>
            <CardHeader>
              <CardTitle>Brewing Guides</CardTitle>
              <CardDescription>Detailed instructions for optimal tea preparation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {teas?.filter(tea => tea.brewing_instructions).map((tea) => (
                  <Card key={tea.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{tea.name} Brewing Guide</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{tea.brewing_instructions}</p>
                      {tea.steeping_vessel_recommendations && (
                        <div className="mt-2">
                          <p className="text-sm font-medium">Recommended Vessels:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {tea.steeping_vessel_recommendations.map((vessel) => (
                              <Badge key={vessel} variant="outline">{vessel}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="equipment">
        <Card>
          <CardHeader>
            <CardTitle>Tea Equipment Guide</CardTitle>
            <CardDescription>Essential tools and equipment for tea preparation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {equipment?.map((item) => (
                <Card key={item.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <Badge>{item.category}</Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                    
                    {item.best_for && item.best_for.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm font-medium mb-1">Best For:</p>
                        <div className="flex flex-wrap gap-1">
                          {item.best_for.map((use) => (
                            <Badge key={use} variant="secondary">
                              {use}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      {item.material && (
                        <p className="text-sm">Material: {item.material}</p>
                      )}
                      {item.capacity && (
                        <p className="text-sm">Capacity: {item.capacity}</p>
                      )}
                      {item.price_range && (
                        <p className="text-sm">Price Range: {item.price_range}</p>
                      )}
                    </div>

                    {(item.pros || item.cons) && (
                      <div className="mt-4 pt-4 border-t space-y-3">
                        {item.pros && (
                          <div>
                            <p className="text-sm font-medium mb-1">Pros:</p>
                            <div className="flex flex-wrap gap-1">
                              {item.pros.map((pro) => (
                                <Badge key={pro} variant="secondary">
                                  {pro}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        {item.cons && (
                          <div>
                            <p className="text-sm font-medium mb-1">Cons:</p>
                            <div className="flex flex-wrap gap-1">
                              {item.cons.map((con) => (
                                <Badge key={con} variant="destructive">
                                  {con}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
