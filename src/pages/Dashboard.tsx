import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Report } from "@/components/ReportCard";
import { Link } from "react-router-dom";
import { AlertCircle, Plus } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { Calendar, MapPin } from "lucide-react";
import { format } from "date-fns";
import { ResolutionModal } from "@/components/ResolutionModal";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = () => {
    const storedReports = JSON.parse(localStorage.getItem("reports") || "[]");
    const parsedReports = storedReports.map((report: any) => ({
      ...report,
      createdAt: new Date(report.createdAt),
    }));
    setReports(parsedReports);
  };

  const handleReportClick = (report: Report) => {
    if (report.status === "resolved") {
      setSelectedReportId(report.id);
      setModalOpen(true);
    }
  };

  const handleResolutionResponse = (stillExists: boolean) => {
    if (stillExists && selectedReportId) {
      const storedReports = JSON.parse(localStorage.getItem("reports") || "[]");
      const updatedReports = storedReports.map((report: any) =>
        report.id === selectedReportId
          ? { ...report, status: "submitted", userReportedUnresolved: true }
          : report
      );
      localStorage.setItem("reports", JSON.stringify(updatedReports));
      loadReports();
      toast({
        title: "Durum Güncellendi",
        description: "Rapor 'Çözülmemiş Bildirimler' listesine eklendi.",
      });
    }
    setModalOpen(false);
    setSelectedReportId(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground">CitiReport</h1>
          </Link>
          <Link to="/report">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Yeni Rapor
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Raporlarım</h2>
          <p className="text-muted-foreground">
            Gönderdiğiniz sorun raporlarının durumunu takip edin
          </p>
        </div>

        {reports.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Henüz rapor yok</h3>
            <p className="text-muted-foreground mb-6">
              Topluluğunuzdaki bir sorunu bildirerek başlayın
            </p>
            <Link to="/report">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Sorun Bildir
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <Card
                key={report.id}
                className={`overflow-hidden hover:shadow-lg transition-shadow ${
                  report.status === "resolved" ? "cursor-pointer" : ""
                }`}
                onClick={() => handleReportClick(report)}
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
                    <h3 className="font-semibold text-lg line-clamp-1">{report.title}</h3>
                    <StatusBadge status={report.status} />
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {report.description}
                  </p>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span className="line-clamp-1">{report.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{format(report.createdAt, "MMM d, yyyy")}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <span className="text-xs text-muted-foreground capitalize">
                    Kategori: {report.category}
                  </span>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
        
        <ResolutionModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          onResponse={handleResolutionResponse}
        />
      </main>
    </div>
  );
};

export default Dashboard;
