import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Report } from "@/components/ReportCard";
import { Link } from "react-router-dom";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { tr } from "date-fns/locale";
import { ReportDetailModal } from "@/components/ReportDetailModal";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const AllReports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [comments, setComments] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = () => {
    const storedReports = JSON.parse(localStorage.getItem("reports") || "[]");
    const parsedReports = storedReports.map((report: any) => ({
      ...report,
      createdAt: new Date(report.createdAt),
      submittedAt: report.submittedAt ? new Date(report.submittedAt) : undefined,
      approvedAt: report.approvedAt ? new Date(report.approvedAt) : undefined,
      resolvedAt: report.resolvedAt ? new Date(report.resolvedAt) : undefined,
      comments: report.comments || [],
    }));
    setReports(parsedReports);
  };

  const handleCardClick = (report: Report) => {
    setSelectedReport(report);
    setDetailModalOpen(true);
  };

  const handleAddComment = (reportId: string) => {
    const commentText = comments[reportId]?.trim();
    if (!commentText) return;

    const storedReports = JSON.parse(localStorage.getItem("reports") || "[]");
    const updatedReports = storedReports.map((report: any) =>
      report.id === reportId
        ? {
            ...report,
            comments: [
              ...(report.comments || []),
              {
                text: commentText,
                date: new Date().toISOString(),
              },
            ],
          }
        : report
    );

    localStorage.setItem("reports", JSON.stringify(updatedReports));
    loadReports();
    setComments({ ...comments, [reportId]: "" });
    
    toast({
      title: "Yorum eklendi",
      description: "Yorumunuz başarıyla eklendi.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Ana Sayfa
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground">Tüm Raporlar</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {reports.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">Henüz rapor yok</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <Card key={report.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div onClick={() => handleCardClick(report)} className="cursor-pointer">
                  {report.imageUrl && (
                    <img
                      src={report.imageUrl}
                      alt={report.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-lg">{report.title}</h3>
                      <StatusBadge status={report.status} />
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {report.description}
                    </p>
                    <div className="text-xs text-muted-foreground">
                      <p>📍 {report.location}</p>
                      <p>📅 {format(report.createdAt, "dd MMMM yyyy", { locale: tr })}</p>
                    </div>
                  </CardContent>
                </div>
                
                {/* Comments Section */}
                <div className="border-t px-4 py-3 bg-muted/20">
                  {report.comments && report.comments.length > 0 && (
                    <div className="mb-3 space-y-2 max-h-32 overflow-y-auto">
                      {report.comments.map((comment: any, idx: number) => (
                        <div key={idx} className="text-xs bg-background p-2 rounded">
                          <p className="text-foreground">{comment.text}</p>
                          <p className="text-muted-foreground mt-1">
                            {format(new Date(comment.date), "dd MMM yyyy, HH:mm", { locale: tr })}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Yorum ekle..."
                      value={comments[report.id] || ""}
                      onChange={(e) => setComments({ ...comments, [report.id]: e.target.value })}
                      className="text-sm min-h-[60px]"
                    />
                    <Button
                      size="sm"
                      onClick={() => handleAddComment(report.id)}
                      disabled={!comments[report.id]?.trim()}
                    >
                      Gönder
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        <ReportDetailModal
          report={selectedReport}
          open={detailModalOpen}
          onOpenChange={setDetailModalOpen}
        />
      </main>
    </div>
  );
};

export default AllReports;
