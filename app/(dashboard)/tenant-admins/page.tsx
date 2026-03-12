import { UserCogIcon } from "lucide-react"
import { ComingSoon } from "@/components/shared/coming-soon"

export default function TenantAdminsPage() {
  return (
    <ComingSoon
      title="Tenant Administrators"
      description="Manage administrators across all tenants. Assign roles, configure access permissions, and monitor admin activities across the entire platform."
      icon={<UserCogIcon className="size-6" />}
      category="Management"
      eta="Q2 2026"
      progress={30}
      features={[
        "Directory of all tenant administrators",
        "Role assignment and permission matrix",
        "Admin activity logs and login history",
        "Access revocation and suspension controls",
        "Invitation and onboarding workflows",
        "Cross-tenant admin comparisons",
      ]}
    />
  )
}
