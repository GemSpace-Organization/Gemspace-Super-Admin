import { MegaphoneIcon } from "lucide-react"
import { ComingSoon } from "@/components/shared/coming-soon"

export default function AnnouncementsPage() {
  return (
    <ComingSoon
      title="Announcements"
      description="Create and manage platform-wide announcements. Broadcast important updates, maintenance notices, and policy changes to all tenants or target specific groups."
      icon={<MegaphoneIcon className="size-6" />}
      category="Operations"
      eta="Q2 2026"
      progress={25}
      features={[
        "Create and schedule announcements",
        "Target all tenants or specific groups",
        "Priority levels and banner display types",
        "Read receipts and engagement tracking",
        "Announcement templates and categories",
        "Draft, published, and archived states",
      ]}
    />
  )
}
