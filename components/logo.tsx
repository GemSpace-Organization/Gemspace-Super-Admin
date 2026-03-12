import type { SVGProps } from "react"
import { cn } from "@/lib/utils"

// ─── Size tokens ──────────────────────────────────────────────────────────────
// iconPx   → rendered width of the gem SVG (height scales proportionally 50/55)
// nameSize → Tailwind text class for the brand name
// subSize  → Tailwind text class for the subtitle
// gap      → gap between icon and text
const sizeMap = {
  xs: {
    iconPx: 20,
    nameSize: "text-[0.8rem]",
    subSize: "text-[0.58rem]",
    gap: "gap-1.5",
  },
  sm: {
    iconPx: 28,
    nameSize: "text-[1rem]",
    subSize: "text-[0.6rem]",
    gap: "gap-2.5",
  },
  md: {
    iconPx: 36,
    nameSize: "text-[1.15rem]",
    subSize: "text-[0.65rem]",
    gap: "gap-3",
  },
  lg: {
    iconPx: 48,
    nameSize: "text-xl",
    subSize: "text-[0.7rem]",
    gap: "gap-3",
  },
  xl: { iconPx: 64, nameSize: "text-2xl", subSize: "text-sm", gap: "gap-3.5" },
  "2xl": {
    iconPx: 80,
    nameSize: "text-[2rem]",
    subSize: "text-base",
    gap: "gap-4",
  },
} as const

type LogoSize = keyof typeof sizeMap

// ─── Inline SVG gem mark ───────────────────────────────────────────────────────
// Using fixed brand fills so the gem looks crisp in any colour-scheme.
// Dark-mode enhancement is handled by a CSS drop-shadow filter on the wrapper.
function GemIcon({
  px,
  className,
  ...rest
}: { px: number } & SVGProps<SVGSVGElement>) {
  const h = Math.round((px / 55) * 50) // keep 55 × 50 aspect ratio
  return (
    <svg
      width={px}
      height={h}
      viewBox="0 0 55 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      className={className}
      {...rest}
    >
      {/* outer shell – warm gold */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.9988 1.62363L27.4976 0L42.9975 1.62363L54.9974 17.5856L27.4987 49.3174L0 17.5856L11.9988 1.62363Z"
        fill="#FDB300"
      />
      {/* left & right deep facets – burnt orange */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.1387 17.7783L27.4987 49.3182L0 17.7783H11.1387Z"
        fill="#EA6C00"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M43.8623 17.7783L27.5013 49.3182L55 17.7783H43.8623Z"
        fill="#EA6C00"
      />
      {/* lower-centre facet – amber */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.8867 17.7783H43.5416L27.2141 49.3182L10.8867 17.7783Z"
        fill="#FDAD00"
      />
      {/* upper-left & upper-right crown facets – bright yellow */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M26.9278 0L11.7305 1.64099L10.8867 17.7775L26.9278 0Z"
        fill="#FDD231"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M27.4941 0L42.6913 1.64099L43.5352 17.7775L27.4941 0Z"
        fill="#FDD231"
      />
      {/* far-left & far-right edge triangles – amber */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M55 17.7781L42.9686 1.7207L43.832 17.7781H55Z"
        fill="#FDAD00"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 17.7771L12.0303 1.71973L11.1669 17.7771H0Z"
        fill="#FDAD00"
      />
      {/* top table – pale champagne highlight */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M27.2259 0L10.8984 17.7775H43.5533L27.2259 0Z"
        fill="#FEEEB7"
      />
    </svg>
  )
}

// ─── Public component ─────────────────────────────────────────────────────────

export interface LogoProps {
  /** Rendered size preset */
  size?: LogoSize
  /** Show "Gemspace" wordmark next to the icon */
  showText?: boolean
  /** Second line below the wordmark — e.g. "Super Admin" */
  subtitle?: string
  /**
   * Colour variant for the text.
   * - `"auto"` (default) — brand purple in light mode, soft purple in dark mode
   * - `"light"` — white text; ideal for dark / coloured backgrounds (e.g. sidebar)
   * - `"dark"` — forces dark/brand text regardless of theme
   */
  variant?: "auto" | "light" | "dark"
  /** Extra classes on the outermost wrapper */
  className?: string
  /** Extra classes applied directly to the SVG icon */
  iconClassName?: string
  /** Extra classes on the text group */
  textClassName?: string
  /**
   * @deprecated Use `iconClassName` for icon-level overrides.
   * Kept for backward-compatibility with `containerClassName` callers.
   */
  containerClassName?: string
}
export function Logo({
  size = "md",
  showText = false,
  subtitle,
  variant = "auto",
  className,
  iconClassName,
  textClassName,
  containerClassName, // kept for compat, forwarded to iconClassName
}: LogoProps) {
  const { iconPx, nameSize, subSize, gap } = sizeMap[size]

  return (
    <div className={cn("flex items-center", gap, className)}>
      {/* Icon — dark:drop-shadow adds a warm golden halo on dark surfaces */}
      <GemIcon
        px={iconPx}
        className={cn(
          "shrink-0 transition-[filter] duration-300",
          "dark:drop-shadow-[0_0_6px_rgba(253,179,0,0.35)]",
          iconClassName ?? containerClassName
        )}
      />

      {showText && (
        <div
          className={cn(
            "grid text-left leading-snug select-none",
            textClassName
          )}
        >
          {/* Brand name */}
          <span
            className={cn(
              "truncate leading-none font-extrabold tracking-[-0.025em] select-none",
              nameSize,
              variant === "light"
                ? "text-white"
                : variant === "dark"
                  ? "text-[#3B3A96]"
                  : "text-[#3B3A96] dark:text-[#a09ff5]"
            )}
          >
            Gemspace
          </span>

          {/* Subtitle */}
          {subtitle && (
            <span
              className={cn(
                "truncate font-medium tracking-[0.12em] uppercase",
                subSize,
                variant === "light"
                  ? "text-white/70"
                  : variant === "dark"
                    ? "text-[#3B3A96]/60"
                    : "text-muted-foreground"
              )}
            >
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
