"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { HelpCircle, Target, DollarSign, Wrench, MapPin, BookOpen, Flame } from "lucide-react"

const scoringCriteria = [
  {
    icon: Target,
    emoji: "🎯",
    label: "Role Fit",
    points: "30 pts",
    description: "Job title contains toxicology, safety, hepatic, or preclinical keywords",
    color: "text-blue-600",
  },
  {
    icon: DollarSign,
    emoji: "💰",
    label: "Company Intent",
    points: "20 pts",
    description: "Recently funded (Series A/B), active hiring status, growth trajectory",
    color: "text-emerald-600",
  },
  {
    icon: Wrench,
    emoji: "🔧",
    label: "Tech Stack",
    points: "15 pts",
    description: "Already uses 3D models, NAMs, in-vitro tools, or similar technologies",
    color: "text-purple-600",
  },
  {
    icon: MapPin,
    emoji: "📍",
    label: "Location",
    points: "10 pts",
    description: "Based in biotech hubs: Boston, Bay Area, Basel, Cambridge UK",
    color: "text-amber-600",
  },
  {
    icon: BookOpen,
    emoji: "📚",
    label: "Research Activity",
    points: "40 pts",
    description: "Published relevant papers in hepatotoxicity or safety assessment in last 2 years",
    color: "text-rose-600",
  },
  {
    icon: Flame,
    emoji: "🔥",
    label: "Engagement",
    points: "10 pts",
    description: "Recent LinkedIn activity, conference attendance, webinar participation",
    color: "text-orange-600",
  },
]

export function ScoringLegend() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <HelpCircle className="h-4 w-4" />
          Scoring Guide
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-xl">Propensity Score Calculation</SheetTitle>
          <SheetDescription>How we rank and prioritize your leads</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
            <p className="text-sm text-blue-800">
              Our AI-powered scoring system evaluates each lead across 6 key dimensions, totaling up to{" "}
              <span className="font-semibold">125 points</span> (normalized to 0-100).
            </p>
          </div>

          <div className="space-y-4">
            {scoringCriteria.map((criteria) => (
              <div
                key={criteria.label}
                className="flex gap-4 p-4 bg-card rounded-lg border hover:shadow-sm transition-shadow"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <criteria.icon className={`h-5 w-5 ${criteria.color}`} />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{criteria.label}</span>
                    <span className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground">
                      {criteria.points}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{criteria.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
            <p className="text-sm text-amber-800">
              <span className="font-semibold">Pro tip:</span> Focus on leads scoring 70+ for highest conversion rates.
              Leads with high Research Activity scores often have immediate purchasing intent.
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
