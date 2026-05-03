"use client";

import { useState } from "react";
import { Icon } from "@/features/ctv/components/ui/Icon";
import type { PrototypeVersion } from "./types";

interface DestinationCardProps {
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

function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M6 3H3C2.44772 3 2 3.44772 2 4V13C2 13.5523 2.44772 14 3 14H12C12.5523 14 13 13.5523 13 13V10M9 2H14M14 2V7M14 2L6 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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

interface RadioItemProps {
  label: string;
  description?: string;
  selected?: boolean;
  hasSparkle?: boolean;
  onClick?: () => void;
}

function RadioItem({ label, description, selected = false, hasSparkle = false, onClick }: RadioItemProps) {
  return (
    <div className="flex gap-2 py-1 cursor-pointer" onClick={onClick}>
      <div className="flex items-center">
        <div className={`w-6 h-6 rounded-full border border-[#CBD2D9] flex items-center justify-center`}>
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
}

function CheckboxItem({ label, description, checked = false }: CheckboxItemProps) {
  return (
    <div className="flex gap-2 py-1">
      <div className="flex items-center">
        <div className={`w-6 h-6 rounded border border-[#CBD2D9] flex items-center justify-center bg-white`}>
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
          </span>
        )}
      </div>
    </div>
  );
}

interface DeepLinkInputProps {
  label: string;
}

function DeepLinkInput({ label }: DeepLinkInputProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1 pb-1">
        <span className="font-optimistic font-bold text-[14px] leading-[20px] text-[#1C2B33]">
          {label}
        </span>
        <InfoIcon />
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-white border border-[#CBD2D9] rounded h-[48px] flex items-center px-3 pr-2 justify-between">
          <span className="font-optimistic text-[14px] leading-[20px] text-[rgba(28,43,51,0.65)]">
            Enter the app deep link
          </span>
          <button className="h-[36px] bg-[#F2F2F2] rounded px-3 flex items-center justify-center">
            <PlusIcon className="text-[#283943]" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function DestinationCard({ version, className = "" }: DestinationCardProps) {
  const [destination, setDestination] = useState("advantage");

  // Render for "before" and "alpha-v1" versions
  if (version !== "before" && version !== "alpha-v1") {
    return null;
  }

  return (
    <div className={`bg-white rounded-[4px] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.1),0px_0px_4px_0px_rgba(0,0,0,0.1)] p-4 w-[600px] flex flex-col gap-4 ${className}`}>
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <CheckCircleIcon />
          <span className="font-optimistic font-bold text-[16px] leading-[20px] text-[#1C2B33]">
            Destination
          </span>
        </div>
        <p className="font-optimistic text-[14px] leading-[20px] text-[#1C2B33]">
          Tell us where to send people immediately after they tap or click on your ad.{" "}
          <span className="text-[#0A78BE] cursor-pointer hover:underline">Learn more</span>
        </p>
      </div>

      {/* Destination options */}
      <div className="flex flex-col">
        <RadioItem 
          label="Advantage+ destination"
          description="When people tap or click your ad, we'll send them to your website or app depending on where they're most likely to convert. If applicable, we'll send them to an app store."
          selected={destination === "advantage"}
          hasSparkle={true}
          onClick={() => setDestination("advantage")}
        />
        <RadioItem 
          label="Manual destination"
          description="When people tap or click your ad, we'll send them to the destinations you specify."
          selected={destination === "manual"}
          onClick={() => setDestination("manual")}
        />
      </div>

      {/* Website section */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-1">
          <span className="font-optimistic font-bold text-[16px] leading-[20px] text-[#1C2B33]">
            Website
          </span>
          <InfoIcon />
        </div>

        <div className="flex flex-col gap-2">
          {/* Website URL input */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1 pb-1">
              <span className="font-optimistic font-bold text-[14px] leading-[20px] text-[#1C2B33]">
                * Website URL
              </span>
              <InfoIcon />
            </div>
            <div className="flex gap-1">
              <div className="flex-1 bg-white border border-[#CBD2D9] rounded h-[36px] flex items-center px-3">
                <span className="font-sf-pro text-[14px] leading-[20px] text-[#1C2B33]">
                  http://www.example.com/
                </span>
              </div>
              <button className="h-[36px] bg-transparent border border-[#A7B3BF] rounded px-3 flex items-center gap-2 hover:border-[#0A78BE] transition-colors">
                <ExternalLinkIcon className="text-[#283943]" />
                <span className="font-optimistic font-medium text-[14px] leading-[20px] text-[#1C2B33]">
                  Preview URL
                </span>
              </button>
            </div>
          </div>

          {/* Build URL link */}
          <span className="font-optimistic font-medium text-[14px] leading-[20px] text-[#0A78BE] cursor-pointer hover:underline">
            Build a URL Parameter
          </span>

          {/* Override checkbox */}
          <CheckboxItem 
            label="Override catalog deep links"
            description="This allows you to override any website deep links for items in the selected catalog."
          />
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-[#CBD2D9]" />

      {/* App section */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-1">
          <span className="font-optimistic font-bold text-[16px] leading-[20px] text-[#1C2B33]">
            App
          </span>
          <InfoIcon />
        </div>

        {/* Mobile app selector */}
        <div className="flex flex-col gap-1">
          <span className="font-optimistic font-bold text-[14px] leading-[20px] text-[#1C2B33] pb-1">
            Mobile app
          </span>
          <div className="bg-white border border-[#CBD2D9] rounded h-[36px] flex items-center px-3 justify-between cursor-pointer hover:border-[#0A78BE]">
            <span className="font-sf-pro text-[14px] leading-[20px] text-[rgba(28,43,51,0.65)]">
              Choose app
            </span>
            <Icon name="SmallTriangleDown" variant="filled" size={16} className="text-[#283943]" />
          </div>
        </div>

        {/* Deep link inputs */}
        <DeepLinkInput label="iOS deep link" />
        <DeepLinkInput label="Android deep link" />
        <DeepLinkInput label="Windows deep link" />
      </div>
    </div>
  );
}
