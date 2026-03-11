import { LifeBuoyIcon } from "lucide-react"
import { ComingSoon } from "@/components/shared/coming-soon"

export default function SupportCenterPage() {
  return (
    <ComingSoon
      title="Support Center"
      description="Manage support tickets and requests from tenant administrators. Track resolution times, maintain SLAs, and build a knowledge base for common platform issues."
      icon={<LifeBuoyIcon className="size-6" />}
      progress={20}
      features={[
        "Support ticket management dashboard",
        "Priority-based routing and assignment",
        "Response time and SLA compliance tracking",
        "Knowledge base and FAQ management",
        "Escalation workflows and agent assignment",
        "Tenant satisfaction surveys and ratings",
      ]}
    />
  )
}
