import { Settings2Icon } from "lucide-react"
import { ComingSoon } from "@/components/shared/coming-soon"

export default function PlatformSettingsPage() {
  return (
    <ComingSoon
      title="Platform Settings"
      description="Configure global platform settings including branding, notifications, API keys, and third-party integrations for the entire GEM-SPACE ecosystem."
      icon={<Settings2Icon className="size-6" />}
      category="Configuration"
      eta="Q3 2026"
      progress={30}
      features={[
        "General platform configuration",
        "Branding and white-label customization",
        "Notification templates and delivery rules",
        "API key generation and rate limit management",
        "Third-party service integrations (OAuth, SMTP)",
        "Feature flags and platform-wide toggles",
      ]}
    />
  )
}
