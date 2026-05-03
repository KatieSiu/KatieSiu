"use client";

import { useState } from "react";
import { Icon } from "@/features/ctv/components/ui/Icon";
import type { PrototypeVersion } from "./types";

interface AudienceCardProps {
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

function PlusCircleIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path fillRule="evenodd" clipRule="evenodd" d="M8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15ZM8.75 5.5C8.75 5.08579 8.41421 4.75 8 4.75C7.58579 4.75 7.25 5.08579 7.25 5.5V7.25H5.5C5.08579 7.25 4.75 7.58579 4.75 8C4.75 8.41421 5.08579 8.75 5.5 8.75H7.25V10.5C7.25 10.9142 7.58579 11.25 8 11.25C8.41421 11.25 8.75 10.9142 8.75 10.5V8.75H10.5C10.9142 8.75 11.25 8.41421 11.25 8C11.25 7.58579 10.9142 7.25 10.5 7.25H8.75V5.5Z" stroke="currentColor" strokeWidth="1"/>
    </svg>
  );
}

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path fillRule="evenodd" clipRule="evenodd" d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10ZM6.5 1.5C6.5 0.947715 6.94772 0.5 7.5 0.5H8.5C9.05228 0.5 9.5 0.947715 9.5 1.5V2.05C10.3477 2.22607 11.1269 2.57024 11.8 3.04722L12.1893 2.65787C12.5799 2.26735 13.213 2.26735 13.6036 2.65787L14.3107 3.36498C14.7012 3.7555 14.7012 4.38867 14.3107 4.77919L13.9528 5.13713C14.4298 5.81014 14.7739 6.58935 14.95 7.43701H15.5C16.0523 7.43701 16.5 7.88473 16.5 8.43701V9.43701C16.5 9.9893 16.0523 10.437 15.5 10.437H14.95C14.7739 11.2847 14.4298 12.0639 13.9528 12.7369L14.3107 13.0948C14.7012 13.4854 14.7012 14.1185 14.3107 14.509L13.6036 15.2162C13.213 15.6067 12.5799 15.6067 12.1893 15.2162L11.8314 14.8582C11.1584 15.3352 10.3792 15.6793 9.53149 15.8554V16.437C9.53149 16.9893 9.08377 17.437 8.53149 17.437H7.53149C6.9792 17.437 6.53149 16.9893 6.53149 16.437V15.8554C5.68383 15.6793 4.90462 15.3352 4.23161 14.8582L3.87367 15.2162C3.48315 15.6067 2.84998 15.6067 2.45946 15.2162L1.75235 14.509C1.36183 14.1185 1.36183 13.4854 1.75235 13.0948L2.11029 12.7369C1.63331 12.0639 1.28914 11.2847 1.11307 10.437H0.5C-0.0522847 10.437 -0.5 9.9893 -0.5 9.43701V8.43701C-0.5 7.88473 -0.0522847 7.43701 0.5 7.43701H1.11307C1.28914 6.58935 1.63331 5.81014 2.11029 5.13713L1.75235 4.77919C1.36183 4.38867 1.36183 3.7555 1.75235 3.36498L2.45946 2.65787C2.84998 2.26735 3.48315 2.26735 3.87367 2.65787L4.26302 3.04722C4.93603 2.57024 5.71524 2.22607 6.56291 2.05V1.5H6.5Z" fill="currentColor"/>
    </svg>
  );
}

function AdvantagePill() {
  return (
    <div className="bg-[#EBF2E6] flex items-center gap-1 h-[18px] px-[6px] py-px rounded-full">
      <SparkleIcon className="text-[#006B4E]" />
      <span className="font-optimistic font-bold text-[12px] leading-[16px] text-[#006B4E]">
        Advantage+ on
      </span>
    </div>
  );
}

