import Link from "next/link"
import {
  CheckCircle2Icon,
  ClockIcon,
  AlertTriangleIcon,
  TrendingUpIcon,
  ShieldCheckIcon,
  UserPlusIcon,
  ArrowUpCircleIcon,
  TicketCheckIcon,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import data from "@/lib/data.json"

const iconMap: Record<string, React.ReactNode> = {
  tenant_verified: <CheckCircle2Icon className="size-4 text-emerald-500" />,
  tenant_onboarding: <ClockIcon className="size-4 text-amber" />,
  content_flagged: <AlertTriangleIcon className="size-4 text-destructive" />,
  revenue_milestone: <TrendingUpIcon className="size-4 text-teal" />,
  system_check: <ShieldCheckIcon className="size-4 text-teal" />,
  admin_added: <UserPlusIcon className="size-4 text-indigo" />,
  subscription_upgrade: <ArrowUpCircleIcon className="size-4 text-teal" />,
  support_resolved: <TicketCheckIcon className="size-4 text-emerald-500" />,
}

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.recentActivity.map((activity, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="mt-0.5">
                {iconMap[activity.type] ?? (
                  <CheckCircle2Icon className="size-4 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm">{activity.title}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function PendingActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Pending Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {data.pendingActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="flex items-center justify-between rounded-lg border px-3 py-2.5 transition-colors hover:bg-muted/50"
            >
              <span className="text-sm">{action.label}</span>
              <Badge variant="secondary" className="font-semibold">
                {action.count}
              </Badge>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
