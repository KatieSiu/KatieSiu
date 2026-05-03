"use client";

import { useState } from "react";
import type { PrototypeVersion } from "./types";

interface DynamicCreativeCardProps {
  version: PrototypeVersion;
  className?: string;
}

function Toggle({ isOn, onToggle }: { isOn: boolean; onToggle: () => void }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[14px] leading-[20px] text-[#1C2B33]">
        {isOn ? "On" : "Off"}
      </span>
      <button
        onClick={onToggle}
        className={`relative w-10 h-6 rounded-full border transition-colors ${
          isOn ? "bg-[#1877F2] border-[#1877F2]" : "bg-white border-[#CBD2D9]"
        }`}
      >
        <div
          className={`absolute top-[2px] w-[18px] h-[18px] rounded-full transition-all ${
            isOn ? "left-[18px] bg-white" : "left-[2px] bg-[#283943]"
          }`}
        />
      </button>
    </div>
  );
}

export function DynamicCreativeCard({ version, className = "" }: DynamicCreativeCardProps) {
  const [isEnabled, setIsEnabled] = useState(false);

  if (version !== "alpha-v1") {
    return null;
  }

  return (
    <div className={`bg-white rounded-[4px] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.1),0px_0px_4px_0px_rgba(0,0,0,0.1)] p-4 w-[600px] flex flex-col gap-4 ${className}`}>
      {/* Header with toggle */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-2 flex-1">
          <div className="flex items-center justify-between">
            <span className="font-optimistic font-bold text-[16px] leading-[20px] text-[#1C2B33]">
              Dynamic creative
            </span>
            <Toggle isOn={isEnabled} onToggle={() => setIsEnabled(!isEnabled)} />
          </div>
          <p className="text-[14px] leading-[20px] text-[#1C2B33]">
            We&apos;ll automatically create combinations of your media and text that your audience is likely to respond to.{" "}
            <span className="text-[#0A78BE] cursor-pointer hover:underline">About dynamic creative</span>
          </p>
        </div>
      </div>
    </div>
  );
}
