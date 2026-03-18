import { Badge } from "@/components/ui/badge"
import type { InstitutionStatus } from "@/features/super-admin/types/super-admin.types"

const statusClassMap: Record<InstitutionStatus, string> = {
  PENDING_REVIEW: "bg-amber/10 text-amber-foreground",
  ACTIVE: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  SUSPENDED: "bg-destructive/10 text-destructive",
  REQUIRES_INFO: "bg-info/10 text-info",
  REJECTED: "bg-muted text-muted-foreground",
}

export function InstitutionStatusBadge({
  status,
}: {
  status: InstitutionStatus
}) {
  return (
    <Badge variant="secondary" className={statusClassMap[status]}>
      {status.replaceAll("_", " ")}
    </Badge>
  )
}
