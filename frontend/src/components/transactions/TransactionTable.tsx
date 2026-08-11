import { Transaction } from "@/types"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { format } from "date-fns"
import { ArrowDown, ArrowUp, ArrowUpDown, CreditCard, Landmark, Smartphone } from "lucide-react"

interface TransactionTableProps {
  transactions: Transaction[]
  isLoading: boolean
  sortBy: string
  sortOrder: string
  onSort: (column: string) => void
  onRowClick: (transaction: Transaction) => void
}

export function TransactionTable({ transactions, isLoading, sortBy, sortOrder, onSort, onRowClick }: TransactionTableProps) {
  const getSortIcon = (columnName: string) => {
    if (sortBy !== columnName) return <ArrowUpDown className="h-3 w-3 text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity" />
    if (sortOrder === "asc") return <ArrowUp className="h-3 w-3 text-primary" />
    return <ArrowDown className="h-3 w-3 text-primary" />
  }

  const handleSort = (column: string) => {
    onSort(column)
  }

  const getPaymentIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case "upi": return <Smartphone className="h-4 w-4 text-emerald-500" />
      case "netbanking": return <Landmark className="h-4 w-4 text-blue-500" />
      default: return <CreditCard className="h-4 w-4 text-amber-500" />
    }
  }

  if (isLoading) {
    return (
      <div className="w-full bg-card rounded-xl border shadow-sm p-4">
        <div className="space-y-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex gap-4 items-center">
              <div className="h-10 w-full bg-muted animate-pulse rounded-md"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="w-full bg-card rounded-xl border shadow-sm p-12 flex flex-col items-center justify-center text-center">
        <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <ArrowUpDown className="h-8 w-8 text-muted-foreground opacity-50" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">No transactions found</h3>
        <p className="text-muted-foreground mt-1 max-w-sm">Try adjusting your filters or search terms to find what you&apos;re looking for.</p>
      </div>
    )
  }

  return (
    <div className="w-full bg-card rounded-xl border shadow-sm overflow-hidden">
      {/* DESKTOP TABLE VIEW */}
      <div className="hidden md:block overflow-x-auto relative h-[600px] rounded-xl">
        <table className="w-full text-sm text-left relative">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/95 backdrop-blur border-b sticky top-0 z-10 shadow-sm">
            <tr>
              <th 
                className="px-4 py-3 cursor-pointer group hover:bg-muted transition-colors"
                onClick={() => handleSort("transaction_timestamp")}
              >
                <div className="flex items-center gap-1">
                  Date {getSortIcon("transaction_timestamp")}
                </div>
              </th>
              <th className="px-4 py-3">Merchant</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Payment Method</th>
              <th 
                className="px-4 py-3 cursor-pointer group hover:bg-muted transition-colors text-right"
                onClick={() => handleSort("amount")}
              >
                <div className="flex items-center justify-end gap-1">
                  Amount {getSortIcon("amount")}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {transactions.map((tx) => (
              <tr 
                key={tx.id} 
                onClick={() => onRowClick(tx)}
                className="group hover:bg-muted/50 transition-colors cursor-pointer"
                role="button"
                aria-label={`View transaction ${tx.merchant}`}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    onRowClick(tx)
                  }
                }}
              >
                <td className="px-4 py-4 whitespace-nowrap text-muted-foreground">
                  {format(new Date(tx.transaction_timestamp), "MMM dd, yyyy")}
                </td>
                <td className="px-4 py-4 whitespace-nowrap font-medium text-foreground">
                  {tx.merchant}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-muted-foreground">
                  {tx.category || "Uncategorized"}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <StatusBadge status={tx.status} />
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    {getPaymentIcon(tx.payment_method)}
                    {tx.payment_method}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right font-medium text-foreground">
                  {tx.currency} {tx.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARD VIEW */}
      <div className="md:hidden divide-y divide-border">
        {/* Mobile Sort Controls */}
        <div className="bg-muted/50 p-3 flex gap-2 overflow-x-auto hide-scrollbar border-b">
          <button 
            onClick={() => handleSort("transaction_timestamp")}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${sortBy === 'transaction_timestamp' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-background text-muted-foreground hover:bg-muted'}`}
          >
            Sort by Date {sortBy === 'transaction_timestamp' && (sortOrder === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
          </button>
          <button 
            onClick={() => handleSort("amount")}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${sortBy === 'amount' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-background text-muted-foreground hover:bg-muted'}`}
          >
            Sort by Amount {sortBy === 'amount' && (sortOrder === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
          </button>
        </div>

        {transactions.map((tx) => (
          <div 
            key={tx.id} 
            onClick={() => onRowClick(tx)}
            className="p-4 hover:bg-muted/50 transition-colors active:bg-muted cursor-pointer flex flex-col gap-3"
          >
            <div className="flex justify-between items-start gap-2">
              <div>
                <h4 className="font-semibold text-foreground text-base leading-tight">{tx.merchant}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">{tx.category || "Uncategorized"}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-foreground leading-tight">
                  {tx.currency} {tx.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {format(new Date(tx.transaction_timestamp), "MMM dd, yyyy")}
                </p>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <StatusBadge status={tx.status} />
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                {getPaymentIcon(tx.payment_method)}
                {tx.payment_method}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
