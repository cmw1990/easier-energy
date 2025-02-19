
export interface InsuranceClaim {
  id: string;
  client_insurance_id: string;
  professional_id: string;
  session_id: string;
  claim_number: string;
  service_date: string;
  submission_date: string;
  status: string;
  billed_amount: number;
  diagnosis_codes: string[];
  procedure_codes: string[];
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface LoyaltyProgram {
  id: string;
  name: string;
  description: string;
  active: boolean;
}

export interface LoyaltyTier {
  id: string;
  program_id: string;
  name: string;
  minimum_points: number;
  benefits: string[];
}

export interface LoyaltyReward {
  id: string;
  tier_id: string;
  name: string;
  description: string;
  points_required: number;
}

export interface MarketplaceMetrics {
  id: string;
  total_sales: number;
  active_vendors: number;
  customer_satisfaction: number;
}
