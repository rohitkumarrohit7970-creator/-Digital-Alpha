"use client"

import * as React from "react"
import { Reward } from "@/hooks/useRewards"
import { Button } from "@/components/ui/Button"
import { Gift, Percent, Music, Ticket, Plane } from "lucide-react"

interface RewardCardProps {
  reward: Reward
  currentBalance: number
  onRedeemClick: (reward: Reward) => void
}

export function RewardCard({ reward, currentBalance, onRedeemClick }: RewardCardProps) {
  const isAffordable = currentBalance >= reward.coin_cost

  // Dynamic icon based on reward type
  const getIcon = () => {
    switch (reward.reward_type) {
      case "gift_card": return <Gift className="h-6 w-6" />
      case "discount": return <Percent className="h-6 w-6" />
      case "subscription": return <Music className="h-6 w-6" />
      case "voucher":
        if (reward.name.toLowerCase().includes("flight") || reward.name.toLowerCase().includes("makemytrip")) {
          return <Plane className="h-6 w-6" />
        }
        return <Ticket className="h-6 w-6" />
      default: return <Gift className="h-6 w-6" />
    }
  }

  return (
    <div className={`relative flex flex-col p-6 rounded-2xl border transition-all duration-300 ${isAffordable ? 'bg-card hover:shadow-md hover:border-primary/30' : 'bg-muted/10 opacity-70 grayscale-[50%]'}`}>
      <div className={`h-12 w-12 rounded-full mb-4 flex items-center justify-center ${isAffordable ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
        {getIcon()}
      </div>
      
      <div className="flex-1">
        <h3 className="font-semibold text-lg text-foreground mb-1 leading-tight">{reward.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{reward.description}</p>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Cost</span>
          <span className={`font-bold text-lg flex items-center gap-1 ${isAffordable ? 'text-amber-500' : 'text-muted-foreground'}`}>
            <span className="text-amber-500 text-sm">🪙</span> {reward.coin_cost.toLocaleString()}
          </span>
        </div>

        <Button 
          onClick={() => onRedeemClick(reward)} 
          disabled={!isAffordable || !reward.active}
          variant={isAffordable ? "default" : "outline"}
        >
          {isAffordable ? 'Redeem' : 'Not enough coins'}
        </Button>
      </div>
    </div>
  )
}
