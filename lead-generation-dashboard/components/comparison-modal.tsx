"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { type Lead, fundingStageColors, techStackColors } from "@/lib/lead-data"
import { Mail, Phone, Linkedin, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ComparisonModalProps {
  leads: Lead[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onRemoveLead: (id: string) => void
}

const scoreCategories = [
  { key: "roleFit", label: "Role Fit", max: 30 },
  { key: "companyIntent", label: "Company Intent", max: 20 },
  { key: "technographic", label: "Tech Stack", max: 15 },
  { key: "location", label: "Location", max: 10 },
  { key: "scientificIntent", label: "Research", max: 40 },
  { key: "engagement", label: "Engagement", max: 10 },
] as const

export function ComparisonModal({ leads, open, onOpenChange, onRemoveLead }: ComparisonModalProps) {
  const { toast } = useToast()

  if (leads.length === 0) return null

  const getHighestForCategory = (key: keyof Lead["scoreBreakdown"]) => {
    return Math.max(...leads.map((l) => l.scoreBreakdown[key]))
  }

  const handleEmail = (lead: Lead) => {
    window.location.href = `mailto:${lead.email}?subject=Regarding%20Collaboration%20Opportunity&body=Hi%20${encodeURIComponent(lead.name)},%0A%0AI%20wanted%20to%20reach%20out%20regarding...`
    toast({
      title: "Opening email client",
      description: `Composing email to ${lead.email}`,
    })
  }

  const handlePhone = (lead: Lead) => {
    window.location.href = `tel:${lead.phone}`
    toast({
      title: "Initiating call",
      description: `Calling ${lead.phone}`,
    })
  }

  const handleLinkedIn = (lead: Lead) => {
    window.open(`https://${lead.linkedin}`, "_blank", "noopener,noreferrer")
    toast({
      title: "Opening LinkedIn",
      description: `Viewing ${lead.name}'s profile`,
    })
  }

  const handleRemoveLead = (lead: Lead) => {
    onRemoveLead(lead.id)
    toast({
      title: "Removed from comparison",
      description: `${lead.name} removed from comparison`,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Compare Leads</DialogTitle>
          <DialogDescription>Side-by-side comparison of selected leads</DialogDescription>
        </DialogHeader>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 font-medium text-muted-foreground">Attribute</th>
                {leads.map((lead) => (
                  <th key={lead.id} className="text-left p-3 min-w-[200px]">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{lead.name}</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemoveLead(lead)}>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b bg-blue-50/50">
                <td className="p-3 font-medium">Total Score</td>
                {leads.map((lead) => (
                  <td key={lead.id} className="p-3">
                    <span className="text-2xl font-bold text-blue-600">{lead.score}</span>
                  </td>
                ))}
              </tr>
              <tr className="border-b">
                <td className="p-3 font-medium">Title</td>
                {leads.map((lead) => (
                  <td key={lead.id} className="p-3 text-sm">
                    {lead.title}
                  </td>
                ))}
              </tr>
              <tr className="border-b">
                <td className="p-3 font-medium">Company</td>
                {leads.map((lead) => (
                  <td key={lead.id} className="p-3 text-sm">
                    {lead.company}
                  </td>
                ))}
              </tr>
              <tr className="border-b">
                <td className="p-3 font-medium">Funding</td>
                {leads.map((lead) => (
                  <td key={lead.id} className="p-3">
                    <Badge className={fundingStageColors[lead.fundingStage]} variant="secondary">
                      {lead.fundingStage}
                    </Badge>
                  </td>
                ))}
              </tr>
              <tr className="border-b">
                <td className="p-3 font-medium">Location</td>
                {leads.map((lead) => (
                  <td key={lead.id} className="p-3 text-sm">
                    {lead.personalLocation}
                  </td>
                ))}
              </tr>
              <tr className="border-b">
                <td className="p-3 font-medium">Tech Stack</td>
                {leads.map((lead) => (
                  <td key={lead.id} className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {lead.techStack.map((tech) => (
                        <Badge
                          key={tech}
                          variant="outline"
                          className={`text-xs ${techStackColors[tech] || techStackColors["Traditional"]}`}
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>
              {scoreCategories.map((category) => {
                const highestValue = getHighestForCategory(category.key)
                return (
                  <tr key={category.key} className="border-b">
                    <td className="p-3 font-medium">{category.label}</td>
                    {leads.map((lead) => {
                      const value = lead.scoreBreakdown[category.key]
                      const isHighest = value === highestValue && leads.length > 1
                      return (
                        <td key={lead.id} className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className={`h-full ${isHighest ? "bg-emerald-500" : "bg-blue-500"}`}
                                style={{ width: `${(value / category.max) * 100}%` }}
                              />
                            </div>
                            <span className={`text-sm font-medium ${isHighest ? "text-emerald-600" : ""}`}>
                              {value}/{category.max}
                            </span>
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
              <tr className="border-b">
                <td className="p-3 font-medium">Contact</td>
                {leads.map((lead) => (
                  <td key={lead.id} className="p-3">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEmail(lead)}>
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handlePhone(lead)}>
                        <Phone className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleLinkedIn(lead)}>
                        <Linkedin className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  )
}
