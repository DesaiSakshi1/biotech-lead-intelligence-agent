"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { Lead } from "@/lib/lead-data"
import { Users, TrendingUp, Star, Building2 } from "lucide-react"

interface StatsCardsProps {
  leads: Lead[]
  filteredLeads: Lead[]
}

export function StatsCards({ leads, filteredLeads }: StatsCardsProps) {
  const totalLeads = filteredLeads.length
  const avgScore = Math.round(filteredLeads.reduce((sum, l) => sum + l.score, 0) / filteredLeads.length) || 0
  const highValueLeads = filteredLeads.filter((l) => l.score >= 70).length
  const watchedLeads = leads.filter((l) => l.isWatched).length

  const stats = [
    {
      label: "Total Leads",
      value: totalLeads,
      icon: Users,
      change: `of ${leads.length}`,
      color: "text-blue-600",
    },
    {
      label: "Avg. Score",
      value: avgScore,
      icon: TrendingUp,
      change: "points",
      color: "text-emerald-600",
    },
    {
      label: "High Value (70+)",
      value: highValueLeads,
      icon: Star,
      change: `${Math.round((highValueLeads / totalLeads) * 100) || 0}%`,
      color: "text-amber-600",
    },
    {
      label: "Watching",
      value: watchedLeads,
      icon: Building2,
      change: "leads",
      color: "text-purple-600",
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-bold">{stat.value}</span>
                  <span className="text-xs text-muted-foreground">{stat.change}</span>
                </div>
              </div>
              <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
