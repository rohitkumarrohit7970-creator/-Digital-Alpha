"use client"

import * as React from "react"
import { Reward, useRedeemReward } from "@/hooks/useRewards"
import { Button } from "@/components/ui/Button"
import { X, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"

interface RedemptionModalProps {
  reward: Reward | null
  currentBalance: number
  isOpen: boolean
  onClose: () => void
}

export function RedemptionModal({ reward, currentBalance, isOpen, onClose }: RedemptionModalProps) {
  const { mutateAsync: redeem, isPending } = useRedeemReward()
  
  const [success, setSuccess] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Reset state when reward changes
  const prevReward = React.useRef(reward?.id)
  if (reward?.id !== prevReward.current) {
    prevReward.current = reward?.id
    setSuccess(false)
    setError(null)
  }

  if (!isOpen || !reward) return null

  const handleRedeem = async () => {
    setError(null)
    try {
      await redeem(reward.id)
      setSuccess(true)
      // Auto close after 2 seconds on success
      setTimeout(() => {
        onClose()
        setTimeout(() => {
          setSuccess(false)
        }, 300)
      }, 2000)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Something went wrong. Please try again.")
      }
    }
  }

  const remainingBalance = currentBalance - reward.coin_cost

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-card border shadow-xl rounded-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold text-lg">Confirm Redemption</h2>
          <button 
            onClick={onClose}
            disabled={isPending}
            className="p-1 rounded-md hover:bg-muted text-muted-foreground transition-colors disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {success ? (
            <div className="flex flex-col items-center justify-center py-6 text-center animate-in zoom-in duration-300">
              <CheckCircle2 className="h-16 w-16 text-emerald-500 mb-4" />
              <h3 className="text-xl font-bold text-foreground">Redemption Successful!</h3>
              <p className="text-muted-foreground mt-2">Enjoy your {reward.name}.</p>
            </div>
          ) : (
            <>
              <div className="text-center">
                <p className="text-lg text-foreground">Redeem this reward for <span className="font-bold text-amber-500">{reward.coin_cost} coins</span>?</p>
                <p className="text-sm font-semibold mt-1 text-primary">{reward.name}</p>
              </div>

              {error && (
                <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 text-red-600 rounded-lg text-sm">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <div className="bg-muted/30 rounded-xl p-4 space-y-3 text-sm">
                <div className="flex justify-between items-center text-muted-foreground">
                  <span>Current Balance</span>
                  <span className="font-mono text-foreground">{currentBalance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-muted-foreground border-b pb-3">
                  <span>Reward Cost</span>
                  <span className="font-mono text-red-500">-{reward.coin_cost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center font-semibold pt-1">
                  <span>Remaining Balance</span>
                  <span className="font-mono text-foreground">{remainingBalance.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button 
                  variant="outline" 
                  className="flex-1" 
                  onClick={onClose}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1" 
                  onClick={handleRedeem}
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing
                    </>
                  ) : (
                    "Confirm"
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
