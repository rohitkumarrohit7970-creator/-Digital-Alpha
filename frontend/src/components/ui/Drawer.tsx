"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

interface DrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
  position?: "right" | "bottom"
}

export function Drawer({ open, onOpenChange, children, position = "right" }: DrawerProps) {
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false)
    }
    
    if (open) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }
    
    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "auto"
    }
  }, [open, onOpenChange])

  if (!open) return null

  return (
    <>
      <div 
        className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm animate-in fade-in-0 duration-300"
        onClick={() => onOpenChange(false)}
      />
      <div 
        className={cn(
          "fixed z-50 bg-background border-border shadow-2xl flex flex-col",
          position === "right" 
            ? "right-0 top-0 h-full w-full sm:w-[400px] border-l animate-in slide-in-from-right-full duration-300" 
            : "bottom-0 left-0 right-0 h-[80vh] border-t rounded-t-xl animate-in slide-in-from-bottom-full duration-300"
        )}
        role="dialog"
        aria-modal="true"
      >
        <button 
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 rounded-full p-2 hover:bg-muted transition-colors"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </>
  )
}
