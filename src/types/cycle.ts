
export interface CyclePhaseImpact {
  id: string;
  user_id: string;
  phase_type: string;
  date: string;
  energy_impact: number;
  focus_impact: number;
  sleep_impact: number;
  mood_impact: number;
  stress_impact: number;
  created_at: string;
  updated_at: string;
}

export interface CycleSymptomTemplate {
  id: string;
  name: string;
  category: string;
  phase_type: string;
  severity_scale: string[];
  suggested_remedies: string[];
  created_at: string;
}

export interface CyclePhaseRecommendation {
  id: string;
  phase_type: string;
  category: string;
  title: string;
  description: string;
  priority: number;
  tags: string[];
  created_at: string;
}

export interface CycleExerciseRecommendation {
  id: string;
  phase_type: string;
  exercise_type: string;
  intensity_level: string;
  description: string;
  benefits: string[];
  precautions: string[];
  created_at: string;
}

export interface CycleNutritionRecommendation {
  id: string;
  phase_type: string;
  food_category: string;
  food_items: string[];
  nutrients: string[];
  benefits: string;
  created_at: string;
}

export interface CycleMoodPattern {
  id: string;
  user_id: string;
  date: string;
  phase_type: string;
  mood_patterns: Record<string, any>;
  energy_patterns: Record<string, any>;
  sleep_patterns: Record<string, any>;
  created_at: string;
}

export interface CycleSymptomLog {
  id: string;
  user_id: string;
  date: string;
  symptoms: Record<string, any>;
  severity: string;
  remedies_tried: string[];
  effectiveness_rating: number;
  notes: string;
  created_at: string;
}

export interface CycleProductivityInsight {
  id: string;
  user_id: string;
  phase_type: string;
  date: string;
  focus_score: number;
  productivity_score: number;
  energy_level: number;
  task_completion_rate: number;
  optimal_work_hours: Record<string, any>;
  created_at: string;
}
