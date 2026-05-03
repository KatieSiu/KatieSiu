"use client";

import type { PrototypeVersion } from "./types";

interface AdvantagePlusAudienceCardProps {
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

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5L6 0Z" fill="currentColor"/>
    </svg>
  );
}

function PlusCircleIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M8 5V11M5 8H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

export function AdvantagePlusAudienceCard({ version, className = "" }: AdvantagePlusAudienceCardProps) {
  if (version !== "alpha-v1") {
    return null;
  }

  return (
    <div className={`bg-white rounded-[4px] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.1),0px_0px_4px_0px_rgba(0,0,0,0.1)] px-2 py-4 w-[600px] flex flex-col gap-3 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-2 px-2">
        <CheckCircleIcon />
        <span className="font-optimistic font-bold text-[16px] leading-[20px] text-[#1C2B33]">
          Advantage+ audience
        </span>
        <SparkleIcon className="text-[#1C2B33]" />
      </div>

      {/* Description */}
      <p className="text-[14px] leading-[20px] text-[#1C2B33] px-2">
        We&apos;ll automatically show ads to people most likely to respond. We&apos;ll show ads to people matching your suggestion, and other audiences when it&apos;s likely to improve performance.{" "}
        <span className="text-[#0A78BE] cursor-pointer hover:underline">About audiences</span>
      </p>

      {/* Audience suggestion button */}
      <div className="px-2">
        <button className="w-fit h-[36px] bg-white border border-[#CBD2D9] rounded px-3 flex items-center gap-2 hover:border-[#0A78BE] transition-colors">
          <PlusCircleIcon className="text-[#283943]" />
          <span className="font-medium text-[14px] leading-[20px] text-[#1C2B33]">
            Audience suggestion (optional)
          </span>
        </button>
      </div>

      {/* Divider */}
      <div className="h-px bg-[#CBD2D9] mx-2" />

      {/* Footer */}
      <div className="flex items-center justify-between px-2">
        <button className="h-[36px] bg-white border border-[#CBD2D9] rounded px-3 hover:border-[#0A78BE] transition-colors">
          <span className="font-medium text-[14px] leading-[20px] text-[#1C2B33]">
            Save audience
          </span>
        </button>
        <span className="text-[#0A78BE] text-[14px] leading-[20px] cursor-pointer hover:underline">
          Switch to original audience options
        </span>
      </div>
    </div>
  );
}
