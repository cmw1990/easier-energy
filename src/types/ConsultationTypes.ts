
export interface ConsultationSession {
  id: string;
  client_id: string;
  professional_id: string;
  session_type: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  scheduled_start: string;
  scheduled_end: string;
  actual_start?: string;
  actual_end?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  professional?: {
    full_name: string;
  };
}

export interface ConsultationPackage {
  id: string;
  professional_id: string;
  name: string;
  description: string;
  session_count: number;
  validity_days: number;
  price: number;
  features: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PackagePurchase {
  id: string;
  package_id: string;
  client_id: string;
  professional_id: string;
  sessions_remaining: number;
  expires_at: string;
  total_amount: number;
  status: 'active' | 'expired' | 'cancelled';
  created_at: string;
  package?: ConsultationPackage;
  professional?: {
    full_name: string;
  };
}

export interface ClientProgressTracking {
  id: string;
  client_id: string;
  professional_id: string;
  session_id: string;
  progress_rating: number;
  notes: string;
  homework: string;
  next_steps: string;
  created_at: string;
  updated_at: string;
}

export interface ConsultationMessage {
  id: string;
  session_id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  message_type: 'text' | 'file' | 'image';
  file_url?: string;
  created_at: string;
  sender?: {
    full_name: string;
    avatar_url?: string;
  };
  receiver?: {
    full_name: string;
    avatar_url?: string;
  };
}

export interface ConsultationNote {
  id: string;
  session_id: string;
  professional_id: string;
  client_id: string;
  content: string;
  progress_notes?: string;
  follow_up_date?: string;
  recommendations?: Record<string, any>;
  mood_observed?: string;
  created_at: string;
}

export interface CustomerBehavior {
  id: string;
  vendor_id: string;
  behavior_patterns: {
    active_users: number;
    engagement_rate: number;
    response_rate: number;
    segments: Array<{
      name: string;
      value: number;
    }>;
  };
  customer_segments: {
    new: number;
    returning: number;
    inactive: number;
  };
  revenue_trends: {
    daily: Array<{date: string; revenue: number}>;
    weekly: Array<{week: string; revenue: number}>;
    monthly: Array<{month: string; revenue: number}>;
  };
  engagement_metrics: Record<string, any>;
  purchase_predictions: Record<string, any>;
  created_at: string;
}
