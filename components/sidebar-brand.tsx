"use client"

import Link from "next/link"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { XIcon } from "lucide-react"

export function SidebarBrand() {
  const { open, isMobile, toggleSidebar } = useSidebar()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex items-center gap-1">
          <SidebarMenuButton
            size="lg"
            asChild
            className="flex-1 hover:bg-sidebar-accent/50 active:bg-sidebar-accent/70"
          >
            <Link href="/dashboard" aria-label="Gemspace home">
              {open ? (
                /* Expanded — full logo with wordmark */
                <Logo size="lg" showText variant="light" />
              ) : (
                /* Collapsed icon rail — gem only, centred */
                <Logo size="md" variant="light" className="mx-auto" />
              )}
            </Link>
          </SidebarMenuButton>

          {/* Mobile close button — only visible when sheet is open */}
          {isMobile && open && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              aria-label="Close sidebar"
              className="size-8 shrink-0 rounded-md text-white/60 hover:bg-sidebar-accent/50 hover:text-white"
            >
              <XIcon className="size-4" />
            </Button>
          )}
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
