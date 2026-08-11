"use client"

import * as React from "react"
import { useBalance } from "@/hooks/useRewards"
import { Wallet } from "lucide-react"

export function DashboardHeader() {
  const { data, isLoading } = useBalance()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 mx-auto px-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold">
            DA
          </div>
          <span className="font-bold text-xl hidden sm:inline-block">Digital Alpha</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <a href="#" className="transition-colors hover:text-primary text-foreground">Dashboard</a>
          <a href="#transactions-table" className="transition-colors hover:text-primary text-muted-foreground">Transactions</a>
          <a href="#rewards" className="transition-colors hover:text-primary text-muted-foreground">Rewards</a>
        </nav>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-500 rounded-full border border-amber-500/20 font-medium cursor-default">
            <Wallet className="h-4 w-4" />
            {isLoading ? (
              <span className="w-12 h-4 bg-amber-500/20 animate-pulse rounded" />
            ) : (
              <span>{data?.coin_balance?.toLocaleString() || 0} Coins</span>
            )}
          </div>
          <div className="h-8 w-8 rounded-full bg-muted border overflow-hidden flex items-center justify-center text-xs font-semibold">
            US
          </div>
        </div>
      </div>
    </header>
  )
}
