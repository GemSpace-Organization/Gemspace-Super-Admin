"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { SidebarBrand } from "@/components/sidebar-brand"
import { SidebarSearch } from "@/components/sidebar-search"
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
  UsersIcon,
  BarChart3Icon,
  FileBarChartIcon,
  CreditCardIcon,
  BrainCircuitIcon,
  ShieldAlertIcon,
  FileTextIcon,
  ShieldCheckIcon,
  ScaleIcon,
  ActivityIcon,
  MegaphoneIcon,
  LifeBuoyIcon,
  MailIcon,
  ToggleLeftIcon,
  Settings2Icon,
} from "lucide-react"

const data = {
  user: {
    name: "Super Admin",
    email: "admin@gemspace.app",
    avatar: "",
  },
  navGroups: [
    {
      label: "Overview",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: <LayoutDashboardIcon />,
          isActive: true,
        },
      ],
    },
    {
      label: "Management",
      items: [
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
          title: "User Management",
          url: "/user-management",
          icon: <UsersIcon />,
          items: [
            { title: "All Users", url: "/user-management" },
            { title: "Students", url: "/user-management/students" },
            { title: "Lecturers", url: "/user-management/lecturers" },
          ],
        },
      ],
    },
    {
      label: "Financial",
      items: [
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
      ],
    },
    {
      label: "Analytics & Reports",
      items: [
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
          title: "Reports",
          url: "/reports",
          icon: <FileBarChartIcon />,
          items: [
            { title: "Scheduled Reports", url: "/reports" },
            { title: "Data Exports", url: "/reports/exports" },
          ],
        },
      ],
    },
    {
      label: "AI & Technology",
      items: [
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
      ],
    },
    {
      label: "Security & Compliance",
      items: [
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
          title: "Roles & Permissions",
          url: "/roles-permissions",
          icon: <ShieldCheckIcon />,
          items: [
            { title: "Role Templates", url: "/roles-permissions" },
            { title: "Permission Matrix", url: "/roles-permissions/matrix" },
            { title: "Access Policies", url: "/roles-permissions/policies" },
          ],
        },
        {
          title: "Compliance",
          url: "/compliance",
          icon: <ScaleIcon />,
          items: [
            { title: "Regulatory", url: "/compliance" },
            { title: "Data Privacy", url: "/compliance/privacy" },
            { title: "Certifications", url: "/compliance/certifications" },
          ],
        },
      ],
    },
    {
      label: "Operations",
      items: [
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
          title: "Email Templates",
          url: "/email-templates",
          icon: <MailIcon />,
          items: [
            { title: "All Templates", url: "/email-templates" },
            { title: "Delivery Logs", url: "/email-templates/logs" },
          ],
        },
        {
          title: "Feature Flags",
          url: "/feature-flags",
          icon: <ToggleLeftIcon />,
          items: [
            { title: "Active Flags", url: "/feature-flags" },
            { title: "Experiments", url: "/feature-flags/experiments" },
            { title: "Rollout Plans", url: "/feature-flags/rollouts" },
          ],
        },
      ],
    },
    {
      label: "Configuration",
      items: [
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
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarBrand />
        <SidebarSearch groups={data.navGroups} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain groups={data.navGroups} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
