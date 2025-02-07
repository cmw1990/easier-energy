
import { supabase } from "@/integrations/supabase/client"

export interface ToolAnalyticsData {
  toolName: string
  sessionDuration: number
  toolSettings?: Record<string, any>
}

export const trackToolUsage = async (data: ToolAnalyticsData) => {
  try {
    const { error } = await supabase.from("tool_usage_logs").insert({
      tool_name: data.toolName,
      session_duration: data.sessionDuration,
      tool_settings: data.toolSettings
    })
    
    if (error) {
      console.error("Error tracking tool usage:", error)
    }
  } catch (e) {
    console.error("Error in trackToolUsage:", e)
  }
}
