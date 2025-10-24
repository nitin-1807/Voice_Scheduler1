import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Task, InsertTask } from "@shared/schema";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { VoiceFAB } from "@/components/VoiceFAB";
import { VoiceModal } from "@/components/VoiceModal";
import { TaskCard } from "@/components/TaskCard";
import { TaskForm } from "@/components/TaskForm";
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format, startOfWeek, addDays, isSameDay, parseISO, startOfDay } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SchedulePage() {
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date()));
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { toast } = useToast();

  const {
    isListening,
    transcript,
    setTranscript,
    startListening,
    resetTranscript,
  } = useVoiceRecognition();

  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  const createTaskMutation = useMutation({
    mutationFn: async (data: InsertTask) => {
      return await apiRequest("POST", "/api/tasks", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({ title: "Task created successfully" });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Task> }) => {
      return await apiRequest("PATCH", `/api/tasks/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({ title: "Task updated successfully" });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/tasks/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({ title: "Task deleted" });
    },
  });

  const handleVoiceFABClick = () => {
    setIsVoiceModalOpen(true);
    startListening();
  };

  const handleVoiceSubmit = (text: string) => {
    const taskData: InsertTask = {
      title: text,
      priority: "medium",
      completed: false,
    };
    createTaskMutation.mutate(taskData);
    setIsVoiceModalOpen(false);
    resetTranscript();
  };

  const handleToggleComplete = (id: string, completed: boolean) => {
    updateTaskMutation.mutate({ id, data: { completed } });
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteTaskMutation.mutate(id);
  };

  const handleTaskFormSubmit = (data: InsertTask) => {
    if (editingTask) {
      updateTaskMutation.mutate({ id: editingTask.id, data });
    } else {
      createTaskMutation.mutate(data);
    }
    setIsTaskFormOpen(false);
    setEditingTask(null);
  };

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));

  const getTasksForDay = (day: Date) => {
    return tasks.filter((task) => {
      if (!task.dueDate) return false;
      return isSameDay(parseISO(task.dueDate.toString()), day);
    });
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header />

      <main className="flex-1 overflow-y-auto pb-20">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">
              {format(currentWeekStart, "MMM d")} - {format(addDays(currentWeekStart, 6), "MMM d, yyyy")}
            </h2>
            <div className="flex gap-2">
              <Button
                size="icon"
                variant="outline"
                onClick={() => setCurrentWeekStart(addDays(currentWeekStart, -7))}
                data-testid="button-prev-week"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentWeekStart(startOfWeek(new Date()))}
                data-testid="button-today"
              >
                Today
              </Button>
              <Button
                size="icon"
                variant="outline"
                onClick={() => setCurrentWeekStart(addDays(currentWeekStart, 7))}
                data-testid="button-next-week"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {weekDays.map((day) => {
              const dayTasks = getTasksForDay(day);
              const isToday = isSameDay(day, new Date());

              return (
                <div
                  key={day.toISOString()}
                  className={`border border-border rounded-lg p-4 min-h-[200px] ${
                    isToday ? "ring-2 ring-primary" : ""
                  }`}
                >
                  <div className="mb-3">
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">
                      {format(day, "EEE")}
                    </div>
                    <div className={`text-2xl font-semibold ${isToday ? "text-primary" : ""}`}>
                      {format(day, "d")}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {dayTasks.map((task) => (
                      <div
                        key={task.id}
                        className="bg-card border border-card-border rounded p-2 text-sm hover-elevate cursor-pointer"
                        onClick={() => handleEdit(task)}
                        data-testid={`schedule-task-${task.id}`}
                      >
                        <p className="font-medium line-clamp-2">{task.title}</p>
                        {task.dueDate && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {format(parseISO(task.dueDate.toString()), "h:mm a")}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <BottomNav />
      <VoiceFAB onClick={handleVoiceFABClick} isRecording={isListening} />

      <VoiceModal
        isOpen={isVoiceModalOpen}
        onClose={() => {
          setIsVoiceModalOpen(false);
          resetTranscript();
        }}
        onSubmit={handleVoiceSubmit}
        transcription={transcript}
        setTranscription={setTranscript}
        isRecording={isListening}
      />

      <Dialog open={isTaskFormOpen} onOpenChange={setIsTaskFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTask ? "Edit Task" : "New Task"}</DialogTitle>
          </DialogHeader>
          <TaskForm
            initialValues={editingTask ? {
              title: editingTask.title,
              description: editingTask.description || undefined,
              dueDate: editingTask.dueDate || undefined,
              priority: editingTask.priority as "low" | "medium" | "high",
              completed: editingTask.completed,
            } : undefined}
            onSubmit={handleTaskFormSubmit}
            onCancel={() => {
              setIsTaskFormOpen(false);
              setEditingTask(null);
            }}
            submitLabel={editingTask ? "Update Task" : "Create Task"}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
