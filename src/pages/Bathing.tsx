
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bath, Drop, Heart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/AuthProvider"
import { supabase } from "@/integrations/supabase/client"
import { MoodDisplay } from "@/components/meditation/MoodDisplay"

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

      {logState.isTracking ? (
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Drop className="h-5 w-5 text-blue-500" />
              Active Session
            </CardTitle>
            <CardDescription>
              Track your mood and energy levels
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <MoodDisplay 
              mood={{
                mood_score: logState.moodBefore,
                energy_level: logState.energyBefore / 10,
              }}
            />
            <Button 
              className="w-full"
              onClick={() => endRoutine(7, 8)} // For demo, using fixed values
            >
              End Session
            </Button>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {routines.map((routine) => (
          <Card key={routine.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bath className="h-5 w-5 text-blue-500" />
                {routine.name}
              </CardTitle>
              <CardDescription>{routine.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Steps:</h4>
                <ul className="list-disc pl-4 space-y-1">
                  {routine.steps.map((step, index) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-wrap gap-2">
                {routine.mood_tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <Button
                className="w-full"
                onClick={() => startRoutine(routine)}
              >
                Start Routine
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
