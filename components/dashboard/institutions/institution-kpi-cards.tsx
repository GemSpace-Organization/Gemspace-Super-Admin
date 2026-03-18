"use client"

import {
  Building2Icon,
  BadgeCheckIcon,
  Clock3Icon,
  CirclePauseIcon,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { DashboardSummary } from "@/features/super-admin/types/super-admin.types"

export function InstitutionKpiCards({
  summary,
}: {
  summary: DashboardSummary | undefined
}) {
  const cards = [
    {
      title: "Total Institutions",
      value: summary?.totalInstitutions ?? 0,
      subtitle: "Across all plans and states",
      icon: Building2Icon,
    },
    {
      title: "Active",
      value: summary?.activeInstitutions ?? 0,
      subtitle: "Approved and operational",
      icon: BadgeCheckIcon,
    },
    {
      title: "Pending Review",
      value: summary?.pendingVerifications ?? 0,
      subtitle: "Awaiting super admin action",
      icon: Clock3Icon,
    },
    {
      title: "Suspended",
      value: summary?.suspendedInstitutions ?? 0,
      subtitle: "Temporarily restricted",
      icon: CirclePauseIcon,
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
              <div className="text-2xl font-semibold tracking-tight">
                {card.value}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {card.subtitle}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
