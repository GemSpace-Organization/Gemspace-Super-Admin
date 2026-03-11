"use client"

import { Pie, PieChart, Cell } from "recharts"
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
import data from "@/lib/data.json"

const chartConfig = {
  Enterprise: {
    label: "Enterprise",
    color: "var(--color-chart-1)",
  },
  Professional: {
    label: "Professional",
    color: "var(--color-chart-2)",
  },
  Starter: {
    label: "Starter",
    color: "var(--color-chart-3)",
  },
  Trial: {
    label: "Trial",
    color: "var(--color-chart-5)",
  },
} satisfies ChartConfig

const COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-5)",
]

export function SubscriptionPieChart() {
  const total = data.subscriptionBreakdown.reduce(
    (sum, item) => sum + item.count,
    0
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Subscriptions</CardTitle>
        <CardDescription>{total} total active plans</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto h-[200px] w-full"
        >
          <PieChart accessibilityLayer>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={data.subscriptionBreakdown}
              dataKey="count"
              nameKey="plan"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              strokeWidth={2}
              stroke="var(--color-background)"
            >
              {data.subscriptionBreakdown.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {data.subscriptionBreakdown.map((item, i) => (
            <div key={item.plan} className="flex items-center gap-2 text-sm">
              <span
                className="size-2.5 rounded-full"
                style={{ backgroundColor: COLORS[i] }}
              />
              <span className="text-muted-foreground">{item.plan}</span>
              <span className="ml-auto font-medium">{item.count}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
