import { FileBarChartIcon } from "lucide-react"
import { ComingSoon } from "@/components/shared/coming-soon"

export default function ReportsPage() {
  return (
    <ComingSoon
      title="Reports & Exports"
      description="Generate scheduled reports, export platform data, and create custom queries for compliance, financial auditing, and operational insights across the GEM-SPACE ecosystem."
      icon={<FileBarChartIcon className="size-6" />}
      category="Analytics & Reports"
      eta="Q3 2026"
      progress={15}
      features={[
        "Scheduled report generation and delivery",
        "Custom data export builder (CSV, PDF, Excel)",
        "Pre-built compliance and audit reports",
        "Financial summary and revenue reports",
        "Tenant activity and engagement reports",
        "Report history and version management",
      ]}
    />
  )
}
