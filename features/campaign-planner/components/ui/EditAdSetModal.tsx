"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "./Button";
import { Icon } from "./Icon";
import { Input } from "./Input";
import { Dropdown } from "./Dropdown";
import { EditScheduleModal } from "./EditScheduleModal";
import { EditFrequencyModal } from "./EditFrequencyModal";
import { EditAudienceModal } from "./EditAudienceModal";
import { EditFormatPlacementsModal } from "./EditFormatPlacementsModal";
import { cn, getTriggerStyles } from "@/features/campaign-planner/lib/utils";

// ============================================
// Edit Ad Set Modal Props
// ============================================

/** Internal modal data format */
interface AdSetModalData {
  name: string;
  performanceGoal: string;
  audience: string;
  schedule: string;
  frequency: {
    type: string;
    description: string;
  };
  formatPlacements: {
    format: string;
    placements: string;
  };
}

/** Table AdSet format (from AdSetsTable) */
export interface TableAdSetData {
  id: string;
  name: string;
  budget: number;
  budgetPercent: number;
  audienceSize: number;
  reach: number;
  reachPercent: number;
  impressions: number;
  cpm: number;
  frequency: number;
  frequencyCap?: number;
  avgWeeklyFrequency: number;
  performanceGoal: string;
  audience: string;
  schedule: string;
  scheduleStartDate?: Date;
  scheduleEndDate?: Date;
  numWeeks?: number;
  placements?: string;
  audienceLocations?: { id: string; name: string; radius?: string }[];
  audienceAgeMin?: string;
  audienceAgeMax?: string;
  audienceGender?: 'all' | 'men' | 'women';
}

// ============================================
// Mapping Functions: Table AdSet <-> Modal Format
// ============================================

/** Map performance goal from table format to modal dropdown value */
function mapPerformanceGoalToModal(tableValue: string): string {
  const mapping: Record<string, string> = {
    'Reach': 'maximize-reach',
    'reach': 'maximize-reach',
    'Thruplay': 'maximize-thruplay',
    'thruplay': 'maximize-thruplay',
    'Impressions': 'maximize-impressions',
    'impressions': 'maximize-impressions',
    'Video Views': 'maximize-video-views',
  };
  return mapping[tableValue] || 'maximize-reach';
}

/** Map performance goal from modal dropdown value to table format */
function mapPerformanceGoalToTable(modalValue: string): string {
  const mapping: Record<string, string> = {
    'maximize-reach': 'Reach',
    'maximize-thruplay': 'Thruplay',
    'maximize-impressions': 'Impressions',
    'maximize-video-views': 'Video Views',
  };
  return mapping[modalValue] || 'Reach';
}

/** Format schedule dates for modal display */
function formatScheduleForModal(startDate?: Date, endDate?: Date, scheduleStr?: string): string {
  if (startDate && endDate) {
    const formatDate = (d: Date) => d.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
    return `${formatDate(startDate)} • 12:00 AM - ${formatDate(endDate)} • 11:59 PM`;
  }
  if (scheduleStr) {
    // If it's already in a display format, try to enhance it
    if (scheduleStr.includes('•')) return scheduleStr;
    // Simple format like "Jan 1 - Dec 31"
    const parts = scheduleStr.replace('...', '').split(' - ');
    if (parts.length === 2) {
      return `${parts[0]}, 2026 • 12:00 AM - ${parts[1]}, 2026 • 11:59 PM`;
    }
  }
  return 'Jan 1, 2026 • 12:00 AM - Dec 31, 2026 • 11:59 PM';
}

/** Convert frequency number to modal format */
function formatFrequencyForModal(frequency: number, frequencyCap?: number, numWeeks?: number): { type: string; description: string } {
  // If there's a frequency cap, use "Cap" type
  if (frequencyCap && frequencyCap > 0) {
    return {
      type: 'Cap',
      description: `${frequencyCap} times every 7 days`,
    };
  }
  // Otherwise derive from frequency value
  const timesPerWeek = numWeeks && numWeeks > 0 ? Math.round(frequency / numWeeks) : Math.round(frequency);
  return {
    type: 'Cap',
    description: `${Math.max(1, timesPerWeek)} times every 7 days`,
  };
}

