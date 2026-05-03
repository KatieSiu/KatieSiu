"use client";

import { useState, useEffect, ComponentType, SVGProps } from "react";
import { Icon } from "@/features/ctv/components/ui/Icon";
import { Megaphone, Cursor, Messages, Filter, Group, ShoppingBagFlared, TV, Globe } from "@/features/ctv/components/icons/objectives";
import type { PrototypeVersion } from "./types";

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5L6 0Z" fill="currentColor"/>
    </svg>
  );
}

interface ToggleSwitchProps {
  isOn: boolean;
  onToggle: () => void;
}

function ToggleSwitch({ isOn, onToggle }: ToggleSwitchProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-optimistic text-[14px] leading-[20px] text-[#1C2B33]">
        {isOn ? "On" : "Off"}
      </span>
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
    </div>
  );
}

interface CampaignDetailsCardStandaloneProps {
  version: PrototypeVersion;
  className?: string;
  onChannelChange?: (channel: "social" | "ctv") => void;
  /** Current channel value (controlled from parent) */
  currentChannel?: "social" | "ctv";
}

interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

interface ObjectiveOption {
  value: string;
  label: string;
  IconComponent: ComponentType<SVGProps<SVGSVGElement>>;
}

interface ChannelOption {
  value: "social" | "ctv";
  label: string;
  IconComponent: ComponentType<SVGProps<SVGSVGElement>>;
}

interface ExpandableFieldProps {
  label: string;
  value: string;
  options: RadioOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
}

