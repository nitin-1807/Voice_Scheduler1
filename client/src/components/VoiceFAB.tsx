import { Mic } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VoiceFABProps {
  onClick: () => void;
  isRecording?: boolean;
}

export function VoiceFAB({ onClick, isRecording = false }: VoiceFABProps) {
  return (
    <Button
      size="icon"
      onClick={onClick}
      data-testid="button-voice-fab"
      className={`fixed bottom-20 right-6 md:bottom-8 md:right-8 w-16 h-16 rounded-full shadow-2xl z-50 ${
        isRecording ? "animate-pulse bg-destructive hover:bg-destructive" : "bg-primary hover:bg-primary"
      }`}
    >
      <Mic className="w-6 h-6 text-primary-foreground" />
      {isRecording && (
        <span className="absolute inset-0 rounded-full bg-destructive animate-ping opacity-75" />
      )}
    </Button>
  );
}
