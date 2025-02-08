
import { useAuth } from "@/components/AuthProvider"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Leaf } from "lucide-react"
import { TeaLibraryCard } from "./TeaLibraryCard"
import { TeaHistoryCard } from "./TeaHistoryCard"

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
                <TeaHistoryCard 
                  key={log.id} 
                  log={log} 
                  getEffectivityBadgeColor={getEffectivityBadgeColor}
                />
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
                  <TeaLibraryCard key={tea.id} tea={tea} />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Traditional Use & Science */}
          <Card>
            <CardHeader>
              <CardTitle>Traditional Use & Science</CardTitle>
              <CardDescription>Historical context and scientific research</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {teas?.filter(tea => tea.traditional_uses).map((tea) => (
                  <TeaLibraryCard key={tea.id} tea={tea} />
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
