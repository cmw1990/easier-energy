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
      ab_test_assignments: {
        Row: {
          assigned_at: string | null
          id: string
          test_name: string
          user_id: string | null
          variant_id: string | null
        }
        Insert: {
          assigned_at?: string | null
          id?: string
          test_name: string
          user_id?: string | null
          variant_id?: string | null
        }
        Update: {
          assigned_at?: string | null
          id?: string
          test_name?: string
          user_id?: string | null
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ab_test_assignments_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "ab_test_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      ab_test_events: {
        Row: {
          assignment_id: string | null
          created_at: string | null
          event_data: Json | null
          event_type: string
          id: string
        }
        Insert: {
          assignment_id?: string | null
          created_at?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
        }
        Update: {
          assignment_id?: string | null
          created_at?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ab_test_events_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "ab_test_assignments"
            referencedColumns: ["id"]
          },
        ]
      }
      ab_test_variants: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          test_name: string
          updated_at: string | null
          variant_name: string
          weight: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          test_name: string
          updated_at?: string | null
          variant_name: string
          weight?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          test_name?: string
          updated_at?: string | null
          variant_name?: string
          weight?: number | null
        }
        Relationships: []
      }
      achievement_progress: {
        Row: {
          achievement_id: string
          current_progress: number | null
          id: string
          last_updated: string | null
          user_id: string
        }
        Insert: {
          achievement_id: string
          current_progress?: number | null
          id?: string
          last_updated?: string | null
          user_id: string
        }
        Update: {
          achievement_id?: string
          current_progress?: number | null
          id?: string
          last_updated?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "achievement_progress_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      achievement_rules: {
        Row: {
          badge_icon: string | null
          category: string
          created_at: string | null
          description: string | null
          id: string
          name: string
          points_reward: number | null
          trigger_type: string
          trigger_value: number | null
        }
        Insert: {
          badge_icon?: string | null
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          points_reward?: number | null
          trigger_type: string
          trigger_value?: number | null
        }
        Update: {
          badge_icon?: string | null
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          points_reward?: number | null
          trigger_type?: string
          trigger_value?: number | null
        }
        Relationships: []
      }
      achievements: {
        Row: {
          category: string | null
          created_at: string | null
          description: string
          icon: string
          id: string
          level: number | null
          next_level_points: number | null
          points: number
          progress: number | null
          streak_count: number | null
          target_value: number | null
          title: string
          type: string
          unlocked_at: string | null
          user_id: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description: string
          icon: string
          id?: string
          level?: number | null
          next_level_points?: number | null
          points?: number
          progress?: number | null
          streak_count?: number | null
          target_value?: number | null
          title: string
          type: string
          unlocked_at?: string | null
          user_id?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string
          icon?: string
          id?: string
          level?: number | null
          next_level_points?: number | null
          points?: number
          progress?: number | null
          streak_count?: number | null
          target_value?: number | null
          title?: string
          type?: string
          unlocked_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      activity_tracking: {
        Row: {
          activity_name: string
          created_at: string | null
          duration_minutes: number | null
          id: string
          impact: Database["public"]["Enums"]["activity_impact"] | null
          notes: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          activity_name: string
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          impact?: Database["public"]["Enums"]["activity_impact"] | null
          notes?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          activity_name?: string
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          impact?: Database["public"]["Enums"]["activity_impact"] | null
          notes?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      adhd_task_organization: {
        Row: {
          created_at: string | null
          difficulty_level: number | null
          energy_required: number | null
          estimated_focus_blocks: number | null
          id: string
          priority_method: string
          reward_points: number | null
          task_id: string
          updated_at: string | null
          user_id: string
          visual_tags: Json | null
        }
        Insert: {
          created_at?: string | null
          difficulty_level?: number | null
          energy_required?: number | null
          estimated_focus_blocks?: number | null
          id?: string
          priority_method: string
          reward_points?: number | null
          task_id: string
          updated_at?: string | null
          user_id: string
          visual_tags?: Json | null
        }
        Update: {
          created_at?: string | null
          difficulty_level?: number | null
          energy_required?: number | null
          estimated_focus_blocks?: number | null
          id?: string
          priority_method?: string
          reward_points?: number | null
          task_id?: string
          updated_at?: string | null
          user_id?: string
          visual_tags?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "adhd_task_organization_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
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
      body_doubling_participants: {
        Row: {
          created_at: string | null
          id: string
          join_time: string | null
          leave_time: string | null
          session_id: string
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          join_time?: string | null
          leave_time?: string | null
          session_id: string
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          join_time?: string | null
          leave_time?: string | null
          session_id?: string
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "body_doubling_participants_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "body_doubling_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      body_doubling_sessions: {
        Row: {
          created_at: string | null
          description: string | null
          duration_minutes: number | null
          host_id: string
          id: string
          is_private: boolean | null
          max_participants: number | null
          meeting_link: string | null
          session_type: string
          start_time: string
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          host_id: string
          id?: string
          is_private?: boolean | null
          max_participants?: number | null
          meeting_link?: string | null
          session_type: string
          start_time: string
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          host_id?: string
          id?: string
          is_private?: boolean | null
          max_participants?: number | null
          meeting_link?: string | null
          session_type?: string
          start_time?: string
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      card_sorting_responses: {
        Row: {
          card_groups: Json
          completion_time: number | null
          created_at: string | null
          feedback: string | null
          id: string
          participant_id: string | null
          study_id: string | null
        }
        Insert: {
          card_groups: Json
          completion_time?: number | null
          created_at?: string | null
          feedback?: string | null
          id?: string
          participant_id?: string | null
          study_id?: string | null
        }
        Update: {
          card_groups?: Json
          completion_time?: number | null
          created_at?: string | null
          feedback?: string | null
          id?: string
          participant_id?: string | null
          study_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "card_sorting_responses_study_id_fkey"
            columns: ["study_id"]
            isOneToOne: false
            referencedRelation: "card_sorting_studies"
            referencedColumns: ["id"]
          },
        ]
      }
      card_sorting_studies: {
        Row: {
          cards: Json | null
          categories: Json | null
          created_at: string | null
          description: string | null
          id: string
          instructions: string | null
          sort_type: string
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          cards?: Json | null
          categories?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          instructions?: string | null
          sort_type: string
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          cards?: Json | null
          categories?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          instructions?: string | null
          sort_type?: string
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      cbt_exercises: {
        Row: {
          alternative_thoughts: string | null
          behaviors: string
          created_at: string | null
          emotions: string[]
          exercise_type: Database["public"]["Enums"]["cbt_exercise_type"]
          id: string
          outcome: string | null
          situation: string
          thoughts: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          alternative_thoughts?: string | null
          behaviors: string
          created_at?: string | null
          emotions: string[]
          exercise_type: Database["public"]["Enums"]["cbt_exercise_type"]
          id?: string
          outcome?: string | null
          situation: string
          thoughts: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          alternative_thoughts?: string | null
          behaviors?: string
          created_at?: string | null
          emotions?: string[]
          exercise_type?: Database["public"]["Enums"]["cbt_exercise_type"]
          id?: string
          outcome?: string | null
          situation?: string
          thoughts?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      collection_products: {
        Row: {
          added_at: string | null
          collection_id: string
          product_id: string
        }
        Insert: {
          added_at?: string | null
          collection_id: string
          product_id: string
        }
        Update: {
          added_at?: string | null
          collection_id?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collection_products_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      collections: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          name: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      comments: {
        Row: {
          content: string
          created_at: string | null
          downvotes: number | null
          id: string
          parent_id: string | null
          product_id: string | null
          updated_at: string | null
          upvotes: number | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          downvotes?: number | null
          id?: string
          parent_id?: string | null
          product_id?: string | null
          updated_at?: string | null
          upvotes?: number | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          downvotes?: number | null
          id?: string
          parent_id?: string | null
          product_id?: string | null
          updated_at?: string | null
          upvotes?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
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
      daily_checkins: {
        Row: {
          created_at: string | null
          energy_level: number | null
          id: string
          mood_score: number | null
          notes: string | null
          sleep_quality: number | null
          stress_level: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          energy_level?: number | null
          id?: string
          mood_score?: number | null
          notes?: string | null
          sleep_quality?: number | null
          stress_level?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          energy_level?: number | null
          id?: string
          mood_score?: number | null
          notes?: string | null
          sleep_quality?: number | null
          stress_level?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      design_surveys: {
        Row: {
          created_at: string | null
          description: string | null
          design_url: string | null
          id: string
          questions: Json | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          design_url?: string | null
          id?: string
          questions?: Json | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          design_url?: string | null
          id?: string
          questions?: Json | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      discussion_responses: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_solution: boolean | null
          topic_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_solution?: boolean | null
          topic_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_solution?: boolean | null
          topic_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "discussion_responses_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "discussion_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      discussion_topics: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_pinned: boolean | null
          product_id: string | null
          status: Database["public"]["Enums"]["discussion_status"] | null
          title: string
          updated_at: string | null
          user_id: string | null
          view_count: number | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_pinned?: boolean | null
          product_id?: string | null
          status?: Database["public"]["Enums"]["discussion_status"] | null
          title: string
          updated_at?: string | null
          user_id?: string | null
          view_count?: number | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_pinned?: boolean | null
          product_id?: string | null
          status?: Database["public"]["Enums"]["discussion_status"] | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "discussion_topics_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
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
      executive_function_tools: {
        Row: {
          active_reminders: Json[] | null
          created_at: string | null
          id: string
          schedule: Json | null
          settings: Json | null
          tool_type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          active_reminders?: Json[] | null
          created_at?: string | null
          id?: string
          schedule?: Json | null
          settings?: Json | null
          tool_type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          active_reminders?: Json[] | null
          created_at?: string | null
          id?: string
          schedule?: Json | null
          settings?: Json | null
          tool_type?: string
          updated_at?: string | null
          user_id?: string
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
      featured_products: {
        Row: {
          created_at: string | null
          feature_date: string
          feature_type: string
          id: string
          product_id: string | null
        }
        Insert: {
          created_at?: string | null
          feature_date?: string
          feature_type: string
          id?: string
          product_id?: string | null
        }
        Update: {
          created_at?: string | null
          feature_date?: string
          feature_type?: string
          id?: string
          product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "featured_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
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
      first_click_responses: {
        Row: {
          click_coordinates: Json
          created_at: string | null
          id: string
          is_success: boolean | null
          participant_id: string | null
          test_id: string | null
          time_to_click: number | null
        }
        Insert: {
          click_coordinates: Json
          created_at?: string | null
          id?: string
          is_success?: boolean | null
          participant_id?: string | null
          test_id?: string | null
          time_to_click?: number | null
        }
        Update: {
          click_coordinates?: Json
          created_at?: string | null
          id?: string
          is_success?: boolean | null
          participant_id?: string | null
          test_id?: string | null
          time_to_click?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "first_click_responses_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "first_click_tests"
            referencedColumns: ["id"]
          },
        ]
      }
      first_click_tests: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          question: string
          success_zones: Json | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          question: string
          success_zones?: Json | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          question?: string
          success_zones?: Json | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      five_second_responses: {
        Row: {
          accuracy_score: number | null
          created_at: string | null
          id: string
          participant_id: string | null
          responses: Json
          test_id: string | null
        }
        Insert: {
          accuracy_score?: number | null
          created_at?: string | null
          id?: string
          participant_id?: string | null
          responses: Json
          test_id?: string | null
        }
        Update: {
          accuracy_score?: number | null
          created_at?: string | null
          id?: string
          participant_id?: string | null
          responses?: Json
          test_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "five_second_responses_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "five_second_tests"
            referencedColumns: ["id"]
          },
        ]
      }
      five_second_tests: {
        Row: {
          created_at: string | null
          description: string | null
          display_duration: number | null
          id: string
          image_url: string
          questions: Json | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_duration?: number | null
          id?: string
          image_url: string
          questions?: Json | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_duration?: number | null
          id?: string
          image_url?: string
          questions?: Json | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      focus_achievements: {
        Row: {
          achieved_at: string | null
          achievement_type: string
          created_at: string | null
          details: Json | null
          id: string
          points_earned: number | null
          streak_count: number | null
          user_id: string
        }
        Insert: {
          achieved_at?: string | null
          achievement_type: string
          created_at?: string | null
          details?: Json | null
          id?: string
          points_earned?: number | null
          streak_count?: number | null
          user_id: string
        }
        Update: {
          achieved_at?: string | null
          achievement_type?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          points_earned?: number | null
          streak_count?: number | null
          user_id?: string
        }
        Relationships: []
      }
      focus_analytics: {
        Row: {
          created_at: string | null
          daily_focus_score: number | null
          date: string
          energy_levels: Json | null
          focus_patterns: Json | null
          id: string
          interrupted_sessions: number | null
          notes: string | null
          peak_focus_periods: Json | null
          productivity_insights: string | null
          productivity_score: number | null
          successful_sessions: number | null
          suggested_improvements: Json | null
          total_focus_time: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          daily_focus_score?: number | null
          date?: string
          energy_levels?: Json | null
          focus_patterns?: Json | null
          id?: string
          interrupted_sessions?: number | null
          notes?: string | null
          peak_focus_periods?: Json | null
          productivity_insights?: string | null
          productivity_score?: number | null
          successful_sessions?: number | null
          suggested_improvements?: Json | null
          total_focus_time?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          daily_focus_score?: number | null
          date?: string
          energy_levels?: Json | null
          focus_patterns?: Json | null
          id?: string
          interrupted_sessions?: number | null
          notes?: string | null
          peak_focus_periods?: Json | null
          productivity_insights?: string | null
          productivity_score?: number | null
          successful_sessions?: number | null
          suggested_improvements?: Json | null
          total_focus_time?: number | null
          user_id?: string
        }
        Relationships: []
      }
      focus_celebrations: {
        Row: {
          achievement_type: string
          celebration_message: string | null
          created_at: string | null
          id: string
          milestone_reached: string
          points_earned: number | null
          reward_type: string | null
          user_id: string | null
        }
        Insert: {
          achievement_type: string
          celebration_message?: string | null
          created_at?: string | null
          id?: string
          milestone_reached: string
          points_earned?: number | null
          reward_type?: string | null
          user_id?: string | null
        }
        Update: {
          achievement_type?: string
          celebration_message?: string | null
          created_at?: string | null
          id?: string
          milestone_reached?: string
          points_earned?: number | null
          reward_type?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      focus_environment_preferences: {
        Row: {
          background_type: string | null
          created_at: string | null
          custom_settings: Json | null
          id: string
          light_preference: string | null
          noise_type: string[] | null
          temperature_preference: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          background_type?: string | null
          created_at?: string | null
          custom_settings?: Json | null
          id?: string
          light_preference?: string | null
          noise_type?: string[] | null
          temperature_preference?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          background_type?: string | null
          created_at?: string | null
          custom_settings?: Json | null
          id?: string
          light_preference?: string | null
          noise_type?: string[] | null
          temperature_preference?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      focus_habits: {
        Row: {
          created_at: string | null
          description: string | null
          frequency: string
          habit_name: string
          id: string
          reminder_time: string | null
          streak_count: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          frequency: string
          habit_name: string
          id?: string
          reminder_time?: string | null
          streak_count?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          frequency?: string
          habit_name?: string
          id?: string
          reminder_time?: string | null
          streak_count?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      focus_interruption_logs: {
        Row: {
          context: string | null
          coping_strategy: string | null
          created_at: string | null
          duration_seconds: number | null
          effectiveness_rating: number | null
          id: string
          interruption_type: string
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          context?: string | null
          coping_strategy?: string | null
          created_at?: string | null
          duration_seconds?: number | null
          effectiveness_rating?: number | null
          id?: string
          interruption_type: string
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          context?: string | null
          coping_strategy?: string | null
          created_at?: string | null
          duration_seconds?: number | null
          effectiveness_rating?: number | null
          id?: string
          interruption_type?: string
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "focus_interruption_logs_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "focus_timer_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      focus_journal: {
        Row: {
          created_at: string | null
          energy_level: number | null
          entry_date: string | null
          focus_challenges: string[] | null
          id: string
          improvements: string[] | null
          notes: string | null
          productivity_rating: number | null
          strategies_used: string[] | null
          updated_at: string | null
          user_id: string
          wins: string[] | null
        }
        Insert: {
          created_at?: string | null
          energy_level?: number | null
          entry_date?: string | null
          focus_challenges?: string[] | null
          id?: string
          improvements?: string[] | null
          notes?: string | null
          productivity_rating?: number | null
          strategies_used?: string[] | null
          updated_at?: string | null
          user_id: string
          wins?: string[] | null
        }
        Update: {
          created_at?: string | null
          energy_level?: number | null
          entry_date?: string | null
          focus_challenges?: string[] | null
          id?: string
          improvements?: string[] | null
          notes?: string | null
          productivity_rating?: number | null
          strategies_used?: string[] | null
          updated_at?: string | null
          user_id?: string
          wins?: string[] | null
        }
        Relationships: []
      }
      focus_music: {
        Row: {
          artist: string | null
          audio_url: string
          category: string
          created_at: string | null
          duration_seconds: number
          energy_level: number | null
          id: string
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          artist?: string | null
          audio_url: string
          category: string
          created_at?: string | null
          duration_seconds: number
          energy_level?: number | null
          id?: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          artist?: string | null
          audio_url?: string
          category?: string
          created_at?: string | null
          duration_seconds?: number
          energy_level?: number | null
          id?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      focus_rewards: {
        Row: {
          claimed_at: string | null
          created_at: string | null
          description: string | null
          expires_at: string | null
          id: string
          is_claimed: boolean | null
          points_required: number
          reward_type: string
          title: string
          user_id: string
        }
        Insert: {
          claimed_at?: string | null
          created_at?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          is_claimed?: boolean | null
          points_required: number
          reward_type: string
          title: string
          user_id: string
        }
        Update: {
          claimed_at?: string | null
          created_at?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          is_claimed?: boolean | null
          points_required?: number
          reward_type?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      focus_routines: {
        Row: {
          best_time_of_day: string[] | null
          created_at: string | null
          duration_minutes: number | null
          effectiveness_rating: number | null
          energy_required: number | null
          id: string
          name: string
          steps: Json
          updated_at: string | null
          user_id: string
        }
        Insert: {
          best_time_of_day?: string[] | null
          created_at?: string | null
          duration_minutes?: number | null
          effectiveness_rating?: number | null
          energy_required?: number | null
          id?: string
          name: string
          steps: Json
          updated_at?: string | null
          user_id: string
        }
        Update: {
          best_time_of_day?: string[] | null
          created_at?: string | null
          duration_minutes?: number | null
          effectiveness_rating?: number | null
          energy_required?: number | null
          id?: string
          name?: string
          steps?: Json
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      focus_task_breakdowns: {
        Row: {
          created_at: string | null
          energy_level_required: number | null
          id: string
          micro_steps: Json
          motivation_notes: string | null
          rewards: Json | null
          task_id: string | null
          time_estimates: Json | null
          updated_at: string | null
          user_id: string | null
          visual_aids: Json | null
        }
        Insert: {
          created_at?: string | null
          energy_level_required?: number | null
          id?: string
          micro_steps?: Json
          motivation_notes?: string | null
          rewards?: Json | null
          task_id?: string | null
          time_estimates?: Json | null
          updated_at?: string | null
          user_id?: string | null
          visual_aids?: Json | null
        }
        Update: {
          created_at?: string | null
          energy_level_required?: number | null
          id?: string
          micro_steps?: Json
          motivation_notes?: string | null
          rewards?: Json | null
          task_id?: string | null
          time_estimates?: Json | null
          updated_at?: string | null
          user_id?: string | null
          visual_aids?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "focus_task_breakdowns_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      focus_timer_sessions: {
        Row: {
          actual_duration: number | null
          break_duration: number | null
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          energy_level: number | null
          id: string
          interrupted_count: number | null
          mood_after: number | null
          mood_before: number | null
          notes: string | null
          started_at: string | null
          tags: string[] | null
          timer_type: string
          user_id: string
          work_duration: number
        }
        Insert: {
          actual_duration?: number | null
          break_duration?: number | null
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          energy_level?: number | null
          id?: string
          interrupted_count?: number | null
          mood_after?: number | null
          mood_before?: number | null
          notes?: string | null
          started_at?: string | null
          tags?: string[] | null
          timer_type: string
          user_id: string
          work_duration: number
        }
        Update: {
          actual_duration?: number | null
          break_duration?: number | null
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          energy_level?: number | null
          id?: string
          interrupted_count?: number | null
          mood_after?: number | null
          mood_before?: number | null
          notes?: string | null
          started_at?: string | null
          tags?: string[] | null
          timer_type?: string
          user_id?: string
          work_duration?: number
        }
        Relationships: []
      }
      focus_zones: {
        Row: {
          amenities: string[] | null
          created_at: string | null
          custom_settings: Json | null
          effectiveness_rating: number | null
          id: string
          location_type: string | null
          name: string
          notes: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amenities?: string[] | null
          created_at?: string | null
          custom_settings?: Json | null
          effectiveness_rating?: number | null
          id?: string
          location_type?: string | null
          name: string
          notes?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amenities?: string[] | null
          created_at?: string | null
          custom_settings?: Json | null
          effectiveness_rating?: number | null
          id?: string
          location_type?: string | null
          name?: string
          notes?: string | null
          updated_at?: string | null
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
      gratitude_journal: {
        Row: {
          category: Database["public"]["Enums"]["gratitude_category"]
          content: string
          created_at: string | null
          id: string
          mood_impact: number | null
          reflection: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category: Database["public"]["Enums"]["gratitude_category"]
          content: string
          created_at?: string | null
          id?: string
          mood_impact?: number | null
          reflection?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: Database["public"]["Enums"]["gratitude_category"]
          content?: string
          created_at?: string | null
          id?: string
          mood_impact?: number | null
          reflection?: string | null
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
      medication_reminders: {
        Row: {
          created_at: string | null
          days_of_week: string[] | null
          dosage: string
          end_date: string | null
          frequency: string
          id: string
          medication_name: string
          notes: string | null
          reminder_times: string[]
          start_date: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          days_of_week?: string[] | null
          dosage: string
          end_date?: string | null
          frequency: string
          id?: string
          medication_name: string
          notes?: string | null
          reminder_times: string[]
          start_date?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          days_of_week?: string[] | null
          dosage?: string
          end_date?: string | null
          frequency?: string
          id?: string
          medication_name?: string
          notes?: string | null
          reminder_times?: string[]
          start_date?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      meditation_audio: {
        Row: {
          audio_url: string
          category: string
          created_at: string | null
          description: string | null
          duration_seconds: number
          id: string
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          audio_url: string
          category: string
          created_at?: string | null
          description?: string | null
          duration_seconds: number
          id?: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          audio_url?: string
          category?: string
          created_at?: string | null
          description?: string | null
          duration_seconds?: number
          id?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
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
      motivation_quotes: {
        Row: {
          author: string | null
          category: string | null
          content: string
          created_at: string | null
          id: string
        }
        Insert: {
          author?: string | null
          category?: string | null
          content: string
          created_at?: string | null
          id?: string
        }
        Update: {
          author?: string | null
          category?: string | null
          content?: string
          created_at?: string | null
          id?: string
        }
        Relationships: []
      }
      motivation_streaks: {
        Row: {
          created_at: string | null
          current_streak: number | null
          id: string
          last_check_in: string | null
          longest_streak: number | null
          streak_type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          current_streak?: number | null
          id?: string
          last_check_in?: string | null
          longest_streak?: number | null
          streak_type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          current_streak?: number | null
          id?: string
          last_check_in?: string | null
          longest_streak?: number | null
          streak_type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      motivation_tracking: {
        Row: {
          created_at: string | null
          daily_goal: string | null
          date: string | null
          energy_score: number | null
          goal_achieved: boolean | null
          id: string
          mood_score: number | null
          reflection: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          daily_goal?: string | null
          date?: string | null
          energy_score?: number | null
          goal_achieved?: boolean | null
          id?: string
          mood_score?: number | null
          reflection?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          daily_goal?: string | null
          date?: string | null
          energy_score?: number | null
          goal_achieved?: boolean | null
          id?: string
          mood_score?: number | null
          reflection?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      noise_sensitivity_settings: {
        Row: {
          auto_adjust_enabled: boolean | null
          created_at: string | null
          focus_mode_settings: Json | null
          id: string
          preferred_sounds: string[] | null
          updated_at: string | null
          user_id: string
          volume_level: number | null
          white_noise_enabled: boolean | null
        }
        Insert: {
          auto_adjust_enabled?: boolean | null
          created_at?: string | null
          focus_mode_settings?: Json | null
          id?: string
          preferred_sounds?: string[] | null
          updated_at?: string | null
          user_id: string
          volume_level?: number | null
          white_noise_enabled?: boolean | null
        }
        Update: {
          auto_adjust_enabled?: boolean | null
          created_at?: string | null
          focus_mode_settings?: Json | null
          id?: string
          preferred_sounds?: string[] | null
          updated_at?: string | null
          user_id?: string
          volume_level?: number | null
          white_noise_enabled?: boolean | null
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
      notification_queue: {
        Row: {
          content: string | null
          created_at: string | null
          device_token: string
          id: string
          notification_id: string | null
          sent_at: string | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          device_token: string
          id?: string
          notification_id?: string | null
          sent_at?: string | null
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          device_token?: string
          id?: string
          notification_id?: string | null
          sent_at?: string | null
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_queue_notification_id_fkey"
            columns: ["notification_id"]
            isOneToOne: false
            referencedRelation: "notifications"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          link: string | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          link?: string | null
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          link?: string | null
          title?: string
          type?: string
          user_id?: string | null
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
      participant_sessions: {
        Row: {
          created_at: string | null
          end_time: string | null
          id: string
          participant_id: string | null
          responses: Json | null
          screen_recording_url: string | null
          session_recording_url: string | null
          start_time: string | null
          study_id: string
          study_type: string
        }
        Insert: {
          created_at?: string | null
          end_time?: string | null
          id?: string
          participant_id?: string | null
          responses?: Json | null
          screen_recording_url?: string | null
          session_recording_url?: string | null
          start_time?: string | null
          study_id: string
          study_type: string
        }
        Update: {
          created_at?: string | null
          end_time?: string | null
          id?: string
          participant_id?: string | null
          responses?: Json | null
          screen_recording_url?: string | null
          session_recording_url?: string | null
          start_time?: string | null
          study_id?: string
          study_type?: string
        }
        Relationships: []
      }
      preference_test_responses: {
        Row: {
          completion_time: number | null
          created_at: string | null
          feedback: string | null
          id: string
          participant_id: string | null
          preferences: Json
          test_id: string | null
        }
        Insert: {
          completion_time?: number | null
          created_at?: string | null
          feedback?: string | null
          id?: string
          participant_id?: string | null
          preferences: Json
          test_id?: string | null
        }
        Update: {
          completion_time?: number | null
          created_at?: string | null
          feedback?: string | null
          id?: string
          participant_id?: string | null
          preferences?: Json
          test_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "preference_test_responses_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "preference_tests"
            referencedColumns: ["id"]
          },
        ]
      }
      preference_tests: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          questions: Json | null
          test_type: string
          title: string
          updated_at: string | null
          user_id: string | null
          variants: Json | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          questions?: Json | null
          test_type: string
          title: string
          updated_at?: string | null
          user_id?: string | null
          variants?: Json | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          questions?: Json | null
          test_type?: string
          title?: string
          updated_at?: string | null
          user_id?: string | null
          variants?: Json | null
        }
        Relationships: []
      }
      product_ai_insights: {
        Row: {
          created_at: string | null
          id: string
          key_features: string[] | null
          product_id: string | null
          similar_products: string[] | null
          summary: string | null
          target_audience: string[] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          key_features?: string[] | null
          product_id?: string | null
          similar_products?: string[] | null
          summary?: string | null
          target_audience?: string[] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          key_features?: string[] | null
          product_id?: string | null
          similar_products?: string[] | null
          summary?: string | null
          target_audience?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_ai_insights_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_analytics: {
        Row: {
          created_at: string | null
          engagement_score: number | null
          id: string
          last_viewed_at: string | null
          product_id: string | null
          updated_at: string | null
          user_id: string | null
          view_count: number | null
        }
        Insert: {
          created_at?: string | null
          engagement_score?: number | null
          id?: string
          last_viewed_at?: string | null
          product_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          view_count?: number | null
        }
        Update: {
          created_at?: string | null
          engagement_score?: number | null
          id?: string
          last_viewed_at?: string | null
          product_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_analytics_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
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
      product_badges: {
        Row: {
          awarded_at: string | null
          badge_type: string
          created_at: string | null
          expires_at: string | null
          id: string
          product_id: string | null
        }
        Insert: {
          awarded_at?: string | null
          badge_type: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          product_id?: string | null
        }
        Update: {
          awarded_at?: string | null
          badge_type?: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_badges_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_comparisons: {
        Row: {
          compared_with_id: string | null
          comparison_data: Json
          created_at: string | null
          created_by: string | null
          id: string
          product_id: string | null
        }
        Insert: {
          compared_with_id?: string | null
          comparison_data: Json
          created_at?: string | null
          created_by?: string | null
          id?: string
          product_id?: string | null
        }
        Update: {
          compared_with_id?: string | null
          comparison_data?: Json
          created_at?: string | null
          created_by?: string | null
          id?: string
          product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_comparisons_compared_with_id_fkey"
            columns: ["compared_with_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_comparisons_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_discussions: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_pinned: boolean | null
          product_id: string | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_pinned?: boolean | null
          product_id?: string | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_pinned?: boolean | null
          product_id?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_discussions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_retail_availability: {
        Row: {
          id: string
          in_stock: boolean | null
          last_updated: string | null
          location_id: string | null
          price: number
          product_id: string | null
          stock_quantity: number | null
        }
        Insert: {
          id?: string
          in_stock?: boolean | null
          last_updated?: string | null
          location_id?: string | null
          price: number
          product_id?: string | null
          stock_quantity?: number | null
        }
        Update: {
          id?: string
          in_stock?: boolean | null
          last_updated?: string | null
          location_id?: string | null
          price?: number
          product_id?: string | null
          stock_quantity?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_retail_availability_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "retail_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_retail_availability_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_reviews: {
        Row: {
          cons: string[] | null
          content: string | null
          created_at: string | null
          helpful_count: number | null
          id: string
          not_helpful_count: number | null
          product_id: string | null
          pros: string[] | null
          rating: number
          review_type: Database["public"]["Enums"]["review_type"] | null
          title: string
          updated_at: string | null
          usage_period: string | null
          user_id: string | null
          verified_purchase: boolean | null
          would_recommend: boolean | null
        }
        Insert: {
          cons?: string[] | null
          content?: string | null
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          not_helpful_count?: number | null
          product_id?: string | null
          pros?: string[] | null
          rating: number
          review_type?: Database["public"]["Enums"]["review_type"] | null
          title: string
          updated_at?: string | null
          usage_period?: string | null
          user_id?: string | null
          verified_purchase?: boolean | null
          would_recommend?: boolean | null
        }
        Update: {
          cons?: string[] | null
          content?: string | null
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          not_helpful_count?: number | null
          product_id?: string | null
          pros?: string[] | null
          rating?: number
          review_type?: Database["public"]["Enums"]["review_type"] | null
          title?: string
          updated_at?: string | null
          usage_period?: string | null
          user_id?: string | null
          verified_purchase?: boolean | null
          would_recommend?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "product_reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_topics: {
        Row: {
          product_id: string
          topic_id: string
        }
        Insert: {
          product_id: string
          topic_id: string
        }
        Update: {
          product_id?: string
          topic_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_topics_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_topics_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      product_updates: {
        Row: {
          content: string
          created_at: string | null
          id: string
          product_id: string | null
          title: string
          update_type: string | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          product_id?: string | null
          title: string
          update_type?: string | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          product_id?: string | null
          title?: string
          update_type?: string | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_updates_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
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
          authenticity_verified: boolean | null
          brand: string
          category: string | null
          certifications: string[] | null
          chemicals: string[] | null
          comments_count: number | null
          condition: string | null
          created_at: string | null
          description: string | null
          dimensions: Json | null
          featured_date: string | null
          featured_score: number | null
          flavor: string
          id: string
          image_url: string | null
          is_launched: boolean | null
          is_nrt_certified: boolean
          launch_date: string | null
          maker_id: string | null
          materials: string[] | null
          media_gallery: Json[] | null
          name: string
          product_type: string
          retail_availability: Json | null
          risk_level: Database["public"]["Enums"]["risk_level"]
          size_reference: Json | null
          strength: Database["public"]["Enums"]["strength_level"]
          tags: string[] | null
          updated_at: string | null
          upvotes_count: number | null
          weight_grams: number | null
        }
        Insert: {
          authenticity_verified?: boolean | null
          brand?: string
          category?: string | null
          certifications?: string[] | null
          chemicals?: string[] | null
          comments_count?: number | null
          condition?: string | null
          created_at?: string | null
          description?: string | null
          dimensions?: Json | null
          featured_date?: string | null
          featured_score?: number | null
          flavor: string
          id?: string
          image_url?: string | null
          is_launched?: boolean | null
          is_nrt_certified?: boolean
          launch_date?: string | null
          maker_id?: string | null
          materials?: string[] | null
          media_gallery?: Json[] | null
          name: string
          product_type?: string
          retail_availability?: Json | null
          risk_level: Database["public"]["Enums"]["risk_level"]
          size_reference?: Json | null
          strength: Database["public"]["Enums"]["strength_level"]
          tags?: string[] | null
          updated_at?: string | null
          upvotes_count?: number | null
          weight_grams?: number | null
        }
        Update: {
          authenticity_verified?: boolean | null
          brand?: string
          category?: string | null
          certifications?: string[] | null
          chemicals?: string[] | null
          comments_count?: number | null
          condition?: string | null
          created_at?: string | null
          description?: string | null
          dimensions?: Json | null
          featured_date?: string | null
          featured_score?: number | null
          flavor?: string
          id?: string
          image_url?: string | null
          is_launched?: boolean | null
          is_nrt_certified?: boolean
          launch_date?: string | null
          maker_id?: string | null
          materials?: string[] | null
          media_gallery?: Json[] | null
          name?: string
          product_type?: string
          retail_availability?: Json | null
          risk_level?: Database["public"]["Enums"]["risk_level"]
          size_reference?: Json | null
          strength?: Database["public"]["Enums"]["strength_level"]
          tags?: string[] | null
          updated_at?: string | null
          upvotes_count?: number | null
          weight_grams?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_maker_id_fkey"
            columns: ["maker_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          id: string
          is_verified: boolean | null
          notification_settings: Json | null
          push_token: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          id: string
          is_verified?: boolean | null
          notification_settings?: Json | null
          push_token?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          notification_settings?: Json | null
          push_token?: string | null
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
      reproductive_health_exercises: {
        Row: {
          created_at: string
          description: string
          difficulty_level: number
          duration_seconds: number
          exercise_type: Database["public"]["Enums"]["reproductive_exercise_type"]
          hold_duration_seconds: number | null
          id: string
          name: string
          repetitions: number | null
          rest_duration_seconds: number | null
          sets: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          difficulty_level?: number
          duration_seconds: number
          exercise_type: Database["public"]["Enums"]["reproductive_exercise_type"]
          hold_duration_seconds?: number | null
          id?: string
          name: string
          repetitions?: number | null
          rest_duration_seconds?: number | null
          sets?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          difficulty_level?: number
          duration_seconds?: number
          exercise_type?: Database["public"]["Enums"]["reproductive_exercise_type"]
          hold_duration_seconds?: number | null
          id?: string
          name?: string
          repetitions?: number | null
          rest_duration_seconds?: number | null
          sets?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      reproductive_health_progress: {
        Row: {
          completed_at: string
          created_at: string
          difficulty_level: number
          exercise_id: string
          id: string
          notes: string | null
          perceived_effort: number | null
          sets_completed: number | null
          total_duration_seconds: number | null
          user_id: string
        }
        Insert: {
          completed_at?: string
          created_at?: string
          difficulty_level: number
          exercise_id: string
          id?: string
          notes?: string | null
          perceived_effort?: number | null
          sets_completed?: number | null
          total_duration_seconds?: number | null
          user_id: string
        }
        Update: {
          completed_at?: string
          created_at?: string
          difficulty_level?: number
          exercise_id?: string
          id?: string
          notes?: string | null
          perceived_effort?: number | null
          sets_completed?: number | null
          total_duration_seconds?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reproductive_health_progress_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "reproductive_health_exercises"
            referencedColumns: ["id"]
          },
        ]
      }
      research_data_points: {
        Row: {
          collected_at: string
          created_at: string
          data_type: string
          data_value: Json
          id: string
          participant_id: string
          project_id: string
        }
        Insert: {
          collected_at?: string
          created_at?: string
          data_type: string
          data_value: Json
          id?: string
          participant_id: string
          project_id: string
        }
        Update: {
          collected_at?: string
          created_at?: string
          data_type?: string
          data_value?: Json
          id?: string
          participant_id?: string
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "research_data_points_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "research_participants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "research_data_points_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "research_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      research_notes: {
        Row: {
          content: string
          created_at: string
          id: string
          project_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          project_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          project_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "research_notes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "research_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      research_participants: {
        Row: {
          created_at: string
          enrollment_date: string | null
          id: string
          project_id: string
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          enrollment_date?: string | null
          id?: string
          project_id: string
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          enrollment_date?: string | null
          id?: string
          project_id?: string
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "research_participants_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "research_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      research_projects: {
        Row: {
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          research_type: Database["public"]["Enums"]["research_type"]
          start_date: string | null
          status: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          research_type: Database["public"]["Enums"]["research_type"]
          start_date?: string | null
          status?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          research_type?: Database["public"]["Enums"]["research_type"]
          start_date?: string | null
          status?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      retail_locations: {
        Row: {
          address: string
          contact_info: Json | null
          coordinates: unknown | null
          created_at: string | null
          id: string
          name: string
          operating_hours: Json | null
          updated_at: string | null
        }
        Insert: {
          address: string
          contact_info?: Json | null
          coordinates?: unknown | null
          created_at?: string | null
          id?: string
          name: string
          operating_hours?: Json | null
          updated_at?: string | null
        }
        Update: {
          address?: string
          contact_info?: Json | null
          coordinates?: unknown | null
          created_at?: string | null
          id?: string
          name?: string
          operating_hours?: Json | null
          updated_at?: string | null
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
      supplement_ai_analysis: {
        Row: {
          created_at: string | null
          effectiveness_patterns: Json | null
          id: string
          interaction_warnings: string[] | null
          last_analyzed_at: string | null
          optimal_timing_suggestion: string | null
          research_summary: string | null
          supplement_name: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          effectiveness_patterns?: Json | null
          id?: string
          interaction_warnings?: string[] | null
          last_analyzed_at?: string | null
          optimal_timing_suggestion?: string | null
          research_summary?: string | null
          supplement_name: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          effectiveness_patterns?: Json | null
          id?: string
          interaction_warnings?: string[] | null
          last_analyzed_at?: string | null
          optimal_timing_suggestion?: string | null
          research_summary?: string | null
          supplement_name?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      supplement_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      supplement_category_mappings: {
        Row: {
          category_id: string
          created_at: string | null
          supplement_name: string
          user_id: string
        }
        Insert: {
          category_id: string
          created_at?: string | null
          supplement_name: string
          user_id: string
        }
        Update: {
          category_id?: string
          created_at?: string | null
          supplement_name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "supplement_category_mappings_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "supplement_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      supplement_community_insights: {
        Row: {
          content: string
          created_at: string | null
          downvotes: number | null
          id: string
          insight_type: string
          is_expert: boolean | null
          research_url: string | null
          supplement_name: string
          updated_at: string | null
          upvotes: number | null
        }
        Insert: {
          content: string
          created_at?: string | null
          downvotes?: number | null
          id?: string
          insight_type: string
          is_expert?: boolean | null
          research_url?: string | null
          supplement_name: string
          updated_at?: string | null
          upvotes?: number | null
        }
        Update: {
          content?: string
          created_at?: string | null
          downvotes?: number | null
          id?: string
          insight_type?: string
          is_expert?: boolean | null
          research_url?: string | null
          supplement_name?: string
          updated_at?: string | null
          upvotes?: number | null
        }
        Relationships: []
      }
      supplement_correlations: {
        Row: {
          analysis_period_days: number | null
          correlation_score: number | null
          correlation_type: string
          created_at: string | null
          id: string
          supplement_name: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          analysis_period_days?: number | null
          correlation_score?: number | null
          correlation_type: string
          created_at?: string | null
          id?: string
          supplement_name: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          analysis_period_days?: number | null
          correlation_score?: number | null
          correlation_type?: string
          created_at?: string | null
          id?: string
          supplement_name?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      supplement_inventory: {
        Row: {
          created_at: string | null
          id: string
          quantity: number
          reorder_threshold: number | null
          supplement_name: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          quantity?: number
          reorder_threshold?: number | null
          supplement_name: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          quantity?: number
          reorder_threshold?: number | null
          supplement_name?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      supplement_logs: {
        Row: {
          barcode: string | null
          batch_number: string | null
          brand: string | null
          contraindications: string | null
          cost: number | null
          created_at: string | null
          dosage: string
          effectiveness_rating: number | null
          energy_impact: number | null
          expiration_date: string | null
          focus_impact: number | null
          form: string | null
          id: string
          interaction_notes: string | null
          lab_results: Json | null
          mood_impact: number | null
          notes: string | null
          photo_url: string | null
          purchase_location: string | null
          recommended_timing: string[] | null
          reminder_enabled: boolean | null
          reminder_time: string | null
          side_effects: string | null
          sleep_impact: number | null
          source: string | null
          storage_conditions: string | null
          stress_impact: number | null
          supplement_name: string
          time_taken: string
          timing_notes: string | null
          user_id: string | null
          verified_purchase: boolean | null
        }
        Insert: {
          barcode?: string | null
          batch_number?: string | null
          brand?: string | null
          contraindications?: string | null
          cost?: number | null
          created_at?: string | null
          dosage: string
          effectiveness_rating?: number | null
          energy_impact?: number | null
          expiration_date?: string | null
          focus_impact?: number | null
          form?: string | null
          id?: string
          interaction_notes?: string | null
          lab_results?: Json | null
          mood_impact?: number | null
          notes?: string | null
          photo_url?: string | null
          purchase_location?: string | null
          recommended_timing?: string[] | null
          reminder_enabled?: boolean | null
          reminder_time?: string | null
          side_effects?: string | null
          sleep_impact?: number | null
          source?: string | null
          storage_conditions?: string | null
          stress_impact?: number | null
          supplement_name: string
          time_taken: string
          timing_notes?: string | null
          user_id?: string | null
          verified_purchase?: boolean | null
        }
        Update: {
          barcode?: string | null
          batch_number?: string | null
          brand?: string | null
          contraindications?: string | null
          cost?: number | null
          created_at?: string | null
          dosage?: string
          effectiveness_rating?: number | null
          energy_impact?: number | null
          expiration_date?: string | null
          focus_impact?: number | null
          form?: string | null
          id?: string
          interaction_notes?: string | null
          lab_results?: Json | null
          mood_impact?: number | null
          notes?: string | null
          photo_url?: string | null
          purchase_location?: string | null
          recommended_timing?: string[] | null
          reminder_enabled?: boolean | null
          reminder_time?: string | null
          side_effects?: string | null
          sleep_impact?: number | null
          source?: string | null
          storage_conditions?: string | null
          stress_impact?: number | null
          supplement_name?: string
          time_taken?: string
          timing_notes?: string | null
          user_id?: string | null
          verified_purchase?: boolean | null
        }
        Relationships: []
      }
      supplement_stacks: {
        Row: {
          created_at: string | null
          id: string
          name: string
          supplements: string[]
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          supplements: string[]
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          supplements?: string[]
          updated_at?: string | null
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
      survey_responses: {
        Row: {
          completed_at: string | null
          created_at: string | null
          id: string
          participant_id: string
          responses: Json
          survey_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          participant_id: string
          responses: Json
          survey_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          participant_id?: string
          responses?: Json
          survey_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "survey_responses_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "surveys"
            referencedColumns: ["id"]
          },
        ]
      }
      survey_templates: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          questions: Json
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          questions?: Json
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          questions?: Json
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      surveys: {
        Row: {
          created_at: string | null
          description: string | null
          end_date: string | null
          frequency: string | null
          id: string
          is_active: boolean | null
          questions: Json
          schedule_type: string
          start_date: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          frequency?: string | null
          id?: string
          is_active?: boolean | null
          questions?: Json
          schedule_type?: string
          start_date?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          frequency?: string | null
          id?: string
          is_active?: boolean | null
          questions?: Json
          schedule_type?: string
          start_date?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
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
      task_prioritization: {
        Row: {
          created_at: string | null
          energy_required: number | null
          id: string
          importance_level: number
          quadrant: number
          task_id: string
          updated_at: string | null
          urgency_level: number
        }
        Insert: {
          created_at?: string | null
          energy_required?: number | null
          id?: string
          importance_level: number
          quadrant: number
          task_id: string
          updated_at?: string | null
          urgency_level: number
        }
        Update: {
          created_at?: string | null
          energy_required?: number | null
          id?: string
          importance_level?: number
          quadrant?: number
          task_id?: string
          updated_at?: string | null
          urgency_level?: number
        }
        Relationships: [
          {
            foreignKeyName: "task_prioritization_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          status: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          status?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          status?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      topics: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      tree_testing_responses: {
        Row: {
          completion_time: number | null
          created_at: string | null
          id: string
          participant_id: string | null
          study_id: string | null
          success_rate: number | null
          task_responses: Json
        }
        Insert: {
          completion_time?: number | null
          created_at?: string | null
          id?: string
          participant_id?: string | null
          study_id?: string | null
          success_rate?: number | null
          task_responses: Json
        }
        Update: {
          completion_time?: number | null
          created_at?: string | null
          id?: string
          participant_id?: string | null
          study_id?: string | null
          success_rate?: number | null
          task_responses?: Json
        }
        Relationships: [
          {
            foreignKeyName: "tree_testing_responses_study_id_fkey"
            columns: ["study_id"]
            isOneToOne: false
            referencedRelation: "tree_testing_studies"
            referencedColumns: ["id"]
          },
        ]
      }
      tree_testing_studies: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          instructions: string | null
          tasks: Json | null
          title: string
          tree_structure: Json | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          instructions?: string | null
          tasks?: Json | null
          title: string
          tree_structure?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          instructions?: string | null
          tasks?: Json | null
          title?: string
          tree_structure?: Json | null
          updated_at?: string | null
          user_id?: string | null
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
      usability_test_sessions: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          recording_enabled: boolean | null
          scenario: string | null
          screen_recording_enabled: boolean | null
          tasks: Json | null
          test_type: string
          think_aloud_enabled: boolean | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          recording_enabled?: boolean | null
          scenario?: string | null
          screen_recording_enabled?: boolean | null
          tasks?: Json | null
          test_type: string
          think_aloud_enabled?: boolean | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          recording_enabled?: boolean | null
          scenario?: string | null
          screen_recording_enabled?: boolean | null
          tasks?: Json | null
          test_type?: string
          think_aloud_enabled?: boolean | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_devices: {
        Row: {
          created_at: string | null
          device_token: string
          id: string
          last_seen: string | null
          platform: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          device_token: string
          id?: string
          last_seen?: string | null
          platform: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          device_token?: string
          id?: string
          last_seen?: string | null
          platform?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_follows: {
        Row: {
          created_at: string | null
          follower_id: string | null
          following_id: string | null
          id: string
        }
        Insert: {
          created_at?: string | null
          follower_id?: string | null
          following_id?: string | null
          id?: string
        }
        Update: {
          created_at?: string | null
          follower_id?: string | null
          following_id?: string | null
          id?: string
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
      user_preferences: {
        Row: {
          created_at: string | null
          id: string
          interaction_history: Json | null
          preferred_categories: string[] | null
          preferred_product_types: string[] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          interaction_history?: Json | null
          preferred_categories?: string[] | null
          preferred_product_types?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          interaction_history?: Json | null
          preferred_categories?: string[] | null
          preferred_product_types?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
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
      user_subscriptions: {
        Row: {
          created_at: string | null
          ends_at: string | null
          id: string
          starts_at: string
          tier: Database["public"]["Enums"]["subscription_tier"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          ends_at?: string | null
          id?: string
          starts_at?: string
          tier?: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          ends_at?: string | null
          id?: string
          starts_at?: string
          tier?: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string | null
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
      verification_requests: {
        Row: {
          created_at: string | null
          id: string
          reason: string
          reviewed_at: string | null
          reviewer_notes: string | null
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          reason: string
          reviewed_at?: string | null
          reviewer_notes?: string | null
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          reason?: string
          reviewed_at?: string | null
          reviewer_notes?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      visual_organization_tools: {
        Row: {
          color_scheme: string[] | null
          content: Json | null
          created_at: string | null
          id: string
          layout_preferences: Json | null
          tool_type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          color_scheme?: string[] | null
          content?: Json | null
          created_at?: string | null
          id?: string
          layout_preferences?: Json | null
          tool_type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          color_scheme?: string[] | null
          content?: Json | null
          created_at?: string | null
          id?: string
          layout_preferences?: Json | null
          tool_type?: string
          updated_at?: string | null
          user_id?: string
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
      increment_comment_downvotes: {
        Args: {
          comment_id: string
        }
        Returns: undefined
      }
      increment_comment_upvotes: {
        Args: {
          comment_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      activity_impact: "positive" | "negative" | "neutral"
      app_role: "admin" | "user"
      cbt_exercise_type:
        | "thought_record"
        | "behavioral_activation"
        | "cognitive_restructuring"
        | "problem_solving"
        | "relaxation"
      discussion_status: "open" | "closed" | "archived"
      distraction_type: "app" | "website" | "notification" | "social_media"
      exercise_type:
        | "walking"
        | "running"
        | "cycling"
        | "hiking"
        | "yoga"
        | "stretching"
        | "desk_exercise"
        | "eye_exercise"
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
        | "pattern_recognition"
        | "brain_match"
        | "n_back"
        | "stroop_test"
        | "digit_span"
        | "mental_rotation"
        | "word_pairs"
        | "reaction_time"
        | "dual_n_back"
      gratitude_category:
        | "people"
        | "experiences"
        | "things"
        | "personal_growth"
        | "nature"
        | "other"
      health_condition:
        | "adhd"
        | "chronic_fatigue"
        | "multiple_sclerosis"
        | "other_fatigue"
        | "other_focus_issue"
        | "short_term_memory"
        | "long_term_memory"
        | "migraine"
      mood_category: "positive" | "negative" | "neutral"
      quit_strategy_type:
        | "cold_turkey"
        | "taper_down"
        | "nrt_assisted"
        | "harm_reduction"
      reproductive_exercise_type:
        | "kegel_basic"
        | "kegel_advanced"
        | "pelvic_floor"
        | "core_strength"
        | "hip_mobility"
        | "breathing"
        | "relaxation"
      research_type:
        | "survey"
        | "clinical_trial"
        | "remote_trial"
        | "experience_sampling"
        | "longitudinal"
        | "ema"
        | "mhealth"
        | "remote_monitoring"
        | "digital_therapeutics"
        | "market_research"
        | "behavioral"
        | "biomedical"
      review_type: "product" | "alternative" | "experience"
      risk_level: "low" | "medium" | "high"
      smoking_log_type: "cigarette" | "cigar" | "vape" | "pouch" | "gum"
      strength_level: "light" | "medium" | "strong" | "extra_strong"
      subscription_tier: "free" | "premium"
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
