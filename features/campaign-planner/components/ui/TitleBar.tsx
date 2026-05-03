"use client";

import { useState } from "react";
import { Button } from "@/features/campaign-planner/components/ui/Button";
import { Input } from "@/features/campaign-planner/components/ui/Input";
import { Icon } from "@/features/campaign-planner/components/ui/Icon";
import { Dropdown } from "@/features/campaign-planner/components/ui/Dropdown";
import { columnConfigs as mockColumnConfigs } from "@/features/campaign-planner/lib/mock-data";

export interface FilterState {
  tags: string[];
  noTags: boolean;
  creators: string[];
  buyingTypes: string[];
  budgetMin?: number;
  budgetMax?: number;
  impressionsMin?: number;
  impressionsMax?: number;
  cpmMin?: number;
  cpmMax?: number;
  dateStart?: string;
  dateEnd?: string;
  scheduleStart?: string;
  scheduleEnd?: string;
}

export interface TitleBarProps {
  planCount: number;
  selectedCount: number;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onCreatePlan: () => void;
  visibleColumns: string[];
  onColumnToggle: (columnId: string) => void;
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  allTags: string[];
  allCreators: string[];
  budgetBounds: { min: number; max: number };
  impressionsBounds: { min: number; max: number };
  cpmBounds: { min: number; max: number };
  onClearSelection: () => void;
  onDownloadCSV: () => void;
  onDuplicateSelected: () => void;
  onDeleteSelected: () => void;
  onBookInAdsManager: () => void;
}

