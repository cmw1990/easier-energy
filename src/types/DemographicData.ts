
export interface DemographicData {
  id: string;
  age_range: string;  // Match the database field name
  gender: string;
  location: string;
  count: number;
  created_at: string;
  impression_id?: string;
}

export interface CampaignStat {
  id: string;
  campaign_id: string;
  impressions: number;
  clicks: number;
  conversions: number;
  date: string;
  created_at: string;
  spend: number;
}

export interface AdImpression {
  id: string;
  ad_id: string;
  user_id: string;
  timestamp: string;
  location: string;
  sponsored_product_id?: string;
  impressed_at?: string;
  clicked_at?: string;
  cost?: number;
}
