"use client";

import { useState } from "react";
import { Icon } from "@/features/ctv/components/ui/Icon";
import type { PrototypeVersion } from "./types";

interface AdSetupCardProps {
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
      <path d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5L6 0Z" fill="#283943"/>
    </svg>
  );
}

interface RadioItemProps {
  label: string;
  description?: string;
  selected?: boolean;
  hasSparkle?: boolean;
  linkText?: string;
  onClick?: () => void;
}

function RadioItem({ label, description, selected = false, hasSparkle = false, linkText, onClick }: RadioItemProps) {
  return (
    <div className="flex gap-2 py-1 cursor-pointer" onClick={onClick}>
      <div className="flex items-center">
        <div className={`w-6 h-6 rounded-full border border-[#CBD2D9] flex items-center justify-center ${selected ? 'border-[#CBD2D9]' : ''}`}>
          {selected && <div className="w-3 h-3 rounded-full bg-[#0A78BE]" />}
        </div>
      </div>
      <div className="flex flex-col flex-1">
        <div className="flex items-center gap-1">
          <span className="font-optimistic text-[14px] leading-[20px] text-[#1C2B33]">
            {label}
          </span>
          {hasSparkle && <SparkleIcon />}
        </div>
        {description && (
          <span className="font-optimistic text-[12px] leading-[16px] text-[#465A69]">
            {description}
            {linkText && (
              <span className="text-[#0A78BE] cursor-pointer hover:underline"> {linkText}</span>
            )}
          </span>
        )}
      </div>
    </div>
  );
}

interface CheckboxItemProps {
  label: string;
  description?: string;
  checked?: boolean;
  linkText?: string;
}

function CheckboxItem({ label, description, checked = false, linkText }: CheckboxItemProps) {
  return (
    <div className="flex gap-2 py-1">
      <div className="flex items-center">
        <div className={`w-6 h-6 rounded border border-[#CBD2D9] flex items-center justify-center ${checked ? 'bg-white' : 'bg-white'}`}>
          {checked && (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 4L6 11L3 8" stroke="#0A78BE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>
      </div>
      <div className="flex flex-col flex-1">
        <span className="font-optimistic text-[14px] leading-[20px] text-[#1C2B33]">
          {label}
        </span>
        {description && (
          <span className="font-optimistic text-[12px] leading-[16px] text-[#465A69]">
            {description}
            {linkText && (
              <span className="text-[#0A78BE] cursor-pointer hover:underline"> {linkText}</span>
            )}
          </span>
        )}
      </div>
    </div>
  );
}

export function AdSetupCard({ version, className = "" }: AdSetupCardProps) {
  const [showMoreSettings, setShowMoreSettings] = useState(false);
  const [creativeSource, setCreativeSource] = useState("manual");
  const [format, setFormat] = useState("single");

  // Render for "before" and "alpha-v1" versions
  if (version !== "before" && version !== "alpha-v1") {
    return null;
  }

  return (
    <div className={`bg-white rounded-[4px] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.1),0px_0px_5px_0px_rgba(0,0,0,0.1)] p-4 w-[600px] flex flex-col gap-3 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-2">
        <CheckCircleIcon />
        <span className="font-optimistic font-bold text-[16px] leading-[20px] text-[#1C2B33]">
          Ad setup
        </span>
      </div>

      {/* Dropdown selector */}
      <div className="bg-white border border-[#CBD2D9] rounded h-[36px] flex items-center px-3 justify-between cursor-pointer hover:border-[#0A78BE]">
        <span className="font-optimistic text-[14px] leading-[20px] text-[#1C2B33]">
          Create ad
        </span>
        <Icon name="SmallTriangleDown" variant="filled" size={16} className="text-[#283943]" />
      </div>

      {/* Creative source section */}
      <div className="flex flex-col">
        <div className="flex flex-col py-1">
          <span className="font-optimistic font-bold text-[15px] leading-[20px] text-[#1C2B33]">
            Creative source
          </span>
          <span className="font-optimistic text-[14px] leading-[20px] text-[#465A69]">
            Choose how you'd like to provide the media for your ad.
          </span>
        </div>
        <RadioItem 
          label="Manual upload"
          description="Manually upload images or videos."
          selected={creativeSource === "manual"}
          onClick={() => setCreativeSource("manual")}
        />
        <RadioItem 
          label="Advantage+ catalog ads"
          description="Automatically use media from your catalog. We'll show each person the catalog items they're most likely to engage with."
          linkText="About Advantage+ catalog ads"
          selected={creativeSource === "catalog"}
          hasSparkle={true}
          onClick={() => setCreativeSource("catalog")}
        />
      </div>

      {/* Format section */}
      <div className="flex flex-col gap-1">
        <div className="flex flex-col pb-1">
          <span className="font-optimistic font-bold text-[15px] leading-[20px] text-[#1C2B33]">
            Format
          </span>
          <span className="font-optimistic text-[14px] leading-[20px] text-[#465A69]">
            Choose how you'd like to structure your ad.
          </span>
        </div>
        <RadioItem 
          label="Single image or video"
          description="One image or video, or a slideshow with multiple images"
          selected={format === "single"}
          onClick={() => setFormat("single")}
        />
        <RadioItem 
          label="Carousel"
          description="2 or more scrollable images or videos"
          selected={format === "carousel"}
          onClick={() => setFormat("carousel")}
        />
        <RadioItem 
          label="Collection"
          description="Group of items that opens into a fullscreen mobile experience"
          selected={format === "collection"}
          onClick={() => setFormat("collection")}
        />
      </div>

      {/* Divider */}
      <div className="h-px bg-[#CBD2D9]" />

      {/* Multi-advertiser ads checkbox */}
      <CheckboxItem 
        label="Multi-advertiser ads"
        description="Your ads can appear alongside other ads in the same ad unit to help people discover products and services from businesses that are personalized to them. Your ad creative may be resized or cropped to fit the ad unit."
        linkText="Learn about multi-advertiser ads"
        checked={true}
      />

      {/* Show more settings link */}
      <button 
        className="flex items-center gap-1 text-left"
        onClick={() => setShowMoreSettings(!showMoreSettings)}
      >
        <span className="font-optimistic font-medium text-[14px] leading-[20px] text-[#0A78BE]">
          Show more settings
        </span>
        <Icon 
          name={showMoreSettings ? "CaretUp" : "CaretDown"} 
          variant="filled" 
          size={16} 
          className="text-[#0A78BE]" 
        />
      </button>
    </div>
  );
}
