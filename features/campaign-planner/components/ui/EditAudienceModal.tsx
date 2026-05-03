"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "./Button";
import { Icon } from "./Icon";
import { Input } from "./Input";
import { Dropdown } from "./Dropdown";
import { cn, getTriggerStyles } from "@/features/campaign-planner/lib/utils";

// ============================================
// Types
// ============================================
interface EditAudienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (audience: AudienceData) => void;
  initialData?: AudienceData;
}

interface AudienceData {
  locations: LocationItem[];
  ageMin: string;
  ageMax: string;
  gender: "all" | "men" | "women";
  languages: string;
  detailedTargeting: string;
  customAudiences: string;
}

interface LocationItem {
  id: string;
  name: string;
  radius?: string;
}

// ============================================
// Location Item Component
// ============================================
interface LocationItemRowProps {
  location: LocationItem;
  onRemove?: () => void;
}

function LocationItemRow({ location, onRemove }: LocationItemRowProps) {
  return (
    <div className="bg-white flex gap-4 h-10 items-center px-3 py-0.5 rounded-[6px] w-full">
      <div className="flex flex-1 gap-2 items-center min-w-0">
        <span className="text-[14px] leading-[20px] text-[#1C2B33] font-optimistic truncate">
          {location.name}
        </span>
        {/* Pin checkmark icon */}
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
          <path fillRule="evenodd" clipRule="evenodd" d="M10 2C6.5 2 4 4.5 4 7.5C4 11.5 9 17 9.5 17.5C9.8 17.8 10.2 17.8 10.5 17.5C11 17 16 11.5 16 7.5C16 4.5 13.5 2 10 2ZM10 10C8.6 10 7.5 8.9 7.5 7.5C7.5 6.1 8.6 5 10 5C11.4 5 12.5 6.1 12.5 7.5C12.5 8.9 11.4 10 10 10Z" fill="#006B4E"/>
          <circle cx="14" cy="14" r="4" fill="#006B4E"/>
          <path d="M12.5 14L13.5 15L15.5 13" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        {location.radius && (
          <button className="flex items-center gap-1 px-3 py-2 text-[14px] leading-[20px] text-[#1C2B33] font-medium hover:bg-[rgba(0,0,0,0.05)] rounded-[4px] transition-colors">
            {location.radius}
            <Icon name="ChevronDown" variant="filled" size={16} className="text-[#283943]" />
          </button>
        )}
      </div>
    </div>
  );
}

// ============================================
// Section Label with Tooltip
// ============================================
interface SectionLabelProps {
  label: string;
  required?: boolean;
  tooltip?: boolean;
  description?: string;
}

function SectionLabel({ label, required, tooltip = true, description }: SectionLabelProps) {
  return (
    <div className="flex flex-col">
      <div className="flex gap-1 items-center">
        <span className="text-[15px] font-bold leading-[20px] text-[#465A69] font-optimistic">
          {required && "*"}{label}
        </span>
        {tooltip && (
          <div className="w-3 h-3 relative cursor-help">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M6 11C8.76142 11 11 8.76142 11 6C11 3.23858 8.76142 1 6 1C3.23858 1 1 3.23858 1 6C1 8.76142 3.23858 11 6 11ZM6.5 3.5C6.5 3.22386 6.27614 3 6 3C5.72386 3 5.5 3.22386 5.5 3.5V3.75C5.5 4.02614 5.72386 4.25 6 4.25C6.27614 4.25 6.5 4.02614 6.5 3.75V3.5ZM6.5 5.5C6.5 5.22386 6.27614 5 6 5C5.72386 5 5.5 5.22386 5.5 5.5V8.5C5.5 8.77614 5.72386 9 6 9C6.27614 9 6.5 8.77614 6.5 8.5V5.5Z" fill="#283943"/>
            </svg>
          </div>
        )}
      </div>
      {description && (
        <span className="text-[14px] leading-[20px] text-[#465A69] font-optimistic">
          {description}
        </span>
      )}
    </div>
  );
}

// ============================================
// Tab Button Component
// ============================================
interface TabButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
  hasDropdown?: boolean;
}

