import { ShieldAlertIcon } from "lucide-react"
import { ComingSoon } from "@/components/shared/coming-soon"

export default function ContentModerationPage() {
  return (
    <ComingSoon
      title="Content Moderation"
      description="Review and moderate content across all tenants. Manage flagged items, configure automated moderation policies, and ensure platform-wide safety and compliance."
      icon={<ShieldAlertIcon className="size-6" />}
      category="Security & Compliance"
      eta="Q3 2026"
      progress={30}
      features={[
        "Real-time content review queue",
        "Flagged content with severity classification",
        "Moderation policy and rules configuration",
        "Automated content filtering and AI detection",
        "Action history, appeals, and escalations",
        "Per-tenant moderation statistics",
      ]}
    />
  )
}
