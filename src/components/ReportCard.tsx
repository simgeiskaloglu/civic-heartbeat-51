import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { StatusBadge, ReportStatus } from "./StatusBadge";
import { Calendar, MapPin } from "lucide-react";
import { format } from "date-fns";

export interface Report {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  status: ReportStatus;
  imageUrl?: string;
  createdAt: Date;
  userReportedUnresolved?: boolean;
}

interface ReportCardProps {
  report: Report;
}

export const ReportCard = ({ report }: ReportCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
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
  );
};
