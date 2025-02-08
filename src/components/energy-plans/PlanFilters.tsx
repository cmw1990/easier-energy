
import { Button } from "@/components/ui/button"
import { Moon, Zap } from "lucide-react"
import type { PlanCategory } from "@/types/energyPlans"

interface PlanFiltersProps {
  selectedCategory: PlanCategory | null
  onCategoryChange: (category: PlanCategory | null) => void
}

export const PlanFilters = ({ selectedCategory, onCategoryChange }: PlanFiltersProps) => {
  return (
    <div className="flex gap-2">
      <Button
        variant={selectedCategory === 'charged' ? 'default' : 'outline'}
        onClick={() => onCategoryChange(
          selectedCategory === 'charged' ? null : 'charged'
        )}
      >
        <Zap className="h-4 w-4 mr-2" />
        Charged
      </Button>
      <Button
        variant={selectedCategory === 'recharged' ? 'default' : 'outline'}
        onClick={() => onCategoryChange(
          selectedCategory === 'recharged' ? null : 'recharged'
        )}
      >
        <Moon className="h-4 w-4 mr-2" />
        Recharged
      </Button>
    </div>
  )
}