function ExpandableField({ label, value, options, selectedValue, onSelect }: ExpandableFieldProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  if (isExpanded) {
    return (
      <div className="bg-[#F1F4F7] rounded-[1px] -mx-2 px-2 py-2">
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setIsExpanded(false)}
        >
          <div className="flex items-center gap-1">
            <span className="font-optimistic font-bold text-[14px] leading-[20px] text-[rgba(0,0,0,0.75)]">
              {label}
            </span>
            <Icon name="Info" variant="filled" size={12} className="text-[rgba(0,0,0,0.75)]" />
          </div>
          <div className="p-[2px]">
            <Icon name="CaretUp" variant="outlined" size={16} className="text-[#283943]" />
          </div>
        </div>

        <div className="bg-white rounded-[6px] mt-2 p-2">
          {options.map((option) => (
            <div
              key={option.value}
              className="flex items-start gap-2 px-2 py-1 cursor-pointer"
              onClick={() => onSelect(option.value)}
            >
              <div className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                selectedValue === option.value 
                  ? "border-[#CBD2D9] bg-white" 
                  : "border-[#CBD2D9] bg-white"
              }`}>
                {selectedValue === option.value && (
                  <div className="w-3 h-3 rounded-full bg-[#0A78BE]" />
                )}
              </div>
              <div className="flex flex-col">
                <span className="font-optimistic text-[14px] leading-[20px] text-[#1C2B33]">
                  {option.label}
                </span>
                {option.description && (
                  <span className="text-[12px] leading-[16px] text-[#465A69]">
                    {option.description}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex items-start justify-between py-2 px-2 -mx-2 rounded-[1px] transition-colors cursor-pointer ${
        isHovered ? "bg-[#F1F4F7]" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsExpanded(true)}
    >
      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <span className="font-optimistic font-bold text-[14px] leading-[20px] text-[rgba(0,0,0,0.75)]">
            {label}
          </span>
          <Icon name="Info" variant="filled" size={12} className="text-[rgba(0,0,0,0.75)]" />
        </div>
        <span className="font-optimistic font-normal text-[14px] leading-[20px] text-[#465A69]">
          {value}
        </span>
      </div>

      {isHovered && (
        <div className="p-[2px]">
          <Icon name="Pencil" variant="filled" size={16} className="text-[#0A78BE]" />
        </div>
      )}
    </div>
  );
}

interface ObjectiveFieldProps {
  label: string;
  options: ObjectiveOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
}

function ObjectiveField({ label, options, selectedValue, onSelect }: ObjectiveFieldProps) {
  return (
    <div className="flex flex-col gap-2 pb-2">
      <div className="flex items-center gap-1 py-1">
        <span className="font-optimistic font-bold text-[15px] leading-[20px] text-[#1C2B33]">
          {label}
        </span>
        <Icon name="Info" variant="filled" size={12} className="text-[#283943]" />
      </div>

      <div className="flex flex-col gap-1">
        {options.map((option) => {
          const isSelected = selectedValue === option.value;
          return (
            <div
              key={option.value}
              className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer ${
                isSelected ? "bg-[#ECF4FE]" : "bg-white"
              }`}
              onClick={() => onSelect(option.value)}
            >
              <div className="w-6 h-6 rounded-full border border-[#CBD2D9] bg-white flex items-center justify-center shrink-0">
                {isSelected && (
                  <div className="w-3 h-3 rounded-full bg-[#0A78BE]" />
                )}
              </div>
              <div className={`w-11 h-11 rounded flex items-center justify-center shrink-0 ${
                isSelected ? "bg-[#0A78BE]" : "bg-[#F1F4F7]"
              }`}>
                <option.IconComponent 
                  width={20} 
                  height={20} 
                  className={isSelected ? "text-white" : "text-[#283943]"} 
                />
              </div>
              <span className="font-optimistic text-[14px] leading-[20px] text-[#1C2B33]">
                {option.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface ChannelFieldProps {
  label: string;
  options: ChannelOption[];
  selectedValue: "social" | "ctv";
  onSelect: (value: "social" | "ctv") => void;
}

function ChannelField({ label, options, selectedValue, onSelect }: ChannelFieldProps) {
  return (
    <div className="flex flex-col gap-2 pb-2">
      <div className="flex items-center gap-1 py-1">
        <span className="font-optimistic font-bold text-[15px] leading-[20px] text-[#1C2B33]">
          {label}
        </span>
        <Icon name="Info" variant="filled" size={12} className="text-[#283943]" />
      </div>

      <div className="flex flex-col gap-1">
        {options.map((option) => {
          const isSelected = selectedValue === option.value;
          return (
            <div
              key={option.value}
              className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer ${
                isSelected ? "bg-[#ECF4FE]" : "bg-white"
              }`}
              onClick={() => onSelect(option.value)}
            >
              <div className="w-6 h-6 rounded-full border border-[#CBD2D9] bg-white flex items-center justify-center shrink-0">
                {isSelected && (
                  <div className="w-3 h-3 rounded-full bg-[#0A78BE]" />
                )}
              </div>
              <div className={`w-11 h-11 rounded flex items-center justify-center shrink-0 ${
                isSelected ? "bg-[#0A78BE]" : "bg-[#F1F4F7]"
              }`}>
                <option.IconComponent 
                  width={20} 
                  height={20} 
                  className={isSelected ? "text-white" : "text-[#283943]"} 
                />
              </div>
              <span className="font-optimistic text-[14px] leading-[20px] text-[#1C2B33]">
                {option.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const BUYING_TYPE_OPTIONS: RadioOption[] = [
  {
    value: "auction",
    label: "Auction",
    description: "Buy in real-time with cost effective bidding",
  },
  {
    value: "reservation",
    label: "Reservation",
    description: "Buy in advance for more predictable outcomes",
  },
];

const OBJECTIVE_OPTIONS: ObjectiveOption[] = [
  { value: "awareness", label: "Awareness", IconComponent: Megaphone },
  { value: "traffic", label: "Traffic", IconComponent: Cursor },
  { value: "engagement", label: "Engagement", IconComponent: Messages },
  { value: "leads", label: "Leads", IconComponent: Filter },
  { value: "app_promotion", label: "App promotion", IconComponent: Group },
  { value: "sales", label: "Sales", IconComponent: ShoppingBagFlared },
];

const CHANNEL_OPTIONS: ChannelOption[] = [
  { value: "social", label: "Social", IconComponent: Globe },
  { value: "ctv", label: "Connected TV", IconComponent: TV },
];

const OBJECTIVES_WITH_CHANNEL = ["awareness", "sales"];

export function CampaignDetailsCardStandalone({ version, className = "", onChannelChange, currentChannel = "social" }: CampaignDetailsCardStandaloneProps) {
  const [showMoreSettings, setShowMoreSettings] = useState(false);
  const [buyingType, setBuyingType] = useState("auction");
  const [objective, setObjective] = useState("sales");
  const [channel, setChannel] = useState<"social" | "ctv">(currentChannel);

  const showChannelSection = OBJECTIVES_WITH_CHANNEL.includes(objective);

  const buyingTypeDisplay = BUYING_TYPE_OPTIONS.find(o => o.value === buyingType)?.label || "Auction";

  const handleObjectiveChange = (newObjective: string) => {
    setObjective(newObjective);
    setChannel("social");
    onChannelChange?.("social");
  };

  const handleChannelChange = (newChannel: "social" | "ctv") => {
    setChannel(newChannel);
    onChannelChange?.(newChannel);
  };

  // Sync internal state with parent when currentChannel prop changes
  useEffect(() => {
    setChannel(currentChannel);
  }, [currentChannel]);

  return (
    <div className={`bg-white rounded-[4px] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.1),0px_0px_4px_0px_rgba(0,0,0,0.1)] px-4 py-[13px] w-[600px] ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <Icon name="CheckCircle" variant="filled" size={16} className="text-[#007E59]" />
        <h3 className="font-optimistic font-bold text-[16px] leading-[20px] text-[#1C2B33]">
          Campaign details
        </h3>
      </div>

      <div className="flex flex-col gap-2">
        <ExpandableField 
          label="Buying type" 
          value={buyingTypeDisplay}
          options={BUYING_TYPE_OPTIONS}
          selectedValue={buyingType}
          onSelect={setBuyingType}
        />
        
        <ObjectiveField 
          label="Campaign objective" 
          options={OBJECTIVE_OPTIONS}
          selectedValue={objective}
          onSelect={handleObjectiveChange}
        />

        {showChannelSection && (
          <ChannelField
            label="Campaign channel"
            options={CHANNEL_OPTIONS}
            selectedValue={channel}
            onSelect={handleChannelChange}
          />
        )}
      </div>

      <button
        className="flex items-center gap-1 mt-4 text-[#0A78BE] font-optimistic font-medium text-[14px] leading-[20px] hover:underline"
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

      {showMoreSettings && (
        <div className="flex flex-col gap-4 mt-4">
          <div className="border-t border-[#CBD2D9] pt-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1">
                <span className="font-optimistic font-bold text-[14px] leading-[20px] text-[#1C2B33]">
                  Campaign spending limit
                </span>
                <Icon name="Info" variant="filled" size={12} className="text-[#283943]" />
              </div>
              <span className="font-optimistic text-[14px] leading-[20px] text-[#465A69]">
                None added
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
