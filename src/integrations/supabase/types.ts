export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      achievements: {
        Row: {
          created_at: string | null
          description: string
          icon: string
          id: string
          points: number
          title: string
          type: string
          unlocked_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          icon: string
          id?: string
          points?: number
          title: string
          type: string
          unlocked_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          icon?: string
          id?: string
          points?: number
          title?: string
          type?: string
          unlocked_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      board_games: {
        Row: {
          board_size: number | null
          completed_at: string | null
          created_at: string | null
          difficulty_level: number
          game_state: Json
          game_type: Database["public"]["Enums"]["game_type"]
          id: string
          last_move_at: string | null
          moves: Json[] | null
          score: number | null
          started_at: string | null
          status: string
          updated_at: string | null
          user_id: string | null
          variant: string | null
          winner: string | null
        }
        Insert: {
          board_size?: number | null
          completed_at?: string | null
          created_at?: string | null
          difficulty_level?: number
          game_state?: Json
          game_type: Database["public"]["Enums"]["game_type"]
          id?: string
          last_move_at?: string | null
          moves?: Json[] | null
          score?: number | null
          started_at?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string | null
          variant?: string | null
          winner?: string | null
        }
        Update: {
          board_size?: number | null
          completed_at?: string | null
          created_at?: string | null
          difficulty_level?: number
          game_state?: Json
          game_type?: Database["public"]["Enums"]["game_type"]
          id?: string
          last_move_at?: string | null
          moves?: Json[] | null
          score?: number | null
          started_at?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string | null
          variant?: string | null
          winner?: string | null
        }
        Relationships: []
      }
      coupons: {
        Row: {
          active: boolean | null
          code: string
          created_at: string | null
          description: string | null
          discount_amount: number | null
          discount_percentage: number | null
          expires_at: string | null
          id: string
          product_id: string | null
          vendor_id: string | null
        }
        Insert: {
          active?: boolean | null
          code: string
          created_at?: string | null
          description?: string | null
          discount_amount?: number | null
          discount_percentage?: number | null
          expires_at?: string | null
          id?: string
          product_id?: string | null
          vendor_id?: string | null
        }
        Update: {
          active?: boolean | null
          code?: string
          created_at?: string | null
          description?: string | null
          discount_amount?: number | null
          discount_percentage?: number | null
          expires_at?: string | null
          id?: string
          product_id?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coupons_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupons_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      craving_logs: {
        Row: {
          activity: string | null
          coping_strategy_used: string | null
          created_at: string | null
          emotional_state: string | null
          id: string
          intensity: number | null
          location: string | null
          notes: string | null
          success_rating: number | null
          trigger_type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          activity?: string | null
          coping_strategy_used?: string | null
          created_at?: string | null
          emotional_state?: string | null
          id?: string
          intensity?: number | null
          location?: string | null
          notes?: string | null
          success_rating?: number | null
          trigger_type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          activity?: string | null
          coping_strategy_used?: string | null
          created_at?: string | null
          emotional_state?: string | null
          id?: string
          intensity?: number | null
          location?: string | null
          notes?: string | null
          success_rating?: number | null
          trigger_type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      distraction_block_logs: {
        Row: {
          attempt_count: number | null
          block_id: string | null
          block_type: Database["public"]["Enums"]["distraction_type"]
          blocked_at: string | null
          id: string
          target: string
          user_id: string
        }
        Insert: {
          attempt_count?: number | null
          block_id?: string | null
          block_type: Database["public"]["Enums"]["distraction_type"]
          blocked_at?: string | null
          id?: string
          target: string
          user_id: string
        }
        Update: {
          attempt_count?: number | null
          block_id?: string | null
          block_type?: Database["public"]["Enums"]["distraction_type"]
          blocked_at?: string | null
          id?: string
          target?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "distraction_block_logs_block_id_fkey"
            columns: ["block_id"]
            isOneToOne: false
            referencedRelation: "distraction_blocking"
            referencedColumns: ["id"]
          },
        ]
      }
      distraction_blocking: {
        Row: {
          block_type: Database["public"]["Enums"]["distraction_type"]
          break_duration: number | null
          created_at: string | null
          days_active: string[] | null
          id: string
          is_active: boolean | null
          last_break_at: string | null
          pattern_data: Json | null
          priority: number | null
          productivity_score: number | null
          schedule_end: string | null
          schedule_start: string | null
          schedule_type: string | null
          target: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          block_type: Database["public"]["Enums"]["distraction_type"]
          break_duration?: number | null
          created_at?: string | null
          days_active?: string[] | null
          id?: string
          is_active?: boolean | null
          last_break_at?: string | null
          pattern_data?: Json | null
          priority?: number | null
          productivity_score?: number | null
          schedule_end?: string | null
          schedule_start?: string | null
          schedule_type?: string | null
          target: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          block_type?: Database["public"]["Enums"]["distraction_type"]
          break_duration?: number | null
          created_at?: string | null
          days_active?: string[] | null
          id?: string
          is_active?: boolean | null
          last_break_at?: string | null
          pattern_data?: Json | null
          priority?: number | null
          productivity_score?: number | null
          schedule_end?: string | null
          schedule_start?: string | null
          schedule_type?: string | null
          target?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      energy_focus_logs: {
        Row: {
          activity_name: string
          activity_type: string
          created_at: string | null
          duration_minutes: number | null
          energy_rating: number | null
          focus_rating: number | null
          id: string
          notes: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          activity_name: string
          activity_type: string
          created_at?: string | null
          duration_minutes?: number | null
          energy_rating?: number | null
          focus_rating?: number | null
          id?: string
          notes?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          activity_name?: string
          activity_type?: string
          created_at?: string | null
          duration_minutes?: number | null
          energy_rating?: number | null
          focus_rating?: number | null
          id?: string
          notes?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      exercise_assets: {
        Row: {
          asset_url: string
          created_at: string | null
          exercise_name: string
          exercise_type: string
          id: string
        }
        Insert: {
          asset_url: string
          created_at?: string | null
          exercise_name: string
          exercise_type: string
          id?: string
        }
        Update: {
          asset_url?: string
          created_at?: string | null
          exercise_name?: string
          exercise_type?: string
          id?: string
        }
        Relationships: []
      }
      exercise_tracking: {
        Row: {
          average_speed: number | null
          calories_burned: number | null
          created_at: string | null
          distance_meters: number | null
          duration_seconds: number | null
          elevation_data: Json | null
          end_time: string | null
          exercise_type: Database["public"]["Enums"]["exercise_type"]
          heart_rate_data: Json | null
          id: string
          notes: string | null
          route_coordinates: Json | null
          start_time: string | null
          updated_at: string | null
          user_id: string | null
          weather_conditions: Json | null
        }
        Insert: {
          average_speed?: number | null
          calories_burned?: number | null
          created_at?: string | null
          distance_meters?: number | null
          duration_seconds?: number | null
          elevation_data?: Json | null
          end_time?: string | null
          exercise_type: Database["public"]["Enums"]["exercise_type"]
          heart_rate_data?: Json | null
          id?: string
          notes?: string | null
          route_coordinates?: Json | null
          start_time?: string | null
          updated_at?: string | null
          user_id?: string | null
          weather_conditions?: Json | null
        }
        Update: {
          average_speed?: number | null
          calories_burned?: number | null
          created_at?: string | null
          distance_meters?: number | null
          duration_seconds?: number | null
          elevation_data?: Json | null
          end_time?: string | null
          exercise_type?: Database["public"]["Enums"]["exercise_type"]
          heart_rate_data?: Json | null
          id?: string
          notes?: string | null
          route_coordinates?: Json | null
          start_time?: string | null
          updated_at?: string | null
          user_id?: string | null
          weather_conditions?: Json | null
        }
        Relationships: []
      }
      favorite_foods: {
        Row: {
          calories: number | null
          carbs_grams: number | null
          created_at: string | null
          fat_grams: number | null
          food_name: string
          id: string
          protein_grams: number | null
          user_id: string
        }
        Insert: {
          calories?: number | null
          carbs_grams?: number | null
          created_at?: string | null
          fat_grams?: number | null
          food_name: string
          id?: string
          protein_grams?: number | null
          user_id: string
        }
        Update: {
          calories?: number | null
          carbs_grams?: number | null
          created_at?: string | null
          fat_grams?: number | null
          food_name?: string
          id?: string
          protein_grams?: number | null
          user_id?: string
        }
        Relationships: []
      }
      financial_tracking: {
        Row: {
          amount: number
          created_at: string | null
          date: string
          expense_type: string
          id: string
          notes: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          date: string
          expense_type: string
          id?: string
          notes?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          date?: string
          expense_type?: string
          id?: string
          notes?: string | null
          user_id?: string
        }
        Relationships: []
      }
      food_logs: {
        Row: {
          ai_analysis: string | null
          calories: number | null
          carbs_grams: number | null
          created_at: string | null
          fat_grams: number | null
          food_name: string
          id: string
          image_url: string | null
          meal_time: string | null
          meal_type: string | null
          notes: string | null
          protein_grams: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          ai_analysis?: string | null
          calories?: number | null
          carbs_grams?: number | null
          created_at?: string | null
          fat_grams?: number | null
          food_name: string
          id?: string
          image_url?: string | null
          meal_time?: string | null
          meal_type?: string | null
          notes?: string | null
          protein_grams?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          ai_analysis?: string | null
          calories?: number | null
          carbs_grams?: number | null
          created_at?: string | null
          fat_grams?: number | null
          food_name?: string
          id?: string
          image_url?: string | null
          meal_time?: string | null
          meal_type?: string | null
          notes?: string | null
          protein_grams?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      free_samples: {
        Row: {
          active: boolean | null
          created_at: string | null
          description: string | null
          expires_at: string | null
          id: string
          product_id: string | null
          quantity: number
          vendor_id: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          product_id?: string | null
          quantity: number
          vendor_id?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          product_id?: string | null
          quantity?: number
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "free_samples_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "free_samples_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      goals: {
        Row: {
          achieved_date: string | null
          created_at: string | null
          description: string | null
          goal_type: string
          id: string
          progress: number | null
          reward: string | null
          target_date: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          achieved_date?: string | null
          created_at?: string | null
          description?: string | null
          goal_type: string
          id?: string
          progress?: number | null
          reward?: string | null
          target_date?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          achieved_date?: string | null
          created_at?: string | null
          description?: string | null
          goal_type?: string
          id?: string
          progress?: number | null
          reward?: string | null
          target_date?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      health_data: {
        Row: {
          calories_burned: number | null
          created_at: string | null
          distance_meters: number | null
          id: string
          source: string
          steps_count: number
          sync_date: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          calories_burned?: number | null
          created_at?: string | null
          distance_meters?: number | null
          id?: string
          source: string
          steps_count?: number
          sync_date?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          calories_burned?: number | null
          created_at?: string | null
          distance_meters?: number | null
          id?: string
          source?: string
          steps_count?: number
          sync_date?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      hunts: {
        Row: {
          created_at: string | null
          id: string
          product_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hunts_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      journal_entries: {
        Row: {
          content: string
          created_at: string | null
          entry_type: string
          id: string
          mood_rating: number | null
          tags: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          entry_type: string
          id?: string
          mood_rating?: number | null
          tags?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          entry_type?: string
          id?: string
          mood_rating?: number | null
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      medication_logs: {
        Row: {
          created_at: string | null
          dosage: string
          effectiveness_rating: number | null
          id: string
          medication_name: string
          notes: string | null
          side_effects: string | null
          time_taken: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          dosage: string
          effectiveness_rating?: number | null
          id?: string
          medication_name: string
          notes?: string | null
          side_effects?: string | null
          time_taken: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          dosage?: string
          effectiveness_rating?: number | null
          id?: string
          medication_name?: string
          notes?: string | null
          side_effects?: string | null
          time_taken?: string
          user_id?: string
        }
        Relationships: []
      }
      meditation_progress: {
        Row: {
          completed_duration: number
          created_at: string | null
          id: string
          mood_after: number | null
          mood_before: number | null
          notes: string | null
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          completed_duration: number
          created_at?: string | null
          id?: string
          mood_after?: number | null
          mood_before?: number | null
          notes?: string | null
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          completed_duration?: number
          created_at?: string | null
          id?: string
          mood_after?: number | null
          mood_before?: number | null
          notes?: string | null
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "meditation_progress_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "meditation_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      meditation_sessions: {
        Row: {
          audio_url: string | null
          background_image_url: string | null
          created_at: string | null
          description: string | null
          difficulty_level: string
          duration_minutes: number
          id: string
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          audio_url?: string | null
          background_image_url?: string | null
          created_at?: string | null
          description?: string | null
          difficulty_level: string
          duration_minutes: number
          id?: string
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          audio_url?: string | null
          background_image_url?: string | null
          created_at?: string | null
          description?: string | null
          difficulty_level?: string
          duration_minutes?: number
          id?: string
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      mood_logs: {
        Row: {
          activities: string[] | null
          ai_analysis: string | null
          ai_recommendations: string | null
          cognitive_state: string[] | null
          coping_strategies: string[] | null
          created_at: string | null
          emotional_state: string[] | null
          energy_level: number | null
          environmental_factors: string[] | null
          exercise_minutes: number | null
          focus_level: number | null
          id: string
          meditation_minutes: number | null
          migraine_intensity: number | null
          mood_score: number | null
          notes: string | null
          outdoor_time_minutes: number | null
          physical_symptoms: string[] | null
          screen_time_minutes: number | null
          sleep_quality: number | null
          social_interactions: string[] | null
          stress_level: number | null
          thought_patterns: string[] | null
          updated_at: string | null
          user_id: string | null
          weather_data: Json | null
          weather_impact_score: number | null
        }
        Insert: {
          activities?: string[] | null
          ai_analysis?: string | null
          ai_recommendations?: string | null
          cognitive_state?: string[] | null
          coping_strategies?: string[] | null
          created_at?: string | null
          emotional_state?: string[] | null
          energy_level?: number | null
          environmental_factors?: string[] | null
          exercise_minutes?: number | null
          focus_level?: number | null
          id?: string
          meditation_minutes?: number | null
          migraine_intensity?: number | null
          mood_score?: number | null
          notes?: string | null
          outdoor_time_minutes?: number | null
          physical_symptoms?: string[] | null
          screen_time_minutes?: number | null
          sleep_quality?: number | null
          social_interactions?: string[] | null
          stress_level?: number | null
          thought_patterns?: string[] | null
          updated_at?: string | null
          user_id?: string | null
          weather_data?: Json | null
          weather_impact_score?: number | null
        }
        Update: {
          activities?: string[] | null
          ai_analysis?: string | null
          ai_recommendations?: string | null
          cognitive_state?: string[] | null
          coping_strategies?: string[] | null
          created_at?: string | null
          emotional_state?: string[] | null
          energy_level?: number | null
          environmental_factors?: string[] | null
          exercise_minutes?: number | null
          focus_level?: number | null
          id?: string
          meditation_minutes?: number | null
          migraine_intensity?: number | null
          mood_score?: number | null
          notes?: string | null
          outdoor_time_minutes?: number | null
          physical_symptoms?: string[] | null
          screen_time_minutes?: number | null
          sleep_quality?: number | null
          social_interactions?: string[] | null
          stress_level?: number | null
          thought_patterns?: string[] | null
          updated_at?: string | null
          user_id?: string | null
          weather_data?: Json | null
          weather_impact_score?: number | null
        }
        Relationships: []
      }
      notification_preferences: {
        Row: {
          created_at: string | null
          id: string
          preferences: Json
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          preferences?: Json
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          preferences?: Json
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      nrt_guide_steps: {
        Row: {
          created_at: string | null
          description: string
          id: string
          order_number: number
          product_type: string[] | null
          recommended_duration_days: number | null
          title: string
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          order_number: number
          product_type?: string[] | null
          recommended_duration_days?: number | null
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          order_number?: number
          product_type?: string[] | null
          recommended_duration_days?: number | null
          title?: string
        }
        Relationships: []
      }
      product_availability: {
        Row: {
          commission_rate: number | null
          created_at: string | null
          id: string
          in_stock: boolean | null
          price: number
          product_id: string | null
          updated_at: string | null
          vendor_id: string | null
        }
        Insert: {
          commission_rate?: number | null
          created_at?: string | null
          id?: string
          in_stock?: boolean | null
          price: number
          product_id?: string | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Update: {
          commission_rate?: number | null
          created_at?: string | null
          id?: string
          in_stock?: boolean | null
          price?: number
          product_id?: string | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_availability_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_availability_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      productivity_metrics: {
        Row: {
          created_at: string | null
          date: string
          distractions_blocked: number | null
          focus_duration: number | null
          focus_sessions: number | null
          id: string
          productivity_score: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date?: string
          distractions_blocked?: number | null
          focus_duration?: number | null
          focus_sessions?: number | null
          id?: string
          productivity_score?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          date?: string
          distractions_blocked?: number | null
          focus_duration?: number | null
          focus_sessions?: number | null
          id?: string
          productivity_score?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          brand: string
          chemicals: string[] | null
          created_at: string | null
          description: string | null
          flavor: string
          id: string
          image_url: string | null
          is_nrt_certified: boolean
          name: string
          product_type: string
          risk_level: Database["public"]["Enums"]["risk_level"]
          strength: Database["public"]["Enums"]["strength_level"]
          updated_at: string | null
        }
        Insert: {
          brand?: string
          chemicals?: string[] | null
          created_at?: string | null
          description?: string | null
          flavor: string
          id?: string
          image_url?: string | null
          is_nrt_certified?: boolean
          name: string
          product_type?: string
          risk_level: Database["public"]["Enums"]["risk_level"]
          strength: Database["public"]["Enums"]["strength_level"]
          updated_at?: string | null
        }
        Update: {
          brand?: string
          chemicals?: string[] | null
          created_at?: string | null
          description?: string | null
          flavor?: string
          id?: string
          image_url?: string | null
          is_nrt_certified?: boolean
          name?: string
          product_type?: string
          risk_level?: Database["public"]["Enums"]["risk_level"]
          strength?: Database["public"]["Enums"]["strength_level"]
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          id: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      quit_attempts: {
        Row: {
          challenges_faced: string[] | null
          coping_strategies: string[] | null
          created_at: string | null
          end_date: string | null
          id: string
          notes: string | null
          start_date: string
          substance_type: Database["public"]["Enums"]["substance_type"]
          success_rating: number | null
          support_received: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          challenges_faced?: string[] | null
          coping_strategies?: string[] | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          notes?: string | null
          start_date?: string
          substance_type: Database["public"]["Enums"]["substance_type"]
          success_rating?: number | null
          support_received?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          challenges_faced?: string[] | null
          coping_strategies?: string[] | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          notes?: string | null
          start_date?: string
          substance_type?: Database["public"]["Enums"]["substance_type"]
          success_rating?: number | null
          support_received?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      quit_plans: {
        Row: {
          alternative_product_id: string | null
          created_at: string | null
          current_daily_usage: number | null
          daily_routines: Json | null
          id: string
          initial_daily_usage: number
          is_shift_worker: boolean | null
          product_type: string
          replacement_activities: string[] | null
          shift_pattern: string | null
          start_date: string | null
          strategy_type: Database["public"]["Enums"]["quit_strategy_type"]
          support_resources: string[] | null
          target_daily_usage: number | null
          target_date: string | null
          trigger_management_strategies: string[] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          alternative_product_id?: string | null
          created_at?: string | null
          current_daily_usage?: number | null
          daily_routines?: Json | null
          id?: string
          initial_daily_usage: number
          is_shift_worker?: boolean | null
          product_type: string
          replacement_activities?: string[] | null
          shift_pattern?: string | null
          start_date?: string | null
          strategy_type: Database["public"]["Enums"]["quit_strategy_type"]
          support_resources?: string[] | null
          target_daily_usage?: number | null
          target_date?: string | null
          trigger_management_strategies?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          alternative_product_id?: string | null
          created_at?: string | null
          current_daily_usage?: number | null
          daily_routines?: Json | null
          id?: string
          initial_daily_usage?: number
          is_shift_worker?: boolean | null
          product_type?: string
          replacement_activities?: string[] | null
          shift_pattern?: string | null
          start_date?: string | null
          strategy_type?: Database["public"]["Enums"]["quit_strategy_type"]
          support_resources?: string[] | null
          target_daily_usage?: number | null
          target_date?: string | null
          trigger_management_strategies?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quit_plans_alternative_product_id_fkey"
            columns: ["alternative_product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      recovery_milestones: {
        Row: {
          achieved_at: string
          celebration_notes: string | null
          created_at: string | null
          days_sober: number | null
          health_improvements: string[] | null
          id: string
          lifestyle_changes: string[] | null
          mental_improvements: string[] | null
          milestone_type: string
          money_saved: number | null
          physical_improvements: string[] | null
          substance_type: Database["public"]["Enums"]["substance_type"]
          user_id: string
        }
        Insert: {
          achieved_at?: string
          celebration_notes?: string | null
          created_at?: string | null
          days_sober?: number | null
          health_improvements?: string[] | null
          id?: string
          lifestyle_changes?: string[] | null
          mental_improvements?: string[] | null
          milestone_type: string
          money_saved?: number | null
          physical_improvements?: string[] | null
          substance_type: Database["public"]["Enums"]["substance_type"]
          user_id: string
        }
        Update: {
          achieved_at?: string
          celebration_notes?: string | null
          created_at?: string | null
          days_sober?: number | null
          health_improvements?: string[] | null
          id?: string
          lifestyle_changes?: string[] | null
          mental_improvements?: string[] | null
          milestone_type?: string
          money_saved?: number | null
          physical_improvements?: string[] | null
          substance_type?: Database["public"]["Enums"]["substance_type"]
          user_id?: string
        }
        Relationships: []
      }
      replacement_activities: {
        Row: {
          activity_name: string
          category: string
          cost: number | null
          created_at: string | null
          duration_minutes: number | null
          effectiveness_rating: number | null
          id: string
          mood_impact: number | null
          notes: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          activity_name: string
          category: string
          cost?: number | null
          created_at?: string | null
          duration_minutes?: number | null
          effectiveness_rating?: number | null
          id?: string
          mood_impact?: number | null
          notes?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          activity_name?: string
          category?: string
          cost?: number | null
          created_at?: string | null
          duration_minutes?: number | null
          effectiveness_rating?: number | null
          id?: string
          mood_impact?: number | null
          notes?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          appearance_rating: number | null
          comfort_rating: number | null
          comment: string | null
          created_at: string | null
          flavor_rating: number | null
          id: string
          mouthfeel_rating: number | null
          overall_rating: number | null
          product_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          appearance_rating?: number | null
          comfort_rating?: number | null
          comment?: string | null
          created_at?: string | null
          flavor_rating?: number | null
          id?: string
          mouthfeel_rating?: number | null
          overall_rating?: number | null
          product_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          appearance_rating?: number | null
          comfort_rating?: number | null
          comment?: string | null
          created_at?: string | null
          flavor_rating?: number | null
          id?: string
          mouthfeel_rating?: number | null
          overall_rating?: number | null
          product_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      session_participants: {
        Row: {
          id: string
          joined_at: string | null
          session_id: string
          status: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string | null
          session_id: string
          status: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string | null
          session_id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_participants_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "support_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      shoutouts: {
        Row: {
          created_at: string | null
          id: string
          message: string | null
          product_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message?: string | null
          product_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string | null
          product_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shoutouts_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      smoking_logs: {
        Row: {
          created_at: string | null
          id: string
          log_type: Database["public"]["Enums"]["smoking_log_type"]
          notes: string | null
          quantity: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          log_type: Database["public"]["Enums"]["smoking_log_type"]
          notes?: string | null
          quantity?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          log_type?: Database["public"]["Enums"]["smoking_log_type"]
          notes?: string | null
          quantity?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      substance_logs: {
        Row: {
          cost: number | null
          craving_intensity: number | null
          created_at: string | null
          environmental_factors: string[] | null
          id: string
          location: string | null
          mood_after: number | null
          mood_before: number | null
          notes: string | null
          physical_symptoms: string[] | null
          quantity: number
          social_context: string | null
          substance_type: Database["public"]["Enums"]["substance_type"]
          success_in_refusing: boolean | null
          trigger_factors: string[] | null
          unit_of_measure: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cost?: number | null
          craving_intensity?: number | null
          created_at?: string | null
          environmental_factors?: string[] | null
          id?: string
          location?: string | null
          mood_after?: number | null
          mood_before?: number | null
          notes?: string | null
          physical_symptoms?: string[] | null
          quantity: number
          social_context?: string | null
          substance_type: Database["public"]["Enums"]["substance_type"]
          success_in_refusing?: boolean | null
          trigger_factors?: string[] | null
          unit_of_measure: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cost?: number | null
          craving_intensity?: number | null
          created_at?: string | null
          environmental_factors?: string[] | null
          id?: string
          location?: string | null
          mood_after?: number | null
          mood_before?: number | null
          notes?: string | null
          physical_symptoms?: string[] | null
          quantity?: number
          social_context?: string | null
          substance_type?: Database["public"]["Enums"]["substance_type"]
          success_in_refusing?: boolean | null
          trigger_factors?: string[] | null
          unit_of_measure?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      supplement_logs: {
        Row: {
          created_at: string | null
          dosage: string
          effectiveness_rating: number | null
          id: string
          notes: string | null
          side_effects: string | null
          supplement_name: string
          time_taken: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          dosage: string
          effectiveness_rating?: number | null
          id?: string
          notes?: string | null
          side_effects?: string | null
          supplement_name: string
          time_taken: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          dosage?: string
          effectiveness_rating?: number | null
          id?: string
          notes?: string | null
          side_effects?: string | null
          supplement_name?: string
          time_taken?: string
          user_id?: string | null
        }
        Relationships: []
      }
      support_network: {
        Row: {
          contact_info: string | null
          created_at: string | null
          id: string
          is_emergency_contact: boolean | null
          relationship: string
          supporter_name: string
          user_id: string
        }
        Insert: {
          contact_info?: string | null
          created_at?: string | null
          id?: string
          is_emergency_contact?: boolean | null
          relationship: string
          supporter_name: string
          user_id: string
        }
        Update: {
          contact_info?: string | null
          created_at?: string | null
          id?: string
          is_emergency_contact?: boolean | null
          relationship?: string
          supporter_name?: string
          user_id?: string
        }
        Relationships: []
      }
      support_sessions: {
        Row: {
          created_at: string | null
          description: string | null
          duration_minutes: number | null
          host_id: string | null
          id: string
          is_private: boolean | null
          max_participants: number | null
          meeting_link: string | null
          session_date: string
          session_type: string
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          host_id?: string | null
          id?: string
          is_private?: boolean | null
          max_participants?: number | null
          meeting_link?: string | null
          session_date: string
          session_type: string
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          host_id?: string | null
          id?: string
          is_private?: boolean | null
          max_participants?: number | null
          meeting_link?: string | null
          session_date?: string
          session_type?: string
          title?: string
        }
        Relationships: []
      }
      tailored_recommendations: {
        Row: {
          category: string
          condition: Database["public"]["Enums"]["health_condition"]
          created_at: string | null
          description: string
          id: string
          priority: number | null
          title: string
        }
        Insert: {
          category: string
          condition: Database["public"]["Enums"]["health_condition"]
          created_at?: string | null
          description: string
          id?: string
          priority?: number | null
          title: string
        }
        Update: {
          category?: string
          condition?: Database["public"]["Enums"]["health_condition"]
          created_at?: string | null
          description?: string
          id?: string
          priority?: number | null
          title?: string
        }
        Relationships: []
      }
      trigger_patterns: {
        Row: {
          coping_strategies: string[] | null
          created_at: string | null
          emotional_state: string[] | null
          frequency: number | null
          id: string
          location_patterns: string[] | null
          social_context: string[] | null
          success_rate: number | null
          time_patterns: Json | null
          trigger_type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          coping_strategies?: string[] | null
          created_at?: string | null
          emotional_state?: string[] | null
          frequency?: number | null
          id?: string
          location_patterns?: string[] | null
          social_context?: string[] | null
          success_rate?: number | null
          time_patterns?: Json | null
          trigger_type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          coping_strategies?: string[] | null
          created_at?: string | null
          emotional_state?: string[] | null
          frequency?: number | null
          id?: string
          location_patterns?: string[] | null
          social_context?: string[] | null
          success_rate?: number | null
          time_patterns?: Json | null
          trigger_type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_health_conditions: {
        Row: {
          conditions: Database["public"]["Enums"]["health_condition"][]
          created_at: string | null
          id: string
          needs_energy_support: boolean | null
          needs_focus_support: boolean | null
          updated_at: string | null
          user_id: string
          weather_sensitive: boolean | null
          weather_triggers: Json | null
        }
        Insert: {
          conditions?: Database["public"]["Enums"]["health_condition"][]
          created_at?: string | null
          id?: string
          needs_energy_support?: boolean | null
          needs_focus_support?: boolean | null
          updated_at?: string | null
          user_id: string
          weather_sensitive?: boolean | null
          weather_triggers?: Json | null
        }
        Update: {
          conditions?: Database["public"]["Enums"]["health_condition"][]
          created_at?: string | null
          id?: string
          needs_energy_support?: boolean | null
          needs_focus_support?: boolean | null
          updated_at?: string | null
          user_id?: string
          weather_sensitive?: boolean | null
          weather_triggers?: Json | null
        }
        Relationships: []
      }
      user_nrt_progress: {
        Row: {
          completed_at: string | null
          created_at: string | null
          id: string
          notes: string | null
          started_at: string | null
          step_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          started_at?: string | null
          step_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          started_at?: string | null
          step_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_nrt_progress_step_id_fkey"
            columns: ["step_id"]
            isOneToOne: false
            referencedRelation: "nrt_guide_steps"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vendor_ratings: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string
          rating: number | null
          updated_at: string | null
          user_id: string | null
          vendor_id: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          rating?: number | null
          updated_at?: string | null
          user_id?: string | null
          vendor_id?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          rating?: number | null
          updated_at?: string | null
          user_id?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_ratings_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          ai_analysis: string | null
          ai_analysis_updated_at: string | null
          brand_description: string | null
          claimed_by: string | null
          contact_email: string | null
          created_at: string | null
          id: string
          location: string | null
          name: string
          phone: string | null
          product_varieties: string[] | null
          ships_from: string[] | null
          ships_to: string[] | null
          store_type: string
          verified: boolean | null
          website: string | null
        }
        Insert: {
          ai_analysis?: string | null
          ai_analysis_updated_at?: string | null
          brand_description?: string | null
          claimed_by?: string | null
          contact_email?: string | null
          created_at?: string | null
          id?: string
          location?: string | null
          name: string
          phone?: string | null
          product_varieties?: string[] | null
          ships_from?: string[] | null
          ships_to?: string[] | null
          store_type?: string
          verified?: boolean | null
          website?: string | null
        }
        Update: {
          ai_analysis?: string | null
          ai_analysis_updated_at?: string | null
          brand_description?: string | null
          claimed_by?: string | null
          contact_email?: string | null
          created_at?: string | null
          id?: string
          location?: string | null
          name?: string
          phone?: string | null
          product_varieties?: string[] | null
          ships_from?: string[] | null
          ships_to?: string[] | null
          store_type?: string
          verified?: boolean | null
          website?: string | null
        }
        Relationships: []
      }
      withdrawal_symptoms: {
        Row: {
          coping_methods: string[] | null
          created_at: string | null
          duration_hours: number | null
          id: string
          intensity: number
          notes: string | null
          symptom_type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          coping_methods?: string[] | null
          created_at?: string | null
          duration_hours?: number | null
          id?: string
          intensity: number
          notes?: string | null
          symptom_type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          coping_methods?: string[] | null
          created_at?: string | null
          duration_hours?: number | null
          id?: string
          intensity?: number
          notes?: string | null
          symptom_type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      distraction_type: "app" | "website" | "notification" | "social_media"
      exercise_type:
        | "walking"
        | "running"
        | "cycling"
        | "hiking"
        | "yoga"
        | "stretching"
        | "desk_exercise"
      game_type:
        | "chess"
        | "go"
        | "checkers"
        | "reversi"
        | "xiangqi"
        | "shogi"
        | "gomoku"
        | "connect_four"
        | "tic_tac_toe"
      health_condition:
        | "adhd"
        | "chronic_fatigue"
        | "multiple_sclerosis"
        | "other_fatigue"
        | "other_focus_issue"
        | "short_term_memory"
        | "long_term_memory"
        | "migraine"
      quit_strategy_type:
        | "cold_turkey"
        | "taper_down"
        | "nrt_assisted"
        | "harm_reduction"
      risk_level: "low" | "medium" | "high"
      smoking_log_type: "cigarette" | "cigar" | "vape" | "pouch" | "gum"
      strength_level: "light" | "medium" | "strong" | "extra_strong"
      substance_type: "alcohol" | "tobacco" | "other"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
