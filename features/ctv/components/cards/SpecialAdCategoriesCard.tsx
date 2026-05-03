"use client";

import { Icon } from "@/features/ctv/components/ui/Icon";
import type { PrototypeVersion } from "./types";

interface SpecialAdCategoriesCardProps {
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

export function SpecialAdCategoriesCard({ version, className = "" }: SpecialAdCategoriesCardProps) {
  return (
    <div className={`bg-white rounded-[4px] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.1),0px_0px_4px_0px_rgba(0,0,0,0.1)] p-4 w-[600px] flex flex-col gap-4 ${className}`}>
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 h-5">
          <CheckCircleIcon />
          <span className="font-optimistic font-bold text-[16px] leading-[20px] text-[#1C2B33]">
            Special Ad Categories
          </span>
        </div>
        
        {/* Description */}
        <p className="font-optimistic text-[14px] leading-[20px] text-[#1C2B33]">
          Declare if your ads are related to financial products and services, employment, housing, social issues, elections or politics to help prevent ad rejections. Requirements differ by country.{" "}
          <span className="text-[#0A78BE] cursor-pointer hover:underline">About Special Ad Categories</span>
        </p>
      </div>

      {/* Categories Selector */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col pb-1">
          <span className="font-optimistic font-bold text-[14px] leading-[20px] text-[#1C2B33]">
            Categories
          </span>
          <span className="font-sf-pro text-[12px] leading-[16px] text-[#465A69]">
            Select the categories that best describe what this campaign will advertise.
          </span>
        </div>
        
        {/* Selector Input */}
        <div className="bg-white border border-[#CBD2D9] rounded h-[36px] flex items-center px-3 justify-between cursor-pointer hover:border-[#0A78BE]">
          <span className="font-sf-pro text-[14px] leading-[20px] text-[rgba(28,43,51,0.65)]">
            Declare category if applicable
          </span>
          <Icon name="SmallTriangleDown" variant="filled" size={16} className="text-[#283943]" />
        </div>
      </div>
    </div>
  );
}
