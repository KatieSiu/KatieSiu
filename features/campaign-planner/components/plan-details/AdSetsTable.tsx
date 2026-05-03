"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Icon } from "@/features/campaign-planner/components/ui/Icon";
import { Button } from "@/features/campaign-planner/components/ui/Button";
import { Dropdown } from "@/features/campaign-planner/components/ui/Dropdown";
import { TruncatedText } from "@/features/campaign-planner/components/ui/TruncatedText";
import { 
  DataTable, 
  ColumnConfig, 
  EditProps, 
  RowAction,
  FooterCell,
} from "@/features/campaign-planner/components/ui/DataTable";
import { colors } from "@/features/campaign-planner/lib/design-tokens";
import { CampaignPlan, DEFAULT_AUDIENCE_SIZE, formatNumber, formatScheduleDate, formatSchedule } from "@/features/campaign-planner/lib/mock-data";
import {
  recalculateMetrics,
  formatCPMValue,
  formatFrequencyValue,
  formatReachPercentValue,
  parseNumericInput,
  EditableMetricField,
  CampaignMetrics,
} from "@/features/campaign-planner/lib/campaign-calculations";
import { AdSet } from "./types";
import { adSetColumnConfigs, defaultAdSetVisibleColumns } from "./AdSetTableRow";
import { DeleteConfirmationModal } from "@/features/campaign-planner/components/ui/DeleteConfirmationModal";

// ============================================
// Date Input Helpers (from EditScheduleModal pattern)
// ============================================
function smartFormatDateInput(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 0) return "";
  
  let formatted = "";
  for (let i = 0; i < digits.length && i < 8; i++) {
    if (i === 2 || i === 4) formatted += "/";
    formatted += digits[i];
  }
  return formatted;
}

function formatDateForDisplay(dateStr: string): string {
  if (!dateStr) return "";
  const parsed = parseDate(dateStr);
  if (!parsed || isNaN(parsed.getTime())) return dateStr;
  return new Intl.DateTimeFormat('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  }).format(parsed);
}

function formatDateForEdit(dateStr: string): string {
  if (!dateStr) return "";
  const parsed = parseDate(dateStr);
  if (!parsed || isNaN(parsed.getTime())) return "";
  const month = String(parsed.getMonth() + 1).padStart(2, '0');
  const day = String(parsed.getDate()).padStart(2, '0');
  const year = String(parsed.getFullYear());
  return `${month}/${day}/${year}`;
}

function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  // Try MM/DD/YYYY format
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    const month = parseInt(parts[0], 10) - 1;
    const day = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    if (!isNaN(month) && !isNaN(day) && !isNaN(year)) {
      return new Date(year, month, day);
    }
  }
  return null;
}

// ============================================
// Constants
// ============================================
const MIN_COLUMN_WIDTH = 75;

// ============================================
// Shared Styles (matching All Campaigns Table)
// ============================================
// Hover state: border highlight + subtle background + text color change
const EDITABLE_CELL_HOVER = "inline-flex px-1 py-1 -mx-1 -my-1 rounded-[4px] border border-transparent hover:border-[rgba(10,120,190,0.4)] hover:bg-[rgba(10,120,190,0.05)] cursor-pointer transition-colors max-w-full";
const EDITABLE_TEXT_STYLE = "font-optimistic text-[14px] text-[rgba(0,0,0,0.75)] hover:text-[#0A78BE] transition-colors";
const INPUT_STYLE = "w-full h-[28px] px-2 text-[14px] font-optimistic text-[#1C2B33] bg-white border border-[#1877F2] rounded-[4px] outline-none ring-1 ring-[#1877F2]";
const DATE_INPUT_STYLE = "w-[90px] h-[28px] px-2 text-[14px] font-optimistic text-[#1C2B33] bg-white border border-[#1877F2] rounded-[4px] outline-none ring-1 ring-[#1877F2]";

// ============================================
// DateInput Component for Schedule Cell
// ============================================
interface DateInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  autoFocus?: boolean;
}

