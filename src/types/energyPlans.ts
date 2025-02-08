
export type PlanType = 
  | 'mental_clarity'
  | 'deep_relaxation'
  | 'stress_relief'
  | 'meditation'
  | 'energizing_boost'
  | 'sustained_focus'
  | 'physical_vitality'
  | 'evening_winddown'
  | 'sleep_preparation'

export type PlanVisibility = 'private' | 'public' | 'shared'
export type PlanCategory = 'charged' | 'recharged'
export type LifeSituation = 'regular' | 'pregnancy' | 'postpartum' | 'breastfeeding'

export interface CycleAdjustment {
  energyLevelModifier: number
  durationModifier: number
  intensityModifier: number
  recommendedTimeOfDay?: string[]
  cyclePhaseTips?: string[]
}

export interface BiometricData {
  cyclePhase?: string;
  energyLevel?: number;
  stressLevel?: number;
  sleepQuality?: number;
  symptoms?: string[];
  mood?: string;
}

export interface PlanComponent {
  id: string
  component_type: string
  order_number: number 
  duration_minutes: number | null
  step_number?: number
  completion_criteria?: any
  settings?: any
  notes?: string
  cycleAdjustments?: Record<string, CycleAdjustment>
  requiredBiometrics?: BiometricData
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
  energy_level_required?: number
  recommended_time_of_day?: string[]
  suitable_contexts?: string[]
  estimated_duration_minutes?: number
  hormonalPhaseAdjustments?: Record<string, CycleAdjustment>
  lifeSituationAdjustments?: Record<LifeSituation, {
    energyLevelModifier: number
    durationModifier: number
    intensityModifier: number
    recommendedTimeOfDay?: string[]
    contraindications?: string[]
    specialInstructions?: string
  }>
}
