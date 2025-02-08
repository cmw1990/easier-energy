import { LifeSituation, PlanType } from './energyPlans';

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
          energy_pattern: Json | null
          focus_pattern: Json | null
          sleep_pattern: Json | null
          activity_impact: Json | null
          nutrition_impact: Json | null
        }
        Insert: {
          id?: string
          user_id: string
          date?: string
          created_at?: string
          updated_at?: string
          energy_pattern?: Json | null
          focus_pattern?: Json | null
          sleep_pattern?: Json | null
          activity_impact?: Json | null
          nutrition_impact?: Json | null
        }
        Update: {
          user_id?: string
          date?: string
          updated_at?: string
          energy_pattern?: Json | null
          focus_pattern?: Json | null
          sleep_pattern?: Json | null
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
    }
  }
}