export function TitleBar({
  planCount,
  selectedCount,
  searchValue,
  onSearchChange,
  onCreatePlan,
  visibleColumns,
  onColumnToggle,
  filters,
  onFilterChange,
  allTags,
  allCreators,
  budgetBounds,
  impressionsBounds,
  cpmBounds,
  onClearSelection,
  onDownloadCSV,
  onDuplicateSelected,
  onDeleteSelected,
  onBookInAdsManager,
}: TitleBarProps) {
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [isEditColumnsDropdownOpen, setIsEditColumnsDropdownOpen] = useState(false);
  
  // Local state for budget slider
  const [localBudgetMin, setLocalBudgetMin] = useState<number>(budgetBounds.min);
  const [localBudgetMax, setLocalBudgetMax] = useState<number>(budgetBounds.max);
  
  // Local state for impressions slider
  const [localImpressionsMin, setLocalImpressionsMin] = useState<number>(impressionsBounds.min);
  const [localImpressionsMax, setLocalImpressionsMax] = useState<number>(impressionsBounds.max);
  
  // Local state for CPM slider
  const [localCpmMin, setLocalCpmMin] = useState<number>(cpmBounds.min);
  const [localCpmMax, setLocalCpmMax] = useState<number>(cpmBounds.max);
  
  // Local state for date range filter
  const [localDateStart, setLocalDateStart] = useState<string>('');
  const [localDateEnd, setLocalDateEnd] = useState<string>('');
  
  // Local state for schedule date filter
  const [localScheduleStart, setLocalScheduleStart] = useState<string>('');
  const [localScheduleEnd, setLocalScheduleEnd] = useState<string>('');
  
  // Sync local filter state when filter dropdown opens
  const handleFilterDropdownOpen = () => {
    if (!isFilterDropdownOpen) {
      setLocalBudgetMin(filters.budgetMin ?? budgetBounds.min);
      setLocalBudgetMax(filters.budgetMax ?? budgetBounds.max);
      setLocalImpressionsMin(filters.impressionsMin ?? impressionsBounds.min);
      setLocalImpressionsMax(filters.impressionsMax ?? impressionsBounds.max);
      setLocalCpmMin(filters.cpmMin ?? cpmBounds.min);
      setLocalCpmMax(filters.cpmMax ?? cpmBounds.max);
      setLocalDateStart(filters.dateStart ?? '');
      setLocalDateEnd(filters.dateEnd ?? '');
      setLocalScheduleStart(filters.scheduleStart ?? '');
      setLocalScheduleEnd(filters.scheduleEnd ?? '');
    }
    setIsFilterDropdownOpen(!isFilterDropdownOpen);
  };
  
  // Snapshot of sorted columns
  const [sortedColumnsSnapshot, setSortedColumnsSnapshot] = useState<typeof mockColumnConfigs>([]);
  
  const dataColumns = mockColumnConfigs.filter(c => c.id !== 'select' && c.id !== 'actions');
  
  // Check if filters are active
  const isBudgetFilterActive = (filters.budgetMin !== undefined && filters.budgetMin > budgetBounds.min) || 
    (filters.budgetMax !== undefined && filters.budgetMax < budgetBounds.max);
  
  const isImpressionsFilterActive = (filters.impressionsMin !== undefined && filters.impressionsMin > impressionsBounds.min) || 
    (filters.impressionsMax !== undefined && filters.impressionsMax < impressionsBounds.max);
  
  const isCpmFilterActive = (filters.cpmMin !== undefined && filters.cpmMin > cpmBounds.min) || 
    (filters.cpmMax !== undefined && filters.cpmMax < cpmBounds.max);
  
  const isDateFilterActive = filters.dateStart !== undefined || filters.dateEnd !== undefined;
  const isScheduleFilterActive = filters.scheduleStart !== undefined || filters.scheduleEnd !== undefined;
  
  const hasActiveFilters = filters.tags.length > 0 || filters.noTags || filters.creators.length > 0 || 
    filters.buyingTypes.length > 0 || isBudgetFilterActive || isImpressionsFilterActive || 
    isCpmFilterActive || isDateFilterActive || isScheduleFilterActive;
  
  // Count active filters
  const activeFilterCount = [
    filters.tags.length > 0 || filters.noTags,
    filters.creators.length > 0,
    filters.buyingTypes.length > 0,
    isBudgetFilterActive,
    isImpressionsFilterActive,
    isCpmFilterActive,
    isDateFilterActive,
    isScheduleFilterActive,
  ].filter(Boolean).length;
  
  const buyingTypeOptions = ['Auction', 'Reservation'];
  const hasSelection = selectedCount > 0;

  // Sort columns: checked items first (A-Z), then unchecked items (A-Z)
  const getSortedColumns = () => {
    const checked = dataColumns
      .filter(col => visibleColumns.includes(col.id))
      .sort((a, b) => a.label.localeCompare(b.label));
    const unchecked = dataColumns
      .filter(col => !visibleColumns.includes(col.id))
      .sort((a, b) => a.label.localeCompare(b.label));
    return [...checked, ...unchecked];
  };

  const handleEditColumnsOpen = () => {
    if (!isEditColumnsDropdownOpen) {
      setSortedColumnsSnapshot(getSortedColumns());
    }
    setIsEditColumnsDropdownOpen(!isEditColumnsDropdownOpen);
  };

  const displayColumns = isEditColumnsDropdownOpen && sortedColumnsSnapshot.length > 0 
    ? sortedColumnsSnapshot 
    : getSortedColumns();

  return (
    <div className="bg-white flex flex-col items-start px-4 py-2 rounded-[8px] shadow-[0px_0px_8px_0px_rgba(10,120,190,0.08)] w-full">
      <div className="flex items-center justify-between gap-3 w-full">
        {/* Left: Count/Selection */}
        <div className="flex items-center gap-3 shrink-0">
          {hasSelection ? (
            <div className="flex items-center gap-1">
              <span className="font-optimistic font-medium text-[14px] leading-[20px] text-[#1C2B33] whitespace-nowrap">
                Selected ({selectedCount})
              </span>
              <button
                onClick={onClearSelection}
                className="flex items-center justify-center w-6 h-6 rounded hover:bg-[rgba(0,0,0,0.05)] transition-colors"
                aria-label="Clear selection"
              >
                <Icon name="Close" variant="outlined" size={16} className="text-[#5C6970]" />
              </button>
            </div>
          ) : (
            <>
              <span className="font-optimistic font-medium text-[14px] leading-[20px] text-[#1C2B33] whitespace-nowrap">
                {(hasActiveFilters || searchValue.trim()) ? `${planCount} results` : `All Plans (${planCount})`}
              </span>
              <div className="flex items-center justify-center h-6 w-px shrink-0">
                <div className="h-6 w-px bg-[#CBD2D9]" />
              </div>
            </>
          )}

          {/* Filter/Edit Columns */}
          {!hasSelection && (
            <div className="flex items-center gap-1 shrink-0">
              {/* Filter Dropdown */}
              <Dropdown
                trigger={
                  <button
                    className={`inline-flex items-center justify-center border rounded-[4px] font-optimistic transition-all duration-150 whitespace-nowrap shrink-0 h-[36px] px-[12px] py-[8px] gap-2 text-[14px] font-medium leading-[20px] text-[#1C2B33] border-transparent ${
                      isFilterDropdownOpen
                        ? "bg-[rgba(0,0,0,0.1)]"
                        : "bg-transparent hover:bg-[rgba(0,0,0,0.05)]"
                    }`}
                    onClick={handleFilterDropdownOpen}
                  >
                    <Icon name="Sort" variant="outlined" size={16} />
                    Filter{activeFilterCount > 0 && ` (${activeFilterCount})`}
                  </button>
                }
                width={280}
                onClose={() => {
                  setIsFilterDropdownOpen(false);
                  const budgetChanged = localBudgetMin !== (filters.budgetMin ?? budgetBounds.min) || 
                    localBudgetMax !== (filters.budgetMax ?? budgetBounds.max);
                  const impressionsChanged = localImpressionsMin !== (filters.impressionsMin ?? impressionsBounds.min) || 
                    localImpressionsMax !== (filters.impressionsMax ?? impressionsBounds.max);
                  const cpmChanged = localCpmMin !== (filters.cpmMin ?? cpmBounds.min) || 
                    localCpmMax !== (filters.cpmMax ?? cpmBounds.max);
                  const dateChanged = localDateStart !== (filters.dateStart ?? '') || 
                    localDateEnd !== (filters.dateEnd ?? '');
                  const scheduleChanged = localScheduleStart !== (filters.scheduleStart ?? '') || 
                    localScheduleEnd !== (filters.scheduleEnd ?? '');
                  if (budgetChanged || impressionsChanged || cpmChanged || dateChanged || scheduleChanged) {
                    onFilterChange({
                      ...filters,
                      budgetMin: localBudgetMin === budgetBounds.min ? undefined : localBudgetMin,
                      budgetMax: localBudgetMax === budgetBounds.max ? undefined : localBudgetMax,
                      impressionsMin: localImpressionsMin === impressionsBounds.min ? undefined : localImpressionsMin,
                      impressionsMax: localImpressionsMax === impressionsBounds.max ? undefined : localImpressionsMax,
                      cpmMin: localCpmMin === cpmBounds.min ? undefined : localCpmMin,
                      cpmMax: localCpmMax === cpmBounds.max ? undefined : localCpmMax,
                      dateStart: localDateStart || undefined,
                      dateEnd: localDateEnd || undefined,
                      scheduleStart: localScheduleStart || undefined,
                      scheduleEnd: localScheduleEnd || undefined,
                    });
                  }
                }}
                closeOnItemClick={false}
              >
                {/* Filter Header */}
                <div className="flex items-center pl-4 pr-1 py-2">
                  <p className="flex-1 font-optimistic-display font-bold text-[16px] leading-[20px] text-[#1C2B33]">Filters</p>
                  <button 
                    className="p-2 rounded hover:bg-[rgba(0,0,0,0.05)] transition-colors"
                    onClick={() => setIsFilterDropdownOpen(false)}
                  >
                    <Icon name="Close" variant="outlined" size={16} className="text-[#080809]" />
                  </button>
                </div>
                
                {/* Scrollable filter content */}
                <div className="max-h-[400px] overflow-y-auto flex flex-col pb-[30px]">
                  <div className="w-full h-px bg-[#CBD2D9]" />
                  
                  {/* Total Budget Section */}
                  <div className="px-4 pt-[14px] flex flex-col gap-2">
                    <p className="font-optimistic font-bold text-[14px] leading-[20px] text-[#1C2B33]">Total Budget</p>
                    <div className="relative h-6">
                      <div className="absolute top-[10px] w-full h-1 bg-[#F1F4F7] rounded-[20px]" />
                      <div 
                        className="absolute top-[10px] h-1 bg-[#0A78BE] rounded-[20px]"
                        style={{
                          left: `${((localBudgetMin - budgetBounds.min) / (budgetBounds.max - budgetBounds.min)) * 100}%`,
                          right: `${100 - ((localBudgetMax - budgetBounds.min) / (budgetBounds.max - budgetBounds.min)) * 100}%`,
                        }}
                      />
                      <input
                        type="range"
                        min={budgetBounds.min}
                        max={budgetBounds.max}
                        step={1000}
                        value={localBudgetMin}
                        onChange={(e) => {
                          const value = Math.min(Number(e.target.value), localBudgetMax - 1000);
                          setLocalBudgetMin(value);
                        }}
                        className="absolute w-full h-6 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-[#0A78BE] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:bg-[#0A78BE] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0"
                      />
                      <input
                        type="range"
                        min={budgetBounds.min}
                        max={budgetBounds.max}
                        step={1000}
                        value={localBudgetMax}
                        onChange={(e) => {
                          const value = Math.max(Number(e.target.value), localBudgetMin + 1000);
                          setLocalBudgetMax(value);
                        }}
                        className="absolute w-full h-6 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-[#0A78BE] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:bg-[#0A78BE] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0"
                      />
                    </div>
                    <div className="flex justify-between font-['Roboto'] text-[12px] leading-[16px] font-normal text-[#1C2B33]">
                      <span>${localBudgetMin.toLocaleString()}</span>
                      <span>${localBudgetMax.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  {/* Impressions Section */}
                  <div className="px-4 pt-[14px] flex flex-col gap-2">
                    <p className="font-optimistic font-bold text-[14px] leading-[20px] text-[#1C2B33]">Impressions</p>
                    <div className="relative h-6">
                      <div className="absolute top-[10px] w-full h-1 bg-[#F1F4F7] rounded-[20px]" />
                      <div 
                        className="absolute top-[10px] h-1 bg-[#0A78BE] rounded-[20px]"
                        style={{
                          left: `${((localImpressionsMin - impressionsBounds.min) / (impressionsBounds.max - impressionsBounds.min)) * 100}%`,
                          right: `${100 - ((localImpressionsMax - impressionsBounds.min) / (impressionsBounds.max - impressionsBounds.min)) * 100}%`,
                        }}
                      />
                      <input
                        type="range"
                        min={impressionsBounds.min}
                        max={impressionsBounds.max}
                        step={1000000}
                        value={localImpressionsMin}
                        onChange={(e) => {
                          const value = Math.min(Number(e.target.value), localImpressionsMax - 1000000);
                          setLocalImpressionsMin(value);
                        }}
                        className="absolute w-full h-6 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-[#0A78BE] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:bg-[#0A78BE] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0"
                      />
                      <input
                        type="range"
                        min={impressionsBounds.min}
                        max={impressionsBounds.max}
                        step={1000000}
                        value={localImpressionsMax}
                        onChange={(e) => {
                          const value = Math.max(Number(e.target.value), localImpressionsMin + 1000000);
                          setLocalImpressionsMax(value);
                        }}
                        className="absolute w-full h-6 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-[#0A78BE] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:bg-[#0A78BE] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0"
                      />
                    </div>
                    <div className="flex justify-between font-['Roboto'] text-[12px] leading-[16px] font-normal text-[#1C2B33]">
                      <span>{localImpressionsMin.toLocaleString()}</span>
                      <span>{localImpressionsMax.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  {/* CPM Section */}
                  <div className="px-4 pt-[14px] flex flex-col gap-2">
                    <p className="font-optimistic font-bold text-[14px] leading-[20px] text-[#1C2B33]">CPM</p>
                    <div className="relative h-6">
                      <div className="absolute top-[10px] w-full h-1 bg-[#F1F4F7] rounded-[20px]" />
                      <div 
                        className="absolute top-[10px] h-1 bg-[#0A78BE] rounded-[20px]"
                        style={{
                          left: `${((localCpmMin - cpmBounds.min) / (cpmBounds.max - cpmBounds.min)) * 100}%`,
                          right: `${100 - ((localCpmMax - cpmBounds.min) / (cpmBounds.max - cpmBounds.min)) * 100}%`,
                        }}
                      />
                      <input
                        type="range"
                        min={cpmBounds.min}
                        max={cpmBounds.max}
                        step={0.1}
                        value={localCpmMin}
                        onChange={(e) => {
                          const value = Math.min(Number(e.target.value), localCpmMax - 0.1);
                          setLocalCpmMin(value);
                        }}
                        className="absolute w-full h-6 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-[#0A78BE] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:bg-[#0A78BE] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0"
                      />
                      <input
                        type="range"
                        min={cpmBounds.min}
                        max={cpmBounds.max}
                        step={0.1}
                        value={localCpmMax}
                        onChange={(e) => {
                          const value = Math.max(Number(e.target.value), localCpmMin + 0.1);
                          setLocalCpmMax(value);
                        }}
                        className="absolute w-full h-6 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-[#0A78BE] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:bg-[#0A78BE] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0"
                      />
                    </div>
                    <div className="flex justify-between font-['Roboto'] text-[12px] leading-[16px] font-normal text-[#1C2B33]">
                      <span>${localCpmMin.toFixed(2)}</span>
                      <span>${localCpmMax.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="w-full h-px bg-[#CBD2D9] mt-4" />
                  
                  {/* Buying Type Section */}
                  <div className="px-4 pt-[14px] flex flex-col gap-2">
                    <p className="font-optimistic font-bold text-[14px] leading-[20px] text-[#1C2B33]">Buying Type</p>
                    <div className="flex flex-col -mx-2">
                      {buyingTypeOptions.map(buyingType => (
                        <div 
                          key={buyingType}
                          className="flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-[rgba(0,0,0,0.03)] rounded"
                          onClick={() => {
                            if (filters.buyingTypes.includes(buyingType)) {
                              onFilterChange({ ...filters, buyingTypes: filters.buyingTypes.filter(bt => bt !== buyingType) });
                            } else {
                              onFilterChange({ ...filters, buyingTypes: [...filters.buyingTypes, buyingType] });
                            }
                          }}
                        >
                          <div className={`w-6 h-6 rounded border ${filters.buyingTypes.includes(buyingType) ? 'bg-[#0A78BE] border-[#0A78BE]' : 'bg-white border-[#CBD2D9]'} flex items-center justify-center`}>
                            {filters.buyingTypes.includes(buyingType) && (
                              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11.5 4L5.5 10L2.5 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            )}
                          </div>
                          <span className="font-optimistic text-[14px] leading-[20px] text-[#1C2B33]">{buyingType}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="w-full h-px bg-[#CBD2D9] mt-4" />
                  
                  {/* Schedule Section */}
                  <div className="px-4 pt-[14px] flex flex-col gap-2">
                    <p className="font-optimistic font-bold text-[14px] leading-[20px] text-[#1C2B33]">Schedule</p>
                    <div className="flex flex-col gap-2">
                      <div>
                        <label className="block text-[14px] leading-[20px] font-optimistic font-bold text-[#1C2B33] mb-1">From</label>
                        <div className="relative">
                          <Icon name="Calendar" variant="outlined" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#283943]" />
                          <input
                            type="text"
                            placeholder="mm/dd/yyyy"
                            value={localScheduleStart}
                            onChange={(e) => setLocalScheduleStart(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-[14px] leading-[20px] font-optimistic text-[#1C2B33] border border-[#CBD2D9] rounded-[4px] focus:outline-none focus:border-[#0A78BE] focus:ring-1 focus:ring-[#0A78BE] placeholder:text-[#9AA5AD]"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[14px] leading-[20px] font-optimistic font-bold text-[#1C2B33] mb-1">To</label>
                        <div className="relative">
                          <Icon name="Calendar" variant="outlined" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#283943]" />
                          <input
                            type="text"
                            placeholder="mm/dd/yyyy"
                            value={localScheduleEnd}
                            onChange={(e) => setLocalScheduleEnd(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-[14px] leading-[20px] font-optimistic text-[#1C2B33] border border-[#CBD2D9] rounded-[4px] focus:outline-none focus:border-[#0A78BE] focus:ring-1 focus:ring-[#0A78BE] placeholder:text-[#9AA5AD]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full h-px bg-[#CBD2D9] mt-4" />
                  
                  {/* Creation Date Section */}
                  <div className="px-4 pt-[14px] flex flex-col gap-2">
                    <p className="font-optimistic font-bold text-[14px] leading-[20px] text-[#1C2B33]">Creation Date</p>
                    <div className="flex flex-col gap-2">
                      <div>
                        <label className="block text-[14px] leading-[20px] font-optimistic font-bold text-[#1C2B33] mb-1">From</label>
                        <div className="relative">
                          <Icon name="Calendar" variant="outlined" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#283943]" />
                          <input
                            type="text"
                            placeholder="mm/dd/yyyy"
                            value={localDateStart}
                            onChange={(e) => setLocalDateStart(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-[14px] leading-[20px] font-optimistic text-[#1C2B33] border border-[#CBD2D9] rounded-[4px] focus:outline-none focus:border-[#0A78BE] focus:ring-1 focus:ring-[#0A78BE] placeholder:text-[#9AA5AD]"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[14px] leading-[20px] font-optimistic font-bold text-[#1C2B33] mb-1">To</label>
                        <div className="relative">
                          <Icon name="Calendar" variant="outlined" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#283943]" />
                          <input
                            type="text"
                            placeholder="mm/dd/yyyy"
                            value={localDateEnd}
                            onChange={(e) => setLocalDateEnd(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-[14px] leading-[20px] font-optimistic text-[#1C2B33] border border-[#CBD2D9] rounded-[4px] focus:outline-none focus:border-[#0A78BE] focus:ring-1 focus:ring-[#0A78BE] placeholder:text-[#9AA5AD]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full h-px bg-[#CBD2D9] mt-4" />
                  
                  {/* Tags Section */}
                  <div className="px-4 pt-[14px] flex flex-col gap-2">
                    <p className="font-optimistic font-bold text-[14px] leading-[20px] text-[#1C2B33]">Tags</p>
                    <div className="flex flex-col -mx-2">
                      <div 
                        className="flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-[rgba(0,0,0,0.03)] rounded"
                        onClick={() => {
                          onFilterChange({ ...filters, noTags: !filters.noTags, tags: !filters.noTags ? [] : filters.tags });
                        }}
                      >
                        <div className={`w-6 h-6 rounded border ${filters.noTags ? 'bg-[#0A78BE] border-[#0A78BE]' : 'bg-white border-[#CBD2D9]'} flex items-center justify-center`}>
                          {filters.noTags && (
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M11.5 4L5.5 10L2.5 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </div>
                        <span className="font-optimistic text-[14px] leading-[20px] text-[#1C2B33]">No Tags</span>
                      </div>
                      {allTags.map(tag => (
                        <div 
                          key={tag}
                          className={`flex items-center gap-2 px-2 py-1 rounded ${filters.noTags ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-[rgba(0,0,0,0.03)]'}`}
                          onClick={() => {
                            if (filters.noTags) return;
                            if (filters.tags.includes(tag)) {
                              onFilterChange({ ...filters, tags: filters.tags.filter(t => t !== tag) });
                            } else {
                              onFilterChange({ ...filters, tags: [...filters.tags, tag] });
                            }
                          }}
                        >
                          <div className={`w-6 h-6 rounded border ${filters.tags.includes(tag) ? 'bg-[#0A78BE] border-[#0A78BE]' : 'bg-white border-[#CBD2D9]'} flex items-center justify-center`}>
                            {filters.tags.includes(tag) && (
                              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11.5 4L5.5 10L2.5 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            )}
                          </div>
                          <span className="font-optimistic text-[14px] leading-[20px] text-[#1C2B33]">{tag}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="w-full h-px bg-[#CBD2D9] mt-4" />
                  
                  {/* Creator Section */}
                  <div className="px-4 pt-[14px] flex flex-col gap-2">
                    <p className="font-optimistic font-bold text-[14px] leading-[20px] text-[#1C2B33]">Creator</p>
                    <div className="flex flex-col -mx-2">
                      {allCreators.map(creator => (
                        <div 
                          key={creator}
                          className="flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-[rgba(0,0,0,0.03)] rounded"
                          onClick={() => {
                            if (filters.creators.includes(creator)) {
                              onFilterChange({ ...filters, creators: filters.creators.filter(c => c !== creator) });
                            } else {
                              onFilterChange({ ...filters, creators: [...filters.creators, creator] });
                            }
                          }}
                        >
                          <div className={`w-6 h-6 rounded border ${filters.creators.includes(creator) ? 'bg-[#0A78BE] border-[#0A78BE]' : 'bg-white border-[#CBD2D9]'} flex items-center justify-center`}>
                            {filters.creators.includes(creator) && (
                              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11.5 4L5.5 10L2.5 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            )}
                          </div>
                          <span className="font-optimistic text-[14px] leading-[20px] text-[#1C2B33]">{creator}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Reset Filters button */}
                {hasActiveFilters && (
                  <div className="p-2">
                    <Button 
                      variant="flat" 
                      className="w-full"
                      onClick={() => {
                        setLocalBudgetMin(budgetBounds.min);
                        setLocalBudgetMax(budgetBounds.max);
                        setLocalImpressionsMin(impressionsBounds.min);
                        setLocalImpressionsMax(impressionsBounds.max);
                        setLocalCpmMin(cpmBounds.min);
                        setLocalCpmMax(cpmBounds.max);
                        setLocalDateStart('');
                        setLocalDateEnd('');
                        setLocalScheduleStart('');
                        setLocalScheduleEnd('');
                        onFilterChange({ tags: [], noTags: false, creators: [], buyingTypes: [] });
                      }}
                    >
                      Reset Filters
                    </Button>
                  </div>
                )}
              </Dropdown>

              {/* Edit Columns Dropdown */}
              <Dropdown
                trigger={
                  <button
                    className={`inline-flex items-center justify-center border rounded-[4px] font-optimistic transition-all duration-150 whitespace-nowrap shrink-0 h-[36px] px-[12px] py-[8px] gap-2 text-[14px] font-medium leading-[20px] text-[#1C2B33] border-transparent ${
                      isEditColumnsDropdownOpen
                        ? "bg-[rgba(0,0,0,0.1)]"
                        : "bg-transparent hover:bg-[rgba(0,0,0,0.05)]"
                    }`}
                    onClick={handleEditColumnsOpen}
                  >
                    <Icon name="Pencil" variant="outlined" size={16} />
                    Edit Columns
                  </button>
                }
                width={220}
                onClose={() => setIsEditColumnsDropdownOpen(false)}
                closeOnItemClick={false}
              >
                <div className="px-3 pt-2 pb-1">
                  <p className="font-optimistic font-bold text-[12px] text-[#5C6970] px-2">
                    Select columns to display
                  </p>
                </div>
                <Dropdown.List maxHeight={300}>
                  {displayColumns.map(column => (
                    <Dropdown.Item
                      key={column.id}
                      label={column.label}
                      selectionType="checkbox"
                      selected={visibleColumns.includes(column.id)}
                      onSelectionChange={() => onColumnToggle(column.id)}
                    />
                  ))}
                </Dropdown.List>
              </Dropdown>
            </div>
          )}
        </div>

        {/* Right: Bulk Actions or Search/Create */}
        <div className="flex items-center gap-3 shrink-0">
          {hasSelection ? (
            <>
              <div className="flex items-center gap-1">
                <Button variant="flat" onClick={onDownloadCSV}>
                  <Icon name="FileDownload" variant="outlined" size={16} />
                  Download CSV
                </Button>
                <Button variant="flat" onClick={onDuplicateSelected}>
                  <Icon name="StackedSquares" variant="outlined" size={16} />
                  Duplicate
                </Button>
                <Button variant="flat" onClick={onDeleteSelected}>
                  <Icon name="Trash" variant="outlined" size={16} />
                  Delete
                </Button>
              </div>
              {selectedCount === 1 && (
                <>
                  <div className="flex items-center justify-center h-6 w-px shrink-0">
                    <div className="h-6 w-px bg-[#CBD2D9]" />
                  </div>
                  <Button variant="primary" onClick={onBookInAdsManager}>
                    Book in Ads Manager
                  </Button>
                </>
              )}
            </>
          ) : (
            <>
              <div className="w-[150px] shrink-0">
                <Input
                  variant="search"
                  placeholder="Search"
                  value={searchValue}
                  onChange={(e) => onSearchChange(e.target.value)}
                />
              </div>
              <Button variant="primary" onClick={onCreatePlan}>
                <Icon name="Plus" variant="outlined" size={16} />
                Create Plan
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
