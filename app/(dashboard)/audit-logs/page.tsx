import { FileTextIcon } from "lucide-react"
import { ComingSoon } from "@/components/shared/coming-soon"

export default function AuditLogsPage() {
  return (
    <ComingSoon
      title="Audit Logs"
      description="Comprehensive audit trail of all platform activities. Track administrator actions, system configuration changes, and security events with detailed timestamps and metadata."
      icon={<FileTextIcon className="size-6" />}
      progress={45}
      features={[
        "Complete activity audit trail",
        "Filter by user, action type, and date range",
        "Security event monitoring and alerting",
        "Exportable compliance reports (CSV, PDF)",
        "Real-time event streaming and search",
        "IP address and session tracking",
      ]}
    />
  )
}
