import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Report } from "./ReportCard";
import { StatusBadge } from "./StatusBadge";
import { Calendar, MapPin, Tag, CheckCircle2, Clock } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { tr } from "date-fns/locale";

interface ReportDetailModalProps {
  report: Report | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ReportDetailModal = ({
  report,
  open,
  onOpenChange,
}: ReportDetailModalProps) => {
  if (!report) return null;

  const calculateDuration = () => {
    if (report.submittedAt && report.resolvedAt) {
      return differenceInDays(report.resolvedAt, report.submittedAt);
    }
    return null;
  };

  const duration = calculateDuration();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{report.title}</DialogTitle>
          <DialogDescription>
            Rapor detayları ve süreç takibi
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image */}
          {report.imageUrl && (
            <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted">
              <img
                src={report.imageUrl}
                alt={report.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Durum:</span>
            <StatusBadge status={report.status} />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="font-semibold">Açıklama</h3>
            <p className="text-sm text-muted-foreground">{report.description}</p>
          </div>

          {/* Location & Category */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-medium">
                <MapPin className="h-4 w-4" />
                Konum
              </div>
              <p className="text-sm text-muted-foreground">{report.location}</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Tag className="h-4 w-4" />
                Kategori
              </div>
              <p className="text-sm text-muted-foreground capitalize">{report.category}</p>
            </div>
          </div>

          {/* Process Timeline */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Süreç Takibi</h3>
              {duration !== null && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Toplam Süre: {duration} gün</span>
                </div>
              )}
            </div>

            <div className="space-y-4 relative pl-8 border-l-2 border-muted">
              {/* Submitted */}
              {report.submittedAt && (
                <div className="relative">
                  <div className="absolute -left-[33px] top-1 w-4 h-4 rounded-full bg-primary border-4 border-background" />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span className="font-medium text-sm">Rapor Gönderildi</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {format(report.submittedAt, "dd MMMM yyyy, HH:mm", { locale: tr })}
                    </p>
                  </div>
                </div>
              )}

              {/* Approved */}
              {report.approvedAt && (
                <div className="relative">
                  <div className="absolute -left-[33px] top-1 w-4 h-4 rounded-full bg-primary border-4 border-background" />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <span className="font-medium text-sm">Belediye Onayladı</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {format(report.approvedAt, "dd MMMM yyyy, HH:mm", { locale: tr })}
                    </p>
                    {report.submittedAt && (
                      <p className="text-xs text-muted-foreground">
                        ({differenceInDays(report.approvedAt, report.submittedAt)} gün sonra)
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Resolved */}
              {report.resolvedAt && (
                <div className="relative">
                  <div className="absolute -left-[33px] top-1 w-4 h-4 rounded-full bg-success border-4 border-background" />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      <span className="font-medium text-sm">Sorun Çözüldü</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {format(report.resolvedAt, "dd MMMM yyyy, HH:mm", { locale: tr })}
                    </p>
                    {report.approvedAt && (
                      <p className="text-xs text-muted-foreground">
                        ({differenceInDays(report.resolvedAt, report.approvedAt)} gün sonra)
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* If not yet completed */}
              {!report.approvedAt && report.status === "submitted" && (
                <div className="relative">
                  <div className="absolute -left-[33px] top-1 w-4 h-4 rounded-full bg-muted border-4 border-background" />
                  <div className="space-y-1">
                    <span className="font-medium text-sm text-muted-foreground">
                      Belediye Onayı Bekleniyor
                    </span>
                  </div>
                </div>
              )}

              {!report.resolvedAt && report.status === "in-progress" && (
                <div className="relative">
                  <div className="absolute -left-[33px] top-1 w-4 h-4 rounded-full bg-muted border-4 border-background" />
                  <div className="space-y-1">
                    <span className="font-medium text-sm text-muted-foreground">
                      Çözüm Bekleniyor
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* User Explanation if exists */}
          {report.userExplanation && (
            <div className="p-4 bg-destructive/10 rounded-lg space-y-2">
              <p className="text-sm font-semibold text-destructive">
                ⚠️ Kullanıcı Bildirimi
              </p>
              <p className="text-sm">{report.userExplanation}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
