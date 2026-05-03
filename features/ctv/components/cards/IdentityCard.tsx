"use client";

import { Icon } from "@/features/ctv/components/ui/Icon";
import type { PrototypeVersion } from "./types";

interface IdentityCardProps {
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

function AvatarPlaceholder({ className }: { className?: string }) {
  return (
    <div className={`w-6 h-6 rounded-full bg-[#E4E8EB] ${className}`} />
  );
}

interface SelectorFieldProps {
  label: string;
  required?: boolean;
  value: string;
  hasAvatar?: boolean;
}

function SelectorField({ label, required = false, value, hasAvatar = false }: SelectorFieldProps) {
  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex items-center gap-1 pb-1">
        <span className="font-optimistic font-bold text-[14px] leading-[20px] text-[#1C2B33]">
          {required && "*"}{label}
        </span>
        <InfoIcon />
      </div>
      <div className="bg-white border border-[#CBD2D9] rounded h-[36px] flex items-center px-3 justify-between cursor-pointer hover:border-[#0A78BE]">
        <div className="flex items-center gap-2">
          {hasAvatar && <AvatarPlaceholder />}
          <span className="font-sf-pro text-[14px] leading-[20px] text-[#1C2B33]">
            {value}
          </span>
        </div>
        <Icon name="SmallTriangleDown" variant="filled" size={16} className="text-[#283943]" />
      </div>
    </div>
  );
}

export function IdentityCard({ version, className = "" }: IdentityCardProps) {
  // Only render for "before" and "alpha-v1" versions
  if (version !== "before" && version !== "alpha-v1") {
    return null;
  }

  const isAlpha = version === "alpha-v1";

  return (
    <div className={`bg-white rounded-[4px] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.1),0px_0px_4px_0px_rgba(0,0,0,0.1)] p-4 w-[600px] flex flex-col gap-4 ${className}`}>
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <CheckCircleIcon />
          <span className="font-optimistic font-bold text-[16px] leading-[20px] text-[#1C2B33]">
            Identity
          </span>
        </div>
        <p className="font-optimistic text-[14px] leading-[20px] text-[#1C2B33]">
          Choose the Facebook Page and Instagram account that this ad will be associated with.
        </p>
      </div>

      {/* Facebook page selector */}
      <SelectorField 
        label="Facebook page"
        required={true}
        value="Kai Blue's FB Page"
        hasAvatar={true}
      />

      {/* Before version only: Instagram, Threads, Branding */}
      {!isAlpha && (
        <>
          {/* Instagram account selector */}
          <SelectorField 
            label="Instagram account"
            value="kaiblue"
            hasAvatar={true}
          />

          {/* Threads profile */}
          <div className="flex flex-col gap-1 w-full">
            <div className="flex items-center gap-1 pb-1">
              <span className="font-optimistic font-bold text-[14px] leading-[20px] text-[#1C2B33]">
                Threads profile
              </span>
              <InfoIcon />
            </div>
            <button className="w-fit h-[36px] bg-transparent border border-[#A7B3BF] rounded px-3 flex items-center justify-center hover:border-[#0A78BE] transition-colors">
              <span className="font-optimistic font-medium text-[14px] leading-[20px] text-[#1C2B33]">
                Create profile
              </span>
            </button>
          </div>

          {/* Branding section */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-1 pb-1">
              <span className="font-optimistic font-bold text-[15px] leading-[20px] text-[#1C2B33]">
                Branding
              </span>
              <InfoIcon />
            </div>
            <p className="font-optimistic text-[14px] leading-[20px] text-[#1C2B33]">
              Represent your brand in AI text and image generation by setting branding defaults for this ad and future ads.
            </p>
            <div className="flex items-center justify-between">
              <span className="font-optimistic text-[14px] leading-[20px] text-[#1C2B33]">
                Inactive
              </span>
              <button className="h-[36px] bg-transparent border border-[#A7B3BF] rounded px-3 flex items-center justify-center hover:border-[#0A78BE] transition-colors">
                <span className="font-optimistic font-medium text-[14px] leading-[20px] text-[#1C2B33]">
                  Add branding
                </span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
