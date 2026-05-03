import { useState, useCallback, useMemo } from "react";
import { FilterState } from "@/features/campaign-planner/components/ui/TitleBar";

interface FilterBounds {
  budget: { min: number; max: number };
  impressions: { min: number; max: number };
  cpm: { min: number; max: number };
}

interface UseFiltersReturn {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  resetFilters: () => void;
  hasActiveFilters: boolean;
  activeFilterCount: number;
  isBudgetFilterActive: boolean;
  isImpressionsFilterActive: boolean;
  isCpmFilterActive: boolean;
  isDateFilterActive: boolean;
  isScheduleFilterActive: boolean;
}

const DEFAULT_FILTERS: FilterState = {
  tags: [],
  noTags: false,
  creators: [],
  buyingTypes: [],
};

export function useFilters(bounds: FilterBounds): UseFiltersReturn {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const isBudgetFilterActive = useMemo(() => 
    (filters.budgetMin !== undefined && filters.budgetMin > bounds.budget.min) || 
    (filters.budgetMax !== undefined && filters.budgetMax < bounds.budget.max),
    [filters.budgetMin, filters.budgetMax, bounds.budget]
  );

  const isImpressionsFilterActive = useMemo(() => 
    (filters.impressionsMin !== undefined && filters.impressionsMin > bounds.impressions.min) || 
    (filters.impressionsMax !== undefined && filters.impressionsMax < bounds.impressions.max),
    [filters.impressionsMin, filters.impressionsMax, bounds.impressions]
  );

  const isCpmFilterActive = useMemo(() => 
    (filters.cpmMin !== undefined && filters.cpmMin > bounds.cpm.min) || 
    (filters.cpmMax !== undefined && filters.cpmMax < bounds.cpm.max),
    [filters.cpmMin, filters.cpmMax, bounds.cpm]
  );

  const isDateFilterActive = filters.dateStart !== undefined || filters.dateEnd !== undefined;
  const isScheduleFilterActive = filters.scheduleStart !== undefined || filters.scheduleEnd !== undefined;

  const hasActiveFilters = useMemo(() => 
    filters.tags.length > 0 || 
    filters.noTags || 
    filters.creators.length > 0 || 
    filters.buyingTypes.length > 0 || 
    isBudgetFilterActive || 
    isImpressionsFilterActive || 
    isCpmFilterActive || 
    isDateFilterActive || 
    isScheduleFilterActive,
    [filters, isBudgetFilterActive, isImpressionsFilterActive, isCpmFilterActive, isDateFilterActive, isScheduleFilterActive]
  );

  const activeFilterCount = useMemo(() => [
    filters.tags.length > 0 || filters.noTags,
    filters.creators.length > 0,
    filters.buyingTypes.length > 0,
    isBudgetFilterActive,
    isImpressionsFilterActive,
    isCpmFilterActive,
    isDateFilterActive,
    isScheduleFilterActive,
  ].filter(Boolean).length, [
    filters, 
    isBudgetFilterActive, 
    isImpressionsFilterActive, 
    isCpmFilterActive, 
    isDateFilterActive, 
    isScheduleFilterActive
  ]);

  return {
    filters,
    setFilters,
    resetFilters,
    hasActiveFilters,
    activeFilterCount,
    isBudgetFilterActive,
    isImpressionsFilterActive,
    isCpmFilterActive,
    isDateFilterActive,
    isScheduleFilterActive,
  };
}
