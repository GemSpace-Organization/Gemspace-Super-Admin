import { AlertTriangleIcon, InfoIcon, SirenIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { SuperAdminDashboardResponse } from "@/features/super-admin/types/super-admin.types"

export function DashboardAlertsCard({
  dashboard,
}: {
  dashboard: SuperAdminDashboardResponse | undefined
}) {
  const alerts = dashboard?.alerts ?? []

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Operational Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <p className="text-sm text-muted-foreground">No active alerts.</p>
        ) : (
          <div className="space-y-2">
            {alerts.map((alert) => (
              <div
                key={alert.code}
                className="flex items-start gap-2 rounded-lg border px-3 py-2.5"
              >
                {alert.severity === "critical" ? (
                  <SirenIcon className="mt-0.5 size-4 text-destructive" />
                ) : alert.severity === "warning" ? (
                  <AlertTriangleIcon className="mt-0.5 size-4 text-amber-500" />
                ) : (
                  <InfoIcon className="mt-0.5 size-4 text-info" />
                )}
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <Badge variant="outline" className="text-[0.65rem]">
                      {alert.code}
                    </Badge>
                    <span className="text-[0.65rem] tracking-wide text-muted-foreground uppercase">
                      {alert.severity}
                    </span>
                  </div>
                  <p className="text-sm">{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
