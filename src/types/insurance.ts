
export interface InsuranceProvider {
  id: string;
  name: string;
  payer_id: string;
  provider_network: string[];
  claims_api_endpoint?: string;
  eligibility_api_endpoint?: string;
  verification_method: 'manual' | 'api';
  supported_claim_types: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface InsuranceEligibilityCheck {
  id: string;
  client_insurance_id: string;
  professional_id: string;
  verification_date: string;
  status: 'pending' | 'verified' | 'failed';
  coverage_details?: Record<string, any>;
  copay_amount?: number;
  coinsurance_percentage?: number;
  deductible_remaining?: number;
  error_message?: string;
  created_at: string;
  updated_at: string;
}

export interface InsuranceClaimSubmission {
  id: string;
  claim_id: string;
  submission_date: string;
  status: 'pending' | 'submitted' | 'accepted' | 'rejected' | 'paid';
  payer_claim_id?: string;
  submission_method: 'electronic' | 'manual';
  response_details?: Record<string, any>;
  error_message?: string;
  created_at: string;
  updated_at: string;
}

export interface LoyaltyTier {
  name: string;
  points_required: number;
  benefits: string[];
}

export interface LoyaltyReward {
  name: string;
  points_cost: number;
  description: string;
}

export interface LoyaltyProgram {
  id: string;
  program_name: string;
  points_ratio: number;
  tiers: LoyaltyTier[];
  rewards: LoyaltyReward[];
  created_at: string;
  updated_at: string;
  vendor_id: string;
}

export interface MarketplaceMetrics {
  id: string;
  platform_name: string;
  metrics_data: {
    total_revenue: number;
    total_orders: number;
    conversion_rate: number;
  };
  sync_status: string;
  last_sync_at: string;
  created_at: string;
  vendor_id: string;
}

export interface ClientProgressTracking {
  id: string;
  client_id: string;
  session_id?: string;
  milestone_achievements?: string[];
  progress_notes?: string;
  treatment_goals?: string[];
  notes?: string;
  progress_rating?: number;
  homework?: string;
  next_steps?: string;
  created_at: string;
  updated_at: string;
}

export interface BehaviorPattern {
  active_users: number;
  engagement_rate: number;
  response_rate: number;
  peak_hours: number[];
  segments: Array<{
    name: string;
    value: number;
  }>;
}

export interface CustomerBehavior {
  id: string;
  vendor_id: string;
  behavior_patterns: BehaviorPattern;
  engagement_metrics?: Record<string, any>;
  purchase_predictions?: Record<string, any>;
  customer_segments: {
    new: number;
    returning: number;
    inactive: number;
  };
  revenue_trends: {
    daily: Array<{date: string; revenue: number}>;
    weekly: Array<{week: string; revenue: number}>;
    monthly: Array<{month: string; revenue: number}>;
  };
}
