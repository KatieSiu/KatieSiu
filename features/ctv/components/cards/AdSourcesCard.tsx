"use client";

import { Icon } from "@/features/ctv/components/ui/Icon";
import type { PrototypeVersion } from "./types";

interface AdSourcesCardProps {
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

function InfoCircleOutlineIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M8 14C11.3137 14 14 11.3137 14 8C14 4.68629 11.3137 2 8 2C4.68629 2 2 4.68629 2 8C2 11.3137 4.68629 14 8 14Z" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M8 5V5.01M8 7V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

interface SelectorFieldProps {
  label: string;
  description?: string;
  descriptionLink?: string;
  value: string;
  placeholder?: boolean;
}

function SelectorField({ label, description, descriptionLink, value, placeholder = false }: SelectorFieldProps) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex flex-col pb-1">
        <div className="flex items-center gap-1">
          <span className="font-optimistic font-bold text-[14px] leading-[20px] text-[#1C2B33]">
            {label}
          </span>
          <InfoIcon />
        </div>
        {description && (
          <span className="font-optimistic text-[12px] leading-[16px] text-[#465A69]">
            {description}
            {descriptionLink && (
              <span className="text-[#0A78BE] cursor-pointer hover:underline"> {descriptionLink}</span>
            )}
          </span>
        )}
      </div>
      <div className="bg-white border border-[#CBD2D9] rounded h-[36px] flex items-center px-3 justify-between cursor-pointer hover:border-[#0A78BE]">
        <span className={`font-optimistic text-[14px] leading-[20px] ${placeholder ? 'text-[rgba(28,43,51,0.65)]' : 'text-[#1C2B33]'}`}>
          {value}
        </span>
        <Icon name="SmallTriangleDown" variant="filled" size={16} className="text-[#283943]" />
      </div>
    </div>
  );
}

export function AdSourcesCard({ version, className = "" }: AdSourcesCardProps) {
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
            Ad sources
          </span>
        </div>
        <p className="font-optimistic text-[14px] leading-[20px] text-[#1C2B33]">
          Connect ad sources to include more information in your ad that can help inspire action.{" "}
          <span className="text-[#0A78BE] cursor-pointer hover:underline">About ad sources</span>
        </p>
      </div>

      {/* Catalog selector */}
      <SelectorField 
        label="Catalog"
        description="Select a catalog to show catalog items with your creative. This will not change your ad to an Advantage+ catalog ad."
        descriptionLink="See how it works"
        value="Select a catalog"
        placeholder={true}
      />

      {/* Guidance card */}
      <div className="relative bg-white rounded shadow-[0px_0px_1px_0px_rgba(0,0,0,0.1),0px_0px_4px_0px_rgba(0,0,0,0.1)] overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#CBD2D9] rounded-l" />
        <div className="flex gap-2 pl-10 pr-3 py-3">
          <InfoCircleOutlineIcon className="text-[#283943] shrink-0 mt-0.5" />
          <p className="font-optimistic text-[14px] leading-[20px] text-[#1C2B33]">
            We have automatically selected a catalog for you based on what we predict is most relevant.
          </p>
        </div>
      </div>

      {/* Product set selector */}
      <SelectorField 
        label="Product set"
        description="Use a product set to feature certain products in your ads and shops on Facebook and Instagram."
        value="All Products"
      />
    </div>
  );
}
