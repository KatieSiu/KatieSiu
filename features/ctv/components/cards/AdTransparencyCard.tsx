"use client";

import { useState } from "react";
import { Icon } from "@/features/ctv/components/ui/Icon";
import type { PrototypeVersion } from "./types";

interface AdTransparencyCardProps {
  version: PrototypeVersion;
  className?: string;
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

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M4 6L8 10L12 6" stroke="#465A69" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function AdTransparencyCard({ version, className = "" }: AdTransparencyCardProps) {
  const [isToggleOn, setIsToggleOn] = useState(false);

  if (version !== "alpha-v1") {
    return null;
  }

  return (
    <div className={`bg-white rounded-[4px] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.1),0px_0px_4px_0px_rgba(0,0,0,0.1)] px-2 py-4 w-[600px] flex flex-col gap-3 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-2 px-2">
        <CheckCircleIcon />
        <span className="font-optimistic font-bold text-[16px] leading-[20px] text-[#1C2B33]">
          Ad transparency
        </span>
      </div>

      {/* Description */}
      <p className="text-[14px] leading-[20px] text-[#1C2B33] px-2">
        Increase transparency for your audience by providing details about the advertiser and payer. Their name, location, and credentials will be displayed publicly in{" "}
        <span className="text-[#0A78BE] cursor-pointer hover:underline">Meta&apos;s Ad Library</span>
        {" "}when the ads are running or longer in some cases.{" "}
        <span className="text-[#0A78BE] cursor-pointer hover:underline">About ad transparency</span>
      </p>

      {/* Beneficiary section */}
      <div className="flex flex-col gap-2 px-2">
        <div className="flex items-center gap-1">
          <span className="font-optimistic font-bold text-[14px] leading-[20px] text-[#1C2B33]">
            Beneficiary (optional)
          </span>
          <Icon name="Info" variant="filled" size={12} className="text-[rgba(0,0,0,0.75)]" />
        </div>
        
        {/* Dropdown */}
        <div className="flex items-center justify-between h-[40px] px-3 border border-[#CBD2D9] rounded bg-white cursor-pointer hover:border-[#0A78BE] transition-colors">
          <span className="text-[14px] leading-[20px] text-[#465A69]">
            Select the advertiser
          </span>
          <ChevronDownIcon />
        </div>
      </div>

      {/* Toggle */}
      <div className="flex items-center gap-3 px-2">
        <button
          onClick={() => setIsToggleOn(!isToggleOn)}
          className={`relative w-[44px] h-[24px] rounded-full transition-colors ${
            isToggleOn ? "bg-[#0A78BE]" : "bg-[#CBD2D9]"
          }`}
        >
          <div
            className={`absolute top-[2px] w-[20px] h-[20px] bg-white rounded-full shadow transition-transform ${
              isToggleOn ? "translate-x-[22px]" : "translate-x-[2px]"
            }`}
          />
        </button>
        <span className="text-[14px] leading-[20px] text-[#1C2B33]">
          The advertiser and payer are different
        </span>
      </div>
    </div>
  );
}
