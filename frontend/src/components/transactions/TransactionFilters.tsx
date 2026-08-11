import * as React from "react"
import { Search, X, SlidersHorizontal, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/Button"

interface FilterState {
  search: string
  category: string
  status: string
  start_date: string
  end_date: string
  min_amount: string
  max_amount: string
}

interface TransactionFiltersProps {
  filters: FilterState
  onFilterChange: (key: keyof FilterState, value: string) => void
  onClearFilters: () => void
}

export function TransactionFilters({ filters, onFilterChange, onClearFilters }: TransactionFiltersProps) {
  const [isExpanded, setIsExpanded] = React.useState(false)

  const categories = ["Food & Dining", "Shopping", "Travel", "Entertainment", "Groceries", "Utilities", "Health", "Fuel", "Insurance", "Education", "Uncategorized"]
  const statuses = ["SUCCESS", "FAILED", "PENDING"]

  const hasActiveFilters = Object.values(filters).some(v => v !== "")

  return (
    <div className="flex flex-col gap-4 p-4 bg-card border rounded-xl shadow-sm mb-2">
      <div className="flex flex-col md:flex-row gap-4">
        
        {/* Primary Row (Always Visible) */}
        <div className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search merchants..."
              value={filters.search}
              onChange={(e) => onFilterChange("search", e.target.value)}
              aria-label="Search merchants"
              className="w-full pl-9 pr-4 py-2 bg-background border rounded-md text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-all"
            />
          </div>
          
          <Button 
            variant="outline" 
            className="md:hidden px-3"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
            aria-label="Toggle advanced filters"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>

        {/* Clear Filters (Desktop) */}
        <div className="hidden md:flex items-center gap-2">
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={onClearFilters} className="h-9 px-3 text-xs text-muted-foreground hover:text-foreground">
              <X className="h-3 w-3 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Advanced Filters (Collapsible on Mobile) */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${isExpanded ? 'flex' : 'hidden md:grid'}`}>
        
        {/* Category */}
        <div className="space-y-1">
          <label htmlFor="filter-category" className="text-xs font-medium text-muted-foreground">Category</label>
          <select
            id="filter-category"
            value={filters.category}
            onChange={(e) => onFilterChange("category", e.target.value)}
            className="w-full px-3 py-2 bg-background border rounded-md text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-all"
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div className="space-y-1">
          <label htmlFor="filter-status" className="text-xs font-medium text-muted-foreground">Status</label>
          <select
            id="filter-status"
            value={filters.status}
            onChange={(e) => onFilterChange("status", e.target.value)}
            className="w-full px-3 py-2 bg-background border rounded-md text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-all"
          >
            <option value="">All Statuses</option>
            {statuses.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Amount Range */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Amount Range (₹)</label>
          <div className="flex gap-2 items-center">
            <input
              type="number"
              placeholder="Min"
              aria-label="Minimum amount"
              value={filters.min_amount}
              onChange={(e) => onFilterChange("min_amount", e.target.value)}
              className="w-full px-3 py-2 bg-background border rounded-md text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-all"
            />
            <span className="text-muted-foreground">-</span>
            <input
              type="number"
              placeholder="Max"
              aria-label="Maximum amount"
              value={filters.max_amount}
              onChange={(e) => onFilterChange("max_amount", e.target.value)}
              className="w-full px-3 py-2 bg-background border rounded-md text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-all"
            />
          </div>
        </div>

        {/* Date Range */}
        <div className="space-y-1 lg:col-span-1">
          <label className="text-xs font-medium text-muted-foreground">Date Range</label>
          <div className="flex gap-2 items-center">
            <input
              type="date"
              aria-label="Start date"
              value={filters.start_date}
              onChange={(e) => onFilterChange("start_date", e.target.value)}
              className="w-full px-3 py-2 bg-background border rounded-md text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-all text-muted-foreground"
            />
            <span className="text-muted-foreground">to</span>
            <input
              type="date"
              aria-label="End date"
              value={filters.end_date}
              onChange={(e) => onFilterChange("end_date", e.target.value)}
              className="w-full px-3 py-2 bg-background border rounded-md text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-all text-muted-foreground"
            />
          </div>
        </div>
        
        {/* Clear Filters (Mobile only, visible if expanded) */}
        {hasActiveFilters && (
          <div className="md:hidden flex justify-end mt-2">
            <Button variant="ghost" size="sm" onClick={onClearFilters} className="h-9 px-3 text-xs text-muted-foreground hover:text-foreground">
              <X className="h-3 w-3 mr-1" />
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
