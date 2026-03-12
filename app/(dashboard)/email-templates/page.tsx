import { MailIcon } from "lucide-react"
import { ComingSoon } from "@/components/shared/coming-soon"

export default function EmailTemplatesPage() {
  return (
    <ComingSoon
      title="Email Templates"
      description="Design, manage, and monitor transactional and notification email templates. Track delivery rates, configure SMTP providers, and maintain consistent platform communication."
      icon={<MailIcon className="size-6" />}
      category="Operations"
      eta="Q3 2026"
      progress={15}
      features={[
        "Visual email template editor with preview",
        "Transactional email template library",
        "SMTP provider configuration and failover",
        "Delivery logs with bounce and open tracking",
        "Template versioning and A/B testing",
        "Per-tenant email branding customization",
      ]}
    />
  )
}
