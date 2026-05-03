"use client";

import { useState } from "react";
import { Icon } from "@/features/ctv/components/ui/Icon";
import type { PrototypeVersion } from "./types";

interface AdCreativeCardProps {
  version: PrototypeVersion;
  className?: string;
  onAddVideo?: () => void;
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

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function VideoPlayIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="0.5" y="0.5" width="15" height="11" rx="1.5" fill="currentColor" stroke="currentColor"/>
      <path d="M6 3.5V8.5L10.5 6L6 3.5Z" fill="white"/>
    </svg>
  );
}

function ImageAdIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="1" y="2" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="5" cy="6" r="1.5" fill="currentColor"/>
      <path d="M1 11L5 7L8 10L11 7L15 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function VideoAdIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M6 6V10L10 8L6 6Z" fill="currentColor"/>
    </svg>
  );
}


interface TextInputWithButtonProps {
  label: string;
  placeholder: string;
}

function TextInputWithButton({ label, placeholder }: TextInputWithButtonProps) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex items-center gap-1 pb-1">
        <span className="font-optimistic font-bold text-[14px] leading-[20px] text-[#1C2B33]">
          {label}
        </span>
        <InfoIcon />
      </div>
      <div className="bg-white border border-[#CBD2D9] rounded h-[48px] flex items-center px-3 pr-2 justify-between">
        <span className="font-optimistic text-[14px] leading-[20px] text-[rgba(28,43,51,0.65)]">
          {placeholder}
        </span>
        <button className="h-[36px] bg-[#F2F2F2] rounded px-3 flex items-center justify-center">
          <PlusIcon className="text-[#283943]" />
        </button>
      </div>
    </div>
  );
}

export function AdCreativeCard({ version, className = "", onAddVideo, isTVMode = false }: AdCreativeCardProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  // Render for "before" and "alpha-v1" versions
  if (version !== "before" && version !== "alpha-v1") {
    return null;
  }

  const isAlpha = version === "alpha-v1";
  const showTVVersion = isAlpha && isTVMode;

  const handleDropdownSelect = () => {
    setShowDropdown(false);
    onAddVideo?.();
  };

  // TV Mode ON - simplified video-only card
  if (showTVVersion) {
    return (
      <div className={`bg-white rounded-[4px] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.1),0px_0px_5px_0px_rgba(0,0,0,0.1)] p-4 w-[600px] flex flex-col gap-4 ${className}`}>
        {/* Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <CheckCircleIcon />
            <span className="font-optimistic font-bold text-[16px] leading-[20px] text-[#1C2B33]">
              Ad creative
            </span>
          </div>
          <p className="font-optimistic text-[14px] leading-[20px] text-[#1C2B33]">
            Add a video to reach people on TV screens.
          </p>
        </div>

        {/* Video section */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1">
            <span className="font-optimistic font-bold text-[15px] leading-[20px] text-[#1C2B33]">
              Video
            </span>
            <InfoIcon />
          </div>
          <button 
            className="w-fit h-[36px] bg-transparent border border-[#A7B3BF] rounded px-3 flex items-center gap-2 hover:border-[#0A78BE] transition-colors"
            onClick={onAddVideo}
          >
            <VideoPlayIcon className="text-[#283943]" />
            <span className="font-optimistic font-medium text-[14px] leading-[20px] text-[#1C2B33]">
              Add video
            </span>
          </button>
        </div>
      </div>
    );
  }

  // Before version - full card
  return (
    <div className={`bg-white rounded-[4px] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.1),0px_0px_5px_0px_rgba(0,0,0,0.1)] p-4 w-[600px] flex flex-col gap-4 ${className}`}>
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <CheckCircleIcon />
          <span className="font-optimistic font-bold text-[16px] leading-[20px] text-[#1C2B33]">
            Ad creative
          </span>
        </div>
        <p className="font-optimistic text-[14px] leading-[20px] text-[#1C2B33]">
          Select and optimize your ad text, media and enhancements.
        </p>
      </div>

      {/* Creative tools section */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1">
          <span className="font-optimistic font-bold text-[15px] leading-[20px] text-[#1C2B33]">
            Creative tools
          </span>
          <InfoIcon />
        </div>
        <div className="relative">
          <button 
            className="w-fit h-[36px] bg-transparent border border-[#A7B3BF] rounded px-3 flex items-center gap-2 hover:border-[#0A78BE] transition-colors"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <span className="font-optimistic font-medium text-[14px] leading-[20px] text-[#1C2B33]">
              Set up creative
            </span>
            <Icon name="SmallTriangleDown" variant="filled" size={16} className="text-[#283943]" />
          </button>
          
          {showDropdown && (
            <div className="absolute top-[40px] left-0 bg-white rounded-lg shadow-[0px_2px_8px_rgba(0,0,0,0.15)] py-2 min-w-[160px] z-10">
              <button 
                className="w-full px-4 py-2 flex items-center gap-3 hover:bg-[#F5F6F7] transition-colors"
                onClick={handleDropdownSelect}
              >
                <ImageAdIcon className="text-[#1C2B33]" />
                <span className="font-optimistic text-[14px] leading-[20px] text-[#1C2B33]">
                  Image ad
                </span>
              </button>
              <button 
                className="w-full px-4 py-2 flex items-center gap-3 hover:bg-[#F5F6F7] transition-colors"
                onClick={handleDropdownSelect}
              >
                <VideoAdIcon className="text-[#1C2B33]" />
                <span className="font-optimistic text-[14px] leading-[20px] text-[#1C2B33]">
                  Video ad
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Primary text input */}
      <TextInputWithButton 
        label="Primary text"
        placeholder="Tell people what your ad is about"
      />

      {/* Headline input */}
      <TextInputWithButton 
        label="Headline"
        placeholder="Add an attention-grabbing headline"
      />

      {/* Add description link */}
      <span className="font-sf-pro text-[14px] leading-[20px] text-[#0A78BE] cursor-pointer hover:underline">
        Add description
      </span>

      {/* Call to action selector */}
      <div className="flex flex-col gap-1 w-full">
        <div className="flex items-center gap-1 pb-1">
          <span className="font-optimistic font-bold text-[15px] leading-[20px] text-[#1C2B33]">
            Call to action
          </span>
          <InfoIcon />
        </div>
        <div className="bg-white border border-[#CBD2D9] rounded h-[36px] flex items-center px-3 justify-between cursor-pointer hover:border-[#0A78BE]">
          <span className="font-sf-pro text-[14px] leading-[20px] text-[#1C2B33]">
            Shop now
          </span>
          <Icon name="SmallTriangleDown" variant="filled" size={16} className="text-[#283943]" />
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-[#CBD2D9] my-2" />

      {/* Enhancements section */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1 pb-1">
          <span className="font-optimistic font-bold text-[15px] leading-[20px] text-[#1C2B33]">
            Enhancements (6/7)
          </span>
          <InfoIcon />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-optimistic text-[12px] leading-[16px] text-[#1C2B33]">
              <span className="font-bold">Turned off:</span> Music
            </span>
            <span className="font-optimistic text-[12px] leading-[16px] text-[#1C2B33]">
              <span className="font-bold">Turned on:</span> Add overlays, Visual touch-ups, Expand image and 3 more
            </span>
          </div>
          <button className="h-[36px] bg-transparent border border-[#A7B3BF] rounded px-3 flex items-center justify-center hover:border-[#0A78BE] transition-colors">
            <span className="font-optimistic font-medium text-[14px] leading-[20px] text-[#1C2B33]">
              Edit
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
