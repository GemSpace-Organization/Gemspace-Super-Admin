"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import data from "@/lib/data.json"

export function SystemStatus() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">System Services</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.systemServices.map((service) => (
            <div
              key={service.name}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{service.name}</span>
                  <Badge
                    variant="secondary"
                    className={
                      service.status === "operational"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "bg-amber/10 text-amber-foreground"
                    }
                  >
                    {service.status}
                  </Badge>
                </div>
                <div className="mt-1.5 flex items-center gap-2">
                  <Progress value={service.uptime} className="h-1" />
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {service.uptime}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
