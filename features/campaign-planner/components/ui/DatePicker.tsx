"use client";

import { useState, useRef, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import { format, parse, isValid } from "date-fns";
import { cn, interactiveField, getTriggerStyles } from "@/features/campaign-planner/lib/utils";
import { Icon } from "@/features/campaign-planner/components/ui/Icon";

// ============================================
// DatePicker Component
// ============================================

interface DatePickerProps {
  /** Selected date */
  value?: Date;
  /** Callback when date changes */
  onChange?: (date: Date | undefined) => void;
  /** Placeholder text when no date selected */
  placeholder?: string;
  /** Minimum selectable date */
  minDate?: Date;
  /** Maximum selectable date */
  maxDate?: Date;
  /** Additional className for the trigger */
  className?: string;
  /** Disabled state */
  disabled?: boolean;
}

// Display format: "Jan 1, 2026"
const DISPLAY_FORMAT = "MMM d, yyyy";
// Edit format: "M/D/YYYY" or "1/8/2026"
const EDIT_FORMAT = "M/d/yyyy";

export function DatePicker({
  value,
  onChange,
  placeholder = "Select date",
  minDate,
  maxDate,
  className,
  disabled = false,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync input value with selected date
  useEffect(() => {
    if (value && isValid(value)) {
      setInputValue(isEditing ? format(value, EDIT_FORMAT) : format(value, DISPLAY_FORMAT));
    } else {
      setInputValue("");
    }
  }, [value, isEditing]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsEditing(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle input focus - switch to edit format
  const handleInputFocus = () => {
    setIsEditing(true);
    setIsOpen(true);
    if (value && isValid(value)) {
      setInputValue(format(value, EDIT_FORMAT));
    }
  };

  // Handle input blur - validate and switch to display format
  const handleInputBlur = () => {
    // Don't blur if clicking inside the calendar
    setTimeout(() => {
      if (!containerRef.current?.contains(document.activeElement)) {
        setIsEditing(false);
        if (value && isValid(value)) {
          setInputValue(format(value, DISPLAY_FORMAT));
        }
      }
    }, 100);
  };

  // Handle typing in the input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // Try to parse the date
    const parsedDate = parse(newValue, EDIT_FORMAT, new Date());
    if (isValid(parsedDate)) {
      // Check min/max constraints
      if (minDate && parsedDate < minDate) return;
      if (maxDate && parsedDate > maxDate) return;
      onChange?.(parsedDate);
    }
  };

  // Handle calendar date selection
  const handleDaySelect = (date: Date | undefined) => {
    onChange?.(date);
    if (date) {
      setInputValue(format(date, isEditing ? EDIT_FORMAT : DISPLAY_FORMAT));
    }
    setIsOpen(false);
    setIsEditing(false);
  };

  // Handle calendar icon click
  const handleCalendarClick = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
    if (!isOpen) {
      inputRef.current?.focus();
    }
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Input Field */}
      <div
        className={cn(
          "flex items-center gap-2 px-3 py-2 cursor-text",
          isOpen ? getTriggerStyles(true) : interactiveField.input,
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onClick={() => !disabled && inputRef.current?.focus()}
      >
        <button
          type="button"
          onClick={handleCalendarClick}
          disabled={disabled}
          className="shrink-0 text-[#283943] hover:text-[#1877F2] transition-colors"
        >
          <Icon name="Calendar" variant="outlined" size={16} />
        </button>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "flex-1 bg-transparent outline-none",
            "text-[14px] text-[#1C2B33]",
            "placeholder:text-[rgba(28,43,51,0.65)]",
            "placeholder:transition-opacity focus:placeholder:opacity-0"
          )}
        />
      </div>

      {/* Calendar Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 z-50 bg-white rounded-[8px] shadow-[0px_8px_24px_4px_rgba(0,0,0,0.1),0px_2px_2px_0px_rgba(0,0,0,0.1)] border border-[#CBD2D9]">
          <DayPicker
            mode="single"
            selected={value}
            onSelect={handleDaySelect}
            fromDate={minDate}
            toDate={maxDate}
            defaultMonth={value || new Date()}
            classNames={{
              root: "p-3",
              months: "flex flex-col",
              month: "space-y-4",
              caption: "flex justify-between items-center px-2",
              caption_label: "text-[15px] font-semibold text-[#1C2B33]",
              nav: "flex items-center gap-1",
              nav_button: cn(
                "h-8 w-8 flex items-center justify-center rounded-[4px]",
                "text-[#283943] hover:bg-[rgba(0,0,0,0.05)] transition-colors"
              ),
              nav_button_previous: "",
              nav_button_next: "",
              table: "w-full border-collapse",
              head_row: "flex",
              head_cell: cn(
                "w-10 h-10 flex items-center justify-center",
                "text-[12px] font-medium text-[#5C6970]"
              ),
              row: "flex w-full",
              cell: "w-10 h-10 text-center p-0",
              day: cn(
                "w-10 h-10 flex items-center justify-center rounded-[4px]",
                "text-[14px] text-[#1C2B33]",
                "hover:bg-[rgba(0,0,0,0.05)] transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-[#1877F2] focus:ring-offset-1"
              ),
              day_selected: cn(
                "bg-[#1877F2] text-white",
                "hover:bg-[#1877F2]"
              ),
              day_today: "font-bold text-[#1877F2]",
              day_outside: "text-[#CBD2D9]",
              day_disabled: "text-[#CBD2D9] cursor-not-allowed hover:bg-transparent",
            }}
            components={{
              Chevron: ({ orientation }) => (
                <Icon
                  name={orientation === "left" ? "CaretLeftSmall" : "CaretRightSmall"}
                  variant="filled"
                  size={16}
                />
              ),
            }}
          />
        </div>
      )}
    </div>
  );
}

export default DatePicker;

