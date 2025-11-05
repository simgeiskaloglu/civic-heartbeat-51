import React, { useState } from "react";
import { Report } from "./ReportCard";
import { format, differenceInDays } from "date-fns";
import { tr } from "date-fns/locale";
import { X } from "lucide-react";
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

        {/* Genel Bilgiler */}
        <div className="space-y-2 mb-4 text-sm">
          <p>
            <strong>Durum:</strong>{" "}
            <span className="capitalize">{report.status}</span>
          </p>
          {report.createdAt && (
            <p>
              <strong>Oluşturulma Tarihi:</strong>{" "}
              {format(report.createdAt, "dd MMMM yyyy, HH:mm", { locale: tr })}
            </p>
          )}
          {report.approvedAt && (
            <p>
              <strong>Belediye Onay Tarihi:</strong>{" "}
              {format(report.approvedAt, "dd MMMM yyyy, HH:mm", { locale: tr })}
            </p>
          )}
          {report.resolvedAt && (
            <p>
              <strong>Çözülme Tarihi:</strong>{" "}
              {format(report.resolvedAt, "dd MMMM yyyy, HH:mm", { locale: tr })}
            </p>
          )}
          {duration !== null && (
            <p>
              <strong>Toplam Çözüm Süresi:</strong> {duration} gün
            </p>
          )}
        </div>

        {/* Açıklamalar */}
        <div className="border-t border-border pt-3 space-y-2 mb-4 text-sm">
          <p>
            <strong>Kullanıcı Açıklaması:</strong>{" "}
            {report.description || "—"}
          </p>
          {report.adminResponse && (
            <p>
              <strong>Belediye Açıklaması:</strong> {report.adminResponse}
            </p>
          )}
          {report.userExplanation && (
            <p className="text-muted-foreground italic">
              <strong>Son Geri Bildirim:</strong> {report.userExplanation}
            </p>
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
