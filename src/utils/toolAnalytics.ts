
import { supabase } from "@/integrations/supabase/client"

export interface ToolAnalyticsData {
  tool_name: string
  tool_type: string
  session_duration: number
  settings?: Record<string, any>
}

export const trackToolUsage = async (data: ToolAnalyticsData) => {
  try {
    const { error } = await supabase.from("tool_usage_logs").insert({
      tool_name: data.tool_name,
      tool_type: data.tool_type,
      session_duration: data.session_duration,
      settings: data.settings
    })
    
    if (error) {
      console.error("Error tracking tool usage:", error)
    }
  } catch (e) {
    console.error("Error in trackToolUsage:", e)
  }
}
