import * as React from "react"
import { AlertCircle } from "lucide-react"
import { Button } from "./Button"
import { cn } from "@/lib/utils"

interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  message?: string
  onRetry?: () => void
}

export function ErrorState({
  title = "Something went wrong",
  message = "There was an error loading the data. Please try again later.",
  onRetry,
  className,
  ...props
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-destructive/20 bg-destructive/5 p-8 text-center text-destructive",
        className
      )}
      {...props}
    >
      <AlertCircle className="h-10 w-10 mb-4 opacity-80" />
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 mb-6 text-sm opacity-80 max-w-sm">{message}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry} className="border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground">
          Try Again
        </Button>
      )}
    </div>
  )
}
