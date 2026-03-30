import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface CardProps {
  title: string
  description: string
  buttonLabel?: string
  onButtonClick?: () => void
  className?: string
}

function Card({ title, description, buttonLabel = "Get Started", onButtonClick, className }: CardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md",
        className
      )}
    >
      <div className="flex flex-col gap-1.5">
        <h3 className="text-lg font-semibold tracking-tight text-card-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
      <div className="mt-auto pt-2">
        <Button onClick={onButtonClick} className="w-full">
          {buttonLabel}
        </Button>
      </div>
    </div>
  )
}

export { Card }
export type { CardProps }
