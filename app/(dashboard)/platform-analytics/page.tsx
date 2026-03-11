import { BarChart3Icon } from "lucide-react"
import { ComingSoon } from "@/components/shared/coming-soon"

export default function PlatformAnalyticsPage() {
  return (
    <ComingSoon
      title="Platform Analytics"
      description="Comprehensive analytics and insights across the entire GEM-SPACE platform. Track tenant usage, user engagement, and platform growth metrics with interactive dashboards."
      icon={<BarChart3Icon className="size-6" />}
      progress={25}
      features={[
        "Platform-wide usage overview and trends",
        "Per-tenant activity and engagement metrics",
        "Growth tracking with historical comparisons",
        "Custom date range filtering and CSV exports",
        "Real-time active user and session monitoring",
        "Funnel analysis for tenant onboarding",
      ]}
    />
  )
}
