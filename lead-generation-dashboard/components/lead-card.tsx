"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { type Lead, fundingStageColors, techStackColors, statusColors } from "@/lib/lead-data"
import {
  Mail,
  Phone,
  Linkedin,
  Star,
  StarOff,
  BarChart3,
  MapPin,
  Building2,
  Calendar,
  FileText,
  Copy,
  Check,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface LeadCardProps {
  lead: Lead
  onScoreClick: () => void
  onWatchToggle: () => void
}

export function LeadCard({ lead, onScoreClick, onWatchToggle }: LeadCardProps) {
  const { toast } = useToast()
  const [emailModalOpen, setEmailModalOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600 bg-emerald-50 border-emerald-200"
    if (score >= 60) return "text-blue-600 bg-blue-50 border-blue-200"
    if (score >= 40) return "text-amber-600 bg-amber-50 border-amber-200"
    return "text-slate-600 bg-slate-50 border-slate-200"
  }

  const handleEmail = () => {
    setEmailModalOpen(true)
    setCopied(false)
  }

  const copyEmailToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(lead.email)
      setCopied(true)
      toast({
        title: "Email copied!",
        description: `${lead.email} copied to clipboard`,
      })
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast({
        title: "Copy failed",
        description: "Please select and copy the email manually",
        variant: "destructive",
      })
    }
  }

  const handlePhone = () => {
    window.location.href = `tel:${lead.phone}`
    toast({
      title: "Initiating call",
      description: `Calling ${lead.phone}`,
    })
  }

  const handleLinkedIn = () => {
    window.open(`https://${lead.linkedin}`, "_blank", "noopener,noreferrer")
    toast({
      title: "Opening LinkedIn",
      description: `Viewing ${lead.name}'s profile`,
    })
  }

  const handleWatchToggle = () => {
    onWatchToggle()
    toast({
      title: lead.isWatched ? "Removed from watchlist" : "Added to watchlist",
      description: `${lead.name} ${lead.isWatched ? "removed from" : "added to"} your watchlist`,
    })
  }

  return (
    <>
      <Card className="group hover:shadow-lg transition-all duration-200 border-2 hover:border-blue-200">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">#{lead.rank}</span>
                <Badge className={statusColors[lead.status]} variant="secondary">
                  {lead.status}
                </Badge>
              </div>
              <h3 className="font-semibold text-lg truncate">{lead.name}</h3>
              <p className="text-sm text-muted-foreground truncate">{lead.title}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <button
                onClick={onScoreClick}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border font-semibold text-lg cursor-pointer hover:scale-105 transition-transform ${getScoreColor(lead.score)}`}
              >
                {lead.score}
                <BarChart3 className="h-4 w-4" />
              </button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleWatchToggle}>
                {lead.isWatched ? (
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                ) : (
                  <StarOff className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="font-medium truncate">{lead.company}</span>
            <Badge className={fundingStageColors[lead.fundingStage]} variant="secondary">
              {lead.fundingStage}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="truncate">{lead.personalLocation}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Building2 className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="truncate">HQ: {lead.hqLocation}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
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

          <div className="p-3 bg-muted/50 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-muted-foreground">Last Publication:</span>
              <span className="font-medium">{new Date(lead.lastPublication).toLocaleDateString()}</span>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <FileText className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
              <p className="text-muted-foreground line-clamp-2">{lead.publicationTitle}</p>
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button size="sm" className="flex-1 gap-1.5" onClick={handleEmail}>
              <Mail className="h-3.5 w-3.5" />
              Email
            </Button>
            <Button size="sm" variant="outline" className="gap-1.5 bg-transparent" onClick={handlePhone}>
              <Phone className="h-3.5 w-3.5" />
            </Button>
            <Button size="sm" variant="outline" className="gap-1.5 bg-transparent" onClick={handleLinkedIn}>
              <Linkedin className="h-3.5 w-3.5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={emailModalOpen} onOpenChange={setEmailModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Contact {lead.name}</DialogTitle>
            <DialogDescription>Copy the email address below to reach out</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="flex-1 font-medium select-all">{lead.email}</span>
              <Button size="sm" variant="outline" className="gap-1.5 bg-transparent" onClick={copyEmailToClipboard}>
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <div className="space-y-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-sm font-medium text-blue-900">Suggested subject:</p>
              <p className="text-sm text-blue-700">Collaboration Opportunity - {lead.company}</p>
            </div>
            <div className="text-xs text-muted-foreground">
              <p>
                <strong>Company:</strong> {lead.company}
              </p>
              <p>
                <strong>Title:</strong> {lead.title}
              </p>
              <p>
                <strong>Location:</strong> {lead.personalLocation}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
