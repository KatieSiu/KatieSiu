"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { SideNavigation } from "@/features/campaign-planner/components/ui/SideNavigation";
import { PageHeader } from "@/features/campaign-planner/components/ui/PageHeader";
import { Icon } from "@/features/campaign-planner/components/ui/Icon";
import { Pill } from "@/features/campaign-planner/components/ui/Pill";
import { TruncatedText } from "@/features/campaign-planner/components/ui/TruncatedText";
import { TagCell } from "@/features/campaign-planner/components/ui/TagCell";
import { 
  DataTable, 
  ColumnConfig, 
  EditProps, 
  RowAction,
} from "@/features/campaign-planner/components/ui/DataTable";
import { DeleteConfirmationModal } from "@/features/campaign-planner/components/ui/DeleteConfirmationModal";
import { CreatePlanModal } from "@/features/campaign-planner/components/ui/CreatePlanModal";
import { BookInAdsManagerModal } from "@/features/campaign-planner/components/ui/BookInAdsManagerModal";
import { EmptyState } from "@/features/campaign-planner/components/ui/EmptyState";
import { NoResultsState } from "@/features/campaign-planner/components/ui/NoResultsState";
import { TitleBar, FilterState } from "@/features/campaign-planner/components/ui/TitleBar";
import { usePlans } from "@/features/campaign-planner/lib/plan-context";
import {
  CampaignPlan,
  columnConfigs as mockColumnConfigs,
  formatCurrency,
  formatCurrencyWithDecimals,
  formatNumber,
  formatDate,
  formatSchedule,
  getAllTags,
  getAllCreators,
  DEFAULT_AUDIENCE_SIZE,
  generateAdSetData,
} from "@/features/campaign-planner/lib/mock-data";
import { AdSetPreviewTable } from "@/features/campaign-planner/components/plan-details/AdSetPreviewTable";
import {
  recalculateMetrics,
  formatCPMValue,
  formatFrequencyValue,
  formatReachPercentValue,
  parseNumericInput,
  EditableMetricField,
  CampaignMetrics,
} from "@/features/campaign-planner/lib/campaign-calculations";

// ============================================
// Column Configuration for Campaign Plans
// ============================================

// Minimum column width for flexible columns
const MIN_COLUMN_WIDTH = 100;

// Helper to create editable cell render function
const createEditableCell = (
  getValue: (plan: CampaignPlan) => string | number,
  format: (value: string | number) => string,
  validateAsNumber: boolean = false
) => {
  return (plan: CampaignPlan, isEditing: boolean, editProps: EditProps) => {
    const value = getValue(plan);
    
    if (isEditing) {
      // Validate if the input should be a number
      const isValid = !validateAsNumber || editProps.value === '' || !isNaN(Number(editProps.value));
      
      return (
        <div className="flex flex-col">
          <input
            type="text"
            value={editProps.value}
            onChange={(e) => editProps.onChange(e.target.value)}
            onKeyDown={editProps.onKeyDown}
            onBlur={() => {
              // Only save if valid
              if (!validateAsNumber || editProps.value === '' || !isNaN(Number(editProps.value))) {
                editProps.onSave();
              }
            }}
            autoFocus
            className={`w-full h-[28px] px-2 text-[14px] font-optimistic text-[#1C2B33] bg-white border rounded-[4px] outline-none ring-1 ${
              isValid 
                ? 'border-[#1877F2] ring-[#1877F2]' 
                : 'border-[#D93025] ring-[#D93025]'
            }`}
          />
          {!isValid && (
            <span className="text-[12px] text-[#D93025] mt-1 font-optimistic">
              Invalid Value
            </span>
          )}
        </div>
      );
    }
    
    return (
      <span
        data-inline-edit
        onClick={editProps.onStartEdit}
        className="inline-flex px-1 py-1 -mx-1 -my-1 rounded-[4px] border border-transparent hover:border-[rgba(10,120,190,0.4)] hover:bg-[rgba(10,120,190,0.05)] cursor-pointer transition-colors max-w-full"
      >
        <TruncatedText className="font-optimistic text-[14px] text-[rgba(0,0,0,0.75)] hover:text-[#0A78BE] transition-colors">
          {format(value)}
        </TruncatedText>
      </span>
    );
  };
};

// Helper to create name cell with click-to-edit
const createNameCell = () => {
  return (plan: CampaignPlan, isEditing: boolean, editProps: EditProps) => {
    const value = plan.name;
    
    if (isEditing) {
      // Column automatically expands via editMinWidth property
      // Input fills the full expanded column width
      return (
        <input
          type="text"
          value={editProps.value}
          onChange={(e) => editProps.onChange(e.target.value)}
          onKeyDown={editProps.onKeyDown}
          onBlur={editProps.onSave}
          autoFocus
          className="w-full h-[28px] px-2 text-[14px] font-optimistic text-[#1C2B33] bg-white border border-[#1877F2] rounded-[4px] outline-none ring-1 ring-[#1877F2]"
        />
      );
    }
    
    return (
      <span
        data-inline-edit
        onClick={editProps.onStartEdit}
        className="inline-flex px-1 py-1 -mx-1 -my-1 rounded-[4px] border border-transparent hover:border-[rgba(10,120,190,0.4)] hover:bg-[rgba(10,120,190,0.05)] cursor-pointer transition-colors max-w-full"
      >
        <TruncatedText className="font-optimistic text-[14px] text-[rgba(0,0,0,0.75)] hover:text-[#0A78BE] transition-colors whitespace-nowrap">
          {value}
        </TruncatedText>
      </span>
    );
  };
};

