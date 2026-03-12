import { UsersIcon } from "lucide-react"
import { ComingSoon } from "@/components/shared/coming-soon"

export default function UserManagementPage() {
  return (
    <ComingSoon
      title="User Management"
      description="Global user oversight across all tenants. Monitor student and lecturer accounts, investigate abuse reports, suspend malicious accounts, and resolve cross-tenant disputes."
      icon={<UsersIcon className="size-6" />}
      category="Management"
      eta="Q2 2026"
      progress={20}
      features={[
        "Platform-wide user directory with search",
        "Student account overview and activity",
        "Lecturer account overview and activity",
        "Account suspension and reinstatement",
        "Abuse report investigation tools",
        "Cross-tenant user analytics",
      ]}
    />
  )
}