/** Convert table AdSet to modal format */
export function tableAdSetToModalFormat(adSet: TableAdSetData): AdSetModalData {
  return {
    name: adSet.name,
    performanceGoal: mapPerformanceGoalToModal(adSet.performanceGoal),
    audience: adSet.audience || 'United States, 18-65+',
    schedule: formatScheduleForModal(adSet.scheduleStartDate, adSet.scheduleEndDate, adSet.schedule),
    frequency: formatFrequencyForModal(adSet.frequency, adSet.frequencyCap, adSet.numWeeks),
    formatPlacements: {
      format: 'Image or carousel',
      placements: adSet.placements || 'Facebook, Instagram',
    },
  };
}

/** Convert modal format back to table AdSet partial updates */
export function modalFormatToTableAdSet(modalData: AdSetModalData): Partial<TableAdSetData> {
  // Parse schedule string to extract dates
  let scheduleStartDate: Date | undefined;
  let scheduleEndDate: Date | undefined;
  let numWeeks = 4;
  
  const scheduleParts = modalData.schedule.split(' - ');
  if (scheduleParts.length === 2) {
    const startStr = scheduleParts[0].split(' • ')[0];
    const endStr = scheduleParts[1].split(' • ')[0];
    
    const parseDate = (str: string): Date | undefined => {
      const parsed = new Date(str);
      return isNaN(parsed.getTime()) ? undefined : parsed;
    };
    
    scheduleStartDate = parseDate(startStr);
    scheduleEndDate = parseDate(endStr);
    
    if (scheduleStartDate && scheduleEndDate) {
      const msPerWeek = 7 * 24 * 60 * 60 * 1000;
      numWeeks = Math.max(1, Math.ceil((scheduleEndDate.getTime() - scheduleStartDate.getTime()) / msPerWeek));
    }
  }
  
  // Parse frequency description to get numeric value
  const freqMatch = modalData.frequency.description.match(/(\d+)\s*times/);
  const frequencyCap = freqMatch ? parseInt(freqMatch[1]) : 2;
  
  return {
    name: modalData.name,
    performanceGoal: mapPerformanceGoalToTable(modalData.performanceGoal),
    audience: modalData.audience,
    schedule: modalData.schedule.split(' • ')[0] + '...',
    scheduleStartDate,
    scheduleEndDate,
    numWeeks,
    frequencyCap,
    placements: modalData.formatPlacements.placements,
  };
}

interface EditAdSetModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when modal should close */
  onClose: () => void;
  /** Initial ad set data - can be table format or modal format */
  initialData?: AdSetModalData | TableAdSetData;
  /** Callback when ad set is saved - returns partial table format for easy merging */
  onSave?: (data: Partial<TableAdSetData>) => void;
}

// Type for nested modal tracking
type NestedModalType = 'audience' | 'schedule' | 'frequency' | 'formatPlacements' | null;

// ============================================
// Performance Goal Options
// ============================================
const performanceGoalOptions = [
  { value: "maximize-reach", label: "Maximize reach of ads" },
  { value: "maximize-impressions", label: "Maximize number of impressions" },
  { value: "maximize-thruplay", label: "Maximize ThruPlay views" },
  { value: "maximize-video-views", label: "Maximize video views" },
];

// ============================================
// Form Row Component
// ============================================
interface FormRowProps {
  label: string;
  children: React.ReactNode;
  alignTop?: boolean;
}

