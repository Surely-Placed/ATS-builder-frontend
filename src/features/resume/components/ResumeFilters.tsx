import React from "react";
import { FilterCounts } from "@/features/resume/hooks/useResumeFilters";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filter, ChevronDown } from "lucide-react";

export type FilterType = "all" | "uploaded" | "optimized";

interface ResumeFiltersProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  counts: FilterCounts;
}

export const ResumeFilters: React.FC<ResumeFiltersProps> = ({
  activeFilter,
  onFilterChange,
  counts,
}) => {
  const filters = [
    { key: "all" as FilterType, label: "All Resumes" },
    { key: "uploaded" as FilterType, label: "Uploaded" },
    { key: "optimized" as FilterType, label: "Optimized" },
  ];

  const activeFilterLabel = filters.find((f) => f.key === activeFilter)?.label || "All Resumes";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          <span>{activeFilterLabel}</span>
          <span className="ml-1 text-xs bg-muted px-2 py-0.5 rounded-full text-foreground">
            {counts[activeFilter === 'uploaded' ? 'drafts' : activeFilter === 'optimized' ? 'published' : 'all'] || 0}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {filters.map((filter) => (
          <DropdownMenuItem
            key={filter.key}
            onClick={() => onFilterChange(filter.key)}
            className="flex items-center justify-between cursor-pointer"
          >
            <span>{filter.label}</span>
            <span className="ml-2 text-xs bg-muted px-2 py-0.5 rounded-full text-foreground">
              {counts[filter.key === 'uploaded' ? 'drafts' : filter.key === 'optimized' ? 'published' : 'all'] || 0}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
