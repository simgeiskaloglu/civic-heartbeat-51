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

interface ResolutionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onResponse: (stillExists: boolean) => void;
}

export const ResolutionModal = ({
  open,
  onOpenChange,
  onResponse,
}: ResolutionModalProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Sorun Durumu</AlertDialogTitle>
          <AlertDialogDescription>
            Sorun hala devam ediyor mu?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onResponse(false)}>
            Hayır
          </AlertDialogCancel>
          <AlertDialogAction onClick={() => onResponse(true)}>
            Evet
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
