// Database types for Supabase
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      brain_game_scores: {
        Row: {
          id: string
          user_id: string
          game_type: string
          score: number
          difficulty?: number
          duration_seconds?: number
          created_at: string
          metadata: Json
        }
        Insert: {
          id?: string
          user_id: string
          game_type: string
          score: number
          difficulty?: number
          duration_seconds?: number
          created_at?: string
          metadata?: Json
        }
        Update: {
          id?: string
          user_id?: string
          game_type?: string
          score?: number
          difficulty?: number
          duration_seconds?: number
          created_at?: string
          metadata?: Json
        }
      }
      user_settings: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          settings: Json
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          settings?: Json
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          settings?: Json
        }
      }
      user_roles: {
        Row: {
          id: string
          created_at: string
          user_id: string
          role: string
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          role: string
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          role?: string
        }
      }
      energy_plans: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          created_by: string
          title: string
          description: string | null
          plan_type: string
          category: 'charged' | 'recharged'
          visibility: 'public' | 'private' | 'shared'
          is_expert_plan: boolean
          energy_level_required: number
          estimated_duration_minutes: number
          likes_count: number
          saves_count: number
          recommended_time_of_day: string[]
          suitable_contexts: string[]
          tags: string[]
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          created_by: string
          title: string
          description?: string | null
          plan_type: string
          category: 'charged' | 'recharged'
          visibility: 'public' | 'private' | 'shared'
          is_expert_plan?: boolean
          energy_level_required?: number
          estimated_duration_minutes?: number
          likes_count?: number
          saves_count?: number
          recommended_time_of_day?: string[]
          suitable_contexts?: string[]
          tags?: string[]
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          created_by?: string
          title?: string
          description?: string | null
          plan_type?: string
          category?: 'charged' | 'recharged'
          visibility?: 'public' | 'private' | 'shared'
          is_expert_plan?: boolean
          energy_level_required?: number
          estimated_duration_minutes?: number
          likes_count?: number
          saves_count?: number
          recommended_time_of_day?: string[]
          suitable_contexts?: string[]
          tags?: string[]
        }
      }
      user_life_situations: {
        Row: {
          id: string
          user_id: string
          situation_type: string
          start_date: string
          end_date: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          situation_type: string
          start_date: string
          end_date?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          situation_type?: string
          start_date?: string
          end_date?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      insurance_claims: {
        Row: {
          id: string
          client_insurance_id: string
          professional_id: string
          session_id: string
          claim_number: string
          service_date: string
          submission_date: string
          status: string
          billed_amount: number
          diagnosis_codes: string[]
          procedure_codes: string[]
          notes: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_insurance_id: string
          professional_id: string
          session_id: string
          claim_number?: string
          service_date: string
          submission_date: string
          status: string
          billed_amount: number
          diagnosis_codes?: string[]
          procedure_codes?: string[]
          notes?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_insurance_id?: string
          professional_id?: string
          session_id?: string
          claim_number?: string
          service_date?: string
          submission_date?: string
          status?: string
          billed_amount?: number
          diagnosis_codes?: string[]
          procedure_codes?: string[]
          notes?: string
          created_at?: string
          updated_at?: string
        }
      }
      insurance_eligibility_checks: {
        Row: {
          id: string
          client_insurance_id: string
          coinsurance_percentage: number
          copay_amount: number
          coverage_details: Json
          created_at: string
          updated_at: string
          deductible_remaining: number
          error_message: string | null
          professional_id: string
          status: string
          verification_date: string
        }
        Insert: {
          id?: string
          client_insurance_id: string
          coinsurance_percentage?: number
          copay_amount?: number
          coverage_details?: Json
          created_at?: string
          updated_at?: string
          deductible_remaining?: number
          error_message?: string | null
          professional_id: string
          status?: string
          verification_date?: string
        }
        Update: {
          id?: string
          client_insurance_id?: string
          coinsurance_percentage?: number
          copay_amount?: number
          coverage_details?: Json
          created_at?: string
          updated_at?: string
          deductible_remaining?: number
          error_message?: string | null
          professional_id?: string
          status?: string
          verification_date?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type UserLifeSituationRow = Database['public']['Tables']['user_life_situations']['Row']
export type PregnancyWellnessCorrelationsRow = {
  id: string
  user_id: string
  date: string
  wellness_score: number
  correlation_factors: Json
  energy_pattern: {
    summary: string;
    confidence: number;
    last_updated: string;
  };
  focus_pattern: {
    summary: string;
    confidence: number;
    last_updated: string;
  };
  activity_impact: {
    score: number;
    factors: string[];
    recommendations: string[];
  };
  nutrition_impact: {
    score: number;
    factors: string[];
    recommendations: string[];
  };
  sleep_pattern: {
    quality: number;
    duration: number;
    disruptions: string[];
  };
  created_at: string;
  updated_at: string;
}
export type MoodJournalEntry = {
  id: string
  user_id: string
  mood: string
  intensity: number
  notes: string
  created_at: string
}
export type CopingStrategy = {
  id: string
  name: string
  description: string
  category: string
  effectiveness_rating: number
}
export type MoodTrigger = {
  id: string
  trigger: string
  impact_level: number
  frequency: number
  notes: string
}
export type PregnancyMilestone = {
  id: string;
  user_id: string;
  milestone_type: string;
  custom_title: string;
  description: string;
  achieved_at: string;
  week_number: number;
  category: string;
  photo_urls?: string[];
  media_url?: string;
  metadata?: Json;
  celebration_shared: boolean;
  created_at: string;
  updated_at: string;
}

export type DemographicData = {
  id: string
  age_group: string
  gender: string
  location: string
  count: number
}

export type CampaignStat = {
  id: string
  campaign_id: string
  impressions: number
  clicks: number
  conversions: number
  date: string
}

export type AdImpression = {
  id: string
  ad_id: string
  user_id: string
  timestamp: string
  location: string
}

export type DisplayZone = {
  id: string
  name: string
  location: string
  size: string
  price_per_day: number
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]
