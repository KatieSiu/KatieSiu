"use client";

import { useState } from "react";
import { Icon } from "@/features/ctv/components/ui/Icon";
import type { PrototypeVersion } from "./types";

type BudgetType = "daily" | "lifetime";

interface AdvantageCampaignBudgetCardProps {
  version: PrototypeVersion;
  className?: string;
  // Controlled props for state sharing with L2
  isEnabled?: boolean;
  onEnabledChange?: (isEnabled: boolean) => void;
  budgetType?: BudgetType;
  onBudgetTypeChange?: (type: BudgetType) => void;
  budgetValue?: string;
  onBudgetValueChange?: (value: string) => void;
}

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5L6 0Z" fill="currentColor"/>
    </svg>
  );
}

function AdvantagePill() {
  return (
    <div className="bg-[#EBF2E6] flex items-center gap-1 h-[18px] px-[6px] py-px rounded-full">
      <SparkleIcon className="text-[#006B4E]" />
      <span className="font-optimistic font-bold text-[12px] leading-[16px] text-[#006B4E]">
        Advantage+ on
      </span>
    </div>
  );
}

interface ToggleSwitchProps {
  isOn: boolean;
  onToggle: () => void;
}

function ToggleSwitch({ isOn, onToggle }: ToggleSwitchProps) {
  return (
    <button
      onClick={onToggle}
      className={`relative w-10 h-6 rounded-full border transition-colors ${
        isOn 
          ? "bg-[#0A78BE] border-[#0A78BE]" 
          : "bg-transparent border-[rgba(203,210,217,0.6)]"
      }`}
    >
      <div 
        className={`absolute top-[2px] w-[18px] h-[18px] rounded-full transition-all ${
          isOn 
            ? "left-[18px] bg-white" 
            : "left-[2px] bg-[rgba(40,57,67,0.6)]"
        }`}
      />
    </button>
  );
}

interface BudgetInputProps {
  budgetType: BudgetType;
  onBudgetTypeChange: (type: BudgetType) => void;
  value: string;
  onChange: (value: string) => void;
  showDropdown: boolean;
  setShowDropdown: (show: boolean) => void;
}

