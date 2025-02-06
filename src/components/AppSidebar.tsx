
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
  Package,
  Heart,
  Eye,
  Wrench,
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
        to: "/nicotine",
        icon: Package,
        label: "Nicotine",
        iconClassName: "rounded-full p-0.5", // Add rounded styling to make it look like a pouch case
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
      // Development Tools link (only shown in dev mode)
      ...(import.meta.env.DEV ? [{
        to: "/development",
        icon: Wrench,
        label: "Development Tools",
      }] : []),
    ]
  },
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
                  <link.icon className={cn("mr-2 h-4 w-4", link.iconClassName)} />
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
