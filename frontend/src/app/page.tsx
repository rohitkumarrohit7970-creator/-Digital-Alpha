import { TransactionDashboard } from "@/components/transactions/TransactionDashboard"

export default function Dashboard() {
  return (
    <div className="flex flex-col">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome back. Here&apos;s a summary of your account.</p>
      </div>

      <TransactionDashboard />
    </div>
  )
}
