"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "./Button";
import { Icon } from "./Icon";
import { Dropdown } from "./Dropdown";
import { cn, getTriggerStyles } from "@/features/campaign-planner/lib/utils";

// ============================================
// Types
// ============================================
interface PlacementItem {
  id: string;
  label: string;
  description: string;
  checked: boolean;
}

interface EditFormatPlacementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: {
    placementType: "advantage" | "manual";
    devices: string;
    placements: PlacementItem[];
  }) => void;
}

// ============================================
// Default Data
// ============================================
const defaultPlacements: PlacementItem[] = [
  { id: "feeds", label: "Feeds", description: "Get high visibility for your business with ads in feeds", checked: true },
  { id: "stories-reels", label: "Stories and Reels", description: "Tell a rich, visual story with immersive, fullscreen vertical ads.", checked: true },
  { id: "in-stream", label: "In-stream ads for videos and reels", description: "Reach people before, during or after they watch a video or reel", checked: true },
  { id: "search", label: "Search results", description: "Get visibility for your business as people search", checked: true },
  { id: "messages", label: "Messages", description: "Send offers or updates to people who are already connected to your business.", checked: true },
  { id: "apps-sites", label: "Apps and sites", description: "Expand your reach with ads in external apps and websites.", checked: true },
];

const deviceOptions = [
  { value: "all", label: "All devices (recommended)" },
  { value: "mobile", label: "Mobile devices only" },
  { value: "desktop", label: "Desktop only" },
];

// ============================================
// Section Header Component
// ============================================
function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[15px] font-bold leading-[20px] text-[#1C2B33] font-optimistic pb-1">
      {children}
    </h3>
  );
}

// ============================================
// Radio Option Component
// ============================================
interface RadioOptionProps {
  label: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
  badge?: string;
}