export function AudienceCard({ version, className = "", isTVMode = false }: AudienceCardProps) {
  const [showMoreSettings, setShowMoreSettings] = useState(false);

  // Render for both "before" and "alpha-v1" versions (same card design)
  if (version !== "before" && version !== "alpha-v1") {
    return null;
  }

  // TV Mode specific behaviors can be added here
  // For now, the card renders the same regardless of TV mode
  // Future: Add TV-specific audience controls or restrictions

  return (
    <div className={`bg-white rounded-[4px] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.1),0px_0px_4px_0px_rgba(0,0,0,0.1)] px-2 py-4 w-[600px] flex flex-col gap-3 ${className}`}>
      {/* Header */}
      <div className="flex flex-col gap-2 px-2">
        <div className="flex items-center gap-2">
          <CheckCircleIcon />
          <span className="font-optimistic font-bold text-[16px] leading-[20px] text-[#1C2B33] flex-1">
            Audience
          </span>
          <AdvantagePill />
        </div>
        <p className="font-optimistic text-[14px] leading-[20px] text-[#1C2B33]">
          We&apos;ll automatically show ads to people most likely to respond.{" "}
          <span className="text-[#0A78BE] cursor-pointer hover:underline">About audiences</span>
        </p>
      </div>

      {/* No advertising settings pill */}
      <div className="px-2">
        <span className="inline-block bg-[#F1F4F7] px-[6px] rounded-full font-sf-pro font-bold text-[12px] leading-[16px] text-[#283943]">
          No advertising settings set
        </span>
      </div>

      {/* Use saved audience dropdown */}
      <button className="flex items-center gap-2 px-3 py-2 h-[36px] rounded hover:bg-[#F1F4F7] transition-colors w-fit">
        <span className="font-optimistic font-medium text-[14px] leading-[20px] text-[#1C2B33]">
          Use saved audience
        </span>
        <Icon name="SmallTriangleDown" variant="filled" size={16} className="text-[#283943]" />
      </button>

      {/* Divider */}
      <div className="h-px bg-[#CBD2D9] mx-2" />

      {/* Controls section */}
      <div className="flex flex-col gap-3 px-2">
        <div className="flex flex-col">
          <div className="flex items-center gap-1 pb-1">
            <span className="font-optimistic font-bold text-[16px] leading-[20px] text-[rgba(0,0,0,0.75)]">
              Controls
            </span>
            <InfoIcon />
          </div>
          <p className="font-optimistic text-[14px] leading-[20px] text-[#1C2B33]">
            Limit who can see your ads
          </p>
        </div>

        {/* Locations */}
        <div className="py-2">
          <div className="flex items-center gap-1">
            <span className="font-optimistic font-bold text-[14px] leading-[20px] text-[rgba(0,0,0,0.75)]">
              Locations
            </span>
            <InfoIcon />
          </div>
          <p className="font-optimistic text-[14px] leading-[20px] text-[#465A69]">
            <span className="font-sf-pro font-bold">Inclusion</span>: United States
          </p>
        </div>

        {/* Show more settings link */}
        <button
          className="flex items-center gap-1 text-[#0A78BE] font-optimistic font-medium text-[14px] leading-[20px] hover:underline w-fit"
          onClick={() => setShowMoreSettings(!showMoreSettings)}
        >
          <span>{showMoreSettings ? "Hide settings" : "Show more settings"}</span>
          <Icon
            name={showMoreSettings ? "SmallTriangleUp" : "SmallTriangleDown"}
            variant="filled"
            size={16}
            className="text-[#0A78BE]"
          />
        </button>

        {/* Divider */}
        <div className="h-px bg-[#CBD2D9]" />

        {/* Suggest an audience section */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1 pb-1">
            <span className="font-optimistic font-bold text-[16px] leading-[20px] text-[rgba(0,0,0,0.75)]">
              Suggest an audience
            </span>
            <InfoIcon />
          </div>
          <p className="font-optimistic text-[14px] leading-[20px] text-[#1C2B33]">
            We&apos;ll show ads beyond these settings when it&apos;s likely to improve performance.
          </p>
        </div>

        {/* Add suggestions button */}
        <button className="w-fit h-[36px] bg-transparent border border-[#A7B3BF] rounded px-3 flex items-center gap-2 hover:border-[#0A78BE] transition-colors">
          <PlusCircleIcon className="text-[#283943]" />
          <span className="font-optimistic font-medium text-[14px] leading-[20px] text-[#1C2B33]">
            Add suggestions (optional)
          </span>
        </button>

        {/* Divider */}
        <div className="h-px bg-[#CBD2D9]" />
      </div>

      {/* Footer buttons */}
      <div className="flex items-center justify-between px-2">
        <button className="flex items-center gap-2 px-3 py-2 h-[36px] rounded hover:bg-[#F1F4F7] transition-colors">
          <SettingsIcon className="text-[#283943]" />
          <span className="font-optimistic font-medium text-[14px] leading-[20px] text-[#1C2B33]">
            Further limit the reach of your ads
          </span>
        </button>
        <button className="h-[36px] bg-transparent border border-[#A7B3BF] rounded px-3 flex items-center justify-center hover:border-[#0A78BE] transition-colors">
          <span className="font-optimistic font-medium text-[14px] leading-[20px] text-[#1C2B33]">
            Save audience
          </span>
        </button>
      </div>
    </div>
  );
}
