import { StatsCards } from "@/components/dashboard/overview/stats-cards"
import { RevenueChart } from "@/components/dashboard/overview/revenue-chart"
import { TenantGrowthChart } from "@/components/dashboard/overview/tenant-growth-chart"
import { SubscriptionPieChart } from "@/components/dashboard/overview/subscription-pie-chart"
import {
  RecentActivity,
  PendingActions,
} from "@/components/dashboard/overview/activity-cards"
import { TopTenantsTable } from "@/components/dashboard/overview/top-tenants-table"
import { SystemStatus } from "@/components/dashboard/overview/system-status"

export default function DashboardPage() {
  return (
    <div className="space-y-6 py-4">
      <StatsCards />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <SubscriptionPieChart />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <TenantGrowthChart />
        <SystemStatus />
      </div>

      <TopTenantsTable />

      <div className="grid gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <RecentActivity />
        </div>
        <div className="lg:col-span-2">
          <PendingActions />
        </div>
      </div>
    </div>
  )
}
