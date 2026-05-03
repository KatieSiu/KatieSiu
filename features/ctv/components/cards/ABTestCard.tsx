"use client";

import { useState } from "react";
import { Icon } from "@/features/ctv/components/ui/Icon";
import type { PrototypeVersion } from "./types";

interface ABTestCardProps {
  version: PrototypeVersion;
  className?: string;
  isTVMode?: boolean;
}

interface ToggleSwitchProps {
  isOn: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

function ToggleSwitch({ isOn, onToggle, disabled = false }: ToggleSwitchProps) {
  return (
    <div className={`flex items-center gap-2 ${disabled ? "opacity-50" : ""}`}>
      <span className="font-sf-pro text-[14px] leading-[20px] text-[#1C2B33]">
        {isOn ? "On" : "Off"}
      </span>
      <button
        onClick={onToggle}
        disabled={disabled}
        className={`relative w-10 h-6 rounded-full border transition-colors ${
          disabled ? "cursor-not-allowed" : ""
        } ${
          isOn
            ? "bg-[#E1EDF7] border-[#CBD2D9]"
            : "bg-transparent border-[#CBD2D9]"
        }`}
      >
        <div
          className={`absolute w-[18px] h-[18px] rounded-full transition-all ${
            isOn
              ? "left-[18px] top-[2px] bg-[#283943] w-[22px] h-[22px] -top-[1px]"
              : "left-[2px] top-[2px] bg-[#283943]"
          }`}
          style={isOn ? { width: 22, height: 22, top: 0, left: 16 } : { width: 18, height: 18, top: 2, left: 2 }}
        />
      </button>
    </div>
  );
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path 
        fillRule="evenodd" 
        clipRule="evenodd" 
        d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM11.7071 6.70711C12.0976 6.31658 12.0976 5.68342 11.7071 5.29289C11.3166 4.90237 10.6834 4.90237 10.2929 5.29289L7 8.58579L5.70711 7.29289C5.31658 6.90237 4.68342 6.90237 4.29289 7.29289C3.90237 7.68342 3.90237 8.31658 4.29289 8.70711L6.29289 10.7071C6.68342 11.0976 7.31658 11.0976 7.70711 10.7071L11.7071 6.70711Z" 
        fill="#007E59"
      />
    </svg>
  );
}

interface SelectorFieldProps {
  label: string;
  description?: string;
  value: string;
}

function SelectorField({ label, description, value }: SelectorFieldProps) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex flex-col pb-1">
        <span className="font-optimistic font-bold text-[14px] leading-[20px] text-[#1C2B33]">
          {label}
        </span>
        {description && (
          <span className="font-sf-pro text-[12px] leading-[16px] text-[#465A69]">
            {description}
          </span>
        )}
      </div>
      <div className="bg-white border border-[#CBD2D9] rounded h-[36px] flex items-center px-3 justify-between cursor-pointer hover:border-[#0A78BE]">
        <span className="font-sf-pro text-[14px] leading-[20px] text-[#1C2B33]">
          {value}
        </span>
        <Icon name="SmallTriangleDown" variant="filled" size={16} className="text-[#283943]" />
      </div>
    </div>
  );
}

export function ABTestCard({ version, className = "", isTVMode = false }: ABTestCardProps) {
  const [isEnabled, setIsEnabled] = useState(false);

  // Only render for "before" and "alpha-v1" versions
  if (version !== "before" && version !== "alpha-v1") {
    return null;
  }

  const isAlpha = version === "alpha-v1";
  const isDisabled = isAlpha && isTVMode;

  return (
    <div className={`bg-white rounded-[4px] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.1),0px_0px_4px_0px_rgba(0,0,0,0.1)] p-4 w-[600px] ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between w-full">
        <div className="flex items-center gap-2">
          {isEnabled && !isDisabled && <CheckCircleIcon />}
          <span className="font-optimistic font-bold text-[16px] leading-[20px] text-[#1C2B33]">
            A/B test
          </span>
        </div>
        <ToggleSwitch 
          isOn={isDisabled ? false : isEnabled} 
          onToggle={() => !isDisabled && setIsEnabled(!isEnabled)} 
          disabled={isDisabled}
        />
      </div>

      {/* Expanded Content - only shown when enabled */}
      {isEnabled && (
        <div className="flex flex-col gap-3 mt-3">
          {/* Description */}
          <p className="font-sf-pro text-[14px] leading-[20px] text-[#1C2B33]">
            Help improve ad performance by comparing versions to see what works best. For accuracy, each one will be shown to separate groups of your audience.{" "}
            <span className="text-[#0A78BE] cursor-pointer hover:underline">About A/B test</span>
          </p>

          {/* What do you want to test? */}
          <SelectorField 
            label="What do you want to test?"
            value="Creative"
          />

          {/* How long should the test run? */}
          <SelectorField 
            label="How long should the test run?"
            description="Your test will run for this many days or until your ad set ends."
            value="7 days"
          />

          {/* How do you want to compare performance */}
          <SelectorField 
            label="How do you want to compare performance"
            value="Cost per engagement"
          />
        </div>
      )}
    </div>
  );
}
