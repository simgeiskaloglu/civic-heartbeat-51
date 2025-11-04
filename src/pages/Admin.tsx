import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Report } from "@/components/ReportCard";
import { AlertCircle, LogOut } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { StatusBadge, ReportStatus } from "@/components/StatusBadge";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ReportDetailModal } from "@/components/ReportDetailModal";

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [reports, setReports] = useState<Report[]>([]);
  const [filter, setFilter] = useState<ReportStatus | "all" | "unresolved">("all");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  useEffect(() => {
    // Check if user is admin
    const isAdmin = localStorage.getItem("isAdmin");
    if (isAdmin !== "true") {
      navigate("/admin");
      return;
    }

    loadReports();
  }, [navigate]);

  const loadReports = () => {
    const storedReports = JSON.parse(localStorage.getItem("reports") || "[]");
    const parsedReports = storedReports.map((report: any) => ({
      ...report,
      createdAt: new Date(report.createdAt),
      submittedAt: report.submittedAt ? new Date(report.submittedAt) : undefined,
      approvedAt: report.approvedAt ? new Date(report.approvedAt) : undefined,
      resolvedAt: report.resolvedAt ? new Date(report.resolvedAt) : undefined,
    }));
    setReports(parsedReports);
  };

  const updateReportStatus = (reportId: string, newStatus: ReportStatus) => {
    const storedReports = JSON.parse(localStorage.getItem("reports") || "[]");
    const now = new Date().toISOString();
    
    const updatedReports = storedReports.map((report: any) => {
      if (report.id === reportId) {
        const updates: any = { 
          status: newStatus, 
          userReportedUnresolved: false 
        };
        
        // Add timestamp based on status
        if (newStatus === "in-progress" && !report.approvedAt) {
          updates.approvedAt = now;
        } else if (newStatus === "resolved" && !report.resolvedAt) {
          updates.resolvedAt = now;
        }
        
        return { ...report, ...updates };
      }
      return report;
    });
    
    localStorage.setItem("reports", JSON.stringify(updatedReports));
    loadReports();
    toast({
      title: "Durum Güncellendi",
      description: `Rapor durumu başarıyla güncellendi.`,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    navigate("/admin");
  };

  const handleApprove = (reportId: string) => {
    updateReportStatus(reportId, "in-progress");
    setDetailModalOpen(false);
  };

  const handleMarkSolved = (reportId: string) => {
    updateReportStatus(reportId, "resolved");
    setDetailModalOpen(false);
  };

  const unresolvedReports = reports.filter((r) => r.userReportedUnresolved === true);
  
  const filteredReports =
    filter === "all" 
      ? reports 
      : filter === "unresolved"
      ? unresolvedReports
      : reports.filter((r) => r.status === filter);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground">Belediye Yönetim Paneli</h1>
          </div>
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Çıkış Yap
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="all" onValueChange={(v) => setFilter(v as any)}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">Tümü ({reports.length})</TabsTrigger>
            <TabsTrigger value="unresolved">
              Çözülmemiş Bildirimler ({unresolvedReports.length})
            </TabsTrigger>
            <TabsTrigger value="submitted">
              Gönderildi ({reports.filter((r) => r.status === "submitted").length})
            </TabsTrigger>
            <TabsTrigger value="in-progress">
              Onaylandı ({reports.filter((r) => r.status === "in-progress").length})
            </TabsTrigger>
            <TabsTrigger value="resolved">
              Çözüldü ({reports.filter((r) => r.status === "resolved").length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={filter} className="space-y-4">
            {filteredReports.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground">Bu kategoride rapor yok</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredReports.map((report) => (
                  <Card 
                    key={report.id} 
                    className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => {
                      setSelectedReport(report);
                      setDetailModalOpen(true);
                    }}
                  >
                    {report.imageUrl && (
                      <div className="aspect-video w-full overflow-hidden bg-muted">
                        <img
                          src={report.imageUrl}
                          alt={report.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardHeader className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-lg line-clamp-1">
                          {report.title}
                        </h3>
                        <StatusBadge status={report.status} />
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {report.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{report.location}</span>
                        <span>{format(report.createdAt, "dd/MM/yyyy")}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-xs text-muted-foreground capitalize">
                        Kategori: {report.category}
                      </p>
                      {report.userReportedUnresolved && (
                        <div className="p-3 bg-destructive/10 rounded-md">
                          <p className="text-xs font-semibold text-destructive">
                            ⚠️ Kullanıcı sorununun devam ettiğini bildirdi
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <ReportDetailModal
          report={selectedReport}
          open={detailModalOpen}
          onOpenChange={setDetailModalOpen}
          isAdmin={true}
          onApprove={handleApprove}
          onMarkSolved={handleMarkSolved}
        />
      </main>
    </div>
  );
};

export default Admin;
