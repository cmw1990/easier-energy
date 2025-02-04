import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Moon,
  Brain,
  Wind,
  Coffee,
  Eye,
  Flower2,
  Sparkles,
  Dumbbell,
  Pill,
  Cigarette,
  Utensils,
  Heart,
} from "lucide-react";

const toolbarItems = [
  {
    to: "/dashboard",
    icon: BarChart3,
    label: "Stats",
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
    label: "Zen",
    iconClassName: "text-pink-500",
  },
  {
    to: "/focus",
    icon: Brain,
    label: "Mind",
    iconClassName: "text-amber-500",
  },
  {
    to: "/meditation",
    icon: Sparkles,
    label: "Peace",
    iconClassName: "text-purple-500",
  },
  {
    to: "/exercise",
    icon: Dumbbell,
    label: "Move",
    iconClassName: "text-red-500",
  },
  {
    to: "/eye-exercises",
    icon: Eye,
    label: "Eye",
    iconClassName: "text-sky-500",
  },
  {
    to: "/breathing",
    icon: Wind,
    label: "Air",
    iconClassName: "text-teal-500",
  },
  {
    to: "/caffeine",
    icon: Coffee,
    label: "Boost",
    iconClassName: "text-orange-500",
  },
  {
    to: "/nicotine",
    icon: Cigarette,
    label: "Quit",
    iconClassName: "text-zinc-500",
  },
  {
    to: "/supplements",
    icon: Pill,
    label: "Pills",
    iconClassName: "text-blue-500",
  },
  {
    to: "/food",
    icon: Utensils,
    label: "Food",
    iconClassName: "text-lime-500",
  },
  {
    to: "/sobriety",
    icon: Heart,
    label: "Life",
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
              "flex flex-col items-center gap-1.5 py-3 px-3 rounded-xl transition-all",
              "hover:bg-accent/20 hover:scale-105 hover:shadow-lg",
              location.pathname === item.to
                ? "bg-accent/25 shadow-md ring-1 ring-accent/10"
                : "bg-accent/10",
            )}
          >
            <div
              className={cn(
                "p-2.5 rounded-xl transition-colors",
                location.pathname === item.to
                  ? "bg-background shadow-md ring-1 ring-accent/20"
                  : "bg-background/80",
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5 transition-colors",
                  item.iconClassName,
                  location.pathname === item.to
                    ? "opacity-100"
                    : "opacity-80"
                )}
              />
            </div>
            <span
              className={cn(
                "text-xs font-medium transition-colors tracking-wide",
                location.pathname === item.to
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};