"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { useSuperAdminDashboardQuery } from "@/features/super-admin/hooks/use-super-admin"
import { DashboardOverviewCards } from "@/components/dashboard/super-admin-overview/dashboard-overview-cards"
import { DashboardGrowthChart } from "@/components/dashboard/super-admin-overview/dashboard-growth-chart"
import { DashboardPlanPieChart } from "@/components/dashboard/super-admin-overview/dashboard-plan-pie-chart"
import { DashboardUsersChart } from "@/components/dashboard/super-admin-overview/dashboard-users-chart"
import { DashboardAlertsCard } from "@/components/dashboard/super-admin-overview/dashboard-alerts-card"
import { DashboardTopInstitutionsTable } from "@/components/dashboard/super-admin-overview/dashboard-top-institutions-table"

export function SuperAdminOverview() {
  const dashboardQuery = useSuperAdminDashboardQuery()
  const dashboard = dashboardQuery.data

  if (dashboardQuery.isLoading) {
    return (
      <div className="space-y-4 py-4">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
        <Skeleton className="h-80 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6 py-4">
      <DashboardOverviewCards summary={dashboard?.summary} />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="min-w-0 lg:col-span-2">
          <DashboardGrowthChart dashboard={dashboard} />
        </div>
        <div className="min-w-0">
          <DashboardPlanPieChart dashboard={dashboard} />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="min-w-0">
          <DashboardUsersChart dashboard={dashboard} />
        </div>
        <div className="min-w-0">
          <DashboardAlertsCard dashboard={dashboard} />
        </div>
      </div>

      <DashboardTopInstitutionsTable dashboard={dashboard} />
    </div>
  )
}
