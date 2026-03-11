"use client"

import {
  BuildingIcon,
  UserCogIcon,
  CreditCardIcon,
  ActivityIcon,
  TrendingUpIcon,
  TrendingDownIcon,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import data from "@/lib/data.json"

const cards = [
  {
    title: "Total Tenants",
    value: data.stats.totalTenants,
    subtitle: `${data.stats.activeTenants} active, ${data.stats.pendingVerification} pending`,
    icon: BuildingIcon,
    trend: "up" as const,
  },
  {
    title: "Tenant Admins",
    value: data.stats.totalAdmins,
    subtitle: `${data.stats.activeAdmins} currently active`,
    icon: UserCogIcon,
    trend: "up" as const,
  },
  {
    title: "Monthly Revenue",
    value: `$${(data.stats.monthlyRevenue / 1000).toFixed(1)}K`,
    subtitle: `+${data.stats.revenueGrowth}% vs last month`,
    icon: CreditCardIcon,
    trend: "up" as const,
  },
  {
    title: "System Uptime",
    value: `${data.stats.systemUptime}%`,
    subtitle: "Last 30 days average",
    icon: ActivityIcon,
    trend: "up" as const,
  },
]

export function StatsCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <Icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                {card.trend === "up" ? (
                  <TrendingUpIcon className="size-3 text-emerald-500" />
                ) : (
                  <TrendingDownIcon className="size-3 text-destructive" />
                )}
                {card.subtitle}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
