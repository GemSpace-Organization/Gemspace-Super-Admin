import type { Metadata } from "next"
import { Geist_Mono, Nunito_Sans } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { ReactQueryProvider } from "@/providers/react-query-provider"

const nunitoSans = Nunito_Sans({ variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: {
    default: "Gemspace Super Admin",
    template: "%s | Gemspace Super Admin",
  },
  description:
    "Platform administration dashboard for Gemspace — manage institutions, users, and platform operations.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        nunitoSans.variable
      )}
    >
      <body>
        <ReactQueryProvider>
          <TooltipProvider>
            <ThemeProvider>
              {children}
              <Toaster position="top-center" richColors={false} />
            </ThemeProvider>
          </TooltipProvider>
        </ReactQueryProvider>
      </body>
    </html>
  )
}
