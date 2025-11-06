import React, { useState } from "react";
import { Report } from "./ReportCard";
import { format, differenceInDays } from "date-fns";
import { tr } from "date-fns/locale";
import { X, CheckCircle2, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

interface ReportDetailModalProps {
  report: Report | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  showFollowUp?: boolean;
  onFollowUpSubmit?: (reportId: string, followUp: string, followUpText: string) => void;
}

export const ReportDetailModal = ({
  report,
  open,
  onOpenChange,
  showFollowUp = false,
  onFollowUpSubmit,
}: ReportDetailModalProps) => {
  const [followUp, setFollowUp] = useState<string | null>(null);
  const [followUpText, setFollowUpText] = useState("");

  if (!report || !open) return null;

  const handleSubmit = () => {
    if (followUp === "evet" && !followUpText.trim()) {
      alert("Lütfen kısa bir açıklama yazın.");
      return;
    }
    if (onFollowUpSubmit && followUp) {
      onFollowUpSubmit(report.id, followUp, followUpText);
      setFollowUp(null);
      setFollowUpText("");
      onOpenChange(false);
    }
  };

  const calculateDuration = () => {
    if (report.approvedAt && report.resolvedAt) {
      return Math.ceil(differenceInDays(report.resolvedAt, report.approvedAt));
    }
    return null;
  };

  const duration = calculateDuration();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-background rounded-2xl shadow-lg w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto">
        {/* Kapatma Butonu */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Başlık */}
        <h2 className="text-xl font-semibold text-center mb-4">
          {report.title || "Rapor Detayı"}
        </h2>

        {/* Timeline Section */}
        <div className="border-t border-border pt-4 mb-4">
          <h3 className="text-sm font-semibold mb-3 text-foreground">Süreç Zaman Çizelgesi</h3>
          <div className="space-y-3">
            <div className="flex gap-3 items-start">
              <div className="rounded-full bg-primary/10 p-2 mt-0.5">
                <Clock className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Rapor Gönderildi</p>
                <p className="text-xs text-muted-foreground">
                  {format(report.createdAt, "dd MMMM yyyy, HH:mm", { locale: tr })}
                </p>
              </div>
            </div>

            {report.approvedAt && (
              <div className="flex gap-3 items-start">
                <div className="rounded-full bg-primary/10 p-2 mt-0.5">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Belediye Onayladı</p>
                  <p className="text-xs text-muted-foreground">
                    {format(report.approvedAt, "dd MMMM yyyy, HH:mm", { locale: tr })}
                  </p>
                </div>
              </div>
            )}

            {report.resolvedAt && (
              <div className="flex gap-3 items-start">
                <div className="rounded-full bg-primary/10 p-2 mt-0.5">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Sorun Çözüldü</p>
                  <p className="text-xs text-muted-foreground">
                    {format(report.resolvedAt, "dd MMMM yyyy, HH:mm", { locale: tr })}
                  </p>
                  {duration !== null && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Toplam süre: <span className="font-medium">{duration} gün</span>
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Description Section */}
        <div className="border-t border-border pt-4 space-y-3 mb-4 text-sm">
          <div>
            <p className="text-sm font-medium text-foreground">Konum:</p>
            <p className="text-sm text-muted-foreground">{report.location || "—"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Kategori:</p>
            <p className="text-sm text-muted-foreground">{report.category || "—"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Açıklama:</p>
            <p className="text-sm text-muted-foreground">{report.description || "—"}</p>
          </div>
          {report.adminResponse && (
            <div>
              <p className="text-sm font-medium text-foreground">Belediye Açıklaması:</p>
              <p className="text-sm text-muted-foreground">{report.adminResponse}</p>
            </div>
          )}
          {report.userExplanation && (
            <div>
              <p className="text-sm font-medium text-foreground">Son Geri Bildirim:</p>
              <p className="text-sm text-muted-foreground italic">{report.userExplanation}</p>
            </div>
          )}
        </div>

        {/* Sadece Raporlarım Sayfasında Gözüken Alan */}
        {showFollowUp && report.status === "resolved" && (
          <div className="border-t border-border pt-3">
            <p className="font-medium mb-2">Sorun hâlâ devam ediyor mu?</p>
            <div className="flex gap-3 mb-3">
              <Button
                onClick={() => setFollowUp("evet")}
                variant={followUp === "evet" ? "destructive" : "outline"}
                className="flex-1"
              >
                Evet
              </Button>
              <Button
                onClick={() => setFollowUp("hayır")}
                variant={followUp === "hayır" ? "default" : "outline"}
                className="flex-1"
              >
                Hayır
              </Button>
            </div>

            {followUp === "evet" && (
              <Textarea
                className="mb-3"
                placeholder="Sorunun devam ettiğini kısaca açıklayın..."
                value={followUpText}
                onChange={(e) => setFollowUpText(e.target.value)}
              />
            )}

            {(followUp === "evet" || followUp === "hayır") && (
              <Button
                onClick={handleSubmit}
                className="w-full"
              >
                Gönder
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
