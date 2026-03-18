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
import { useAuthBootstrap } from "@/features/auth/hooks/use-auth"
import { useAuthStore } from "@/features/auth/store/auth.store"
import { useVerificationQueueQuery } from "@/features/super-admin/hooks/use-super-admin"

type SidebarSubItem = {
  title: string
  url: string
}

type SidebarItem = {
  title: string
  url: string
  icon: React.ReactNode
  isActive?: boolean
  items?: SidebarSubItem[]
}

type SidebarGroupData = {
  label: string
  items: SidebarItem[]
}

const baseNavGroups: SidebarGroupData[] = [
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
        title: "Institutions",
        url: "/institutions",
        icon: <BuildingIcon />,
        items: [
          { title: "All Institutions", url: "/institutions" },
          {
            title: "Verification Queue",
            url: "/institutions/verification",
          },
          { title: "Deleted Institutions", url: "/institutions/deleted" },
        ],
      },
      {
        title: "Institution Admins",
        url: "/institution-admins",
        icon: <UserCogIcon />,
        items: [
          { title: "All Institution Admins", url: "/institution-admins" },
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
        title: "Monitoring",
        url: "/monitoring",
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
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  useAuthBootstrap()
  const authUser = useAuthStore((state) => state.user)
  const verificationQueueQuery = useVerificationQueueQuery({
    page: 1,
    limit: 1,
  })

  const pendingVerificationCount = verificationQueueQuery.data?.total ?? 0

  const navGroups = React.useMemo(() => {
    const verificationTitle =
      pendingVerificationCount > 0
        ? `Verification Queue (${pendingVerificationCount})`
        : "Verification Queue"

    return baseNavGroups.map((group) => ({
      ...group,
      items: group.items.map((item) => {
        if (item.url !== "/institutions" || !item.items) {
          return item
        }

        return {
          ...item,
          items: item.items.map((subItem) =>
            subItem.url === "/institutions/verification"
              ? { ...subItem, title: verificationTitle }
              : subItem
          ),
        }
      }),
    }))
  }, [pendingVerificationCount])

  const sidebarUser = {
    name:
      authUser && (authUser.firstName || authUser.lastName)
        ? `${authUser.firstName} ${authUser.lastName}`.trim()
        : "Super Admin",
    email: authUser?.email ?? "admin@gemspace.live",
    avatar: "",
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarBrand />
        <SidebarSearch groups={navGroups} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain groups={navGroups} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
