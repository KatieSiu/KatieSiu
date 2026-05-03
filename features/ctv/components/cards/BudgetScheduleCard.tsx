"use client";

import { useState } from "react";
import { Icon } from "@/features/ctv/components/ui/Icon";
import { FieldRow } from "@/features/ctv/components/ui/FieldRow";
import { DateTimeField } from "@/features/ctv/components/ui/DatePicker";
import type { PrototypeVersion } from "./types";

interface BudgetScheduleCardProps {
  version: PrototypeVersion;
  className?: string;
  isTVMode?: boolean;
  // L3 Budget card state
  isAdvantageBudgetOn?: boolean; // true = Campaign budget, false = Ad set budget
  budgetValue?: string; // Budget amount from L3 (e.g., "$20.00")
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

function TriangleDownIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M4 6L8 10L12 6H4Z" fill="#283943"/>
    </svg>
  );
}

function CheckboxIcon({ checked, className }: { checked: boolean; className?: string }) {
  if (checked) {
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect x="2" y="2" width="16" height="16" rx="2" fill="#0A78BE"/>
        <path d="M6 10L9 13L14 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="2.5" y="2.5" width="15" height="15" rx="1.5" stroke="#CBD2D9"/>
    </svg>
  );
}

function parseBudgetAmount(value: string): number {
  const num = parseFloat(value.replace(/[^0-9.]/g, ''));
  return isNaN(num) ? 20 : num;
}

