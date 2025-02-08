
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, ExternalLink } from "lucide-react"

interface TeaVendor {
  name: string
  website: string
  rating: number
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
          vendor:tea_vendors(name, website, rating)
        `)
        .eq('tea_id', teaId)
        .order('price', { ascending: true })
        .returns<TeaVendorProduct[]>()
      
      if (error) throw error
      return data
    }
  })

  if (isLoading) {
    return <div>Loading prices...</div>
  }

  if (!prices?.length) {
    return <div>No vendor prices available</div>
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
                <div className="font-medium">{price.vendor.name}</div>
                <div className="text-sm text-muted-foreground">
                  Rating: {price.vendor.rating.toFixed(1)}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-lg font-bold">${price.price}</div>
                <Button variant="outline" size="sm" asChild>
                  <a href={price.url} target="_blank" rel="noopener noreferrer">
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
