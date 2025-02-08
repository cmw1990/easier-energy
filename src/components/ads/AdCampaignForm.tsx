
import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

const campaignFormSchema = z.object({
  productId: z.string().uuid(),
  placementType: z.enum(['feed', 'banner', 'sidebar', 'openApp']),
  budget: z.string().transform((val) => Number(val)),
  cpc: z.string().transform((val) => Number(val)),
  durationDays: z.string().transform((val) => Number(val)),
})

export function AdCampaignForm() {
  const { toast } = useToast()
  const form = useForm<z.infer<typeof campaignFormSchema>>({
    resolver: zodResolver(campaignFormSchema),
    defaultValues: {
      placementType: 'feed',
      budget: '50',
      cpc: '0.10',
      durationDays: '7',
    },
  })

  async function onSubmit(values: z.infer<typeof campaignFormSchema>) {
    try {
      const endsAt = new Date(Date.now() + values.durationDays * 24 * 60 * 60 * 1000).toISOString()
      
      const { error } = await supabase.from('sponsored_products').insert({
        product_id: values.productId,
        placement_type: values.placementType,
        budget: values.budget,
        cpc: values.cpc,
        ends_at: endsAt,
      })

      if (error) throw error

      toast({
        title: "Campaign created",
        description: "Your ad campaign has been created successfully.",
      })
      
      form.reset()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create campaign. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Ad Campaign</CardTitle>
        <CardDescription>
          Set up a new advertising campaign for your products
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="productId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a product" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {/* Products will be populated here */}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="placementType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Placement Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="feed">Feed</SelectItem>
                      <SelectItem value="banner">Banner</SelectItem>
                      <SelectItem value="sidebar">Sidebar</SelectItem>
                      <SelectItem value="openApp">App Open</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose where your ad will appear
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="budget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Budget ($)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormDescription>
                    Set your total campaign budget
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cpc"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cost per Click ($)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormDescription>
                    How much you're willing to pay per click
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="durationDays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (Days)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>
                    How long should the campaign run
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Create Campaign</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
