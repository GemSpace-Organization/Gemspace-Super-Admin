"use client"

import { Building2Icon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSuperAdminDashboardQuery } from "@/features/super-admin/hooks/use-super-admin"
import { InstitutionKpiCards } from "@/components/dashboard/institutions/institution-kpi-cards"
import { OnboardInstitutionModal } from "@/components/dashboard/institutions/modals/onboard-institution-modal"
import { InstitutionsTable } from "@/components/dashboard/institutions/institutions-table"
import { PageHeader } from "@/components/shared/page-header"

export function InstitutionsView() {
  const dashboardQuery = useSuperAdminDashboardQuery()

  return (
    <div className="space-y-6 py-4">
      <PageHeader
        badge={
          <>
            <Building2Icon className="size-3.5 text-indigo" />
            Gemspace Institution Control Center
          </>
        }
        title="Institutions"
        description="Onboard, verify, and govern institutions from a single operational workspace with full lifecycle control."
        infoTitle="How To Use This Page"
        infoContent="Use search and status filters to locate institutions quickly. Open View for profile details, then run approval, suspension, plan, limit, and feature actions as needed."
        actions={<OnboardInstitutionModal />}
      />

      <InstitutionKpiCards summary={dashboardQuery.data?.summary} />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Institution Registry</CardTitle>
        </CardHeader>
        <CardContent>
          <InstitutionsTable />
        </CardContent>
      </Card>
    </div>
  )
}
