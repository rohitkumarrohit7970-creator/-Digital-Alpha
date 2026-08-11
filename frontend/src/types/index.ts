export interface Transaction {
  id: string
  user_id: string
  merchant: string
  category: string | null
  amount: number
  currency: string
  status: string
  payment_method: string
  transaction_timestamp: string
  created_at: string
}

export interface PaginatedResponse<T> {
  transactions: T[]
  page: number
  page_size: number
  total: number
  total_pages: number
}
