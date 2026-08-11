"use client"

import * as React from "react"
import { useTransactions, TransactionFilters as FilterType } from "@/hooks/useTransactions"
import { useDashboardSummary } from "@/hooks/useAnalytics"
import { useDebounce } from "@/hooks/useDebounce"
import { Transaction } from "@/types"

import { TransactionFilters } from "./TransactionFilters"
import { TransactionTable } from "./TransactionTable"
import { TransactionDrawer } from "./TransactionDrawer"
import { Pagination } from "@/components/ui/Pagination"
import { Drawer } from "@/components/ui/Drawer"
import { StatCard } from "@/components/ui/StatCard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { MonthlyChart } from "@/components/analytics/MonthlyChart"
import { CategoryChart } from "@/components/analytics/CategoryChart"
import { RewardsSection } from "@/components/rewards/RewardsSection"
import { Activity, CreditCard, DollarSign, Gift, ArrowRight } from "lucide-react"

const initialFilters = {
  search: "",
  category: "",
  status: "",
  start_date: "",
  end_date: "",
  min_amount: "",
  max_amount: "",
}

export function TransactionDashboard() {
  // Filters state
  const [filters, setFilters] = React.useState(initialFilters)
  const debouncedSearch = useDebounce(filters.search, 300)
  
  // Pagination & Sorting state
  const [page, setPage] = React.useState(1)
  const [pageSize] = React.useState(25)
  const [sortBy, setSortBy] = React.useState("transaction_timestamp")
  const [sortOrder, setSortOrder] = React.useState("desc")

  // Drawer state
  const [selectedTx, setSelectedTx] = React.useState<Transaction | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)

  // API Calls
  const { data: summaryData, isLoading: isSummaryLoading } = useDashboardSummary()
  
  const { data, isLoading, isError } = useTransactions({
    page,
    page_size: pageSize,
    search: debouncedSearch,
    category: filters.category,
    status: filters.status,
    start_date: filters.start_date,
    end_date: filters.end_date,
    min_amount: filters.min_amount,
    max_amount: filters.max_amount,
    sort_by: sortBy,
    sort_order: sortOrder,
  })

  // Handlers
  const handleFilterChange = (key: keyof typeof initialFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPage(1)
  }

  const handleClearFilters = () => {
    setFilters(initialFilters)
    setPage(1)
  }

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(prev => prev === "asc" ? "desc" : "asc")
    } else {
      setSortBy(column)
      setSortOrder("desc")
    }
    setPage(1)
  }

  const handleRowClick = (tx: Transaction) => {
    setSelectedTx(tx)
    setIsDrawerOpen(true)
  }

  const handleCategoryClick = (category: string) => {
    // If clicking the active category, clear it. Otherwise, set it.
    if (filters.category === category) {
      handleFilterChange("category", "")
    } else {
      handleFilterChange("category", category)
      
      // Optional: scroll smoothly down to transactions
      document.getElementById('transactions-table')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="flex flex-col w-full gap-8 animate-in fade-in-50 duration-700">
      
      {/* SUMMARY CARDS */}
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Spending"
          value={isSummaryLoading ? "..." : `₹${(summaryData?.total_spending || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`}
          description="Lifetime successful payments"
          icon={<DollarSign className="h-4 w-4" />}
        />
        <StatCard
          title="Successful Payments"
          value={isSummaryLoading ? "..." : (summaryData?.successful_payments || 0).toLocaleString()}
          description="Completed transactions"
          icon={<Activity className="h-4 w-4" />}
        />
        <StatCard
          title="Pending Payments"
          value={isSummaryLoading ? "..." : (summaryData?.pending_payments || 0).toLocaleString()}
          description="Awaiting settlement"
          icon={<CreditCard className="h-4 w-4" />}
        />
        <StatCard
          title="Reward Coins"
          value={isSummaryLoading ? "..." : (summaryData?.reward_coins || 0).toLocaleString()}
          description="Earned from transactions"
          icon={<Gift className="h-4 w-4" />}
        />
      </section>

      {/* ANALYTICS CHARTS */}
      <section className="grid gap-4 md:grid-cols-7 lg:grid-cols-7">
        <Card className="md:col-span-4 shadow-sm">
          <CardHeader>
            <CardTitle>Spending Trends</CardTitle>
            <CardDescription>Your monthly transaction volume</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] w-full">
            <MonthlyChart />
          </CardContent>
        </Card>

        <Card className="md:col-span-3 shadow-sm relative overflow-hidden group">
          <CardHeader>
            <CardTitle>Top Categories</CardTitle>
            <CardDescription>Click a slice to filter your transactions</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] w-full pb-8">
            <CategoryChart 
              onCategoryClick={handleCategoryClick} 
              activeCategory={filters.category}
            />
          </CardContent>
          {filters.category && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center animate-in slide-in-from-bottom-5">
              <span className="bg-primary/90 text-primary-foreground text-xs font-medium px-3 py-1 rounded-full shadow-md flex items-center gap-1 cursor-pointer hover:bg-primary" onClick={() => handleFilterChange("category", "")}>
                Filtering by {filters.category}
                <ArrowRight className="h-3 w-3 ml-1" />
              </span>
            </div>
          )}
        </Card>
      </section>

      {/* TRANSACTIONS TABLE */}
      <section id="transactions-table" className="flex flex-col gap-6 pt-4 scroll-mt-24">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Transactions</h2>
            <p className="text-muted-foreground mt-1 text-sm">Review and filter your financial history.</p>
          </div>
          <div className="text-sm font-medium text-muted-foreground bg-muted/50 px-3 py-1 rounded-full border hidden sm:block">
            {data ? (
              <span>Showing {((page - 1) * pageSize) + 1} - {Math.min(page * pageSize, data.total)} of {data.total}</span>
            ) : (
              <span className="opacity-0">Loading...</span>
            )}
          </div>
        </div>

        {isError && (
          <div className="p-8 text-center bg-red-500/10 border border-red-500/20 rounded-xl mb-4">
            <h3 className="text-red-500 font-bold mb-2">Error loading transactions</h3>
            <p className="text-red-400 text-sm">Please check your connection and try again.</p>
          </div>
        )}

        <TransactionFilters 
          filters={filters} 
          onFilterChange={handleFilterChange} 
          onClearFilters={handleClearFilters}
        />

        <TransactionTable 
          transactions={data?.transactions || []}
          isLoading={isLoading}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          onRowClick={handleRowClick}
        />

        {data && data.total_pages > 1 && (
          <div className="mt-4 mb-12">
            <Pagination 
              currentPage={page} 
              totalPages={data.total_pages} 
              onPageChange={setPage} 
            />
          </div>
        )}
      </section>

      <Drawer 
        open={isDrawerOpen} 
        onOpenChange={(open) => {
          setIsDrawerOpen(open)
          if (!open) setTimeout(() => setSelectedTx(null), 300)
        }}
        position="right"
      >
        <TransactionDrawer transaction={selectedTx} />
      </Drawer>

      <div className="mt-8 border-t pt-8" id="rewards">
        <RewardsSection />
      </div>
    </div>
  )
}