function RadioOption({ label, description, selected, onSelect, badge }: RadioOptionProps) {
  return (
    <label 
      className="flex items-start gap-2 px-2 py-1 cursor-pointer hover:bg-[rgba(0,0,0,0.02)] rounded-[4px] transition-colors"
      onClick={onSelect}
    >
      {/* Radio Button */}
      <div 
        className={cn(
          "w-6 h-6 rounded-full border shrink-0 mt-[2px]",
          "flex items-center justify-center",
          selected ? "border-[#CBD2D9]" : "border-[#CBD2D9]"
        )}
      >
        {selected && (
          <div className="w-3 h-3 rounded-full bg-[#0A78BE]" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="flex items-center gap-1">
          <span className="text-[14px] leading-[20px] text-[#1C2B33]">
            {label}
          </span>
          {badge && (
            <span className="text-[12px] leading-[16px] text-[#465A69]">
              ✦
            </span>
          )}
        </div>
        <p className="text-[12px] leading-[16px] text-[#465A69]">
          {description}
        </p>
      </div>
    </label>
  );
}

// ============================================
// Placement Checkbox Item Component
// ============================================
interface PlacementCheckboxProps {
  item: PlacementItem;
  onToggle: () => void;
}

function PlacementCheckbox({ item, onToggle }: PlacementCheckboxProps) {
  return (
    <div className="border border-[#D9D9D9] p-2 -mb-px first:rounded-t-[4px] last:rounded-b-[4px]">
      <div className="flex items-center gap-[19px]">
        {/* Expand Icon + Label */}
        <div className="flex-1 flex items-center gap-2 h-[14px]">
          <Icon 
            name="CaretRight" 
            variant="outlined" 
            size={16} 
            className="text-[rgba(40,57,67,0.6)] -rotate-90" 
          />
          <span className="text-[12px] font-bold leading-[20px] text-[#465A69]">
            {item.label}
          </span>
        </div>
        
        {/* Checkbox */}
        <button
          type="button"
          onClick={onToggle}
          className={cn(
            "w-6 h-6 rounded-[4px] border shrink-0 flex items-center justify-center transition-colors",
            item.checked 
              ? "bg-[#0A78BE] border-[#0A78BE]" 
              : "bg-white border-[#CBD2D9]"
          )}
        >
          {item.checked && (
            <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
              <path d="M1 5L5 9L13 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>
      </div>
      
      {/* Description */}
      <div className="pl-8 pr-[30px] mt-[10px]">
        <p className="text-[12px] leading-normal text-[rgba(28,43,51,0.65)]">
          {item.description}
        </p>
      </div>
    </div>
  );
}

// ============================================
// Info Item Component (for Brand Safety section)
// ============================================
interface InfoItemProps {
  label: string;
  value: string | React.ReactNode;
  hasTooltip?: boolean;
}

function InfoItem({ label, value, hasTooltip = false }: InfoItemProps) {
  return (
    <div className="py-1">
      <div className="flex items-center gap-1">
        <span className="text-[15px] font-bold leading-[20px] text-[#465A69] font-optimistic">
          {label}
        </span>
        {hasTooltip && (
          <Icon name="Info" variant="filled" size={12} className="text-[#283943]" />
        )}
      </div>
      <div className="text-[14px] leading-[20px] text-[#465A69]">
        {value}
      </div>
    </div>
  );
}

// ============================================
// Main Modal Component
// ============================================
export function EditFormatPlacementsModal({
  isOpen,
  onClose,
  onSave
}: EditFormatPlacementsModalProps) {
  const [placementType, setPlacementType] = useState<"advantage" | "manual">("manual");
  const [devices, setDevices] = useState("all");
  const [placements, setPlacements] = useState<PlacementItem[]>(defaultPlacements);

  const handleTogglePlacement = (id: string) => {
    setPlacements(prev => prev.map(p => 
      p.id === id ? { ...p, checked: !p.checked } : p
    ));
  };

  const handleSave = () => {
    onSave?.({ placementType, devices, placements });
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

  const selectedDevice = deviceOptions.find(o => o.value === devices);

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-hidden="true"
    >
      <div
        role="dialog"
        aria-modal="true"
        className="bg-white rounded-[8px] shadow-[0px_8px_24px_4px_rgba(0,0,0,0.1),0px_2px_2px_0px_rgba(0,0,0,0.1)] w-[600px] max-w-[calc(100vw-80px)] max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pl-4 pr-2 py-0 bg-white shrink-0">
          <div className="flex-1 flex flex-col justify-center py-4 pr-2 min-w-0">
            <h2 className="text-[20px] font-bold leading-[24px] text-[#1C2B33] font-optimistic">
              Edit format & placements
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

        {/* Modal Body - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Placement Type Selection */}
          <div className="space-y-1">
            <RadioOption
              label="Advantage+ placements (Recommended)"
              description="Use Advantage+ placements to maximise your budget and help show your ads to more people. Facebook's delivery system will allocate your ad set's budget across multiple placements based on where they're likely to perform best."
              selected={placementType === "advantage"}
              onSelect={() => setPlacementType("advantage")}
              badge="✦"
            />
            <RadioOption
              label="Manual placements"
              description="Manually choose the places to show your ad. The more placements you select, the more opportunities you'll have to reach your target audience and achieve your business goals."
              selected={placementType === "manual"}
              onSelect={() => setPlacementType("manual")}
            />
          </div>

          {/* Devices Dropdown */}
          <div className="space-y-1">
            <SectionHeader>Devices</SectionHeader>
            <Dropdown
              className="w-full"
              width="100%"
              trigger={({ isOpen }) => (
                <div
                  className={cn(
                    "flex items-center justify-between gap-2 px-3 py-2 cursor-pointer",
                    getTriggerStyles(isOpen)
                  )}
                >
                  <span className="text-[14px] leading-[20px] text-[#1C2B33]">
                    {selectedDevice?.label || "Select device"}
                  </span>
                  <Icon
                    name="CaretDownSmall"
                    variant="outlined"
                    size={16}
                    className={cn(
                      "shrink-0 text-[#283943] transition-transform",
                      isOpen && "rotate-180"
                    )}
                  />
                </div>
              )}
            >
              {deviceOptions.map((option) => (
                <Dropdown.Item
                  key={option.value}
                  label={option.label}
                  onClick={() => setDevices(option.value)}
                  selectionType="radio"
                  selected={devices === option.value}
                />
              ))}
            </Dropdown>
          </div>

          {/* Placements List */}
          <div className="space-y-1">
            <SectionHeader>Placements</SectionHeader>
            <div className="flex flex-col">
              {placements.map((item) => (
                <PlacementCheckbox
                  key={item.id}
                  item={item}
                  onToggle={() => handleTogglePlacement(item.id)}
                />
              ))}
            </div>
          </div>

          {/* Specific Mobile Devices */}
          <div className="py-1">
            <h4 className="text-[15px] font-bold leading-[20px] text-[#465A69] font-optimistic">
              Specific mobile devices & operating systems
            </h4>
            <div className="text-[14px] leading-[20px] text-[#465A69]">
              <p>Devices</p>
              <p className="ml-2">• All</p>
              <p>Only when connected to Wi-Fi</p>
              <p className="ml-2">• No</p>
            </div>
          </div>

          {/* Brand Safety Section */}
          <div className="space-y-2">
            <div>
              <h3 className="text-[16px] font-bold leading-[20px] text-[#1C2B33] font-optimistic">
                Brand safety and suitability
              </h3>
              <p className="text-[14px] leading-[20px] text-[#1C2B33]">
                Control which types of content your ads can appear in or next to. Brand safety and suitability controls set in your ad account settings are applied.
              </p>
            </div>

            <InfoItem 
              label="Inventory filter" 
              hasTooltip
              value={
                <ul className="list-disc ml-5 text-[14px] leading-[20px] text-[#465A69]">
                  <li>Facebook and Instagram feed ads and Reels feed ads: Moderate inventory</li>
                  <li>Facebook in-stream videos, Ads on Facebook Reels, and Ads on Instagram Reels: Moderate inventory</li>
                  <li>Audience Network: Moderate inventory</li>
                </ul>
              }
            />

            <InfoItem label="Block lists" value="None selected" hasTooltip />
            <InfoItem label="Content type exclusions" value="None selected" hasTooltip />
            <InfoItem label="Topic exclusions for Facebook in-stream videos" value="None selected" hasTooltip />
            <InfoItem label="Content allow lists" value="None selected" hasTooltip />
            <InfoItem label="Publisher allow lists" value="None selected" hasTooltip />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-2 px-4 pt-3 pb-4 bg-white shrink-0 border-t border-[#E4E8EB]">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>Save</Button>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ============================================
// Preview Component for Modal Gallery
// ============================================
export function EditFormatPlacementsModalPreview() {
  const [placementType, setPlacementType] = useState<"advantage" | "manual">("manual");
  const [devices, setDevices] = useState("all");
  const [placements, setPlacements] = useState<PlacementItem[]>(defaultPlacements);

  const handleTogglePlacement = (id: string) => {
    setPlacements(prev => prev.map(p => 
      p.id === id ? { ...p, checked: !p.checked } : p
    ));
  };

  const selectedDevice = deviceOptions.find(o => o.value === devices);

  return (
    <div className="bg-white rounded-[8px] shadow-[0px_8px_24px_4px_rgba(0,0,0,0.1),0px_2px_2px_0px_rgba(0,0,0,0.1)] w-[600px] h-[600px] overflow-hidden flex flex-col">
      {/* Modal Header */}
      <div className="flex items-center justify-between pl-4 pr-2 py-0 bg-white shrink-0">
        <div className="flex-1 flex flex-col justify-center py-4 pr-2 min-w-0">
          <h2 className="text-[20px] font-bold leading-[24px] text-[#1C2B33] font-optimistic">
            Edit format & placements
          </h2>
        </div>
        <div className="flex items-start py-2">
          <button className="p-3 hover:bg-[rgba(0,0,0,0.05)] rounded-[4px] transition-colors">
            <Icon name="Close" variant="outlined" size={16} className="text-[#283943]" />
          </button>
        </div>
      </div>

      {/* Modal Body - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Placement Type Selection */}
        <div className="space-y-1">
          <RadioOption
            label="Advantage+ placements (Recommended)"
            description="Use Advantage+ placements to maximise your budget and help show your ads to more people. Facebook's delivery system will allocate your ad set's budget across multiple placements based on where they're likely to perform best."
            selected={placementType === "advantage"}
            onSelect={() => setPlacementType("advantage")}
            badge="✦"
          />
          <RadioOption
            label="Manual placements"
            description="Manually choose the places to show your ad. The more placements you select, the more opportunities you'll have to reach your target audience and achieve your business goals."
            selected={placementType === "manual"}
            onSelect={() => setPlacementType("manual")}
          />
        </div>

        {/* Devices Dropdown */}
        <div className="space-y-1">
          <SectionHeader>Devices</SectionHeader>
          <Dropdown
            className="w-full"
            width="100%"
            trigger={({ isOpen }) => (
              <div
                className={cn(
                  "flex items-center justify-between gap-2 px-3 py-2 cursor-pointer",
                  getTriggerStyles(isOpen)
                )}
              >
                <span className="text-[14px] leading-[20px] text-[#1C2B33]">
                  {selectedDevice?.label || "Select device"}
                </span>
                <Icon
                  name="CaretDownSmall"
                  variant="outlined"
                  size={16}
                  className={cn(
                    "shrink-0 text-[#283943] transition-transform",
                    isOpen && "rotate-180"
                  )}
                />
              </div>
            )}
          >
            {deviceOptions.map((option) => (
              <Dropdown.Item
                key={option.value}
                label={option.label}
                onClick={() => setDevices(option.value)}
                selectionType="radio"
                selected={devices === option.value}
              />
            ))}
          </Dropdown>
        </div>

        {/* Placements List */}
        <div className="space-y-1">
          <SectionHeader>Placements</SectionHeader>
          <div className="flex flex-col">
            {placements.map((item) => (
              <PlacementCheckbox
                key={item.id}
                item={item}
                onToggle={() => handleTogglePlacement(item.id)}
              />
            ))}
          </div>
        </div>

        {/* Specific Mobile Devices */}
        <div className="py-1">
          <h4 className="text-[15px] font-bold leading-[20px] text-[#465A69] font-optimistic">
            Specific mobile devices & operating systems
          </h4>
          <div className="text-[14px] leading-[20px] text-[#465A69]">
            <p>Devices</p>
            <p className="ml-2">• All</p>
            <p>Only when connected to Wi-Fi</p>
            <p className="ml-2">• No</p>
          </div>
        </div>

        {/* Brand Safety Section */}
        <div className="space-y-2">
          <div>
            <h3 className="text-[16px] font-bold leading-[20px] text-[#1C2B33] font-optimistic">
              Brand safety and suitability
            </h3>
            <p className="text-[14px] leading-[20px] text-[#1C2B33]">
              Control which types of content your ads can appear in or next to. Brand safety and suitability controls set in your ad account settings are applied.
            </p>
          </div>

          <InfoItem 
            label="Inventory filter" 
            hasTooltip
            value={
              <ul className="list-disc ml-5 text-[14px] leading-[20px] text-[#465A69]">
                <li>Facebook and Instagram feed ads and Reels feed ads: Moderate inventory</li>
                <li>Facebook in-stream videos, Ads on Facebook Reels, and Ads on Instagram Reels: Moderate inventory</li>
                <li>Audience Network: Moderate inventory</li>
              </ul>
            }
          />

          <InfoItem label="Block lists" value="None selected" hasTooltip />
          <InfoItem label="Content type exclusions" value="None selected" hasTooltip />
          <InfoItem label="Topic exclusions for Facebook in-stream videos" value="None selected" hasTooltip />
          <InfoItem label="Content allow lists" value="None selected" hasTooltip />
          <InfoItem label="Publisher allow lists" value="None selected" hasTooltip />
        </div>
      </div>

      {/* Modal Footer */}
      <div className="flex items-center justify-end gap-2 px-4 pt-3 pb-4 bg-white shrink-0 border-t border-[#E4E8EB]">
        <Button variant="secondary">Cancel</Button>
        <Button variant="primary">Save</Button>
      </div>
    </div>
  );
}

