import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Activity,
  Brain,
  Moon,
  Focus,
  Wind,
  Coffee,
  ShieldBan,
  Utensils,
  BarChart3,
  Crown,
  CircleDot,
  Grid3X3,
  Gamepad2,
  Flower2,
  Sparkles,
  Dumbbell,
  Pill,
  Cigarette,
  Heart,
  Eye,
} from "lucide-react";

const toolbarItems = [
  {
    to: "/dashboard",
    icon: Activity,
    label: "Overview",
  },
  {
    to: "/sleep",
    icon: Moon,
    label: "Sleep",
  },
  {
    to: "/relax",
    icon: Flower2,
    label: "Relax",
  },
  {
    to: "/focus",
    icon: Focus,
    label: "Focus",
  },
  {
    to: "/meditation",
    icon: Sparkles,
    label: "Meditation",
  },
  {
    to: "/exercise",
    icon: Dumbbell,
    label: "Exercise",
  },
  {
    to: "/eye-exercises",
    icon: Eye,
    label: "Eye Care",
  },
  {
    to: "/breathing",
    icon: Wind,
    label: "Breathing",
  },
  {
    to: "/caffeine",
    icon: Coffee,
    label: "Caffeine",
  },
  {
    to: "/nicotine",
    icon: Cigarette,
    label: "Nicotine",
  },
  {
    to: "/supplements",
    icon: Pill,
    label: "Supplements",
  },
  {
    to: "/food",
    icon: Utensils,
    label: "Nutrition",
  },
  {
    to: "/sobriety",
    icon: Heart,
    label: "Sobriety",
  },
];

export const Toolbar = () => {
  const location = useLocation();

  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-4 px-4 overflow-x-auto">
        {toolbarItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              "flex items-center gap-2 py-4 text-sm font-medium transition-colors hover:text-primary",
              location.pathname === item.to
                ? "box-border border-b-2 border-primary text-primary"
                : "text-muted-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            <span className="hidden sm:inline">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};