import { ShieldCheckIcon } from "lucide-react"
import { ComingSoon } from "@/components/shared/coming-soon"

export default function RolesPermissionsPage() {
  return (
    <ComingSoon
      title="Roles & Permissions"
      description="Define and manage the platform's role-based access control (RBAC) system. Create role templates, configure permission matrices, and enforce access policies across all tenants."
      icon={<ShieldCheckIcon className="size-6" />}
      category="Security & Compliance"
      eta="Q3 2026"
      progress={15}
      features={[
        "Role template creation and management",
        "Granular permission matrix configuration",
        "Access policy enforcement rules",
        "Role hierarchy visualization",
        "Per-tenant role overrides and customization",
        "Permission audit trail and change history",
      ]}
    />
  )
}
