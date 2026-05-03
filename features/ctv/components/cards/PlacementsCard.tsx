"use client";

import { useState } from "react";
import { Icon } from "@/features/ctv/components/ui/Icon";
import type { PrototypeVersion } from "./types";

interface PlacementsCardProps {
  version: PrototypeVersion;
  className?: string;
  isTVMode?: boolean;
  onTVModeChange?: (isTVMode: boolean) => void;
  /** Whether to show settings expanded by default */
  defaultShowSettings?: boolean;
  /** Which section to expand by default */
  defaultExpandedSection?: "devices" | "platforms" | "placementControls" | null;
  /** Enable mixed placement mode where both Mobile/Desktop and TV can be selected via checkboxes */
  mixedPlacementMode?: boolean;
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

function PencilIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path 
        fillRule="evenodd" 
        clipRule="evenodd" 
        d="M11.2929 1.29289C11.6834 0.902369 12.3166 0.902369 12.7071 1.29289L14.7071 3.29289C15.0976 3.68342 15.0976 4.31658 14.7071 4.70711L5.70711 13.7071C5.51957 13.8946 5.26522 14 5 14H2C1.44772 14 1 13.5523 1 13V10C1 9.73478 1.10536 9.48043 1.29289 9.29289L10.2929 0.292893C10.6834 -0.0976311 11.3166 -0.0976311 11.7071 0.292893L11.2929 1.29289ZM3 10.4142V12H4.58579L12.5858 4L12 3.41421L3 12.4142V10.4142Z" 
        fill="currentColor"
      />
    </svg>
  );
}

interface FieldRowProps {
  label: string;
  value: string;
  onClick?: () => void;
  expanded?: boolean;
}