function BudgetInput({ budgetType, onBudgetTypeChange, value, onChange, showDropdown, setShowDropdown }: BudgetInputProps) {
  return (
    <div className="relative">
      <div className="flex items-stretch">
        <button 
          className="flex items-center gap-2 px-3 py-2 bg-white border border-[#CBD2D9] rounded-l-[4px] w-[180px] justify-between"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <span className="font-sf-pro text-[14px] leading-[20px] text-[#1C2B33]">
            {budgetType === "daily" ? "Daily budget" : "Lifetime"}
          </span>
          <Icon name="SmallTriangleDown" variant="filled" size={16} className="text-[#283943]" />
        </button>
        
        <div className="flex-1 flex items-center px-3 py-2 bg-white border border-l-0 border-[#CBD2D9] rounded-r-[4px]">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 font-sf-pro text-[14px] leading-[20px] text-[#1C2B33] outline-none"
          />
          <span className="font-sf-pro text-[14px] leading-[20px] text-[rgba(28,43,51,0.65)]">
            USD
          </span>
        </div>
      </div>
      
      {showDropdown && (
        <div className="absolute top-full left-0 mt-1 w-[182px] bg-white rounded-[4px] shadow-[0px_2px_12px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] p-1 z-10">
          <div 
            className="flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-[#F1F4F7] rounded"
            onClick={() => { onBudgetTypeChange("daily"); setShowDropdown(false); }}
          >
            <div className="w-6 h-6 rounded-full border border-[#CBD2D9] bg-white flex items-center justify-center">
              {budgetType === "daily" && <div className="w-3 h-3 rounded-full bg-[#0A78BE]" />}
            </div>
            <span className="font-optimistic text-[14px] leading-[20px] text-[#1C2B33]">Daily budget</span>
          </div>
          <div 
            className="flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-[#F1F4F7] rounded"
            onClick={() => { onBudgetTypeChange("lifetime"); setShowDropdown(false); }}
          >
            <div className="w-6 h-6 rounded-full border border-[#CBD2D9] bg-white flex items-center justify-center">
              {budgetType === "lifetime" && <div className="w-3 h-3 rounded-full bg-[#0A78BE]" />}
            </div>
            <span className="font-optimistic text-[14px] leading-[20px] text-[#1C2B33]">Lifetime budget</span>
          </div>
        </div>
      )}
    </div>
  );
}

interface FieldDisplayProps {
  label: string;
  value: string;
}

function FieldDisplay({ label, value }: FieldDisplayProps) {
  return (
    <div className="flex flex-col py-2">
      <div className="flex items-center gap-1">
        <span className="font-optimistic font-bold text-[14px] leading-[20px] text-[rgba(0,0,0,0.75)]">
          {label}
        </span>
        <Icon name="Info" variant="filled" size={12} className="text-[rgba(0,0,0,0.75)]" />
      </div>
      <span className="font-optimistic text-[14px] leading-[20px] text-[#465A69]">
        {value}
      </span>
    </div>
  );
}

export function AdvantageCampaignBudgetCard({ 
  version, 
  className = "",
  isEnabled: controlledIsEnabled,
  onEnabledChange,
  budgetType: controlledBudgetType,
  onBudgetTypeChange,
  budgetValue: controlledBudgetValue,
  onBudgetValueChange,
}: AdvantageCampaignBudgetCardProps) {
  // Use controlled props if provided, otherwise use internal state
  const [internalIsEnabled, setInternalIsEnabled] = useState(true);
  const [internalBudgetType, setInternalBudgetType] = useState<BudgetType>("daily");
  const [internalBudgetValue, setInternalBudgetValue] = useState("$100.00");
  const [showBudgetDropdown, setShowBudgetDropdown] = useState(false);
  const [showMoreSettings, setShowMoreSettings] = useState(false);

  // Determine whether to use controlled or internal state
  const isEnabled = controlledIsEnabled !== undefined ? controlledIsEnabled : internalIsEnabled;
  const budgetType = controlledBudgetType !== undefined ? controlledBudgetType : internalBudgetType;
  const budgetValue = controlledBudgetValue !== undefined ? controlledBudgetValue : internalBudgetValue;

  const handleEnabledChange = (newValue: boolean) => {
    if (onEnabledChange) {
      onEnabledChange(newValue);
    } else {
      setInternalIsEnabled(newValue);
    }
  };

  const handleBudgetTypeChange = (newType: BudgetType) => {
    if (onBudgetTypeChange) {
      onBudgetTypeChange(newType);
    } else {
      setInternalBudgetType(newType);
    }
  };

  const handleBudgetValueChange = (newValue: string) => {
    if (onBudgetValueChange) {
      onBudgetValueChange(newValue);
    } else {
      setInternalBudgetValue(newValue);
    }
  };

  if (version !== "before" && version !== "alpha-v1") {
    return null;
  }

  const getBudgetDescription = () => {
    if (budgetType === "daily") {
      return (
        <>
          You&apos;ll spend an average of $100 per day. Your maximum daily spend is{" "}
          <span className="font-bold">$700.00</span> per calendar week.
          <br />
          <span className="text-[#0A78BE] cursor-pointer hover:underline">About daily budget</span>
        </>
      );
    }
    return (
      <>
        You&apos;ll spend no more than $1,050.00 during the lifetime of your campaign.
        <br />
        <span className="text-[#0A78BE] cursor-pointer hover:underline">About lifetime budget</span>
      </>
    );
  };

  return (
    <div className={`bg-white rounded-[4px] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.1),0px_0px_4px_0px_rgba(0,0,0,0.1)] p-4 w-[600px] ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon name="CheckCircle" variant="filled" size={16} className="text-[#006B4E]" />
          <h3 className="font-optimistic font-bold text-[16px] leading-[20px] text-[#1C2B33]">
            Advantage campaign budget
          </h3>
        </div>
        <div className="flex items-center gap-3">
          {isEnabled && <AdvantagePill />}
          <div className="flex items-center gap-2">
            <span className="font-optimistic text-[14px] leading-[20px] text-[#1C2B33]">
              {isEnabled ? "On" : "Off"}
            </span>
            <ToggleSwitch isOn={isEnabled} onToggle={() => handleEnabledChange(!isEnabled)} />
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="font-optimistic text-[14px] leading-[20px] text-[#1C2B33] mb-4">
        Automatically distribute your budget across ad sets to get more results.{" "}
        <span className="text-[#0A78BE] cursor-pointer hover:underline">About Advantage campaign budget</span>
      </p>

      {/* Budget Input - only when enabled */}
      {isEnabled && (
        <div className="mb-4">
          <BudgetInput
            budgetType={budgetType}
            onBudgetTypeChange={handleBudgetTypeChange}
            value={budgetValue}
            onChange={handleBudgetValueChange}
            showDropdown={showBudgetDropdown}
            setShowDropdown={setShowBudgetDropdown}
          />
          <p className="font-optimistic text-[12px] leading-[16px] text-[#1C2B33] mt-2">
            {getBudgetDescription()}
          </p>
        </div>
      )}

      {/* Campaign bid strategy */}
      {isEnabled && (
        <FieldDisplay label="Campaign bid strategy" value="Highest volume" />
      )}

      {/* Divider */}
      <div className="h-px bg-[#CBD2D9] my-4" />

      {/* Show more settings link */}
      <button
        className="flex items-center gap-1 text-[#0A78BE] font-optimistic font-medium text-[14px] leading-[20px] hover:underline"
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

      {/* Expanded settings */}
      {showMoreSettings && (
        <div className="mt-4 flex flex-col gap-2">
          <FieldDisplay label="Budget scheduling" value="None selected" />
          <FieldDisplay label="Ad scheduling" value="Run ads all the time" />
        </div>
      )}
    </div>
  );
}
