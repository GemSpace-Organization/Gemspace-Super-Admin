import { InfoIcon } from "lucide-react"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

type TableGuideProps = {
  title: string
  summary: string
  points: string[]
}

export function TableGuide({ title, summary, points }: TableGuideProps) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-t-xl border-b bg-muted/20 px-3 py-2.5">
      <p className="text-xs text-muted-foreground">{summary}</p>
      <HoverCard openDelay={120} closeDelay={100}>
        <HoverCardTrigger asChild>
          <button
            type="button"
            className="inline-flex size-7 items-center justify-center rounded-full border bg-background text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Open table guidance"
          >
            <InfoIcon className="size-3.5" />
          </button>
        </HoverCardTrigger>
        <HoverCardContent align="end" className="w-84 p-3">
          <p className="text-sm font-semibold">{title}</p>
          <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
            {points.map((point) => (
              <li key={point}>• {point}</li>
            ))}
          </ul>
        </HoverCardContent>
      </HoverCard>
    </div>
  )
}
