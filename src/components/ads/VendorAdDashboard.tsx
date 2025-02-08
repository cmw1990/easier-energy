
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdCampaignForm } from './AdCampaignForm'
import { CouponManager } from './CouponManager'
import { SampleManager } from './SampleManager'
import { AdAnalytics } from './analytics/AdAnalytics'
import { AdGuide } from './AdGuide'
import { RewardThresholdsManager } from './RewardThresholdsManager'

export function VendorAdDashboard() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Advertising Dashboard</CardTitle>
          <CardDescription>
            Manage your advertising campaigns, coupons, free samples, and rewards
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="guide">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="guide">Guide</TabsTrigger>
              <TabsTrigger value="campaigns">Ad Campaigns</TabsTrigger>
              <TabsTrigger value="coupons">Coupons</TabsTrigger>
              <TabsTrigger value="samples">Free Samples</TabsTrigger>
              <TabsTrigger value="rewards">Rewards</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            <TabsContent value="guide">
              <AdGuide />
            </TabsContent>
            <TabsContent value="campaigns">
              <AdCampaignForm />
            </TabsContent>
            <TabsContent value="coupons">
              <CouponManager />
            </TabsContent>
            <TabsContent value="samples">
              <SampleManager />
            </TabsContent>
            <TabsContent value="rewards">
              <RewardThresholdsManager />
            </TabsContent>
            <TabsContent value="analytics">
              <AdAnalytics />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
