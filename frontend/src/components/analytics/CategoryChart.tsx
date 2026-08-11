"use client"

import * as React from "react"
import { useCategoryAnalytics } from "@/hooks/useAnalytics"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, TooltipProps } from "recharts"

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#a4de6c"
]

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-background border shadow-md rounded-lg p-3 text-sm flex items-center gap-2">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: data.fill || payload[0].color }} />
        <div>
          <p className="font-semibold">{data.category}</p>
          <p className="text-foreground">₹{data.total_amount?.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</p>
        </div>
      </div>
    )
  }
  return null
}

interface CategoryChartProps {
  onCategoryClick: (category: string) => void
  activeCategory?: string
}

export function CategoryChart({ onCategoryClick, activeCategory }: CategoryChartProps) {
  const { data, isLoading, isError } = useCategoryAnalytics()

  if (isLoading) {
    return <div className="h-full w-full bg-muted/20 animate-pulse rounded-full" />
  }

  if (isError || !data || data.data.length === 0) {
    return <div className="h-full w-full flex items-center justify-center text-muted-foreground text-sm">No data available</div>
  }

  // Filter out null/uncategorized for a cleaner chart, or map it
  const chartData = data.data.map(d => ({
    ...d,
    category: d.category || "Uncategorized"
  }))

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Tooltip content={<CustomTooltip />} />
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={2}
          dataKey="total_amount"
          nameKey="category"
          onClick={(data) => {
            if (data && data.category) {
              onCategoryClick(data.category === "Uncategorized" ? "" : data.category)
            }
          }}
          className="cursor-pointer focus:outline-none"
        >
          {chartData.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={COLORS[index % COLORS.length]} 
              opacity={activeCategory && activeCategory !== entry.category ? 0.3 : 1}
              stroke={activeCategory === entry.category ? "hsl(var(--foreground))" : "transparent"}
              strokeWidth={activeCategory === entry.category ? 2 : 0}
              className="transition-all duration-300 hover:opacity-80"
            />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  )
}
