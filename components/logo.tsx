import Image from "next/image"
import { cn } from "@/lib/utils"

const sizeMap = {
  xs: { container: "size-6", image: 16 },
  sm: { container: "size-8", image: 24 },
  md: { container: "size-10", image: 32 },
  lg: { container: "size-14", image: 44 },
  xl: { container: "size-20", image: 64 },
} as const

type LogoSize = keyof typeof sizeMap

interface LogoProps {
  /** Rendered size of the logo icon */
  size?: LogoSize
  /** Show "GEM-SPACE" text next to the logo */
  showText?: boolean
  /** Optional subtitle below GEM-SPACE */
  subtitle?: string
  /** Additional classes on the outer wrapper */
  className?: string
  /** Classes applied to the image container */
  containerClassName?: string
  /** Classes applied to the text group */
  textClassName?: string
}

export function Logo({
  size = "md",
  showText = false,
  subtitle,
  className,
  containerClassName,
  textClassName,
}: LogoProps) {
  const { container, image } = sizeMap[size]

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        className={cn(
          "relative flex shrink-0 items-center justify-center overflow-hidden rounded-lg",
          container,
          containerClassName
        )}
      >
        <Image
          src="/logo.svg"
          alt="GEM-SPACE"
          width={image}
          height={image}
          className="object-contain dark:brightness-110"
          priority
        />
      </div>

      {showText && (
        <div className={cn("grid text-left leading-tight", textClassName)}>
          <span className="truncate text-sm font-bold tracking-tight">
            Gemspace
          </span>
          {subtitle && (
            <span className="truncate text-[0.65rem] font-medium tracking-widest text-muted-foreground">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
