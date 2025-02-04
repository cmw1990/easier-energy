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
    iconClassName: "text-emerald-500",
  },
  {
    to: "/sleep",
    icon: Moon,
    label: "Sleep",
    iconClassName: "text-indigo-500",
  },
  {
    to: "/relax",
    icon: Flower2,
    label: "Relax",
    iconClassName: "text-pink-500",
  },
  {
    to: "/focus",
    icon: Focus,
    label: "Focus",
    iconClassName: "text-amber-500",
  },
  {
    to: "/meditation",
    icon: Sparkles,
    label: "Meditation",
    iconClassName: "text-purple-500",
  },
  {
    to: "/exercise",
    icon: Dumbbell,
    label: "Exercise",
    iconClassName: "text-red-500",
  },
  {
    to: "/eye-exercises",
    icon: Eye,
    label: "Eye Care",
    iconClassName: "text-sky-500",
  },
  {
    to: "/breathing",
    icon: Wind,
    label: "Breathing",
    iconClassName: "text-teal-500",
  },
  {
    to: "/caffeine",
    icon: Coffee,
    label: "Caffeine",
    iconClassName: "text-orange-500",
  },
  {
    to: "/nicotine",
    icon: Cigarette,
    label: "Nicotine",
    iconClassName: "text-zinc-500",
  },
  {
    to: "/supplements",
    icon: Pill,
    label: "Supplements",
    iconClassName: "text-blue-500",
  },
  {
    to: "/food",
    icon: Utensils,
    label: "Nutrition",
    iconClassName: "text-lime-500",
  },
  {
    to: "/sobriety",
    icon: Heart,
    label: "Sobriety",
    iconClassName: "text-rose-500",
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
            <item.icon className={cn("h-4 w-4", item.iconClassName)} />
            <span className="hidden sm:inline">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};