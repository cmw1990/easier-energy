
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Globe, MapPin, Star, Store } from "lucide-react"

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
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1.5">
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5 text-muted-foreground" />
              {vendor.name}
            </CardTitle>
            <CardDescription>{vendor.description}</CardDescription>
          </div>
          {vendor.verification_status === 'verified' && (
            <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">
              Verified Vendor
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-400" />
            <span className="font-medium">{vendor.rating.toFixed(1)}</span>
            <span className="text-sm text-muted-foreground">
              ({vendor.review_count} reviews)
            </span>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
              <div className="flex flex-wrap gap-1">
                {vendor.shipping_regions.map((region) => (
                  <Badge key={region} variant="outline">
                    Ships to {region}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <Button variant="outline" className="w-full" asChild>
            <a 
              href={vendor.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Globe className="h-4 w-4" />
              Visit Website
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