function TabButton({ label, active, onClick, hasDropdown }: TabButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center h-9 px-3 py-2 rounded-[4px] transition-colors",
        active 
          ? "text-[#1C2B33]" 
          : "text-[rgba(28,43,51,0.65)] hover:bg-[rgba(0,0,0,0.05)]"
      )}
    >
      <span className="text-[14px] font-medium leading-[20px] font-optimistic">
        {label}
      </span>
      {hasDropdown && (
        <Icon name="ChevronDown" variant="filled" size={16} className="ml-1 text-[#283943]" />
      )}
    </button>
  );
}

// ============================================
// Gender Radio Button
// ============================================
interface GenderRadioProps {
  label: string;
  value: string;
  selected: boolean;
  onSelect: () => void;
}

function GenderRadio({ label, selected, onSelect }: GenderRadioProps) {
  return (
    <label className="flex items-center gap-2 py-1 cursor-pointer">
      <div 
        className={cn(
          "w-6 h-6 rounded-full border shrink-0 flex items-center justify-center",
          "border-[#CBD2D9] bg-white"
        )}
      >
        {selected && (
          <div className="w-3 h-3 rounded-full bg-[#0A78BE]" />
        )}
      </div>
      <span className="text-[14px] leading-[20px] text-[#1C2B33]">
        {label}
      </span>
    </label>
  );
}

// ============================================
// Age Dropdown Trigger
// ============================================
interface AgeDropdownProps {
  value: string;
  isOpen: boolean;
}

function AgeDropdownTrigger({ value, isOpen }: AgeDropdownProps) {
  return (
    <div 
      className={cn(
        "flex items-center justify-between px-3 h-9 cursor-pointer rounded-[4px] border",
        isOpen 
          ? "border-[#1877F2] ring-1 ring-[#1877F2] bg-white" 
          : "border-[#CBD2D9] bg-white hover:bg-[rgba(0,0,0,0.05)]"
      )}
    >
      <span className="text-[14px] font-medium leading-[20px] text-[#1C2B33] font-optimistic">
        {value}
      </span>
      <Icon name="ChevronDown" variant="filled" size={16} className="text-[#283943] ml-1" />
    </div>
  );
}

