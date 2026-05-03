"use client";

import { useState } from "react";
import type { PrototypeVersion } from "./types";

interface AudienceControlsCardProps {
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
        d="M6 12C9.31371 12 12 9.31371 12 6C12 2.68629 9.31371 0 6 0C2.68629 0 0 2.68629 0 6C0 9.31371 2.68629 12 6 12ZM6.75 3.75C6.75 4.16421 6.41421 4.5 6 4.5C5.58579 4.5 5.25 4.16421 5.25 3.75C5.25 3.33579 5.58579 3 6 3C6.41421 3 6.75 3.33579 6.75 3.75ZM5.25 5.25C5.25 5.66421 5.58579 6 6 6C6.41421 6 6.75 6.33579 6.75 6.75V8.25C6.75 8.66421 6.41421 9 6 9C5.58579 9 5.25 8.66421 5.25 8.25V6.75C5.25 6.33579 5.58579 6 6 6C5.58579 6 5.25 5.66421 5.25 5.25Z" 
        fill="#283943"
      />
    </svg>
  );
}

function PencilIcon({ className }: { className?: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path 
        d="M8.5 1.5L10.5 3.5M1 11L1.5 8.5L9 1L11 3L3.5 10.5L1 11Z" 
        stroke="#0A78BE" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TriangleDownIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function TriangleUpIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M4 10L8 6L12 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="7" cy="7" r="5" stroke="#283943" strokeWidth="1.5"/>
      <path d="M11 11L14 14" stroke="#283943" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

interface LocationsFieldProps {
  value: string;
}

function LocationsField({ value }: LocationsFieldProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`flex items-start justify-between py-1 rounded-[1px] transition-colors cursor-pointer ${
        isHovered ? "bg-[#F1F4F7] -mx-2 px-2" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <span className="font-optimistic font-bold text-[14px] leading-[20px] text-[#465A69]">
            *Locations
          </span>
          <InfoIcon />
        </div>
        <span className="font-optimistic text-[14px] leading-[20px] text-[#465A69]">
          {value}
        </span>
      </div>

      {isHovered && (
        <div className="flex items-center gap-1 px-1">
          <PencilIcon />
          <span className="font-medium text-[14px] leading-[20px] text-[#0A78BE]">
            Edit
          </span>
        </div>
      )}
    </div>
  );
}

interface FieldDisplayProps {
  label: string;
  value: string;
}

function FieldDisplay({ label, value }: FieldDisplayProps) {
  return (
    <div className="flex flex-col py-1">
      <div className="flex items-center gap-1">
        <span className="font-optimistic font-bold text-[14px] leading-[20px] text-[#465A69]">
          {label}
        </span>
        <InfoIcon />
      </div>
      <span className="font-optimistic text-[14px] leading-[20px] text-[#465A69]">
        {value}
      </span>
    </div>
  );
}

export function AudienceControlsCard({ version, className = "" }: AudienceControlsCardProps) {
  const [showMoreSettings, setShowMoreSettings] = useState(false);

  if (version !== "alpha-v1") {
    return null;
  }

  return (
    <div className={`bg-white rounded-[4px] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.1),0px_0px_4px_0px_rgba(0,0,0,0.1)] p-4 w-[600px] flex flex-col gap-4 ${className}`}>
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <CheckCircleIcon />
          <div className="flex items-center gap-1">
            <span className="font-optimistic font-bold text-[16px] leading-[20px] text-[#1C2B33]">
              Audience controls
            </span>
            <InfoIcon />
          </div>
        </div>
        <p className="text-[14px] leading-[20px] text-[#1C2B33]">
          Limit who can see your ads.{" "}
          <span className="text-[#0A78BE] cursor-pointer hover:underline">Learn more</span>
        </p>
      </div>

      {/* Locations */}
      <LocationsField value="United States" />

      {/* Divider */}
      <div className="w-full h-px bg-[#CBD2D9]" />

      {/* Show/Hide settings toggle */}
      <button
        className="flex items-center gap-1 text-[#0A78BE] font-medium text-[14px] leading-[20px] hover:underline w-fit"
        onClick={() => setShowMoreSettings(!showMoreSettings)}
      >
        <span>{showMoreSettings ? "Hide settings" : "Show more settings"}</span>
        {showMoreSettings ? <TriangleUpIcon className="text-[#0A78BE]" /> : <TriangleDownIcon className="text-[#0A78BE]" />}
      </button>

      {/* Expanded Settings */}
      {showMoreSettings && (
        <>
          {/* Minimum age */}
          <FieldDisplay label="Minimum age" value="18" />

          {/* Exclude custom audiences */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <span className="font-optimistic font-bold text-[14px] leading-[20px] text-[#1C2B33]">
                Exclude these custom audiences
              </span>
              <InfoIcon />
            </div>
            <div className="flex items-center gap-2 h-9 px-3 border border-[#CBD2D9] rounded bg-white">
              <SearchIcon />
              <span className="text-[14px] leading-[20px] text-[rgba(28,43,51,0.65)]">
                Search existing audiences
              </span>
            </div>
          </div>

          {/* Languages */}
          <FieldDisplay label="Languages" value="All languages" />
        </>
      )}
    </div>
  );
}
