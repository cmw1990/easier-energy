
export type PlanType = 
  | 'energizing_boost' 
  | 'sustained_focus'
  | 'mental_clarity'
  | 'physical_vitality'
  | 'deep_relaxation'
  | 'stress_relief'
  | 'evening_winddown'
  | 'sleep_preparation'
  | 'meditation'

export type PlanVisibility = 'private' | 'public' | 'shared'
export type PlanCategory = 'charged' | 'recharged'

export interface PlanComponent {
  id: string
  component_type: string
  order_number: number
  duration_minutes: number | null
  step_number?: number
  completion_criteria?: any
  settings?: any
  notes?: string
}

export interface Plan {
  id: string
  created_at: string
  updated_at: string
  created_by: string
  title: string
  description: string | null
  plan_type: PlanType
  category: PlanCategory
  visibility: PlanVisibility
  is_expert_plan: boolean
  tags: string[]
  likes_count: number
  saves_count: number
  estimated_duration_minutes?: number
  energy_level_required?: number
  recommended_time_of_day?: string[]
  suitable_contexts?: string[]
  energy_plan_components: PlanComponent[]
}

export interface PlanReview {
  id: string
  created_at: string
  updated_at: string
  user_id: string
  plan_id: string
  rating: number
  review_text?: string
}

export interface ProgressRecord {
  id: string
  user_id: string
  plan_id: string
  component_id: string
  completed_at: string | null
}
