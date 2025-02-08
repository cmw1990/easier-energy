
import { Button } from "@/components/ui/button"
import { Moon, Zap } from "lucide-react"
import type { PlanCategory } from "@/types/energyPlans"

interface PlanFiltersProps {
  selectedCategory: PlanCategory | null
  onCategoryChange: (category: PlanCategory | null) => void
}

export const PlanFilters = ({ selectedCategory, onCategoryChange }: PlanFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="text-sm font-medium mb-2 sm:mb-0 sm:mr-4">Filter by Category:</div>
      <div className="flex gap-2">
        <Button
          variant={selectedCategory === 'charged' ? 'default' : 'outline'} 
          onClick={() => onCategoryChange(selectedCategory === 'charged' ? null : 'charged')}
          className="flex-1 sm:flex-none min-w-[120px]"
        >
          <Zap className="h-4 w-4 mr-2" />
          <span>Charged</span>
          {selectedCategory === 'charged' && (
            <span className="ml-2 text-xs bg-white/20 px-1.5 py-0.5 rounded">Active</span>
          )}
        </Button>
        <Button
          variant={selectedCategory === 'recharged' ? 'default' : 'outline'}
          onClick={() => onCategoryChange(selectedCategory === 'recharged' ? null : 'recharged')}
          className="flex-1 sm:flex-none min-w-[120px]"
        >
          <Moon className="h-4 w-4 mr-2" />
          <span>Recharged</span>
          {selectedCategory === 'recharged' && (
            <span className="ml-2 text-xs bg-white/20 px-1.5 py-0.5 rounded">Active</span>
          )}
        </Button>
      </div>
    </div>
  )
}
