import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <Logo size="lg" className="justify-center" />

        <p className="mt-6 text-6xl font-bold tracking-tight text-indigo">
          404
        </p>
        <h1 className="mt-2 text-xl font-semibold">Page not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you are looking for does not exist or has been moved. If you
          believe this is an error, contact the platform team.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button
            asChild
            className="bg-indigo text-indigo-foreground hover:bg-indigo/90"
          >
            <Link href="/dashboard">
              <ArrowLeftIcon className="mr-1.5 size-3.5" />
              Back to Dashboard
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/support-center">Contact Support</Link>
          </Button>
        </div>

        <p className="mt-10 text-xs text-muted-foreground">
          GEM-SPACE Super Admin &middot; Multi-Tenant Platform
        </p>
      </div>
    </div>
  )
}
