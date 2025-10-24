import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const { toast } = useToast();

  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if ("Notification" in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === "granted";
    }
    return false;
  };

  const showNotification = (title: string, options?: NotificationOptions) => {
    if (permission === "granted") {
      new Notification(title, {
        icon: "/favicon.png",
        badge: "/favicon.png",
        ...options,
      });
    } else {
      toast({
        title,
        description: options?.body,
      });
    }
  };

  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  return {
    permission,
    requestPermission,
    showNotification,
    speak,
    isSupported: "Notification" in window,
  };
}
