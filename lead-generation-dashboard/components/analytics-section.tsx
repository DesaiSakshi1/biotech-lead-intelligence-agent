"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Lead } from "@/lib/lead-data"
import { useMemo } from "react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts"

interface AnalyticsSectionProps {
  leads: Lead[]
}

const FUNDING_COLORS: Record<string, string> = {
  Seed: "#94a3b8",
  "Series A": "#10b981",
  "Series B": "#3b82f6",
  "Series C": "#8b5cf6",
  Public: "#f59e0b",
}

const LOCATION_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4"]

export function AnalyticsSection({ leads }: AnalyticsSectionProps) {
  const scoreDistribution = useMemo(() => {
    const ranges = [
      { range: "0-20", min: 0, max: 20 },
      { range: "21-40", min: 21, max: 40 },
      { range: "41-60", min: 41, max: 60 },
      { range: "61-80", min: 61, max: 80 },
      { range: "81-100", min: 81, max: 100 },
    ]

    return ranges.map(({ range, min, max }) => ({
      range,
      count: leads.filter((l) => l.score >= min && l.score <= max).length,
    }))
  }, [leads])

  const fundingDistribution = useMemo(() => {
    const counts: Record<string, number> = {}
    leads.forEach((lead) => {
      counts[lead.fundingStage] = (counts[lead.fundingStage] || 0) + 1
    })
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [leads])

  const locationDistribution = useMemo(() => {
    const counts: Record<string, number> = {}
    leads.forEach((lead) => {
      const location =
        lead.personalLocation.includes("MA") || lead.personalLocation.includes("Boston")
          ? "Boston Area"
          : lead.personalLocation.includes("CA") ||
              lead.personalLocation.includes("San Francisco") ||
              lead.personalLocation.includes("San Diego")
            ? "California"
            : lead.personalLocation.includes("UK") || lead.personalLocation.includes("Cambridge")
              ? "UK"
              : lead.personalLocation.includes("Basel") || lead.personalLocation.includes("Switzerland")
                ? "Switzerland"
                : "Other"
      counts[location] = (counts[location] || 0) + 1
    })
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }, [leads])

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Score Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreDistribution}>
                <XAxis dataKey="range" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Funding Stage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={fundingDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={60}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {fundingDistribution.map((entry) => (
                    <Cell key={entry.name} fill={FUNDING_COLORS[entry.name] || "#94a3b8"} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Legend
                  iconSize={8}
                  wrapperStyle={{ fontSize: "11px" }}
                  formatter={(value) => <span className="text-foreground">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Geographic Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={locationDistribution} layout="vertical">
                <XAxis type="number" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" fontSize={11} tickLine={false} axisLine={false} width={80} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {locationDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={LOCATION_COLORS[index % LOCATION_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
