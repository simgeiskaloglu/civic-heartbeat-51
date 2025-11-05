import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Report } from "@/components/ReportCard";
import { Link } from "react-router-dom";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { tr } from "date-fns/locale";
import { ReportDetailModal } from "@/components/ReportDetailModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const AllReports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  useEffect(() => {
    const storedReports = JSON.parse(localStorage.getItem("reports") || "[]");
    const parsedReports = storedReports.map((report: any) => ({
      ...report,
      createdAt: new Date(report.createdAt),
      submittedAt: report.submittedAt ? new Date(report.submittedAt) : undefined,
      approvedAt: report.approvedAt ? new Date(report.approvedAt) : undefined,
      resolvedAt: report.resolvedAt ? new Date(report.resolvedAt) : undefined,
    }));
    setReports(parsedReports);
  }, []);

  const calculateDuration = (report: Report) => {
    if (report.approvedAt && report.resolvedAt) {
      return differenceInDays(report.resolvedAt, report.approvedAt);
    }
    return null;
  };

  const handleRowClick = (report: Report) => {
    setSelectedReport(report);
    setDetailModalOpen(true);
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
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Başlık</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead>Oluşturulma Tarihi</TableHead>
                  <TableHead>Belediye Onay Tarihi</TableHead>
                  <TableHead>Çözülme Tarihi</TableHead>
                  <TableHead>Toplam Çözüm Süresi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((report) => {
                  const duration = calculateDuration(report);
                  return (
                    <TableRow
                      key={report.id}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleRowClick(report)}
                    >
                      <TableCell className="font-medium">{report.title}</TableCell>
                      <TableCell>
                        <span className="capitalize text-sm">
                          {report.status === "submitted" && "Gönderildi"}
                          {report.status === "in-progress" && "Onaylandı"}
                          {report.status === "resolved" && "Çözüldü"}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {report.createdAt
                          ? format(report.createdAt, "dd MMMM yyyy, HH:mm", { locale: tr })
                          : "-"}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {report.approvedAt
                          ? format(report.approvedAt, "dd MMMM yyyy, HH:mm", { locale: tr })
                          : "-"}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {report.resolvedAt
                          ? format(report.resolvedAt, "dd MMMM yyyy, HH:mm", { locale: tr })
                          : "-"}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {duration !== null ? `${duration} gün` : "-"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
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
