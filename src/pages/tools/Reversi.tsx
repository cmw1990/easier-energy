
import { TopNav } from "@/components/layout/TopNav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Reversi() {
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Reversi Game</CardTitle>
            <CardDescription>Coming soon!</CardDescription>
          </CardHeader>
          <CardContent>
            <p>This feature is currently under development.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
