
import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TopNav } from "@/components/layout/TopNav"
import { ToolAnalyticsWrapper } from "@/components/tools/ToolAnalyticsWrapper"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TeaIntakeForm } from "@/components/supplements/tea/TeaIntakeForm"
import { TeaTracker } from "@/components/supplements/tea/TeaTracker"

export default function HerbalTeaGuide() {
  const { data: teas, isLoading } = useQuery({
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

  return (
    <ToolAnalyticsWrapper 
      toolName="herbal-tea-guide"
      toolType="biohacking"
      toolSettings={{}}
    >
      <div className="min-h-screen bg-background">
        <TopNav />
        <div className="container mx-auto p-4">
          <Tabs defaultValue="guide" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="guide">Guide</TabsTrigger>
              <TabsTrigger value="teas">Tea Library</TabsTrigger>
              <TabsTrigger value="tracking">Tracking</TabsTrigger>
            </TabsList>

            <TabsContent value="guide">
              <Card>
                <CardHeader>
                  <CardTitle>Herbal Tea Guide</CardTitle>
                  <CardDescription>
                    Comprehensive guide to herbal teas: benefits, brewing methods, and traditional uses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <section>
                      <h3 className="text-lg font-semibold mb-2">What are Herbal Teas?</h3>
                      <p className="text-muted-foreground">
                        Herbal teas, also known as tisanes, are beverages made from the infusion of herbs, spices, fruits, or other plant material in hot water. Unlike true teas, they don't contain tea leaves from the Camellia sinensis plant.
                      </p>
                    </section>

                    <section>
                      <h3 className="text-lg font-semibold mb-2">Brewing Methods</h3>
                      <div className="space-y-2 text-muted-foreground">
                        <p><strong>Hot Steep:</strong> Traditional method using hot water</p>
                        <p><strong>Cold Brew:</strong> Gentle extraction using cold water over time</p>
                        <p><strong>Western:</strong> Quick steep with boiling water</p>
                        <p><strong>Gongfu:</strong> Multiple short steeps with high leaf-to-water ratio</p>
                      </div>
                    </section>

                    <section>
                      <h3 className="text-lg font-semibold mb-2">General Benefits</h3>
                      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                        <li>Hydration</li>
                        <li>Rich in antioxidants</li>
                        <li>Caffeine-free alternatives</li>
                        <li>Support various wellness goals</li>
                        <li>Can be enjoyed hot or cold</li>
                      </ul>
                    </section>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="teas">
              <Card>
                <CardHeader>
                  <CardTitle>Tea Library</CardTitle>
                  <CardDescription>
                    Explore our collection of herbal teas and their properties
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div>Loading teas...</div>
                  ) : teas?.length === 0 ? (
                    <div>No teas found in the database.</div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {teas?.map((tea) => (
                        <Card key={tea.id} className="overflow-hidden">
                          <CardHeader>
                            <CardTitle className="text-lg">{tea.name}</CardTitle>
                            <Badge>{tea.category}</Badge>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">{tea.description}</p>
                            {tea.benefits && tea.benefits.length > 0 && (
                              <div className="mt-2">
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
                            <div className="mt-4 space-y-2 text-sm">
                              <p>Temperature: {tea.optimal_temp_celsius}°C</p>
                              <p>Steep Time: {tea.steep_time_range_seconds[0]}-{tea.steep_time_range_seconds[1]} seconds</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tracking">
              <div className="grid gap-6">
                <TeaIntakeForm />
                <TeaTracker />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ToolAnalyticsWrapper>
  )
}
