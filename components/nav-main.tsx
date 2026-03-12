"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { ChevronRightIcon } from "lucide-react"

interface NavItem {
  title: string
  url: string
  icon?: React.ReactNode
  isActive?: boolean
  items?: { title: string; url: string }[]
}

interface NavGroup {
  label: string
  items: NavItem[]
}

export function NavMain({ groups }: { groups: NavGroup[] }) {
  const pathname = usePathname()
  const { open, isMobile, toggleSidebar } = useSidebar()
  // When the sidebar is collapsed to icon rail, sub-menus are invisible.
  // Treat parent items as direct links so clicking the icon navigates.
  const isIconOnly = !open && !isMobile

  // Close the sidebar sheet when navigating on mobile
  function handleNavClick() {
    if (isMobile) toggleSidebar()
  }

  return (
    <>
      {groups.map((group) => (
        <SidebarGroup key={group.label}>
          <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
          <SidebarMenu>
            {group.items.map((item) => {
              const isActive =
                pathname === item.url ||
                item.items?.some((sub) => pathname === sub.url)

              if (!item.items || item.items.length === 0) {
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={isActive}
                      className="[&>svg]:size-[18px]"
                    >
                      <Link href={item.url} onClick={handleNavClick}>
                        {item.icon}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              }

              // ── Icon-only (collapsed) mode: navigate directly ─────────────
              if (isIconOnly) {
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      isActive={isActive}
                      className="[&>svg]:size-[18px]"
                    >
                      <Link href={item.url} onClick={handleNavClick}>
                        {item.icon}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              }

              // ── Expanded mode: collapsible with sub-items ─────────────────
              return (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={item.isActive || isActive}
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        isActive={isActive}
                        className="[&>svg:not(.chevron)]:size-[18px]"
                      >
                        {item.icon}
                        <span>{item.title}</span>
                        <ChevronRightIcon className="chevron ml-auto size-3.5 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={pathname === subItem.url}
                            >
                              <Link href={subItem.url} onClick={handleNavClick}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  )
}
