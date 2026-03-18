import { AppSidebar } from "@/components/app-sidebar"
import { ProtectedGuard } from "@/components/auth/route-guards"
import { SiteHeader } from "@/components/layout/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ProtectedGuard>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <SiteHeader />
          <main className="flex-1 p-2 pt-0 md:p-4 md:pt-0">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedGuard>
  )
}
