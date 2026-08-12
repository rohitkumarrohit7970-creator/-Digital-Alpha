"use client"

import * as React from "react"
import { useMonthlyAnalytics } from "@/hooks/useAnalytics"
import { Area, AreaChart, ResponsiveContainer, Tooltip, TooltipProps, XAxis, YAxis } from "recharts"
import { format, parseISO } from "date-fns"

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border shadow-md rounded-lg p-3 text-sm">
        <p className="font-semibold mb-1">{label}</p>
        <p className="text-primary font-medium">
          ₹{payload[0].value?.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
        </p>
        <p className="text-muted-foreground text-xs mt-1">
          {payload[0].payload.transaction_count} transactions
        </p>
      </div>
    )
  }
  return null
}

export function MonthlyChart() {
  const { data, isLoading, isError } = useMonthlyAnalytics()

  if (isLoading) {
    return <div className="h-full w-full bg-muted/20 animate-pulse rounded-md" />
  }

  if (isError || !data || data.data.length === 0) {
    return <div className="h-full w-full flex items-center justify-center text-muted-foreground text-sm">No data available</div>
  }

  // Reverse data to show chronological order (API returns DESC by default)
  const chartData = [...data.data].reverse().map(d => ({
    ...d,
    formattedMonth: format(parseISO(`${d.month}-01`), "MMM yy")
  }))

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis 
          dataKey="formattedMonth" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} 
          dy={10}
        />
        <YAxis 
          hide
          domain={['dataMin', 'dataMax']} 
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'hsl(var(--muted))', strokeWidth: 2, strokeDasharray: '4 4' }} />
        <Area 
          type="monotone" 
          dataKey="total_amount" 
          stroke="hsl(var(--primary))" 
          strokeWidth={3}
          fillOpacity={1} 
          fill="url(#colorAmount)" 
          activeDot={{ r: 6, fill: "hsl(var(--primary))", stroke: "hsl(var(--background))", strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
