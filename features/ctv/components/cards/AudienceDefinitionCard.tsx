"use client";

import type { PrototypeVersion } from "./types";

interface AudienceDefinitionCardProps {
  version: PrototypeVersion;
  className?: string;
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path 
        fillRule="evenodd" 
        clipRule="evenodd" 
        d="M6 12C9.31371 12 12 9.31371 12 6C12 2.68629 9.31371 0 6 0C2.68629 0 0 2.68629 0 6C0 9.31371 2.68629 12 6 12ZM6 3C5.58579 3 5.25 3.33579 5.25 3.75C5.25 4.16421 5.58579 4.5 6 4.5C6.41421 4.5 6.75 4.16421 6.75 3.75C6.75 3.33579 6.41421 3 6 3ZM5.25 5.5C5.25 5.08579 5.58579 4.75 6 4.75C6.41421 4.75 6.75 5.08579 6.75 5.5V8.5C6.75 8.91421 6.41421 9.25 6 9.25C5.58579 9.25 5.25 8.91421 5.25 8.5V5.5Z" 
        fill="#283943"
      />
    </svg>
  );
}

function LineChartIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path 
        fillRule="evenodd" 
        clipRule="evenodd" 
        d="M3 3C3 2.44772 2.55228 2 2 2C1.44772 2 1 2.44772 1 3V17C1 17.5523 1.44772 18 2 18H18C18.5523 18 19 17.5523 19 17C19 16.4477 18.5523 16 18 16H3V3ZM17.7071 6.70711C18.0976 6.31658 18.0976 5.68342 17.7071 5.29289C17.3166 4.90237 16.6834 4.90237 16.2929 5.29289L12 9.58579L9.70711 7.29289C9.31658 6.90237 8.68342 6.90237 8.29289 7.29289L5.29289 10.2929C4.90237 10.6834 4.90237 11.3166 5.29289 11.7071C5.68342 12.0976 6.31658 12.0976 6.70711 11.7071L9 9.41421L11.2929 11.7071C11.6834 12.0976 12.3166 12.0976 12.7071 11.7071L17.7071 6.70711Z" 
        fill="currentColor"
      />
    </svg>
  );
}

export function AudienceDefinitionCard({ version, className = "" }: AudienceDefinitionCardProps) {
  // Render for "before" and "alpha-v1" versions
  if (version !== "before" && version !== "alpha-v1") {
    return null;
  }

  return (
    <div className={`bg-white rounded-[4px] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.1),0px_0px_4px_0px_rgba(0,0,0,0.1)] p-4 w-[350px] flex flex-col gap-4 ${className}`}>
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1">
          <span className="font-optimistic font-bold text-[16px] leading-[20px] text-[#1C2B33]">
            Audience Definition
          </span>
          <InfoIcon />
        </div>
        <p className="font-optimistic text-[14px] leading-[20px] text-[#1C2B33]">
          Your audience selection is fairly broad.
        </p>
      </div>

      {/* Spectrum bar */}
      <div className="flex flex-col gap-2">
        <div className="flex gap-1">
          <div className="h-2 w-[103px] bg-[#FFEBEB] rounded" />
          <div className="h-2 w-[104px] bg-[#7ABC39] rounded" />
          <div className="h-2 w-[103px] bg-[#FFF1E0] rounded" />
        </div>
        <div className="flex justify-between">
          <span className="font-optimistic text-[14px] leading-[20px] text-[#1C2B33]">
            Specific
          </span>
          <span className="font-optimistic text-[14px] leading-[20px] text-[#1C2B33]">
            Broad
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-[#CBD2D9]" />

      {/* Bottom section */}
      <div className="flex flex-col gap-4">
        {/* Estimated audience size */}
        <div className="flex items-center gap-[6px]">
          <span className="font-optimistic text-[12px] leading-[16px] text-[#1C2B33]">
            Estimated audience size: 232,700 - 273,700
          </span>
          <InfoIcon />
        </div>

        {/* Estimates disclaimer */}
        <div className="flex items-start gap-[10px]">
          <LineChartIcon className="text-[rgba(40,57,67,0.6)] shrink-0" />
          <p className="font-optimistic text-[12px] leading-[16px] text-[rgba(28,43,51,0.6)]">
            Estimates may vary significantly over time based on your targeting selections and available data.
          </p>
        </div>
      </div>
    </div>
  );
}
