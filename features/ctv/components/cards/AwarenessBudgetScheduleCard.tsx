"use client";

import { useState } from "react";
import { DateTimeField } from "@/features/ctv/components/ui/DatePicker";
import type { PrototypeVersion } from "./types";

type BudgetType = "daily" | "lifetime";

interface AwarenessBudgetScheduleCardProps {
  version: PrototypeVersion;
  className?: string;
  // Props from L3 Advantage+ Campaign Budget card
  isAdvantageBudgetOn?: boolean;
  budgetType?: BudgetType;
  budgetValue?: string;
  // Callbacks for when Advantage+ is OFF (L2 can control its own budget)
  onBudgetTypeChange?: (type: BudgetType) => void;
  onBudgetValueChange?: (value: string) => void;
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path 
        fillRule="evenodd" 
        clipRule="evenodd" 
        d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM11.7071 6.70711C12.0976 6.31658 12.0976 5.68342 11.7071 5.29289C11.3166 4.90237 10.6834 4.90237 10.2929 5.29289L7 8.58579L5.70711 7.29289C5.31658 6.90237 4.68342 6.90237 4.29289 7.29289C3.90237 7.68342 3.90237 8.31658 4.29289 8.70711L6.29289 10.7071C6.68342 11.0976 7.31658 11.0976 7.70711 10.7071L11.7071 6.70711Z" 
        fill="#006B4E"
      />
    </svg>
  );
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path 
        fillRule="evenodd" 
        clipRule="evenodd" 
        d="M6 12C9.31371 12 12 9.31371 12 6C12 2.68629 9.31371 0 6 0C2.68629 0 0 2.68629 0 6C0 9.31371 2.68629 12 6 12ZM6.75 3.75C6.75 4.16421 6.41421 4.5 6 4.5C5.58579 4.5 5.25 4.16421 5.25 3.75C5.25 3.33579 5.58579 3 6 3C6.41421 3 6.75 3.33579 6.75 3.75ZM5.25 5.25C5.25 5.66421 5.58579 6 6 6C6.41421 6 6.75 6.33579 6.75 6.75V8.25C6.75 8.66421 6.41421 9 6 9C5.58579 9 5.25 8.66421 5.25 8.25V6.75C5.25 6.33579 5.58579 6 6 6C5.58579 6 5.25 5.66421 5.25 5.25Z" 
        fill="#283943"
      />
    </svg>
  );
}

function TriangleDownIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function TriangleUpIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M4 10L8 6L12 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M3 8L6.5 11.5L13 5" stroke="#0A78BE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// Parse budget value to get numeric amount
function parseBudgetAmount(value: string): string {
  return value.replace(/[^0-9.]/g, '');
}

