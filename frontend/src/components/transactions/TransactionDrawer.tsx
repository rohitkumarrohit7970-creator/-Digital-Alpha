import { Transaction } from "@/types"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { format } from "date-fns"
import { Calendar, CreditCard, Hash, Store, Tag } from "lucide-react"

interface TransactionDrawerProps {
  transaction: Transaction | null
}

export function TransactionDrawer({ transaction }: TransactionDrawerProps) {
  if (!transaction) return null

  const formattedDate = format(new Date(transaction.transaction_timestamp), "MMM dd, yyyy 'at' h:mm a")

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b bg-muted/20">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg border border-primary/20">
            {transaction.merchant.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">{transaction.merchant}</h2>
            <p className="text-sm text-muted-foreground">{transaction.category || "Uncategorized"}</p>
          </div>
        </div>
        
        <div className="flex items-end gap-2 mt-6">
          <span className="text-3xl font-black text-foreground">
            {transaction.currency} {transaction.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </span>
          <StatusBadge status={transaction.status} className="mb-1.5" />
        </div>
      </div>

      <div className="p-6 flex-1 space-y-6">
        <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Transaction Details</h3>
        
        <div className="grid gap-4">
          <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
            <Hash className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground font-medium">Transaction ID</p>
              <p className="text-sm font-mono text-foreground">{transaction.id}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground font-medium">Date & Time</p>
              <p className="text-sm text-foreground">{formattedDate}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
            <CreditCard className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground font-medium">Payment Method</p>
              <p className="text-sm text-foreground">{transaction.payment_method}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
            <Store className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground font-medium">Merchant</p>
              <p className="text-sm text-foreground">{transaction.merchant}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
            <Tag className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground font-medium">Category</p>
              <p className="text-sm text-foreground">{transaction.category || "Uncategorized"}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-6 border-t bg-muted/10">
        <p className="text-xs text-center text-muted-foreground">
          If you have an issue with this transaction, please contact support and reference ID: <span className="font-mono">{transaction.id}</span>
        </p>
      </div>
    </div>
  )
}
