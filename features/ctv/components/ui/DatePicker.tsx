"use client";

import { useState, useRef, useEffect } from "react";

// Helper constants
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Helper functions
function formatDateDisplay(date: Date | null): string {
  if (!date) return "mm/dd/yyyy";
  return `${MONTHS[date.getMonth()].slice(0, 3)} ${date.getDate()}, ${date.getFullYear()}`;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function isSameDay(date1: Date | null, date2: Date): boolean {
  if (!date1) return false;
  return date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate();
}

function isDateInPast(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);
  return compareDate < today;
}

// Icons
function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="2" y="3" width="12" height="11" rx="2" stroke="#283943" strokeWidth="1.5"/>
      <path d="M2 7H14" stroke="#283943" strokeWidth="1.5"/>
      <path d="M5 1V4" stroke="#283943" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M11 1V4" stroke="#283943" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="8" cy="8" r="6" stroke="#283943" strokeWidth="1.5"/>
      <path d="M8 5V8L10 10" stroke="#283943" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// DatePicker Component
export interface DatePickerProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  onClose: () => void;
  minDate?: Date;
  maxDate?: Date;
}

export function DatePicker({ selectedDate, onDateSelect, onClose, minDate, maxDate }: DatePickerProps) {
  const [viewMonth, setViewMonth] = useState(selectedDate?.getMonth() ?? new Date().getMonth());
  const [viewYear, setViewYear] = useState(selectedDate?.getFullYear() ?? new Date().getFullYear());
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const today = new Date();

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(viewYear, viewMonth, day);
    if (minDate && newDate < minDate) return;
    if (maxDate && newDate > maxDate) return;
    if (isDateInPast(newDate)) return;
    onDateSelect(newDate);
    onClose();
  };

  const isDateDisabled = (day: number): boolean => {
    const date = new Date(viewYear, viewMonth, day);
    if (isDateInPast(date)) return true;
    if (minDate) {
      const minDateOnly = new Date(minDate);
      minDateOnly.setHours(0, 0, 0, 0);
      if (date < minDateOnly) return true;
    }
    if (maxDate) {
      const maxDateOnly = new Date(maxDate);
      maxDateOnly.setHours(23, 59, 59, 999);
      if (date > maxDateOnly) return true;
    }
    return false;
  };

  return (
    <div 
      ref={pickerRef}
      className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-[0px_4px_16px_rgba(0,0,0,0.15)] border border-[#E4E6EB] z-50 p-3"
      style={{ width: "280px" }}
    >
      <div className="flex items-center justify-between mb-3">
        <button onClick={handlePrevMonth} className="p-1 hover:bg-[#F5F6F7] rounded">
          <ChevronLeftIcon className="text-[#1C2B33]" />
        </button>
        <span className="font-optimistic font-medium text-[14px] text-[#1C2B33]">
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button onClick={handleNextMonth} className="p-1 hover:bg-[#F5F6F7] rounded">
          <ChevronRightIcon className="text-[#1C2B33]" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAYS.map(day => (
          <div key={day} className="text-center text-[12px] text-[#65676B] py-1">{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} className="w-8 h-8" />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const date = new Date(viewYear, viewMonth, day);
          const isSelected = isSameDay(selectedDate, date);
          const isToday = isSameDay(today, date);
          const disabled = isDateDisabled(day);

          return (
            <button
              key={day}
              onClick={() => !disabled && handleDateClick(day)}
              disabled={disabled}
              className={`w-8 h-8 rounded text-[14px] flex items-center justify-center transition-colors
                ${isSelected ? "bg-[#0A78BE] text-white" : isToday ? "bg-[#E7F3FF] text-[#0A78BE]" : disabled ? "text-[#BCC0C4] cursor-not-allowed" : "text-[#1C2B33] hover:bg-[#F5F6F7]"}`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// DateTimeField Component
export interface DateTimeFieldProps {
  date: Date | null;
  hours: number;
  minutes: number;
  onDateChange: (date: Date) => void;
  onTimeChange?: (hours: number, minutes: number) => void;
  error?: string;
  minDate?: Date;
  maxDate?: Date;
  placeholder?: boolean;
  label?: string;
  showTimeZone?: boolean;
  timeZone?: string;
}

export function DateTimeField({ 
  date, 
  hours, 
  minutes, 
  onDateChange, 
  onTimeChange,
  error, 
  minDate,
  maxDate, 
  placeholder = false,
  label,
  showTimeZone = true,
  timeZone = "PDT"
}: DateTimeFieldProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes.toString().padStart(2, "0");

  const borderClass = error ? "border-[#E02020]" : showDatePicker ? "border-[#0A78BE]" : "border-[#CBD2D9]";

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <span className="font-optimistic font-bold text-[14px] leading-[20px] text-[#1C2B33]">{label}</span>
      )}
      <div className={`flex items-center border ${borderClass} rounded-[4px] bg-white overflow-visible relative h-[36px]`}>
        <div 
          className="flex items-center gap-2 flex-1 px-3 py-2 cursor-pointer hover:bg-[#F5F6F7] relative h-full"
          onClick={() => setShowDatePicker(!showDatePicker)}
        >
          <CalendarIcon />
          <span className={`text-[14px] leading-[20px] ${placeholder && !date ? "text-[#65676B]" : "text-[#1C2B33]"}`}>
            {placeholder && !date ? "mm/dd/yyyy" : formatDateDisplay(date)}
          </span>
          {showDatePicker && (
            <DatePicker
              selectedDate={date}
              onDateSelect={onDateChange}
              onClose={() => setShowDatePicker(false)}
              minDate={minDate}
              maxDate={maxDate}
            />
          )}
        </div>
        <div className="w-px h-[34px] bg-[#CBD2D9]" />
        <div className="flex items-center gap-2 flex-1 px-3 py-2 h-full">
          <ClockIcon />
          <span className="text-[14px] leading-[20px] text-[#1C2B33]">
            {`${displayHours}:${displayMinutes} ${period}`}
            {showTimeZone && (
              <>
                {"  "}
                <span className="text-[rgba(28,43,51,0.6)]">{timeZone}</span>
              </>
            )}
          </span>
        </div>
      </div>
      {error && <span className="text-[12px] leading-[16px] text-[#E02020]">{error}</span>}
    </div>
  );
}

// Export helper functions for use in other components
export { formatDateDisplay, isDateInPast, isSameDay };