// Helper to create schedule cell with date range editing
const createScheduleCell = () => {
  return (plan: CampaignPlan, isEditing: boolean, editProps: EditProps) => {
    const schedule = plan.schedule;
    
    if (isEditing) {
      // Parse the stored value (format: "YYYY-MM-DD|YYYY-MM-DD")
      const [startStr, endStr] = (editProps.value || '').split('|');
      const startValue = startStr || '';
      const endValue = endStr || '';
      
      const handleDateChange = (type: 'start' | 'end', value: string) => {
        if (type === 'start') {
          editProps.onChange(`${value}|${endValue}`);
        } else {
          editProps.onChange(`${startValue}|${value}`);
        }
      };
      
      return (
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={startValue}
            onChange={(e) => handleDateChange('start', e.target.value)}
            onBlur={(e) => {
              // Only save if clicking outside both inputs
              const relatedTarget = e.relatedTarget as HTMLElement;
              if (!relatedTarget || !relatedTarget.closest('[data-schedule-input]')) {
                editProps.onSave();
              }
            }}
            autoFocus
            data-schedule-input
            className="h-[28px] px-2 text-[14px] font-optimistic text-[#1C2B33] bg-white border border-[#1877F2] rounded-[4px] outline-none ring-1 ring-[#1877F2] [&::-webkit-calendar-picker-indicator]:hidden"
          />
          <span className="text-[14px] text-[rgba(0,0,0,0.5)]">-</span>
          <input
            type="date"
            value={endValue}
            onChange={(e) => handleDateChange('end', e.target.value)}
            onBlur={(e) => {
              const relatedTarget = e.relatedTarget as HTMLElement;
              if (!relatedTarget || !relatedTarget.closest('[data-schedule-input]')) {
                editProps.onSave();
              }
            }}
            data-schedule-input
            className="h-[28px] px-2 text-[14px] font-optimistic text-[#1C2B33] bg-white border border-[#1877F2] rounded-[4px] outline-none ring-1 ring-[#1877F2] [&::-webkit-calendar-picker-indicator]:hidden"
          />
        </div>
      );
    }
    
    return (
      <span
        data-inline-edit
        onClick={editProps.onStartEdit}
        className="inline-flex px-1 py-1 -mx-1 -my-1 rounded-[4px] border border-transparent hover:border-[rgba(10,120,190,0.4)] hover:bg-[rgba(10,120,190,0.05)] cursor-pointer transition-colors max-w-full"
      >
        <TruncatedText className="font-optimistic text-[14px] text-[rgba(0,0,0,0.75)] hover:text-[#0A78BE] transition-colors whitespace-nowrap">
          {formatSchedule(schedule)}
        </TruncatedText>
      </span>
    );
  };
};

// Helper to create description cell with placeholder
const createDescriptionCell = () => {
  return (plan: CampaignPlan, isEditing: boolean, editProps: EditProps) => {
    const value = plan.description || '';
    const hasValue = value.trim().length > 0;
    
    if (isEditing) {
      // Column automatically expands via editMinWidth property
      // Input fills the full expanded column width
      return (
        <input
          type="text"
          value={editProps.value}
          onChange={(e) => editProps.onChange(e.target.value)}
          onKeyDown={editProps.onKeyDown}
          onBlur={editProps.onSave}
          autoFocus
          placeholder="Add Description..."
          className="w-full h-[28px] px-2 text-[14px] font-optimistic text-[#1C2B33] bg-white border border-[#1877F2] rounded-[4px] outline-none ring-1 ring-[#1877F2] placeholder:text-[rgba(28,43,51,0.65)]"
        />
      );
    }
    
    if (hasValue) {
      return (
        <span
          data-inline-edit
          onClick={editProps.onStartEdit}
          className="inline-flex px-1 py-1 -mx-1 -my-1 rounded-[4px] border border-transparent hover:border-[rgba(10,120,190,0.4)] hover:bg-[rgba(10,120,190,0.05)] cursor-pointer transition-colors max-w-full"
        >
          <TruncatedText className="font-optimistic text-[14px] text-[rgba(0,0,0,0.75)] hover:text-[#0A78BE] transition-colors whitespace-nowrap">
            {value}
          </TruncatedText>
        </span>
      );
    }
    
    // Placeholder state - clickable to add description
    return (
      <span 
        data-inline-edit
        onClick={editProps.onStartEdit}
        className="font-optimistic text-[14px] text-[rgba(0,0,0,0.4)] cursor-pointer px-1 py-1 -mx-1 -my-1 rounded-[4px] border border-transparent hover:border-[rgba(10,120,190,0.4)] hover:bg-[rgba(10,120,190,0.05)] hover:text-[#0A78BE] transition-colors whitespace-nowrap truncate block"
      >
        Add Description...
      </span>
    );
  };
};

