"use client"

import { useState, useMemo } from "react"
import { sampleLeads, type Lead } from "@/lib/lead-data"
import { LeadTable } from "@/components/lead-table"
import { LeadCard } from "@/components/lead-card"
import { FiltersSection } from "@/components/filters-section"
import { StatsCards } from "@/components/stats-cards"
import { AnalyticsSection } from "@/components/analytics-section"
import { ScoringLegend } from "@/components/scoring-legend"
import { ScoreBreakdownModal } from "@/components/score-breakdown-modal"
import { ComparisonModal } from "@/components/comparison-modal"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FlaskConical, LayoutGrid, Table2, GitCompare, Star, TrendingUp } from "lucide-react"

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>(sampleLeads)
  const [searchQuery, setSearchQuery] = useState("")
  const [scoreRange, setScoreRange] = useState<[number, number]>([0, 100])
  const [selectedLocation, setSelectedLocation] = useState("All Locations")
  const [selectedTitle, setSelectedTitle] = useState("All Titles")
  const [selectedFunding, setSelectedFunding] = useState("All Stages")
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set())
  const [sortField, setSortField] = useState<keyof Lead | null>("rank")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [scoreModalOpen, setScoreModalOpen] = useState(false)
  const [comparisonOpen, setComparisonOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"table" | "cards">("table")

  const hasActiveFilters = useMemo(() => {
    return (
      searchQuery !== "" ||
      scoreRange[0] !== 0 ||
      scoreRange[1] !== 100 ||
      selectedLocation !== "All Locations" ||
      selectedTitle !== "All Titles" ||
      selectedFunding !== "All Stages"
    )
  }, [searchQuery, scoreRange, selectedLocation, selectedTitle, selectedFunding])

  const filteredLeads = useMemo(() => {
    let result = leads.filter((lead) => {
      const matchesSearch =
        searchQuery === "" ||
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.personalLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.hqLocation.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesScore = lead.score >= scoreRange[0] && lead.score <= scoreRange[1]

      const matchesLocation =
        selectedLocation === "All Locations" ||
        lead.personalLocation
          .toLowerCase()
          .includes(selectedLocation.toLowerCase().replace(", ", "").replace("Area", ""))

      const matchesTitle =
        selectedTitle === "All Titles" || lead.title.toLowerCase().includes(selectedTitle.toLowerCase())

      const matchesFunding = selectedFunding === "All Stages" || lead.fundingStage === selectedFunding

      return matchesSearch && matchesScore && matchesLocation && matchesTitle && matchesFunding
    })

    if (sortField) {
      result = [...result].sort((a, b) => {
        const aVal = a[sortField]
        const bVal = b[sortField]

        if (typeof aVal === "string" && typeof bVal === "string") {
          return sortDirection === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
        }

        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortDirection === "asc" ? aVal - bVal : bVal - aVal
        }

        return 0
      })
    }

    return result
  }, [leads, searchQuery, scoreRange, selectedLocation, selectedTitle, selectedFunding, sortField, sortDirection])

  const topLeads = useMemo(() => filteredLeads.slice(0, 6), [filteredLeads])
  const watchedLeads = useMemo(() => leads.filter((l) => l.isWatched), [leads])
  const comparisonLeads = useMemo(() => {
    return leads.filter((l) => selectedLeads.has(l.id))
  }, [leads, selectedLeads])

  const handleSort = (field: keyof Lead) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleSelectLead = (id: string, checked: boolean) => {
    setSelectedLeads((prev) => {
      const next = new Set(prev)
      if (checked) {
        next.add(id)
      } else {
        next.delete(id)
      }
      return next
    })
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedLeads(new Set(filteredLeads.map((l) => l.id)))
    } else {
      setSelectedLeads(new Set())
    }
  }

  const handleWatchToggle = (id: string) => {
    setLeads((prev) => prev.map((lead) => (lead.id === id ? { ...lead, isWatched: !lead.isWatched } : lead)))
  }

  const handleScoreClick = (lead: Lead) => {
    setSelectedLead(lead)
    setScoreModalOpen(true)
  }

  const handleClearFilters = () => {
    setSearchQuery("")
    setScoreRange([0, 100])
    setSelectedLocation("All Locations")
    setSelectedTitle("All Titles")
    setSelectedFunding("All Stages")
  }

  const handleExport = () => {
    const leadsToExport = selectedLeads.size > 0 ? filteredLeads.filter((l) => selectedLeads.has(l.id)) : filteredLeads

    const csv = [
      [
        "Rank",
        "Score",
        "Name",
        "Title",
        "Company",
        "Personal Location",
        "HQ Location",
        "Email",
        "Phone",
        "LinkedIn",
        "Funding Stage",
        "Last Publication",
        "Tech Stack",
      ].join(","),
      ...leadsToExport.map((lead) =>
        [
          lead.rank,
          lead.score,
          `"${lead.name}"`,
          `"${lead.title}"`,
          `"${lead.company}"`,
          `"${lead.personalLocation}"`,
          `"${lead.hqLocation}"`,
          lead.email,
          `"${lead.phone}"`,
          lead.linkedin,
          lead.fundingStage,
          lead.lastPublication,
          `"${lead.techStack.join("; ")}"`,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `leads-export-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleRemoveFromComparison = (id: string) => {
    setSelectedLeads((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-600 text-white">
                <FlaskConical className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">BioLeads Pro</h1>
                <p className="text-sm text-muted-foreground">Pharma Lead Intelligence</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ScoringLegend />
              {selectedLeads.size >= 2 && (
                <Button variant="outline" className="gap-2 bg-transparent" onClick={() => setComparisonOpen(true)}>
                  <GitCompare className="h-4 w-4" />
                  Compare ({selectedLeads.size})
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats */}
        <StatsCards leads={leads} filteredLeads={filteredLeads} />

        {/* Analytics */}
        <AnalyticsSection leads={filteredLeads} />

        {/* Top Leads Cards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold">Top Prospects</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {topLeads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onScoreClick={() => handleScoreClick(lead)}
                onWatchToggle={() => handleWatchToggle(lead.id)}
              />
            ))}
          </div>
        </div>

        {/* Filters & Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">All Leads</h2>
              <span className="text-sm text-muted-foreground">({filteredLeads.length} results)</span>
            </div>
            <div className="flex items-center gap-2">
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "table" | "cards")}>
                <TabsList className="h-9">
                  <TabsTrigger value="table" className="gap-1.5 px-3">
                    <Table2 className="h-4 w-4" />
                    Table
                  </TabsTrigger>
                  <TabsTrigger value="cards" className="gap-1.5 px-3">
                    <LayoutGrid className="h-4 w-4" />
                    Cards
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          <FiltersSection
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            scoreRange={scoreRange}
            onScoreRangeChange={setScoreRange}
            selectedLocation={selectedLocation}
            onLocationChange={setSelectedLocation}
            selectedTitle={selectedTitle}
            onTitleChange={setSelectedTitle}
            selectedFunding={selectedFunding}
            onFundingChange={setSelectedFunding}
            onExport={handleExport}
            onClearFilters={handleClearFilters}
            hasActiveFilters={hasActiveFilters}
            selectedCount={selectedLeads.size}
          />

          {viewMode === "table" ? (
            <LeadTable
              leads={filteredLeads}
              selectedLeads={selectedLeads}
              onSelectLead={handleSelectLead}
              onSelectAll={handleSelectAll}
              onWatchToggle={handleWatchToggle}
              onScoreClick={handleScoreClick}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredLeads.map((lead) => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  onScoreClick={() => handleScoreClick(lead)}
                  onWatchToggle={() => handleWatchToggle(lead.id)}
                />
              ))}
            </div>
          )}

          {filteredLeads.length === 0 && (
            <div className="text-center py-12 bg-card rounded-lg border">
              <p className="text-muted-foreground">No leads match your filters.</p>
              <Button variant="link" className="mt-2" onClick={handleClearFilters}>
                Clear all filters
              </Button>
            </div>
          )}
        </div>

        {/* Watched Leads */}
        {watchedLeads.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
              <h2 className="text-lg font-semibold">Watchlist</h2>
              <span className="text-sm text-muted-foreground">({watchedLeads.length} leads)</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {watchedLeads.map((lead) => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  onScoreClick={() => handleScoreClick(lead)}
                  onWatchToggle={() => handleWatchToggle(lead.id)}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <ScoreBreakdownModal lead={selectedLead} open={scoreModalOpen} onOpenChange={setScoreModalOpen} />

      <ComparisonModal
        leads={comparisonLeads}
        open={comparisonOpen}
        onOpenChange={setComparisonOpen}
        onRemoveLead={handleRemoveFromComparison}
      />
    </div>
  )
}
