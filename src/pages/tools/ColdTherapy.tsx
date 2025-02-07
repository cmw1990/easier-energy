
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TopNav } from "@/components/layout/TopNav"
import { ToolAnalyticsWrapper } from "@/components/tools/ToolAnalyticsWrapper"

export default function ColdTherapy() {
  return (
    <ToolAnalyticsWrapper 
      toolName="cold-therapy-tools"
      toolType="biohacking"
      toolSettings={{}}
    >
      <div className="min-h-screen bg-background">
        <TopNav />
        <div className="container mx-auto p-4">
          <Card>
            <CardHeader>
              <CardTitle>Cold Therapy Tools</CardTitle>
              <CardDescription>
                Compare ice baths, cold plunge tubs, and cryotherapy options.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Content coming soon. This guide will include detailed information about cold exposure tools,
                methods, and tracking your cold therapy sessions.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolAnalyticsWrapper>
  )
}
