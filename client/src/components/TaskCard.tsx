import { Task } from "@shared/schema";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Clock } from "lucide-react";
import { format } from "date-fns";

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string, completed: boolean) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

const priorityColors = {
  low: "border-l-muted",
  medium: "border-l-primary",
  high: "border-l-destructive",
};

export function TaskCard({ task, onToggleComplete, onEdit, onDelete }: TaskCardProps) {
  return (
    <div
      className={`bg-card border border-card-border rounded-lg p-4 flex gap-3 items-start hover-elevate border-l-4 ${
        priorityColors[task.priority as keyof typeof priorityColors]
      } ${task.completed ? "opacity-60" : ""}`}
      data-testid={`card-task-${task.id}`}
    >
      <Checkbox
        checked={task.completed}
        onCheckedChange={(checked) =>
          onToggleComplete(task.id, checked as boolean)
        }
        className="mt-1"
        data-testid={`checkbox-task-${task.id}`}
      />

      <div className="flex-1 min-w-0">
        <h3
          className={`text-base font-medium text-foreground ${
            task.completed ? "line-through" : ""
          }`}
        >
          {task.title}
        </h3>
        {task.description && (
          <p className="text-sm text-muted-foreground mt-1">
            {task.description}
          </p>
        )}
        <div className="flex items-center gap-2 mt-2">
          {task.dueDate && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>{format(new Date(task.dueDate), "MMM d, h:mm a")}</span>
            </div>
          )}
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {task.priority}
          </span>
        </div>
      </div>

      <div className="flex gap-1">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => onEdit(task)}
          data-testid={`button-edit-${task.id}`}
          className="h-8 w-8"
        >
          <Pencil className="w-4 h-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={() => onDelete(task.id)}
          data-testid={`button-delete-${task.id}`}
          className="h-8 w-8 text-destructive hover:text-destructive"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
