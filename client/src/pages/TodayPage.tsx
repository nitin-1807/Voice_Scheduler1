import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Task, InsertTask } from "@shared/schema";
import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { VoiceFAB } from "@/components/VoiceFAB";
import { VoiceModal } from "@/components/VoiceModal";
import { TaskCard } from "@/components/TaskCard";
import { EmptyState } from "@/components/EmptyState";
import { TaskForm } from "@/components/TaskForm";
import { useVoiceRecognition } from "@/hooks/useVoiceRecognition";
import { useNotifications } from "@/hooks/useNotifications";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { isToday, isTomorrow, isPast, parseISO, startOfDay } from "date-fns";

export default function TodayPage() {
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { toast } = useToast();
  const { requestPermission } = useNotifications();

  const {
    isListening,
    transcript,
    setTranscript,
    startListening,
    resetTranscript,
  } = useVoiceRecognition();

  const { data: tasks = [], isLoading } = useQuery<Task[]>({
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

  const handleVoiceFABClick = async () => {
    await requestPermission();
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

  const todayTasks = tasks.filter((task) => {
    if (task.completed) return false;
    if (!task.dueDate) return true;
    return isToday(parseISO(task.dueDate.toString()));
  });

  const overdueTasks = tasks.filter((task) => {
    if (task.completed || !task.dueDate) return false;
    return isPast(parseISO(task.dueDate.toString())) && !isToday(parseISO(task.dueDate.toString()));
  });

  const completedTasks = tasks.filter((task) => task.completed);

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header />

      <main className="flex-1 overflow-y-auto pb-20">
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
          {overdueTasks.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-destructive mb-4">
                Overdue
              </h2>
              <div className="space-y-3">
                {overdueTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggleComplete={handleToggleComplete}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">
              Today
            </h2>
            {todayTasks.length === 0 && overdueTasks.length === 0 && completedTasks.length === 0 ? (
              <EmptyState onGetStarted={handleVoiceFABClick} />
            ) : (
              <div className="space-y-3">
                {todayTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggleComplete={handleToggleComplete}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </section>

          {completedTasks.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">
                Completed
              </h2>
              <div className="space-y-3">
                {completedTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggleComplete={handleToggleComplete}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </section>
          )}
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
