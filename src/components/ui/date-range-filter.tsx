import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface DateRangeFilterProps {
  label?: string;
  value: DateRange | undefined;
  onChange: (range: DateRange | undefined) => void;
  /** When set and a date is selected, show this count in a badge next to the trigger */
  count?: number;
  className?: string;
}

/** Single-date filter: one date at a time. Still passes DateRange (from = to = selected day) for compatibility. */
export function DateRangeFilter({
  label = "Filter by date",
  value,
  onChange,
  count,
  className,
}: DateRangeFilterProps) {
  const [open, setOpen] = React.useState(false);
  const selectedDate = value?.from;

  const display = selectedDate ? selectedDate.toLocaleDateString() : "All time";

  const handleSelect = React.useCallback(
    (date: Date | undefined) => {
      if (date) {
        onChange({ from: date, to: date });
      } else {
        onChange(undefined);
      }
      setOpen(false);
    },
    [onChange]
  );

  const hasSelection = !!selectedDate;
  const showBadge = hasSelection && count !== undefined;

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "h-10 gap-2 px-3 text-xs sm:text-sm font-normal text-muted-foreground",
              !selectedDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="h-4 w-4" />
            <span className="hidden sm:inline">{label}:</span>
            <span className="truncate max-w-[160px] sm:max-w-[220px]">{display}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            numberOfMonths={1}
          />
          {hasSelection && (
            <div className="border-t p-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full text-xs"
                onClick={() => {
                  onChange(undefined);
                  setOpen(false);
                }}
              >
                Clear
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
      {showBadge && (
        <Badge variant="secondary" className="h-5 min-w-5 px-1.5 text-xs tabular-nums">
          {count}
        </Badge>
      )}
    </div>
  );
}

