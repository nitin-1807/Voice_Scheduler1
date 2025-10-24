import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useRef } from "react";

interface VoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (text: string) => void;
  transcription: string;
  setTranscription: (text: string) => void;
  isRecording: boolean;
}

export function VoiceModal({
  isOpen,
  onClose,
  onSubmit,
  transcription,
  setTranscription,
  isRecording,
}: VoiceModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isRecording || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    const bars = 20;
    const barWidth = canvas.width / bars;

    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "hsl(var(--primary))";

      for (let i = 0; i < bars; i++) {
        const height = Math.random() * canvas.height * 0.8 + canvas.height * 0.1;
        const x = i * barWidth;
        const y = (canvas.height - height) / 2;
        ctx.fillRect(x, y, barWidth - 2, height);
      }

      animationId = requestAnimationFrame(animate);
    }

    animate();
    return () => cancelAnimationFrame(animationId);
  }, [isRecording]);

  const handleSubmit = () => {
    if (transcription.trim()) {
      onSubmit(transcription);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg" data-testid="modal-voice">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {isRecording ? "Listening..." : "Voice Input"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {isRecording && (
            <div className="flex justify-center">
              <canvas
                ref={canvasRef}
                width={400}
                height={100}
                className="w-full h-24 rounded-md"
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Transcription
            </label>
            <Textarea
              placeholder="Say something like 'Meeting tomorrow at 3pm' or 'Buy groceries'"
              value={transcription}
              onChange={(e) => setTranscription(e.target.value)}
              className="min-h-[120px] resize-none"
              data-testid="input-transcription"
            />
            <p className="text-xs text-muted-foreground">
              Tip: Speak naturally or type your task
            </p>
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={onClose}
              data-testid="button-cancel"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!transcription.trim()}
              data-testid="button-create-task"
            >
              Create Task
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
