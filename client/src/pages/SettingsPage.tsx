import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { useNotifications } from "@/hooks/useNotifications";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Mic, HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  const { permission, requestPermission, isSupported } = useNotifications();

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header />

      <main className="flex-1 overflow-y-auto pb-20">
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
          <h1 className="text-3xl font-semibold">Settings</h1>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifications
              </CardTitle>
              <CardDescription>
                Manage your notification preferences for task reminders
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Browser Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Get notified when tasks are due
                  </p>
                </div>
                {permission === "granted" ? (
                  <Badge variant="secondary">Enabled</Badge>
                ) : (
                  <Button onClick={requestPermission} size="sm" data-testid="button-enable-notifications">
                    Enable
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="w-5 h-5" />
                Voice Commands
              </CardTitle>
              <CardDescription>
                Learn how to use voice commands effectively
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h4 className="font-medium mb-2">Example Commands:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>"Meeting with team tomorrow at 3pm"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>"Buy groceries"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>"Call mom on Friday at 5"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>"Finish report by next Monday"</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5" />
                About mypa
              </CardTitle>
              <CardDescription>
                Your voice-powered personal assistant
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                mypa helps you manage tasks and schedules effortlessly using voice commands.
                Simply tap the microphone button and speak naturally to create tasks, set reminders,
                and organize your day.
              </p>
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground">Version 1.0.0</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
