import { ActivityIcon } from "lucide-react"
import { ComingSoon } from "@/components/shared/coming-soon"

export default function SystemHealthPage() {
  return (
    <ComingSoon
      title="System Health"
      description="Monitor the health and performance of all platform services in real time. Track uptime SLAs, response latency, and resource utilization across the infrastructure."
      icon={<ActivityIcon className="size-6" />}
      category="Operations"
      eta="Q2 2026"
      progress={50}
      features={[
        "Service uptime and status dashboard",
        "Response time and latency monitoring",
        "Resource utilization (CPU, memory, disk)",
        "Incident timeline and resolution tracking",
        "Automated alerting and escalation rules",
        "Historical performance trends and reports",
      ]}
    />
  )
}
