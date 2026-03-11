"use client"

"use client"

import Link from "next/link"
import { Logo } from "@/components/logo"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function SidebarBrand() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" asChild>
          <Link href="/dashboard">
            <Logo
              size="sm"
              showText
              subtitle="Super Admin"
              textClassName="text-sidebar-foreground"
            />
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
