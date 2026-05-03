"use client";

import { useState } from "react";
import { Icon } from "@/features/ctv/components/ui/Icon";
import { Dropdown } from "@/features/ctv/components/ui/Dropdown";
import { FieldRow } from "@/features/ctv/components/ui/FieldRow";
import type { FormDropdownSection } from "@/features/ctv/components/ui/Dropdown";
import type { PrototypeVersion } from "./types";

interface ConversionSalesCardProps {
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

function getConversionLocationSections(version: PrototypeVersion, isTVMode: boolean): FormDropdownSection[] {
  const isAlpha = version === "alpha-v1";
  const isTVModeOn = isAlpha && isTVMode;
  
  return [
    {
      title: "Multiple",
      description: "We'll automatically send people where they're most likely to convert",
      options: [
        { value: "website-app", label: "Website and app", description: "Drive sales and conversions on your website or app.", disabled: false },
        { value: "website-instore", label: "Website and in-store", disabled: false },
        { value: "website-app-instore", label: "Website, app and in-store", disabled: isTVModeOn },
        { value: "website-calls", label: "Website and calls", disabled: isTVModeOn },
      ]
    },
    {
      title: "Single",
      description: "Send people to one location where you want them to convert",
      options: [
        { value: "live-video", label: "Live video", disabled: false },
        { value: "website", label: "Website", description: "Drive sales and conversions on your website.", disabled: false },
        { value: "app", label: "App", description: "Drive sales and conversions on your app.", disabled: false },
        { value: "messaging-apps", label: "Messaging apps", description: "Drive sales and conversions through Messenger, Instagram and WhatsApp.", disabled: isTVModeOn },
        { value: "calls", label: "Calls", description: "Drive sales and conversions through phone calls.", disabled: isTVModeOn },
      ]
    }
  ];
}

function getPerformanceGoalSections(version: PrototypeVersion): FormDropdownSection[] {
  const isAlpha = version === "alpha-v1";
  
  const sections: FormDropdownSection[] = [
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
          disabled: !isAlpha // Disabled in Before, enabled in Alpha
        },
      ]
    }
  ];
  
  // Only show "Other goals" section in Before version
  if (!isAlpha) {
    sections.push({
      title: "Other goals",
      options: [
        { 
          value: "max-landing-page", 
          label: "Maximize number of landing page views",
          description: "We'll try to show your ads to the people most likely to view the website linked in your ad.",
          disabled: false 
        },
        { 
          value: "max-link-clicks", 
          label: "Maximize number of link clicks",
          description: "We'll try to show your ads to the people most likely to click on them.",
          disabled: false 
        },
      ]
    });
  }
  
  return sections;
}

function getAttributionModelOptions() {
  return [
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
  ];
}

function getClickThroughOptions() {
  return [
    { value: "1-day", label: "1 day" },
    { value: "7-days", label: "7 days" },
  ];
}

function getEngagedViewOptions() {
  return [
    { value: "none", label: "None" },
    { value: "1-day", label: "1 day" },
  ];
}

function getViewThroughOptions() {
  return [
    { value: "none", label: "None" },
    { value: "1-day", label: "1 day" },
  ];
}

function getAttributionSummary(clickThrough: string, engagedView: string, viewThrough: string): string {
  const parts: string[] = [];
  
  const clickThroughOption = getClickThroughOptions().find(o => o.value === clickThrough);
  if (clickThroughOption) {
    parts.push(`${clickThroughOption.label} click`);
  }
  
  const engagedViewOption = getEngagedViewOptions().find(o => o.value === engagedView);
  if (engagedViewOption && engagedView !== "none") {
    parts.push(`${engagedViewOption.label} engaged-view`);
  }
  
  const viewThroughOption = getViewThroughOptions().find(o => o.value === viewThrough);
  if (viewThroughOption && viewThrough !== "none") {
    parts.push(`${viewThroughOption.label} view`);
  }
  
  return parts.join(", ");
}

