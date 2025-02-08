
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
