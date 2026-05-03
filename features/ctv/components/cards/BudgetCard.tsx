"use client";

import { useState } from "react";
import { Icon } from "@/features/ctv/components/ui/Icon";
import type { PrototypeVersion } from "./types";

interface BudgetCardProps {
  version: PrototypeVersion;
  className?: string;
  isTVMode?: boolean;
  /** Whether Campaign Budget is selected (true) or Ad Set Budget (false) */
  isAdvantageBudgetOn?: boolean;
  /** Callback when budget strategy changes */
  onAdvantageBudgetChange?: (isOn: boolean) => void;
  /** Budget value from parent */
  budgetValue?: string;
  /** Callback when budget value changes */
  onBudgetValueChange?: (value: string) => void;
  /** When true, removes all TV Mode-related field restrictions (no disabled fields) */
  disableTVModeRestrictions?: boolean;
}

type BudgetStrategy = "campaign" | "adset";
type BudgetType = "daily" | "lifetime";

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

interface RadioOptionProps {
  selected: boolean;
  onClick: () => void;
  title: string;
  description: string;
  linkText?: string;
}

function RadioOption({ selected, onClick, title, description, linkText }: RadioOptionProps) {
  return (
    <div 
      className="flex gap-2 items-start px-2 py-1 cursor-pointer"
      onClick={onClick}
    >
      <div className="w-6 h-6 rounded-full border border-[#CBD2D9] bg-white flex items-center justify-center shrink-0">
        {selected && (
          <div className="w-3 h-3 rounded-full bg-[#0A78BE]" />
        )}
      </div>
      <div className="flex flex-col flex-1">
        <span className="font-sf-pro text-[14px] leading-[20px] text-[#1C2B33]">
          {title}
        </span>
        <span className="font-sf-pro text-[12px] leading-[16px] text-[#465A69]">
          {description}
          {linkText && (
            <>
              {" "}
              <span className="text-[#0A78BE] cursor-pointer hover:underline">{linkText}</span>
            </>
          )}
        </span>
      </div>
    </div>
  );
}

interface CheckboxOptionProps {
  checked: boolean;
  onClick: () => void;
  title: string;
  description: string;
  linkText?: string;
}

function CheckboxOption({ checked, onClick, title, description, linkText }: CheckboxOptionProps) {
  return (
    <div 
      className="flex gap-2 items-start px-2 py-1 cursor-pointer"
      onClick={onClick}
    >
      <div className={`w-6 h-6 rounded-[4px] border border-[#CBD2D9] bg-white flex items-center justify-center shrink-0 ${checked ? 'bg-[#0A78BE] border-[#0A78BE]' : ''}`}>
        {checked && (
          <Icon name="Check" variant="filled" size={16} className="text-white" />
        )}
      </div>
      <div className="flex flex-col flex-1">
        <span className="font-optimistic text-[14px] leading-[20px] text-[#1C2B33]">
          {title}
        </span>
        <span className="font-sf-pro text-[12px] leading-[16px] text-[#465A69]">
          {description}
          {linkText && (
            <>
              {" "}
              <span className="text-[#0A78BE] cursor-pointer hover:underline">{linkText}</span>
            </>
          )}
        </span>
      </div>
    </div>
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
        {/* Budget type selector */}
        <button 
          className="flex items-center gap-2 px-3 py-2 bg-white border border-[#CBD2D9] rounded-l-[4px] w-[180px] justify-between"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <span className="font-sf-pro text-[14px] leading-[20px] text-[#1C2B33]">
            {budgetType === "daily" ? "Daily budget" : "Lifetime"}
          </span>
          <Icon name="SmallTriangleDown" variant="filled" size={16} className="text-[#283943]" />
        </button>
        
        {/* Amount input */}
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
      
      {/* Dropdown menu */}
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
          <div className="h-px bg-[#CBD2D9] my-1" />
        </div>
      )}
    </div>
  );
}

type BidStrategy = "highest_volume" | "cost_per_result" | "roas";

