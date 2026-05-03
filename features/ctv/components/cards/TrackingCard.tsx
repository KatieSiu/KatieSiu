"use client";

import type { PrototypeVersion } from "./types";

interface TrackingCardProps {
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

interface CheckboxItemProps {
  label: string;
  checked?: boolean;
}

function CheckboxItem({ label, checked = false }: CheckboxItemProps) {
  return (
    <div className="flex items-center gap-2 py-1">
      <div className={`w-6 h-6 rounded border border-[#CBD2D9] flex items-center justify-center ${checked ? 'bg-[#0A78BE]' : 'bg-white'}`}>
        {checked && (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.5 4L5.5 10L2.5 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
      <span className="font-sf-pro text-[14px] leading-[20px] text-[#1C2B33]">
        {label}
      </span>
    </div>
  );
}

export function TrackingCard({ version, className = "" }: TrackingCardProps) {
  // Render for "before" and "alpha-v1" versions
  if (version !== "before" && version !== "alpha-v1") {
    return null;
  }

  return (
    <div className={`bg-white rounded-[4px] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.1),0px_0px_5px_0px_rgba(0,0,0,0.1)] p-4 w-[600px] flex flex-col gap-4 ${className}`}>
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <CheckCircleIcon />
          <span className="font-optimistic font-bold text-[16px] leading-[20px] text-[#1C2B33]">
            Tracking
          </span>
        </div>
        <p className="font-optimistic text-[14px] leading-[20px] text-[#1C2B33]">
          Track event datasets that contain the conversions your ad might motivate. The dataset that contains the conversion selected for the ad account will be tracked by default.
        </p>
      </div>

      {/* Checkbox list */}
      <div className="flex flex-col">
        <CheckboxItem label="Website events" />
        <CheckboxItem label="App events" />
        <CheckboxItem label="Offline events" />
      </div>

      {/* Link */}
      <span className="font-sf-pro text-[14px] leading-[20px] text-[#0A78BE] cursor-pointer hover:underline">
        Edit tracked offline event sets
      </span>

      {/* URL parameters */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1 pb-1">
            <span className="font-optimistic font-bold text-[14px] leading-[20px] text-[#1C2B33]">
              URL parameters
            </span>
            <span className="font-sf-pro text-[14px] leading-[20px] text-[rgba(28,43,51,0.65)]">
              ∙
            </span>
            <span className="font-optimistic font-bold text-[15px] leading-[20px] text-[rgba(28,43,51,0.65)]">
              Optional
            </span>
            <InfoIcon />
          </div>
          <div className="bg-white border border-[#CBD2D9] rounded h-[36px] flex items-center px-3">
            <span className="font-sf-pro text-[14px] leading-[20px] text-[#1C2B33]">
              key1=value&key2=value2
            </span>
          </div>
          <span className="font-sf-pro text-[12px] leading-[16px] text-[#0A78BE] cursor-pointer hover:underline">
            Build a URL parameter
          </span>
        </div>
      </div>
    </div>
  );
}
