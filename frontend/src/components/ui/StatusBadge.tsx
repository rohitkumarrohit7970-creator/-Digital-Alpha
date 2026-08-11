import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: string
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalizedStatus = status.toUpperCase()
  
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold shadow-sm",
        {
          "bg-emerald-500/10 text-emerald-500 border-emerald-500/20": normalizedStatus === "SUCCESS",
          "bg-red-500/10 text-red-500 border-red-500/20": normalizedStatus === "FAILED",
          "bg-amber-500/10 text-amber-500 border-amber-500/20": normalizedStatus === "PENDING",
        },
        className
      )}
    >
      {normalizedStatus === "SUCCESS" && <span className="mr-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />}
      {normalizedStatus === "FAILED" && <span className="mr-1 h-1.5 w-1.5 rounded-full bg-red-500" />}
      {normalizedStatus === "PENDING" && <span className="mr-1 h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />}
      {normalizedStatus}
    </div>
  )
}