export function ConversionSalesCard({ version, className = "", isTVMode = false }: ConversionSalesCardProps) {
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
  
  // Attribution settings expanded state
  const [attributionSettingsExpanded, setAttributionSettingsExpanded] = useState(false);
  const [attributionSettingsHovered, setAttributionSettingsHovered] = useState(false);
  const [clickThrough, setClickThrough] = useState("7-days");
  const [engagedView, setEngagedView] = useState("1-day");
  const [viewThrough, setViewThrough] = useState("1-day");

  // Only render for "before" and "alpha-v1" versions
  if (version !== "before" && version !== "alpha-v1") {
    return null;
  }

  const isAlpha = version === "alpha-v1";
  const showTVDisabledFields = isAlpha && isTVMode;

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

      {/* 1. Conversion location */}
      <Dropdown.Form
        label="Conversion location"
        selectedValue={conversionLocation}
        sections={getConversionLocationSections(version, isTVMode)}
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

      {/* 2. Performance goal */}
      <Dropdown.Form
        label="Performance goal"
        selectedValue={performanceGoal}
        sections={getPerformanceGoalSections(version)}
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

      {/* 3. Dataset */}
      <SelectorField 
        label="Dataset"
        value="adsdogfoodingpixel"
      />

      {/* 4. Conversion event */}
      <SelectorField 
        label="Conversion event"
        value="Select an event or search by name"
        placeholder
      />

      {/* 5. Cost per result goal - Always visible, disabled when TV Mode ON */}
      <div className={`flex flex-col w-full ${showTVDisabledFields ? "opacity-50" : ""}`}>
        <div className="flex items-center gap-1 pb-1">
          <span className="font-optimistic font-bold text-[14px] leading-[20px] text-[#1C2B33]">
            Cost per result goal
          </span>
          {!showTVDisabledFields && (
            <>
              <span className="font-sf-pro text-[14px] leading-[20px] text-[rgba(28,43,51,0.65)]">
                ∙
              </span>
              <span className="font-optimistic font-bold text-[14px] leading-[20px] text-[rgba(28,43,51,0.65)]">
                Optional
              </span>
            </>
          )}
        </div>
        {showTVDisabledFields ? (
          <span className="font-optimistic text-[14px] leading-[20px] text-[#465A69]">
            Not available for Connected TV
          </span>
        ) : (
          <>
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
          </>
        )}
      </div>

      {/* 6. Value rules - Always visible, disabled when TV Mode ON */}
      {showTVDisabledFields ? (
        <div className="flex flex-col py-1 opacity-50">
          <div className="flex items-center gap-1">
            <span className="font-optimistic font-bold text-[14px] leading-[20px] text-[#465A69]">
              Value rules
            </span>
            <Icon name="Info" variant="filled" size={12} className="text-[#283943]" />
          </div>
          <span className="font-optimistic text-[14px] leading-[20px] text-[#465A69]">
            Not available for Connected TV
          </span>
        </div>
      ) : (
        <FieldDisplay 
          label="Value rules"
          value="Enabled: No"
        />
      )}

      {/* 7. Attribution model */}
      <Dropdown.Form
        label="Attribution model"
        selectedValue={attributionModel}
        options={getAttributionModelOptions()}
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
          {/* Attribution setting - Expandable */}
          {attributionSettingsExpanded ? (
            <div className="bg-[#F1F4F7] rounded-[1px] py-2 px-2">
              {/* Header - clickable to collapse */}
              <div 
                className="flex items-center justify-between cursor-pointer py-1 px-1"
                onClick={() => setAttributionSettingsExpanded(false)}
              >
                <div className="flex items-center gap-1">
                  <span className="font-optimistic font-bold text-[14px] leading-[20px] text-[#1C2B33]">
                    Attribution settings
                  </span>
                  <Icon name="Info" variant="filled" size={12} className="text-[#283943]" />
                </div>
                <Icon name="CaretUp" variant="outlined" size={16} className="text-[#283943]" />
              </div>
              
              {/* Content */}
              <div className="bg-white rounded-[6px] mt-2 p-3 flex flex-col gap-3">
                {/* Click-through */}
                <Dropdown.Form
                  label="Click-through"
                  selectedValue={clickThrough}
                  options={getClickThroughOptions()}
                  onSelect={(value) => setClickThrough(value)}
                  showInfoIcon
                />
                
                {/* Engaged-view */}
                <Dropdown.Form
                  label="Engaged-view (For videos only)"
                  selectedValue={engagedView}
                  options={getEngagedViewOptions()}
                  onSelect={(value) => setEngagedView(value)}
                  showInfoIcon
                />
                
                {/* View-through */}
                <Dropdown.Form
                  label="View-through"
                  selectedValue={viewThrough}
                  options={getViewThroughOptions()}
                  onSelect={(value) => setViewThrough(value)}
                  showInfoIcon
                />
              </div>
            </div>
          ) : (
            <div
              className={`rounded-[4px] py-2 px-3 -mx-3 transition-colors cursor-pointer ${
                attributionSettingsHovered ? "bg-[#F1F4F7]" : ""
              }`}
              onMouseEnter={() => setAttributionSettingsHovered(true)}
              onMouseLeave={() => setAttributionSettingsHovered(false)}
              onClick={() => setAttributionSettingsExpanded(true)}
            >
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <span className="font-optimistic font-bold text-[14px] leading-[20px] text-[rgba(0,0,0,0.75)]">
                      Attribution setting
                    </span>
                    <Icon name="Info" variant="filled" size={12} className="text-[rgba(0,0,0,0.75)]" />
                  </div>
                  <span className="font-optimistic text-[14px] leading-[20px] text-[#1C2B33]">
                    {getAttributionSummary(clickThrough, engagedView, viewThrough)}
                  </span>
                </div>
                {attributionSettingsHovered && (
                  <Icon name="Pencil" variant="filled" size={16} className="text-[#0A78BE]" />
                )}
              </div>
            </div>
          )}

          {/* Conversion count */}
          <FieldRow 
            label="Conversion count"
            value="All conversions"
          />

          {/* Delivery type */}
          <FieldRow 
            label="Delivery type"
            value="Standard"
          />
        </>
      )}
    </div>
  );
}
