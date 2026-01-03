"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import type { Lead } from "@/lib/lead-data"
import { Target, DollarSign, Wrench, MapPin, BookOpen, Flame } from "lucide-react"

interface ScoreBreakdownModalProps {
  lead: Lead | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const scoreCategories = [
  {
    key: "roleFit",
    label: "Role Fit",
    icon: Target,
    max: 30,
    color: "bg-blue-500",
    description: "Job title relevance to toxicology/safety",
  },
  {
    key: "companyIntent",
    label: "Company Intent",
    icon: DollarSign,
    max: 20,
    color: "bg-emerald-500",
    description: "Funding stage & growth signals",
  },
  {
    key: "technographic",
    label: "Tech Stack",
    icon: Wrench,
    max: 15,
    color: "bg-purple-500",
    description: "Uses similar technology",
  },
  {
    key: "location",
    label: "Location",
    icon: MapPin,
    max: 10,
    color: "bg-amber-500",
    description: "Biotech hub proximity",
  },
  {
    key: "scientificIntent",
    label: "Research Activity",
    icon: BookOpen,
    max: 40,
    color: "bg-rose-500",
    description: "Recent relevant publications",
  },
  {
    key: "engagement",
    label: "Engagement",
    icon: Flame,
    max: 10,
    color: "bg-orange-500",
    description: "Activity signals",
  },
] as const

export function ScoreBreakdownModal({ lead, open, onOpenChange }: ScoreBreakdownModalProps) {
  if (!lead) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">Score Breakdown</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {lead.name} • {lead.company}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-5">
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
            <span className="font-medium text-blue-900">Total Propensity Score</span>
            <span className="text-3xl font-bold text-blue-600">{lead.score}</span>
          </div>

          <div className="space-y-4">
            {scoreCategories.map((category) => {
              const score = lead.scoreBreakdown[category.key]
              const percentage = (score / category.max) * 100

              return (
                <div key={category.key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <category.icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{category.label}</span>
                    </div>
                    <span className="text-sm font-semibold">
                      {score}/{category.max}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${category.color} transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">{category.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
