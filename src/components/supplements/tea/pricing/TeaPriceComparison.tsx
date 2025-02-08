
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, ExternalLink, Store } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface TeaVendor {
  name: string
  website: string
  rating: number
  verification_status: string
}

interface TeaVendorProduct {
  id: string
  price: number
  url: string
  vendor: TeaVendor
}

interface TeaPriceComparisonProps {
  teaId: string
}

export function TeaPriceComparison({ teaId }: TeaPriceComparisonProps) {
  const { data: prices, isLoading } = useQuery({
    queryKey: ['tea-prices', teaId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tea_vendor_products')
        .select(`
          id,
          price,
          url,
          vendor:tea_vendors(name, website, rating, verification_status)
        `)
        .eq('tea_id', teaId)
        .order('price', { ascending: true })
        .returns<TeaVendorProduct[]>()
      
      if (error) throw error
      return data
    }
  })

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowUpDown className="h-5 w-5" />
            Price Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between border-b pb-2">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[150px]" />
                  <Skeleton className="h-3 w-[100px]" />
                </div>
                <div className="flex items-center gap-4">
                  <Skeleton className="h-6 w-[60px]" />
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!prices?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            Price Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            No vendor prices available yet
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowUpDown className="h-5 w-5" />
          Price Comparison
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {prices.map((price) => (
            <div key={price.id} className="flex items-center justify-between border-b pb-2">
              <div>
                <div className="font-medium flex items-center gap-2">
                  {price.vendor.name}
                  {price.vendor.verification_status === 'verified' && (
                    <span className="text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded">
                      Verified
                    </span>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  Rating: {price.vendor.rating.toFixed(1)}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-lg font-bold">${price.price.toFixed(2)}</div>
                <Button variant="outline" size="sm" asChild>
                  <a 
                    href={price.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1"
                  >
                    <span className="sr-only">Visit vendor</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
