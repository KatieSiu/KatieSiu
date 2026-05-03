"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "./Button";
import { Input } from "./Input";
import { Radio } from "./RadioButton";
import { TabBar } from "./TabBar";
import { Dropdown } from "./Dropdown";
import { Icon } from "./Icon";
import { CollapsibleCard } from "./CollapsibleCard";
import { NumberInput } from "./NumberInput";
import { cn, getTriggerStyles, interactiveField, formatWithCommas, stripCommas, roundToHundredths } from "@/features/campaign-planner/lib/utils";

// ============================================
// Edit Ad Set Modal Props
// ============================================
interface EditAdSetModal2Props {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when modal should close */
  onClose: () => void;
  /** Callback when ad set is saved */
  onSave?: (data: any) => void;
  /** Initial data for the ad set */
  initialData?: {
    adSetName?: string;
    budget?: string;
    performanceGoal?: string;
  };
}

// ============================================
// Date Formatting Utilities (reused from CreatePlanModal)
// ============================================
const MONTH_ABBR = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function parseDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  
  const displayMatch = dateStr.match(/^([A-Za-z]{3})\s+(\d{1,2}),?\s*(\d{4})$/);
  if (displayMatch) {
    const monthIndex = MONTH_ABBR.findIndex(m => m.toLowerCase() === displayMatch[1].toLowerCase());
    if (monthIndex !== -1) {
      return new Date(parseInt(displayMatch[3]), monthIndex, parseInt(displayMatch[2]));
    }
  }
  
  const editMatch = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (editMatch) {
    return new Date(parseInt(editMatch[3]), parseInt(editMatch[1]) - 1, parseInt(editMatch[2]));
  }
  
  return null;
}

