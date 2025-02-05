import { supabase } from '@/integrations/supabase/client';

export interface AudioTrack {
  id: string;
  title: string;
  description?: string;
  audio_url: string;
  duration_seconds: number;
  category: string;
  tags?: string[];
}

export const AudioService = {
  async getMeditationAudio(): Promise<AudioTrack[]> {
    const { data, error } = await supabase
      .from('meditation_audio')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getFocusMusic(): Promise<AudioTrack[]> {
    const { data, error } = await supabase
      .from('focus_music')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getMeditationAudioByCategory(category: string): Promise<AudioTrack[]> {
    const { data, error } = await supabase
      .from('meditation_audio')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getFocusMusicByCategory(category: string): Promise<AudioTrack[]> {
    const { data, error } = await supabase
      .from('focus_music')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
};