import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ReportCard, Report } from "@/components/ReportCard";
import { Link } from "react-router-dom";
import { AlertCircle, Plus } from "lucide-react";

const Dashboard = () => {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    // Load reports from localStorage
    const storedReports = JSON.parse(localStorage.getItem("reports") || "[]");
    const parsedReports = storedReports.map((report: any) => ({
      ...report,
      createdAt: new Date(report.createdAt),
    }));
    setReports(parsedReports);
  }, []);

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
              New Report
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">My Reports</h2>
          <p className="text-muted-foreground">
            Track the status of your submitted problem reports
          </p>
        </div>

        {reports.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No reports yet</h3>
            <p className="text-muted-foreground mb-6">
              Start by reporting a problem in your community
            </p>
            <Link to="/report">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Report a Problem
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
