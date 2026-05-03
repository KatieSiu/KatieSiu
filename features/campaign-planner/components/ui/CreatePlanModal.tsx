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
// Create Plan Modal Props
// ============================================
interface CreatePlanModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when modal should close */
  onClose: () => void;
  /** Callback when plan is successfully created - receives plan data */
  onSuccess?: (planData: any) => void;
  /** Callback to navigate to the new plan - receives plan ID */
  onNavigate?: (planId: string) => void;
}

// ============================================
// Date Formatting Utilities
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
// DateInput Component
// ============================================
interface DateInputProps {
  value: string;
  onChange: (value: string) => void;
}

function DateInput({ value, onChange }: DateInputProps) {
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
      placeholder="MM/DD/YYYY"
      className="flex-1 text-[14px] text-[#1C2B33] outline-none bg-transparent placeholder:text-[rgba(28,43,51,0.65)] placeholder:transition-opacity focus:placeholder:opacity-0"
    />
  );
}

// ============================================
// TimeInput Component
// ============================================
interface TimeInputProps {
  value: string;
  onChange: (value: string) => void;
}

function TimeInput({ value, onChange }: TimeInputProps) {
  const match = value.match(/^([\d:]+)\s*(AM|PM)$/i);
  const timePart = match ? match[1] : "12:00";
  const periodPart = match ? match[2].toUpperCase() : "AM";

  const formatTime = (input: string): string => {
    const digits = input.replace(/\D/g, "");
    if (digits.length === 0) return "12:00";
    
    let hours: string;
    let minutes: string;
    
    if (input.includes(":")) {
      const parts = input.split(":");
      hours = parts[0] || "12";
      minutes = parts[1] || "00";
    } else {
      if (digits.length <= 2) {
        hours = digits;
        minutes = "00";
      } else if (digits.length === 3) {
        hours = digits.slice(0, 1);
        minutes = digits.slice(1, 3);
      } else {
        hours = digits.slice(0, 2);
        minutes = digits.slice(2, 4);
      }
    }
    
    const paddedHours = hours.padStart(2, "0").slice(0, 2);
    const paddedMinutes = minutes.padStart(2, "0").slice(0, 2);
    
    let finalHours = parseInt(paddedHours, 10);
    let finalMinutes = parseInt(paddedMinutes, 10);
    
    if (isNaN(finalHours) || finalHours < 1) finalHours = 12;
    if (finalHours > 12) finalHours = 12;
    if (isNaN(finalMinutes) || finalMinutes > 59) finalMinutes = 0;
    
    return `${finalHours.toString().padStart(2, "0")}:${finalMinutes.toString().padStart(2, "0")}`;
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    const sanitized = newTime.replace(/[^\d:]/g, "");
    const digits = sanitized.replace(/\D/g, "");
    if (digits.length > 4) return;
    onChange(`${sanitized} ${periodPart}`);
  };

  const handleBlur = () => {
    const formatted = formatTime(timePart);
    onChange(`${formatted} ${periodPart}`);
  };

  const handlePeriodToggle = () => {
    const newPeriod = periodPart === "AM" ? "PM" : "AM";
    onChange(`${timePart} ${newPeriod}`);
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={timePart}
        onChange={handleTimeChange}
        onBlur={handleBlur}
        className="w-[42px] text-[14px] text-[#1C2B33] outline-none bg-transparent"
        placeholder="HH:MM"
      />
      <button
        type="button"
        onClick={handlePeriodToggle}
        className="text-[14px] font-medium text-[#1C2B33] hover:text-[#1877F2] transition-colors cursor-pointer select-none"
      >
        {periodPart}
      </button>
    </div>
  );
}

// ============================================
// Date/Time Validation Utilities
// ============================================
function parseTime(timeStr: string): { hours: number; minutes: number } | null {
  const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;
  
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const isPM = match[3].toUpperCase() === "PM";
  
  if (isPM && hours !== 12) hours += 12;
  if (!isPM && hours === 12) hours = 0;
  
  return { hours, minutes };
}

function combineDateAndTime(dateStr: string, timeStr: string): Date | null {
  const date = parseDate(dateStr);
  const time = parseTime(timeStr);
  if (!date || !time) return null;
  date.setHours(time.hours, time.minutes, 0, 0);
  return date;
}

