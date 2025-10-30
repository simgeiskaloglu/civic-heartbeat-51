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
  const [responseType, setResponseType] = useState<"yes" | "no" | null>(null);

  const handleNo = () => {
    setResponseType("no");
    setShowExplanation(true);
  };

  const handleYes = () => {
    setResponseType("yes");
    setShowExplanation(true);
  };

  const handleSubmitExplanation = () => {
    if (responseType === "yes") {
      onResponse(true, explanation);
    } else {
      onResponse(false, explanation);
    }
    setShowExplanation(false);
    setExplanation("");
    setResponseType(null);
  };

  const handleCancel = () => {
    setShowExplanation(false);
    setExplanation("");
    setResponseType(null);
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Sorun Durumu</AlertDialogTitle>
          <AlertDialogDescription>
            {showExplanation
              ? responseType === "yes"
                ? "Sorunun neden devam ettiğini kısaca açıklayınız."
                : "Kısaca açıklayınız (örneğin: ekip geldi, sorun giderildi)."
              : "Sorun hala devam ediyor mu?"}
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        {showExplanation && (
          <div className="space-y-2">
            <Label htmlFor="explanation">Kullanıcı Açıklaması</Label>
            <Textarea
              id="explanation"
              placeholder="Açıklamanızı yazın..."
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              rows={4}
            />
          </div>
        )}

        <AlertDialogFooter>
          {showExplanation ? (
            <>
              <AlertDialogCancel onClick={handleCancel}>
                İptal
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleSubmitExplanation}>
                Gönder
              </AlertDialogAction>
            </>
          ) : (
            <>
              <AlertDialogCancel onClick={handleNo}>
                Hayır
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleYes}>
                Evet
              </AlertDialogAction>
            </>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