function FieldRow({ label, value, onClick, expanded }: FieldRowProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isClickable = !!onClick;
  
  return (
    <div 
      className={`flex py-2 rounded-[1px] transition-colors ${
        isClickable ? "cursor-pointer" : ""
      } ${
        expanded 
          ? "bg-[#F1F4F7] px-2" 
          : isHovered && isClickable
            ? "bg-[#F1F4F7] px-2 -mx-2" 
            : ""
      }`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex-1 flex flex-col">
        <span className="font-optimistic font-bold text-[14px] leading-[20px] text-[rgba(0,0,0,0.75)]">
          {label}
        </span>
        {!expanded && (
          <span className="font-optimistic text-[14px] leading-[20px] text-[#465A69]">
            {value}
          </span>
        )}
      </div>
      {expanded && (
        <div className="p-[2px]">
          <Icon name="CaretUp" variant="outlined" size={16} className="text-[#283943]" />
        </div>
      )}
      {isHovered && !expanded && isClickable && (
        <div className="p-[2px] flex items-center">
          <Icon name="CaretDown" variant="outlined" size={16} className="text-[#283943]" />
        </div>
      )}
    </div>
  );
}

interface CheckboxItemProps {
  label: string;
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}

function CheckboxItem({ label, checked, onChange, disabled = false }: CheckboxItemProps) {
  return (
    <div 
      className={`flex items-center gap-2 py-1 ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
      onClick={() => !disabled && onChange()}
    >
      <div className={`w-6 h-6 rounded-[4px] border flex items-center justify-center shrink-0 ${
        disabled 
          ? "bg-[#F1F4F7] border-[rgba(203,210,217,0.6)]" 
          : checked 
            ? "bg-white border-[#CBD2D9]" 
            : "bg-white border-[#CBD2D9]"
      }`}>
        {checked && (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.3334 4L6.00008 11.3333L2.66675 8" stroke="#0A78BE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
      <span className={`font-sf-pro text-[14px] leading-[20px] ${
        disabled ? "text-[rgba(28,43,51,0.6)]" : "text-[#1C2B33]"
      }`}>
        {label}
      </span>
    </div>
  );
}

interface RadioItemProps {
  label: string;
  selected: boolean;
  onChange: () => void;
}

function RadioItem({ label, selected, onChange }: RadioItemProps) {
  return (
    <div 
      className="flex items-center gap-2 px-2 py-1 cursor-pointer"
      onClick={onChange}
    >
      <div className="w-6 h-6 rounded-full border border-[#CBD2D9] bg-white flex items-center justify-center shrink-0">
        {selected && (
          <div className="w-3 h-3 rounded-full bg-[#0A78BE]" />
        )}
      </div>
      <span className="font-optimistic text-[14px] leading-[20px] text-[#1C2B33]">
        {label}
      </span>
    </div>
  );
}

interface SelectFieldProps {
  value: string;
  onChange?: (value: string) => void;
  options?: { value: string; label: string }[];
  isOpen?: boolean;
  onToggle?: () => void;
}

function SelectField({ value, onChange, options, isOpen, onToggle }: SelectFieldProps) {
  return (
    <div className="relative">
      <div 
        className="bg-white border border-[#CBD2D9] rounded h-[36px] flex items-center px-3 justify-between cursor-pointer hover:border-[#0A78BE]"
        onClick={onToggle}
      >
        <span className="font-optimistic text-[14px] leading-[20px] text-[#1C2B33]">
          {value}
        </span>
        <Icon name="SmallTriangleDown" variant="filled" size={16} className="text-[#283943]" />
      </div>
      
      {isOpen && options && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded shadow-[0px_2px_12px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] z-10 py-2 px-3">
          {options.map((option) => (
            <div 
              key={option.value}
              className="flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-[#F1F4F7] rounded"
              onClick={() => {
                onChange?.(option.value);
                onToggle?.();
              }}
            >
              <div className="w-6 h-6 rounded-full border border-[#CBD2D9] bg-white flex items-center justify-center">
                {value === option.label && <div className="w-3 h-3 rounded-full bg-[#0A78BE]" />}
              </div>
              <span className="font-optimistic text-[14px] leading-[20px] text-[#1C2B33]">{option.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface PlacementControlItem {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path 
        fillRule="evenodd" 
        clipRule="evenodd" 
        d="M6 12C9.31371 12 12 9.31371 12 6C12 2.68629 9.31371 0 6 0C2.68629 0 0 2.68629 0 6C0 9.31371 2.68629 12 6 12ZM6 3C5.58579 3 5.25 3.33579 5.25 3.75C5.25 4.16421 5.58579 4.5 6 4.5C6.41421 4.5 6.75 4.16421 6.75 3.75C6.75 3.33579 6.41421 3 6 3ZM5.25 5.5C5.25 5.08579 5.58579 4.75 6 4.75C6.41421 4.75 6.75 5.08579 6.75 5.5V8.5C6.75 8.91421 6.41421 9.25 6 9.25C5.58579 9.25 5.25 8.91421 5.25 8.5V5.5Z" 
        fill="rgba(0,0,0,0.75)"
      />
    </svg>
  );
}

export function PlacementsCard({ 
  version, 
  className = "", 
  isTVMode, 
  onTVModeChange,
  defaultShowSettings = false,
  defaultExpandedSection = null,
  mixedPlacementMode = false,
}: PlacementsCardProps) {
  const isAlpha = version === "alpha-v1";
  
  // For Alpha, use external isTVMode prop; for Before, use internal state
  const effectiveTVMode = isAlpha ? (isTVMode ?? false) : false;
  
  // Default state - can be controlled via props
  const [showSettings, setShowSettings] = useState(defaultShowSettings);
  
  // Expanded section state - only one section can be expanded at a time
  type ExpandedSection = "devices" | "platforms" | "placementControls" | null;
  // Start with the default expanded section from props
  const [expandedSection, setExpandedSection] = useState<ExpandedSection>(defaultExpandedSection);
  
  // Helper to toggle a section (closes others automatically)
  const toggleSection = (section: ExpandedSection) => {
    setExpandedSection(prev => prev === section ? null : section);
  };
  
  // Dropdown states
  const [allDevicesDropdownOpen, setAllDevicesDropdownOpen] = useState(false);
  const [mobileDevicesDropdownOpen, setMobileDevicesDropdownOpen] = useState(false);
  
  // Field values - Before version
  const [devicesValue, setDevicesValue] = useState("Mobile, Desktop");
  const [mobileDevicesValue, setMobileDevicesValue] = useState("All mobile devices");
  const [wifiOnly, setWifiOnly] = useState(false);
  
  // Mixed placement mode - both can be selected via checkboxes
  const [mobileDesktopChecked, setMobileDesktopChecked] = useState(true);
  const [tvChecked, setTvChecked] = useState(true);
  
  // Internal device type for Before version (Alpha uses external isTVMode)
  const [internalDeviceType, setInternalDeviceType] = useState<"mobile-desktop" | "tv">("mobile-desktop");
  
  // Computed device type based on version
  const deviceType = isAlpha ? (effectiveTVMode ? "tv" : "mobile-desktop") : internalDeviceType;
  
  // Handler for device type change in Alpha
  const handleDeviceTypeChange = (newType: "mobile-desktop" | "tv") => {
    if (isAlpha && onTVModeChange) {
      onTVModeChange(newType === "tv");
    } else {
      setInternalDeviceType(newType);
    }
  };
  
  // Platforms checkboxes
  // For Alpha TV mode ON: only Audience Network is checked
  // For Alpha TV mode OFF: all platforms checked (Facebook, Instagram, Audience Network, Messenger, Threads)
  // For Before version: all except WhatsApp are checked
  const getInitialPlatforms = () => {
    // Both Alpha (TV OFF) and Before versions have all platforms checked
    return {
      facebook: true,
      instagram: true,
      audienceNetwork: true,
      messenger: true,
      whatsapp: false,
      threads: true,
    };
  };
  const [platforms, setPlatforms] = useState(getInitialPlatforms());
  
  // Placement controls - base data (checked/disabled states computed based on version)
  // Connected TV is only shown when TV Mode is ON
  const placementControlsData: PlacementControlItem[] = [
    { id: "feeds", label: "Feeds", description: "Get high visibility for your business with ads in feeds", checked: false },
    { id: "stories-reels", label: "Stories and Reels", description: "Tell a rich, visual story with immersive, fullscreen vertical ads.", checked: false },
    { id: "in-stream", label: "In-stream ads for videos and reels", description: "Reach people before, during or after they watch a video or reel", checked: false },
    { id: "search", label: "Search results", description: "Get visibility for your business as people search", checked: false },
    { id: "apps-sites", label: "Apps and sites", description: "Expand your reach with ads in external apps and websites.", checked: false },
  ];

  // Only render for "before" and "alpha-v1" versions
  if (version !== "before" && version !== "alpha-v1") {
    return null;
  }

  // Compute placement controls based on version
  const getPlacementControls = (): PlacementControlItem[] => {
    if (mixedPlacementMode) {
      // Mixed Placement Mode: All controls enabled and checked, including Connected TV
      const mixedModeControls = [
        ...placementControlsData,
        { id: "connected-tv", label: "Connected TV", description: "Reach people streaming content on TV screens.", checked: true },
      ];
      return mixedModeControls.map(control => ({
        ...control,
        checked: true,
        disabled: false,
      }));
    }
    if (isAlpha && effectiveTVMode) {
      // Alpha with TV Mode ON: Add Connected TV, all items disabled except Connected TV, only Connected TV is checked
      const tvModeControls = [
        ...placementControlsData,
        { id: "connected-tv", label: "Connected TV", description: "Reach people streaming content on TV screens.", checked: true },
      ];
      return tvModeControls.map(control => ({
        ...control,
        checked: control.id === "connected-tv",
        disabled: control.id !== "connected-tv",
      }));
    }
    // TV Mode OFF (both Sales and Awareness) / Before version: All placement controls are checked, no Connected TV
    return placementControlsData.map(control => ({
      ...control,
      checked: true,
      disabled: false,
    }));
  };

  const placementControls = getPlacementControls();

  // Get display values based on version
  const getDevicesDisplayValue = () => {
    if (mixedPlacementMode) {
      const parts = [];
      if (mobileDesktopChecked) parts.push("Mobile, Desktop");
      if (tvChecked) parts.push("TV");
      return parts.length > 0 ? parts.join(", ") : "None selected";
    }
    if (isAlpha) {
      return deviceType === "tv" ? "TV" : "Mobile, Desktop";
    }
    return "All";
  };

  const getPlatformsDisplayValue = () => {
    if (mixedPlacementMode) {
      // In mixed mode, show all selected platforms
      const selectedPlatforms = [];
      if (platforms.facebook) selectedPlatforms.push("Facebook");
      if (platforms.instagram) selectedPlatforms.push("Instagram");
      if (platforms.audienceNetwork) selectedPlatforms.push("Audience Network");
      if (platforms.messenger) selectedPlatforms.push("Messenger");
      if (platforms.threads) selectedPlatforms.push("Threads");
      
      if (selectedPlatforms.length === 5) {
        return "Facebook, Instagram, Audience Network, Messenger and Threads";
      } else if (selectedPlatforms.length === 0) {
        return "None selected";
      } else {
        return selectedPlatforms.join(", ");
      }
    }
    if (isAlpha && effectiveTVMode) {
      return "Audience Network";
    }
    // TV Mode OFF (both Sales and Awareness) - show all platforms
    return "Facebook, Instagram, Audience Network, Messenger and Threads";
  };

  const getPlacementControlsDisplayValue = () => {
    if (mixedPlacementMode) {
      return "All available placements included";
    }
    if (isAlpha && effectiveTVMode) {
      return "Connected TV";
    }
    return "All available placements included";
  };

  // Mobile device options for dropdown
  const mobileDeviceOptions = [
    { value: "all-mobile", label: "All mobile devices" },
    { value: "android", label: "Android devices only" },
    { value: "ios", label: "iOS devices only" },
    { value: "feature", label: "Feature phones only" },
  ];

  // All devices options
  const allDevicesOptions = [
    { value: "all", label: "All devices (recommended)" },
    { value: "mobile-only", label: "Mobile only" },
    { value: "desktop-only", label: "Desktop only" },
  ];

  // Mixed placement mode devices options (different from allDevicesOptions)
  const mixedDevicesOptions = [
    { value: "mobile-desktop", label: "Mobile, Desktop" },
    { value: "mobile-only", label: "Mobile only" },
    { value: "desktop-only", label: "Desktop only" },
  ];

  const handleCloseAllDropdowns = () => {
    setAllDevicesDropdownOpen(false);
    setMobileDevicesDropdownOpen(false);
  };

  return (
    <div className={`bg-white rounded-[4px] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.1),0px_0px_4px_0px_rgba(0,0,0,0.1)] p-4 w-[600px] flex flex-col gap-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 h-5">
          <CheckCircleIcon />
          <span className="font-optimistic font-bold text-[16px] leading-[20px] text-[#1C2B33]">
            Placements
          </span>
        </div>
        <AdvantagePill />
      </div>

      {/* Description */}
      <p className="font-optimistic text-[14px] leading-[20px] text-[#1C2B33]">
        We&apos;ll automatically show your ads in the places where people are likely to respond. Only exclude placements if there is no other way to achieve your business goals.
        <br />
        <span className="text-[#0A78BE] cursor-pointer hover:underline">About alternatives to excluding placements</span>
      </p>

      {/* Account controls - always visible */}
      <div className="py-2">
        <div className="flex items-center gap-1">
          <span className="font-optimistic font-bold text-[14px] leading-[20px] text-[rgba(0,0,0,0.75)]">
            Account controls
          </span>
          <InfoIcon />
        </div>
        <p className={`font-optimistic text-[14px] leading-[20px] ${
          isAlpha && effectiveTVMode ? "text-[#A7B3BF]" : "text-[#1C2B33]"
        }`}>
          {isAlpha && effectiveTVMode
            ? "Not applicable for TV campaigns" 
            : "Excluded placements: None"
          }
        </p>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-[#CBD2D9]" />

      {/* Show/Hide settings toggle */}
      <button
        className="flex items-center gap-1 text-[#0A78BE] font-optimistic font-medium text-[14px] leading-[20px] hover:underline"
        onClick={() => setShowSettings(!showSettings)}
      >
        <span>{showSettings ? "Hide settings" : "Show more settings"}</span>
        <Icon
          name={showSettings ? "SmallTriangleUp" : "SmallTriangleDown"}
          variant="filled"
          size={16}
          className="text-[#0A78BE]"
        />
      </button>

      {/* Fields */}
      {showSettings && (
        <div className="flex flex-col gap-2">
          {/* Devices and operating systems */}
          {expandedSection === "devices" ? (
            <div className="bg-[#F1F4F7] rounded-[1px] py-2 px-2">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection("devices")}
              >
                <span className="font-optimistic font-bold text-[14px] leading-[20px] text-[rgba(0,0,0,0.75)]">
                  Devices and operating systems
                </span>
                <div className="p-[2px]">
                  <Icon name="CaretUp" variant="outlined" size={16} className="text-[#283943]" />
                </div>
              </div>
              
              {/* Content area */}
              <div className="bg-white rounded-[6px] mt-2 p-2">
                {mixedPlacementMode ? (
                  /* Mixed Placement Mode - Checkboxes for both Mobile/Desktop AND TV */
                  <div className="flex flex-col gap-2">
                    {/* Mobile and Desktop checkbox */}
                    <CheckboxItem
                      label="Mobile and Desktop"
                      checked={mobileDesktopChecked}
                      onChange={() => setMobileDesktopChecked(!mobileDesktopChecked)}
                    />
                    
                    {/* Show additional dropdowns when Mobile and Desktop is checked */}
                    {mobileDesktopChecked && (
                      <div className="ml-8 flex flex-col gap-2">
                        <SelectField
                          value={devicesValue}
                          onChange={(v) => {
                            const opt = mixedDevicesOptions.find(o => o.value === v);
                            if (opt) setDevicesValue(opt.label);
                          }}
                          options={mixedDevicesOptions}
                          isOpen={allDevicesDropdownOpen}
                          onToggle={() => {
                            handleCloseAllDropdowns();
                            setAllDevicesDropdownOpen(!allDevicesDropdownOpen);
                          }}
                        />
                        <SelectField
                          value={mobileDevicesValue}
                          onChange={(v) => {
                            const opt = mobileDeviceOptions.find(o => o.value === v);
                            if (opt) setMobileDevicesValue(opt.label);
                          }}
                          options={mobileDeviceOptions}
                          isOpen={mobileDevicesDropdownOpen}
                          onToggle={() => {
                            handleCloseAllDropdowns();
                            setMobileDevicesDropdownOpen(!mobileDevicesDropdownOpen);
                          }}
                        />
                        <CheckboxItem
                          label="Only when connected to Wi-Fi"
                          checked={wifiOnly}
                          onChange={() => setWifiOnly(!wifiOnly)}
                        />
                      </div>
                    )}
                    
                    {/* TV checkbox */}
                    <CheckboxItem
                      label="TV"
                      checked={tvChecked}
                      onChange={() => setTvChecked(!tvChecked)}
                    />
                  </div>
                ) : isAlpha ? (
                  /* Alpha version - Radio buttons for Mobile/Desktop vs TV */
                  <>
                    <RadioItem
                      label="Mobile and Desktop"
                      selected={deviceType === "mobile-desktop"}
                      onChange={() => handleDeviceTypeChange("mobile-desktop")}
                    />
                    
                    {/* Show additional dropdowns when Mobile and Desktop selected */}
                    {deviceType === "mobile-desktop" && (
                      <div className="ml-8 mt-2 flex flex-col gap-2">
                        <SelectField
                          value={devicesValue}
                          onChange={(v) => {
                            const opt = allDevicesOptions.find(o => o.value === v);
                            if (opt) setDevicesValue(opt.label);
                          }}
                          options={allDevicesOptions}
                          isOpen={allDevicesDropdownOpen}
                          onToggle={() => {
                            handleCloseAllDropdowns();
                            setAllDevicesDropdownOpen(!allDevicesDropdownOpen);
                          }}
                        />
                        <SelectField
                          value={mobileDevicesValue}
                          onChange={(v) => {
                            const opt = mobileDeviceOptions.find(o => o.value === v);
                            if (opt) setMobileDevicesValue(opt.label);
                          }}
                          options={mobileDeviceOptions}
                          isOpen={mobileDevicesDropdownOpen}
                          onToggle={() => {
                            handleCloseAllDropdowns();
                            setMobileDevicesDropdownOpen(!mobileDevicesDropdownOpen);
                          }}
                        />
                        <CheckboxItem
                          label="Only when connected to Wi-Fi"
                          checked={wifiOnly}
                          onChange={() => setWifiOnly(!wifiOnly)}
                        />
                      </div>
                    )}
                    
                    <RadioItem
                      label="TV"
                      selected={deviceType === "tv"}
                      onChange={() => handleDeviceTypeChange("tv")}
                    />
                  </>
                ) : (
                  /* Before version - Dropdowns for all devices and mobile devices */
                  <>
                    <SelectField
                      value={devicesValue}
                      onChange={(v) => {
                        const opt = allDevicesOptions.find(o => o.value === v);
                        if (opt) setDevicesValue(opt.label);
                      }}
                      options={allDevicesOptions}
                      isOpen={allDevicesDropdownOpen}
                      onToggle={() => {
                        handleCloseAllDropdowns();
                        setAllDevicesDropdownOpen(!allDevicesDropdownOpen);
                      }}
                    />
                    <div className="mt-2">
                      <SelectField
                        value={mobileDevicesValue}
                        onChange={(v) => {
                          const opt = mobileDeviceOptions.find(o => o.value === v);
                          if (opt) setMobileDevicesValue(opt.label);
                        }}
                        options={mobileDeviceOptions}
                        isOpen={mobileDevicesDropdownOpen}
                        onToggle={() => {
                          handleCloseAllDropdowns();
                          setMobileDevicesDropdownOpen(!mobileDevicesDropdownOpen);
                        }}
                      />
                    </div>
                    <div className="mt-2">
                      <CheckboxItem
                        label="Only when connected to Wi-Fi"
                        checked={wifiOnly}
                        onChange={() => setWifiOnly(!wifiOnly)}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <FieldRow
              label="Devices and operating systems"
              value={getDevicesDisplayValue()}
              onClick={() => toggleSection("devices")}
            />
          )}

          {/* Platforms */}
          {expandedSection === "platforms" ? (
            <div className="bg-[#F1F4F7] rounded-[1px] py-2 px-2">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection("platforms")}
              >
                <span className="font-optimistic font-bold text-[14px] leading-[20px] text-[rgba(0,0,0,0.75)]">
                  Platforms
                </span>
                <div className="p-[2px]">
                  <Icon name="CaretUp" variant="outlined" size={16} className="text-[#283943]" />
                </div>
              </div>
              
              {/* Platforms checkboxes */}
              <div className="bg-white rounded-[6px] mt-2 p-2">
                <div className="flex flex-wrap w-[490px]">
                  {mixedPlacementMode ? (
                    /* Mixed Placement Mode - All platforms enabled, all checked by default */
                    <>
                      {/* Row 1: Facebook, Instagram */}
                      <div className="w-[200px]">
                        <CheckboxItem
                          label="Facebook"
                          checked={platforms.facebook}
                          onChange={() => setPlatforms({ ...platforms, facebook: !platforms.facebook })}
                        />
                      </div>
                      <div className="w-[200px]">
                        <CheckboxItem
                          label="Instagram"
                          checked={platforms.instagram}
                          onChange={() => setPlatforms({ ...platforms, instagram: !platforms.instagram })}
                        />
                      </div>
                      {/* Row 2: Audience Network, Messenger */}
                      <div className="w-[200px]">
                        <CheckboxItem
                          label="Audience Network"
                          checked={platforms.audienceNetwork}
                          onChange={() => setPlatforms({ ...platforms, audienceNetwork: !platforms.audienceNetwork })}
                        />
                      </div>
                      <div className="w-[200px]">
                        <CheckboxItem
                          label="Messenger"
                          checked={platforms.messenger}
                          onChange={() => setPlatforms({ ...platforms, messenger: !platforms.messenger })}
                        />
                      </div>
                      {/* Row 3: Threads */}
                      <div className="w-[200px]">
                        <CheckboxItem
                          label="Threads"
                          checked={platforms.threads}
                          onChange={() => setPlatforms({ ...platforms, threads: !platforms.threads })}
                        />
                      </div>
                    </>
                  ) : (
                    /* Standard Alpha/Before mode */
                    <>
                      {/* 
                        For Alpha TV mode (per Figma):
                        - Facebook: unchecked + disabled
                        - Instagram: unchecked + disabled  
                        - Audience network: checked + ENABLED (only one enabled)
                        - Messenger: unchecked + disabled
                        - Threads: unchecked + disabled
                      */}
                      {/* Row 1: Facebook, Instagram */}
                      <div className="w-[200px]">
                        <CheckboxItem
                          label="Facebook"
                          checked={isAlpha && effectiveTVMode ? false : platforms.facebook}
                          onChange={() => setPlatforms({ ...platforms, facebook: !platforms.facebook })}
                          disabled={isAlpha && effectiveTVMode}
                        />
                      </div>
                      <div className="w-[200px]">
                        <CheckboxItem
                          label="Instagram"
                          checked={isAlpha && effectiveTVMode ? false : platforms.instagram}
                          onChange={() => setPlatforms({ ...platforms, instagram: !platforms.instagram })}
                          disabled={isAlpha && effectiveTVMode}
                        />
                      </div>
                      {/* Row 2: Audience network, Messenger */}
                      <div className="w-[200px]">
                        <CheckboxItem
                          label="Audience network"
                          checked={platforms.audienceNetwork}
                          onChange={() => setPlatforms({ ...platforms, audienceNetwork: !platforms.audienceNetwork })}
                          disabled={false}
                        />
                      </div>
                      <div className="w-[200px]">
                        <CheckboxItem
                          label="Messenger"
                          checked={isAlpha && effectiveTVMode ? false : platforms.messenger}
                          onChange={() => setPlatforms({ ...platforms, messenger: !platforms.messenger })}
                          disabled={isAlpha && effectiveTVMode}
                        />
                      </div>
                      {/* Row 3: Threads */}
                      <div className="w-[200px]">
                        <CheckboxItem
                          label="Threads"
                          checked={isAlpha && effectiveTVMode ? false : platforms.threads}
                          onChange={() => setPlatforms({ ...platforms, threads: !platforms.threads })}
                          disabled={isAlpha && effectiveTVMode}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <FieldRow
              label="Platforms"
              value={getPlatformsDisplayValue()}
              onClick={() => toggleSection("platforms")}
            />
          )}

          {/* Placement controls */}
          {expandedSection === "placementControls" ? (
            <div className="bg-[#F1F4F7] rounded-[1px] py-2 px-2">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection("placementControls")}
              >
                <span className="font-optimistic font-bold text-[14px] leading-[20px] text-[rgba(0,0,0,0.75)]">
                  Placement controls
                </span>
                <div className="p-[2px]">
                  <Icon name="CaretUp" variant="outlined" size={16} className="text-[#283943]" />
                </div>
              </div>
              
              {/* Placement controls list with preview */}
              <div className="bg-white rounded-[6px] mt-2 p-2">
                <div className="flex gap-4">
                  {/* Left side - controls list */}
                  <div className="flex-1 border border-[#D9D9D9]">
                    {placementControls.map((control) => {
                      const isExpanded = control.id === "connected-tv" && control.checked;
                      return (
                        <div 
                          key={control.id}
                          className="flex flex-col gap-2 p-2 border-b border-[#D9D9D9] last:border-b-0"
                        >
                          {/* Main row with arrow, label, and checkbox */}
                          <div className="flex items-center gap-2">
                            {/* Triangle icon - points down when expanded, right when collapsed */}
                            <div className="shrink-0 w-4 h-4 flex items-center justify-center">
                              {isExpanded ? (
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M4 6L8 10L12 6" fill="rgba(40,57,67,0.6)"/>
                                </svg>
                              ) : (
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M6 4L10 8L6 12" fill="rgba(40,57,67,0.6)"/>
                                </svg>
                              )}
                            </div>
                            <span className="font-roboto font-bold text-[12px] leading-[20px] text-[#465A69] flex-1">
                              {control.label}
                            </span>
                            <div className={`w-6 h-6 rounded-[4px] border flex items-center justify-center shrink-0 ${
                              control.disabled 
                                ? "bg-[#F1F4F7] border-[rgba(203,210,217,0.6)]" 
                                : "bg-white border-[#CBD2D9]"
                            }`}>
                              {control.checked && (
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M13.3334 4L6.00008 11.3333L2.66675 8" stroke="#0A78BE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              )}
                            </div>
                          </div>
                          {/* Description row - indented to align with label */}
                          <div className="pl-6 pr-8">
                            <span className="font-roboto text-[12px] leading-[normal] text-[rgba(28,43,51,0.65)]">
                              {control.description}
                            </span>
                          </div>
                          {/* Nested option for Connected TV */}
                          {isExpanded && (
                            <div className="flex items-center justify-between pl-8 pr-0">
                              <span className="font-roboto text-[12px] leading-[20px] text-[#465A69]">
                                Fullscreen video
                              </span>
                              <div className="w-6 h-6 rounded-[4px] border border-[#CBD2D9] bg-white flex items-center justify-center">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M13.3334 4L6.00008 11.3333L2.66675 8" stroke="#0A78BE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Right side - Preview panel */}
                  <div className="w-[200px] flex flex-col items-center">
                    <img 
                      src={(mixedPlacementMode || (isAlpha && effectiveTVMode)) ? "/images/connected-tv-wall.png" : "/images/mobile-preview.png"}
                      alt={(mixedPlacementMode || (isAlpha && effectiveTVMode)) ? "Connected TV Preview" : "Mobile Preview"}
                      className="w-full h-auto rounded"
                    />
                    <div className="mt-2 text-center">
                      {(mixedPlacementMode || (isAlpha && effectiveTVMode)) ? (
                        <>
                          <p className="font-optimistic font-bold text-[14px] leading-[20px] text-[#1C2B33]">
                            Connected TV
                          </p>
                          <p className="font-optimistic text-[12px] leading-[16px] text-[#465A69] mt-1">
                            We recommend fullscreen horizontal (16:9) videos that are 30 or 60 seconds long.
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="font-optimistic font-bold text-[14px] leading-[20px] text-[#1C2B33]">
                            Feeds
                          </p>
                          <p className="font-optimistic text-[12px] leading-[16px] text-[#465A69] mt-1">
                            We recommend <span className="font-bold">square (1:1)</span> images and <span className="font-bold">vertical (4:5)</span> videos.
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <FieldRow
              label="Placement controls"
              value={getPlacementControlsDisplayValue()}
              onClick={() => toggleSection("placementControls")}
            />
          )}

          {/* Skippable ads - hidden when TV mode is ON */}
          {!(isAlpha && effectiveTVMode) && (
            <FieldRow
              label="Skippable ads"
              value="All"
            />
          )}
        </div>
      )}
    </div>
  );
}
