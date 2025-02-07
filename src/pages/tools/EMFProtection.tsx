
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TopNav } from "@/components/layout/TopNav"
import { ToolAnalyticsWrapper } from "@/components/tools/ToolAnalyticsWrapper"

export default function EMFProtection() {
  return (
    <ToolAnalyticsWrapper 
      toolName="emf-protection"
      toolType="biohacking"
      toolSettings={{}}
    >
      <div className="min-h-screen bg-background">
        <TopNav />
        <div className="container mx-auto p-4">
          <Card>
            <CardHeader>
              <CardTitle>EMF Protection</CardTitle>
              <CardDescription>
                Compare different EMF protection devices and measurement tools.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Content coming soon. This guide will include detailed information about EMF protection methods,
                device comparisons, and measuring EMF exposure.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolAnalyticsWrapper>
  )
}
