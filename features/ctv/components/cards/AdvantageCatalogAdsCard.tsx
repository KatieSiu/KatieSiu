"use client";

import { useState } from "react";
import type { PrototypeVersion } from "./types";

interface AdvantageCatalogAdsCardProps {
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
      <span className="font-optimistic text-[14px] leading-[20px] text-[#1C2B33]">
        {isOn ? "On" : "Off"}
      </span>
      <button
        onClick={onToggle}
        disabled={disabled}
        className={`relative w-10 h-6 rounded-full border transition-colors ${
          disabled ? "cursor-not-allowed" : ""
        } ${
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

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5L6 0Z" fill="currentColor"/>
    </svg>
  );
}

export function AdvantageCatalogAdsCard({ version, className = "", isTVMode = false }: AdvantageCatalogAdsCardProps) {
  const [isEnabled, setIsEnabled] = useState(false);

  // Only render for "before" and "alpha-v1" versions
  if (version !== "before" && version !== "alpha-v1") {
    return null;
  }

  const isAlpha = version === "alpha-v1";
  const isDisabled = isAlpha && isTVMode;

  // TV Mode ON - Show collapsed/disabled state
  if (isDisabled) {
    return (
      <div className={`bg-white rounded-[4px] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.1),0px_0px_4px_0px_rgba(0,0,0,0.1)] px-4 py-4 w-[600px] ${className}`}>
        <div className="flex items-center justify-between">
          {/* Title with sparkle */}
          <div className="flex items-center gap-1">
            <h3 className="font-optimistic font-bold text-[16px] leading-[20px] text-[#1C2B33]">
              Advantage+ catalog ads
            </h3>
            <SparkleIcon className="text-[#283943]" />
          </div>

          {/* Toggle - always OFF and disabled */}
          <ToggleSwitch 
            isOn={false} 
            onToggle={() => {}} 
            disabled={true}
          />
        </div>
      </div>
    );
  }

  // TV Mode OFF - Show full card
  return (
    <div className={`bg-white rounded-[4px] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.1),0px_0px_4px_0px_rgba(0,0,0,0.1)] px-4 py-4 w-[600px] ${className}`}>
      {/* Header with title and toggle */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          {/* Title */}
          <h3 className="font-optimistic font-bold text-[16px] leading-[20px] text-[#1C2B33] mb-2">
            Advantage+ catalog ads
          </h3>
          
          {/* Description */}
          <p className="font-optimistic text-[14px] leading-[20px] text-[#1C2B33] mb-1">
            <span className="font-bold">Create a catalog and drive more sales with Advantage+ catalog ads</span>
          </p>
          <p className="font-optimistic text-[14px] leading-[20px] text-[#1C2B33]">
            Use a catalog to automatically advertise relevant products or services to people based on their unique interests, intent and actions.{" "}
            <span className="text-[#0A78BE] cursor-pointer hover:underline">Learn more</span>
          </p>
        </div>

        {/* Toggle */}
        <ToggleSwitch 
          isOn={isEnabled} 
          onToggle={() => setIsEnabled(!isEnabled)} 
        />
      </div>

      {/* Create a catalog button */}
      <div className="mt-4">
        <button 
          className="w-full py-2 px-4 border border-[#A7B3BF] rounded-[4px] bg-white transition-colors hover:bg-[#F8F9FB]"
        >
          <span className="font-optimistic font-medium text-[14px] leading-[20px] text-[#1C2B33]">
            Create a catalog
          </span>
        </button>
      </div>
    </div>
  );
}