// Column configurations with custom render functions
// Order here determines display order - visibleColumns array controls which are shown
const createCampaignColumns = (): ColumnConfig<CampaignPlan>[] => [
  // Default visible columns (in display order): Name, Description, Total budget, Impressions, CPM, Schedule, Tags, Created
  {
    id: 'name',
    label: 'Name',
    sortable: true,
    editable: true,
    editMinWidth: 200,
    render: createNameCell(),
  },
  {
    id: 'description',
    label: 'Description',
    sortable: false,
    editable: true,
    editMinWidth: 200,
    render: createDescriptionCell(),
  },
  {
    id: 'budget',
    label: 'Total budget',
    sortable: true,
    editable: true,
    render: createEditableCell(
      (plan) => plan.budget,
      (value) => formatCurrency(Number(value)),
      true
    ),
  },
  {
    id: 'impressions',
    label: 'Impressions',
    sortable: true,
    editable: true,
    render: createEditableCell(
      (plan) => plan.impressions,
      (value) => formatNumber(Number(value)),
      true
    ),
  },
  {
    id: 'cpm',
    label: 'CPM',
    sortable: true,
    render: (plan) => (
      <span className="font-optimistic text-[14px] text-[rgba(0,0,0,0.75)] whitespace-nowrap">
        {formatCurrencyWithDecimals(plan.cpm)}
      </span>
    ),
  },
  {
    id: 'schedule',
    label: 'Schedule',
    sortable: true,
    editable: true,
    editMinWidth: 280,
    render: createScheduleCell(),
  },
  {
    id: 'tags',
    label: 'Tags',
    // Note: This is a placeholder render - the actual TagCell is injected via createTagsColumn
    render: (plan) => (
      <div className="flex items-center gap-1.5 overflow-hidden">
        {plan.tags.slice(0, 2).map(tag => (
          <Pill key={tag} variant="default" className="shrink-0 max-w-[120px] truncate">{tag}</Pill>
        ))}
        {plan.tags.length > 2 && (
          <span className="text-[12px] text-[rgba(0,0,0,0.5)] shrink-0">+{plan.tags.length - 2}</span>
        )}
      </div>
    ),
  },
  {
    id: 'createdDate',
    label: 'Created',
    sortable: true,
    render: (plan) => (
      <span className="font-optimistic text-[14px] text-[rgba(0,0,0,0.75)] whitespace-nowrap">
        {formatDate(plan.createdDate)}
      </span>
    ),
  },
  // Hidden by default columns (available in Edit Columns menu)
  {
    id: 'adSets',
    label: '# of Ad sets',
    sortable: true,
    render: (plan) => (
      <span className="font-optimistic text-[14px] text-[rgba(0,0,0,0.75)] whitespace-nowrap">
        {plan.adSets}
      </span>
    ),
  },
  {
    id: 'buyingType',
    label: 'Buying type',
    sortable: true,
    render: (plan) => (
      <span className="font-optimistic text-[14px] text-[rgba(0,0,0,0.75)] whitespace-nowrap">
        {plan.buyingType}
      </span>
    ),
  },
  {
    id: 'creator',
    label: 'Creator',
    sortable: true,
    render: (plan) => (
      <TruncatedText className="font-optimistic text-[14px] text-[rgba(0,0,0,0.75)]">
        {plan.creator}
      </TruncatedText>
    ),
  },
  {
    id: 'lastEdited',
    label: 'Last edited',
    sortable: true,
    render: (plan) => (
      <div className="flex items-center gap-1.5 whitespace-nowrap">
        <span className="font-optimistic text-[14px] text-[rgba(0,0,0,0.75)]">
          {formatDate(plan.lastEdited)}
        </span>
        <Icon name="RefreshRight" variant="outlined" size={12} className="text-[#0A78BE] shrink-0" />
      </div>
    ),
  },
  {
    id: 'lastForecasted',
    label: 'Last forecasted',
    sortable: true,
    render: (plan) => (
      <span className="font-optimistic text-[14px] text-[rgba(0,0,0,0.75)] whitespace-nowrap">
        {formatDate(plan.lastForecasted)}
      </span>
    ),
  },
  {
    id: 'actions',
    label: '',
  },
];

// ============================================
// Main Page Component
// ============================================

// Create campaign columns once (outside component to avoid recreating)
const campaignColumns = createCampaignColumns();

// Storage key for column visibility persistence
const VISIBLE_COLUMNS_STORAGE_KEY = "campaign-table-visible-columns";

