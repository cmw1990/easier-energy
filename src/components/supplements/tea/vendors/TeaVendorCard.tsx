
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Globe, Star } from "lucide-react"

interface TeaVendorCardProps {
  vendor: {
    id: string
    name: string
    website: string
    description: string
    shipping_regions: string[]
    rating: number
    review_count: number
    verification_status: string
  }
}

export function TeaVendorCard({ vendor }: TeaVendorCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{vendor.name}</CardTitle>
            <CardDescription className="mt-1.5">
              {vendor.description}
            </CardDescription>
          </div>
          {vendor.verification_status === 'verified' && (
            <Badge variant="secondary">Verified Vendor</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-400" />
            <span>{vendor.rating.toFixed(1)} ({vendor.review_count} reviews)</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {vendor.shipping_regions.map((region) => (
              <Badge key={region} variant="outline">
                Ships to {region}
              </Badge>
            ))}
          </div>

          <Button variant="outline" className="w-full" asChild>
            <a href={vendor.website} target="_blank" rel="noopener noreferrer">
              <Globe className="mr-2 h-4 w-4" />
              Visit Website
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
