import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type ReportStatus = "submitted" | "in-progress" | "resolved";

interface StatusBadgeProps {
  status: ReportStatus;
  className?: string;
}

const statusConfig = {
  submitted: {
    label: "Submitted",
    className: "bg-info text-info-foreground hover:bg-info/90",
  },
  "in-progress": {
    label: "In Progress",
    className: "bg-warning text-warning-foreground hover:bg-warning/90",
  },
  resolved: {
    label: "Resolved",
    className: "bg-success text-success-foreground hover:bg-success/90",
  },
};

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = statusConfig[status];
  
  return (
    <Badge className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
};
