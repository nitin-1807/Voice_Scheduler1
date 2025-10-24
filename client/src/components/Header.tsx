import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useState, useEffect } from "react";

interface HeaderProps {
  onNotificationClick?: () => void;
  notificationCount?: number;
}

export function Header({ onNotificationClick, notificationCount = 0 }: HeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-16 border-b border-border bg-background sticky top-0 z-30">
      <div className="flex items-center justify-between h-full px-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">mypa</h1>
          <p className="text-sm text-muted-foreground">
            {format(currentTime, "EEEE, MMM d")}
          </p>
        </div>
        <Button
          size="icon"
          variant="ghost"
          onClick={onNotificationClick}
          data-testid="button-notifications"
          className="relative"
        >
          <Bell className="w-5 h-5" />
          {notificationCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
          )}
        </Button>
      </div>
    </header>
  );
}
