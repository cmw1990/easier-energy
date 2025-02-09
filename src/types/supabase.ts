import { LifeSituation, PlanType } from './energyPlans';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type PatternSummary = {
  summary: string;
  confidence: number;
  last_updated: string;
}

export interface Database {
  public: {
    Tables: {
      user_life_situations: {
        Row: {
          id: string
          user_id: string 
          situation: LifeSituation
          started_at: string
          updated_at: string
          notes: string | null
        }
        Insert: {
          id?: string
          user_id: string
          situation: LifeSituation
          started_at?: string
          updated_at?: string
          notes?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          situation?: LifeSituation
          started_at?: string
          updated_at?: string
          notes?: string | null
        }
      }
      pregnancy_wellness_correlations: {
        Row: {
          id: string
          user_id: string
          date: string
          created_at: string
          updated_at: string
          energy_pattern: PatternSummary
          focus_pattern: PatternSummary
          sleep_pattern: PatternSummary
          activity_impact: Json | null
          nutrition_impact: Json | null
        }
        Insert: {
          id?: string
          user_id: string
          date?: string
          created_at?: string
          updated_at?: string
          energy_pattern?: PatternSummary
          focus_pattern?: PatternSummary
          sleep_pattern?: PatternSummary
          activity_impact?: Json | null
          nutrition_impact?: Json | null
        }
        Update: {
          user_id?: string
          date?: string
          updated_at?: string
          energy_pattern?: PatternSummary
          focus_pattern?: PatternSummary
          sleep_pattern?: PatternSummary
          activity_impact?: Json | null
          nutrition_impact?: Json | null
        }
      }
      pregnancy_logs: {
        Row: {
          id: string
          user_id: string
          date: string
          created_at: string
          energy_level: number | null
          focus_level: number | null
          stress_level: number | null
          mood_rating: number | null
          sleep_quality: number | null
          exercise_minutes: number | null
          water_intake_ml: number | null
          blood_pressure_systolic: number | null
          blood_pressure_diastolic: number | null
          weight_kg: number | null
          activity_type: string[] | null
          symptoms: string[] | null
          wellness_notes: string | null
        }
        Insert: {
          id?: string
          user_id: string
          date?: string
          created_at?: string
          energy_level?: number | null
          focus_level?: number | null
          stress_level?: number | null
          mood_rating?: number | null
          sleep_quality?: number | null
          exercise_minutes?: number | null
          water_intake_ml?: number | null
          blood_pressure_systolic?: number | null
          blood_pressure_diastolic?: number | null
          weight_kg?: number | null
          activity_type?: string[] | null
          symptoms?: string[] | null
          wellness_notes?: string | null
        }
        Update: {
          user_id?: string
          date?: string
          energy_level?: number | null
          focus_level?: number | null
          stress_level?: number | null
          mood_rating?: number | null
          sleep_quality?: number | null
          exercise_minutes?: number | null
          water_intake_ml?: number | null
          blood_pressure_systolic?: number | null
          blood_pressure_diastolic?: number | null
          weight_kg?: number | null
          activity_type?: string[] | null
          symptoms?: string[] | null
          wellness_notes?: string | null
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
          plan_type: PlanType
          category: 'charged' | 'recharged'
          visibility: 'private' | 'public' | 'shared'
          is_expert_plan: boolean
          tags: string[]
          likes_count: number
          saves_count: number
          energy_level_required?: number
          recommended_time_of_day?: string[]
          suitable_contexts?: string[]
          estimated_duration_minutes?: number
          celebrity_name?: string
          suitable_life_situations: LifeSituation[]
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          created_by: string
          title: string
          description?: string | null
          plan_type: PlanType
          category?: 'charged' | 'recharged'
          visibility?: 'private' | 'public' | 'shared'
          is_expert_plan?: boolean
          tags?: string[]
          likes_count?: number
          saves_count?: number
          energy_level_required?: number
          recommended_time_of_day?: string[]
          suitable_contexts?: string[]
          estimated_duration_minutes?: number
          celebrity_name?: string
          suitable_life_situations?: LifeSituation[]
        }
        Update: {
          created_by?: string
          title?: string
          description?: string | null
          plan_type?: PlanType
          category?: 'charged' | 'recharged'
          visibility?: 'private' | 'public' | 'shared'
          is_expert_plan?: boolean
          tags?: string[]
          likes_count?: number
          saves_count?: number
          energy_level_required?: number
          recommended_time_of_day?: string[]
          suitable_contexts?: string[]
          estimated_duration_minutes?: number
          celebrity_name?: string
          suitable_life_situations?: LifeSituation[]
        }
      }
      energy_plan_components: {
        Row: {
          id: string
          created_at: string
          plan_id: string
          component_type: string
          order_number: number
          duration_minutes: number | null
          settings: Json
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          plan_id: string
          component_type: string
          order_number: number
          duration_minutes?: number | null
          settings?: Json
          notes?: string | null
        }
        Update: {
          plan_id?: string
          component_type?: string
          order_number?: number
          duration_minutes?: number | null
          settings?: Json
          notes?: string | null
        }
      }
      energy_plan_progress: {
        Row: {
          id: string
          user_id: string
          plan_id: string
          component_id: string
          completed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan_id: string
          component_id: string
          completed_at?: string | null
          created_at?: string
        }
        Update: {
          user_id?: string
          plan_id?: string
          component_id?: string
          completed_at?: string | null
        }
      }
      profiles: {
        Row: {
          id: string
          updated_at: string | null
          created_at: string | null
          avatar_url: string | null
          full_name: string | null
        }
        Insert: {
          id: string
          updated_at?: string | null
          created_at?: string | null
          avatar_url?: string | null
          full_name?: string | null
        }
        Update: {
          id?: string
          updated_at?: string | null
          created_at?: string | null
          avatar_url?: string | null
          full_name?: string | null
        }
      }
      expert_profiles: {
        Row: {
          id: string
          created_at: string  
          updated_at: string
          credentials: string[]
          specialties: string[]
          verification_status: 'pending' | 'approved' | 'rejected'
          verified_at: string | null
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          credentials: string[]
          specialties: string[]
          verification_status?: 'pending' | 'approved' | 'rejected'
          verified_at?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          credentials?: string[]
          specialties?: string[]
          verification_status?: 'pending' | 'approved' | 'rejected'
          verified_at?: string | null
        }
      }
      user_saved_plans: {
        Row: {
          id: string
          user_id: string
          plan_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan_id: string
          created_at?: string
        }
        Update: {
          user_id?: string
          plan_id?: string
        }
      }
      pregnancy_milestones: {
        Row: {
          id: string
          user_id: string
          milestone_type: string
          custom_title: string | null
          description: string | null
          achieved_at: string
          created_at: string
          celebration_shared: boolean
          week_number: number | null
          media_url: string | null
          notes: string | null
          metadata: Json | null
        }
        Insert: {
          id?: string
          user_id: string
          milestone_type: string
          custom_title?: string | null
          description?: string | null
          achieved_at?: string
          created_at?: string
          celebration_shared?: boolean
          week_number?: number | null
          media_url?: string | null
          notes?: string | null
          metadata?: Json | null
        }
        Update: {
          id?: string
          user_id?: string
          milestone_type?: string
          custom_title?: string | null
          description?: string | null
          achieved_at?: string
          created_at?: string
          celebration_shared?: boolean
          week_number?: number | null
          media_url?: string | null
          notes?: string | null
          metadata?: Json | null
        }
      }
      activity_points: {
        Row: {
          id: string
          user_id: string
          activity_type: 'steps' | 'app_usage' | 'subscription_boost' | 'purchase'
          points: number
          source_details: Json | null
          earned_at: string
          expires_at: string | null
          boosted: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          activity_type: 'steps' | 'app_usage' | 'subscription_boost' | 'purchase'
          points: number
          source_details?: Json | null
          earned_at?: string
          expires_at?: string | null
          boosted?: boolean
          created_at?: string
        }
        Update: {
          user_id?: string
          activity_type?: 'steps' | 'app_usage' | 'subscription_boost' | 'purchase'
          points?: number
          source_details?: Json | null
          earned_at?: string
          expires_at?: string | null
          boosted?: boolean
        }
      }
      points_multipliers: {
        Row: {
          id: string
          subscription_tier: string
          multiplier: number
          created_at: string
        }
        Insert: {
          id?: string
          subscription_tier: string
          multiplier: number
          created_at?: string
        }
        Update: {
          subscription_tier?: string
          multiplier?: number
        }
      }
      reward_thresholds: {
        Row: {
          id: string
          vendor_id: string
          points_required: number
          discount_percentage: number
          max_discount_amount: number | null
          is_active: boolean
          valid_from: string
          valid_until: string | null
          terms_conditions: string | null
          created_at: string
        }
        Insert: {
          id?: string
          vendor_id: string
          points_required: number
          discount_percentage: number
          max_discount_amount?: number | null
          is_active?: boolean
          valid_from?: string
          valid_until?: string | null
          terms_conditions?: string | null
          created_at?: string
        }
        Update: {
          vendor_id?: string
          points_required?: number
          discount_percentage?: number
          max_discount_amount?: number | null
          is_active?: boolean
          valid_from?: string
          valid_until?: string | null
          terms_conditions?: string | null
        }
      }
      point_redemptions: {
        Row: {
          id: string
          user_id: string
          vendor_id: string
          points_used: number
          discount_amount: number
          order_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          vendor_id: string
          points_used: number
          discount_amount: number
          order_id?: string | null
          created_at?: string
        }
        Update: {
          user_id?: string
          vendor_id?: string
          points_used?: number
          discount_amount?: number
          order_id?: string | null
        }
      }
      delivery_tracking: {
        Row: DeliveryTracking;
        Insert: Omit<DeliveryTracking, 'id' | 'created_at'>;
        Update: Partial<Omit<DeliveryTracking, 'id' | 'created_at'>>;
      };
      vendor_messages: {
        Row: VendorMessage;
        Insert: Omit<VendorMessage, 'id' | 'created_at'>;
        Update: Partial<Omit<VendorMessage, 'id' | 'created_at'>>;
      };
      products: {
        Row: {
          id: string
          name: string
          description: string
          price: number
          stock: number | null
        }
        Insert: {
          id?: string
          name: string
          description?: string
          price: number
          stock?: number | null
        }
        Update: {
          id?: string
          name?: string
          description?: string
          price?: number
          stock?: number | null
        }
      }
    }
    Functions: {
      calculate_available_discount: {
        Args: {
          _user_id: string
          _vendor_id: string
        }
        Returns: {
          available_points: number
          max_discount_percentage: number
          max_discount_amount: number
        }[]
      }
    }
  }
}

