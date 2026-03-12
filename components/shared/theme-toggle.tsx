"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { MonitorIcon, MoonIcon, SunIcon, CheckIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"

function useIsMac() {
  const [isMac, setIsMac] = React.useState(false)
  React.useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().includes("MAC"))
  }, [])
  return isMac
}

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const isMac = useIsMac()

  React.useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="size-8">
        <SunIcon className="size-4" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8">
          {theme === "dark" ? (
            <MoonIcon className="size-4" />
          ) : theme === "system" ? (
            <MonitorIcon className="size-4" />
          ) : (
            <SunIcon className="size-4" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
          Appearance
        </DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className={theme === "light" ? "bg-accent" : ""}
        >
          <SunIcon className="size-4" />
          Light
          {theme === "light" && (
            <CheckIcon className="ml-auto size-3.5 text-primary" />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className={theme === "dark" ? "bg-accent" : ""}
        >
          <MoonIcon className="size-4" />
          Dark
          {theme === "dark" && (
            <CheckIcon className="ml-auto size-3.5 text-primary" />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className={theme === "system" ? "bg-accent" : ""}
        >
          <MonitorIcon className="size-4" />
          System
          {theme === "system" && (
            <CheckIcon className="ml-auto size-3.5 text-primary" />
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="px-2 py-1.5 text-[0.65rem] leading-relaxed text-muted-foreground">
          Toggle:{" "}
          <kbd className="rounded border bg-muted px-1 py-0.5 font-mono text-[0.6rem]">
            {isMac ? "\u2318" : "Ctrl"}
          </kbd>
          {" + "}
          <kbd className="rounded border bg-muted px-1 py-0.5 font-mono text-[0.6rem]">
            D
          </kbd>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