export function BudgetCard({ 
  version, 
  className = "", 
  isTVMode = false,
  isAdvantageBudgetOn,
  onAdvantageBudgetChange,
  budgetValue: externalBudgetValue,
  onBudgetValueChange,
  disableTVModeRestrictions = false,
}: BudgetCardProps) {
  const [internalBudgetStrategy, setInternalBudgetStrategy] = useState<BudgetStrategy>("campaign");
  const [budgetType, setBudgetType] = useState<BudgetType>("daily");
  const [internalBudgetValue, setInternalBudgetValue] = useState("$100.00");
  
  // Use external state if provided, otherwise use internal state
  const budgetStrategy: BudgetStrategy = isAdvantageBudgetOn !== undefined 
    ? (isAdvantageBudgetOn ? "campaign" : "adset")
    : internalBudgetStrategy;
  const budgetValue = externalBudgetValue ?? internalBudgetValue;
  
  const setBudgetStrategy = (strategy: BudgetStrategy) => {
    if (onAdvantageBudgetChange) {
      onAdvantageBudgetChange(strategy === "campaign");
    } else {
      setInternalBudgetStrategy(strategy);
    }
  };
  
  const setBudgetValue = (value: string) => {
    if (onBudgetValueChange) {
      onBudgetValueChange(value);
    } else {
      setInternalBudgetValue(value);
    }
  };
  const [showBudgetDropdown, setShowBudgetDropdown] = useState(false);
  const [strategyExpanded, setStrategyExpanded] = useState(true);
  const [strategyHovered, setStrategyHovered] = useState(false);
  const [shareBudget, setShareBudget] = useState(false);
  const [bidStrategyExpanded, setBidStrategyExpanded] = useState(false);
  const [bidStrategyHovered, setBidStrategyHovered] = useState(false);
  const [bidStrategy, setBidStrategy] = useState<BidStrategy>("highest_volume");
  const [showBidStrategyDropdown, setShowBidStrategyDropdown] = useState(false);

  // Only render for "before" and "alpha-v1" versions
  if (version !== "before" && version !== "alpha-v1") {
    return null;
  }

  const isAlpha = version === "alpha-v1";

  const getBudgetDescription = () => {
    if (budgetType === "daily") {
      return (
        <>
          You'll spend an average of $100 per day. Your maximum daily spend is{" "}
          <span className="font-bold">$700.00</span> per calendar week.
          <br />
          <span className="text-[#0A78BE] cursor-pointer hover:underline">About daily budget</span>
        </>
      );
    }
    return (
      <>
        You'll spend no more than $1,050.00 during the lifetime of your campaign.
        <br />
        <span className="text-[#0A78BE] cursor-pointer hover:underline">About lifetime budget</span>
      </>
    );
  };

  const budgetStrategyLabel = budgetStrategy === "campaign" ? "Campaign Budget" : "Ad set budget";

  return (
    <div className={`bg-white rounded-[4px] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.1),0px_0px_4px_0px_rgba(0,0,0,0.1)] p-4 w-[600px] ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon name="CheckCircle" variant="filled" size={16} className="text-[#006B4E]" />
          <h3 className="font-optimistic font-bold text-[16px] leading-[20px] text-[#1C2B33]">
            Budget
          </h3>
        </div>
        <AdvantagePill />
      </div>

      {/* Budget Strategy Section */}
      {strategyExpanded ? (
        /* Expanded state - grey background with radio options */
        <div className="bg-[#F1F4F7] rounded-[1px] py-2 px-2 mb-4">
          {/* Header */}
          <div 
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setStrategyExpanded(false)}
          >
            <div className="flex items-center gap-1">
              <span className="font-optimistic font-bold text-[14px] leading-[20px] text-[rgba(0,0,0,0.75)]">
                Budget strategy
              </span>
              <Icon name="Info" variant="filled" size={12} className="text-[rgba(0,0,0,0.75)]" />
            </div>
            <div className="p-[2px]">
              <Icon 
                name="CaretUp" 
                variant="outlined" 
                size={16} 
                className="text-[#283943]" 
              />
            </div>
          </div>

          {/* Radio options */}
          <div className="bg-white rounded-[6px] mt-2 p-2">
            <RadioOption
              selected={budgetStrategy === "campaign"}
              onClick={() => setBudgetStrategy("campaign")}
              title="Campaign budget"
              description="Automatically distribute your budget to the best opportunities across your campaign. Also known as Advantage campaign budget."
              linkText="About campaign budget"
            />
            <RadioOption
              selected={budgetStrategy === "adset"}
              onClick={() => setBudgetStrategy("adset")}
              title="Ad set budget"
              description="Set different bid strategies or budget schedules for each ad set."
            />
          </div>
        </div>
      ) : (
        /* Collapsed state - simple label/value, grey bg on hover with pencil icon */
        <div 
          className={`rounded-[1px] py-2 mb-4 cursor-pointer transition-colors ${
            strategyHovered ? "bg-[#F1F4F7] px-2" : ""
          }`}
          onMouseEnter={() => setStrategyHovered(true)}
          onMouseLeave={() => setStrategyHovered(false)}
          onClick={() => setStrategyExpanded(true)}
        >
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="font-optimistic font-bold text-[14px] leading-[20px] text-[rgba(0,0,0,0.75)]">
                  Budget strategy
                </span>
                <Icon name="Info" variant="filled" size={12} className="text-[rgba(0,0,0,0.75)]" />
              </div>
              <span className="font-optimistic text-[14px] leading-[20px] text-[#465A69]">
                {budgetStrategyLabel}
              </span>
            </div>
            {strategyHovered && (
              <div className="p-[2px]">
                <Icon name="Pencil" variant="filled" size={16} className="text-[#0A78BE]" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Ad set budget sharing checkbox (only when ad set budget is selected) */}
      {budgetStrategy === "adset" && (
        <div className="mb-4">
          <CheckboxOption
            checked={shareBudget}
            onClick={() => setShareBudget(!shareBudget)}
            title="Share some of your budget with other ad sets"
            description="We'll share up to 20% of your ad set budget with other ad sets within this campaign when it's likely to improve performance."
            linkText="About ad set budget sharing"
          />
        </div>
      )}

      {/* Budget Input (only when campaign budget is selected) */}
      {budgetStrategy === "campaign" && (
        <div className="mb-4">
          <BudgetInput
            budgetType={budgetType}
            onBudgetTypeChange={setBudgetType}
            value={budgetValue}
            onChange={setBudgetValue}
            showDropdown={showBudgetDropdown}
            setShowDropdown={setShowBudgetDropdown}
          />
          <p className="font-optimistic text-[12px] leading-[16px] text-[#1C2B33] mt-2">
            {getBudgetDescription()}
          </p>
        </div>
      )}

      {/* Campaign bid strategy (only when campaign budget is selected) */}
      {budgetStrategy === "campaign" && (
        bidStrategyExpanded ? (
          /* Expanded state - grey background with white interior (matches Budget strategy style) */
          <div className="bg-[#F1F4F7] rounded-[1px] py-2 px-2">
            {/* Header */}
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setBidStrategyExpanded(false)}
            >
              <div className="flex items-center gap-1">
                <span className="font-optimistic font-bold text-[14px] leading-[20px] text-[rgba(0,0,0,0.75)]">
                  Campaign bid strategy
                </span>
                <Icon name="Info" variant="filled" size={12} className="text-[rgba(0,0,0,0.75)]" />
              </div>
              <div className="p-[2px]">
                <Icon 
                  name="CaretUp" 
                  variant="outlined" 
                  size={16} 
                  className="text-[#283943]" 
                />
              </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-[6px] mt-2 p-3">
              <p className="font-optimistic text-[14px] leading-[20px] text-[#1C2B33] mb-3">
                How we'll bid in ad auctions.
              </p>
              
              {/* Bid strategy dropdown */}
              <div className="relative">
                <button 
                  className="flex items-center gap-2 px-3 py-2 bg-white border border-[#CBD2D9] rounded-[4px] justify-between min-w-[180px]"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowBidStrategyDropdown(!showBidStrategyDropdown);
                  }}
                >
                  <span className="font-sf-pro text-[14px] leading-[20px] text-[#1C2B33]">
                    {bidStrategy === "highest_volume" ? "Highest volume" : 
                     bidStrategy === "cost_per_result" ? "Cost per result" : "ROAS goal"}
                  </span>
                  <Icon name="SmallTriangleDown" variant="filled" size={16} className="text-[#283943]" />
                </button>
                
                {/* Dropdown menu */}
                {showBidStrategyDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-[492px] bg-white rounded-[4px] shadow-[0px_2px_12px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] py-2 px-3 z-10">
                    {/* Highest volume - always enabled */}
                    <div 
                      className="py-2 cursor-pointer hover:bg-[#F1F4F7] rounded px-1"
                      onClick={(e) => { 
                        e.stopPropagation();
                        setBidStrategy("highest_volume"); 
                        setShowBidStrategyDropdown(false); 
                      }}
                    >
                      <span className="font-optimistic font-bold text-[14px] leading-[20px] text-[#1C2B33] block">
                        Highest volume
                      </span>
                      <span className="font-optimistic text-[14px] leading-[20px] text-[#465A69]">
                        Get the most results for your budget.
                      </span>
                    </div>
                    
                    {/* Cost per result goal - disabled when TV Mode ON (unless disableTVModeRestrictions) */}
                    <div 
                      className={`py-2 rounded px-1 ${
                        (isTVMode && !disableTVModeRestrictions) ? "cursor-not-allowed" : "cursor-pointer hover:bg-[#F1F4F7]"
                      }`}
                      onClick={(e) => { 
                        e.stopPropagation();
                        if (!isTVMode || disableTVModeRestrictions) {
                          setBidStrategy("cost_per_result"); 
                          setShowBidStrategyDropdown(false); 
                        }
                      }}
                    >
                      <span className={`font-optimistic font-bold text-[14px] leading-[20px] block ${
                        (isTVMode && !disableTVModeRestrictions) ? "text-[#A7B3BF]" : "text-[#1C2B33]"
                      }`}>
                        Cost per result goal
                      </span>
                      <span className={`font-optimistic text-[14px] leading-[20px] ${
                        (isTVMode && !disableTVModeRestrictions) ? "text-[#A7B3BF]" : "text-[#465A69]"
                      }`}>
                        Aim for a certain cost per result while maximizing the volume of results.
                      </span>
                    </div>
                    
                    {/* ROAS goal - always disabled (greyed out) */}
                    <div 
                      className="py-2 cursor-not-allowed rounded px-1"
                      onClick={(e) => { 
                        e.stopPropagation();
                      }}
                    >
                      <span className="font-optimistic font-bold text-[14px] leading-[20px] text-[#A7B3BF] block">
                        ROAS goal
                      </span>
                      <span className="font-optimistic text-[14px] leading-[20px] text-[#A7B3BF]">
                        Aim for a certain return on ad spend while maximizing the value of results.
                      </span>
                    </div>
                    
                    {/* Other options - disabled when TV Mode ON (unless disableTVModeRestrictions) */}
                    <div 
                      className={`py-2 rounded px-1 flex items-center justify-between ${
                        (isTVMode && !disableTVModeRestrictions) ? "cursor-not-allowed" : "cursor-pointer hover:bg-[#F1F4F7]"
                      }`}
                      onClick={(e) => { 
                        e.stopPropagation();
                      }}
                    >
                      <div>
                        <span className={`font-optimistic font-bold text-[14px] leading-[20px] block ${
                          (isTVMode && !disableTVModeRestrictions) ? "text-[#A7B3BF]" : "text-[#1C2B33]"
                        }`}>
                          Other options
                        </span>
                        <span className={`font-optimistic text-[14px] leading-[20px] ${
                          (isTVMode && !disableTVModeRestrictions) ? "text-[#A7B3BF]" : "text-[#465A69]"
                        }`}>
                          Bid cap
                        </span>
                      </div>
                      <Icon name="CaretRight" variant="outlined" size={16} className={(isTVMode && !disableTVModeRestrictions) ? "text-[#A7B3BF]" : "text-[#283943]"} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Collapsed state - simple label/value with hover */
          <div 
            className={`rounded-[4px] py-2 px-3 -mx-3 cursor-pointer transition-colors ${
              bidStrategyHovered ? "bg-[#F1F4F7]" : ""
            }`}
            onMouseEnter={() => setBidStrategyHovered(true)}
            onMouseLeave={() => setBidStrategyHovered(false)}
            onClick={() => setBidStrategyExpanded(true)}
          >
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="font-optimistic font-bold text-[14px] leading-[20px] text-[rgba(0,0,0,0.75)]">
                    Campaign bid strategy
                  </span>
                  <Icon name="Info" variant="filled" size={12} className="text-[rgba(0,0,0,0.75)]" />
                </div>
                <span className="font-optimistic text-[14px] leading-[20px] text-[#1C2B33]">
                  {bidStrategy === "highest_volume" ? "Highest volume" : 
                   bidStrategy === "cost_per_result" ? "Cost per result" : "ROAS goal"}
                </span>
              </div>
              {bidStrategyHovered && (
                <Icon name="Pencil" variant="filled" size={16} className="text-[#0A78BE]" />
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
}