export type UserLifeSituationRow = Database['public']['Tables']['user_life_situations']['Row']
export type PregnancyWellnessCorrelationsRow = Database['public']['Tables']['pregnancy_wellness_correlations']['Row']
export type PregnancyMilestoneRow = Database['public']['Tables']['pregnancy_milestones']['Row']

export type PregnancyMilestone = Database['public']['Tables']['pregnancy_milestones']['Row'] & {
  category?: string | null;
  photo_urls?: string[] | null;
}

export interface PregnancyMetric {
  id: string;
  user_id: string;
  date: string;
  value: number;
  notes?: string;
  category: string;
  metric_category: 'weight' | 'blood_pressure' | 'nutrition' | 'exercise' | 'sleep' | 'mood' | 'general';
  photo_url?: string;
  created_at: string;
}

export interface DisplayZone {
  id: string;
  zone_type: string;
  price_multiplier: number;
  created_at: string;
}

export interface DemographicData {
  id: string;
  impression_id: string;
  age_range: string;
  created_at: string;
}

export interface CampaignStat {
  id: string;
  campaign_id: string;
  date: string;
  impressions: number;
  clicks: number;
  conversion_count: number;
  spend: number;
  created_at: string;
}

export interface AdImpression {
  id: string;
  sponsored_product_id: string;
  impressed_at: string;
  clicked_at: string | null;
  cost: number;
  sponsored_products: {
    id: string;
    placement_type: string;
    budget: number;
    spent: number;
    tier: string;
  };
}

export interface DeliveryTracking {
  id: string;
  order_id: string;
  tracking_number: string | null;
  status: string;
  estimated_delivery: string | null;
  created_at: string;
}

export interface VendorMessage {
  id: string;
  vendor_id: string;
  user_id: string;
  message: string;
  is_from_vendor: boolean;
  created_at: string;
}

export interface CustomerEngagement {
  id: string;
  vendor_id: string;
  customer_id: string;
  interaction_type: string;
  interaction_data: Json;
  sentiment_score: number | null;
  created_at: string;
  updated_at: string;
}

export interface MarketplacePlatformMetric {
  id: string;
  vendor_id: string;
  platform_name: string;
  metrics_data: Json;
  sync_status: string;
  last_sync_at: string;
  created_at: string;
}

export interface EngagementAnalytic {
  id: string;
  vendor_id: string;
  date: string;
  engagement_metrics: Json;
  created_at: string;
}
