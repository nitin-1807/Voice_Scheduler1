import { Calendar, CheckSquare, Clock, Settings } from "lucide-react";
import { Link, useLocation } from "wouter";

const navItems = [
  { path: "/", icon: Calendar, label: "Today" },
  { path: "/tasks", icon: CheckSquare, label: "Tasks" },
  { path: "/schedule", icon: Clock, label: "Schedule" },
  { path: "/settings", icon: Settings, label: "Settings" },
];

export function BottomNav() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-card-border z-40 pb-safe">
      <div className="flex h-full items-center justify-around px-2">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location === path;
          return (
            <Link
              key={path}
              href={path}
              data-testid={`nav-${label.toLowerCase()}`}
              className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-md transition-colors min-h-[44px] min-w-[44px] hover-elevate relative ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "fill-current" : ""}`} />
              <span className="text-xs font-medium">{label}</span>
              {isActive && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
