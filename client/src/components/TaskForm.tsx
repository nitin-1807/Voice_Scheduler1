import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTaskSchema, type InsertTask } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Clock } from "lucide-react";

interface TaskFormProps {
  initialValues?: Partial<InsertTask>;
  onSubmit: (data: InsertTask) => void;
  onCancel: () => void;
  submitLabel?: string;
}

export function TaskForm({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel = "Create Task",
}: TaskFormProps) {
  const form = useForm<InsertTask>({
    resolver: zodResolver(insertTaskSchema),
    defaultValues: {
      title: initialValues?.title || "",
      description: initialValues?.description || "",
      priority: initialValues?.priority || "medium",
      completed: initialValues?.completed || false,
      dueDate: initialValues?.dueDate || undefined,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Meeting with team"
                  {...field}
                  data-testid="input-title"
                  className="h-12"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add details..."
                  {...field}
                  value={field.value || ""}
                  data-testid="input-description"
                  className="min-h-[100px] resize-none"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Due Date & Time
                </FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    {...field}
                    value={
                      field.value
                        ? new Date(field.value).toISOString().slice(0, 16)
                        : ""
                    }
                    onChange={(e) => {
                      const date = e.target.value ? new Date(e.target.value) : undefined;
                      field.onChange(date);
                    }}
                    data-testid="input-due-date"
                    className="h-12"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger data-testid="select-priority" className="h-12">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-3 justify-end pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            data-testid="button-cancel-form"
          >
            Cancel
          </Button>
          <Button type="submit" data-testid="button-submit-form">
            {submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}
