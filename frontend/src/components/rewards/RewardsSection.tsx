"use client"

import * as React from "react"
import { useRewards, useBalance, Reward } from "@/hooks/useRewards"
import { RewardCard } from "./RewardCard"
import { RedemptionModal } from "./RedemptionModal"
import { Gift } from "lucide-react"

export function RewardsSection() {
  const { data: rewards, isLoading: isRewardsLoading, isError: isRewardsError } = useRewards()
  const { data: balanceData, isLoading: isBalanceLoading } = useBalance()

  const [selectedReward, setSelectedReward] = React.useState<Reward | null>(null)
  const [isModalOpen, setIsModalOpen] = React.useState(false)

  const handleRedeemClick = (reward: Reward) => {
    setSelectedReward(reward)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  if (isRewardsError) {
    return (
      <div className="p-8 text-center bg-red-500/10 border border-red-500/20 rounded-xl">
        <h3 className="text-red-500 font-bold mb-2">Error loading rewards</h3>
        <p className="text-red-400 text-sm">Please check your connection and try again.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-2">
        <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
          <Gift className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Rewards Catalogue</h2>
          <p className="text-muted-foreground text-sm">Redeem your coins for exclusive vouchers and discounts.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isRewardsLoading || isBalanceLoading ? (
          // Skeletons
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-[200px] bg-muted/20 animate-pulse rounded-2xl border" />
          ))
        ) : (
          rewards?.map(reward => (
            <RewardCard 
              key={reward.id} 
              reward={reward} 
              currentBalance={balanceData?.coin_balance || 0}
              onRedeemClick={handleRedeemClick}
            />
          ))
        )}
      </div>

      <RedemptionModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        reward={selectedReward}
        currentBalance={balanceData?.coin_balance || 0}
      />
    </div>
  )
}
