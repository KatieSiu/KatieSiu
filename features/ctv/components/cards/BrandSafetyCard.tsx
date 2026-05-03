"use client";

import { useState, useRef, useEffect } from "react";
import { Icon } from "@/features/ctv/components/ui/Icon";
import type { PrototypeVersion } from "./types";

interface BrandSafetyCardProps {
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

function PencilSlashIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path 
        fillRule="evenodd" 
        clipRule="evenodd" 
        d="M13.8536 2.14645C13.6583 1.95118 13.3417 1.95118 13.1464 2.14645L2.14645 13.1464C1.95118 13.3417 1.95118 13.6583 2.14645 13.8536C2.34171 14.0488 2.65829 14.0488 2.85355 13.8536L13.8536 2.85355C14.0488 2.65829 14.0488 2.34171 13.8536 2.14645Z" 
        fill="currentColor"
      />
      <path 
        d="M11.2929 3.29289L12.7071 4.70711L11.4142 6L10 4.58579L11.2929 3.29289Z" 
        fill="currentColor"
      />
      <path 
        d="M9.29289 5.29289L4 10.5858V12H5.41421L10.7071 6.70711L9.29289 5.29289Z" 
        fill="currentColor"
      />
    </svg>
  );
}

function AdAccountTooltip({ visible }: { visible: boolean }) {
  if (!visible) return null;
  
  return (
    <div className="absolute bottom-full left-0 mb-2 z-50">
      <div className="bg-white rounded-[4px] shadow-[0px_2px_12px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] p-4 w-[320px]">
        <p className="font-optimistic font-bold text-[16px] leading-[20px] text-[#1C2B33] mb-2">
          Only available for ad accounts
        </p>
        <p className="font-sf-pro text-[14px] leading-[20px] text-[rgba(0,0,0,0.85)] mb-3">
          This setting is applied to your account and can&apos;t be changed for individual ad sets.
        </p>
        <span className="font-sf-pro text-[14px] leading-[20px] text-[#0A78BE] cursor-pointer hover:underline">
          Change in Brand Safety and Suitability
        </span>
      </div>
    </div>
  );
}

interface HoverableExclusionRowProps {
  title: string;
  value: React.ReactNode;
}

