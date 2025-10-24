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
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TasksPage() {
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

  const activeTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);
  const highPriorityTasks = activeTasks.filter((task) => task.priority === "high");
  const mediumPriorityTasks = activeTasks.filter((task) => task.priority === "medium");
  const lowPriorityTasks = activeTasks.filter((task) => task.priority === "low");

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header />

      <main className="flex-1 overflow-y-auto pb-20">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="all" data-testid="tab-all">
                All Tasks
              </TabsTrigger>
              <TabsTrigger value="completed" data-testid="tab-completed">
                Completed
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-6 mt-6">
              {activeTasks.length === 0 ? (
                <EmptyState onGetStarted={handleVoiceFABClick} />
              ) : (
                <>
                  {highPriorityTasks.length > 0 && (
                    <section>
                      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">
                        High Priority
                      </h2>
                      <div className="space-y-3">
                        {highPriorityTasks.map((task) => (
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

                  {mediumPriorityTasks.length > 0 && (
                    <section>
                      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">
                        Medium Priority
                      </h2>
                      <div className="space-y-3">
                        {mediumPriorityTasks.map((task) => (
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

                  {lowPriorityTasks.length > 0 && (
                    <section>
                      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">
                        Low Priority
                      </h2>
                      <div className="space-y-3">
                        {lowPriorityTasks.map((task) => (
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
                </>
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-3 mt-6">
              {completedTasks.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <p>No completed tasks yet</p>
                </div>
              ) : (
                completedTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggleComplete={handleToggleComplete}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))
              )}
            </TabsContent>
          </Tabs>
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
