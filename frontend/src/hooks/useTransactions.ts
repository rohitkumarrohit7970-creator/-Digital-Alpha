import { useQuery } from "@tanstack/react-query"
import { Transaction, PaginatedResponse } from "@/types"

export interface TransactionFilters {
  page: number
  page_size: number
  search?: string
  category?: string
  status?: string
  start_date?: string
  end_date?: string
  min_amount?: string
  max_amount?: string
  sort_by: string
  sort_order: string
}

async function fetchTransactions(filters: TransactionFilters): Promise<PaginatedResponse<Transaction>> {
  const params = new URLSearchParams()
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "" && value !== null) {
      params.append(key, String(value))
    }
  })

  // Using the absolute URL or relative if proxied
  const API_URL = process.env.NEXT_PUBLIC_API_URL || ""
  const response = await fetch(`${API_URL}/api/transactions?${params.toString()}`)
  
  if (!response.ok) {
    throw new Error("Network response was not ok")
  }
  
  return response.json()
}

export function useTransactions(filters: TransactionFilters) {
  return useQuery({
    queryKey: ["transactions", filters],
    queryFn: () => fetchTransactions(filters),
    placeholderData: (previousData) => previousData // Keep previous data while fetching new (prevents layout shift)
  })
}
