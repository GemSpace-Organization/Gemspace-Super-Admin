import { BuildingIcon } from "lucide-react"
import { ComingSoon } from "@/components/shared/coming-soon"

export default function TenantsPage() {
  return (
    <ComingSoon
      title="Tenant Management"
      description="Manage all universities and institutions registered on the GEM-SPACE platform. Onboard new tenants, verify credentials, and oversee tenant configurations from a single view."
      icon={<BuildingIcon className="size-6" />}
      progress={40}
      features={[
        "View and search all registered tenants",
        "Onboarding pipeline with stage tracking",
        "Document verification and approval queue",
        "Tenant subscription and usage overview",
        "Bulk status updates and management",
        "Tenant configuration and feature toggles",
      ]}
    />
  )
}
