"use client"

import type React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { type Lead, fundingStageColors, techStackColors, statusColors } from "@/lib/lead-data"
import { Mail, Phone, Linkedin, Star, StarOff, ChevronUp, ChevronDown, BarChart3 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"

interface LeadTableProps {
  leads: Lead[]
  selectedLeads: Set<string>
  onSelectLead: (id: string, checked: boolean) => void
  onSelectAll: (checked: boolean) => void
  onWatchToggle: (id: string) => void
  onScoreClick: (lead: Lead) => void
  sortField: keyof Lead | null
  sortDirection: "asc" | "desc"
  onSort: (field: keyof Lead) => void
}

export function LeadTable({
  leads,
  selectedLeads,
  onSelectLead,
  onSelectAll,
  onWatchToggle,
  onScoreClick,
  sortField,
  sortDirection,
  onSort,
}: LeadTableProps) {
  const { toast } = useToast()

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600 bg-emerald-50"
    if (score >= 60) return "text-blue-600 bg-blue-50"
    if (score >= 40) return "text-amber-600 bg-amber-50"
    return "text-slate-600 bg-slate-50"
  }

  const SortIndicator = ({ field }: { field: keyof Lead }) => {
    if (sortField !== field) return null
    return sortDirection === "asc" ? (
      <ChevronUp className="h-4 w-4 inline ml-1" />
    ) : (
      <ChevronDown className="h-4 w-4 inline ml-1" />
    )
  }

  const SortableHeader = ({ field, children }: { field: keyof Lead; children: React.ReactNode }) => (
    <TableHead className="cursor-pointer hover:bg-muted/50 select-none whitespace-nowrap" onClick={() => onSort(field)}>
      {children}
      <SortIndicator field={field} />
    </TableHead>
  )

  const handleEmail = (lead: Lead, e: React.MouseEvent) => {
    e.stopPropagation()
    window.location.href = `mailto:${lead.email}?subject=Regarding%20Collaboration%20Opportunity&body=Hi%20${encodeURIComponent(lead.name)},%0A%0AI%20wanted%20to%20reach%20out%20regarding...`
    toast({
      title: "Opening email client",
      description: `Composing email to ${lead.email}`,
    })
  }

  const handlePhone = (lead: Lead, e: React.MouseEvent) => {
    e.stopPropagation()
    window.location.href = `tel:${lead.phone}`
    toast({
      title: "Initiating call",
      description: `Calling ${lead.phone}`,
    })
  }

  const handleLinkedIn = (lead: Lead, e: React.MouseEvent) => {
    e.stopPropagation()
    window.open(`https://${lead.linkedin}`, "_blank", "noopener,noreferrer")
    toast({
      title: "Opening LinkedIn",
      description: `Viewing ${lead.name}'s profile`,
    })
  }

  const handleWatchToggle = (lead: Lead) => {
    onWatchToggle(lead.id)
    toast({
      title: lead.isWatched ? "Removed from watchlist" : "Added to watchlist",
      description: `${lead.name} ${lead.isWatched ? "removed from" : "added to"} your watchlist`,
    })
  }

  return (
    <TooltipProvider>
      <div className="rounded-lg border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedLeads.size === leads.length && leads.length > 0}
                    onCheckedChange={(checked) => onSelectAll(checked as boolean)}
                  />
                </TableHead>
                <SortableHeader field="rank">Rank</SortableHeader>
                <SortableHeader field="score">Score</SortableHeader>
                <SortableHeader field="name">Name</SortableHeader>
                <SortableHeader field="title">Title</SortableHeader>
                <SortableHeader field="company">Company</SortableHeader>
                <TableHead className="whitespace-nowrap">Location</TableHead>
                <SortableHeader field="fundingStage">Funding</SortableHeader>
                <TableHead className="whitespace-nowrap">Tech Stack</TableHead>
                <SortableHeader field="lastPublication">Last Pub.</SortableHeader>
                <TableHead>Contact</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id} className="group hover:bg-muted/30 transition-colors">
                  <TableCell>
                    <Checkbox
                      checked={selectedLeads.has(lead.id)}
                      onCheckedChange={(checked) => onSelectLead(lead.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell className="font-medium text-muted-foreground">#{lead.rank}</TableCell>
                  <TableCell>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => onScoreClick(lead)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-semibold text-sm cursor-pointer hover:scale-105 transition-transform ${getScoreColor(lead.score)}`}
                        >
                          {lead.score}
                          <BarChart3 className="h-3 w-3" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Click to see score breakdown</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{lead.name}</span>
                      <Badge className={`w-fit mt-1 ${statusColors[lead.status]}`} variant="secondary">
                        {lead.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                    <span className="truncate block" title={lead.title}>
                      {lead.title}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">{lead.company}</TableCell>
                  <TableCell>
                    <div className="space-y-1 text-sm">
                      <div className="text-foreground">{lead.personalLocation}</div>
                      <div className="text-muted-foreground text-xs">HQ: {lead.hqLocation}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={fundingStageColors[lead.fundingStage]} variant="secondary">
                      {lead.fundingStage}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-[180px]">
                      {lead.techStack.slice(0, 2).map((tech) => (
                        <Badge
                          key={tech}
                          variant="outline"
                          className={`text-xs ${techStackColors[tech] || techStackColors["Traditional"]}`}
                        >
                          {tech}
                        </Badge>
                      ))}
                      {lead.techStack.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{lead.techStack.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {new Date(lead.lastPublication).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => handleEmail(lead, e)}>
                            <Mail className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{lead.email}</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => handlePhone(lead, e)}>
                            <Phone className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{lead.phone}</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => handleLinkedIn(lead, e)}
                          >
                            <Linkedin className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>View LinkedIn</TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleWatchToggle(lead)}>
                      {lead.isWatched ? (
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ) : (
                        <StarOff className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </TooltipProvider>
  )
}
