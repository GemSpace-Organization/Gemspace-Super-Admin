"use client"

import { usePathname } from "next/navigation"
import { useSidebar } from "@/components/ui/sidebar"
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
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  BellIcon,
  SearchIcon,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react"

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/institutions": "Institutions",
  "/institution-admins": "Institution Admins",
  "/user-management": "User Management",
  "/platform-analytics": "Analytics",
  "/reports": "Reports",
  "/subscriptions": "Subscriptions",
  "/ai-services": "AI Services",
  "/content-moderation": "Moderation",
  "/audit-logs": "Audit Logs",
  "/roles-permissions": "Roles & Permissions",
  "/compliance": "Compliance",
  "/monitoring": "Monitoring",
  "/system-health": "System Health",
  "/announcements": "Announcements",
  "/support-center": "Support Center",
  "/email-templates": "Email Templates",
  "/feature-flags": "Feature Flags",
  "/platform-settings": "Settings",
}

export function SiteHeader() {
  const pathname = usePathname()

  const pageTitle =
    pageTitles[pathname] ??
    Object.entries(pageTitles).find(([key]) => pathname.startsWith(key))?.[1] ??
    "Dashboard"

  const { open, toggleSidebar } = useSidebar()

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex flex-1 items-center gap-2">
        {/* Professional sidebar toggle with state-aware icon + tooltip */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
              className="-ml-1 size-8 text-muted-foreground hover:text-foreground"
            >
              {open ? (
                <PanelLeftClose className="size-4.5" />
              ) : (
                <PanelLeftOpen className="size-4.5" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" className="text-xs">
            {open ? "Collapse sidebar" : "Expand sidebar"}
          </TooltipContent>
        </Tooltip>
        <Separator
          orientation="vertical"
          className="mr-2 hidden h-4 md:block"
        />
        <Breadcrumb className="hidden md:flex">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Gemspace</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <span className="text-sm font-medium md:hidden">{pageTitle}</span>
      </div>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="size-8">
          <SearchIcon className="size-4" />
          <span className="sr-only">Search</span>
        </Button>
        <Button variant="ghost" size="icon" className="relative size-8">
          <BellIcon className="size-4" />
          <Badge className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center p-0 text-[0.55rem]">
            3
          </Badge>
          <span className="sr-only">Notifications</span>
        </Button>
        <Separator orientation="vertical" className="mx-1 h-4" />
        <ThemeToggle />
      </div>
    </header>
  )
}
