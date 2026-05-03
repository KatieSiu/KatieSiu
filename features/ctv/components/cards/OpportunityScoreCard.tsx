"use client";

import { Icon } from "@/features/ctv/components/ui/Icon";
import { OpportunityScore as OpportunityScoreIcon } from "@/features/ctv/components/icons/filled";
import type { PrototypeVersion } from "./types";

interface OpportunityScoreCardProps {
  version: PrototypeVersion;
  className?: string;
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path 
        fillRule="evenodd" 
        clipRule="evenodd" 
        d="M6.5 13C10.0899 13 13 10.0899 13 6.5C13 2.91015 10.0899 0 6.5 0C2.91015 0 0 2.91015 0 6.5C0 10.0899 2.91015 13 6.5 13ZM6.5 3.25C6.05127 3.25 5.6875 3.61377 5.6875 4.0625C5.6875 4.51123 6.05127 4.875 6.5 4.875C6.94873 4.875 7.3125 4.51123 7.3125 4.0625C7.3125 3.61377 6.94873 3.25 6.5 3.25ZM5.6875 5.95833C5.6875 5.5096 6.05127 5.14583 6.5 5.14583C6.94873 5.14583 7.3125 5.5096 7.3125 5.95833V9.20833C7.3125 9.65706 6.94873 10.0208 6.5 10.0208C6.05127 10.0208 5.6875 9.65706 5.6875 9.20833V5.95833Z" 
        fill="#283943"
      />
    </svg>
  );
}

export function OpportunityScoreCard({ version, className = "" }: OpportunityScoreCardProps) {
  // Only render for "before" version
  if (version !== "before") {
    return null;
  }

  return (
    <div className={`bg-white rounded-[6px] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.1),0px_0px_4px_0px_rgba(0,0,0,0.1)] p-2 w-[600px] flex items-center gap-3 ${className}`}>
      {/* Score Ring SVG */}
      <OpportunityScoreIcon className="shrink-0" />
      
      {/* Text content */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center gap-1">
          <span className="font-optimistic font-bold text-[15px] leading-[20px] text-[#1C2B33]">
            Opportunity score
          </span>
          <InfoIcon />
        </div>
        <span className="font-optimistic text-[12px] leading-[16px] text-[#1C2B33]">
          You're using our recommended setup.
        </span>
      </div>
      
      {/* Dropdown arrow */}
      <Icon name="SmallTriangleDown" variant="filled" size={16} className="text-[rgba(0,0,0,0.75)]" />
    </div>
  );
}
