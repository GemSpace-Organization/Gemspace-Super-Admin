import { BrainCircuitIcon } from "lucide-react"
import { ComingSoon } from "@/components/shared/coming-soon"

export default function AIServicesPage() {
  return (
    <ComingSoon
      title="AI Services"
      description="Configure and monitor AI-powered services across the platform. Manage model deployments, set per-tenant quotas, and track AI usage and costs in real time."
      icon={<BrainCircuitIcon className="size-6" />}
      category="AI & Technology"
      eta="Q3 2026"
      progress={20}
      features={[
        "AI service status overview and monitoring",
        "Model configuration and version management",
        "Per-tenant quota allocation and limits",
        "AI usage analytics and cost attribution",
        "Service health and latency dashboards",
        "Prompt template and safety configuration",
      ]}
    />
  )
}
