"use client";

import type { PrototypeVersion } from "./types";

interface AdNameCardProps {
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

export function AdNameCard({ version, className = "" }: AdNameCardProps) {
  // Render for "before" and "alpha-v1" versions
  if (version !== "before" && version !== "alpha-v1") {
    return null;
  }

  return (
    <div className={`bg-white rounded-[4px] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.1),0px_0px_4px_0px_rgba(0,0,0,0.1)] p-4 w-[600px] flex flex-col gap-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-2">
        <CheckCircleIcon />
        <span className="font-optimistic font-bold text-[16px] leading-[20px] text-[#1C2B33]">
          Ad name
        </span>
      </div>

      {/* Input and button row */}
      <div className="flex gap-3 items-start">
        <div className="flex-1 bg-white border border-[#CBD2D9] rounded h-[36px] flex items-center px-3">
          <span className="font-optimistic text-[14px] leading-[20px] text-[#1C2B33]">
            New Ad
          </span>
        </div>
        <button className="h-[36px] bg-transparent border border-[#A7B3BF] rounded px-3 flex items-center justify-center hover:border-[#0A78BE] transition-colors whitespace-nowrap">
          <span className="font-optimistic font-medium text-[14px] leading-[20px] text-[#1C2B33]">
            Create template
          </span>
        </button>
      </div>
    </div>
  );
}
