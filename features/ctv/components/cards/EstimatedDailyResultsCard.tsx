"use client";

import type { PrototypeVersion } from "./types";

interface EstimatedDailyResultsCardProps {
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

export function EstimatedDailyResultsCard({ version, className = "" }: EstimatedDailyResultsCardProps) {
  // Render for "before" and "alpha-v1" versions
  if (version !== "before" && version !== "alpha-v1") {
    return null;
  }

  return (
    <div className={`bg-white rounded-[4px] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.1),0px_0px_4px_0px_rgba(0,0,0,0.1)] p-4 w-[350px] flex flex-col gap-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-1">
        <span className="font-optimistic font-bold text-[16px] leading-[20px] text-[#1C2B33]">
          Estimated Daily Results
        </span>
      </div>

      {/* Reach section */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1">
          <span className="font-optimistic font-bold text-[14px] leading-[20px] text-[#1C2B33]">
            Reach
          </span>
          <InfoIcon />
        </div>
        <span className="font-optimistic font-bold text-[16px] leading-[20px] text-[#1C2B33]">
          5.3K - 15K
        </span>
        {/* Progress bar */}
        <div className="flex w-full h-3">
          <div className="w-[16px] h-3 bg-[#73C5E8]" />
          <div className="flex-1 h-3 bg-[#EAEBEE]" />
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-[#CBD2D9]" />

      {/* Disclaimer */}
      <p className="font-optimistic text-[12px] leading-[16px] text-[rgba(28,43,51,0.6)]">
        The accuracy of estimates is based on factors such as past campaign data, the budget you entered, market data, targeting criteria and ad placements. Numbers are provided to give you an idea of performance for your budget, but are only estimates and don&apos;t guarantee results.
      </p>
    </div>
  );
}