function formatDateForDisplay(dateStr: string): string {
  const date = parseDate(dateStr);
  if (!date || isNaN(date.getTime())) return dateStr;
  return `${MONTH_ABBR[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

function formatDateForEdit(dateStr: string): string {
  const date = parseDate(dateStr);
  if (!date || isNaN(date.getTime())) return dateStr;
  return `${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}/${date.getFullYear()}`;
}

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

// ============================================
// Time Parsing Utilities
// ============================================
function parseTime(timeStr: string): { hours: number; minutes: number } | null {
  if (!timeStr) return null;
  const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;
  
  let hours = parseInt(match[1]);
  const minutes = parseInt(match[2]);
  const period = match[3].toUpperCase();
  
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  
  return { hours, minutes };
}

function combineDateAndTime(dateStr: string, timeStr: string): Date | null {
  const date = parseDate(dateStr);
  const time = parseTime(timeStr);
  if (!date || !time) return null;
  
  const combined = new Date(date);
  combined.setHours(time.hours, time.minutes, 0, 0);
  return combined;
}

function isInFuture(dateStr: string, timeStr: string): boolean {
  const dateTime = combineDateAndTime(dateStr, timeStr);
  if (!dateTime) return true;
  return dateTime > new Date();
}

// ============================================
// DateInput Component (inline version for Schedule)
// ============================================
interface InlineDateInputProps {
  value: string;
  onChange: (value: string) => void;
}

function InlineDateInput({ value, onChange }: InlineDateInputProps) {
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
    setEditValue(formatDateForEdit(value));
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    const parsed = parseDate(editValue);
    if (parsed && !isNaN(parsed.getTime())) {
      onChange(formatDateForDisplay(editValue));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const cursorPos = e.target.selectionStart || 0;
    const oldDigits = editValue.replace(/\D/g, "").length;
    const formatted = smartFormatDateInput(rawValue);
    const newDigits = formatted.replace(/\D/g, "").length;
    
    let newCursor = cursorPos;
    if (newDigits > oldDigits) {
      if (newDigits === 2 || newDigits === 4) newCursor++;
    }
    
    cursorPosRef.current = newCursor;
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
      placeholder="MM/DD/YYYY"
      className="flex-1 bg-transparent border-none outline-none text-[14px] leading-[20px] text-[#1C2B33] placeholder:text-[rgba(28,43,51,0.4)]"
    />
  );
}

// ============================================
// TimeInput Component (inline version for Schedule)
// ============================================
interface InlineTimeInputProps {
  value: string;
  onChange: (value: string) => void;
}

function InlineTimeInput({ value, onChange }: InlineTimeInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [editValue, setEditValue] = useState("");

  const displayValue = isFocused ? editValue : value;

  const handleFocus = () => {
    setEditValue(value);
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (editValue.trim()) {
      onChange(editValue);
    }
  };

  return (
    <input
      type="text"
      value={displayValue}
      onChange={(e) => setEditValue(e.target.value)}
      onFocus={handleFocus}
      onBlur={handleBlur}
      placeholder="12:00 AM"
      className="flex-1 bg-transparent border-none outline-none text-[14px] leading-[20px] text-[#1C2B33] placeholder:text-[rgba(28,43,51,0.4)]"
    />
  );
}

// ============================================
// Overview Section
// ============================================
interface OverviewSectionProps {
  adSetName: string;
  onAdSetNameChange: (value: string) => void;
  adSetNameError?: string;
  budgetDisplayValue: string;
  onBudgetChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBudgetFocus: () => void;
  onBudgetBlur: () => void;
  budgetError?: string;
  budgetRef: React.RefObject<HTMLInputElement>;
  performanceGoal: string;
  onPerformanceGoalChange: (value: string) => void;
}

function OverviewSection({
  adSetName,
  onAdSetNameChange,
  adSetNameError,
  budgetDisplayValue,
  onBudgetChange,
  onBudgetFocus,
  onBudgetBlur,
  budgetError,
  budgetRef,
  performanceGoal,
  onPerformanceGoalChange,
}: OverviewSectionProps) {
  const performanceGoalOptions = [
    { value: "Maximize reach of ads", label: "Maximize reach of ads" },
    { value: "Maximize number of impressions", label: "Maximize number of impressions" },
    { value: "Maximize ThruPlay views", label: "Maximize ThruPlay views" },
  ];

  return (
    <CollapsibleCard title="Overview" defaultExpanded={true}>
      <div className="space-y-4">
        {/* Ad Set Name */}
        <div className="flex items-center gap-6">
          <span className="w-[180px] shrink-0 text-[14px] font-medium leading-[20px] text-[rgba(0,0,0,0.85)]">
            Ad set name
          </span>
          <div className="flex-1">
            <Input
              value={adSetName}
              onChange={(e) => {
                const val = e.target.value;
                if (/^[a-zA-Z0-9\s]*$/.test(val) || val === "") {
                  onAdSetNameChange(val);
                }
              }}
              placeholder="Enter ad set name"
              className={adSetNameError ? "border-[#E02020] focus:border-[#E02020] focus:ring-[#E02020]" : ""}
            />
            {adSetNameError && (
              <p className="text-[12px] text-[#E02020] mt-1">{adSetNameError}</p>
            )}
          </div>
        </div>

        {/* Budget */}
        <div className="flex items-center gap-6">
          <span className="w-[180px] shrink-0 text-[14px] font-medium leading-[20px] text-[rgba(0,0,0,0.85)]">
            Budget
          </span>
          <div className="flex-1">
            <Input
              ref={budgetRef}
              value={budgetDisplayValue}
              onChange={onBudgetChange}
              onFocus={onBudgetFocus}
              onBlur={onBudgetBlur}
              placeholder="0.00"
              className={budgetError ? "border-[#E02020] focus:border-[#E02020] focus:ring-[#E02020]" : ""}
              leftAddon={
                <span className="text-[14px] text-[rgba(0,0,0,0.65)]">$</span>
              }
            />
            {budgetError && (
              <p className="text-[12px] text-[#E02020] mt-1">{budgetError}</p>
            )}
          </div>
        </div>

        {/* Performance Goal */}
        <div className="flex items-center gap-6">
          <span className="w-[180px] shrink-0 text-[14px] font-medium leading-[20px] text-[rgba(0,0,0,0.85)]">
            Performance goal
          </span>
          <div className="flex-1">
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
                    {performanceGoal}
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
                  onClick={() => onPerformanceGoalChange(option.value)}
                  selectionType="radio"
                  selected={performanceGoal === option.value}
                />
              ))}
            </Dropdown>
          </div>
        </div>
      </div>
    </CollapsibleCard>
  );
}

// ============================================
// Schedule Section (matching CreatePlanModal)
// ============================================
interface ScheduleSectionProps {
  startDate: string;
  onStartDateChange: (value: string) => void;
  startTime: string;
  onStartTimeChange: (value: string) => void;
  endDate: string;
  onEndDateChange: (value: string) => void;
  endTime: string;
  onEndTimeChange: (value: string) => void;
}

function ScheduleSection({
  startDate,
  onStartDateChange,
  startTime,
  onStartTimeChange,
  endDate,
  onEndDateChange,
  endTime,
  onEndTimeChange,
}: ScheduleSectionProps) {
  const [startDateError, setStartDateError] = useState<string | null>(null);
  const [endDateError, setEndDateError] = useState<string | null>(null);

  const validateStartDate = (date: string, time: string) => {
    if (!date || !time) {
      setStartDateError(null);
      return;
    }
    if (!isInFuture(date, time)) {
      setStartDateError("Start date must be in the future");
    } else {
      setStartDateError(null);
    }
  };

  const isEndAfterStart = (endDateStr: string, endTimeStr: string, startDateStr: string, startTimeStr: string): boolean => {
    const endDateTime = combineDateAndTime(endDateStr, endTimeStr);
    const startDateTime = combineDateAndTime(startDateStr, startTimeStr);
    if (!endDateTime || !startDateTime) return true;
    return endDateTime > startDateTime;
  };

  const validateEndDate = (endDateStr: string, endTimeStr: string, startDateStr: string, startTimeStr: string) => {
    if (!endDateStr || !endTimeStr) {
      setEndDateError(null);
      return;
    }
    if (!isInFuture(endDateStr, endTimeStr)) {
      setEndDateError("End date must be in the future");
      return;
    }
    if (!isEndAfterStart(endDateStr, endTimeStr, startDateStr, startTimeStr)) {
      setEndDateError("End date must be after the start date");
      return;
    }
    setEndDateError(null);
  };

  const handleStartDateChange = (value: string) => {
    onStartDateChange(value);
    validateStartDate(value, startTime);
    validateEndDate(endDate, endTime, value, startTime);
  };

  const handleStartTimeInputChange = (value: string) => {
    onStartTimeChange(value);
    validateStartDate(startDate, value);
    validateEndDate(endDate, endTime, startDate, value);
  };

  const handleEndDateChange = (value: string) => {
    onEndDateChange(value);
    validateEndDate(value, endTime, startDate, startTime);
  };

  const handleEndTimeInputChange = (value: string) => {
    onEndTimeChange(value);
    validateEndDate(endDate, value, startDate, startTime);
  };

  const errorContainerClass = "border-[#D3212C] focus-within:border-[#D3212C] focus-within:ring-[#D3212C]";

  return (
    <CollapsibleCard title="Schedule" defaultExpanded={false}>
      <div className="space-y-3">
        <div>
          <label className="block text-[14px] font-bold leading-[20px] text-[#1C2B33] mb-1">
            Start Date
          </label>
          <div className={cn(
            "flex items-center", 
            interactiveField.container,
            startDateError && errorContainerClass
          )}>
            <div className="flex items-center gap-2 flex-1 px-3 py-2">
              <Icon name="Calendar" variant="outlined" size={16} className="text-[#283943]" />
              <InlineDateInput value={startDate} onChange={handleStartDateChange} />
            </div>
            <div className="w-px h-[34px] bg-[#CBD2D9]" />
            <div className="flex items-center gap-2 flex-1 px-3 py-2">
              <Icon name="Clock" variant="outlined" size={16} className="text-[#283943]" />
              <InlineTimeInput value={startTime} onChange={handleStartTimeInputChange} />
              <span className="text-[14px] text-[rgba(28,43,51,0.6)] ml-auto">PST</span>
            </div>
          </div>
          {startDateError && (
            <p className="text-[12px] font-normal leading-[16px] mt-1 text-[#D3212C]">
              {startDateError}
            </p>
          )}
        </div>

        <div>
          <label className="block text-[14px] font-bold leading-[20px] text-[#1C2B33] mb-1">
            End Date
          </label>
          <div className={cn(
            "flex items-center", 
            interactiveField.container,
            endDateError && errorContainerClass
          )}>
            <div className="flex items-center gap-2 flex-1 px-3 py-2">
              <Icon name="Calendar" variant="outlined" size={16} className="text-[#283943]" />
              <InlineDateInput value={endDate} onChange={handleEndDateChange} />
            </div>
            <div className="w-px h-[34px] bg-[#CBD2D9]" />
            <div className="flex items-center gap-2 flex-1 px-3 py-2">
              <Icon name="Clock" variant="outlined" size={16} className="text-[#283943]" />
              <InlineTimeInput value={endTime} onChange={handleEndTimeInputChange} />
              <span className="text-[14px] text-[rgba(28,43,51,0.6)] ml-auto">PST</span>
            </div>
          </div>
          {endDateError && (
            <p className="text-[12px] font-normal leading-[16px] mt-1 text-[#D3212C]">
              {endDateError}
            </p>
          )}
        </div>
      </div>
    </CollapsibleCard>
  );
}

// ============================================
// Audience Section (matching CreatePlanModal)
// ============================================
interface AudienceSectionProps {
  audienceTab: string;
  onAudienceTabChange: (value: string) => void;
  ageMin: string;
  onAgeMinChange: (value: string) => void;
  ageMax: string;
  onAgeMaxChange: (value: string) => void;
  gender: string | null;
  onGenderChange: (value: string) => void;
}

function AudienceSection({
  audienceTab,
  onAudienceTabChange,
  ageMin,
  onAgeMinChange,
  ageMax,
  onAgeMaxChange,
  gender,
  onGenderChange,
}: AudienceSectionProps) {
  return (
    <CollapsibleCard title="Audience" defaultExpanded={false}>
      <div className="space-y-4">
        <div>
          <TabBar value={audienceTab} onChange={onAudienceTabChange}>
            <TabBar.Tab value="create" label="Create new audience" />
            <TabBar.Tab value="saved" label="Use saved audience" />
          </TabBar>
          <div className="h-px bg-[#CBD2D9] mt-0" />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-1">
            <span className="text-[15px] font-bold leading-[20px] text-[#465A69]">*Locations</span>
            <Icon name="Info" variant="filled" size={12} className="text-[#283943]" />
          </div>
          <p className="text-[14px] leading-[20px] text-[#465A69]">
            Reach people living in or recently in this location.
          </p>
          
          <div className="bg-[#F1F4F7] rounded-[6px] border border-[rgba(203,210,217,0.6)] border-b-0">
            <div className="p-3 space-y-2">
              <span className="text-[12px] leading-[20px] text-[#1C2B33]">United States</span>
              
              <div className="bg-white rounded-[6px] px-3 py-2 flex items-center gap-2">
                <span className="text-[14px] text-[#1C2B33]">United States</span>
                <Icon name="Check" variant="filled" size={20} className="text-[#006B4E]" />
              </div>
              
              <div className="bg-white rounded-[6px] px-3 py-2 flex items-center gap-2">
                <span className="text-[14px] text-[#1C2B33]">San Francisco Bay Area Place</span>
                <Icon name="Check" variant="filled" size={20} className="text-[#006B4E]" />
                <span className="text-[14px] text-[#1C2B33] ml-auto">+12mi</span>
                <Icon name="CaretDownSmall" variant="outlined" size={16} className="text-[#283943]" />
              </div>
            </div>
          </div>
          
          <Input
            variant="search"
            placeholder="Thailand"
            leftAddon={
              <div className="flex items-center gap-2">
                <Icon name="Check" variant="filled" size={16} className="text-[#006B4E]" />
                <span className="text-[14px] text-[#465A69]">Include</span>
                <Icon name="CaretDownSmall" variant="outlined" size={16} className="text-[#283943]" />
              </div>
            }
            rightAddon={<span className="text-[14px] text-[#1C2B33]">Browse</span>}
          />
          
          <button className="text-[12px] leading-[16px] text-[#0A78BE] hover:underline">
            Add Locations in Bulk
          </button>
        </div>

        <div className="h-px bg-[#CBD2D9]" />

        <div className="space-y-2">
          <div className="flex items-center gap-1">
            <span className="text-[15px] font-bold leading-[20px] text-[#465A69]">Age</span>
            <Icon name="Info" variant="filled" size={12} className="text-[#283943]" />
          </div>
          <div className="flex items-center">
            <Dropdown
              trigger={
                <button className="flex items-center justify-between w-[86px] px-3 py-2 bg-white border border-[#CBD2D9] rounded-l-[4px] border-r-0 text-left hover:border-[#1877F2] transition-colors">
                  <span className="text-[14px] text-[#1C2B33]">{ageMin}</span>
                  <Icon name="CaretDownSmall" variant="outlined" size={16} className="text-[#283943]" />
                </button>
              }
              width={100}
            >
              <Dropdown.List>
                {["18", "21", "25", "30", "35", "40", "45", "50", "55", "60"].map((age) => (
                  <Dropdown.Item key={age} label={age} onClick={() => onAgeMinChange(age)} />
                ))}
              </Dropdown.List>
            </Dropdown>
            <Dropdown
              trigger={
                <button className="flex items-center justify-between w-[86px] px-3 py-2 bg-white border border-[#CBD2D9] rounded-r-[4px] text-left hover:border-[#1877F2] transition-colors">
                  <span className="text-[14px] text-[#1C2B33]">{ageMax}</span>
                  <Icon name="CaretDownSmall" variant="outlined" size={16} className="text-[#283943]" />
                </button>
              }
              width={100}
            >
              <Dropdown.List>
                {["30", "35", "40", "45", "50", "55", "60", "65+"].map((age) => (
                  <Dropdown.Item key={age} label={age} onClick={() => onAgeMaxChange(age)} />
                ))}
              </Dropdown.List>
            </Dropdown>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-1">
            <span className="text-[15px] font-bold leading-[20px] text-[#465A69]">Gender</span>
            <Icon name="Info" variant="filled" size={12} className="text-[#283943]" />
          </div>
          <Radio.Group
            value={gender}
            onChange={onGenderChange}
            name="gender"
            orientation="horizontal"
          >
            <Radio value="all" label="All" />
            <Radio value="men" label="Men" />
            <Radio value="women" label="Women" />
          </Radio.Group>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-1">
            <span className="text-[15px] font-bold leading-[20px] text-[#465A69]">Languages</span>
            <Icon name="Info" variant="filled" size={12} className="text-[#283943]" />
          </div>
          <p className="text-[14px] leading-[20px] text-[#465A69]">All languages</p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <span className="text-[15px] font-bold leading-[20px] text-[#1C2B33]">Detailed targeting</span>
            <Icon name="Info" variant="filled" size={12} className="text-[#283943]" />
          </div>
          <p className="text-[14px] leading-[20px] text-[#465A69]">Include people who match</p>
          <Input
            variant="search"
            placeholder="Add demographics, interest or behaviors"
          />
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <span className="text-[15px] font-bold leading-[20px] text-[#1C2B33]">Custom audiences</span>
            <Icon name="Info" variant="filled" size={12} className="text-[#283943]" />
          </div>
          <Input
            variant="search"
            placeholder="Search existing audiences"
          />
        </div>
      </div>
    </CollapsibleCard>
  );
}

// ============================================
// Frequency Section (matching CreatePlanModal)
// ============================================
interface FrequencySectionProps {
  frequencyType: string | null;
  onFrequencyTypeChange: (value: string) => void;
  frequencyCount: number;
  onFrequencyCountChange: (value: number) => void;
  frequencyDays: number;
  onFrequencyDaysChange: (value: number) => void;
}

function FrequencySection({
  frequencyType,
  onFrequencyTypeChange,
  frequencyCount,
  onFrequencyCountChange,
  frequencyDays,
  onFrequencyDaysChange,
}: FrequencySectionProps) {
  return (
    <CollapsibleCard title="Frequency" defaultExpanded={false}>
      <div className="space-y-3">
        <div className="flex items-center gap-1">
          <span className="text-[14px] font-bold leading-[20px] text-[rgba(0,0,0,0.75)]">
            Frequency control
          </span>
          <Icon name="Info" variant="filled" size={12} className="text-[rgba(0,0,0,0.75)]" />
        </div>

        <label 
          className="flex items-center gap-2 cursor-pointer py-2"
          onClick={() => onFrequencyTypeChange("target")}
        >
          <div
            className={`w-6 h-6 rounded-full border ${
              frequencyType === "target" ? "border-[#465A69]" : "border-[rgba(70,90,105,0.6)]"
            } flex items-center justify-center`}
          >
            {frequencyType === "target" && (
              <div className="w-3 h-3 rounded-full bg-[#1877F2]" />
            )}
          </div>
          <div className="w-8 h-8 rounded-[4px] bg-[#E4E8EB]" />
          <div>
            <p className="text-[14px] leading-[20px] text-[rgba(0,0,0,0.85)]">Target</p>
            <p className="text-[12px] leading-[16px] text-[#1C2B33]">
              The average number of times per week you want people to see your ads
            </p>
          </div>
        </label>

        <label 
          className="flex items-center gap-2 cursor-pointer py-2"
          onClick={() => onFrequencyTypeChange("cap")}
        >
          <div
            className={`w-6 h-6 rounded-full border ${
              frequencyType === "cap" ? "border-[#465A69]" : "border-[rgba(70,90,105,0.6)]"
            } flex items-center justify-center`}
          >
            {frequencyType === "cap" && (
              <div className="w-3 h-3 rounded-full bg-[#1877F2]" />
            )}
          </div>
          <div className="w-8 h-8 rounded-[4px] bg-[#D4E4F2]" />
          <div>
            <p className="text-[14px] leading-[20px] text-[rgba(0,0,0,0.85)]">Cap</p>
            <p className="text-[12px] leading-[16px] text-[#1C2B33]">
              The maximum number of times you want people to see your ads
            </p>
          </div>
        </label>

        <div className="flex items-center gap-2 flex-wrap">
          <NumberInput
            value={frequencyCount}
            onChange={onFrequencyCountChange}
            min={1}
            max={99}
            containerClassName="w-[100px]"
          />
          <span className="text-[14px] text-[rgba(0,0,0,0.85)]">times every</span>
          <NumberInput
            value={frequencyDays}
            onChange={onFrequencyDaysChange}
            min={1}
            max={30}
            containerClassName="w-[100px]"
          />
          <span className="text-[14px] text-[rgba(0,0,0,0.85)]">days</span>
        </div>

        <p className="text-[12px] leading-[16px] text-[#1C2B33]">
          As a maximum, we&apos;ll aim to stay under {frequencyCount} impressions every {frequencyDays} days.
        </p>
      </div>
    </CollapsibleCard>
  );
}

// ============================================
// Format & Placements Section
// ============================================
interface PlacementItem {
  id: string;
  label: string;
  description: string;
  checked: boolean;
}

const defaultPlacements: PlacementItem[] = [
  { id: "feeds", label: "Feeds", description: "Get high visibility for your business with ads in feeds", checked: true },
  { id: "stories-reels", label: "Stories and Reels", description: "Tell a rich, visual story with immersive, fullscreen vertical ads.", checked: true },
  { id: "in-stream", label: "In-stream ads for videos and reels", description: "Reach people before, during or after they watch a video or reel", checked: true },
  { id: "search", label: "Search results", description: "Get visibility for your business as people search", checked: true },
  { id: "messages", label: "Messages", description: "Send offers or updates to people who are already connected to your business.", checked: true },
  { id: "apps-sites", label: "Apps and sites", description: "Expand your reach with ads in external apps and websites.", checked: true },
];

const deviceOptions = [
  { value: "all", label: "All devices (recommended)" },
  { value: "mobile", label: "Mobile devices only" },
  { value: "desktop", label: "Desktop only" },
];

interface FormatPlacementsSectionProps {
  placementType: "advantage" | "manual";
  onPlacementTypeChange: (value: "advantage" | "manual") => void;
  devices: string;
  onDevicesChange: (value: string) => void;
  placements: PlacementItem[];
  onPlacementsChange: (placements: PlacementItem[]) => void;
}

function PlacementRadioOption({ 
  label, 
  description, 
  selected, 
  onSelect, 
  badge 
}: { 
  label: string; 
  description: string; 
  selected: boolean; 
  onSelect: () => void; 
  badge?: string;
}) {
  return (
    <label 
      className="flex items-start gap-2 px-2 py-1 cursor-pointer hover:bg-[rgba(0,0,0,0.02)] rounded-[4px] transition-colors"
      onClick={onSelect}
    >
      <div 
        className={cn(
          "w-6 h-6 rounded-full border shrink-0 mt-[2px]",
          "flex items-center justify-center",
          selected ? "border-[#CBD2D9]" : "border-[#CBD2D9]"
        )}
      >
        {selected && (
          <div className="w-3 h-3 rounded-full bg-[#0A78BE]" />
        )}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-1">
          <span className="text-[14px] leading-[20px] text-[#1C2B33]">
            {label}
          </span>
          {badge && (
            <span className="text-[12px] leading-[16px] text-[#465A69]">
              ✦
            </span>
          )}
        </div>
        <p className="text-[12px] leading-[16px] text-[#465A69]">
          {description}
        </p>
      </div>
    </label>
  );
}

function PlacementCheckbox({ item, onToggle }: { item: PlacementItem; onToggle: () => void }) {
  return (
    <div className="border border-[#D9D9D9] p-2 -mb-px first:rounded-t-[4px] last:rounded-b-[4px]">
      <div className="flex items-center gap-[19px]">
        <div className="flex-1 flex items-center gap-2 h-[14px]">
          <Icon 
            name="CaretRight" 
            variant="outlined" 
            size={16} 
            className="text-[rgba(40,57,67,0.6)] -rotate-90" 
          />
          <span className="text-[12px] font-bold leading-[20px] text-[#465A69]">
            {item.label}
          </span>
        </div>
        <button
          type="button"
          onClick={onToggle}
          className={cn(
            "w-6 h-6 rounded-[4px] border shrink-0 flex items-center justify-center transition-colors",
            item.checked 
              ? "bg-[#0A78BE] border-[#0A78BE]" 
              : "bg-white border-[#CBD2D9]"
          )}
        >
          {item.checked && (
            <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
              <path d="M1 5L5 9L13 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>
      </div>
      <div className="pl-8 pr-[30px] mt-[10px]">
        <p className="text-[12px] leading-normal text-[rgba(28,43,51,0.65)]">
          {item.description}
        </p>
      </div>
    </div>
  );
}

function PlacementInfoItem({ label, value, hasTooltip = false }: { label: string; value: string | React.ReactNode; hasTooltip?: boolean }) {
  return (
    <div className="py-1">
      <div className="flex items-center gap-1">
        <span className="text-[15px] font-bold leading-[20px] text-[#465A69] font-optimistic">
          {label}
        </span>
        {hasTooltip && (
          <Icon name="Info" variant="filled" size={12} className="text-[#283943]" />
        )}
      </div>
      <div className="text-[14px] leading-[20px] text-[#465A69]">
        {value}
      </div>
    </div>
  );
}

function FormatPlacementsSection({
  placementType,
  onPlacementTypeChange,
  devices,
  onDevicesChange,
  placements,
  onPlacementsChange,
}: FormatPlacementsSectionProps) {
  const handleTogglePlacement = (id: string) => {
    onPlacementsChange(placements.map(p => 
      p.id === id ? { ...p, checked: !p.checked } : p
    ));
  };

  const selectedDevice = deviceOptions.find(o => o.value === devices);

  return (
    <CollapsibleCard title="Format & placements" defaultExpanded={false}>
      <div className="space-y-4">
        {/* Placement Type Selection */}
        <div className="space-y-1">
          <PlacementRadioOption
            label="Advantage+ placements (Recommended)"
            description="Use Advantage+ placements to maximise your budget and help show your ads to more people. Facebook's delivery system will allocate your ad set's budget across multiple placements based on where they're likely to perform best."
            selected={placementType === "advantage"}
            onSelect={() => onPlacementTypeChange("advantage")}
            badge="✦"
          />
          <PlacementRadioOption
            label="Manual placements"
            description="Manually choose the places to show your ad. The more placements you select, the more opportunities you'll have to reach your target audience and achieve your business goals."
            selected={placementType === "manual"}
            onSelect={() => onPlacementTypeChange("manual")}
          />
        </div>

        {/* Devices Dropdown */}
        <div className="space-y-1">
          <h3 className="text-[15px] font-bold leading-[20px] text-[#1C2B33] font-optimistic pb-1">
            Devices
          </h3>
          <Dropdown
            className="w-full"
            width="100%"
            trigger={({ isOpen }) => (
              <div
                className={cn(
                  "flex items-center justify-between gap-2 px-3 py-2 cursor-pointer",
                  "bg-white border rounded-[4px] transition-colors",
                  isOpen 
                    ? "border-[#0A78BE] ring-1 ring-[#0A78BE]" 
                    : "border-[#CBD2D9] hover:border-[#1877F2]"
                )}
              >
                <span className="text-[14px] leading-[20px] text-[#1C2B33]">
                  {selectedDevice?.label || "Select device"}
                </span>
                <Icon
                  name="CaretDownSmall"
                  variant="outlined"
                  size={16}
                  className={cn(
                    "shrink-0 text-[#283943] transition-transform",
                    isOpen && "rotate-180"
                  )}
                />
              </div>
            )}
          >
            {deviceOptions.map((option) => (
              <Dropdown.Item
                key={option.value}
                label={option.label}
                onClick={() => onDevicesChange(option.value)}
                selectionType="radio"
                selected={devices === option.value}
              />
            ))}
          </Dropdown>
        </div>

        {/* Placements List */}
        <div className="space-y-1">
          <h3 className="text-[15px] font-bold leading-[20px] text-[#1C2B33] font-optimistic pb-1">
            Placements
          </h3>
          <div className="flex flex-col">
            {placements.map((item) => (
              <PlacementCheckbox
                key={item.id}
                item={item}
                onToggle={() => handleTogglePlacement(item.id)}
              />
            ))}
          </div>
        </div>

        {/* Specific Mobile Devices */}
        <div className="py-1">
          <h4 className="text-[15px] font-bold leading-[20px] text-[#465A69] font-optimistic">
            Specific mobile devices & operating systems
          </h4>
          <div className="text-[14px] leading-[20px] text-[#465A69]">
            <p>Devices</p>
            <p className="ml-2">• All</p>
            <p>Only when connected to Wi-Fi</p>
            <p className="ml-2">• No</p>
          </div>
        </div>

        {/* Brand Safety Section */}
        <div className="space-y-2">
          <div>
            <h3 className="text-[16px] font-bold leading-[20px] text-[#1C2B33] font-optimistic">
              Brand safety and suitability
            </h3>
            <p className="text-[14px] leading-[20px] text-[#1C2B33]">
              Control which types of content your ads can appear in or next to. Brand safety and suitability controls set in your ad account settings are applied.
            </p>
          </div>

          <PlacementInfoItem 
            label="Inventory filter" 
            hasTooltip
            value={
              <ul className="list-disc ml-5 text-[14px] leading-[20px] text-[#465A69]">
                <li>Facebook and Instagram feed ads and Reels feed ads: Moderate inventory</li>
                <li>Facebook in-stream videos, Ads on Facebook Reels, and Ads on Instagram Reels: Moderate inventory</li>
                <li>Audience Network: Moderate inventory</li>
              </ul>
            }
          />

          <PlacementInfoItem label="Block lists" value="None selected" hasTooltip />
          <PlacementInfoItem label="Content type exclusions" value="None selected" hasTooltip />
          <PlacementInfoItem label="Topic exclusions for Facebook in-stream videos" value="None selected" hasTooltip />
          <PlacementInfoItem label="Content allow lists" value="None selected" hasTooltip />
          <PlacementInfoItem label="Publisher allow lists" value="None selected" hasTooltip />
        </div>
      </div>
    </CollapsibleCard>
  );
}

// ============================================
// Main Edit Ad Set Modal Component
// ============================================
export function EditAdSetModal2({
  isOpen,
  onClose,
  onSave,
  initialData,
}: EditAdSetModal2Props) {
  // Overview state
  const [adSetName, setAdSetName] = useState(initialData?.adSetName || "Ad set 1");
  const [budgetAmount, setBudgetAmount] = useState(initialData?.budget || "500,000.00");
  const [budgetIsFocused, setBudgetIsFocused] = useState(false);
  const [performanceGoal, setPerformanceGoal] = useState(initialData?.performanceGoal || "Maximize reach of ads");
  const budgetRef = useRef<HTMLInputElement>(null);

  // Validation errors
  const [adSetNameError, setAdSetNameError] = useState("");
  const [budgetError, setBudgetError] = useState("");

  // Schedule state
  const [startDate, setStartDate] = useState("Jan 30, 2026");
  const [endDate, setEndDate] = useState("Feb 20, 2026");
  const [startTime, setStartTime] = useState("12:00 AM");
  const [endTime, setEndTime] = useState("11:59 PM");

  // Audience state
  const [audienceTab, setAudienceTab] = useState("create");
  const [ageMin, setAgeMin] = useState("18");
  const [ageMax, setAgeMax] = useState("65+");
  const [gender, setGender] = useState<string | null>("all");

  // Frequency state
  const [frequencyType, setFrequencyType] = useState<string | null>("cap");
  const [frequencyCount, setFrequencyCount] = useState(2);
  const [frequencyDays, setFrequencyDays] = useState(7);

  // Placements state
  const [placementType, setPlacementType] = useState<"advantage" | "manual">("manual");
  const [placementDevices, setPlacementDevices] = useState("all");
  const [placements, setPlacements] = useState<PlacementItem[]>(defaultPlacements);

  // Budget display value
  const budgetDisplayValue = budgetIsFocused
    ? budgetAmount
    : formatWithCommas(budgetAmount);

  // Budget handlers
  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const numericValue = rawValue.replace(/[^0-9.]/g, "");
    
    const parts = numericValue.split(".");
    if (parts.length > 2) return;
    if (parts[1] && parts[1].length > 2) return;

    setBudgetAmount(numericValue);
    if (budgetError && numericValue.trim() !== "") {
      setBudgetError("");
    }
  };

  const handleBudgetFocus = () => {
    setBudgetIsFocused(true);
    setBudgetAmount(stripCommas(budgetAmount));
    if (budgetError) {
      setBudgetError("");
    }
  };

  const handleBudgetBlur = () => {
    setBudgetIsFocused(false);
    if (budgetAmount) {
      const rounded = roundToHundredths(budgetAmount);
      setBudgetAmount(rounded);
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    let isValid = true;

    if (!adSetName.trim()) {
      setAdSetNameError("Please enter an ad set name");
      isValid = false;
    } else {
      setAdSetNameError("");
    }

    const numericBudget = parseFloat(stripCommas(budgetAmount));
    if (!budgetAmount.trim() || isNaN(numericBudget) || numericBudget <= 0) {
      setBudgetError("Please enter your budget");
      isValid = false;
    } else {
      setBudgetError("");
    }

    return isValid;
  };

  // Handle save
  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    const adSetData = {
      adSetName,
      budget: budgetAmount,
      performanceGoal,
      schedule: {
        startDate,
        startTime,
        endDate,
        endTime,
      },
      audience: {
        audienceTab,
        ageMin,
        ageMax,
        gender,
      },
      frequency: {
        type: frequencyType,
        count: frequencyCount,
        days: frequencyDays,
      },
    };

    onSave?.(adSetData);
    onClose();
  };

  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setAdSetName(initialData?.adSetName || "Ad set 1");
      setBudgetAmount(initialData?.budget || "500,000.00");
      setPerformanceGoal(initialData?.performanceGoal || "Maximize reach of ads");
      setAdSetNameError("");
      setBudgetError("");
      setBudgetIsFocused(false);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="bg-white rounded-t-[8px] shadow-[0px_8px_24px_4px_rgba(0,0,0,0.1),0px_2px_2px_0px_rgba(0,0,0,0.1)] w-[664px] max-w-[calc(100vw-80px)] max-h-[calc(100vh-80px)] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between pl-4 pr-1 py-0 bg-white shrink-0">
          <div className="flex-1 flex flex-col justify-center py-4 pr-2 min-w-0">
            <h2 className="text-[16px] font-bold leading-[20px] text-[#1C2B33] font-optimistic">
              Edit Ad Set
            </h2>
          </div>
          <div className="flex items-start gap-2 py-2 pr-1">
            <button
              className="p-3 hover:bg-[rgba(0,0,0,0.05)] rounded-[4px] transition-colors"
              onClick={onClose}
            >
              <Icon name="Close" variant="outlined" size={16} className="text-[#283943]" />
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#CBD2D9]" />

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <OverviewSection
            adSetName={adSetName}
            onAdSetNameChange={(val) => {
              setAdSetName(val);
              if (adSetNameError && val.trim()) {
                setAdSetNameError("");
              }
            }}
            adSetNameError={adSetNameError}
            budgetDisplayValue={budgetDisplayValue}
            onBudgetChange={handleBudgetChange}
            onBudgetFocus={handleBudgetFocus}
            onBudgetBlur={handleBudgetBlur}
            budgetError={budgetError}
            budgetRef={budgetRef}
            performanceGoal={performanceGoal}
            onPerformanceGoalChange={setPerformanceGoal}
          />

          <ScheduleSection
            startDate={startDate}
            onStartDateChange={setStartDate}
            startTime={startTime}
            onStartTimeChange={setStartTime}
            endDate={endDate}
            onEndDateChange={setEndDate}
            endTime={endTime}
            onEndTimeChange={setEndTime}
          />

          <AudienceSection
            audienceTab={audienceTab}
            onAudienceTabChange={setAudienceTab}
            ageMin={ageMin}
            onAgeMinChange={setAgeMin}
            ageMax={ageMax}
            onAgeMaxChange={setAgeMax}
            gender={gender}
            onGenderChange={setGender}
          />

          <FrequencySection
            frequencyType={frequencyType}
            onFrequencyTypeChange={setFrequencyType}
            frequencyCount={frequencyCount}
            onFrequencyCountChange={setFrequencyCount}
            frequencyDays={frequencyDays}
            onFrequencyDaysChange={setFrequencyDays}
          />

          <FormatPlacementsSection
            placementType={placementType}
            onPlacementTypeChange={setPlacementType}
            devices={placementDevices}
            onDevicesChange={setPlacementDevices}
            placements={placements}
            onPlacementsChange={setPlacements}
          />
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-2 px-4 pt-3 pb-4 bg-white shrink-0">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ============================================
// Preview Version for Modal Gallery
// ============================================
export function EditAdSetModal2Preview() {
  // Overview state
  const [adSetName, setAdSetName] = useState("Ad set 1");
  const [budgetAmount, setBudgetAmount] = useState("500,000.00");
  const [budgetIsFocused, setBudgetIsFocused] = useState(false);
  const [performanceGoal, setPerformanceGoal] = useState("Maximize reach of ads");
  const budgetRef = useRef<HTMLInputElement>(null);

  // Validation errors
  const [adSetNameError, setAdSetNameError] = useState("");
  const [budgetError, setBudgetError] = useState("");

  // Schedule state
  const [startDate, setStartDate] = useState("Jan 30, 2026");
  const [endDate, setEndDate] = useState("Feb 20, 2026");
  const [startTime, setStartTime] = useState("12:00 AM");
  const [endTime, setEndTime] = useState("11:59 PM");

  // Audience state
  const [audienceTab, setAudienceTab] = useState("create");
  const [ageMin, setAgeMin] = useState("18");
  const [ageMax, setAgeMax] = useState("65+");
  const [gender, setGender] = useState<string | null>("all");

  // Frequency state
  const [frequencyType, setFrequencyType] = useState<string | null>("cap");
  const [frequencyCount, setFrequencyCount] = useState(2);
  const [frequencyDays, setFrequencyDays] = useState(7);

  // Placements state
  const [placementType, setPlacementType] = useState<"advantage" | "manual">("manual");
  const [placementDevices, setPlacementDevices] = useState("all");
  const [placements, setPlacements] = useState<PlacementItem[]>(defaultPlacements);

  // Budget display value
  const budgetDisplayValue = budgetIsFocused
    ? budgetAmount
    : formatWithCommas(budgetAmount);

  // Budget handlers
  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const numericValue = rawValue.replace(/[^0-9.]/g, "");
    
    const parts = numericValue.split(".");
    if (parts.length > 2) return;
    if (parts[1] && parts[1].length > 2) return;

    setBudgetAmount(numericValue);
    if (budgetError && numericValue.trim() !== "") {
      setBudgetError("");
    }
  };

  const handleBudgetFocus = () => {
    setBudgetIsFocused(true);
    setBudgetAmount(stripCommas(budgetAmount));
    if (budgetError) {
      setBudgetError("");
    }
  };

  const handleBudgetBlur = () => {
    setBudgetIsFocused(false);
    if (budgetAmount) {
      const rounded = roundToHundredths(budgetAmount);
      setBudgetAmount(rounded);
    }
  };

  return (
    <div className="bg-white rounded-t-[8px] shadow-[0px_8px_24px_4px_rgba(0,0,0,0.1),0px_2px_2px_0px_rgba(0,0,0,0.1)] w-[664px] overflow-visible">
      {/* Modal Header */}
      <div className="flex items-start justify-between pl-4 pr-1 py-0 bg-white shrink-0">
        <div className="flex-1 flex flex-col justify-center py-4 pr-2 min-w-0">
          <h2 className="text-[16px] font-bold leading-[20px] text-[#1C2B33] font-optimistic">
            Edit Ad Set
          </h2>
        </div>
        <div className="flex items-start gap-2 py-2 pr-1">
          <button className="p-3 hover:bg-[rgba(0,0,0,0.05)] rounded-[4px] transition-colors">
            <Icon name="Close" variant="outlined" size={16} className="text-[#283943]" />
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-[#CBD2D9]" />

      {/* Modal Body */}
      <div className="p-4 space-y-4">
        <OverviewSection
          adSetName={adSetName}
          onAdSetNameChange={(val) => {
            setAdSetName(val);
            if (adSetNameError && val.trim()) {
              setAdSetNameError("");
            }
          }}
          adSetNameError={adSetNameError}
          budgetDisplayValue={budgetDisplayValue}
          onBudgetChange={handleBudgetChange}
          onBudgetFocus={handleBudgetFocus}
          onBudgetBlur={handleBudgetBlur}
          budgetError={budgetError}
          budgetRef={budgetRef}
          performanceGoal={performanceGoal}
          onPerformanceGoalChange={setPerformanceGoal}
        />

        <ScheduleSection
          startDate={startDate}
          onStartDateChange={setStartDate}
          startTime={startTime}
          onStartTimeChange={setStartTime}
          endDate={endDate}
          onEndDateChange={setEndDate}
          endTime={endTime}
          onEndTimeChange={setEndTime}
        />

        <AudienceSection
          audienceTab={audienceTab}
          onAudienceTabChange={setAudienceTab}
          ageMin={ageMin}
          onAgeMinChange={setAgeMin}
          ageMax={ageMax}
          onAgeMaxChange={setAgeMax}
          gender={gender}
          onGenderChange={setGender}
        />

        <FrequencySection
          frequencyType={frequencyType}
          onFrequencyTypeChange={setFrequencyType}
          frequencyCount={frequencyCount}
          onFrequencyCountChange={setFrequencyCount}
          frequencyDays={frequencyDays}
          onFrequencyDaysChange={setFrequencyDays}
        />

        <FormatPlacementsSection
          placementType={placementType}
          onPlacementTypeChange={setPlacementType}
          devices={placementDevices}
          onDevicesChange={setPlacementDevices}
          placements={placements}
          onPlacementsChange={setPlacements}
        />
      </div>

      {/* Modal Footer */}
      <div className="flex items-center justify-end gap-2 px-4 pt-3 pb-4 bg-white shrink-0">
        <Button variant="secondary">Cancel</Button>
        <Button variant="primary">Save</Button>
      </div>
    </div>
  );
}
