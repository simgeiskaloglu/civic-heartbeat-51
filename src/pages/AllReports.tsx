import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Report } from "@/components/ReportCard";
import { Link } from "react-router-dom";
import { AlertCircle, ArrowLeft, Send } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { format } from "date-fns";

interface Comment {
  id: string;
  text: string;
  createdAt: Date;
}

interface ReportWithComments extends Report {
  comments: Comment[];
}

const AllReports = () => {
  const [reports, setReports] = useState<ReportWithComments[]>([]);
  const [commentTexts, setCommentTexts] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const storedReports = JSON.parse(localStorage.getItem("reports") || "[]");
    const parsedReports = storedReports.map((report: any) => ({
      ...report,
      createdAt: new Date(report.createdAt),
      comments: (report.comments || []).map((comment: any) => ({
        ...comment,
        createdAt: new Date(comment.createdAt),
      })),
    }));
    setReports(parsedReports);
  }, []);

  const handleAddComment = (reportId: string) => {
    const commentText = commentTexts[reportId]?.trim();
    if (!commentText) return;

    const updatedReports = reports.map((report) => {
      if (report.id === reportId) {
        const newComment: Comment = {
          id: Math.random().toString(36).substr(2, 9),
          text: commentText,
          createdAt: new Date(),
        };
        return {
          ...report,
          comments: [...(report.comments || []), newComment],
        };
      }
      return report;
    });

    setReports(updatedReports);
    localStorage.setItem("reports", JSON.stringify(updatedReports));
    setCommentTexts({ ...commentTexts, [reportId]: "" });
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
            <h1 className="text-xl font-bold text-foreground">Kullanıcı Raporları</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {reports.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">Henüz rapor yok</p>
          </div>
        ) : (
          <div className="space-y-6 max-w-3xl mx-auto">
            {reports.map((report) => (
              <Card key={report.id} className="overflow-hidden">
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
                    <h3 className="font-semibold text-lg">{report.title}</h3>
                    <StatusBadge status={report.status} />
                  </div>
                  <p className="text-sm text-muted-foreground">{report.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{report.location}</span>
                    <span>{format(report.createdAt, "dd/MM/yyyy")}</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Yorumlar</h4>
                    {report.comments && report.comments.length > 0 ? (
                      <div className="space-y-2">
                        {report.comments.map((comment) => (
                          <div
                            key={comment.id}
                            className="bg-muted p-3 rounded-md text-sm"
                          >
                            <p>{comment.text}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {format(comment.createdAt, "dd/MM/yyyy HH:mm")}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Henüz yorum yok</p>
                    )}
                  </div>
                </CardContent>

                <CardFooter>
                  <div className="flex gap-2 w-full">
                    <Input
                      placeholder="Yorum ekle..."
                      value={commentTexts[report.id] || ""}
                      onChange={(e) =>
                        setCommentTexts({ ...commentTexts, [report.id]: e.target.value })
                      }
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleAddComment(report.id);
                        }
                      }}
                    />
                    <Button
                      size="icon"
                      onClick={() => handleAddComment(report.id)}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AllReports;