export function BudgetScheduleCard({ 
  version, 
  className = "",
  isTVMode = false,
  isAdvantageBudgetOn = true,
  budgetValue = "$20.00",
}: BudgetScheduleCardProps) {
  const [showMoreSettings, setShowMoreSettings] = useState(true);
  const [hasEndDate, setHasEndDate] = useState(false);
  
  // Date state - default to Mar 30, 2026 at 9:28 AM to match screenshot
  const [startDate, setStartDate] = useState<Date | null>(new Date(2026, 2, 30, 9, 28));
  const [endDate, setEndDate] = useState<Date | null>(new Date(2026, 3, 30, 9, 28));

  if (version !== "before" && version !== "alpha-v1") {
    return null;
  }

  const isAlpha = version === "alpha-v1";
  const budgetAmount = parseBudgetAmount(budgetValue);
  const maxDailySpend = Math.round(budgetAmount * 1.75);
  const maxWeeklySpend = budgetAmount * 7;

  // Before version - show original simple card
  if (version === "before") {
    return (
      <div className={`bg-white rounded-[4px] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.1),0px_0px_4px_0px_rgba(0,0,0,0.1)] p-4 w-[600px] flex flex-col gap-4 ${className}`}>
        {/* Header */}
        <div className="flex items-center gap-2">
          <CheckCircleIcon />
          <span className="font-optimistic font-bold text-[16px] leading-[20px] text-[#1C2B33]">
            Budget & schedule
          </span>
        </div>
        
        {/* Budget section */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1">
            <span className="font-optimistic font-bold text-[15px] leading-[20px] text-[#1C2B33]">
              Budget
            </span>
            <Icon name="Info" variant="filled" size={12} className="text-[#283943]" />
          </div>

          <div className="flex items-end h-[36px]">
            <button className="h-[36px] px-3 bg-white border border-[#CBD2D9] rounded-l flex items-center gap-2 hover:bg-[#F5F7F8] transition-colors min-w-[180px]">
              <span className="font-sf-pro text-[14px] leading-[20px] text-[#1C2B33] flex-1 text-left">
                Daily budget
              </span>
              <TriangleDownIcon />
            </button>
            
            <div className="flex-1 h-[36px] px-3 bg-white border border-l-0 border-[#CBD2D9] rounded-r flex items-center justify-between">
              <span className="font-sf-pro text-[14px] leading-[20px] text-[#1C2B33]">
                $5.00
              </span>
              <span className="font-sf-pro text-[14px] leading-[20px] text-[rgba(28,43,51,0.65)]">
                USD
              </span>
            </div>
          </div>

          <p className="font-optimistic text-[12px] leading-[16px] text-[#1C2B33]">
            You&apos;ll spend an average of $5 per day. Your maximum daily spend is{" "}
            <span className="font-bold">$6.25</span> and your maximum weekly spend is{" "}
            <span className="font-bold">$35</span>.{" "}
            <span className="text-[#0A78BE] cursor-pointer hover:underline">Learn more</span>
          </p>
        </div>

        {/* Schedule section */}
        <div className="flex items-center gap-1">
          <span className="font-optimistic font-bold text-[15px] leading-[20px] text-[#1C2B33]">
            Schedule
          </span>
          <Icon name="Info" variant="filled" size={12} className="text-[#283943]" />
        </div>

        {/* Start Date */}
        <DateTimeField
          date={startDate}
          hours={startDate?.getHours() ?? 9}
          minutes={startDate?.getMinutes() ?? 28}
          onDateChange={setStartDate}
          label="Start Date"
        />

        {/* End date */}
        <div className="py-2">
          <div className="flex items-center gap-1">
            <span className="font-optimistic font-bold text-[14px] leading-[20px] text-[rgba(0,0,0,0.75)]">
              End date
            </span>
            <Icon name="Info" variant="filled" size={12} className="text-[#283943]" />
          </div>
          <span className="font-optimistic text-[14px] leading-[20px] text-[#465A69]">
            None
          </span>
        </div>

        {/* Show more settings link */}
        <button
          className="flex items-center gap-1 text-[#0A78BE] font-optimistic font-medium text-[14px] leading-[20px] hover:underline w-fit"
          onClick={() => setShowMoreSettings(!showMoreSettings)}
        >
          <span>{showMoreSettings ? "Hide settings" : "Show more settings"}</span>
          <Icon
            name={showMoreSettings ? "SmallTriangleUp" : "SmallTriangleDown"}
            variant="filled"
            size={16}
            className="text-[#0A78BE]"
          />
        </button>
      </div>
    );
  }

  // Alpha version - dynamic based on L3 Budget card selection
  // Campaign Budget (isAdvantageBudgetOn = true) vs Ad Set Budget (isAdvantageBudgetOn = false)
  
  if (isAdvantageBudgetOn) {
    // Campaign Budget selected on L3
    return (
      <div className={`bg-white rounded-[4px] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.1),0px_0px_4px_0px_rgba(0,0,0,0.1)] p-4 w-[600px] flex flex-col gap-4 ${className}`}>
        {/* Header */}
        <div className="flex items-center gap-2">
          <CheckCircleIcon />
          <span className="font-optimistic font-bold text-[16px] leading-[20px] text-[#1C2B33]">
            Budget & schedule
          </span>
        </div>

        {/* Budget strategy - Read only description */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1">
            <span className="font-optimistic font-bold text-[15px] leading-[20px] text-[#1C2B33]">
              Budget strategy
            </span>
            <Icon name="Info" variant="filled" size={12} className="text-[#283943]" />
          </div>
          <p className="font-optimistic text-[14px] leading-[20px] text-[#1C2B33]">
            Your campaign budget automatically distributes your daily budget of{" "}
            <span className="font-bold">{budgetValue}</span> across ad sets to get the best performance. 
            You can set spending limits for each ad set.{" "}
            <span className="text-[#0A78BE] cursor-pointer hover:underline">About spending limits</span>
          </p>
        </div>

        {/* Ad set spending limits */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="font-optimistic font-bold text-[14px] leading-[20px] text-[#1C2B33]">
              Ad set spending limits
            </span>
            <Icon name="Info" variant="filled" size={12} className="text-[#283943]" />
          </div>
          <span className="font-optimistic text-[14px] leading-[20px] text-[#465A69]">
            None added
          </span>
        </div>

        {/* Schedule */}
        <div className="flex items-center gap-1">
          <span className="font-optimistic font-bold text-[15px] leading-[20px] text-[#1C2B33]">
            Schedule
          </span>
        </div>

        {/* Start date */}
        <DateTimeField
          date={startDate}
          hours={startDate?.getHours() ?? 9}
          minutes={startDate?.getMinutes() ?? 28}
          onDateChange={setStartDate}
          label="Start date"
        />

        {/* End date with checkbox */}
        <div className="flex flex-col gap-2">
          <span className="font-optimistic font-bold text-[14px] leading-[20px] text-[#1C2B33]">
            End date
          </span>
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setHasEndDate(!hasEndDate)}
          >
            <CheckboxIcon checked={hasEndDate} />
            <span className="font-optimistic text-[14px] leading-[20px] text-[#1C2B33]">
              Set an end date
            </span>
          </div>
          {hasEndDate && (
            <DateTimeField
              date={endDate}
              hours={endDate?.getHours() ?? 9}
              minutes={endDate?.getMinutes() ?? 28}
              onDateChange={setEndDate}
              minDate={startDate || undefined}
            />
          )}
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-[#CBD2D9]" />

        {/* Show/Hide settings */}
        <button
          className="flex items-center gap-1 text-[#0A78BE] font-optimistic font-medium text-[14px] leading-[20px] hover:underline w-fit"
          onClick={() => setShowMoreSettings(!showMoreSettings)}
        >
          <span>{showMoreSettings ? "Hide settings" : "Show more settings"}</span>
          <Icon
            name={showMoreSettings ? "SmallTriangleUp" : "SmallTriangleDown"}
            variant="filled"
            size={16}
            className="text-[#0A78BE]"
          />
        </button>

        {/* More settings */}
        {showMoreSettings && (
          <>
            <FieldRow 
              label="Budget scheduling"
              value="None selected"
            />
          </>
        )}
      </div>
    );
  }

  // Ad Set Budget selected on L3
  return (
    <div className={`bg-white rounded-[4px] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.1),0px_0px_4px_0px_rgba(0,0,0,0.1)] p-4 w-[600px] flex flex-col gap-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-2">
        <CheckCircleIcon />
        <span className="font-optimistic font-bold text-[16px] leading-[20px] text-[#1C2B33]">
          Budget & schedule
        </span>
      </div>

      {/* Budget strategy - Editable */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1">
          <span className="font-optimistic font-bold text-[15px] leading-[20px] text-[#1C2B33]">
            Budget strategy
          </span>
          <Icon name="Info" variant="filled" size={12} className="text-[#283943]" />
        </div>

        {/* Budget selector and input */}
        <div className="flex items-end h-[36px]">
          <button className="h-[36px] px-3 bg-white border border-[#CBD2D9] rounded-l flex items-center gap-2 hover:bg-[#F5F7F8] transition-colors min-w-[180px]">
            <span className="font-sf-pro text-[14px] leading-[20px] text-[#1C2B33] flex-1 text-left">
              Daily budget
            </span>
            <TriangleDownIcon />
          </button>
          
          <div className="flex-1 h-[36px] px-3 bg-white border border-l-0 border-[#CBD2D9] rounded-r flex items-center justify-between">
            <span className="font-sf-pro text-[14px] leading-[20px] text-[#1C2B33]">
              $ 20.00
            </span>
            <span className="font-sf-pro text-[14px] leading-[20px] text-[rgba(28,43,51,0.65)]">
              USD
            </span>
          </div>
        </div>

        <p className="font-optimistic text-[14px] leading-[20px] text-[#1C2B33]">
          You are using ad set budget sharing and we&apos;ll aim to spend an average of ${budgetAmount}. 
          Your maximum daily spend is <span className="font-bold">${maxDailySpend}</span> and 
          your maximum weekly spend is <span className="font-bold">${maxWeeklySpend}</span>. 
          Go to <span className="text-[#0A78BE] cursor-pointer hover:underline">campaign level</span> to make updates.
        </p>
      </div>

      {/* Schedule */}
      <div className="flex items-center gap-1">
        <span className="font-optimistic font-bold text-[15px] leading-[20px] text-[#1C2B33]">
          Schedule
        </span>
      </div>

      {/* Start date */}
      <DateTimeField
        date={startDate}
        hours={startDate?.getHours() ?? 9}
        minutes={startDate?.getMinutes() ?? 28}
        onDateChange={setStartDate}
        label="Start date"
      />

      {/* End date - simple */}
      <div className="flex flex-col">
        <span className="font-optimistic font-bold text-[14px] leading-[20px] text-[#1C2B33]">
          End date
        </span>
        <span className="font-optimistic text-[14px] leading-[20px] text-[#465A69]">
          None
        </span>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-[#CBD2D9]" />

      {/* Show/Hide settings */}
      <button
        className="flex items-center gap-1 text-[#0A78BE] font-optimistic font-medium text-[14px] leading-[20px] hover:underline w-fit"
        onClick={() => setShowMoreSettings(!showMoreSettings)}
      >
        <span>{showMoreSettings ? "Hide settings" : "Show more settings"}</span>
        <Icon
          name={showMoreSettings ? "SmallTriangleUp" : "SmallTriangleDown"}
          variant="filled"
          size={16}
          className="text-[#0A78BE]"
        />
      </button>

      {/* More settings */}
      {showMoreSettings && (
        <>
          <FieldRow 
            label="Budget scheduling"
            value="None selected"
          />
          <FieldRow 
            label="Ad scheduling"
            value="Run ads all the time"
          />
        </>
      )}
    </div>
  );
}
