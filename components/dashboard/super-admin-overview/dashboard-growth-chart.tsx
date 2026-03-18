"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
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
  institutions: {
    label: "Institutions",
    color: "var(--color-chart-1)",
  },
  approvals: {
    label: "Approvals",
    color: "var(--color-chart-2)",
  },
  rejections: {
    label: "Rejections",
    color: "var(--color-chart-5)",
  },
} satisfies ChartConfig

export function DashboardGrowthChart({
  dashboard,
}: {
  dashboard: SuperAdminDashboardResponse | undefined
}) {
  const institutions = dashboard?.growth.institutions7d ?? []
  const approvals = dashboard?.growth.approvals7d ?? []
  const rejections = dashboard?.growth.rejections7d ?? []

  const chartData = institutions.map((point, index) => ({
    date: point.date,
    institutions: point.value,
    approvals: approvals[index]?.value ?? 0,
    rejections: rejections[index]?.value ?? 0,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Institution Growth</CardTitle>
        <CardDescription>Last 7 days trend</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[280px] w-full">
          <AreaChart data={chartData} accessibilityLayer>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value: string) => value.slice(5)}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              dataKey="rejections"
              type="natural"
              fill="var(--color-chart-5)"
              fillOpacity={0.15}
              stroke="var(--color-chart-5)"
              strokeWidth={2}
            />
            <Area
              dataKey="approvals"
              type="natural"
              fill="var(--color-chart-2)"
              fillOpacity={0.2}
              stroke="var(--color-chart-2)"
              strokeWidth={2}
            />
            <Area
              dataKey="institutions"
              type="natural"
              fill="var(--color-chart-1)"
              fillOpacity={0.2}
              stroke="var(--color-chart-1)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