// Default visible columns (used for initial render to avoid hydration mismatch)
const defaultVisibleColumns = mockColumnConfigs.filter(c => c.defaultVisible).map(c => c.id);

export default function PrototypePage() {
  // Router for navigation
  const router = useRouter();
  
  // Shared state from context
  const { plans, addPlan, updatePlan, deletePlan, deletePlans, duplicatePlan, duplicatePlans } = usePlans();
  
  // Local UI state
  const [searchValue, setSearchValue] = useState('');
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [sortColumn, setSortColumn] = useState<string | null>('createdDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [visibleColumns, setVisibleColumns] = useState<string[]>(defaultVisibleColumns);
  const [filters, setFilters] = useState<FilterState>({ tags: [], noTags: false, creators: [], buyingTypes: [] });
  const [editingCell, setEditingCell] = useState<{ itemId: string; columnId: string } | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [singleDeleteId, setSingleDeleteId] = useState<string | null>(null); // For single row delete via overflow menu
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [planToBook, setPlanToBook] = useState<CampaignPlan | null>(null);
  const [isReady, setIsReady] = useState(false);
  
  // Global tags state - initialized from plans, can be extended with new tags
  const [globalTags, setGlobalTags] = useState<string[]>([]);

  // Load visible columns from sessionStorage on mount (before first meaningful render)
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(VISIBLE_COLUMNS_STORAGE_KEY);
      if (stored) {
        const storedColumns: string[] = JSON.parse(stored);
        const storedColumnsSet = new Set(storedColumns);
        
        // 1. Validate: Filter stored columns to only include valid column IDs
        const validColumnIds = new Set(mockColumnConfigs.map(c => String(c.id)));
        const validStoredColumns = storedColumns.filter(id => validColumnIds.has(id));
        
        // 2. Include new columns: Add any new default-visible columns that weren't in storage
        const newDefaultColumns = mockColumnConfigs
          .filter(c => c.defaultVisible && !storedColumnsSet.has(String(c.id)))
          .map(c => String(c.id));
        
        // Merge: valid stored columns + any new default columns
        const mergedColumns = [...validStoredColumns, ...newDefaultColumns];
        
        setVisibleColumns(mergedColumns);
      }
    } catch (e) {
      // Ignore storage errors - will use defaults
    }
    // Small delay to ensure state is set before marking ready
    requestAnimationFrame(() => {
      setIsReady(true);
    });
  }, []);

  // Persist visible columns to sessionStorage when they change (only after ready)
  useEffect(() => {
    if (!isReady) return;
    try {
      sessionStorage.setItem(VISIBLE_COLUMNS_STORAGE_KEY, JSON.stringify(visibleColumns));
    } catch (e) {
      // Ignore storage errors
    }
  }, [visibleColumns, isReady]);

  // Derived data
  const tagsFromPlans = getAllTags(plans);
  const allCreators = getAllCreators(plans);
  
  // Combine tags from plans with any newly created global tags
  const allTags = useMemo(() => {
    const combined = new Set([...tagsFromPlans, ...globalTags]);
    return Array.from(combined).sort();
  }, [tagsFromPlans, globalTags]);
  
  // Callback to update a plan's tags
  const handleUpdatePlanTags = useCallback((planId: string, newTags: string[]) => {
    updatePlan(planId, { tags: newTags });
  }, [updatePlan]);
  
  // Callback to add a new tag to the global list
  const handleCreateGlobalTag = useCallback((tagName: string) => {
    setGlobalTags(prev => {
      if (prev.includes(tagName)) return prev;
      return [...prev, tagName].sort();
    });
  }, []);
  
  // Callback to edit (rename) a tag globally
  const handleEditGlobalTag = useCallback((oldName: string, newName: string) => {
    // Update in globalTags
    setGlobalTags(prev => {
      const filtered = prev.filter(t => t !== oldName);
      if (!filtered.includes(newName)) {
        return [...filtered, newName].sort();
      }
      return filtered;
    });
    
    // Update in all plans that have this tag
    plans.forEach(plan => {
      if (plan.tags.includes(oldName)) {
        const newTags = plan.tags.map(t => t === oldName ? newName : t);
        updatePlan(plan.id, { tags: newTags });
      }
    });
  }, [plans, updatePlan]);
  
  // Callback to delete a tag globally
  const handleDeleteGlobalTag = useCallback((tagName: string) => {
    // Remove from globalTags
    setGlobalTags(prev => prev.filter(t => t !== tagName));
    
    // Remove from all plans that have this tag
    plans.forEach(plan => {
      if (plan.tags.includes(tagName)) {
        const newTags = plan.tags.filter(t => t !== tagName);
        updatePlan(plan.id, { tags: newTags });
      }
    });
  }, [plans, updatePlan]);
  
  // Create columns with interactive TagCell
  const columnsWithTagCell = useMemo(() => {
    return campaignColumns.map(col => {
      if (col.id === 'tags') {
        return {
          ...col,
          editMinWidth: 220, // Expand column when editing tags
          render: (plan: CampaignPlan) => (
            <TagCell
              selectedTags={plan.tags}
              allTags={allTags}
              onTagsChange={(tags) => handleUpdatePlanTags(plan.id, tags)}
              onCreateTag={handleCreateGlobalTag}
              onEditTag={handleEditGlobalTag}
              onDeleteTag={handleDeleteGlobalTag}
              onOpenChange={(isOpen) => {
                if (isOpen) {
                  setEditingCell({ itemId: plan.id, columnId: 'tags' });
                } else {
                  // Only clear if we're still editing this cell
                  setEditingCell(prev => 
                    prev?.itemId === plan.id && prev?.columnId === 'tags' ? null : prev
                  );
                }
              }}
            />
          ),
        };
      }
      return col;
    });
  }, [allTags, handleUpdatePlanTags, handleCreateGlobalTag, handleEditGlobalTag, handleDeleteGlobalTag]);
  
  // Calculate budget bounds: lowest - $1000 and highest + $1000, rounded to nearest $1000
  const budgetBounds = (() => {
    if (plans.length === 0) return { min: 0, max: 100000 };
    const budgets = plans.map(p => p.budget);
    const minBudget = Math.min(...budgets);
    const maxBudget = Math.max(...budgets);
    // Round down to nearest 1000 and subtract 1000
    const min = Math.max(0, Math.floor(minBudget / 1000) * 1000 - 1000);
    // Round up to nearest 1000 and add 1000
    const max = Math.ceil(maxBudget / 1000) * 1000 + 1000;
    return { min, max };
  })();
  
  // Calculate impressions bounds: rounded to nearest 1M with buffer
  const impressionsBounds = (() => {
    if (plans.length === 0) return { min: 0, max: 100000000 };
    const impressions = plans.map(p => p.impressions);
    const minImpressions = Math.min(...impressions);
    const maxImpressions = Math.max(...impressions);
    // Round down to nearest 1M and subtract 1M
    const min = Math.max(0, Math.floor(minImpressions / 1000000) * 1000000 - 1000000);
    // Round up to nearest 1M and add 1M
    const max = Math.ceil(maxImpressions / 1000000) * 1000000 + 1000000;
    return { min, max };
  })();
  
  // Calculate CPM bounds: rounded to nearest $1 with buffer
  const cpmBounds = (() => {
    if (plans.length === 0) return { min: 0, max: 20 };
    const cpms = plans.map(p => p.cpm);
    const minCpm = Math.min(...cpms);
    const maxCpm = Math.max(...cpms);
    // Round down to nearest 0.5 and subtract 0.5
    const min = Math.max(0, Math.floor(minCpm * 2) / 2 - 0.5);
    // Round up to nearest 0.5 and add 0.5
    const max = Math.ceil(maxCpm * 2) / 2 + 0.5;
    return { min, max };
  })();

  // Helper function to parse date string (MM/DD/YYYY format)
  const parseFilterDate = (dateStr: string): Date | null => {
    if (!dateStr) return null;
    // Try MM/DD/YYYY format first
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const month = parseInt(parts[0], 10) - 1;
      const day = parseInt(parts[1], 10);
      const year = parseInt(parts[2], 10);
      if (!isNaN(month) && !isNaN(day) && !isNaN(year)) {
        return new Date(year, month, day);
      }
    }
    // Fallback to standard Date parsing
    const parsed = new Date(dateStr);
    return isNaN(parsed.getTime()) ? null : parsed;
  };

  // Filter and sort plans
  const filteredPlans = plans
    .filter(plan => {
      // Search filter
      if (searchValue) {
        const search = searchValue.toLowerCase();
        const matchesName = plan.name.toLowerCase().includes(search);
        const matchesDescription = plan.description?.toLowerCase().includes(search) || false;
        const matchesCreator = plan.creator.toLowerCase().includes(search);
        const matchesTags = plan.tags.some(tag => tag.toLowerCase().includes(search));
        if (!matchesName && !matchesDescription && !matchesCreator && !matchesTags) return false;
      }
      // No Tags filter - filter for plans with no tags
      if (filters.noTags && plan.tags.length > 0) {
        return false;
      }
      // Tag filter (only applies when noTags is false)
      if (!filters.noTags && filters.tags.length > 0 && !plan.tags.some(tag => filters.tags.includes(tag))) {
        return false;
      }
      // Creator filter
      if (filters.creators.length > 0 && !filters.creators.includes(plan.creator)) {
        return false;
      }
      // Buying Type filter
      if (filters.buyingTypes.length > 0 && !filters.buyingTypes.includes(plan.buyingType)) {
        return false;
      }
      // Budget filter
      if (filters.budgetMin !== undefined && plan.budget < filters.budgetMin) {
        return false;
      }
      if (filters.budgetMax !== undefined && plan.budget > filters.budgetMax) {
        return false;
      }
      // Impressions filter
      if (filters.impressionsMin !== undefined && plan.impressions < filters.impressionsMin) {
        return false;
      }
      if (filters.impressionsMax !== undefined && plan.impressions > filters.impressionsMax) {
        return false;
      }
      // CPM filter
      if (filters.cpmMin !== undefined && plan.cpm < filters.cpmMin) {
        return false;
      }
      if (filters.cpmMax !== undefined && plan.cpm > filters.cpmMax) {
        return false;
      }
      // Schedule filter - check if plan's schedule overlaps with filter range
      if (filters.scheduleStart || filters.scheduleEnd) {
        const filterStart = parseFilterDate(filters.scheduleStart || '');
        const filterEnd = parseFilterDate(filters.scheduleEnd || '');
        const planStart = plan.schedule.startDate;
        const planEnd = plan.schedule.endDate;
        
        // Check for overlap: plan ends before filter starts, or plan starts after filter ends = no overlap
        if (filterStart && planEnd < filterStart) return false;
        if (filterEnd) {
          const filterEndEOD = new Date(filterEnd);
          filterEndEOD.setHours(23, 59, 59, 999);
          if (planStart > filterEndEOD) return false;
        }
      }
      // Creation Date filter
      if (filters.dateStart) {
        const startDate = parseFilterDate(filters.dateStart);
        if (startDate && plan.createdDate < startDate) return false;
      }
      if (filters.dateEnd) {
        const endDate = parseFilterDate(filters.dateEnd);
        if (endDate) {
          endDate.setHours(23, 59, 59, 999); // Include the entire end date
          if (plan.createdDate > endDate) return false;
        }
      }
      return true;
    })
    .sort((a, b) => {
      if (!sortColumn) return 0;
      const aVal = a[sortColumn as keyof CampaignPlan];
      const bVal = b[sortColumn as keyof CampaignPlan];
      
      let comparison = 0;
      if (aVal instanceof Date && bVal instanceof Date) {
        comparison = aVal.getTime() - bVal.getTime();
      } else if (typeof aVal === 'number' && typeof bVal === 'number') {
        comparison = aVal - bVal;
      } else {
        comparison = String(aVal).localeCompare(String(bVal));
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });

  // Handlers
  const handleSort = (columnId: string) => {
    if (sortColumn === columnId) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnId);
      setSortDirection('desc');
    }
  };

  const handleColumnToggle = (columnId: string) => {
    setVisibleColumns(prev => {
      if (prev.includes(columnId)) {
        return prev.filter(id => id !== columnId);
      } else {
        return [...prev, columnId];
      }
    });
  };

  const handleCreatePlan = () => {
    setIsCreateModalOpen(true);
  };

  // Handle successful plan creation from modal
  const handlePlanCreated = (planData: any) => {
    const today = new Date();
    const newPlan: CampaignPlan = {
      id: planData.id, // Use the ID generated by the modal
      name: planData.name,
      description: '',
      budget: planData.budget ? parseFloat(planData.budget.replace(/,/g, '')) : 50000,
      totalReach: 1000000,
      frequency: 2.5,
      cpm: 8.5,
      schedule: {
        startDate: new Date(planData.schedule.startDate),
        startTime: planData.schedule.startTime || '12:00 AM',
        endDate: new Date(planData.schedule.endDate),
        endTime: planData.schedule.endTime || '11:59 PM',
      },
      buyingType: planData.buyingType === 'reservation' ? 'Reservation' : 'Auction',
      lastEdited: today,
      createdDate: today,
      adSets: 1,
      reachPercent: 25.0,
      audienceSize: DEFAULT_AUDIENCE_SIZE,
      creator: 'You',
      impressions: 2500000,
      lastForecasted: today,
      flightDate: new Date(planData.schedule.startDate),
      tags: [],
    };
    addPlan(newPlan);
  };

  // Navigate to plan details page
  const handleNavigateToPlan = (planId: string) => {
    router.push(`/campaign-planner/prototype/plan/${planId}`);
  };

  const handleEdit = (plan: CampaignPlan) => {
    router.push(`/campaign-planner/prototype/plan/${plan.id}`);
  };

  // Handle single row duplication (from overflow menu)
  const handleDuplicate = (plan: CampaignPlan) => {
    duplicatePlan(plan.id);
  };

  // Handle single row delete (from overflow menu) - shows confirmation modal
  const handleDeleteWithConfirmation = (plan: CampaignPlan) => {
    setSingleDeleteId(plan.id);
    setIsDeleteModalOpen(true);
  };

  // Handle deletion confirmation (works for both bulk and single)
  const handleConfirmDelete = () => {
    if (singleDeleteId) {
      // Single row delete from overflow menu
      deletePlan(singleDeleteId);
      setCheckedIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(singleDeleteId);
        return newSet;
      });
      setSingleDeleteId(null);
    } else {
      // Bulk delete from title bar
      deletePlans(Array.from(checkedIds));
      setCheckedIds(new Set());
    }
  };

  // Close delete modal and reset single delete state
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSingleDeleteId(null);
  };

  // Handle bulk duplication
  const handleBulkDuplicate = () => {
    duplicatePlans(Array.from(checkedIds));
    setCheckedIds(new Set()); // Clear selection after duplicating
  };

  // Handle CSV download for selected plans
  const handleDownloadCSV = () => {
    const selectedPlans = plans.filter(p => checkedIds.has(p.id));
    if (selectedPlans.length === 0) return;

    // Define CSV headers
    const headers = [
      'Name',
      'Description',
      'Total Budget',
      'Impressions',
      'CPM',
      'Schedule Start',
      'Schedule End',
      'Tags',
      'Created',
      'Creator',
      'Buying Type',
      'Last Edited',
    ];

    // Convert plans to CSV rows
    const rows = selectedPlans.map(plan => [
      `"${plan.name.replace(/"/g, '""')}"`,
      `"${(plan.description || '').replace(/"/g, '""')}"`,
      plan.budget,
      plan.impressions,
      plan.cpm.toFixed(2),
      plan.schedule.startDate.toLocaleDateString(),
      plan.schedule.endDate.toLocaleDateString(),
      `"${plan.tags.join(', ')}"`,
      plan.createdDate.toLocaleDateString(),
      `"${plan.creator}"`,
      plan.buyingType,
      plan.lastEdited.toLocaleDateString(),
    ]);

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `campaign-plans-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle "Book in Ads Manager" action (from title bar - single selection only)
  const handleBookInAdsManager = () => {
    // Get the single selected plan (button is only visible when 1 item is selected)
    const selectedPlanId = Array.from(checkedIds)[0];
    const selectedPlan = plans.find(p => p.id === selectedPlanId);
    if (selectedPlan) {
      setPlanToBook(selectedPlan);
      setIsBookModalOpen(true);
    }
  };

  // Handle single row "Book in Ads Manager" action (from overflow menu)
  const handleBookSinglePlan = (plan: CampaignPlan) => {
    setPlanToBook(plan);
    setIsBookModalOpen(true);
  };

  const handleSaveEdit = (itemId: string, columnId: string, value: string) => {
    const column = mockColumnConfigs.find(c => c.id === columnId);
    const plan = plans.find(p => p.id === itemId);
    if (!plan) return;
    
    // Handle schedule type specially - no recalculation needed
    if (column?.type === 'schedule') {
      const [startStr, endStr] = value.split('|');
      if (startStr && endStr) {
        updatePlan(itemId, {
          schedule: {
            ...plan.schedule,
            startDate: new Date(startStr + 'T00:00:00'),
            endDate: new Date(endStr + 'T00:00:00'),
          },
        });
      }
      setEditingCell(null);
      return;
    }
    
    // Fields that don't affect other metrics
    const nonMetricFields = ['name', 'description'];
    if (nonMetricFields.includes(columnId)) {
      updatePlan(itemId, { [columnId]: value });
      setEditingCell(null);
      return;
    }
    
    // Metric fields that trigger recalculation
    const metricFields: EditableMetricField[] = ['budget', 'totalReach', 'reachPercent', 'frequency', 'impressions'];
    if (metricFields.includes(columnId as EditableMetricField)) {
      // Use parseNumericInput to handle currency symbols, commas, etc.
      const newValue = parseNumericInput(value);
      const audienceSize = plan.audienceSize || DEFAULT_AUDIENCE_SIZE;
      
      // Get current metrics from the plan
      const currentMetrics: CampaignMetrics = {
        budget: plan.budget,
        totalReach: plan.totalReach,
        reachPercent: plan.reachPercent,
        frequency: plan.frequency,
        impressions: plan.impressions,
        cpm: plan.cpm,
      };
      
      // Recalculate all dependent fields
      const updatedMetrics = recalculateMetrics(
        currentMetrics,
        columnId as EditableMetricField,
        newValue,
        audienceSize
      );
      
      // Update plan with recalculated values (formatted for display)
      updatePlan(itemId, {
        budget: updatedMetrics.budget,
        totalReach: updatedMetrics.totalReach,
        reachPercent: formatReachPercentValue(updatedMetrics.reachPercent),
        frequency: formatFrequencyValue(updatedMetrics.frequency),
        impressions: updatedMetrics.impressions,
        cpm: formatCPMValue(updatedMetrics.cpm),
      });
      
      setEditingCell(null);
      return;
    }
    
    // Default handling for other fields
    let parsedValue: string | number = value;
    if (column?.type === 'currency' || column?.type === 'number' || column?.type === 'percent') {
      parsedValue = parseFloat(value) || 0;
    }
    updatePlan(itemId, { [columnId]: parsedValue });
    setEditingCell(null);
  };

  // Row actions for the overflow menu
  const rowActions: RowAction<CampaignPlan>[] = [
    { label: 'Edit', onClick: handleEdit },
    { label: 'Duplicate', onClick: handleDuplicate },
    { label: 'Book in Ads Manager', onClick: handleBookSinglePlan, dividerBefore: true },
    { label: 'Delete', onClick: handleDeleteWithConfirmation, dividerBefore: true },
  ];

  const isEmpty = plans.length === 0;

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Side Navigation */}
      <SideNavigation />

      {/* Main Content */}
      <main 
        className="flex-1 flex flex-col gap-[10px] overflow-hidden px-6 py-4 relative"
        style={{
          background: `
            radial-gradient(ellipse at 95% 105%, rgba(224,245,232,0.85) 0%, rgba(224,245,232,0) 45%),
            radial-gradient(ellipse at -20% 10%, rgba(250,235,235,1) 0%, rgba(240,230,245,1) 20%, rgba(220,236,252,1) 40%, rgba(235,241,248,1) 70%),
            linear-gradient(to right, rgba(241,244,250,1) 0%, rgba(245,248,252,1) 100%)
          `,
        }}
      >
        {/* Page Header */}
        <PageHeader />

        {/* Content - only render after column visibility is loaded from storage */}
        {isReady ? (
          <>
            {/* Title Bar */}
            <TitleBar
              planCount={filteredPlans.length}
              selectedCount={checkedIds.size}
              searchValue={searchValue}
              onSearchChange={setSearchValue}
              onCreatePlan={handleCreatePlan}
              visibleColumns={visibleColumns}
              onColumnToggle={handleColumnToggle}
              filters={filters}
              onFilterChange={setFilters}
              allTags={allTags}
              allCreators={allCreators}
              budgetBounds={budgetBounds}
              impressionsBounds={impressionsBounds}
              cpmBounds={cpmBounds}
              onClearSelection={() => setCheckedIds(new Set())}
              onDownloadCSV={handleDownloadCSV}
              onDuplicateSelected={handleBulkDuplicate}
              onDeleteSelected={() => setIsDeleteModalOpen(true)}
              onBookInAdsManager={handleBookInAdsManager}
            />

            {/* Table or Empty State */}
            <div className="flex-1 bg-white rounded-[8px] shadow-[0px_0px_8px_0px_rgba(10,120,190,0.08)] overflow-hidden flex flex-col">
              {isEmpty ? (
                <EmptyState onCreatePlan={handleCreatePlan} />
              ) : filteredPlans.length === 0 ? (
                <NoResultsState 
                  onReset={() => {
                    // Clear search
                    setSearchValue('');
                    // Clear all filters
                    setFilters({ tags: [], noTags: false, creators: [], buyingTypes: [] });
                  }} 
                />
              ) : (
                <DataTable
                  data={filteredPlans}
                  getItemId={(plan) => plan.id}
                  columns={columnsWithTagCell}
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
                  className="flex-1"
                  resizable={true}
                  tableId="campaign-plans"
                  onRowClick={(plan) => handleNavigateToPlan(plan.id)}
                  expandable={true}
                  expandedItems={expandedIds}
                  onExpandedItemsChange={setExpandedIds}
                  renderExpandedContent={(plan) => {
                    // Get or generate ad set data for this plan
                    const adSetData = plan.adSetData || generateAdSetData(plan);
                    
                    return (
                      <div 
                        className="pl-[72px] pr-4 py-3 cursor-pointer"
                        onClick={() => handleNavigateToPlan(plan.id)}
                      >
                        <AdSetPreviewTable
                          adSets={adSetData}
                          planBudget={plan.budget}
                          planImpressions={plan.impressions}
                          planFrequency={plan.frequency}
                          showTotal={false}
                        />
                      </div>
                    );
                  }}
                />
              )}
            </div>
          </>
        ) : (
          /* Loading placeholder - maintains layout while columns load */
          <div className="flex-1 flex items-center justify-center">
            <div className="text-[14px] text-[rgba(0,0,0,0.4)] font-optimistic">Loading...</div>
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        itemCount={singleDeleteId ? 1 : checkedIds.size}
      />

      {/* Create Plan Modal */}
      <CreatePlanModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handlePlanCreated}
        onNavigate={handleNavigateToPlan}
      />

      {/* Book in Ads Manager Modal */}
      <BookInAdsManagerModal
        isOpen={isBookModalOpen}
        onClose={() => {
          setIsBookModalOpen(false);
          setPlanToBook(null);
        }}
        onBook={() => {
          setIsBookModalOpen(false);
          setPlanToBook(null);
        }}
        campaignData={planToBook ? {
          campaignName: planToBook.name,
          campaignType: `${planToBook.buyingType} Campaign`,
          totalBudget: formatCurrency(planToBook.budget),
          impressions: formatNumber(planToBook.impressions),
          cpm: formatCurrencyWithDecimals(planToBook.cpm),
          scheduleStart: formatDate(planToBook.schedule.startDate),
          scheduleEnd: formatDate(planToBook.schedule.endDate),
          lastRefreshed: formatDate(new Date()),
        } : undefined}
      />
    </div>
  );
}

