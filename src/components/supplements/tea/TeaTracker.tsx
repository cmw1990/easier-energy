import { useAuth } from "@/components/AuthProvider"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format } from "date-fns"
import { Leaf, Thermometer, Clock } from "lucide-react"

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
        .limit(50)

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

  const getEffectivityBadgeColor = (rating: number) => {
    if (rating >= 4) return "default"
    if (rating >= 3) return "secondary"
    return "outline"
  }

  return (
    <Tabs defaultValue="history" className="w-full space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="history">History</TabsTrigger>
        <TabsTrigger value="library">Tea Library</TabsTrigger>
        <TabsTrigger value="equipment">Equipment</TabsTrigger>
      </TabsList>

      <TabsContent value="history">
        {!logs?.length ? (
          <Card>
            <CardContent className="p-6">
              <div className="text-center space-y-2">
                <Leaf className="w-12 h-12 mx-auto text-muted-foreground" />
                <p className="text-muted-foreground">No tea intake logged yet</p>
                <p className="text-sm text-muted-foreground">Start tracking your tea consumption to see your history here</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-4">
              {logs.map((log) => (
                <Card key={log.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{log.tea_name}</h3>
                          <Badge variant={getEffectivityBadgeColor(log.rating)}>
                            Rating: {log.rating}/5
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{log.amount_grams}g</span>
                          <span>•</span>
                          <span className="capitalize">{log.brewing_method.replace('_', ' ')}</span>
                          {log.water_temperature && (
                            <>
                              <span>•</span>
                              <Badge variant="outline">{log.water_temperature}°C</Badge>
                            </>
                          )}
                          {log.steep_time_seconds && (
                            <>
                              <span>•</span>
                              <Badge variant="outline">
                                {Math.floor(log.steep_time_seconds / 60)}:{(log.steep_time_seconds % 60).toString().padStart(2, '0')}
                              </Badge>
                            </>
                          )}
                        </div>

                        {log.effects && log.effects.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {log.effects.map((effect, index) => (
                              <Badge key={index} variant="secondary">{effect}</Badge>
                            ))}
                          </div>
                        )}
                        
                        {log.notes && (
                          <p className="text-sm text-muted-foreground mt-2">{log.notes}</p>
                        )}
                      </div>
                      
                      <time className="text-xs text-muted-foreground">
                        {format(new Date(log.consumed_at), 'MMM d, yyyy h:mm a')}
                      </time>
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
          {/* Tea Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Tea Guide</CardTitle>
              <CardDescription>Comprehensive guide to various tea types and their properties</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teas?.map((tea) => (
                  <Card key={tea.id} className="overflow-hidden">
                    <CardHeader className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{tea.name}</CardTitle>
                          <Badge className="mt-1">{tea.category}</Badge>
                        </div>
                        {tea.caffeine_content_mg !== null && (
                          <Badge variant="outline">
                            {tea.caffeine_content_mg}mg caffeine
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 space-y-4">
                      <p className="text-sm text-muted-foreground">{tea.description}</p>
                      
                      {tea.benefits && tea.benefits.length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-1">Benefits:</p>
                          <div className="flex flex-wrap gap-1">
                            {tea.benefits.map((benefit, idx) => (
                              <Badge key={idx} variant="secondary">
                                {benefit}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="pt-2 border-t space-y-2">
                        <div className="flex items-center text-sm">
                          <Thermometer className="w-4 h-4 mr-2" />
                          <span>{tea.optimal_temp_celsius}°C</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>{tea.steep_time_range_seconds?.[0]/60}-{tea.steep_time_range_seconds?.[1]/60} min</span>
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

          {/* Traditional Use & Science */}
          <Card>
            <CardHeader>
              <CardTitle>Traditional Use & Research</CardTitle>
              <CardDescription>Historical context and scientific research</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {teas?.filter(tea => tea.traditional_uses || tea.research_links).map((tea) => (
                  <Card key={tea.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{tea.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {tea.traditional_uses && (
                        <div className="mb-4">
                          <h4 className="font-medium mb-2">Traditional Uses:</h4>
                          <div className="flex flex-wrap gap-1">
                            {tea.traditional_uses.map((use, idx) => (
                              <Badge key={idx} variant="outline">{use}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {tea.botanical_family && (
                        <p className="text-sm text-muted-foreground">
                          Botanical Family: {tea.botanical_family}
                        </p>
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
                          {item.best_for.map((use, idx) => (
                            <Badge key={idx} variant="secondary">
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
                              {item.pros.map((pro, idx) => (
                                <Badge key={idx} variant="secondary">
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
                              {item.cons.map((con, idx) => (
                                <Badge key={idx} variant="destructive">
                                  {con}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {item.care_instructions && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm font-medium mb-1">Care Instructions:</p>
                        <ul className="text-sm text-muted-foreground list-disc list-inside">
                          {item.care_instructions.map((instruction, idx) => (
                            <li key={idx}>{instruction}</li>
                          ))}
                        </ul>
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