function DateInput({ value, onChange, onBlur, onKeyDown, autoFocus }: DateInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [editValue, setEditValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const cursorPosRef = useRef<number | null>(null);

  const displayValue = isFocused ? editValue : formatDateForDisplay(value);

  useEffect(() => {
    if (cursorPosRef.current !== null && inputRef.current && isFocused) {
      inputRef.current.setSelectionRange(cursorPosRef.current, cursorPosRef.current);
      cursorPosRef.current = null;
    }
  }, [editValue, isFocused]);

  const handleFocus = () => {
    setIsFocused(true);
    setEditValue(formatDateForEdit(value));
  };

  const handleBlur = () => {
    setIsFocused(false);
    const parsed = parseDate(editValue);
    if (parsed && !isNaN(parsed.getTime())) {
      onChange(formatDateForDisplay(editValue));
    } else if (editValue === "") {
      onChange("");
    }
    onBlur?.();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const rawValue = input.value;
    const cursorPos = input.selectionStart || 0;
    
    if (rawValue === "") {
      setEditValue("");
      return;
    }
    
    const rawBeforeCursor = rawValue.slice(0, cursorPos);
    const digitsBeforeCursor = rawBeforeCursor.replace(/\D/g, "").length;
    const formatted = smartFormatDateInput(rawValue);
    
    let newCursorPos = 0;
    let digitCount = 0;
    for (let i = 0; i < formatted.length; i++) {
      if (/\d/.test(formatted[i])) {
        digitCount++;
        if (digitCount === digitsBeforeCursor) {
          newCursorPos = i + 1;
          break;
        }
      }
    }
    
    if (digitCount < digitsBeforeCursor) newCursorPos = formatted.length;
    if (newCursorPos < formatted.length && formatted[newCursorPos] === "/") newCursorPos++;
    
    cursorPosRef.current = newCursorPos;
    setEditValue(formatted);
  };

  return (
    <input
      ref={inputRef}
      type="text"
      value={displayValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={onKeyDown}
      autoFocus={autoFocus}
      placeholder="MM/DD/YYYY"
      className={DATE_INPUT_STYLE}
    />
  );
}

// ============================================
// Helper: Create Editable Cell Renderer
// ============================================
// Used for: Budget, Budget %, Reach, Impressions
const createEditableCell = (
  getValue: (adSet: AdSet) => string | number,
  formatValue: (value: string | number) => string,
  isNumeric: boolean = false
) => {
  return (adSet: AdSet, isEditing: boolean, editProps: EditProps) => {
    if (isEditing) {
      return (
        <input
          type="text"
          value={editProps.value}
          onChange={(e) => editProps.onChange(e.target.value)}
          onKeyDown={editProps.onKeyDown}
          onBlur={editProps.onSave}
          autoFocus
          className={INPUT_STYLE}
        />
      );
    }

    const displayValue = formatValue(getValue(adSet));
    
    return (
      <span
        data-inline-edit
        onClick={editProps.onStartEdit}
        className={EDITABLE_CELL_HOVER}
      >
        <TruncatedText className={EDITABLE_TEXT_STYLE}>
          {displayValue}
        </TruncatedText>
      </span>
    );
  };
};

// ============================================
// Helper: Create Name Cell with Color Dot
// ============================================
const createNameCell = (getColorIndex: (adSetId: string) => number) => {
  return (adSet: AdSet, isEditing: boolean, editProps: EditProps) => {
    const colorIndex = getColorIndex(adSet.id);
    
    if (isEditing) {
      return (
        <div className="flex items-center gap-2">
          <div 
            className="w-[10px] h-[10px] rounded-full shrink-0"
            style={{ backgroundColor: colors.adSet[colorIndex % colors.adSet.length] }}
          />
          <input
            type="text"
            value={editProps.value}
            onChange={(e) => editProps.onChange(e.target.value)}
            onKeyDown={editProps.onKeyDown}
            onBlur={editProps.onSave}
            autoFocus
            className={`flex-1 ${INPUT_STYLE}`}
          />
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2 min-w-0">
        <div 
          className="w-[10px] h-[10px] rounded-full shrink-0"
          style={{ backgroundColor: colors.adSet[colorIndex % colors.adSet.length] }}
        />
        <span
          data-inline-edit
          onClick={editProps.onStartEdit}
          className={EDITABLE_CELL_HOVER}
        >
          <TruncatedText className={EDITABLE_TEXT_STYLE}>
            {adSet.name}
          </TruncatedText>
        </span>
      </div>
    );
  };
};

// ============================================
// Helper: Create Schedule Editable Cell (Two Date Inputs)
// ============================================
const createScheduleEditableCell = () => {
  return (adSet: AdSet, isEditing: boolean, editProps: EditProps) => {
    // Parse the value which is stored as "startDate|endDate"
    const [startDate, endDate] = (editProps.value || '').split('|');
    
    if (isEditing) {
      return (
        <div className="flex items-center gap-1">
          <DateInput
            value={startDate || ''}
            onChange={(newStart) => {
              editProps.onChange(`${newStart}|${endDate || ''}`);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                editProps.onKeyDown?.(e as unknown as React.KeyboardEvent<HTMLInputElement>);
              }
            }}
            autoFocus
          />
          <span className="text-[14px] text-[rgba(0,0,0,0.5)]">-</span>
          <DateInput
            value={endDate || ''}
            onChange={(newEnd) => {
              editProps.onChange(`${startDate || ''}|${newEnd}`);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                editProps.onKeyDown?.(e as unknown as React.KeyboardEvent<HTMLInputElement>);
              }
              if (e.key === 'Enter') {
                editProps.onSave?.();
              }
            }}
            onBlur={editProps.onSave}
          />
        </div>
      );
    }

    // Display mode - show date range
    const fullSchedule = adSet.scheduleStartDate && adSet.scheduleEndDate
      ? `${formatScheduleDate(adSet.scheduleStartDate)} - ${formatScheduleDate(adSet.scheduleEndDate)}`
      : (adSet.schedule || 'Jan 1 - Dec 31');
    
    return (
      <span
        data-inline-edit
        onClick={editProps.onStartEdit}
        className={EDITABLE_CELL_HOVER}
      >
        <TruncatedText className={EDITABLE_TEXT_STYLE}>
          {fullSchedule}
        </TruncatedText>
      </span>
    );
  };
};

// ============================================
// Helper: Create Read-Only Cell
// ============================================
const createReadOnlyCell = (
  getValue: (adSet: AdSet) => string | number,
  formatValue: (value: string | number) => string
) => {
  return (adSet: AdSet) => (
    <TruncatedText className="font-optimistic text-[14px] text-[rgba(0,0,0,0.75)]">
      {formatValue(getValue(adSet))}
    </TruncatedText>
  );
};

// ============================================
// Helper: Create Read-Only Cell with Custom Tooltip
// ============================================
const createReadOnlyCellWithTooltip = (
  getValue: (adSet: AdSet) => string | number,
  formatValue: (value: string | number) => string,
  getTooltip: (adSet: AdSet) => string
) => {
  return (adSet: AdSet) => (
    <TruncatedText 
      className="font-optimistic text-[14px] text-[rgba(0,0,0,0.75)]"
      tooltipContent={getTooltip(adSet)}
    >
      {formatValue(getValue(adSet))}
    </TruncatedText>
  );
};

// ============================================
// Helper: Create Clickable Cell (opens modal on click)
// ============================================
const createClickableCell = (
  getValue: (adSet: AdSet) => string | number,
  formatValue: (value: string | number) => string,
  onClick: (adSet: AdSet) => void
) => {
  return (adSet: AdSet) => (
    <span
      onClick={() => onClick(adSet)}
      className={EDITABLE_CELL_HOVER}
    >
      <TruncatedText className={EDITABLE_TEXT_STYLE}>
        {formatValue(getValue(adSet))}
      </TruncatedText>
    </span>
  );
};

// ============================================
// Ad Sets Table Component
// ============================================
interface AdSetsTableProps {
  plan: CampaignPlan;
  onUpdatePlan: (updates: Partial<CampaignPlan>) => void;
  onOpenEditAdSetModal: (adSet: AdSet, onSave: (updates: Partial<AdSet>) => void) => void;
  onOpenDeleteAdSetModal: (adSetId: string, onConfirm: () => void) => void;
  onOpenEditAudienceModal: (adSet: AdSet, onSave: (updates: Partial<AdSet>) => void) => void;
  // Lifted state from parent
  adSets: AdSet[];
  setAdSets: React.Dispatch<React.SetStateAction<AdSet[]>>;
  adSetCounter: number;
  setAdSetCounter: React.Dispatch<React.SetStateAction<number>>;
}

export function AdSetsTable({ 
  plan, 
  onUpdatePlan, 
  onOpenEditAdSetModal, 
  onOpenDeleteAdSetModal, 
  onOpenEditAudienceModal,
  adSets, 
  setAdSets, 
  adSetCounter, 
  setAdSetCounter 
}: AdSetsTableProps) {
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [editingCell, setEditingCell] = useState<{ itemId: string; columnId: string } | null>(null);
  const [sortColumn, setSortColumn] = useState<string | null>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Edit Columns state
  const [visibleColumns, setVisibleColumns] = useState<string[]>(defaultAdSetVisibleColumns);
  const [isEditColumnsOpen, setIsEditColumnsOpen] = useState(false);
  const [sortedColumnsSnapshot, setSortedColumnsSnapshot] = useState<typeof adSetColumnConfigs>([]);
  
  // Get columns sorted with checked first, then alphabetically
  const getSortedColumns = () => {
    const checked = adSetColumnConfigs
      .filter(col => visibleColumns.includes(col.id))
      .sort((a, b) => a.label.localeCompare(b.label));
    const unchecked = adSetColumnConfigs
      .filter(col => !visibleColumns.includes(col.id))
      .sort((a, b) => a.label.localeCompare(b.label));
    return [...checked, ...unchecked];
  };
  
  // Handle Edit Columns dropdown open
  const handleEditColumnsOpen = () => {
    if (!isEditColumnsOpen) {
      setSortedColumnsSnapshot(getSortedColumns());
    }
    setIsEditColumnsOpen(!isEditColumnsOpen);
  };
  
  // Use snapshot while dropdown is open, otherwise use current sorted order
  const displayColumns = isEditColumnsOpen && sortedColumnsSnapshot.length > 0 
    ? sortedColumnsSnapshot 
    : getSortedColumns();
  
  // Handle column toggle
  const handleColumnToggle = (columnId: string) => {
    setVisibleColumns(prev => {
      if (prev.includes(columnId)) {
        return prev.filter(id => id !== columnId);
      } else {
        return [...prev, columnId];
      }
    });
  };

  // Helper function to evenly distribute budget across ad sets
  const distributeBudgetEvenly = (totalBudget: number, count: number): number[] => {
    if (count === 0) return [];
    const baseBudget = Math.floor(totalBudget / count);
    const remainder = totalBudget - (baseBudget * count);
    
    return Array.from({ length: count }, (_, i) => 
      i < remainder ? baseBudget + 1 : baseBudget
    );
  };

  // Helper to calculate all metrics based on budget proportion
  const calculateMetricsForBudget = (adSetBudget: number, totalBudget: number) => {
    const proportion = totalBudget > 0 ? adSetBudget / totalBudget : 0;
    const reach = Math.round(plan.totalReach * proportion);
    const impressions = Math.round(plan.impressions * proportion);
    const audienceSize = plan.audienceSize || DEFAULT_AUDIENCE_SIZE;
    
    return {
      audienceSize: Math.round(audienceSize * proportion),
      reach,
      reachPercent: Math.round(proportion * 100),
      impressions,
      cpm: adSetBudget > 0 ? (adSetBudget / impressions) * 1000 : 0,
      frequency: reach > 0 ? impressions / reach : 0,
      avgWeeklyFrequency: reach > 0 ? (impressions / reach) / 4 : 0, // Assuming ~4 weeks
    };
  };

  // Helper to format audience size as range
  const formatAudienceSizeRange = (size: number): string => {
    if (size >= 1000000) {
      const millions = size / 1000000;
      const lowerM = Math.floor(millions / 10) * 10;
      const upperM = Math.ceil(millions / 10) * 10 + 10;
      return `${lowerM}M-${upperM}M`;
    } else if (size >= 1000) {
      const thousands = size / 1000;
      const lowerK = Math.floor(thousands / 10) * 10;
      const upperK = Math.ceil(thousands / 10) * 10 + 10;
      return `${lowerK}K-${upperK}K`;
    }
    return `${size}-${size + 1000}`;
  };

  // Add new ad set - adds to top of table and redistributes budget
  const handleAddAdSet = () => {
    const newCount = adSets.length + 1;
    const newId = String(adSetCounter + 1);
    const newName = `Ad Set ${adSetCounter + 1}`;
    
    const distributedBudgets = distributeBudgetEvenly(plan.budget, newCount);
    const metrics = calculateMetricsForBudget(distributedBudgets[0], plan.budget);
    
    // Calculate schedule string and numWeeks from plan
    const scheduleStr = `${formatScheduleDate(plan.schedule.startDate)}...`;
    const msPerWeek = 7 * 24 * 60 * 60 * 1000;
    const numWeeks = Math.max(1, Math.ceil((plan.schedule.endDate.getTime() - plan.schedule.startDate.getTime()) / msPerWeek));
    
    const newAdSet: AdSet = {
      id: newId,
      name: newName,
      budget: distributedBudgets[0],
      budgetPercent: Math.round(100 / newCount),
      ...metrics,
      audienceSizeRange: formatAudienceSizeRange(metrics.audienceSize),
      performanceGoal: 'Reach',
      audience: 'United States, 18-65+',
      schedule: scheduleStr,
      scheduleStartDate: plan.schedule.startDate,
      scheduleEndDate: plan.schedule.endDate,
      numWeeks,
      placements: 'Facebook, Instagram',
    };

    const updatedExistingAdSets = adSets.map((adSet, index) => {
      const newBudget = distributedBudgets[index + 1];
      const updatedMetrics = calculateMetricsForBudget(newBudget, plan.budget);
      return {
        ...adSet,
        budget: newBudget,
        budgetPercent: Math.round((newBudget / plan.budget) * 100),
        ...updatedMetrics,
      };
    });

    setAdSets([newAdSet, ...updatedExistingAdSets]);
    setAdSetCounter(prev => prev + 1);
  };

  // Duplicate selected ad sets
  const handleDuplicateSelected = () => {
    if (checkedIds.size === 0) return;
    
    const selectedAdSets = adSets.filter(adSet => checkedIds.has(adSet.id));
    const newAdSets: AdSet[] = [];
    let currentCounter = adSetCounter;
    
    selectedAdSets.forEach(adSet => {
      currentCounter += 1;
      const newId = String(Date.now() + currentCounter);
      newAdSets.push({
        ...adSet,
        id: newId,
        name: `${adSet.name} (Copy)`,
      });
    });
    
    // Add duplicated ad sets to the top of the list
    setAdSets(prev => [...newAdSets, ...prev]);
    setAdSetCounter(currentCounter);
    
    // Clear selection after duplicating
    setCheckedIds(new Set());
  };

  // Delete selected ad sets (opens confirmation modal)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  
  const handleDeleteSelected = () => {
    if (checkedIds.size === 0) return;
    setShowDeleteConfirmation(true);
  };
  
  const handleConfirmDeleteSelected = () => {
    // Remove selected ad sets
    const remainingAdSets = adSets.filter(adSet => !checkedIds.has(adSet.id));
    
    if (remainingAdSets.length > 0) {
      // Redistribute budget among remaining ad sets
      const distributedBudgets = distributeBudgetEvenly(plan.budget, remainingAdSets.length);
      
      const updatedAdSets = remainingAdSets.map((adSet, index) => {
        const newBudget = distributedBudgets[index];
        const updatedMetrics = calculateMetricsForBudget(newBudget, plan.budget);
        return {
          ...adSet,
          budget: newBudget,
          budgetPercent: Math.round((newBudget / plan.budget) * 100),
          ...updatedMetrics,
        };
      });
      
      setAdSets(updatedAdSets);
    } else {
      setAdSets([]);
    }
    
    // Clear selection and close modal
    setCheckedIds(new Set());
    setShowDeleteConfirmation(false);
  };

  // Update ad sets when plan budget changes
  useEffect(() => {
    if (adSets.length > 0) {
      const distributedBudgets = distributeBudgetEvenly(plan.budget, adSets.length);
      
      setAdSets(prevAdSets => 
        prevAdSets.map((adSet, index) => {
          const newBudget = distributedBudgets[index];
          const updatedMetrics = calculateMetricsForBudget(newBudget, plan.budget);
          return {
            ...adSet,
            budget: newBudget,
            budgetPercent: Math.round((newBudget / plan.budget) * 100),
            ...updatedMetrics,
          };
        })
      );
    }
  }, [plan.budget, plan.totalReach, plan.impressions, plan.audienceSize]);

  // Helper to get current metrics from plan
  const getCurrentMetrics = (): CampaignMetrics => ({
    budget: plan.budget,
    totalReach: plan.totalReach,
    reachPercent: plan.reachPercent,
    frequency: plan.frequency,
    impressions: plan.impressions,
    cpm: plan.cpm,
  });

  // Handle saving edits
  const handleSaveEdit = (itemId: string, columnId: string, value: string) => {
    const numericValue = parseNumericInput(value);
    
    // Handle budget percentage changes
    if (columnId === 'budgetPercent') {
      if (adSets.length === 1) {
        setEditingCell(null);
        return;
      }
      
      const newPercent = Math.max(1, Math.min(99, Math.round(numericValue)));
      const remainingPercent = 100 - newPercent;
      
      const otherAdSets = adSets.filter(a => a.id !== itemId);
      const otherTotalPercent = otherAdSets.reduce((sum, a) => sum + a.budgetPercent, 0);
      
      const updatedAdSets = adSets.map((adSet) => {
        let newAdSetPercent: number;
        
        if (adSet.id === itemId) {
          newAdSetPercent = newPercent;
        } else {
          if (otherTotalPercent > 0) {
            const proportion = adSet.budgetPercent / otherTotalPercent;
            newAdSetPercent = Math.round(remainingPercent * proportion);
          } else {
            newAdSetPercent = Math.round(remainingPercent / otherAdSets.length);
          }
        }
        
        const newBudget = Math.round(plan.budget * (newAdSetPercent / 100));
        
        return {
          ...adSet,
          budget: newBudget,
          budgetPercent: newAdSetPercent,
          ...calculateMetricsForBudget(newBudget, plan.budget),
        };
      });
      
      const totalPercent = updatedAdSets.reduce((sum, a) => sum + a.budgetPercent, 0);
      if (totalPercent !== 100) {
        const diff = 100 - totalPercent;
        const adjustIndex = updatedAdSets.findIndex(a => a.id !== itemId);
        if (adjustIndex !== -1) {
          updatedAdSets[adjustIndex].budgetPercent += diff;
          const newBudget = Math.round(plan.budget * (updatedAdSets[adjustIndex].budgetPercent / 100));
          updatedAdSets[adjustIndex].budget = newBudget;
          const metrics = calculateMetricsForBudget(newBudget, plan.budget);
          updatedAdSets[adjustIndex].reach = metrics.reach;
          updatedAdSets[adjustIndex].reachPercent = metrics.reachPercent;
          updatedAdSets[adjustIndex].impressions = metrics.impressions;
        }
      }
      
      setAdSets(updatedAdSets);
      setEditingCell(null);
      return;
    }
    
    // Handle name changes
    if (columnId === 'name') {
      setAdSets(prev => prev.map(adSet => 
        adSet.id === itemId ? { ...adSet, name: value } : adSet
      ));
      setEditingCell(null);
      return;
    }
    
    // Handle reach percent changes (similar to budget percent but for reach)
    if (columnId === 'reachPercent') {
      if (adSets.length === 1) {
        setEditingCell(null);
        return;
      }
      
      const newPercent = Math.max(1, Math.min(99, Math.round(numericValue)));
      const remainingPercent = 100 - newPercent;
      
      const otherAdSets = adSets.filter(a => a.id !== itemId);
      const otherTotalPercent = otherAdSets.reduce((sum, a) => sum + a.reachPercent, 0);
      
      const updatedAdSets = adSets.map((adSet) => {
        let newAdSetPercent: number;
        
        if (adSet.id === itemId) {
          newAdSetPercent = newPercent;
        } else {
          if (otherTotalPercent > 0) {
            const proportion = adSet.reachPercent / otherTotalPercent;
            newAdSetPercent = Math.round(remainingPercent * proportion);
          } else {
            newAdSetPercent = Math.round(remainingPercent / otherAdSets.length);
          }
        }
        
        const newReach = Math.round(plan.totalReach * (newAdSetPercent / 100));
        // Recalculate impressions based on new reach and existing frequency
        const newImpressions = Math.round(newReach * adSet.frequency);
        
        return {
          ...adSet,
          reach: newReach,
          reachPercent: newAdSetPercent,
          impressions: newImpressions,
          cpm: newImpressions > 0 ? (adSet.budget / newImpressions) * 1000 : 0,
        };
      });
      
      // Ensure percentages total 100%
      const totalPercent = updatedAdSets.reduce((sum, a) => sum + a.reachPercent, 0);
      if (totalPercent !== 100) {
        const diff = 100 - totalPercent;
        const adjustIndex = updatedAdSets.findIndex(a => a.id !== itemId);
        if (adjustIndex !== -1) {
          updatedAdSets[adjustIndex].reachPercent += diff;
          const newReach = Math.round(plan.totalReach * (updatedAdSets[adjustIndex].reachPercent / 100));
          updatedAdSets[adjustIndex].reach = newReach;
          const newImpressions = Math.round(newReach * updatedAdSets[adjustIndex].frequency);
          updatedAdSets[adjustIndex].impressions = newImpressions;
          updatedAdSets[adjustIndex].cpm = newImpressions > 0 ? (updatedAdSets[adjustIndex].budget / newImpressions) * 1000 : 0;
        }
      }
      
      setAdSets(updatedAdSets);
      setEditingCell(null);
      return;
    }
    
    // Handle frequency changes - recalculate impressions (Impressions = Reach × Frequency)
    if (columnId === 'frequency') {
      const newFrequency = Math.max(0.01, parseFloat(value) || 0.01);
      
      setAdSets(prev => prev.map(adSet => {
        if (adSet.id !== itemId) return adSet;
        
        const newImpressions = Math.round(adSet.reach * newFrequency);
        const numWeeks = adSet.numWeeks || 4;
        const newAvgWeeklyFrequency = newFrequency / numWeeks;
        const newCpm = newImpressions > 0 ? (adSet.budget / newImpressions) * 1000 : 0;
        
        return {
          ...adSet,
          frequency: newFrequency,
          avgWeeklyFrequency: newAvgWeeklyFrequency,
          impressions: newImpressions,
          cpm: newCpm,
        };
      }));
      setEditingCell(null);
      return;
    }
    
    // Handle average weekly frequency changes - recalculate frequency and impressions
    if (columnId === 'avgWeeklyFrequency') {
      const newAvgWeeklyFrequency = Math.max(0.01, parseFloat(value) || 0.01);
      
      setAdSets(prev => prev.map(adSet => {
        if (adSet.id !== itemId) return adSet;
        
        const numWeeks = adSet.numWeeks || 4;
        const newFrequency = newAvgWeeklyFrequency * numWeeks;
        const newImpressions = Math.round(adSet.reach * newFrequency);
        const newCpm = newImpressions > 0 ? (adSet.budget / newImpressions) * 1000 : 0;
        
        return {
          ...adSet,
          frequency: newFrequency,
          avgWeeklyFrequency: newAvgWeeklyFrequency,
          impressions: newImpressions,
          cpm: newCpm,
        };
      }));
      setEditingCell(null);
      return;
    }
    
    // Handle CPM changes - recalculate budget and impressions
    if (columnId === 'cpm') {
      const newCpm = Math.max(0.01, parseFloat(value) || 0.01);
      
      setAdSets(prev => {
        const targetAdSet = prev.find(a => a.id === itemId);
        if (!targetAdSet) return prev;
        
        // CPM = (Budget / Impressions) * 1000
        // So: Budget = (CPM * Impressions) / 1000
        // Or: Impressions = (Budget / CPM) * 1000
        // We'll recalculate both budget and impressions proportionally
        const newImpressions = Math.round((targetAdSet.budget / newCpm) * 1000);
        const newBudget = Math.round((newCpm * newImpressions) / 1000);
        const newBudgetPercent = Math.round((newBudget / plan.budget) * 100);
        
        return prev.map(adSet => {
          if (adSet.id !== itemId) return adSet;
          
          return {
            ...adSet,
            cpm: newCpm,
            impressions: newImpressions,
            budget: newBudget,
            budgetPercent: newBudgetPercent,
          };
        });
      });
      setEditingCell(null);
      return;
    }
    
    // Handle schedule changes
    if (columnId === 'schedule') {
      const [startDateStr, endDateStr] = value.split('|');
      const startDate = parseDate(startDateStr);
      const endDate = parseDate(endDateStr);
      
      // Validate: end date must be after start date
      if (startDate && endDate && endDate > startDate) {
        // Calculate number of weeks
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const numWeeks = Math.max(1, Math.ceil(diffDays / 7));
        
        setAdSets(prev => prev.map(adSet => {
          if (adSet.id !== itemId) return adSet;
          
          // Recalculate average weekly frequency based on new number of weeks
          const newAvgWeeklyFrequency = adSet.frequency / numWeeks;
          
          return {
            ...adSet,
            scheduleStartDate: startDate,
            scheduleEndDate: endDate,
            numWeeks,
            avgWeeklyFrequency: newAvgWeeklyFrequency,
          };
        }));
      }
      setEditingCell(null);
      return;
    }
    
    // Handle reach changes - recalculate impressions, frequency, CPM
    if (columnId === 'reach') {
      const newReach = Math.max(1, Math.round(numericValue));
      
      setAdSets(prev => prev.map(adSet => {
        if (adSet.id !== itemId) return adSet;
        
        // Keep frequency constant, recalculate impressions
        const newImpressions = Math.round(newReach * adSet.frequency);
        const newReachPercent = plan.totalReach > 0 ? Math.round((newReach / plan.totalReach) * 100) : 0;
        const newCpm = newImpressions > 0 ? (adSet.budget / newImpressions) * 1000 : 0;
        
        return {
          ...adSet,
          reach: newReach,
          reachPercent: newReachPercent,
          impressions: newImpressions,
          cpm: newCpm,
        };
      }));
      setEditingCell(null);
      return;
    }
    
    // Handle impressions changes - recalculate frequency, CPM
    if (columnId === 'impressions') {
      const newImpressions = Math.max(1, Math.round(numericValue));
      
      setAdSets(prev => prev.map(adSet => {
        if (adSet.id !== itemId) return adSet;
        
        // Recalculate frequency (Frequency = Impressions / Reach)
        const newFrequency = adSet.reach > 0 ? newImpressions / adSet.reach : 0;
        const numWeeks = adSet.numWeeks || 4;
        const newAvgWeeklyFrequency = newFrequency / numWeeks;
        const newCpm = newImpressions > 0 ? (adSet.budget / newImpressions) * 1000 : 0;
        
        return {
          ...adSet,
          impressions: newImpressions,
          frequency: newFrequency,
          avgWeeklyFrequency: newAvgWeeklyFrequency,
          cpm: newCpm,
        };
      }));
      setEditingCell(null);
      return;
    }
    
    // Map ad set fields to plan metric fields (for budget which affects plan-level)
    const metricFieldMapping: Record<string, EditableMetricField> = {
      'budget': 'budget',
    };

    const metricField = metricFieldMapping[columnId];
    
    if (metricField) {
      const audienceSize = plan.audienceSize || DEFAULT_AUDIENCE_SIZE;
      const currentMetrics = getCurrentMetrics();
      
      const updatedMetrics = recalculateMetrics(
        currentMetrics,
        metricField,
        numericValue,
        audienceSize
      );
      
      onUpdatePlan({
        budget: updatedMetrics.budget,
        totalReach: updatedMetrics.totalReach,
        reachPercent: formatReachPercentValue(updatedMetrics.reachPercent),
        frequency: formatFrequencyValue(updatedMetrics.frequency),
        impressions: updatedMetrics.impressions,
        cpm: formatCPMValue(updatedMetrics.cpm),
      });
    }
    
    setEditingCell(null);
  };

  // Handle duplicating an ad set
  const handleDuplicateAdSet = (adSetId: string) => {
    const adSetToDuplicate = adSets.find(a => a.id === adSetId);
    if (!adSetToDuplicate) return;

    const newId = String(adSetCounter + 1);
    const newName = `${adSetToDuplicate.name} (Copy)`;
    
    const newAdSet: AdSet = {
      ...adSetToDuplicate,
      id: newId,
      name: newName,
    };

    const originalIndex = adSets.findIndex(a => a.id === adSetId);
    const newAdSets = [...adSets];
    newAdSets.splice(originalIndex + 1, 0, newAdSet);
    
    const distributedBudgets = distributeBudgetEvenly(plan.budget, newAdSets.length);
    const updatedAdSets = newAdSets.map((adSet, index) => {
      const newBudget = distributedBudgets[index];
      return {
        ...adSet,
        budget: newBudget,
        budgetPercent: Math.round((newBudget / plan.budget) * 100),
        ...calculateMetricsForBudget(newBudget, plan.budget),
      };
    });

    setAdSets(updatedAdSets);
    setAdSetCounter(prev => prev + 1);
  };

  // Handle deleting an ad set
  const handleDeleteAdSet = (adSetId: string) => {
    if (adSets.length <= 1) return;

    const remainingAdSets = adSets.filter(a => a.id !== adSetId);
    
    const distributedBudgets = distributeBudgetEvenly(plan.budget, remainingAdSets.length);
    const updatedAdSets = remainingAdSets.map((adSet, index) => {
      const newBudget = distributedBudgets[index];
      return {
        ...adSet,
        budget: newBudget,
        budgetPercent: Math.round((newBudget / plan.budget) * 100),
        ...calculateMetricsForBudget(newBudget, plan.budget),
      };
    });

    setAdSets(updatedAdSets);
    
    setCheckedIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(adSetId);
      return newSet;
    });
  };

  // Handle sort
  const handleSort = (columnId: string) => {
    if (sortColumn === columnId) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnId);
      setSortDirection('desc');
    }
  };

  // Get color index for an ad set based on its position
  const getColorIndex = useCallback((adSetId: string) => {
    const index = adSets.findIndex(a => a.id === adSetId);
    return index >= 0 ? index : 0;
  }, [adSets]);

  // Create column configurations for DataTable
  // Order matches defaultAdSetVisibleColumns for consistent display:
  // 1. Ad Set, 2. Budget, 3. Budget %, 4. Reach, 5. Frequency,
  // 6. Impressions, 7. Audience, 8. CPM, 9. Schedule
  const columns: ColumnConfig<AdSet>[] = useMemo(() => [
    // === DEFAULT VISIBLE COLUMNS (in display order) ===
    {
      id: 'name',
      label: 'Ad Set',
      sortable: false,
      editable: true,
      editMinWidth: 180,
      render: createNameCell(getColorIndex),
    },
    {
      id: 'budget',
      label: 'Budget',
      sortable: false,
      editable: true,
      render: createEditableCell(
        (adSet) => adSet.budget,
        (value) => `$${formatNumber(Number(value))}`,
        true
      ),
    },
    {
      id: 'budgetPercent',
      label: 'Budget %',
      sortable: false,
      editable: true,
      render: createEditableCell(
        (adSet) => adSet.budgetPercent,
        (value) => `${value}%`,
        true
      ),
    },
    {
      id: 'reach',
      label: 'Reach',
      sortable: false,
      editable: true,
      render: createEditableCell(
        (adSet) => adSet.reach,
        (value) => formatNumber(Number(value)),
        true
      ),
    },
    {
      id: 'frequency',
      label: 'Frequency',
      sortable: false,
      editable: true,
      hasInfoIcon: true,
      infoTooltip: 'Total frequency across the campaign duration',
      render: createEditableCell(
        (adSet) => adSet.frequency,
        (value) => Number(value).toFixed(2),
        true
      ),
    },
    {
      id: 'impressions',
      label: 'Impressions',
      sortable: false,
      editable: true,
      render: createEditableCell(
        (adSet) => adSet.impressions,
        (value) => formatNumber(Number(value)),
        true
      ),
    },
    {
      id: 'audience',
      label: 'Audience',
      sortable: false,
      editable: false,
      render: createClickableCell(
        (adSet) => adSet.audience || 'United States, 18-65+',
        (value) => String(value),
        (adSet) => {
          // Open the Edit Audience modal for this ad set
          onOpenEditAudienceModal(adSet, (updates) => {
            setAdSets(prev => prev.map(a => 
              a.id === adSet.id ? { ...a, ...updates } : a
            ));
          });
        }
      ),
    },
    {
      id: 'cpm',
      label: 'CPM',
      sortable: false,
      editable: true,
      render: createEditableCell(
        (adSet) => adSet.cpm,
        (value) => {
          const num = Number(value);
          // Format to 2 significant figures
          if (num === 0) return '$0.00';
          const magnitude = Math.floor(Math.log10(Math.abs(num)));
          const rounded = Math.round(num / Math.pow(10, magnitude - 1)) * Math.pow(10, magnitude - 1);
          // Display with appropriate decimal places based on magnitude
          if (magnitude >= 2) return `$${Math.round(rounded).toLocaleString()}`;
          if (magnitude >= 0) return `$${rounded.toFixed(Math.max(0, 1 - magnitude))}`;
          return `$${rounded.toFixed(Math.abs(magnitude) + 1)}`;
        },
        true
      ),
    },
    {
      id: 'performanceGoal',
      label: 'Performance goal',
      sortable: false,
      editable: false,
      render: createReadOnlyCell(
        (adSet) => adSet.performanceGoal || 'Reach',
        (value) => String(value)
      ),
    },
    {
      id: 'schedule',
      label: 'Schedule',
      sortable: false,
      editable: true,
      editMinWidth: 220,
      render: createScheduleEditableCell(),
    },
    
    // === HIDDEN BY DEFAULT COLUMNS (available in Edit Columns) ===
    {
      id: 'placements',
      label: 'Placements',
      sortable: false,
      editable: false,
      render: createReadOnlyCell(
        (adSet) => adSet.placements || 'Facebook, Instagram',
        (value) => String(value)
      ),
    },
    {
      id: 'numWeeks',
      label: '# of weeks',
      sortable: false,
      editable: false,
      render: createReadOnlyCell(
        (adSet) => adSet.numWeeks || 0,
        (value) => Number(value) > 0 ? String(value) : '-'
      ),
    },
    {
      id: 'audienceSize',
      label: 'Audience size',
      sortable: false,
      editable: false,
      render: createReadOnlyCell(
        (adSet) => adSet.audienceSizeRange || formatNumber(adSet.audienceSize),
        (value) => String(value)
      ),
    },
    {
      id: 'avgWeeklyFrequency',
      label: 'Average weekly frequency',
      sortable: false,
      editable: true,
      hasInfoIcon: true,
      infoTooltip: 'Average frequency per week',
      render: createEditableCell(
        (adSet) => adSet.avgWeeklyFrequency,
        (value) => Number(value).toFixed(2),
        true
      ),
    },
  ], [getColorIndex, onOpenEditAudienceModal, setAdSets]);

  // Row actions for overflow menu
  const rowActions: RowAction<AdSet>[] = useMemo(() => [
    {
      label: 'Edit',
      icon: 'Pencil',
      onClick: (adSet) => onOpenEditAdSetModal(adSet, (updates) => {
        setAdSets(prev => prev.map(a => 
          a.id === adSet.id ? { ...a, ...updates } : a
        ));
      }),
    },
    {
      label: 'Duplicate',
      icon: 'StackedSquares',
      onClick: (adSet) => handleDuplicateAdSet(adSet.id),
    },
    {
      label: 'Delete',
      icon: 'Trash',
      dividerBefore: true,
      onClick: (adSet) => onOpenDeleteAdSetModal(adSet.id, () => handleDeleteAdSet(adSet.id)),
    },
  ], [onOpenEditAdSetModal, onOpenDeleteAdSetModal]);

  // Footer cells for Total row - rendered inside DataTable grid for consistent column widths
  // Only show totals for columns where aggregation makes sense
  // Columns that show "-" in total row: Budget %, Audience, Performance goal, Schedule
  const footerCells: FooterCell[] = useMemo(() => [
    {
      columnId: 'name',
      content: (
        <span className="font-optimistic font-medium text-[14px] leading-[20px]" style={{ color: 'rgba(0,0,0,0.75)' }}>
          Total
        </span>
      ),
    },
    {
      columnId: 'budget',
      content: (
        <span className="font-optimistic font-medium text-[14px] leading-[20px]" style={{ color: 'rgba(0,0,0,0.75)' }}>
          ${formatNumber(plan.budget)}
        </span>
      ),
    },
    {
      columnId: 'budgetPercent',
      content: (
        <span className="font-optimistic font-medium text-[14px] leading-[20px]" style={{ color: 'rgba(0,0,0,0.75)' }}>
          -
        </span>
      ),
    },
    {
      columnId: 'reach',
      content: (
        <span className="font-optimistic font-medium text-[14px] leading-[20px]" style={{ color: 'rgba(0,0,0,0.75)' }}>
          {formatNumber(plan.totalReach)}
        </span>
      ),
    },
    {
      columnId: 'frequency',
      content: (
        <span className="font-optimistic font-medium text-[14px] leading-[20px]" style={{ color: 'rgba(0,0,0,0.75)' }}>
          {plan.frequency.toFixed(1)}
        </span>
      ),
    },
    {
      columnId: 'impressions',
      content: (
        <span className="font-optimistic font-medium text-[14px] leading-[20px]" style={{ color: 'rgba(0,0,0,0.75)' }}>
          {formatNumber(plan.impressions)}
        </span>
      ),
    },
    {
      columnId: 'audience',
      content: (
        <span className="font-optimistic font-medium text-[14px] leading-[20px]" style={{ color: 'rgba(0,0,0,0.75)' }}>
          -
        </span>
      ),
    },
    {
      columnId: 'cpm',
      content: (
        <span className="font-optimistic font-medium text-[14px] leading-[20px]" style={{ color: 'rgba(0,0,0,0.75)' }}>
          ${plan.cpm.toFixed(2)}
        </span>
      ),
    },
    {
      columnId: 'performanceGoal',
      content: (
        <span className="font-optimistic font-medium text-[14px] leading-[20px]" style={{ color: 'rgba(0,0,0,0.75)' }}>
          -
        </span>
      ),
    },
    {
      columnId: 'schedule',
      content: (
        <span className="font-optimistic font-medium text-[14px] leading-[20px]" style={{ color: 'rgba(0,0,0,0.75)' }}>
          -
        </span>
      ),
    },
    // Hidden columns that may be shown
    {
      columnId: 'placements',
      content: (
        <span className="font-optimistic font-medium text-[14px] leading-[20px]" style={{ color: 'rgba(0,0,0,0.75)' }}>
          -
        </span>
      ),
    },
    {
      columnId: 'numWeeks',
      content: (
        <span className="font-optimistic font-medium text-[14px] leading-[20px]" style={{ color: 'rgba(0,0,0,0.75)' }}>
          -
        </span>
      ),
    },
    {
      columnId: 'audienceSize',
      content: (
        <span className="font-optimistic font-medium text-[14px] leading-[20px]" style={{ color: 'rgba(0,0,0,0.75)' }}>
          -
        </span>
      ),
    },
    {
      columnId: 'avgWeeklyFrequency',
      content: (
        <span className="font-optimistic font-medium text-[14px] leading-[20px]" style={{ color: 'rgba(0,0,0,0.75)' }}>
          {(plan.frequency / 4).toFixed(2)}
        </span>
      ),
    },
  ], [plan.budget, plan.totalReach, plan.impressions, plan.cpm, plan.frequency]);

  return (
    <div 
      className="rounded-[8px] shadow-[0px_0px_8px_0px_rgba(10,120,190,0.08)] p-4"
      style={{ backgroundColor: colors.background.content }}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3">
        {/* Left side: Title or Selection state */}
        <div className="flex items-center gap-3">
          {checkedIds.size > 0 ? (
            <>
              {/* Selection state: "# selected" with X button */}
              <div className="flex items-center gap-1">
                <span 
                  className="font-optimistic font-bold text-[16px] leading-[20px]"
                  style={{ color: colors.text.heading }}
                >
                  {checkedIds.size} selected
                </span>
                <button
                  onClick={() => setCheckedIds(new Set())}
                  className="flex items-center justify-center w-6 h-6 rounded hover:bg-[rgba(0,0,0,0.05)] transition-colors"
                  aria-label="Clear selection"
                >
                  <Icon name="Close" variant="outlined" size={16} color="#5C6970" />
                </button>
              </div>
              {/* Vertical Divider */}
              <div className="flex items-center justify-center h-6 w-px shrink-0">
                <div className="h-6 w-px bg-[#CBD2D9]" />
              </div>
              {/* Bulk Actions */}
              <div className="flex items-center gap-1">
                <Button variant="flat" onClick={handleDuplicateSelected}>
                  <Icon name="StackedSquares" variant="outlined" size={16} />
                  Duplicate
                </Button>
                <Button variant="flat" onClick={handleDeleteSelected}>
                  <Icon name="Trash" variant="outlined" size={16} />
                  Delete
                </Button>
              </div>
            </>
          ) : (
            <h2 
              className="font-optimistic font-bold text-[16px] leading-[20px]" 
              style={{ color: colors.text.heading }}
            >
              Ad Sets ({adSets.length})
            </h2>
          )}
        </div>
        
        {/* Right side: Edit Columns and New Ad Set */}
        <div className="flex items-center gap-3">
          {/* Edit Columns Dropdown */}
          <Dropdown
            trigger={
              <button
                className={`inline-flex items-center justify-center border rounded-[4px] font-optimistic transition-all duration-150 whitespace-nowrap shrink-0 h-[36px] px-[12px] py-[8px] gap-2 text-[14px] font-medium leading-[20px] border-transparent ${
                  isEditColumnsOpen
                    ? "bg-[rgba(0,0,0,0.1)]"
                    : "bg-transparent hover:bg-[rgba(0,0,0,0.05)]"
                }`}
                style={{ color: colors.text.heading }}
                onClick={handleEditColumnsOpen}
              >
                <Icon name="Pencil" variant="outlined" size={16} />
                Edit Columns
              </button>
            }
            width={220}
            position="top"
            align="left"
            onClose={() => setIsEditColumnsOpen(false)}
            closeOnItemClick={false}
          >
            <div className="px-3 pt-2 pb-1">
              <p 
                className="font-optimistic font-bold text-[12px] px-2"
                style={{ color: colors.icon.secondary }}
              >
                Select columns to display
              </p>
            </div>
            <Dropdown.List maxHeight={250}>
              {displayColumns.map(column => (
                <Dropdown.Item
                  key={column.id}
                  label={column.label}
                  selectionType="checkbox"
                  selected={visibleColumns.includes(column.id)}
                  onSelectionChange={() => handleColumnToggle(column.id)}
                />
              ))}
            </Dropdown.List>
          </Dropdown>
          <Button variant="secondary" onClick={handleAddAdSet}>
            <Icon name="Plus" variant="outlined" size={16} />
            New Ad Set
          </Button>
        </div>
      </div>

      {/* Table */}
      <div 
        className="border rounded-[12px] overflow-hidden"
        style={{ borderColor: 'rgba(203,210,217,0.6)' }}
      >
        {/* DataTable for Ad Sets with integrated footer row */}
        <DataTable
          data={adSets}
          getItemId={(adSet) => adSet.id}
          columns={columns}
          visibleColumns={visibleColumns}
          minColumnWidth={MIN_COLUMN_WIDTH}
          showCheckbox={true}
          checkedItems={checkedIds}
          onCheckedItemsChange={setCheckedIds}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
          showActions={true}
          actions={rowActions}
          editingCell={editingCell}
          onStartEdit={(itemId, columnId) => setEditingCell({ itemId, columnId })}
          onSaveEdit={handleSaveEdit}
          onCancelEdit={() => setEditingCell(null)}
          resizable={true}
          tableId="ad-sets"
          footerCells={footerCells}
          footerBackground={colors.background.disabled}
        />
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={handleConfirmDeleteSelected}
        itemCount={checkedIds.size}
        itemType="ad set"
      />
    </div>
  );
}
