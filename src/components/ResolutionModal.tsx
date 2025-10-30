import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface ResolutionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onResponse: (stillExists: boolean, explanation?: string) => void;
}

export const ResolutionModal = ({
  open,
  onOpenChange,
  onResponse,
}: ResolutionModalProps) => {
  const [showExplanation, setShowExplanation] = useState(false);
  const [explanation, setExplanation] = useState("");

  const handleNo = () => {
    onResponse(false);
    setShowExplanation(false);
    setExplanation("");
  };

  const handleYes = () => {
    setShowExplanation(true);
  };

  const handleSubmitExplanation = () => {
    onResponse(true, explanation);
    setShowExplanation(false);
    setExplanation("");
  };

  const handleCancel = () => {
    setShowExplanation(false);
    setExplanation("");
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Sorun Durumu</AlertDialogTitle>
          <AlertDialogDescription>
            {showExplanation
              ? "Sorunun neden devam ettiğini kısaca açıklayınız."
              : "Sorun hala devam ediyor mu?"}
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        {showExplanation && (
          <div className="space-y-2">
            <Label htmlFor="explanation">Açıklama</Label>
            <Textarea
              id="explanation"
              placeholder="Sorunun neden devam ettiğini yazın..."
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              rows={4}
              autoFocus
            />
          </div>
        )}

        <AlertDialogFooter>
          {showExplanation ? (
            <>
              <AlertDialogCancel onClick={handleCancel}>
                İptal
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleSubmitExplanation}
                disabled={!explanation.trim()}
              >
                Gönder
              </AlertDialogAction>
            </>
          ) : (
            <>
              <AlertDialogAction onClick={handleYes}>
                Evet
              </AlertDialogAction>
              <AlertDialogCancel onClick={handleNo}>
                Hayır
              </AlertDialogCancel>
            </>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
