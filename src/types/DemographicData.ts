
export interface DemographicData {
  id: string;
  age_range: string;  // Changed from age_group to match database
  gender: string;
  location: string;
  count: number;
  created_at: string;
  impression_id?: string;
}
