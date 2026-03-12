import { ScaleIcon } from "lucide-react"
import { ComingSoon } from "@/components/shared/coming-soon"

export default function CompliancePage() {
  return (
    <ComingSoon
      title="Compliance Center"
      description="Ensure platform-wide regulatory compliance, data privacy adherence, and institutional certification tracking. Manage GDPR, NDPR, and other data protection frameworks."
      icon={<ScaleIcon className="size-6" />}
      category="Security & Compliance"
      eta="Q4 2026"
      progress={10}
      features={[
        "Regulatory framework tracking and status",
        "Data privacy policy management (GDPR, NDPR)",
        "Institutional certification verification",
        "Compliance checklist and automated audits",
        "Data processing agreement management",
        "Compliance report generation and export",
      ]}
    />
  )
}
