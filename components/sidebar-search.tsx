"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar"
import { SearchIcon, ArrowRightIcon, XIcon } from "lucide-react"

// ─── Types ────────────────────────────────────────────────────────────────────

interface SearchableItem {
  title: string
  url: string
  group: string
  /** parent title for sub-items */
  parent?: string
  icon?: React.ReactNode
}

interface NavSubItem {
  title: string
  url: string
}

interface NavItem {
  title: string
  url: string
  icon?: React.ReactNode
  items?: NavSubItem[]
}

interface NavGroup {
  label: string
  items: NavItem[]
}

interface SidebarSearchProps {
  groups: NavGroup[]
}

// ─── Fuzzy matching ───────────────────────────────────────────────────────────

function fuzzyScore(query: string, text: string): number {
  const q = query.toLowerCase()
  const t = text.toLowerCase()

  // Exact substring — highest score
  if (t.includes(q)) return 100

  // Word-start matching — e.g. "rp" matches "Roles & Permissions"
  const words = t.split(/\s+/)
  const initials = words.map((w) => w[0]).join("")
  if (initials.includes(q)) return 80

  // Sequential character matching
  let qi = 0
  let score = 0
  let consecutive = 0
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) {
      qi++
      consecutive++
      score += consecutive * 2 // reward consecutive matches
    } else {
      consecutive = 0
    }
  }

  if (qi < q.length) return 0 // not all chars matched
  // Normalise: shorter text with same hits scores higher
  return Math.round((score / t.length) * 50)
}

function searchItems(items: SearchableItem[], query: string): SearchableItem[] {
  if (!query.trim()) return []

  return items
    .map((item) => ({ item, score: fuzzyScore(query, item.title) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map(({ item }) => item)
}

// ─── Component ────────────────────────────────────────────────────────────────

export function SidebarSearch({ groups }: SidebarSearchProps) {
  const router = useRouter()
  const { open, toggleSidebar, isMobile } = useSidebar()
  const inputRef = React.useRef<HTMLInputElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [query, setQuery] = React.useState("")
  const [isFocused, setIsFocused] = React.useState(false)
  const [selectedIndex, setSelectedIndex] = React.useState(-1)

  // Flatten nav groups into a searchable list
  const searchIndex = React.useMemo<SearchableItem[]>(() => {
    const items: SearchableItem[] = []
    for (const group of groups) {
      for (const item of group.items) {
        items.push({
          title: item.title,
          url: item.url,
          group: group.label,
          icon: item.icon,
        })
        if (item.items) {
          for (const sub of item.items) {
            items.push({
              title: sub.title,
              url: sub.url,
              group: group.label,
              parent: item.title,
            })
          }
        }
      }
    }
    return items
  }, [groups])

  const results = React.useMemo(
    () => searchItems(searchIndex, query),
    [searchIndex, query]
  )

  // Close dropdown when clicking outside
  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsFocused(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Reset selection when results change
  React.useEffect(() => {
    setSelectedIndex(-1)
  }, [results])

  function navigate(url: string) {
    router.push(url)
    setQuery("")
    setIsFocused(false)
    if (isMobile) toggleSidebar()
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((i) => Math.max(i - 1, 0))
    } else if (
      e.key === "Enter" &&
      selectedIndex >= 0 &&
      results[selectedIndex]
    ) {
      e.preventDefault()
      navigate(results[selectedIndex].url)
    } else if (e.key === "Escape") {
      setQuery("")
      setIsFocused(false)
      inputRef.current?.blur()
    }
  }

  // ── Collapsed icon-only: just show a search icon button ──────────────────
  const isIconOnly = !open && !isMobile

  if (isIconOnly) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            tooltip="Search"
            onClick={() => {
              toggleSidebar()
              // wait for sidebar animation then focus
              setTimeout(() => inputRef.current?.focus(), 250)
            }}
            className="text-sidebar-foreground/60 hover:text-sidebar-foreground"
          >
            <SearchIcon className="size-4.5" />
            <span>Search</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  // ── Expanded: full search input with dropdown ─────────────────────────────
  const showDropdown = isFocused && query.trim().length > 0

  return (
    <div ref={containerRef} className="relative px-2">
      {/* Input wrapper */}
      <div
        className={cn(
          "flex h-8 items-center gap-2 rounded-md border px-2 transition-colors duration-150",
          "border-sidebar-border/50 bg-sidebar-accent/30",
          isFocused
            ? "border-sidebar-primary/60 bg-sidebar-accent/50 ring-1 ring-sidebar-primary/25"
            : "hover:bg-sidebar-accent/50"
        )}
      >
        <SearchIcon className="size-3.5 shrink-0 text-sidebar-foreground/40" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search…"
          className={cn(
            "flex-1 bg-transparent text-xs text-sidebar-foreground outline-none",
            "placeholder:text-sidebar-foreground/35"
          )}
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("")
              inputRef.current?.focus()
            }}
            className="text-sidebar-foreground/40 hover:text-sidebar-foreground/70"
            tabIndex={-1}
          >
            <XIcon className="size-3" />
          </button>
        )}
        <kbd className="hidden rounded border border-sidebar-border/40 bg-sidebar-accent/40 px-1 py-0.5 font-mono text-[0.55rem] text-sidebar-foreground/30 select-none sm:inline-block">
          /
        </kbd>
      </div>

      {/* Dropdown results */}
      {showDropdown && (
        <div className="absolute top-[calc(100%+4px)] right-2 left-2 z-50 max-h-64 overflow-y-auto rounded-md border border-sidebar-border/60 bg-sidebar shadow-lg shadow-black/20">
          {results.length > 0 ? (
            <ul className="py-1" role="listbox">
              {results.map((item, i) => (
                <li
                  key={item.url + item.title}
                  role="option"
                  aria-selected={i === selectedIndex}
                >
                  <button
                    type="button"
                    onClick={() => navigate(item.url)}
                    onMouseEnter={() => setSelectedIndex(i)}
                    className={cn(
                      "flex w-full items-center gap-2.5 px-2.5 py-2 text-left text-xs transition-colors",
                      i === selectedIndex
                        ? "bg-sidebar-accent text-sidebar-foreground"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50"
                    )}
                  >
                    <ArrowRightIcon className="size-3 shrink-0 text-sidebar-foreground/30" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{item.title}</p>
                      <p className="truncate text-[0.65rem] text-sidebar-foreground/40">
                        {item.parent ? `${item.parent} › ` : ""}
                        {item.group}
                      </p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-3 py-4 text-center">
              <p className="text-xs font-medium text-sidebar-foreground/50">
                No results for &ldquo;{query}&rdquo;
              </p>
              <p className="mt-1 text-[0.65rem] text-sidebar-foreground/30">
                Try a different term like &ldquo;tenants&rdquo;,
                &ldquo;settings&rdquo;, or &ldquo;users&rdquo;
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
