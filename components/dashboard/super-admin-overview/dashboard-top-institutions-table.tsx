import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { SuperAdminDashboardResponse } from "@/features/super-admin/types/super-admin.types"

export function DashboardTopInstitutionsTable({
  dashboard,
}: {
  dashboard: SuperAdminDashboardResponse | undefined
}) {
  const items = dashboard?.usage.topInstitutions ?? []

  const formatUsageValue = (value: unknown) => {
    if (typeof value === "number" && Number.isFinite(value)) {
      return value.toLocaleString()
    }

    return "0"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Top Institutions</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Institution</TableHead>
              <TableHead className="text-right">Usage Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={2}
                  className="py-8 text-center text-sm text-muted-foreground"
                >
                  No institution activity data available yet.
                </TableCell>
              </TableRow>
            ) : (
              items.map((item, index) => (
                <TableRow key={`${item.id ?? "institution"}-${index}`}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-right">
                    {formatUsageValue(item.value)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
