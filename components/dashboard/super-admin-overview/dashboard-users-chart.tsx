"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { SuperAdminDashboardResponse } from "@/features/super-admin/types/super-admin.types"

const chartConfig = {
  students: {
    label: "Students",
    color: "var(--color-chart-1)",
  },
  lecturers: {
    label: "Lecturers",
    color: "var(--color-chart-2)",
  },
  schoolAdmins: {
    label: "School Admins",
    color: "var(--color-chart-3)",
  },
} satisfies ChartConfig

export function DashboardUsersChart({
  dashboard,
}: {
  dashboard: SuperAdminDashboardResponse | undefined
}) {
  const chartData = (dashboard?.growth.users7d ?? []).map((point) => ({
    date: point.date,
    students: point.students,
    lecturers: point.lecturers,
    schoolAdmins: point.schoolAdmins,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">User Growth</CardTitle>
        <CardDescription>Students, lecturers and school admins</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto! h-60 w-full min-w-0 sm:h-72"
        >
          <BarChart data={chartData} accessibilityLayer>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={16}
              interval="preserveStartEnd"
              tickFormatter={(value: string) => value.slice(5)}
            />
            <YAxis
              width={34}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="students"
              fill="var(--color-chart-1)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="lecturers"
              fill="var(--color-chart-2)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="schoolAdmins"
              fill="var(--color-chart-3)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
