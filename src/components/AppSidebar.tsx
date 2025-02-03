import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Brain,
  Moon,
  Focus,
  Wind,
  Coffee,
  ShieldBan,
  Utensils,
  Activity,
} from "lucide-react";

const links = [
  {
    to: "/dashboard",
    icon: Activity,
    label: "Dashboard",
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
    label: "Food",
  },
  {
    to: "/distraction-blocker",
    icon: ShieldBan,
    label: "Distraction Blocker",
  },
];

export const AppSidebar = () => {
  const location = useLocation();

  return (
    <div className="pb-12 w-full">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-all",
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
      </div>
    </div>
  );
};