function HoverableExclusionRow({ title, value }: HoverableExclusionRowProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<"above" | "below">("above");
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isHovered && rowRef.current) {
      const rect = rowRef.current.getBoundingClientRect();
      const tooltipHeight = 150;
      if (rect.top < tooltipHeight + 20) {
        setTooltipPosition("below");
      } else {
        setTooltipPosition("above");
      }
    }
  }, [isHovered]);

  return (
    <div 
      ref={rowRef}
      className={`relative flex items-center justify-between p-2 rounded-[6px] cursor-pointer transition-colors ${
        isHovered ? "bg-[#E5E8F0]" : "bg-white"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col flex-1">
        <span className="font-sf-pro font-bold text-[14px] leading-[20px] text-[#1C2B33]">
          {title}
        </span>
        <div className="flex items-start gap-1 text-[#465A69] text-[12px] leading-[16px]">
          <span>•</span>
          <span className="font-sf-pro">{value}</span>
        </div>
      </div>
      {isHovered && (
        <div className="p-[6px]">
          <PencilSlashIcon className="text-[rgba(40,57,67,0.6)]" />
        </div>
      )}
      
      {/* Tooltip - positioned above and to the right */}
      {isHovered && (
        <div className={`absolute right-0 z-50 ${
          tooltipPosition === "above" ? "bottom-full mb-2" : "top-full mt-2"
        }`}>
          <div className="bg-white rounded-[4px] shadow-[0px_2px_12px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)] p-4 w-[450px]">
            <p className="font-optimistic font-bold text-[16px] leading-[20px] text-[#1C2B33] mb-2">
              Only available for ad accounts
            </p>
            <p className="font-sf-pro text-[14px] leading-[20px] text-[rgba(0,0,0,0.85)] mb-3">
              This setting is applied to your account and can&apos;t be changed for individual ad sets.
            </p>
            <span className="font-sf-pro text-[14px] leading-[20px] text-[#0A78BE] cursor-pointer hover:underline">
              Change in Brand Safety and Suitability
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function SectionHeader({ title, hasInfo = true }: { title: string; hasInfo?: boolean }) {
  return (
    <div className="flex items-center gap-1">
      <span className="font-optimistic font-bold text-[15px] leading-[20px] text-[#1C2B33]">
        {title}
      </span>
      {hasInfo && <InfoIcon />}
    </div>
  );
}

function SubSectionHeader({ title }: { title: string }) {
  return (
    <span className="font-sf-pro font-bold text-[14px] leading-[20px] text-[#1C2B33]">
      {title}
    </span>
  );
}

function BulletItem({ children, bold = false }: { children: React.ReactNode; bold?: boolean }) {
  return (
    <div className="flex items-start gap-1 text-[#465A69] text-[12px] leading-[16px]">
      <span>•</span>
      <span className={bold ? "font-sf-pro font-bold" : "font-sf-pro"}>{children}</span>
    </div>
  );
}

function ExpandedSettingsContent() {
  return (
    <div className="flex flex-col gap-4">
      {/* Inventory filters */}
      <div className="flex flex-col gap-2">
        <SectionHeader title="Inventory filters" />
        <p className="font-sf-pro text-[14px] leading-[20px] text-[#465A69]">
          We apply the default inventory filter unless you change it. Content that&apos;s excessively controversial or offensive is always excluded, regardless of what filter you choose.
        </p>
        
        {/* Feed ads */}
        <div className="flex flex-col py-2">
          <SubSectionHeader title="Feed ads" />
          <BulletItem>
            <span><span className="font-bold">Expanded</span> (ad set), <span className="font-bold">Expanded</span> (ad account)</span>
          </BulletItem>
        </div>
        
        {/* In-content ads */}
        <div className="flex flex-col py-2">
          <SubSectionHeader title="In-content ads" />
          <BulletItem>
            <span><span className="font-bold">Expanded</span> (ad set), <span className="font-bold">Expanded</span> (ad account)</span>
          </BulletItem>
        </div>
        
        {/* Audience Network ads */}
        <div className="flex flex-col py-2">
          <SubSectionHeader title="Audience Network  ads" />
          <BulletItem>
            <span><span className="font-bold">Expanded</span> (ad set), <span className="font-bold">Expanded</span> (ad account)</span>
          </BulletItem>
        </div>
      </div>

      {/* Who can comment on your ads? */}
      <div className="flex flex-col gap-1">
        <SectionHeader title="Who can comment on your ads?" />
        <BulletItem>Public (default)</BulletItem>
      </div>

      {/* Publisher block lists */}
      <div className="flex flex-col gap-1">
        <SectionHeader title="Publisher block lists" />
        <BulletItem>16 block lists applied</BulletItem>
      </div>

      {/* Content type exclusions */}
      <div className="flex flex-col gap-1">
        <SectionHeader title="Content type exclusions" />
        <div className="flex flex-col gap-1 text-[#465A69] text-[14px] leading-[20px]">
          <BulletItem>Exclude all live videos or videos from nonpartner-publishers from Facebook in-stream video ads.</BulletItem>
          <BulletItem>Exclude Reels from non-partner publishers for your Ads on Facebook Reels</BulletItem>
        </div>
      </div>

      {/* Topic exclusions for Facebook in-stream reels */}
      <div className="flex flex-col gap-1">
        <SectionHeader title="Topic exclusions for Facebook in-stream reels" />
        <div className="flex flex-col">
          <BulletItem>News</BulletItem>
          <BulletItem>Gaming</BulletItem>
        </div>
      </div>

      {/* Connected TV controls */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-col">
          <SectionHeader title="Connected TV controls" />
          <p className="font-sf-pro text-[14px] leading-[20px] text-[#465A69]">
            Fullscreen video ads on TV streaming services
          </p>
        </div>
        
        {/* Maturity rating exclusions - with hover state and tooltip */}
        <HoverableExclusionRow 
          title="Maturity rating exclusions"
          value={<span><span className="font-bold">TV-14, TV MA</span> (ad account)</span>}
        />
        
        {/* Genre exclusions - with hover state and tooltip */}
        <HoverableExclusionRow 
          title="Genre exclusions"
          value={<span><span className="font-bold">Action, crime, drama, family, fantasy, horror, thriller and 8 more</span> (ad account)</span>}
        />
      </div>
    </div>
  );
}

export function BrandSafetyCard({ version, className = "", isTVMode = false }: BrandSafetyCardProps) {
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  if (version !== "before" && version !== "alpha-v1") {
    return null;
  }

  const isAlpha = version === "alpha-v1";
  const canExpand = isAlpha && isTVMode;

  return (
    <div className={`bg-white rounded-[4px] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.1),0px_0px_4px_0px_rgba(0,0,0,0.1)] p-4 w-[600px] flex flex-col gap-4 ${className}`}>
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <CheckCircleIcon />
          <span className="font-optimistic font-bold text-[16px] leading-[20px] text-[#1C2B33]">
            Brand safety and suitability
          </span>
        </div>
        
        {/* Description */}
        <div className="font-sf-pro text-[14px] leading-[20px] text-[#1C2B33]">
          <span className="font-bold">Brand safety:</span>{" "}
          <span>Meta applies brand safety to all ads through our </span>
          <span className="text-[#0A78BE] cursor-pointer hover:underline">Community Standards</span>
          <span> and </span>
          <span className="text-[#0A78BE] cursor-pointer hover:underline">Monetization Policies</span>
          <span>, keeping your ads away from objectionable content.</span>
          <br /><br />
          <span className="font-bold">Brand suitability:</span>{" "}
          <span>In some cases, brands want more control over where ads can appear. Brand suitability filters or excludes specific topics or publishers. Keep in mind that using these controls can lower your reach and increase costs.</span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-[#CBD2D9]" />

      {/* Show/Hide settings toggle */}
      <button
        className="flex items-center gap-1 text-[#0A78BE] font-optimistic font-medium text-[14px] leading-[20px] hover:underline w-fit"
        onClick={() => setShowMoreOptions(!showMoreOptions)}
      >
        <span>{showMoreOptions ? "Hide settings" : "Show more options"}</span>
        <Icon
          name={showMoreOptions ? "SmallTriangleUp" : "SmallTriangleDown"}
          variant="filled"
          size={16}
          className="text-[#0A78BE]"
        />
      </button>

      {/* Expanded settings - only available when TV Mode is ON */}
      {canExpand && showMoreOptions && <ExpandedSettingsContent />}
    </div>
  );
}
