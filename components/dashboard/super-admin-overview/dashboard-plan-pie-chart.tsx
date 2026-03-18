"use client"

import { Cell, Pie, PieChart } from "recharts"
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
  FREE: {
    label: "Free",
    color: "var(--color-chart-1)",
  },
  PREMIUM: {
    label: "Premium",
    color: "var(--color-chart-2)",
  },
  ENTERPRISE: {
    label: "Enterprise",
    color: "var(--color-chart-3)",
  },
} satisfies ChartConfig

const COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
]

export function DashboardPlanPieChart({
  dashboard,
}: {
  dashboard: SuperAdminDashboardResponse | undefined
}) {
  const planDistribution = dashboard?.commercial.planDistribution ?? []
  const total = planDistribution.reduce((sum, item) => sum + item.count, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Plan Distribution</CardTitle>
        <CardDescription>{total} institutions</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-auto! h-52 w-full min-w-0"
        >
          <PieChart accessibilityLayer>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={planDistribution}
              dataKey="count"
              nameKey="planType"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              strokeWidth={2}
              stroke="var(--color-background)"
            >
              {planDistribution.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>

        <div className="mt-2 grid gap-2">
          {planDistribution.map((item, i) => (
            <div
              key={item.planType}
              className="flex items-center gap-2 text-sm"
            >
              <span
                className="size-2.5 rounded-full"
                style={{ backgroundColor: COLORS[i] }}
              />
              <span className="text-muted-foreground">{item.planType}</span>
              <span className="ml-auto font-medium">{item.count}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
