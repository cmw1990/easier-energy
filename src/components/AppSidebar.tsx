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
  King,
  CircleDot,
  Grid3X3,
  Gamepad2,
} from "lucide-react";

const navigationGroups = [
  {
    label: "Core Energy",
    links: [
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
        to: "/focus",
        icon: Focus,
        label: "Focus",
      },
    ]
  },
  {
    label: "Support Tools",
    links: [
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
        to: "/food",
        icon: Utensils,
        label: "Nutrition",
      },
    ]
  },
  {
    label: "Productivity",
    links: [
      {
        to: "/distraction-blocker",
        icon: ShieldBan,
        label: "Focus Shield",
      },
      {
        to: "/analytics",
        icon: BarChart3,
        label: "Analytics",
      },
    ]
  },
  {
    label: "Board Games",
    links: [
      {
        to: "/games/chess",
        icon: King,
        label: "Chess",
      },
      {
        to: "/games/go",
        icon: CircleDot,
        label: "Go",
      },
      {
        to: "/games/checkers",
        icon: Grid3X3,
        label: "Checkers",
      },
      {
        to: "/games/reversi",
        icon: Gamepad2,
        label: "Reversi",
      },
    ]
  }
];

export const AppSidebar = () => {
  const location = useLocation();

  return (
    <div className="pb-12 w-full">
      <div className="space-y-6 py-4">
        {navigationGroups.map((group, index) => (
          <div key={index} className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-primary">
              {group.label}
            </h2>
            <div className="space-y-1">
              {group.links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={cn(
                    "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground",
                    location.pathname === link.to
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  <link.icon className="mr-2 h-4 w-4" />
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};