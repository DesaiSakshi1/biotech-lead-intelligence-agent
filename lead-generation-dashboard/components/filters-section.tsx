"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { locations, jobTitles, fundingStages } from "@/lib/lead-data"
import { Search, X, Download, ListFilter } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from "@/hooks/use-toast"

interface FiltersSectionProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  scoreRange: [number, number]
  onScoreRangeChange: (value: [number, number]) => void
  selectedLocation: string
  onLocationChange: (value: string) => void
  selectedTitle: string
  onTitleChange: (value: string) => void
  selectedFunding: string
  onFundingChange: (value: string) => void
  onExport: () => void
  onClearFilters: () => void
  hasActiveFilters: boolean
  selectedCount: number
}

export function FiltersSection({
  searchQuery,
  onSearchChange,
  scoreRange,
  onScoreRangeChange,
  selectedLocation,
  onLocationChange,
  selectedTitle,
  onTitleChange,
  selectedFunding,
  onFundingChange,
  onExport,
  onClearFilters,
  hasActiveFilters,
  selectedCount,
}: FiltersSectionProps) {
  const { toast } = useToast()

  const handleExport = () => {
    onExport()
    toast({
      title: "Export started",
      description:
        selectedCount > 0 ? `Exporting ${selectedCount} selected leads to CSV` : "Exporting all filtered leads to CSV",
    })
  }

  const handleClearFilters = () => {
    onClearFilters()
    toast({
      title: "Filters cleared",
      description: "All filters have been reset",
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search leads by name, company, title, location..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2 bg-transparent">
                <ListFilter className="h-4 w-4" />
                Filters
                {hasActiveFilters && <span className="ml-1 h-2 w-2 rounded-full bg-blue-500" />}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Score Range</Label>
                  <div className="pt-2">
                    <Slider
                      value={scoreRange}
                      onValueChange={(value) => onScoreRangeChange(value as [number, number])}
                      min={0}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                    <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                      <span>{scoreRange[0]}</span>
                      <span>{scoreRange[1]}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Location</Label>
                  <Select value={selectedLocation} onValueChange={onLocationChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Job Title</Label>
                  <Select value={selectedTitle} onValueChange={onTitleChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {jobTitles.map((title) => (
                        <SelectItem key={title} value={title}>
                          {title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Funding Stage</Label>
                  <Select value={selectedFunding} onValueChange={onFundingChange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fundingStages.map((stage) => (
                        <SelectItem key={stage} value={stage}>
                          {stage}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {hasActiveFilters && (
                  <Button variant="ghost" className="w-full gap-2" onClick={handleClearFilters}>
                    <X className="h-4 w-4" />
                    Clear All Filters
                  </Button>
                )}
              </div>
            </PopoverContent>
          </Popover>

          <Button variant="outline" className="gap-2 bg-transparent" onClick={handleExport}>
            <Download className="h-4 w-4" />
            Export
            {selectedCount > 0 && (
              <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">{selectedCount}</span>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
