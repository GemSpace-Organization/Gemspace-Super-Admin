"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { SidebarBrand } from "@/components/sidebar-brand"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  LayoutDashboardIcon,
  BuildingIcon,
  UserCogIcon,
  BarChart3Icon,
  CreditCardIcon,
  BrainCircuitIcon,
  ShieldAlertIcon,
  FileTextIcon,
  ActivityIcon,
  MegaphoneIcon,
  LifeBuoyIcon,
  Settings2Icon,
} from "lucide-react"

const data = {
  user: {
    name: "Super Admin",
    email: "admin@gemspace.app",
    avatar: "",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <LayoutDashboardIcon />,
      isActive: true,
    },
    {
      title: "Tenants",
      url: "/tenants",
      icon: <BuildingIcon />,
      items: [
        { title: "All Tenants", url: "/tenants" },
        { title: "Onboarding Pipeline", url: "/tenants/pipeline" },
        { title: "Verification Queue", url: "/tenants/verification" },
      ],
    },
    {
      title: "Tenant Admins",
      url: "/tenant-admins",
      icon: <UserCogIcon />,
      items: [
        { title: "All Administrators", url: "/tenant-admins" },
        { title: "Role Assignments", url: "/tenant-admins/roles" },
        { title: "Access Permissions", url: "/tenant-admins/permissions" },
      ],
    },
    {
      title: "Analytics",
      url: "/platform-analytics",
      icon: <BarChart3Icon />,
      items: [
        { title: "Overview", url: "/platform-analytics" },
        { title: "Tenant Usage", url: "/platform-analytics/usage" },
        { title: "Growth Metrics", url: "/platform-analytics/growth" },
      ],
    },
    {
      title: "Subscriptions",
      url: "/subscriptions",
      icon: <CreditCardIcon />,
      items: [
        { title: "All Plans", url: "/subscriptions" },
        { title: "Invoices", url: "/subscriptions/invoices" },
        { title: "Revenue", url: "/subscriptions/revenue" },
      ],
    },
    {
      title: "AI Services",
      url: "/ai-services",
      icon: <BrainCircuitIcon />,
      items: [
        { title: "Service Overview", url: "/ai-services" },
        { title: "Model Config", url: "/ai-services/models" },
        { title: "Quotas & Limits", url: "/ai-services/quotas" },
      ],
    },
    {
      title: "Moderation",
      url: "/content-moderation",
      icon: <ShieldAlertIcon />,
      items: [
        { title: "Review Queue", url: "/content-moderation" },
        { title: "Flagged Content", url: "/content-moderation/flagged" },
        { title: "Policies", url: "/content-moderation/policies" },
      ],
    },
    {
      title: "Audit Logs",
      url: "/audit-logs",
      icon: <FileTextIcon />,
    },
    {
      title: "System Health",
      url: "/system-health",
      icon: <ActivityIcon />,
    },
    {
      title: "Announcements",
      url: "/announcements",
      icon: <MegaphoneIcon />,
    },
    {
      title: "Support Center",
      url: "/support-center",
      icon: <LifeBuoyIcon />,
    },
    {
      title: "Settings",
      url: "/platform-settings",
      icon: <Settings2Icon />,
      items: [
        { title: "General", url: "/platform-settings" },
        { title: "Branding", url: "/platform-settings/branding" },
        { title: "Notifications", url: "/platform-settings/notifications" },
        { title: "API Keys", url: "/platform-settings/api-keys" },
        { title: "Integrations", url: "/platform-settings/integrations" },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarBrand />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
