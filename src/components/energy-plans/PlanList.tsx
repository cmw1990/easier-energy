
import { Plan, ProgressRecord } from "@/types/energyPlans"
import { PlanCard } from "./PlanCard"

interface PlanListProps {
  plans?: Plan[]
  progress?: ProgressRecord[]
  isLoading?: boolean
  onSavePlan?: (planId: string) => void
  onSharePlan?: (plan: Plan) => void
  savedPlans?: Plan[]
}

export const PlanList = ({ 
  plans,
  progress,
  isLoading,
  onSavePlan,
  onSharePlan,
  savedPlans
}: PlanListProps) => {
  if (isLoading) {
    return <div>Loading plans...</div>
  }

  if (!plans?.length) {
    return <div>No plans found</div>
  }

  return (
    <div className="space-y-4">
      {plans.map(plan => (
        <PlanCard
          key={plan.id}
          plan={plan}
          progress={progress}
          onSave={onSavePlan}
          onShare={onSharePlan}
          isSaved={savedPlans?.some(saved => saved.id === plan.id)}
        />
      ))}
    </div>
  )
}
