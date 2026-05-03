"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "./Button";
import { Icon } from "./Icon";
import { cn, interactiveField } from "@/features/campaign-planner/lib/utils";

// ============================================
// Edit Schedule Modal Props
// ============================================
interface EditScheduleModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when modal should close */
  onClose: () => void;
  /** Initial schedule values */
  initialSchedule?: {
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
  };
  /** Callback when schedule is saved - receives updated schedule data */
  onSave?: (schedule: {
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
  }) => void;
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

function isEndAfterStart(endDateStr: string, endTimeStr: string, startDateStr: string, startTimeStr: string): boolean {
  const endDateTime = combineDateAndTime(endDateStr, endTimeStr);
  const startDateTime = combineDateAndTime(startDateStr, startTimeStr);
  if (!endDateTime || !startDateTime) return true;
  return endDateTime > startDateTime;
}

// ============================================
// Get Default Dates
// ============================================
function getDefaultDates() {
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
    startTime: "12:00 AM",
    endTime: "11:59 AM",
  };
}

// ============================================
// Main Edit Schedule Modal Component
// ============================================
export function EditScheduleModal({ 
  isOpen, 
  onClose, 
  initialSchedule,
  onSave 
}: EditScheduleModalProps) {
  const defaults = initialSchedule || getDefaultDates();
  
  const [startDate, setStartDate] = useState(defaults.startDate);
  const [startTime, setStartTime] = useState(defaults.startTime);
  const [endDate, setEndDate] = useState(defaults.endDate);
  const [endTime, setEndTime] = useState(defaults.endTime);
  
  // Error states
  const [startDateError, setStartDateError] = useState<string | null>(null);
  const [endDateError, setEndDateError] = useState<string | null>(null);

  // Validation functions
  const validateStartDate = (date: string, time: string) => {
    if (!date || !time) {
      setStartDateError(null);
      return true;
    }
    if (!isInFuture(date, time)) {
      setStartDateError("Start date must be in the future");
      return false;
    }
    setStartDateError(null);
    return true;
  };

  const validateEndDate = (endDateStr: string, endTimeStr: string, startDateStr: string, startTimeStr: string) => {
    if (!endDateStr || !endTimeStr) {
      setEndDateError(null);
      return true;
    }
    if (!isInFuture(endDateStr, endTimeStr)) {
      setEndDateError("End date must be in the future");
      return false;
    }
    if (!isEndAfterStart(endDateStr, endTimeStr, startDateStr, startTimeStr)) {
      setEndDateError("End date must be after the start date");
      return false;
    }
    setEndDateError(null);
    return true;
  };

  // Handlers
  const handleStartDateChange = (value: string) => {
    setStartDate(value);
    validateStartDate(value, startTime);
    validateEndDate(endDate, endTime, value, startTime);
  };

  const handleStartTimeChange = (value: string) => {
    setStartTime(value);
    validateStartDate(startDate, value);
    validateEndDate(endDate, endTime, startDate, value);
  };

  const handleEndDateChange = (value: string) => {
    setEndDate(value);
    validateEndDate(value, endTime, startDate, startTime);
  };

  const handleEndTimeChange = (value: string) => {
    setEndTime(value);
    validateEndDate(endDate, value, startDate, startTime);
  };

  const handleSave = () => {
    const isStartValid = validateStartDate(startDate, startTime);
    const isEndValid = validateEndDate(endDate, endTime, startDate, startTime);
    
    if (isStartValid && isEndValid) {
      onSave?.({ startDate, startTime, endDate, endTime });
      onClose();
    }
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
    if (isOpen && initialSchedule) {
      setStartDate(initialSchedule.startDate);
      setStartTime(initialSchedule.startTime);
      setEndDate(initialSchedule.endDate);
      setEndTime(initialSchedule.endTime);
      setStartDateError(null);
      setEndDateError(null);
    }
  }, [isOpen, initialSchedule]);

  if (!isOpen) return null;

  const errorContainerClass = "border-[#D3212C] focus-within:border-[#D3212C] focus-within:ring-[#D3212C]";

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-hidden="true"
    >
      <div
        role="dialog"
        aria-modal="true"
        className="bg-white rounded-[8px] shadow-[0px_8px_24px_4px_rgba(0,0,0,0.1),0px_2px_2px_0px_rgba(0,0,0,0.1)] w-[480px] max-w-[calc(100vw-80px)] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pl-4 pr-2 py-0 bg-white shrink-0">
          <div className="flex-1 flex flex-col justify-center py-4 pr-2 min-w-0">
            <h2 className="text-[20px] font-bold leading-[24px] text-[#1C2B33] font-optimistic">
              Edit schedule
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
        <div className="p-4 space-y-2">
          {/* Start Date */}
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
                <TimeInput value={startTime} onChange={handleStartTimeChange} />
                <span className="text-[14px] text-[rgba(28,43,51,0.6)] ml-auto">PST</span>
              </div>
            </div>
            {startDateError && (
              <p className="text-[12px] font-normal leading-[16px] mt-1 text-[#D3212C]">
                {startDateError}
              </p>
            )}
          </div>

          {/* End Date */}
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
                <TimeInput value={endTime} onChange={handleEndTimeChange} />
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

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-2 px-4 pt-3 pb-4 bg-white shrink-0">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>Save</Button>
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
export function EditScheduleModalPreview() {
  const defaults = getDefaultDates();
  
  const [startDate, setStartDate] = useState(defaults.startDate);
  const [startTime, setStartTime] = useState(defaults.startTime);
  const [endDate, setEndDate] = useState(defaults.endDate);
  const [endTime, setEndTime] = useState(defaults.endTime);
  
  // Error states
  const [startDateError, setStartDateError] = useState<string | null>(null);
  const [endDateError, setEndDateError] = useState<string | null>(null);

  // Validation functions
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

  // Handlers
  const handleStartDateChange = (value: string) => {
    setStartDate(value);
    validateStartDate(value, startTime);
    validateEndDate(endDate, endTime, value, startTime);
  };

  const handleStartTimeChange = (value: string) => {
    setStartTime(value);
    validateStartDate(startDate, value);
    validateEndDate(endDate, endTime, startDate, value);
  };

  const handleEndDateChange = (value: string) => {
    setEndDate(value);
    validateEndDate(value, endTime, startDate, startTime);
  };

  const handleEndTimeChange = (value: string) => {
    setEndTime(value);
    validateEndDate(endDate, value, startDate, startTime);
  };

  const errorContainerClass = "border-[#D3212C] focus-within:border-[#D3212C] focus-within:ring-[#D3212C]";

  return (
    <div className="bg-white rounded-[8px] shadow-[0px_8px_24px_4px_rgba(0,0,0,0.1),0px_2px_2px_0px_rgba(0,0,0,0.1)] w-[480px] overflow-hidden">
      {/* Modal Header */}
      <div className="flex items-center justify-between pl-4 pr-2 py-0 bg-white shrink-0">
        <div className="flex-1 flex flex-col justify-center py-4 pr-2 min-w-0">
          <h2 className="text-[20px] font-bold leading-[24px] text-[#1C2B33] font-optimistic">
            Edit schedule
          </h2>
        </div>
        <div className="flex items-start py-2">
          <button className="p-3 hover:bg-[rgba(0,0,0,0.05)] rounded-[4px] transition-colors">
            <Icon name="Close" variant="outlined" size={16} className="text-[#283943]" />
          </button>
        </div>
      </div>

      {/* Modal Body */}
      <div className="p-4 space-y-2">
        {/* Start Date */}
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
              <TimeInput value={startTime} onChange={handleStartTimeChange} />
              <span className="text-[14px] text-[rgba(28,43,51,0.6)] ml-auto">PST</span>
            </div>
          </div>
          {startDateError && (
            <p className="text-[12px] font-normal leading-[16px] mt-1 text-[#D3212C]">
              {startDateError}
            </p>
          )}
        </div>

        {/* End Date */}
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
              <TimeInput value={endTime} onChange={handleEndTimeChange} />
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

      {/* Modal Footer */}
      <div className="flex items-center justify-end gap-2 px-4 pt-3 pb-4 bg-white shrink-0">
        <Button variant="secondary">Cancel</Button>
        <Button variant="primary">Save</Button>
      </div>
    </div>
  );
}

