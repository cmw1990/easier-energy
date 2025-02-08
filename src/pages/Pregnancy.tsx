
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Baby } from "lucide-react"

const PregnancyPage = () => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Baby className="h-5 w-5 text-pink-500" />
            Pregnancy & Baby Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Coming soon! We're setting up comprehensive pregnancy and baby tracking features.</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default PregnancyPage