// ============================================
// Main Modal Component
// ============================================
export function EditAudienceModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: EditAudienceModalProps) {
  const defaultData: AudienceData = {
    locations: [
      { id: "1", name: "United States" },
      { id: "2", name: "San Francisco Bay Area Place", radius: "+12mi" },
    ],
    ageMin: "18",
    ageMax: "65+",
    gender: "all",
    languages: "All languages",
    detailedTargeting: "",
    customAudiences: "",
  };

  const [activeTab, setActiveTab] = useState<"create" | "saved">("create");
  const [locations, setLocations] = useState(initialData?.locations || defaultData.locations);
  const [ageMin, setAgeMin] = useState(initialData?.ageMin || defaultData.ageMin);
  const [ageMax, setAgeMax] = useState(initialData?.ageMax || defaultData.ageMax);
  const [gender, setGender] = useState<"all" | "men" | "women">(initialData?.gender || defaultData.gender);
  const [searchLocation, setSearchLocation] = useState("Thailand");
  const [isExpanded, setIsExpanded] = useState(true);

  // Age options
  const minAgeOptions = ["13", "14", "15", "16", "17", "18", "21", "25", "30", "35", "40", "45", "50", "55", "60"];
  const maxAgeOptions = ["18", "21", "25", "30", "35", "40", "45", "50", "55", "60", "65+"];

  const handleSave = () => {
    onSave?.({
      locations,
      ageMin,
      ageMax,
      gender,
      languages: "All languages",
      detailedTargeting: "",
      customAudiences: "",
    });
    onClose();
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

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="bg-white rounded-[8px] shadow-[0px_8px_24px_4px_rgba(0,0,0,0.1),0px_2px_2px_0px_rgba(0,0,0,0.1)] w-[600px] max-w-[calc(100vw-80px)] h-[600px] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pl-4 pr-2 py-0 bg-white shrink-0">
          <div className="flex-1 flex flex-col justify-center py-4 pr-2 min-w-0">
            <h2 className="text-[20px] font-bold leading-[24px] text-[#1C2B33] font-optimistic">
              Edit audience
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
        <div className="flex-1 overflow-y-auto">
          {/* Audience Card */}
          <div className="bg-white shadow-[0px_0px_1px_0px_rgba(0,0,0,0.1),0px_0px_4px_0px_rgba(0,0,0,0.1)] mx-4 rounded-[4px]">
            {/* Card Header */}
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full flex items-center justify-between px-4 py-2 hover:bg-[rgba(0,0,0,0.02)] transition-colors"
            >
              <span className="text-[15px] font-bold leading-[20px] text-[#1C2B33] font-optimistic">
                Audience
              </span>
              <div className={cn("transition-transform", isExpanded ? "" : "-rotate-90")}>
                <Icon name="ChevronDown" variant="outlined" size={16} className="text-[#283943]" />
              </div>
            </button>

            {/* Divider */}
            <div className="h-px bg-[#CBD2D9]" />

            {/* Card Content */}
            {isExpanded && (
              <div className="p-4 space-y-4">
                {/* Tabs */}
                <div className="flex flex-col gap-px">
                  <div className="flex gap-2">
                    <TabButton
                      label="Create new audience"
                      active={activeTab === "create"}
                      onClick={() => setActiveTab("create")}
                    />
                    <TabButton
                      label="Use saved audience"
                      active={activeTab === "saved"}
                      onClick={() => setActiveTab("saved")}
                      hasDropdown
                    />
                  </div>
                  {/* Tab indicator line */}
                  <div className="relative h-0.5 w-full">
                    <div 
                      className={cn(
                        "absolute h-0.5 bg-[#1C2B33] transition-all",
                        activeTab === "create" ? "left-0 w-[160px]" : "left-[168px] w-[140px]"
                      )}
                    />
                  </div>
                  <div className="h-px bg-[#CBD2D9]" />
                </div>

                {/* Locations Section */}
                <div className="space-y-2">
                  <SectionLabel
                    label="Locations"
                    required
                    description="Reach people living in or recently in this location."
                  />

                  {/* Locations Container */}
                  <div className="bg-[#F1F4F7] rounded-[6px]">
                    {/* Header */}
                    <div className="px-3 pt-3 pb-2">
                      <span className="text-[12px] leading-[20px] text-[#1C2B33]">
                        United States
                      </span>
                    </div>

                    {/* Location Items */}
                    <div className="px-3 pb-3 space-y-2">
                      {locations.map((location) => (
                        <LocationItemRow key={location.id} location={location} />
                      ))}
                    </div>
                  </div>

                  {/* Search Input */}
                  <div className="relative flex items-center h-[38px] bg-white border border-[#0A78BE] overflow-hidden">
                    <div className="flex items-center gap-2 px-2.5">
                      {/* Pin checkmark icon */}
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                        <path fillRule="evenodd" clipRule="evenodd" d="M8 1.5C5.5 1.5 3.5 3.5 3.5 6C3.5 9 7.5 13.5 8 14C8.5 13.5 12.5 9 12.5 6C12.5 3.5 10.5 1.5 8 1.5ZM8 8C6.9 8 6 7.1 6 6C6 4.9 6.9 4 8 4C9.1 4 10 4.9 10 6C10 7.1 9.1 8 8 8Z" fill="#006B4E"/>
                        <circle cx="11" cy="11" r="3" fill="#006B4E"/>
                        <path d="M10 11L10.75 11.75L12 10.5" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="text-[14px] leading-[20px] text-[#465A69]">Include</span>
                      <Icon name="ChevronDown" variant="filled" size={16} className="text-[#283943]" />
                      <Icon name="Search" variant="filled" size={16} className="text-[#283943]" />
                      <input
                        type="text"
                        value={searchLocation}
                        onChange={(e) => setSearchLocation(e.target.value)}
                        className="flex-1 text-[14px] leading-[20px] text-[#1C2B33] outline-none bg-transparent"
                      />
                    </div>
                    <span className="absolute right-2.5 text-[14px] leading-[20px] text-[#1C2B33]">
                      Browse
                    </span>
                    {/* Focus ring effect */}
                    <div className="absolute inset-0 pointer-events-none shadow-[inset_4px_0px_0px_0px_#DAE4F8,inset_-4px_0px_0px_0px_#DAE4F8,inset_0px_-4px_0px_0px_#DAE4F8,inset_0px_4px_0px_0px_#DAE4F8]" />
                  </div>

                  <button className="text-[12px] leading-[16px] text-[#0A78BE] hover:underline">
                    Add Locations in Bulk
                  </button>
                </div>

                {/* Divider */}
                <div className="h-px bg-[#CBD2D9]" />

                {/* Age Section */}
                <div className="space-y-2">
                  <SectionLabel label="Age" />
                  <div className="flex items-center gap-0">
                    {/* Min Age Dropdown */}
                    <Dropdown
                      trigger={({ isOpen }) => (
                        <div 
                          className={cn(
                            "flex items-center justify-between px-3 h-9 w-[86px] cursor-pointer border-y border-l rounded-l-[4px]",
                            isOpen 
                              ? "border-[#1877F2] ring-1 ring-[#1877F2] bg-white z-10" 
                              : "border-[#CBD2D9] bg-white hover:bg-[rgba(0,0,0,0.05)]"
                          )}
                        >
                          <span className="text-[14px] font-medium leading-[20px] text-[#1C2B33] font-optimistic">
                            {ageMin}
                          </span>
                          <Icon name="ChevronDown" variant="filled" size={16} className="text-[#283943] ml-1" />
                        </div>
                      )}
                      width={120}
                    >
                      <Dropdown.List maxHeight={200}>
                        {minAgeOptions.map((age) => (
                          <Dropdown.Item
                            key={age}
                            label={age}
                            selectionType="radio"
                            selected={ageMin === age}
                            onSelectionChange={() => setAgeMin(age)}
                          />
                        ))}
                      </Dropdown.List>
                    </Dropdown>
                    
                    {/* Max Age Dropdown */}
                    <Dropdown
                      trigger={({ isOpen }) => (
                        <div 
                          className={cn(
                            "flex items-center justify-between px-3 h-9 w-[86px] cursor-pointer border rounded-r-[4px] -ml-px",
                            isOpen 
                              ? "border-[#1877F2] ring-1 ring-[#1877F2] bg-white z-10" 
                              : "border-[#CBD2D9] bg-white hover:bg-[rgba(0,0,0,0.05)]"
                          )}
                        >
                          <span className="text-[14px] font-medium leading-[20px] text-[#1C2B33] font-optimistic">
                            {ageMax}
                          </span>
                          <Icon name="ChevronDown" variant="filled" size={16} className="text-[#283943] ml-1" />
                        </div>
                      )}
                      width={120}
                    >
                      <Dropdown.List maxHeight={200}>
                        {maxAgeOptions.map((age) => (
                          <Dropdown.Item
                            key={age}
                            label={age}
                            selectionType="radio"
                            selected={ageMax === age}
                            onSelectionChange={() => setAgeMax(age)}
                          />
                        ))}
                      </Dropdown.List>
                    </Dropdown>
                  </div>
                </div>

                {/* Gender Section */}
                <div className="space-y-2">
                  <SectionLabel label="Gender" />
                  <div className="flex items-center gap-3 h-8">
                    <GenderRadio
                      label="All"
                      value="all"
                      selected={gender === "all"}
                      onSelect={() => setGender("all")}
                    />
                    <GenderRadio
                      label="Men"
                      value="men"
                      selected={gender === "men"}
                      onSelect={() => setGender("men")}
                    />
                    <GenderRadio
                      label="Women"
                      value="women"
                      selected={gender === "women"}
                      onSelect={() => setGender("women")}
                    />
                  </div>
                </div>

                {/* Languages Section */}
                <div className="space-y-1">
                  <SectionLabel label="Languages" />
                  <span className="text-[14px] leading-[20px] text-[#465A69] font-optimistic">
                    All languages
                  </span>
                </div>

                {/* Detailed Targeting Section */}
                <div className="space-y-1">
                  <SectionLabel label="Detailed targeting" description="Include people who match" />
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <Icon name="Search" variant="outlined" size={16} className="text-[#283943]" />
                    </div>
                    <input
                      type="text"
                      placeholder="Add demographics, interset or behaviors"
                      className="w-full h-9 pl-10 pr-3 border border-[#CBD2D9] rounded-[4px] bg-white text-[14px] leading-[20px] placeholder:text-[rgba(28,43,51,0.65)] outline-none focus:border-[#1877F2] focus:ring-1 focus:ring-[#1877F2] transition-colors hover:bg-[rgba(0,0,0,0.05)] focus:bg-white"
                    />
                  </div>
                </div>

                {/* Custom Audiences Section */}
                <div className="space-y-1">
                  <SectionLabel label="Custom audiences" />
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      <Icon name="Search" variant="outlined" size={16} className="text-[#283943]" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search existing audiences"
                      className="w-full h-9 pl-10 pr-3 border border-[#CBD2D9] rounded-[4px] bg-white text-[14px] leading-[20px] placeholder:text-[rgba(28,43,51,0.65)] outline-none focus:border-[#1877F2] focus:ring-1 focus:ring-[#1877F2] transition-colors hover:bg-[rgba(0,0,0,0.05)] focus:bg-white"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-2 px-4 pt-3 pb-4 bg-white shrink-0">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ============================================
// Preview Component for Modal Gallery
// ============================================
export function EditAudienceModalPreview() {
  const [activeTab, setActiveTab] = useState<"create" | "saved">("create");
  const [ageMin, setAgeMin] = useState("18");
  const [ageMax, setAgeMax] = useState("65+");
  const [gender, setGender] = useState<"all" | "men" | "women">("all");
  const [isExpanded, setIsExpanded] = useState(true);
  const [searchLocation, setSearchLocation] = useState("Thailand");

  const locations = [
    { id: "1", name: "United States" },
    { id: "2", name: "San Francisco Bay Area Place", radius: "+12mi" },
  ];

  const minAgeOptions = ["13", "14", "15", "16", "17", "18", "21", "25", "30", "35", "40", "45", "50", "55", "60"];
  const maxAgeOptions = ["18", "21", "25", "30", "35", "40", "45", "50", "55", "60", "65+"];

  return (
    <div className="bg-white rounded-[8px] shadow-[0px_8px_24px_4px_rgba(0,0,0,0.1),0px_2px_2px_0px_rgba(0,0,0,0.1)] w-[600px] h-[600px] overflow-hidden flex flex-col">
      {/* Modal Header */}
      <div className="flex items-center justify-between pl-4 pr-2 py-0 bg-white shrink-0">
        <div className="flex-1 flex flex-col justify-center py-4 pr-2 min-w-0">
          <h2 className="text-[20px] font-bold leading-[24px] text-[#1C2B33] font-optimistic">
            Edit audience
          </h2>
        </div>
        <div className="flex items-start py-2">
          <button className="p-3 hover:bg-[rgba(0,0,0,0.05)] rounded-[4px] transition-colors">
            <Icon name="Close" variant="outlined" size={16} className="text-[#283943]" />
          </button>
        </div>
      </div>

      {/* Modal Body */}
      <div className="flex-1 overflow-y-auto">
        {/* Audience Card */}
        <div className="bg-white shadow-[0px_0px_1px_0px_rgba(0,0,0,0.1),0px_0px_4px_0px_rgba(0,0,0,0.1)] mx-4 rounded-[4px]">
          {/* Card Header */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between px-4 py-2 hover:bg-[rgba(0,0,0,0.02)] transition-colors"
          >
            <span className="text-[15px] font-bold leading-[20px] text-[#1C2B33] font-optimistic">
              Audience
            </span>
            <div className={cn("transition-transform", isExpanded ? "" : "-rotate-90")}>
              <Icon name="ChevronDown" variant="outlined" size={16} className="text-[#283943]" />
            </div>
          </button>

          {/* Divider */}
          <div className="h-px bg-[#CBD2D9]" />

          {/* Card Content */}
          {isExpanded && (
            <div className="p-4 space-y-4">
              {/* Tabs */}
              <div className="flex flex-col gap-px">
                <div className="flex gap-2">
                  <TabButton
                    label="Create new audience"
                    active={activeTab === "create"}
                    onClick={() => setActiveTab("create")}
                  />
                  <TabButton
                    label="Use saved audience"
                    active={activeTab === "saved"}
                    onClick={() => setActiveTab("saved")}
                    hasDropdown
                  />
                </div>
                {/* Tab indicator line */}
                <div className="relative h-0.5 w-full">
                  <div 
                    className={cn(
                      "absolute h-0.5 bg-[#1C2B33] transition-all",
                      activeTab === "create" ? "left-0 w-[160px]" : "left-[168px] w-[140px]"
                    )}
                  />
                </div>
                <div className="h-px bg-[#CBD2D9]" />
              </div>

              {/* Locations Section */}
              <div className="space-y-2">
                <SectionLabel
                  label="Locations"
                  required
                  description="Reach people living in or recently in this location."
                />

                {/* Locations Container */}
                <div className="bg-[#F1F4F7] rounded-[6px]">
                  {/* Header */}
                  <div className="px-3 pt-3 pb-2">
                    <span className="text-[12px] leading-[20px] text-[#1C2B33]">
                      United States
                    </span>
                  </div>

                  {/* Location Items */}
                  <div className="px-3 pb-3 space-y-2">
                    {locations.map((location) => (
                      <LocationItemRow key={location.id} location={location} />
                    ))}
                  </div>
                </div>

                {/* Search Input */}
                <div className="relative flex items-center h-[38px] bg-white border border-[#0A78BE] overflow-hidden">
                  <div className="flex items-center gap-2 px-2.5">
                    {/* Pin checkmark icon */}
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                      <path fillRule="evenodd" clipRule="evenodd" d="M8 1.5C5.5 1.5 3.5 3.5 3.5 6C3.5 9 7.5 13.5 8 14C8.5 13.5 12.5 9 12.5 6C12.5 3.5 10.5 1.5 8 1.5ZM8 8C6.9 8 6 7.1 6 6C6 4.9 6.9 4 8 4C9.1 4 10 4.9 10 6C10 7.1 9.1 8 8 8Z" fill="#006B4E"/>
                      <circle cx="11" cy="11" r="3" fill="#006B4E"/>
                      <path d="M10 11L10.75 11.75L12 10.5" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-[14px] leading-[20px] text-[#465A69]">Include</span>
                    <Icon name="ChevronDown" variant="filled" size={16} className="text-[#283943]" />
                    <Icon name="Search" variant="filled" size={16} className="text-[#283943]" />
                    <input
                      type="text"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      className="flex-1 text-[14px] leading-[20px] text-[#1C2B33] outline-none bg-transparent"
                    />
                  </div>
                  <span className="absolute right-2.5 text-[14px] leading-[20px] text-[#1C2B33]">
                    Browse
                  </span>
                  {/* Focus ring effect */}
                  <div className="absolute inset-0 pointer-events-none shadow-[inset_4px_0px_0px_0px_#DAE4F8,inset_-4px_0px_0px_0px_#DAE4F8,inset_0px_-4px_0px_0px_#DAE4F8,inset_0px_4px_0px_0px_#DAE4F8]" />
                </div>

                <button className="text-[12px] leading-[16px] text-[#0A78BE] hover:underline">
                  Add Locations in Bulk
                </button>
              </div>

              {/* Divider */}
              <div className="h-px bg-[#CBD2D9]" />

              {/* Age Section */}
              <div className="space-y-2">
                <SectionLabel label="Age" />
                <div className="flex items-center gap-0">
                  {/* Min Age Dropdown */}
                  <Dropdown
                    trigger={({ isOpen }) => (
                      <div 
                        className={cn(
                          "flex items-center justify-between px-3 h-9 w-[86px] cursor-pointer border-y border-l rounded-l-[4px]",
                          isOpen 
                            ? "border-[#1877F2] ring-1 ring-[#1877F2] bg-white z-10" 
                            : "border-[#CBD2D9] bg-white hover:bg-[rgba(0,0,0,0.05)]"
                        )}
                      >
                        <span className="text-[14px] font-medium leading-[20px] text-[#1C2B33] font-optimistic">
                          {ageMin}
                        </span>
                        <Icon name="ChevronDown" variant="filled" size={16} className="text-[#283943] ml-1" />
                      </div>
                    )}
                    width={120}
                  >
                    <Dropdown.List maxHeight={200}>
                      {minAgeOptions.map((age) => (
                        <Dropdown.Item
                          key={age}
                          label={age}
                          selectionType="radio"
                          selected={ageMin === age}
                          onSelectionChange={() => setAgeMin(age)}
                        />
                      ))}
                    </Dropdown.List>
                  </Dropdown>
                  
                  {/* Max Age Dropdown */}
                  <Dropdown
                    trigger={({ isOpen }) => (
                      <div 
                        className={cn(
                          "flex items-center justify-between px-3 h-9 w-[86px] cursor-pointer border rounded-r-[4px] -ml-px",
                          isOpen 
                            ? "border-[#1877F2] ring-1 ring-[#1877F2] bg-white z-10" 
                            : "border-[#CBD2D9] bg-white hover:bg-[rgba(0,0,0,0.05)]"
                        )}
                      >
                        <span className="text-[14px] font-medium leading-[20px] text-[#1C2B33] font-optimistic">
                          {ageMax}
                        </span>
                        <Icon name="ChevronDown" variant="filled" size={16} className="text-[#283943] ml-1" />
                      </div>
                    )}
                    width={120}
                  >
                    <Dropdown.List maxHeight={200}>
                      {maxAgeOptions.map((age) => (
                        <Dropdown.Item
                          key={age}
                          label={age}
                          selectionType="radio"
                          selected={ageMax === age}
                          onSelectionChange={() => setAgeMax(age)}
                        />
                      ))}
                    </Dropdown.List>
                  </Dropdown>
                </div>
              </div>

              {/* Gender Section */}
              <div className="space-y-2">
                <SectionLabel label="Gender" />
                <div className="flex items-center gap-3 h-8">
                  <GenderRadio
                    label="All"
                    value="all"
                    selected={gender === "all"}
                    onSelect={() => setGender("all")}
                  />
                  <GenderRadio
                    label="Men"
                    value="men"
                    selected={gender === "men"}
                    onSelect={() => setGender("men")}
                  />
                  <GenderRadio
                    label="Women"
                    value="women"
                    selected={gender === "women"}
                    onSelect={() => setGender("women")}
                  />
                </div>
              </div>

              {/* Languages Section */}
              <div className="space-y-1">
                <SectionLabel label="Languages" />
                <span className="text-[14px] leading-[20px] text-[#465A69] font-optimistic">
                  All languages
                </span>
              </div>

              {/* Detailed Targeting Section */}
              <div className="space-y-1">
                <SectionLabel label="Detailed targeting" description="Include people who match" />
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Icon name="Search" variant="outlined" size={16} className="text-[#283943]" />
                  </div>
                  <input
                    type="text"
                    placeholder="Add demographics, interset or behaviors"
                    className="w-full h-9 pl-10 pr-3 border border-[#CBD2D9] rounded-[4px] bg-white text-[14px] leading-[20px] placeholder:text-[rgba(28,43,51,0.65)] outline-none focus:border-[#1877F2] focus:ring-1 focus:ring-[#1877F2] transition-colors hover:bg-[rgba(0,0,0,0.05)] focus:bg-white"
                  />
                </div>
              </div>

              {/* Custom Audiences Section */}
              <div className="space-y-1">
                <SectionLabel label="Custom audiences" />
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Icon name="Search" variant="outlined" size={16} className="text-[#283943]" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search existing audiences"
                    className="w-full h-9 pl-10 pr-3 border border-[#CBD2D9] rounded-[4px] bg-white text-[14px] leading-[20px] placeholder:text-[rgba(28,43,51,0.65)] outline-none focus:border-[#1877F2] focus:ring-1 focus:ring-[#1877F2] transition-colors hover:bg-[rgba(0,0,0,0.05)] focus:bg-white"
                  />
                </div>
              </div>
            </div>
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

