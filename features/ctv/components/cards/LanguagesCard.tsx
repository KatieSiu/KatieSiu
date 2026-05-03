"use client";

import { useState } from "react";
import type { PrototypeVersion } from "./types";

interface LanguagesCardProps {
  version: PrototypeVersion;
  className?: string;
}

interface ToggleSwitchProps {
  isOn: boolean;
  onToggle: () => void;
}

function ToggleSwitch({ isOn, onToggle }: ToggleSwitchProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-sf-pro text-[14px] leading-[20px] text-[#1C2B33]">
        {isOn ? "On" : "Off"}
      </span>
      <button
        onClick={onToggle}
        className={`relative w-10 h-6 rounded-full border transition-colors ${
          isOn
            ? "bg-[#E1EDF7] border-[#CBD2D9]"
            : "bg-transparent border-[#CBD2D9]"
        }`}
      >
        <div
          className={`absolute rounded-full transition-all ${
            isOn
              ? "bg-[#0A78BE]"
              : "bg-[#283943]"
          }`}
          style={isOn ? { width: 22, height: 22, top: 0, left: 16 } : { width: 18, height: 18, top: 2, left: 2 }}
        />
      </button>
    </div>
  );
}

export function LanguagesCard({ version, className = "" }: LanguagesCardProps) {
  const [isEnabled, setIsEnabled] = useState(false);

  // Render for "before" and "alpha-v1" versions
  if (version !== "before" && version !== "alpha-v1") {
    return null;
  }

  return (
    <div className={`bg-white rounded-[4px] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.1),0px_0px_5px_0px_rgba(0,0,0,0.1)] p-4 w-[600px] ${className}`}>
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between w-full">
          <span className="font-optimistic font-bold text-[16px] leading-[20px] text-[#1C2B33]">
            Languages
          </span>
          <ToggleSwitch isOn={isEnabled} onToggle={() => setIsEnabled(!isEnabled)} />
        </div>

        {/* Description */}
        <p className="font-optimistic text-[14px] leading-[20px] text-[#1C2B33]">
          Add your own translations or automatically translate your ad to reach people in more languages.{" "}
          <span className="text-[#0A78BE] cursor-pointer hover:underline">Learn more</span>
        </p>
      </div>
    </div>
  );
}
