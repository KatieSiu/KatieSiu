"use client";

import { useState } from "react";
import { Icon } from "@/features/ctv/components/ui/Icon";
import type { PrototypeVersion } from "./types";

interface ConversionSalesCardStandaloneProps {
  version: PrototypeVersion;
  className?: string;
  isTVMode?: boolean;
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

interface DropdownOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
  linkText?: string;
}

interface DropdownSection {
  title: string;
  options: DropdownOption[];
}

interface DropdownFieldProps {
  label: string;
  selectedValue: string;
  sections: DropdownSection[];
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (value: string) => void;
}

function DropdownField({ label, selectedValue, sections, isOpen, onToggle, onSelect }: DropdownFieldProps) {
  const selectedOption = sections.flatMap(s => s.options).find(o => o.value === selectedValue);
  
  return (
    <div className="flex flex-col gap-[10px] w-full relative">
      <div className="flex items-center gap-1 pb-1">
        <span className="font-optimistic font-bold text-[14px] leading-[20px] text-[#1C2B33]">
          {label}
        </span>
        <Icon name="Info" variant="filled" size={12} className="text-[#283943]" />
      </div>
      <div 
        className="bg-white border border-[#CBD2D9] rounded h-[36px] flex items-center px-3 justify-between cursor-pointer hover:border-[#0A78BE]"
        onClick={onToggle}
      >
        <span className="font-sf-pro text-[14px] leading-[20px] text-[#1C2B33]">
          {selectedOption?.label || selectedValue}
        </span>
        <Icon name={isOpen ? "SmallTriangleUp" : "SmallTriangleDown"} variant="filled" size={16} className="text-[#283943]" />
      </div>
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded shadow-[0px_2px_12px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] z-10 pb-4 px-3">
          {sections.map((section, sectionIndex) => (
            <div key={section.title}>
              {/* Section Header */}
              <div className="flex items-center justify-between py-2">
                <div className="flex flex-col py-1">
                  <span className="font-optimistic font-bold text-[15px] leading-[20px] text-[#1C2B33]">
                    {section.title}
                  </span>
                  {section.title === "Multiple" && (
                    <span className="font-sf-pro text-[14px] leading-[20px] text-[#465A69]">
                      We'll automatically send people where they're most likely to convert
                    </span>
                  )}
                  {section.title === "Single" && (
                    <span className="font-sf-pro text-[14px] leading-[20px] text-[#465A69]">
                      Send people to one location where you want them to convert
                    </span>
                  )}
                </div>
                <Icon name="ChevronUp" variant="filled" size={16} className="text-[#283943]" />
              </div>
              
              {/* Options */}
              {section.options.map((option) => (
                <div 
                  key={option.value}
                  className={`flex items-center gap-2 px-2 py-1 ${option.disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
                  onClick={() => !option.disabled && onSelect(option.value)}
                >
                  {/* Radio button */}
                  <div className={`w-6 h-6 rounded-full border shrink-0 flex items-center justify-center ${
                    option.disabled ? "border-[#CBD2D9] bg-[#F1F4F7]" : "border-[#CBD2D9] bg-white"
                  }`}>
                    {selectedValue === option.value && (
                      <div className="w-3 h-3 rounded-full bg-[#0A78BE]" />
                    )}
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className={`font-optimistic text-[14px] leading-[20px] ${
                      option.disabled ? "text-[rgba(28,43,51,0.6)]" : "text-[#1C2B33]"
                    }`}>
                      {option.label}
                    </span>
                    {option.description && (
                      <span className={`font-optimistic text-[12px] leading-[16px] ${
                        option.disabled ? "text-[rgba(28,43,51,0.6)]" : "text-[#465A69]"
                      }`}>
                        {option.description}
                        {option.linkText && (
                          <span className="text-[#0A78BE]"> {option.linkText}</span>
                        )}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Divider between sections */}
              {sectionIndex < sections.length - 1 && (
                <div className="w-full h-px bg-[#CBD2D9] my-2" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface SelectorFieldProps {
  label: string;
  value: string;
  placeholder?: boolean;
}

function SelectorField({ label, value, placeholder = false }: SelectorFieldProps) {
  return (
    <div className="flex flex-col gap-[10px] w-full">
      <div className="flex items-center gap-1 pb-1">
        <span className="font-optimistic font-bold text-[14px] leading-[20px] text-[#1C2B33]">
          {label}
        </span>
        <Icon name="Info" variant="filled" size={12} className="text-[#283943]" />
      </div>
      <div className="bg-white border border-[#CBD2D9] rounded h-[36px] flex items-center px-3 justify-between cursor-pointer hover:border-[#0A78BE]">
        <span className={`font-sf-pro text-[14px] leading-[20px] ${placeholder ? "text-[rgba(28,43,51,0.65)]" : "text-[#1C2B33]"}`}>
          {value}
        </span>
        <Icon name="SmallTriangleDown" variant="filled" size={16} className="text-[#283943]" />
      </div>
    </div>
  );
}

interface FieldDisplayProps {
  label: string;
  value: string | React.ReactNode;
  labelColor?: "default" | "muted";
  labelSize?: "normal" | "large";
}

function FieldDisplay({ label, value, labelColor = "muted", labelSize = "normal" }: FieldDisplayProps) {
  return (
    <div className="flex flex-col py-1">
      <div className="flex items-center gap-1">
        <span className={`font-optimistic font-bold leading-[20px] ${
          labelColor === "muted" ? "text-[#465A69]" : "text-[#1C2B33]"
        } ${labelSize === "large" ? "text-[15px]" : "text-[14px]"}`}>
          {label}
        </span>
        <Icon name="Info" variant="filled" size={12} className="text-[#283943]" />
      </div>
      <div className="font-optimistic text-[14px] leading-[20px] text-[#465A69]">
        {value}
      </div>
    </div>
  );
}

function getConversionLocationSections(): DropdownSection[] {
  return [
    {
      title: "Multiple",
      options: [
        { value: "website-app", label: "Website and app", disabled: false },
        { value: "website-instore", label: "Website and in-store", disabled: true },
        { value: "website-app-instore", label: "Website, app and in-store", disabled: true },
        { value: "website-calls", label: "Website and calls", disabled: true },
      ]
    },
    {
      title: "Single",
      options: [
        { value: "live-video", label: "Live video", disabled: true },
        { value: "website", label: "Website", disabled: false },
        { value: "app", label: "App", disabled: false },
        { value: "message-destinations", label: "Message destinations", disabled: true },
        { value: "calls", label: "Calls", disabled: true },
      ]
    }
  ];
}

function getPerformanceGoalSections(): DropdownSection[] {
  return [
    {
      title: "Conversion Goals",
      options: [
        { 
          value: "max-conversions", 
          label: "Maximize number of conversions",
          description: "We'll try to show your ads to the people most likely to take a specific action on your website.",
          disabled: false 
        },
        { 
          value: "max-value", 
          label: "Maximize value of conversions",
          description: "We'll try to show your ads to the people most likely to generate higher value for your business.",
          disabled: false
        },
      ]
    }
  ];
}

function getAttributionModelSections(): DropdownSection[] {
  return [
    {
      title: "",
      options: [
        { 
          value: "standard", 
          label: "Standard",
          description: "Optimize ad delivery for selected time window and engagement based on your attribution settings.",
          linkText: "About attribution",
          disabled: false 
        },
        { 
          value: "incremental", 
          label: "Incremental",
          description: "Optimize delivery for incremental conversions using models that predict whether a conversion is caused by an ad.",
          linkText: "About incremental attribution",
          disabled: false 
        },
      ]
    }
  ];
}

export function ConversionSalesCardStandalone({ version, className = "", isTVMode = false }: ConversionSalesCardStandaloneProps) {
  const [showMoreSettings, setShowMoreSettings] = useState(true);
  const [costPerResult, setCostPerResult] = useState("");
  
  // Dropdown states
  const [conversionLocation, setConversionLocation] = useState("website");
  const [performanceGoal, setPerformanceGoal] = useState("max-conversions");
  const [attributionModel, setAttributionModel] = useState("standard");
  
  // Dropdown open states
  const [conversionLocationOpen, setConversionLocationOpen] = useState(false);
  const [performanceGoalOpen, setPerformanceGoalOpen] = useState(false);
  const [attributionModelOpen, setAttributionModelOpen] = useState(false);

  const closeAllDropdowns = () => {
    setConversionLocationOpen(false);
    setPerformanceGoalOpen(false);
    setAttributionModelOpen(false);
  };

  return (
    <div className={`bg-white rounded-[4px] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.1),0px_0px_4px_0px_rgba(0,0,0,0.1)] p-4 w-[600px] flex flex-col gap-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-2 h-5">
        <CheckCircleIcon />
        <span className="font-optimistic font-bold text-[16px] leading-[20px] text-[#1C2B33]">
          Conversion
        </span>
      </div>

      {/* Conversion location */}
      <DropdownField
        label="Conversion location"
        selectedValue={conversionLocation}
        sections={getConversionLocationSections()}
        isOpen={conversionLocationOpen}
        onToggle={() => {
          closeAllDropdowns();
          setConversionLocationOpen(!conversionLocationOpen);
        }}
        onSelect={(value) => {
          setConversionLocation(value);
          setConversionLocationOpen(false);
        }}
      />

      {/* Dataset */}
      <SelectorField 
        label="Dataset"
        value="adsdogfoodingpixel"
      />

      {/* Conversion event */}
      <SelectorField 
        label="Conversion event"
        value="Select an event or search by name"
        placeholder
      />

      {/* Performance goal */}
      <DropdownField
        label="Performance goal"
        selectedValue={performanceGoal}
        sections={getPerformanceGoalSections()}
        isOpen={performanceGoalOpen}
        onToggle={() => {
          closeAllDropdowns();
          setPerformanceGoalOpen(!performanceGoalOpen);
        }}
        onSelect={(value) => {
          setPerformanceGoal(value);
          setPerformanceGoalOpen(false);
        }}
      />

      {/* Cost per result goal - Only shown when TV mode is OFF */}
      {!isTVMode && (
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-1 pb-1">
            <span className="font-optimistic font-bold text-[14px] leading-[20px] text-[#1C2B33]">
              Cost per result goal
            </span>
            <span className="font-sf-pro text-[14px] leading-[20px] text-[rgba(28,43,51,0.65)]">
              ∙
            </span>
            <span className="font-optimistic font-bold text-[14px] leading-[20px] text-[rgba(28,43,51,0.65)]">
              Optional
            </span>
          </div>
          <div className="bg-white border border-[#CBD2D9] rounded h-[36px] flex items-center px-3 justify-between">
            <input
              type="text"
              value={costPerResult}
              onChange={(e) => setCostPerResult(e.target.value)}
              placeholder="$X.XX"
              className="flex-1 font-sf-pro text-[14px] leading-[20px] text-[#1C2B33] placeholder:text-[rgba(28,43,51,0.65)] outline-none bg-transparent"
            />
            <span className="font-sf-pro text-[14px] leading-[20px] text-[rgba(28,43,51,0.65)]">
              USD
            </span>
          </div>
          <p className="font-sf-pro text-[12px] leading-[16px] text-[#465A69] py-1">
            Meta will aim to spend your entire budget and get the most leads using the highest volume bid strategy. If keeping the average cost per result around a certain amount is important, enter a cost per result goal.
          </p>
        </div>
      )}

      {/* Value rules - Only shown when TV mode is OFF */}
      {!isTVMode && (
        <FieldDisplay 
          label="Value rules"
          value="Enabled: No"
        />
      )}

      {/* Attribution model */}
      <DropdownField
        label="Attribution model"
        selectedValue={attributionModel}
        sections={getAttributionModelSections()}
        isOpen={attributionModelOpen}
        onToggle={() => {
          closeAllDropdowns();
          setAttributionModelOpen(!attributionModelOpen);
        }}
        onSelect={(value) => {
          setAttributionModel(value);
          setAttributionModelOpen(false);
        }}
      />

      {/* Divider */}
      <div className="w-full h-px bg-[#CBD2D9]" />

      {/* Show/Hide settings toggle */}
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

      {/* Expanded Settings */}
      {showMoreSettings && (
        <>
          {/* Attribution setting */}
          <div className="flex flex-col py-1">
            <div className="flex items-center gap-1">
              <span className="font-optimistic font-bold text-[14px] leading-[20px] text-[#465A69]">
                Attribution setting
              </span>
              <Icon name="Info" variant="filled" size={12} className="text-[#283943]" />
            </div>
            <ul className="font-optimistic text-[14px] leading-[20px] text-[#465A69] list-disc ml-5">
              <li>7-day click</li>
              <li>1-day view</li>
            </ul>
          </div>

          {/* Conversion count */}
          <FieldDisplay 
            label="Conversion count"
            value="All conversions"
            labelColor="default"
            labelSize="large"
          />

          {/* Delivery type */}
          <FieldDisplay 
            label="Delivery type"
            value="Standard"
            labelSize="large"
          />
        </>
      )}
    </div>
  );
}
