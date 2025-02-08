
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { TeaVendorCard } from "./TeaVendorCard"

interface TeaVendor {
  id: string
  name: string
  website: string
  description: string
  shipping_regions: string[]
  rating: number
  review_count: number
  verification_status: string
}

export function TeaVendorList() {
  const { data: vendors, isLoading } = useQuery({
    queryKey: ['tea-vendors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tea_vendors')
        .select('*')
        .order('rating', { ascending: false })
        .returns<TeaVendor[]>()
      
      if (error) throw error
      return data
    }
  })

  if (isLoading) {
    return <div>Loading vendors...</div>
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {vendors?.map((vendor) => (
        <TeaVendorCard key={vendor.id} vendor={vendor} />
      ))}
    </div>
  )
}
