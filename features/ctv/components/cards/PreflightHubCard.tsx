"use client";

import type { PrototypeVersion } from "./types";

interface PreflightHubCardProps {
  version: PrototypeVersion;
  className?: string;
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <div className={`w-4 h-4 rounded-full bg-[#006B4E] flex items-center justify-center ${className}`}>
      <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
        <path d="M13.5 4.5L6 12L2.5 8.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M6 12L10 8L6 4" stroke="#283943" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function PreflightHubCard({ version, className = "" }: PreflightHubCardProps) {
  if (version !== "before" && version !== "alpha-v1") {
    return null;
  }

  return (
    <div className={`bg-white rounded-[4px] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.1),0px_0px_4px_0px_rgba(0,0,0,0.1)] p-3 w-[526px] flex items-center justify-between cursor-pointer hover:bg-[#F5F7F8] transition-colors ${className}`}>
      <div className="flex items-center gap-2">
        <CheckCircleIcon />
        <span className="font-optimistic text-[14px] text-[#1C2B33]">
          No issues found
        </span>
      </div>
      <ChevronRightIcon />
    </div>
  );
}