function FormRow({ label, children, alignTop = false }: FormRowProps) {
  return (
    <div className={cn(
      "flex gap-6",
      alignTop ? "items-start py-[6px]" : "items-center"
    )}>
      <div className="w-[180px] shrink-0">
        <span className="text-[14px] font-medium leading-[20px] text-[rgba(0,0,0,0.85)]">
          {label}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        {children}
      </div>
    </div>
  );
}

// ============================================
// Read-only Value Display Component
// ============================================
interface ReadOnlyValueProps {
  children: React.ReactNode;
}

function ReadOnlyValue({ children }: ReadOnlyValueProps) {
  return (
    <div className="text-[14px] font-medium leading-[20px] text-[rgba(0,0,0,0.85)]">
      {children}
    </div>
  );
}

// ============================================
// Editable Value Component (with hover state)
// ============================================
interface EditableValueProps {
  children: React.ReactNode;
  onClick?: () => void;
}

function EditableValue({ children, onClick }: EditableValueProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex items-start justify-between gap-2 w-full text-left cursor-pointer transition-colors"
    >
      {/* Text content - changes to blue on hover */}
      <div className="text-[14px] font-medium leading-[20px] text-[rgba(0,0,0,0.85)] group-hover:text-[#1877F2] transition-colors">
        {children}
      </div>
      {/* Edit icon (Pencil) - appears on hover */}
      <Icon 
        name="Pencil" 
        variant="outlined" 
        size={16} 
        className="shrink-0 mt-[2px] opacity-0 group-hover:opacity-100 text-[#1877F2] transition-opacity" 
      />
    </button>
  );
}

// ============================================
// Helper: Check if data is in table format
// ============================================
function isTableFormat(data: any): data is TableAdSetData {
  return data && typeof data.budget === 'number' && typeof data.frequency === 'number';
}

