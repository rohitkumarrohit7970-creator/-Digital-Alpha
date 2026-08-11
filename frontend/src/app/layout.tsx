import type { Metadata } from "next"
import "./globals.css"
import { QueryProvider } from "@/components/providers/QueryProvider"
import { DashboardHeader } from "@/components/layout/DashboardHeader"

export const metadata: Metadata = {
  title: "Digital Alpha Technologies",
  description: "Digital Alpha Full Stack Assignment",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen flex flex-col">
        <QueryProvider>
          <DashboardHeader />
          <main className="flex-1 container mx-auto px-4 py-8">
            {children}
          </main>
        </QueryProvider>
      </body>
    </html>
  )
}
