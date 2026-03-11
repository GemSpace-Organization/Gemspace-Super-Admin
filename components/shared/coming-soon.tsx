"use client"

import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface ComingSoonProps {
  title: string
  description: string
  icon?: React.ReactNode
  features?: string[]
  progress?: number
}

export function ComingSoon({
  title,
  description,
  icon,
  features,
  progress = 35,
}: ComingSoonProps) {
  return (
    <div className="flex h-full flex-col gap-6 py-4">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard">
            <ArrowLeftIcon className="mr-1.5 size-3.5" />
            Dashboard
          </Link>
        </Button>
        <Badge variant="outline" className="gap-1.5 border-teal/30 text-teal">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal/60" />
            <span className="relative inline-flex size-1.5 rounded-full bg-teal" />
          </span>
          In Development
        </Badge>
      </div>

      {/* Main content area */}
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="w-full max-w-2xl">
          {/* Hero section */}
          <div className="text-center">
            <div className="mx-auto flex size-14 items-center justify-center">
              {icon ?? <Logo size="lg" />}
            </div>
            <h1 className="mt-5 text-2xl font-bold tracking-tight">{title}</h1>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          </div>

          {/* Progress indicator */}
          <div className="mx-auto mt-8 max-w-xs">
            <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>Development progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>

          {/* Features grid */}
          {features && features.length > 0 && (
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {features.map((feature, i) => (
                <Card key={feature} className="border-dashed">
                  <CardContent className="flex items-start gap-3 p-4">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-semibold text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-sm">{feature}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer info */}
      <div className="text-center text-xs text-muted-foreground">
        This module is part of the GEM-SPACE Super Admin platform. Check back
        for updates.
      </div>
    </div>
  )
}
