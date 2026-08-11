import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export interface Reward {
  id: string
  name: string
  description: string | null
  coin_cost: number
  reward_type: string
  value: string
  active: boolean
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081"

async function fetchRewards(): Promise<Reward[]> {
  const res = await fetch(`${API_URL}/api/rewards`)
  if (!res.ok) throw new Error("Failed to fetch rewards")
  return res.json()
}

async function fetchBalance(): Promise<{ coin_balance: number }> {
  const res = await fetch(`${API_URL}/api/rewards/balance`)
  if (!res.ok) throw new Error("Failed to fetch balance")
  return res.json()
}

async function redeemReward(rewardId: string): Promise<{ message: string; redemption: unknown; new_balance: number }> {
  const res = await fetch(`${API_URL}/api/rewards/${rewardId}/redeem`, {
    method: "POST",
  })
  
  const data = await res.json()
  
  if (!res.ok) {
    throw new Error(data.detail || "Failed to redeem reward")
  }
  
  return data
}

export function useRewards() {
  return useQuery({
    queryKey: ["rewards"],
    queryFn: fetchRewards,
  })
}

export function useBalance() {
  return useQuery({
    queryKey: ["balance"],
    queryFn: fetchBalance,
  })
}

export function useRedeemReward() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: redeemReward,
    onSuccess: () => {
      // Refresh balance and dashboard summary upon successful redemption
      queryClient.invalidateQueries({ queryKey: ["balance"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard", "summary"] })
    }
  })
}
