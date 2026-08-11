import { useQuery } from "@tanstack/react-query"

export interface DashboardSummary {
  total_spending: number
  successful_payments: number
  pending_payments: number
  reward_coins: number
}

export interface MonthlyAnalytics {
  month: string
  total_amount: number
  transaction_count: number
}

export interface CategoryAnalytics {
  category: string | null
  total_amount: number
  transaction_count: number
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081"

async function fetchSummary(): Promise<DashboardSummary> {
  const res = await fetch(`${API_URL}/api/analytics/summary`)
  if (!res.ok) throw new Error("Failed to fetch summary")
  return res.json()
}

async function fetchMonthly(): Promise<{ data: MonthlyAnalytics[] }> {
  const res = await fetch(`${API_URL}/api/analytics/monthly`)
  if (!res.ok) throw new Error("Failed to fetch monthly analytics")
  return res.json()
}

async function fetchCategories(): Promise<{ data: CategoryAnalytics[] }> {
  const res = await fetch(`${API_URL}/api/analytics/categories`)
  if (!res.ok) throw new Error("Failed to fetch category analytics")
  return res.json()
}

export function useDashboardSummary() {
  return useQuery({
    queryKey: ["dashboard", "summary"],
    queryFn: fetchSummary
  })
}

export function useMonthlyAnalytics() {
  return useQuery({
    queryKey: ["dashboard", "monthly"],
    queryFn: fetchMonthly
  })
}

export function useCategoryAnalytics() {
  return useQuery({
    queryKey: ["dashboard", "categories"],
    queryFn: fetchCategories
  })
}
