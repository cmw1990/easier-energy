
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/AuthProvider"
import { supabase } from "@/integrations/supabase/client"
import { BathingRoutineCard } from "@/components/bathing/BathingRoutineCard"
import { ActiveSessionCard } from "@/components/bathing/ActiveSessionCard"

interface BathingRoutine {
  id: string
  name: string
  description: string | null
  duration_minutes: number
  water_temperature: string
  steps: string[]
  benefits: string[]
  mood_tags: string[]
  scientific_sources: string[] | null
}

interface RoutineLogState {
  routineId: string | null
  moodBefore: number
  energyBefore: number
  isTracking: boolean
  startTime: Date | null
}

export default function Bathing() {
  const { session } = useAuth()
  const { toast } = useToast()
  const [routines, setRoutines] = useState<BathingRoutine[]>([])
  const [logState, setLogState] = useState<RoutineLogState>({
    routineId: null,
    moodBefore: 5,
    energyBefore: 5,
    isTracking: false,
    startTime: null,
  })

  useEffect(() => {
    loadRoutines()
  }, [])

  const loadRoutines = async () => {
    try {
      const { data, error } = await supabase
        .from("bathing_routines")
        .select("*")
      
      if (error) throw error
      setRoutines(data || [])
    } catch (error) {
      console.error("Error loading routines:", error)
      toast({
        title: "Error",
        description: "Failed to load bathing routines",
        variant: "destructive",
      })
    }
  }

  const startRoutine = async (routine: BathingRoutine) => {
    if (!session) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to track your bathing sessions",
        variant: "destructive",
      })
      return
    }

    setLogState({
      routineId: routine.id,
      moodBefore: 5,
      energyBefore: 5,
      isTracking: true,
      startTime: new Date(),
    })

    toast({
      title: "Session Started",
      description: "Enjoy your " + routine.name.toLowerCase(),
    })
  }

  const endRoutine = async (moodAfter: number, energyAfter: number) => {
    if (!session || !logState.startTime || !logState.routineId) return

    try {
      const duration = Math.round((new Date().getTime() - logState.startTime.getTime()) / 60000)

      const { error } = await supabase
        .from("user_bathing_logs")
        .insert({
          user_id: session.user.id,
          routine_id: logState.routineId,
          mood_before: logState.moodBefore,
          mood_after: moodAfter,
          energy_level_before: logState.energyBefore,
          energy_level_after: energyAfter,
          duration_minutes: duration,
        })

      if (error) throw error

      toast({
        title: "Session Logged",
        description: "Your bathing session has been recorded",
      })

      setLogState({
        routineId: null,
        moodBefore: 5,
        energyBefore: 5,
        isTracking: false,
        startTime: null,
      })
    } catch (error) {
      console.error("Error logging session:", error)
      toast({
        title: "Error",
        description: "Failed to log your session",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Bathing & Showering Guide</h1>
        <p className="text-muted-foreground">
          Science-based routines to enhance your mood, energy, and wellness through the power of water therapy
        </p>
      </div>

      {logState.isTracking && (
        <ActiveSessionCard
          moodBefore={logState.moodBefore}
          energyBefore={logState.energyBefore}
          onEndSession={endRoutine}
        />
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {routines.map((routine) => (
          <BathingRoutineCard
            key={routine.id}
            routine={routine}
            onStartRoutine={startRoutine}
          />
        ))}
      </div>
    </div>
  )
}
