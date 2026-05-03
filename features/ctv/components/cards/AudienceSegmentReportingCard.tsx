"use client";

import { Icon } from "@/features/ctv/components/ui/Icon";
import type { PrototypeVersion } from "./types";

interface AudienceSegmentReportingCardProps {
  version: PrototypeVersion;
  className?: string;
  isTVMode?: boolean;
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

interface DisabledFieldProps {
  label: string;
  value: string;
}

function DisabledField({ label, value }: DisabledFieldProps) {
  return (
    <div className="flex flex-col gap-0 py-1 opacity-50">
      <div className="flex items-center gap-1">
        <span className="font-optimistic font-bold text-[14px] leading-[20px] text-[#1C2B33]">
          {label}
        </span>
        <Icon name="Info" variant="filled" size={12} className="text-[#283943]" />
      </div>
      <span className="font-optimistic text-[14px] leading-[20px] text-[#465A69]">
        {value}
      </span>
    </div>
  );
}

export function AudienceSegmentReportingCard({ version, className = "", isTVMode = false }: AudienceSegmentReportingCardProps) {
  // Only render for "before" and "alpha-v1" versions
  if (version !== "before" && version !== "alpha-v1") {
    return null;
  }

  const isAlpha = version === "alpha-v1";
  const isDisabled = isAlpha && isTVMode;

  return (
    <div className={`bg-white rounded-[4px] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.1),0px_0px_4px_0px_rgba(0,0,0,0.1)] p-4 w-[600px] flex flex-col gap-3 ${className}`}>
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          {!isDisabled && <CheckCircleIcon />}
          <span className="font-optimistic font-bold text-[16px] leading-[20px] text-[#1C2B33]">
            Audience segment reporting
          </span>
        </div>
        
        {/* Description */}
        <p className="font-sf-pro text-[14px] leading-[20px] text-[#1C2B33]">
          Define your ad account's{" "}
          <span className="text-[#0A78BE] cursor-pointer hover:underline">audience segments</span>
          {" "}in Advertiser settings to receive reporting breakdowns between your new audience, engaged audience and existing customers.{" "}
          <span className="text-[#0A78BE] cursor-pointer hover:underline">About audience segment reporting</span>
        </p>
      </div>

      {/* Disabled Fields - always disabled in TV mode */}
      <DisabledField label="Engaged audience" value="Not defined" />
      <DisabledField label="Existing customers" value="Not defined" />
    </div>
  );
}