function isInFuture(dateStr: string, timeStr: string): boolean {
  const dateTime = combineDateAndTime(dateStr, timeStr);
  if (!dateTime) return true;
  const now = new Date();
  const oneMinuteFromNow = new Date(now.getTime() + 60 * 1000);
  return dateTime >= oneMinuteFromNow;
}

// ============================================
// Setup Section
// ============================================
interface SetupSectionProps {
  planName: string;
  onPlanNameChange: (value: string) => void;
  planNameError?: string | null;
  planNameRef?: React.RefObject<HTMLDivElement>;
  adAccount: string;
  onAdAccountChange: (value: string) => void;
  facebookPage: string;
  onFacebookPageChange: (value: string) => void;
  instagramAccount: string;
  onInstagramAccountChange: (value: string) => void;
}

function SetupSection({
  planName,
  onPlanNameChange,
  planNameError,
  planNameRef,
  adAccount,
  onAdAccountChange,
  facebookPage,
  onFacebookPageChange,
  instagramAccount,
  onInstagramAccountChange,
}: SetupSectionProps) {
  return (
    <CollapsibleCard title="Set up" defaultExpanded={true}>
      <div className="space-y-3">
        <div ref={planNameRef} className="flex items-start gap-6">
          <span className="w-[180px] shrink-0 text-[14px] font-medium leading-[20px] text-[rgba(0,0,0,0.85)] pt-2">
            Plan Name
          </span>
          <Input
            value={planName}
            onChange={(e) => onPlanNameChange(e.target.value)}
            className="flex-1"
            placeholder="Enter plan name"
            errorMessage={planNameError || undefined}
          />
        </div>

        <div className="flex items-center gap-6">
          <span className="w-[180px] shrink-0 text-[14px] font-medium leading-[20px] text-[rgba(0,0,0,0.85)]">
            Ad account
          </span>
          <Dropdown
            className="flex-1"
            trigger={({ isOpen }) => (
              <button className={cn(
                "w-full flex items-center gap-2 px-3 py-2 text-left",
                getTriggerStyles(isOpen)
              )}>
                <span className="flex-1 text-[14px] text-[#1C2B33]">{adAccount}</span>
                <Icon name="SmallTriangleDown" variant="filled" size={16} className="shrink-0 text-[#283943]" />
              </button>
            )}
            width="100%"
          >
            <Dropdown.List>
              <Dropdown.Item 
                label="Chicken Company (12123123123123123123123)" 
                selectionType="radio"
                selected={adAccount === "Chicken Company (12123123123123123123123)"}
                onSelectionChange={() => onAdAccountChange("Chicken Company (12123123123123123123123)")} 
              />
              <Dropdown.Item 
                label="Other Ad Account (9876543210)" 
                selectionType="radio"
                selected={adAccount === "Other Ad Account (9876543210)"}
                onSelectionChange={() => onAdAccountChange("Other Ad Account (9876543210)")} 
              />
            </Dropdown.List>
          </Dropdown>
        </div>

        <div className="flex items-center gap-6">
          <span className="w-[180px] shrink-0 text-[14px] font-medium leading-[20px] text-[rgba(0,0,0,0.85)]">
            Facebook Page
          </span>
          <Dropdown
            className="flex-1"
            trigger={({ isOpen }) => (
              <button className={cn(
                "w-full flex items-center gap-2 px-3 py-2 text-left",
                getTriggerStyles(isOpen)
              )}>
                <div 
                  className="w-6 h-6 rounded-[4px] shrink-0" 
                  style={{ backgroundColor: facebookPage === "Trash Type Foundry" ? "#1877F2" : "#7C3AED" }}
                />
                <span className="flex-1 text-[14px] text-[#1C2B33]">{facebookPage}</span>
                <Icon name="SmallTriangleDown" variant="filled" size={16} className="shrink-0 text-[#283943]" />
              </button>
            )}
            width="100%"
          >
            <Dropdown.List>
              <Dropdown.Item 
                label="Trash Type Foundry" 
                thumbnail={<div className="w-6 h-6 rounded-[4px] bg-[#1877F2]" />}
                selectionType="radio"
                selected={facebookPage === "Trash Type Foundry"}
                onSelectionChange={() => onFacebookPageChange("Trash Type Foundry")} 
              />
              <Dropdown.Item 
                label="Other Page" 
                thumbnail={<div className="w-6 h-6 rounded-[4px] bg-[#7C3AED]" />}
                selectionType="radio"
                selected={facebookPage === "Other Page"}
                onSelectionChange={() => onFacebookPageChange("Other Page")} 
              />
            </Dropdown.List>
          </Dropdown>
        </div>

        <div className="flex items-center gap-6">
          <span className="w-[180px] shrink-0 text-[14px] font-medium leading-[20px] text-[rgba(0,0,0,0.85)]">
            Instagram account
          </span>
          <Dropdown
            className="flex-1"
            trigger={({ isOpen }) => (
              <button className={cn(
                "w-full flex items-center gap-2 px-3 py-2 text-left",
                getTriggerStyles(isOpen)
              )}>
                <div 
                  className={`w-6 h-6 rounded-[4px] shrink-0 ${
                    instagramAccount === "Trash Type Foundry" 
                      ? "bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45]" 
                      : "bg-gradient-to-br from-[#0EA5E9] via-[#10B981] to-[#34D399]"
                  }`} 
                />
                <span className="flex-1 text-[14px] text-[#1C2B33]">{instagramAccount}</span>
                <Icon name="SmallTriangleDown" variant="filled" size={16} className="shrink-0 text-[#283943]" />
              </button>
            )}
            width="100%"
          >
            <Dropdown.List>
              <Dropdown.Item 
                label="Trash Type Foundry" 
                thumbnail={<div className="w-6 h-6 rounded-[4px] bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45]" />}
                selectionType="radio"
                selected={instagramAccount === "Trash Type Foundry"}
                onSelectionChange={() => onInstagramAccountChange("Trash Type Foundry")} 
              />
              <Dropdown.Item 
                label="Other Account" 
                thumbnail={<div className="w-6 h-6 rounded-[4px] bg-gradient-to-br from-[#0EA5E9] via-[#10B981] to-[#34D399]" />}
                selectionType="radio"
                selected={instagramAccount === "Other Account"}
                onSelectionChange={() => onInstagramAccountChange("Other Account")} 
              />
            </Dropdown.List>
          </Dropdown>
        </div>
      </div>
    </CollapsibleCard>
  );
}

