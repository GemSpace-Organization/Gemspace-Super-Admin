import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import data from "@/lib/data.json"

export function TopTenantsTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Top Tenants</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tenant</TableHead>
              <TableHead className="text-right">Admins</TableHead>
              <TableHead className="text-right">Users</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.topTenants.map((tenant) => (
              <TableRow key={tenant.name}>
                <TableCell className="font-medium">{tenant.name}</TableCell>
                <TableCell className="text-right">{tenant.admins}</TableCell>
                <TableCell className="text-right">
                  {tenant.users.toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    {tenant.plan}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  >
                    {tenant.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
