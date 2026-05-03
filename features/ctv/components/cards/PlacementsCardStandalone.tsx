"use client";

import { useState } from "react";
import { Icon } from "@/features/ctv/components/ui/Icon";
import type { PrototypeVersion } from "./types";

interface PlacementsCardStandaloneProps {
  version: PrototypeVersion;
  className?: string;
  isTVMode?: boolean;
  defaultShowSettings?: boolean;
  defaultExpandedSection?: "devices" | "platforms" | "placementControls" | null;
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

export function PlacementsCardStandalone({ 
  version, 
  className = "", 
  isTVMode = false,
  defaultShowSettings = false,
  defaultExpandedSection = null,
}: PlacementsCardStandaloneProps) {
  const [showSettings, setShowSettings] = useState(defaultShowSettings);
  
  type ExpandedSection = "devices" | "platforms" | "placementControls" | null;
  const [expandedSection, setExpandedSection] = useState<ExpandedSection>(defaultExpandedSection);
  
  const toggleSection = (section: ExpandedSection) => {
    setExpandedSection(prev => prev === section ? null : section);
  };
  
  // Dropdown states (only used in Social mode)
  const [allDevicesDropdownOpen, setAllDevicesDropdownOpen] = useState(false);
  const [mobileDevicesDropdownOpen, setMobileDevicesDropdownOpen] = useState(false);
  
  // Field values for Social mode
  const [devicesValue, setDevicesValue] = useState("All devices (recommended)");
  const [mobileDevicesValue, setMobileDevicesValue] = useState("All mobile devices");
  const [wifiOnly, setWifiOnly] = useState(false);
  
  // Platforms checkboxes for Social mode
  const [platforms, setPlatforms] = useState({
    facebook: true,
    instagram: true,
    audienceNetwork: true,
    messenger: true,
    whatsapp: false,
    threads: true,
  });
  
  // Placement controls data
  const getPlacementControls = (): PlacementControlItem[] => {
    if (isTVMode) {
      // TV Mode: Only Connected TV is enabled and checked
      return [
        { id: "feeds", label: "Feeds", description: "Get high visibility for your business with ads in feeds", checked: false, disabled: true },
        { id: "stories-reels", label: "Stories and Reels", description: "Tell a rich, visual story with immersive, fullscreen vertical ads.", checked: false, disabled: true },
        { id: "in-stream", label: "In-stream ads for videos and reels", description: "Reach people before, during or after they watch a video or reel", checked: false, disabled: true },
        { id: "search", label: "Search results", description: "Get visibility for your business as people search", checked: false, disabled: true },
        { id: "apps-sites", label: "Apps and sites", description: "Expand your reach with ads in external apps and websites.", checked: false, disabled: true },
        { id: "connected-tv", label: "Connected TV", description: "Reach people streaming content on Smart TV screens.", checked: true, disabled: false },
      ];
    }
    // Social Mode: All placements enabled and checked (like Before version)
    return [
      { id: "feeds", label: "Feeds", description: "Get high visibility for your business with ads in feeds", checked: true, disabled: false },
      { id: "stories-reels", label: "Stories and Reels", description: "Tell a rich, visual story with immersive, fullscreen vertical ads.", checked: true, disabled: false },
      { id: "in-stream", label: "In-stream ads for videos and reels", description: "Reach people before, during or after they watch a video or reel", checked: true, disabled: false },
      { id: "search", label: "Search results", description: "Get visibility for your business as people search", checked: true, disabled: false },
      { id: "apps-sites", label: "Apps and sites", description: "Expand your reach with ads in external apps and websites.", checked: true, disabled: false },
    ];
  };

  const placementControls = getPlacementControls();

  // Display values based on mode
  const getDevicesDisplayValue = () => isTVMode ? "TV" : "All";
  const getPlatformsDisplayValue = () => isTVMode ? "Audience Network" : "All Platforms";
  const getPlacementControlsDisplayValue = () => isTVMode ? "Connected TV" : "All available placements included";

  // Dropdown options
  const mobileDeviceOptions = [
    { value: "all-mobile", label: "All mobile devices" },
    { value: "android", label: "Android devices only" },
    { value: "ios", label: "iOS devices only" },
    { value: "feature", label: "Feature phones only" },
  ];

  const allDevicesOptions = [
    { value: "all", label: "All devices (recommended)" },
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

      {/* Settings content */}
      {showSettings && (
        <div className="flex flex-col gap-2">
          {/* Devices and operating systems */}
          {isTVMode ? (
            // TV Mode: Read-only display
            <FieldRow label="Devices and operating systems" value="TV" />
          ) : expandedSection === "devices" ? (
            // Social Mode: Expandable with dropdowns
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
              
              <div className="bg-white rounded-[6px] mt-2 p-2">
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
          {isTVMode ? (
            // TV Mode: Read-only display
            <FieldRow label="Platforms" value="Audience Network" />
          ) : expandedSection === "platforms" ? (
            // Social Mode: Expandable with checkboxes
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
              
              <div className="bg-white rounded-[6px] mt-2 p-2">
                <div className="flex flex-wrap w-[490px]">
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
                  <div className="w-[200px]">
                    <CheckboxItem
                      label="Audience network"
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
                  <div className="w-[200px]">
                    <CheckboxItem
                      label="Threads"
                      checked={platforms.threads}
                      onChange={() => setPlatforms({ ...platforms, threads: !platforms.threads })}
                    />
                  </div>
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
                          <div className="flex items-center gap-2">
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
                            <span className={`font-roboto font-bold text-[12px] leading-[20px] flex-1 ${
                              control.disabled ? "text-[rgba(70,90,105,0.6)]" : "text-[#465A69]"
                            }`}>
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
                          <div className="pl-6 pr-8">
                            <span className={`font-roboto text-[12px] leading-[normal] ${
                              control.disabled ? "text-[rgba(28,43,51,0.4)]" : "text-[rgba(28,43,51,0.65)]"
                            }`}>
                              {control.description}
                            </span>
                          </div>
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
                    <div className="w-full h-[138px] bg-[#F1F4F7] rounded flex items-center justify-center">
                      <span className="text-[#465A69] text-[12px]">Preview</span>
                    </div>
                    <div className="mt-2 text-center">
                      {isTVMode ? (
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

          {/* Skippable ads - always read-only */}
          <FieldRow label="Skippable ads" value="All" />
        </div>
      )}
    </div>
  );
}