// ============================================
// Campaign Details Section
// ============================================
interface CampaignDetailsSectionProps {
  buyingType: string | null;
  onBuyingTypeChange: (value: string) => void;
  goalType: string | null;
  onGoalTypeChange: (value: string) => void;
  budgetAmount: string;
  onBudgetAmountChange: (value: string) => void;
  reachValue: string;
  onReachValueChange: (value: string) => void;
  performanceGoal: string;
  onPerformanceGoalChange: (value: string) => void;
  budgetError?: string | null;
  budgetRef?: React.RefObject<HTMLDivElement>;
  onBudgetFocus?: () => void;
  autoFocusBudget?: boolean;
}

function CampaignDetailsSection({
  buyingType,
  onBuyingTypeChange,
  goalType,
  onGoalTypeChange,
  budgetAmount,
  onBudgetAmountChange,
  reachValue,
  onReachValueChange,
  performanceGoal,
  onPerformanceGoalChange,
  budgetError: externalBudgetError,
  budgetRef,
  onBudgetFocus,
  autoFocusBudget = false,
}: CampaignDetailsSectionProps) {
  const [budgetError, setBudgetError] = useState<string | null>(null);
  const [budgetFocused, setBudgetFocused] = useState(false);
  const [budgetEditValue, setBudgetEditValue] = useState("");
  const budgetInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus budget input on mount if requested
  useEffect(() => {
    if (autoFocusBudget && goalType === "budget" && budgetInputRef.current) {
      // Small delay to ensure the component is fully mounted
      const timer = setTimeout(() => {
        budgetInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [autoFocusBudget, goalType]);

  const handleBudgetFocus = () => {
    setBudgetFocused(true);
    setBudgetEditValue(stripCommas(budgetAmount));
    onBudgetFocus?.();
  };

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "") {
      setBudgetEditValue("");
      setBudgetError(null);
      return;
    }
    
    const hasInvalidChars = /[^0-9.]/.test(value);
    const hasMultipleDecimals = (value.match(/\./g) || []).length > 1;
    
    if (hasInvalidChars || hasMultipleDecimals) {
      setBudgetError("Invalid value");
    } else {
      setBudgetError(null);
    }
    setBudgetEditValue(value);
  };

  const handleBudgetBlur = () => {
    setBudgetFocused(false);
    if (budgetEditValue && !budgetError) {
      const rounded = roundToHundredths(budgetEditValue);
      const formatted = formatWithCommas(rounded);
      onBudgetAmountChange(formatted);
    } else if (budgetEditValue === "") {
      onBudgetAmountChange("");
    }
  };

  const budgetDisplayValue = budgetFocused ? budgetEditValue : budgetAmount;

  const handleGoalTypeChange = (value: string) => {
    onGoalTypeChange(value);
    onBudgetFocus?.(); // Clear any errors when switching goal type
  };

  return (
    <CollapsibleCard title="Campaign Details" defaultExpanded={true}>
      <div className="space-y-4">
        {/* Buying Type */}
        <div className="flex items-start gap-6">
          <div className="w-[180px] shrink-0">
            <span className="text-[14px] font-medium leading-[20px] text-[rgba(0,0,0,0.85)]">
              Buying Type
            </span>
            <p className="text-[12px] leading-[16px] text-[#465A69]">
              Selection cannot be changed
            </p>
          </div>
          <Radio.Group
            value={buyingType}
            onChange={onBuyingTypeChange}
            name="buying-type"
            orientation="horizontal"
            className="flex-1"
          >
            <Radio value="reservation" label="Reservation" />
            <Radio value="auction" label="Auction" />
          </Radio.Group>
        </div>

        {/* Budget/Reach */}
        <div ref={budgetRef} className="flex items-start gap-6">
          <span className="w-[180px] shrink-0 text-[14px] font-medium leading-[20px] text-[rgba(0,0,0,0.85)]">
            Budget/Reach
          </span>
          <div className="flex-1 space-y-2">
            <Radio.Group
              value={goalType}
              onChange={handleGoalTypeChange}
              name="goal-type"
              orientation="horizontal"
            >
              <Radio value="budget" label="Budget Goal" />
              <Radio value="reach" label="Reach Goal" />
            </Radio.Group>
            
            {goalType === "budget" ? (
              <Input
                ref={budgetInputRef}
                value={budgetDisplayValue}
                onChange={handleBudgetChange}
                onFocus={handleBudgetFocus}
                onBlur={handleBudgetBlur}
                inputMode="numeric"
                placeholder="Enter amount"
                rightAddon={<span className="text-[14px] text-[rgba(28,43,51,0.65)]">USD</span>}
                errorMessage={externalBudgetError || budgetError || undefined}
              />
            ) : (
              <Input
                value={reachValue}
                onChange={(e) => onReachValueChange(e.target.value)}
                onFocus={onBudgetFocus}
                placeholder="X number of accounts reached"
              />
            )}
          </div>
        </div>

        {/* Performance Goal */}
        <div className="flex items-center gap-6">
          <span className="w-[180px] shrink-0 text-[14px] font-medium leading-[20px] text-[rgba(0,0,0,0.85)]">
            Performance goal
          </span>
          <Dropdown
            className="flex-1"
            trigger={({ isOpen }) => (
              <button className={cn(
                "w-full flex items-center gap-2 px-3 py-2 text-left",
                getTriggerStyles(isOpen)
              )}>
                <span className="flex-1 text-[14px] text-[#1C2B33]">{performanceGoal}</span>
                <Icon name="SmallTriangleDown" variant="filled" size={16} className="shrink-0 text-[#283943]" />
              </button>
            )}
            width="100%"
          >
            <Dropdown.List>
              <Dropdown.Item 
                label="Maximize reach of ads" 
                selectionType="radio"
                selected={performanceGoal === "Maximize reach of ads"}
                onSelectionChange={() => onPerformanceGoalChange("Maximize reach of ads")} 
              />
              <Dropdown.Item 
                label="Maximize number of impressions" 
                selectionType="radio"
                selected={performanceGoal === "Maximize number of impressions"}
                onSelectionChange={() => onPerformanceGoalChange("Maximize number of impressions")} 
              />
              <Dropdown.Item 
                label="Maximize ThruPlay views" 
                selectionType="radio"
                selected={performanceGoal === "Maximize ThruPlay views"}
                onSelectionChange={() => onPerformanceGoalChange("Maximize ThruPlay views")} 
              />
            </Dropdown.List>
          </Dropdown>
        </div>
      </div>
    </CollapsibleCard>
  );
}

// ============================================
// Schedule Section
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
              <DateInput value={startDate} onChange={handleStartDateChange} />
            </div>
            <div className="w-px h-[34px] bg-[#CBD2D9]" />
            <div className="flex items-center gap-2 flex-1 px-3 py-2">
              <Icon name="Clock" variant="outlined" size={16} className="text-[#283943]" />
              <TimeInput value={startTime} onChange={handleStartTimeInputChange} />
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
              <DateInput value={endDate} onChange={handleEndDateChange} />
            </div>
            <div className="w-px h-[34px] bg-[#CBD2D9]" />
            <div className="flex items-center gap-2 flex-1 px-3 py-2">
              <Icon name="Clock" variant="outlined" size={16} className="text-[#283943]" />
              <TimeInput value={endTime} onChange={handleEndTimeInputChange} />
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
// Audience Section
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
// Frequency Section
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
// Placements Section
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

interface PlacementsSectionProps {
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

function PlacementsSection({
  placementType,
  onPlacementTypeChange,
  devices,
  onDevicesChange,
  placements,
  onPlacementsChange,
}: PlacementsSectionProps) {
  const handleTogglePlacement = (id: string) => {
    onPlacementsChange(placements.map(p => 
      p.id === id ? { ...p, checked: !p.checked } : p
    ));
  };

  const selectedDevice = deviceOptions.find(o => o.value === devices);

  return (
    <CollapsibleCard title="Placements" defaultExpanded={false}>
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
// Special Ad Categories Section
// ============================================
function SpecialAdCategoriesSection() {
  return (
    <CollapsibleCard title="Special Ad Categories" defaultExpanded={false}>
      <div className="space-y-2">
        <div className="flex items-center gap-1">
          <span className="text-[14px] font-bold leading-[20px] text-[rgba(0,0,0,0.75)]">
            Special Ad Categories
          </span>
        </div>
        <p className="text-[14px] leading-[20px] text-[#1C2B33]">
          Declare if your ads are related to financial products and services, employment, housing, social issues, elections or politics to help prevent ad rejections. Requirements differ by country.{" "}
          <button className="text-[#0A78BE] hover:underline">About Special Ad Categories</button>
        </p>
        
        <div className="space-y-1 pt-2">
          <label className="block text-[14px] font-bold leading-[20px] text-[#1C2B33]">
            Categories
          </label>
          <p className="text-[12px] leading-[16px] text-[#465A69]">
            Select the categories that best describe what this campaign will advertise.
          </p>
          <Dropdown
            trigger={
              <button className="w-full flex items-center justify-between px-3 py-2 bg-white border border-[#CBD2D9] rounded-[4px] text-left hover:border-[#1877F2] transition-colors">
                <span className="text-[14px] text-[rgba(28,43,51,0.65)]">Declare category if applicable</span>
                <Icon name="CaretDownSmall" variant="outlined" size={16} className="text-[#283943]" />
              </button>
            }
            width={400}
          >
            <Dropdown.List>
              <Dropdown.Item label="None" onClick={() => {}} />
              <Dropdown.Item label="Credit" onClick={() => {}} />
              <Dropdown.Item label="Employment" onClick={() => {}} />
              <Dropdown.Item label="Housing" onClick={() => {}} />
              <Dropdown.Item label="Social Issues, Elections or Politics" onClick={() => {}} />
            </Dropdown.List>
          </Dropdown>
        </div>
      </div>
    </CollapsibleCard>
  );
}

// ============================================
// Main Create Plan Modal Component
// ============================================
export function CreatePlanModal({ isOpen, onClose, onSuccess, onNavigate }: CreatePlanModalProps) {
  // Setup section state
  const [planName, setPlanName] = useState("New Plan");
  const [adAccount, setAdAccount] = useState("Chicken Company (12123123123123123123123)");
  const [facebookPage, setFacebookPage] = useState("Trash Type Foundry");
  const [instagramAccount, setInstagramAccount] = useState("Trash Type Foundry");

  // Campaign Details section state
  const [buyingType, setBuyingType] = useState<string | null>("reservation");
  const [goalType, setGoalType] = useState<string | null>("budget");
  const [budgetAmount, setBudgetAmount] = useState("50,000.00");
  const [reachValue, setReachValue] = useState("");
  const [performanceGoal, setPerformanceGoal] = useState("Maximize reach of ads");

  // Validation error states
  const [planNameError, setPlanNameError] = useState<string | null>(null);
  const [budgetError, setBudgetError] = useState<string | null>(null);

  // Refs for scrolling to errors
  const planNameRef = useRef<HTMLDivElement>(null);
  const budgetRef = useRef<HTMLDivElement>(null);

  // Schedule section state - Calculate defaults
  const getDefaultDates = () => {
    const now = new Date();
    const defaultStart = new Date(now);
    defaultStart.setMonth(defaultStart.getMonth() + 1);
    const defaultEnd = new Date(defaultStart);
    defaultEnd.setDate(defaultEnd.getDate() + 28);
    
    const formatDate = (date: Date) => {
      return `${MONTH_ABBR[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    };
    
    return {
      startDate: formatDate(defaultStart),
      endDate: formatDate(defaultEnd),
    };
  };
  
  const defaults = getDefaultDates();
  const [startDate, setStartDate] = useState(defaults.startDate);
  const [startTime, setStartTime] = useState("12:00 AM");
  const [endDate, setEndDate] = useState(defaults.endDate);
  const [endTime, setEndTime] = useState("11:59 AM");

  // Audience section state
  const [audienceTab, setAudienceTab] = useState<string>("create");
  const [ageMin, setAgeMin] = useState("18");
  const [ageMax, setAgeMax] = useState("65+");
  const [gender, setGender] = useState<string | null>("all");

  // Advanced section state
  const [frequencyType, setFrequencyType] = useState<string | null>("cap");
  const [frequencyCount, setFrequencyCount] = useState(2);
  const [frequencyDays, setFrequencyDays] = useState(7);

  // Placements section state
  const [placementType, setPlacementType] = useState<"advantage" | "manual">("manual");
  const [placementDevices, setPlacementDevices] = useState("all");
  const [placements, setPlacements] = useState<PlacementItem[]>(defaultPlacements);

  // Clear errors when user fixes the field
  useEffect(() => {
    if (planName.length > 0 && planNameError) {
      setPlanNameError(null);
    }
  }, [planName, planNameError]);

  useEffect(() => {
    if (budgetAmount.length > 0 && budgetError) {
      setBudgetError(null);
    }
  }, [budgetAmount, budgetError]);

  const handleBudgetFocus = () => {
    if (budgetError) setBudgetError(null);
  };

  // Validation function
  const validateForm = (): boolean => {
    const errors: { ref: React.RefObject<HTMLDivElement>; setError: (msg: string) => void; message: string }[] = [];

    if (!planName || planName.trim().length === 0) {
      errors.push({
        ref: planNameRef,
        setError: setPlanNameError,
        message: "Please enter a name"
      });
    }

    if (!budgetAmount || budgetAmount.trim().length === 0) {
      errors.push({
        ref: budgetRef,
        setError: setBudgetError,
        message: "Please enter your budget"
      });
    }

    if (errors.length > 0) {
      errors.forEach(({ setError, message }) => setError(message));
      
      const firstError = errors[0];
      if (firstError.ref.current) {
        firstError.ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => {
          const input = firstError.ref.current?.querySelector("input");
          input?.focus();
        }, 300);
      }
      
      return false;
    }

    return true;
  };

  // Handle Create Plan click
  const handleCreatePlan = () => {
    const isValid = validateForm();
    if (isValid) {
      // Generate ID here so we can navigate to it
      const newPlanId = String(Date.now());
      
      const planData = {
        id: newPlanId,
        name: planName,
        facebookPage,
        instagramAccount,
        buyingType,
        budget: budgetAmount,
        schedule: { startDate, startTime, endDate, endTime },
        audience: { audienceTab, ageMin, ageMax, gender },
        frequency: { frequencyType, frequencyCount, frequencyDays },
      };
      
      onSuccess?.(planData);
      onClose();
      
      // Navigate to the new plan's detail page
      onNavigate?.(newPlanId);
    }
  };

  // Handle Escape key and backdrop
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
      // Reset to defaults when opening
      setPlanName("New Plan");
      setAdAccount("Chicken Company (12123123123123123123123)");
      setFacebookPage("Trash Type Foundry");
      setInstagramAccount("Trash Type Foundry");
      setBuyingType("reservation");
      setGoalType("budget");
      setBudgetAmount("50,000.00");
      setReachValue("");
      setPerformanceGoal("Maximize reach of ads");
      setPlanNameError(null);
      setBudgetError(null);
      const newDefaults = getDefaultDates();
      setStartDate(newDefaults.startDate);
      setEndDate(newDefaults.endDate);
      setStartTime("12:00 AM");
      setEndTime("11:59 AM");
      setAudienceTab("create");
      setAgeMin("18");
      setAgeMax("65+");
      setGender("all");
      setFrequencyType("cap");
      setFrequencyCount(2);
      setFrequencyDays(7);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-hidden="true"
    >
      <div
        role="dialog"
        aria-modal="true"
        className="bg-white rounded-[8px] shadow-[0px_8px_24px_4px_rgba(0,0,0,0.1),0px_2px_2px_0px_rgba(0,0,0,0.1)] w-[680px] max-w-[calc(100vw-80px)] max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-[#CBD2D9] shrink-0">
          <h2 className="text-[20px] font-bold leading-[24px] text-[#1C2B33] font-optimistic">
            Create Plan
          </h2>
          <button 
            className="p-2 hover:bg-[rgba(0,0,0,0.05)] rounded-[4px] transition-colors"
            onClick={onClose}
          >
            <Icon name="Close" variant="outlined" size={16} className="text-[#283943]" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 space-y-4 overflow-y-auto bg-[#F5F7F8] flex-1">
          <SetupSection
            planName={planName}
            onPlanNameChange={setPlanName}
            planNameError={planNameError}
            planNameRef={planNameRef}
            adAccount={adAccount}
            onAdAccountChange={setAdAccount}
            facebookPage={facebookPage}
            onFacebookPageChange={setFacebookPage}
            instagramAccount={instagramAccount}
            onInstagramAccountChange={setInstagramAccount}
          />

          <CampaignDetailsSection
            buyingType={buyingType}
            onBuyingTypeChange={setBuyingType}
            goalType={goalType}
            onGoalTypeChange={setGoalType}
            budgetAmount={budgetAmount}
            onBudgetAmountChange={setBudgetAmount}
            reachValue={reachValue}
            onReachValueChange={setReachValue}
            performanceGoal={performanceGoal}
            onPerformanceGoalChange={setPerformanceGoal}
            budgetError={budgetError}
            budgetRef={budgetRef}
            onBudgetFocus={handleBudgetFocus}
            autoFocusBudget={true}
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

          <PlacementsSection
            placementType={placementType}
            onPlacementTypeChange={setPlacementType}
            devices={placementDevices}
            onDevicesChange={setPlacementDevices}
            placements={placements}
            onPlacementsChange={setPlacements}
          />

          <SpecialAdCategoriesSection />
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-2 px-4 py-4 border-t border-[#CBD2D9] bg-white shrink-0">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleCreatePlan}>Create Plan</Button>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ============================================
// Export a Preview version for the Modal Gallery
// (Renders without portal/overlay for display purposes)
// ============================================
export function CreatePlanModalPreview() {
  // Setup section state
  const [planName, setPlanName] = useState("New Plan");
  const [adAccount, setAdAccount] = useState("Chicken Company (12123123123123123123123)");
  const [facebookPage, setFacebookPage] = useState("Trash Type Foundry");
  const [instagramAccount, setInstagramAccount] = useState("Trash Type Foundry");

  // Campaign Details section state
  const [buyingType, setBuyingType] = useState<string | null>("reservation");
  const [goalType, setGoalType] = useState<string | null>("budget");
  const [budgetAmount, setBudgetAmount] = useState("50,000.00");
  const [reachValue, setReachValue] = useState("");
  const [performanceGoal, setPerformanceGoal] = useState("Maximize reach of ads");

  // Validation error states
  const [planNameError, setPlanNameError] = useState<string | null>(null);
  const [budgetError, setBudgetError] = useState<string | null>(null);

  // Refs for scrolling to errors
  const planNameRef = useRef<HTMLDivElement>(null);
  const budgetRef = useRef<HTMLDivElement>(null);

  // Schedule section state
  const getDefaultDates = () => {
    const now = new Date();
    const defaultStart = new Date(now);
    defaultStart.setMonth(defaultStart.getMonth() + 1);
    const defaultEnd = new Date(defaultStart);
    defaultEnd.setDate(defaultEnd.getDate() + 28);
    
    const formatDate = (date: Date) => {
      return `${MONTH_ABBR[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    };
    
    return {
      startDate: formatDate(defaultStart),
      endDate: formatDate(defaultEnd),
    };
  };
  
  const defaults = getDefaultDates();
  const [startDate, setStartDate] = useState(defaults.startDate);
  const [startTime, setStartTime] = useState("12:00 AM");
  const [endDate, setEndDate] = useState(defaults.endDate);
  const [endTime, setEndTime] = useState("11:59 AM");

  // Audience section state
  const [audienceTab, setAudienceTab] = useState<string>("create");
  const [ageMin, setAgeMin] = useState("18");
  const [ageMax, setAgeMax] = useState("65+");
  const [gender, setGender] = useState<string | null>("all");

  // Advanced section state
  const [frequencyType, setFrequencyType] = useState<string | null>("cap");
  const [frequencyCount, setFrequencyCount] = useState(2);
  const [frequencyDays, setFrequencyDays] = useState(7);

  // Placements section state
  const [placementType, setPlacementType] = useState<"advantage" | "manual">("manual");
  const [placementDevices, setPlacementDevices] = useState("all");
  const [placements, setPlacements] = useState<PlacementItem[]>(defaultPlacements);

  // Clear errors when user fixes the field
  useEffect(() => {
    if (planName.length > 0 && planNameError) {
      setPlanNameError(null);
    }
  }, [planName, planNameError]);

  useEffect(() => {
    if (budgetAmount.length > 0 && budgetError) {
      setBudgetError(null);
    }
  }, [budgetAmount, budgetError]);

  const handleBudgetFocus = () => {
    if (budgetError) setBudgetError(null);
  };

  // Validation function
  const validateForm = (): boolean => {
    const errors: { ref: React.RefObject<HTMLDivElement>; setError: (msg: string) => void; message: string }[] = [];

    if (!planName || planName.trim().length === 0) {
      errors.push({
        ref: planNameRef,
        setError: setPlanNameError,
        message: "Please enter a name"
      });
    }

    if (!budgetAmount || budgetAmount.trim().length === 0) {
      errors.push({
        ref: budgetRef,
        setError: setBudgetError,
        message: "Please enter your budget"
      });
    }

    if (errors.length > 0) {
      errors.forEach(({ setError, message }) => setError(message));
      
      const firstError = errors[0];
      if (firstError.ref.current) {
        firstError.ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => {
          const input = firstError.ref.current?.querySelector("input");
          input?.focus();
        }, 300);
      }
      
      return false;
    }

    return true;
  };

  const handleCreatePlan = () => {
    const isValid = validateForm();
    if (isValid) {
      console.log("Form is valid! Creating plan...");
    }
  };

  return (
    <div className="bg-white rounded-tl-[8px] rounded-tr-[8px] shadow-[0px_8px_24px_4px_rgba(0,0,0,0.1),0px_2px_2px_0px_rgba(0,0,0,0.1)] w-[680px] overflow-hidden">
      {/* Modal Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-[#CBD2D9]">
        <h2 className="text-[20px] font-bold leading-[24px] text-[#1C2B33] font-optimistic">
          Create Plan
        </h2>
        <button className="p-2 hover:bg-[rgba(0,0,0,0.05)] rounded-[4px] transition-colors">
          <Icon name="Close" variant="outlined" size={16} className="text-[#283943]" />
        </button>
      </div>

      {/* Modal Body */}
      <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto bg-[#F5F7F8]">
        <SetupSection
          planName={planName}
          onPlanNameChange={setPlanName}
          planNameError={planNameError}
          planNameRef={planNameRef}
          adAccount={adAccount}
          onAdAccountChange={setAdAccount}
          facebookPage={facebookPage}
          onFacebookPageChange={setFacebookPage}
          instagramAccount={instagramAccount}
          onInstagramAccountChange={setInstagramAccount}
        />

        <CampaignDetailsSection
          buyingType={buyingType}
          onBuyingTypeChange={setBuyingType}
          goalType={goalType}
          onGoalTypeChange={setGoalType}
          budgetAmount={budgetAmount}
          onBudgetAmountChange={setBudgetAmount}
          reachValue={reachValue}
          onReachValueChange={setReachValue}
          performanceGoal={performanceGoal}
          onPerformanceGoalChange={setPerformanceGoal}
          budgetError={budgetError}
          budgetRef={budgetRef}
          onBudgetFocus={handleBudgetFocus}
          autoFocusBudget={true}
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

        <PlacementsSection
          placementType={placementType}
          onPlacementTypeChange={setPlacementType}
          devices={placementDevices}
          onDevicesChange={setPlacementDevices}
          placements={placements}
          onPlacementsChange={setPlacements}
        />

        <SpecialAdCategoriesSection />
      </div>

      {/* Modal Footer */}
      <div className="flex items-center justify-end gap-2 px-4 py-4 border-t border-[#CBD2D9] bg-white">
        <Button variant="secondary">Cancel</Button>
        <Button variant="primary" onClick={handleCreatePlan}>Create Plan</Button>
      </div>
    </div>
  );
}

