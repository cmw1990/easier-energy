
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
    }
  }
}
