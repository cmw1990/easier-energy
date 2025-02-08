
import { LifeSituation } from './energyPlans';

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
    }
  }
}
