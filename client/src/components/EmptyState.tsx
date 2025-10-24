import { ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onGetStarted?: () => void;
}

export function EmptyState({ onGetStarted }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-32 h-32 mb-6 rounded-full bg-muted flex items-center justify-center">
        <ListChecks className="w-16 h-16 text-muted-foreground" />
      </div>
      <h2 className="text-3xl font-semibold text-foreground mb-2">
        No tasks yet
      </h2>
      <p className="text-muted-foreground max-w-sm mb-6">
        Tap the mic button to create your first task using voice or add one manually
      </p>
      {onGetStarted && (
        <Button onClick={onGetStarted} data-testid="button-get-started">
          Get Started
        </Button>
      )}
    </div>
  );
}