// ============================================
// Main Edit Ad Set Modal Component
// ============================================
export function EditAdSetModal({
  isOpen,
  onClose,
  initialData,
  onSave
}: EditAdSetModalProps) {
  // Convert initialData to modal format if it's in table format
  const getModalData = (): AdSetModalData => {
    if (!initialData) {
      return {
        name: "Ad Set Name",
        performanceGoal: "maximize-reach",
        audience: "United States, 18-65+",
        schedule: "Jan 30, 2026 • 12:00 AM - Feb 20, 2026 • 11:59 AM",
        frequency: {
          type: "Cap",
          description: "2 times every 7 days"
        },
        formatPlacements: {
          format: "Image or carousel",
          placements: "Facebook, Instagram, Audience Network"
        }
      };
    }
    
    if (isTableFormat(initialData)) {
      return tableAdSetToModalFormat(initialData);
    }
    
    // Already in modal format
    return initialData as AdSetModalData;
  };

  const defaults = getModalData();

  // Form state
  const [name, setName] = useState(defaults.name);
  const [performanceGoal, setPerformanceGoal] = useState(defaults.performanceGoal);
  
  // Editable field state (can be updated by nested modals)
  const [audience, setAudience] = useState(defaults.audience);
  const [schedule, setSchedule] = useState(defaults.schedule);
  const [frequency, setFrequency] = useState(defaults.frequency);
  const [formatPlacements, setFormatPlacements] = useState(defaults.formatPlacements);
  
  // Nested modal state
  const [nestedModal, setNestedModal] = useState<NestedModalType>(null);

  const handleSave = () => {
    // Convert modal data to table format for saving
    const modalData: AdSetModalData = {
      name,
      performanceGoal,
      audience,
      schedule,
      frequency,
      formatPlacements,
    };
    
    const tableData = modalFormatToTableAdSet(modalData);
    onSave?.(tableData);
    onClose();
  };

  // Handle Escape key - only close if no nested modal is open
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (nestedModal) {
          setNestedModal(null);
        } else {
          onClose();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose, nestedModal]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      const data = getModalData();
      setName(data.name);
      setPerformanceGoal(data.performanceGoal);
      setAudience(data.audience);
      setSchedule(data.schedule);
      setFrequency(data.frequency);
      setFormatPlacements(data.formatPlacements);
      setNestedModal(null);
    }
  }, [isOpen, initialData]);

  // ============================================
  // Nested Modal Save Handlers
  // ============================================
  const handleAudienceSave = (audienceData: any) => {
    // Convert audience data to display string
    const locations = audienceData.locations?.map((l: any) => l.name).join(", ") || "";
    const ageRange = `${audienceData.ageMin}-${audienceData.ageMax}`;
    const genderStr = audienceData.gender === "all" ? "" : `, ${audienceData.gender}`;
    setAudience(`${locations}, ${ageRange}${genderStr}`);
    setNestedModal(null);
  };

  const handleScheduleSave = (scheduleData: { startDate: string; startTime: string; endDate: string; endTime: string }) => {
    const scheduleStr = `${scheduleData.startDate} • ${scheduleData.startTime} - ${scheduleData.endDate} • ${scheduleData.endTime}`;
    setSchedule(scheduleStr);
    setNestedModal(null);
  };

  const handleFrequencySave = (frequencyData: { type: "target" | "cap"; count: number; days: number }) => {
    setFrequency({
      type: frequencyData.type === "cap" ? "Cap" : "Target",
      description: `${frequencyData.count} times every ${frequencyData.days} days`,
    });
    setNestedModal(null);
  };

  const handleFormatPlacementsSave = (data: any) => {
    // Convert placements data to display strings
    const activePlacements = data.placements?.filter((p: any) => p.checked).map((p: any) => p.label) || [];
    setFormatPlacements({
      format: "Image or carousel",
      placements: activePlacements.slice(0, 3).join(", ") + (activePlacements.length > 3 ? "..." : ""),
    });
    setNestedModal(null);
  };

  // ============================================
  // Convert current state to nested modal format
  // ============================================
  const getScheduleInitialData = () => {
    const parts = schedule.split(" - ");
    if (parts.length === 2) {
      const startParts = parts[0].split(" • ");
      const endParts = parts[1].split(" • ");
      return {
        startDate: startParts[0] || "",
        startTime: startParts[1] || "12:00 AM",
        endDate: endParts[0] || "",
        endTime: endParts[1] || "11:59 PM",
      };
    }
    return undefined;
  };

  const getFrequencyInitialData = () => {
    const countMatch = frequency.description.match(/(\d+)\s*times/);
    const daysMatch = frequency.description.match(/every\s*(\d+)\s*days/);
    return {
      type: frequency.type.toLowerCase() as "target" | "cap",
      count: countMatch ? parseInt(countMatch[1]) : 2,
      days: daysMatch ? parseInt(daysMatch[1]) : 7,
    };
  };

  if (!isOpen) return null;

  const selectedGoal = performanceGoalOptions.find(o => o.value === performanceGoal);

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={(e) => {
        if (e.target === e.currentTarget && !nestedModal) onClose();
      }}
      aria-hidden="true"
    >
      <div
        role="dialog"
        aria-modal="true"
        className="bg-white rounded-[8px] shadow-[0px_8px_24px_4px_rgba(0,0,0,0.1),0px_2px_2px_0px_rgba(0,0,0,0.1)] w-[520px] max-w-[calc(100vw-80px)] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pl-4 pr-2 py-0 bg-white shrink-0">
          <div className="flex-1 flex flex-col justify-center py-4 pr-2 min-w-0">
            <h2 className="text-[20px] font-bold leading-[24px] text-[#1C2B33] font-optimistic">
              Edit ad set
            </h2>
          </div>
          <div className="flex items-start py-2">
            <button
              className="p-3 hover:bg-[rgba(0,0,0,0.05)] rounded-[4px] transition-colors"
              onClick={onClose}
            >
              <Icon name="Close" variant="outlined" size={16} className="text-[#283943]" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 space-y-[5px]">
          {/* Name - Editable Input */}
          <FormRow label="Name">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter ad set name"
            />
          </FormRow>

          {/* Performance Goal - Dropdown */}
          <FormRow label="Performance goal">
            <Dropdown
              className="w-full"
              width="100%"
              trigger={({ isOpen: dropdownOpen }) => (
                <div
                  className={cn(
                    "flex items-center justify-between gap-2 px-3 py-2 cursor-pointer",
                    getTriggerStyles(dropdownOpen)
                  )}
                >
                  <span className="text-[14px] leading-[20px] text-[rgba(0,0,0,0.85)] truncate">
                    {selectedGoal?.label || "Select goal"}
                  </span>
                  <Icon
                    name="CaretDownSmall"
                    variant="outlined"
                    size={16}
                    className={cn(
                      "shrink-0 text-[rgba(0,0,0,0.75)] transition-transform",
                      dropdownOpen && "rotate-180"
                    )}
                  />
                </div>
              )}
            >
              {performanceGoalOptions.map((option) => (
                <Dropdown.Item
                  key={option.value}
                  label={option.label}
                  onClick={() => setPerformanceGoal(option.value)}
                  selectionType="radio"
                  selected={performanceGoal === option.value}
                />
              ))}
            </Dropdown>
          </FormRow>

          {/* Audience - Editable */}
          <FormRow label="Audience" alignTop>
            <EditableValue onClick={() => setNestedModal('audience')}>
              {audience}
            </EditableValue>
          </FormRow>

          {/* Schedule - Editable */}
          <FormRow label="Schedule" alignTop>
            <EditableValue onClick={() => setNestedModal('schedule')}>
              <div>{schedule.split(" - ")[0]} -</div>
              <div>{schedule.split(" - ")[1]}</div>
            </EditableValue>
          </FormRow>

          {/* Frequency - Editable */}
          <FormRow label="Frequency" alignTop>
            <EditableValue onClick={() => setNestedModal('frequency')}>
              <div>{frequency.type}</div>
              <div>{frequency.description}</div>
            </EditableValue>
          </FormRow>

          {/* Format & Placements - Editable */}
          <FormRow label="Format & Placements" alignTop>
            <EditableValue onClick={() => setNestedModal('formatPlacements')}>
              <div>{formatPlacements.format}</div>
              <div>{formatPlacements.placements}</div>
            </EditableValue>
          </FormRow>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-2 px-4 pt-3 pb-4 bg-white shrink-0">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>Save</Button>
        </div>
      </div>

      {/* ============================================ */}
      {/* Nested Modals - Rendered with z-[60] for proper layering */}
      {/* ============================================ */}

      {/* Edit Audience Modal */}
      <EditAudienceModal
        isOpen={nestedModal === 'audience'}
        onClose={() => setNestedModal(null)}
        onSave={handleAudienceSave}
      />

      {/* Edit Schedule Modal */}
      <EditScheduleModal
        isOpen={nestedModal === 'schedule'}
        onClose={() => setNestedModal(null)}
        initialSchedule={getScheduleInitialData()}
        onSave={handleScheduleSave}
      />

      {/* Edit Frequency Modal */}
      <EditFrequencyModal
        isOpen={nestedModal === 'frequency'}
        onClose={() => setNestedModal(null)}
        initialFrequency={getFrequencyInitialData()}
        onSave={handleFrequencySave}
      />

      {/* Edit Format & Placements Modal */}
      <EditFormatPlacementsModal
        isOpen={nestedModal === 'formatPlacements'}
        onClose={() => setNestedModal(null)}
        onSave={handleFormatPlacementsSave}
      />
    </div>,
    document.body
  );
}

