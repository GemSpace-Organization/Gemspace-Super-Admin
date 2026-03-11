"use client"

import { usePathname } from "next/navigation"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ThemeToggle } from "@/components/shared/theme-toggle"

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/tenants": "Tenants",
  "/tenant-admins": "Tenant Admins",
  "/platform-analytics": "Analytics",
  "/subscriptions": "Subscriptions",
  "/ai-services": "AI Services",
  "/content-moderation": "Moderation",
  "/audit-logs": "Audit Logs",
  "/system-health": "System Health",
  "/announcements": "Announcements",
  "/support-center": "Support Center",
  "/platform-settings": "Settings",
}

export function SiteHeader() {
  const pathname = usePathname()

  const pageTitle =
    pageTitles[pathname] ??
    Object.entries(pageTitles).find(([key]) => pathname.startsWith(key))?.[1] ??
    "Dashboard"

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex flex-1 items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/dashboard">Gemspace</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <ThemeToggle />
    </header>
  )
}
