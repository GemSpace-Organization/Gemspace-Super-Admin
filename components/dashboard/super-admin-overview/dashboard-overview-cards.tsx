"use client"

import {
  Building2Icon,
  UserRoundIcon,
  GraduationCapIcon,
  ShieldAlertIcon,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { DashboardSummary } from "@/features/super-admin/types/super-admin.types"

export function DashboardOverviewCards({
  summary,
}: {
  summary: DashboardSummary | undefined
}) {
  const metrics = [
    {
      title: "Institutions",
      value: summary?.totalInstitutions ?? 0,
      subtitle: `${summary?.activeInstitutions ?? 0} active`,
      icon: Building2Icon,
    },
    {
      title: "School Admins",
      value: summary?.totalSchoolAdmins ?? 0,
      subtitle: `${summary?.dailyActiveUsers ?? 0} daily active users`,
      icon: UserRoundIcon,
    },
    {
      title: "Students",
      value: summary?.totalStudents ?? 0,
      subtitle: `${summary?.totalLecturers ?? 0} lecturers`,
      icon: GraduationCapIcon,
    },
    {
      title: "Pending Verifications",
      value: summary?.pendingVerifications ?? 0,
      subtitle: `${summary?.suspendedInstitutions ?? 0} suspended institutions`,
      icon: ShieldAlertIcon,
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => {
        const Icon = metric.icon

        return (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <Icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold tracking-tight">
                {metric.value.toLocaleString()}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {metric.subtitle}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