export function AwarenessBudgetScheduleCard({ 
  version, 
  className = "",
  isAdvantageBudgetOn = true,
  budgetType: controlledBudgetType,
  budgetValue: controlledBudgetValue,
  onBudgetTypeChange,
  onBudgetValueChange,
}: AwarenessBudgetScheduleCardProps) {
  const [showSettings, setShowSettings] = useState(true);
  const [hasEndDate, setHasEndDate] = useState(false);
  const [showBudgetTypeDropdown, setShowBudgetTypeDropdown] = useState(false);
  
  // Local state for Advantage+ OFF mode (defaults: Daily $5.00, Lifetime $350.00)
  const [localBudgetType, setLocalBudgetType] = useState<BudgetType>("daily");
  const [localBudgetValue, setLocalBudgetValue] = useState("$5.00");
  
  // When Advantage+ is ON, use controlled props from L3
  // When Advantage+ is OFF, use local state with defaults
  const budgetType = isAdvantageBudgetOn 
    ? (controlledBudgetType || "lifetime") 
    : localBudgetType;
  const budgetValue = isAdvantageBudgetOn 
    ? (controlledBudgetValue || "$350.00") 
    : localBudgetValue;
  
  // Initialize with current date/time for start
  const now = new Date();
  const [startDate, setStartDate] = useState<Date | null>(now);
  const startHours = now.getHours();
  const startMinutes = now.getMinutes();
  
  // End date - for Advantage+ OFF, calculate 30 days from start
  const endDateDefault = new Date(now);
  endDateDefault.setDate(endDateDefault.getDate() + 30);
  const [endDate, setEndDate] = useState<Date | null>(endDateDefault);
  const endHours = 23;
  const endMinutes = 59;

  // Handle budget type change (for Advantage+ OFF)
  const handleBudgetTypeChange = (newType: BudgetType) => {
    setLocalBudgetType(newType);
    // Set default values based on type
    if (newType === "daily") {
      setLocalBudgetValue("$5.00");
    } else {
      setLocalBudgetValue("$350.00");
    }
    setShowBudgetTypeDropdown(false);
    onBudgetTypeChange?.(newType);
  };

  if (version !== "alpha-v1") {
    return null;
  }

  const budgetAmount = parseBudgetAmount(budgetValue);

  // Advantage+ Budget ON - Simplified view
  if (isAdvantageBudgetOn) {
    const budgetTypeLabel = budgetType === "daily" ? "daily" : "lifetime";
    
    return (
      <div className={`bg-white rounded-[4px] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.1),0px_0px_4px_0px_rgba(0,0,0,0.1)] px-2 py-4 w-[600px] flex flex-col gap-3 ${className}`}>
        {/* Header */}
        <div className="flex items-center gap-2 px-2">
          <CheckCircleIcon />
          <span className="font-optimistic font-bold text-[16px] leading-[20px] text-[#1C2B33]">
            Budget &amp; schedule
          </span>
        </div>

        {/* Budget section - read-only summary */}
        <div className="flex flex-col gap-1 px-2">
          <div className="flex items-center gap-1">
            <span className="font-optimistic font-bold text-[14px] leading-[20px] text-[#1C2B33]">Budget</span>
            <InfoIcon />
          </div>
          <p className="text-[14px] leading-[20px] text-[#1C2B33]">
            You set a {budgetTypeLabel} Advantage+ campaign budget of ${budgetAmount}.
          </p>
        </div>

        {/* Ad set spending limits */}
        <div className="flex flex-col gap-1 px-2">
          <div className="flex items-center gap-1">
            <span className="font-optimistic font-bold text-[14px] leading-[20px] text-[#1C2B33]">Ad set spending limits</span>
            <InfoIcon />
          </div>
          <p className="text-[14px] leading-[20px] text-[#1C2B33]">None added</p>
        </div>

        {/* Schedule section */}
        <div className="flex flex-col gap-1 px-2">
          <span className="font-optimistic font-bold text-[14px] leading-[20px] text-[#1C2B33]">Schedule</span>
        </div>

        {/* Start date */}
        <div className="flex flex-col gap-1 px-2">
          <span className="font-optimistic font-bold text-[14px] leading-[20px] text-[#1C2B33]">Start date</span>
          <DateTimeField
            date={startDate}
            hours={startHours}
            minutes={startMinutes}
            onDateChange={setStartDate}
          />
        </div>

        {/* End date */}
        <div className="flex flex-col gap-1 px-2">
          <span className="font-optimistic font-bold text-[14px] leading-[20px] text-[#1C2B33]">End date</span>
          <div 
            className="flex items-center gap-2 py-1 cursor-pointer"
            onClick={() => setHasEndDate(!hasEndDate)}
          >
            <div className={`w-6 h-6 rounded border flex items-center justify-center ${hasEndDate ? "border-[#0A78BE] bg-white" : "border-[#CBD2D9] bg-white"}`}>
              {hasEndDate && <CheckIcon />}
            </div>
            <span className="text-[14px] leading-[20px] text-[#1C2B33]">Set an end date</span>
          </div>
        </div>

        {hasEndDate && (
          <div className="px-2">
            <DateTimeField
              date={endDate}
              hours={endHours}
              minutes={endMinutes}
              onDateChange={setEndDate}
              minDate={startDate || undefined}
              placeholder={true}
            />
          </div>
        )}

        {/* Divider */}
        <div className="h-px bg-[#CBD2D9] mx-2" />

        {/* Hide/Show options toggle */}
        <button
          className="flex items-center gap-1 text-[#0A78BE] font-optimistic font-medium text-[14px] leading-[20px] hover:underline w-fit px-2"
          onClick={() => setShowSettings(!showSettings)}
        >
          <span>{showSettings ? "Hide options" : "Show more options"}</span>
          {showSettings ? <TriangleUpIcon className="text-[#0A78BE]" /> : <TriangleDownIcon className="text-[#0A78BE]" />}
        </button>

        {showSettings && (
          <div className="flex flex-col gap-1 px-2">
            <div className="flex items-center gap-1">
              <span className="font-optimistic font-bold text-[14px] leading-[20px] text-[#1C2B33]">Budget scheduling</span>
              <InfoIcon />
            </div>
            <span className="text-[14px] leading-[20px] text-[#0A78BE] cursor-pointer hover:underline">
              Add entries in campaign setup
            </span>
          </div>
        )}
      </div>
    );
  }

  // Advantage+ Budget OFF - Full editable view
  const getBudgetHelperText = () => {
    if (budgetType === "daily") {
      const dailyAmount = parseFloat(budgetAmount) || 5;
      const maxDaily = (dailyAmount * 1.75).toFixed(2);
      const maxWeekly = (dailyAmount * 7).toFixed(2);
      return (
        <>
          You&apos;ll spend an average of ${budgetAmount} per day. Your maximum daily spend is <span className="font-bold">${maxDaily}</span> and your maximum weekly spend is <span className="font-bold">${maxWeekly}</span>.
          <br />
          <span className="text-[#0A78BE] cursor-pointer hover:underline">About daily budget</span>
        </>
      );
    }
    return (
      <>
        You&apos;ll spend no more than ${budgetAmount} during the lifetime of your ad set.
        <br />
        <span className="text-[#0A78BE] cursor-pointer hover:underline">About lifetime budget</span>
      </>
    );
  };

  return (
    <div className={`bg-white rounded-[4px] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.1),0px_0px_4px_0px_rgba(0,0,0,0.1)] px-2 py-4 w-[600px] flex flex-col gap-3 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-2 px-2">
        <CheckCircleIcon />
        <span className="font-optimistic font-bold text-[16px] leading-[20px] text-[#1C2B33]">
          Budget &amp; schedule
        </span>
      </div>

      {/* Budget section - editable */}
      <div className="flex flex-col gap-2 px-2">
        <div className="flex items-center gap-1">
          <span className="font-optimistic font-bold text-[14px] leading-[20px] text-[#1C2B33]">Budget</span>
          <InfoIcon />
        </div>
        
        {/* Budget type dropdown + amount input */}
        <div className="flex items-stretch relative">
          <div 
            className="flex items-center justify-between px-3 py-2 bg-white border border-[#CBD2D9] rounded-l-[4px] w-[180px] cursor-pointer hover:bg-[#F5F6F7]"
            onClick={() => setShowBudgetTypeDropdown(!showBudgetTypeDropdown)}
          >
            <span className="text-[14px] leading-[20px] text-[#1C2B33]">
              {budgetType === "daily" ? "Daily budget" : "Lifetime budget"}
            </span>
            <TriangleDownIcon className="text-[#283943]" />
          </div>
          <div className="flex-1 flex items-center px-3 py-2 bg-white border border-l-0 border-[#CBD2D9] rounded-r-[4px]">
            <span className="flex-1 text-[14px] leading-[20px] text-[#1C2B33]">$ {budgetAmount}</span>
            <span className="text-[14px] leading-[20px] text-[rgba(28,43,51,0.65)]">USD</span>
          </div>
          
          {/* Budget type dropdown menu */}
          {showBudgetTypeDropdown && (
            <div className="absolute top-full left-0 mt-1 w-[182px] bg-white rounded-[4px] shadow-[0px_2px_12px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] p-1 z-10">
              <div 
                className="flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-[#F1F4F7] rounded"
                onClick={() => handleBudgetTypeChange("daily")}
              >
                <div className="w-6 h-6 rounded-full border border-[#CBD2D9] bg-white flex items-center justify-center">
                  {budgetType === "daily" && <div className="w-3 h-3 rounded-full bg-[#0A78BE]" />}
                </div>
                <span className="text-[14px] leading-[20px] text-[#1C2B33]">Daily budget</span>
              </div>
              <div 
                className="flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-[#F1F4F7] rounded"
                onClick={() => handleBudgetTypeChange("lifetime")}
              >
                <div className="w-6 h-6 rounded-full border border-[#CBD2D9] bg-white flex items-center justify-center">
                  {budgetType === "lifetime" && <div className="w-3 h-3 rounded-full bg-[#0A78BE]" />}
                </div>
                <span className="text-[14px] leading-[20px] text-[#1C2B33]">Lifetime budget</span>
              </div>
            </div>
          )}
        </div>
        
        <p className="text-[12px] leading-[16px] text-[#1C2B33]">{getBudgetHelperText()}</p>
      </div>

      {/* Schedule section */}
      <div className="flex flex-col gap-1 px-2">
        <span className="font-optimistic font-bold text-[14px] leading-[20px] text-[#1C2B33]">Schedule</span>
      </div>

      {/* Start date */}
      <div className="flex flex-col gap-1 px-2">
        <span className="font-optimistic font-bold text-[14px] leading-[20px] text-[#1C2B33]">Start date</span>
        <DateTimeField
          date={startDate}
          hours={startHours}
          minutes={startMinutes}
          onDateChange={setStartDate}
        />
      </div>

      {/* End date - with checkbox */}
      <div className="flex flex-col gap-2 px-2">
        <span className="font-optimistic font-bold text-[14px] leading-[20px] text-[#1C2B33]">End date</span>
        
        {/* Checkbox */}
        <div 
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setHasEndDate(!hasEndDate)}
        >
          <div className={`w-6 h-6 rounded border flex items-center justify-center ${hasEndDate ? "border-[#0A78BE] bg-white" : "border-[#CBD2D9] bg-white"}`}>
            {hasEndDate && <CheckIcon />}
          </div>
          <span className="text-[14px] leading-[20px] text-[#1C2B33]">Set an end date</span>
        </div>
        
        {/* Duration dropdown + date/time (only when checkbox is checked) */}
        {hasEndDate && (
          <div className="flex items-stretch gap-2">
            <div className="flex items-center justify-between px-3 py-2 bg-white border border-[#CBD2D9] rounded-[4px] w-[120px] cursor-pointer">
              <span className="text-[14px] leading-[20px] text-[#1C2B33]">Custom</span>
              <TriangleDownIcon className="text-[#283943]" />
            </div>
            <div className="flex-1">
              <DateTimeField
                date={endDate}
                hours={startHours}
                minutes={startMinutes}
                onDateChange={setEndDate}
                minDate={startDate || undefined}
              />
            </div>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="h-px bg-[#CBD2D9] mx-2" />

      {/* Hide/Show options toggle */}
      <button
        className="flex items-center gap-1 text-[#0A78BE] font-optimistic font-medium text-[14px] leading-[20px] hover:underline w-fit px-2"
        onClick={() => setShowSettings(!showSettings)}
      >
        <span>{showSettings ? "Hide options" : "Show more options"}</span>
        {showSettings ? <TriangleUpIcon className="text-[#0A78BE]" /> : <TriangleDownIcon className="text-[#0A78BE]" />}
      </button>

      {/* Expanded Settings */}
      {showSettings && (
        <>
          {/* Budget scheduling */}
          <div className="flex flex-col gap-2 px-2">
            <div className="flex items-center gap-1">
              <span className="font-optimistic font-bold text-[14px] leading-[20px] text-[#1C2B33]">Budget scheduling</span>
              <InfoIcon />
            </div>
            <p className="text-[14px] leading-[20px] text-[#1C2B33]">
              Increase your budget during specific days or times.
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded border border-[#CBD2D9] bg-white" />
                <span className="text-[14px] leading-[20px] text-[rgba(28,43,51,0.6)]">Schedule budget increases</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 border border-[rgba(167,179,191,0.6)] rounded bg-white cursor-pointer">
                <span className="text-[14px] leading-[20px] text-[rgba(28,43,51,0.6)]">View</span>
                <TriangleDownIcon className="text-[rgba(40,57,67,0.6)]" />
              </div>
            </div>
          </div>

          {/* Ad scheduling */}
          <div className="flex flex-col gap-1 px-2">
            <div className="flex items-center gap-1">
              <span className="font-optimistic font-bold text-[14px] leading-[20px] text-[#1C2B33]">Ad scheduling</span>
              <InfoIcon />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded border border-[#CBD2D9] bg-white" />
              <span className="text-[14px] leading-[20px] text-[#1C2B33]">Run ads on a schedule</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