// ============================================
// Export a Preview version for the Modal Gallery
// ============================================
export function EditAdSetModalPreview() {
  const [name, setName] = useState("Ad Set Name");
  const [performanceGoal, setPerformanceGoal] = useState("maximize-reach");

  const selectedGoal = performanceGoalOptions.find(o => o.value === performanceGoal);

  const defaultData = {
    audience: "United States, 18-65+",
    schedule: "Jan 30, 2026 • 12:00 AM - Feb 20, 2026 • 11:59 AM",
    frequency: {
      type: "Cap",
      description: "2 times every 7 days"
    },
    formatPlacements: {
      format: "Image or carousel",
      placements: "Facebook, Instagram, Audience Network"
    }
  };

  return (
    <div className="bg-white rounded-[8px] shadow-[0px_8px_24px_4px_rgba(0,0,0,0.1),0px_2px_2px_0px_rgba(0,0,0,0.1)] w-[520px] overflow-visible">
      {/* Modal Header */}
      <div className="flex items-center justify-between pl-4 pr-2 py-0 bg-white shrink-0">
        <div className="flex-1 flex flex-col justify-center py-4 pr-2 min-w-0">
          <h2 className="text-[20px] font-bold leading-[24px] text-[#1C2B33] font-optimistic">
            Edit ad set
          </h2>
        </div>
        <div className="flex items-start py-2">
          <button className="p-3 hover:bg-[rgba(0,0,0,0.05)] rounded-[4px] transition-colors">
            <Icon name="Close" variant="outlined" size={16} className="text-[#283943]" />
          </button>
        </div>
      </div>

      {/* Modal Body */}
      <div className="p-4 space-y-[5px]">
        {/* Name - Editable Input */}
        <FormRow label="Name">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter ad set name"
          />
        </FormRow>

        {/* Performance Goal - Dropdown */}
        <FormRow label="Performance goal">
          <Dropdown
            className="w-full"
            width="100%"
            trigger={({ isOpen }) => (
              <div
                className={cn(
                  "flex items-center justify-between gap-2 px-3 py-2 cursor-pointer",
                  getTriggerStyles(isOpen)
                )}
              >
                <span className="text-[14px] leading-[20px] text-[rgba(0,0,0,0.85)] truncate">
                  {selectedGoal?.label || "Select goal"}
                </span>
                <Icon
                  name="CaretDownSmall"
                  variant="outlined"
                  size={16}
                  className={cn(
                    "shrink-0 text-[rgba(0,0,0,0.75)] transition-transform",
                    isOpen && "rotate-180"
                  )}
                />
              </div>
            )}
          >
            {performanceGoalOptions.map((option) => (
              <Dropdown.Item
                key={option.value}
                label={option.label}
                onClick={() => setPerformanceGoal(option.value)}
                selectionType="radio"
                selected={performanceGoal === option.value}
              />
            ))}
          </Dropdown>
        </FormRow>

        {/* Audience - Editable */}
        <FormRow label="Audience" alignTop>
          <EditableValue>{defaultData.audience}</EditableValue>
        </FormRow>

        {/* Schedule - Editable */}
        <FormRow label="Schedule" alignTop>
          <EditableValue>
            <div>{defaultData.schedule.split(" - ")[0]} -</div>
            <div>{defaultData.schedule.split(" - ")[1]}</div>
          </EditableValue>
        </FormRow>

        {/* Frequency - Editable */}
        <FormRow label="Frequency" alignTop>
          <EditableValue>
            <div>{defaultData.frequency.type}</div>
            <div>{defaultData.frequency.description}</div>
          </EditableValue>
        </FormRow>

        {/* Format & Placements - Editable */}
        <FormRow label="Format & Placements" alignTop>
          <EditableValue>
            <div>{defaultData.formatPlacements.format}</div>
            <div>{defaultData.formatPlacements.placements}</div>
          </EditableValue>
        </FormRow>
      </div>

      {/* Modal Footer */}
      <div className="flex items-center justify-end gap-2 px-4 pt-3 pb-4 bg-white shrink-0">
        <Button variant="secondary">Cancel</Button>
        <Button variant="primary">Save</Button>
      </div>
    </div>
  );
}

