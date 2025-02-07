
import { useEffect, useState } from "react"
import { trackToolUsage } from "@/utils/toolAnalytics"

interface ToolAnalyticsWrapperProps {
  toolName: string
  toolSettings?: Record<string, any>
  children: React.ReactNode
}

export function ToolAnalyticsWrapper({ toolName, toolSettings, children }: ToolAnalyticsWrapperProps) {
  const [startTime] = useState<number>(Date.now())

  useEffect(() => {
    return () => {
      const sessionDuration = Math.round((Date.now() - startTime) / 1000)
      if (sessionDuration >= 5) { // Only track sessions longer than 5 seconds
        trackToolUsage({
          toolName,
          sessionDuration,
          toolSettings
        })
      }
    }
  }, [toolName, toolSettings, startTime])

  return <>{children}</>
}
