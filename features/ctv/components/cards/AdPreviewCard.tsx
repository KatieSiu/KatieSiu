"use client";

import { useState, useEffect } from "react";
import { Icon } from "@/features/ctv/components/ui/Icon";
import Image from "next/image";
import type { PrototypeVersion } from "./types";

interface AdPreviewCardProps {
  version: PrototypeVersion;
  className?: string;
  isTVMode?: boolean;
  hasUploadedMedia?: boolean;
  defaultCollapsed?: boolean;
  /** Thumbnail URL for the selected video (used in TV preview) */
  selectedVideoThumbnail?: string | null;
  /** When true, forces the preview to expand (e.g., after video selection) */
  forceExpanded?: boolean;
}

function ToggleSwitch({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`relative w-[40px] h-[24px] rounded-full border border-[#CBD2D9] transition-colors ${
        enabled ? "bg-[#E1EDF7]" : "bg-white"
      }`}
    >
      <div
        className={`absolute top-[2px] w-[18px] h-[18px] rounded-full transition-all ${
          enabled ? "left-[18px] bg-[#0A78BE]" : "left-[2px] bg-[#283943]"
        }`}
      />
    </button>
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

function ResizeUpIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M9.5 2.5H13.5V6.5M6.5 13.5H2.5V9.5M13.5 2.5L9 7M2.5 13.5L7 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ShareIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M8.5 2C8.5 1.72386 8.72386 1.5 9 1.5H14C14.2761 1.5 14.5 1.72386 14.5 2V7C14.5 7.27614 14.2761 7.5 14 7.5C13.7239 7.5 13.5 7.27614 13.5 7V3.20711L8.35355 8.35355C8.15829 8.54882 7.84171 8.54882 7.64645 8.35355C7.45118 8.15829 7.45118 7.84171 7.64645 7.64645L12.7929 2.5H9C8.72386 2.5 8.5 2.27614 8.5 2Z"/>
      <path d="M3 4.5C2.72386 4.5 2.5 4.72386 2.5 5V13C2.5 13.2761 2.72386 13.5 3 13.5H11C11.2761 13.5 11.5 13.2761 11.5 13V9C11.5 8.72386 11.7239 8.5 12 8.5C12.2761 8.5 12.5 8.72386 12.5 9V13C12.5 13.8284 11.8284 14.5 11 14.5H3C2.17157 14.5 1.5 13.8284 1.5 13V5C1.5 4.17157 2.17157 3.5 3 3.5H7C7.27614 3.5 7.5 3.72386 7.5 4C7.5 4.27614 7.27614 4.5 7 4.5H3Z"/>
    </svg>
  );
}

function DevicesIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path fillRule="evenodd" clipRule="evenodd" d="M1 3C1 2.44772 1.44772 2 2 2H10C10.5523 2 11 2.44772 11 3V9H12C12.5523 9 13 9.44772 13 10V12C13 12.5523 12.5523 13 12 13H8V14H10C10.5523 14 11 14.4477 11 15H1C1 14.4477 1.44772 14 2 14H4V13H2C1.44772 13 1 12.5523 1 12V3ZM5 13V14H7V13H5ZM3 11H9V4H3V11Z" fill="currentColor"/>
    </svg>
  );
}

function SquareIcon({ className, active = false }: { className?: string; active?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="3" y="3" width="10" height="10" rx="1" stroke={active ? "#0A78BE" : "currentColor"} strokeWidth="1.5"/>
    </svg>
  );
}

function VerticalRatioIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="4" y="2" width="8" height="12" rx="1" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 11.993 2.92547 15.3027 6.75 15.9028V10.3125H4.71875V8H6.75V6.2375C6.75 4.2325 7.94438 3.125 9.77172 3.125C10.6467 3.125 11.5625 3.28125 11.5625 3.28125V5.25H10.5538C9.56 5.25 9.25 5.86672 9.25 6.5V8H11.4688L11.1141 10.3125H9.25V15.9028C13.0745 15.3027 16 11.993 16 8Z" fill="currentColor"/>
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path fillRule="evenodd" clipRule="evenodd" d="M4.66667 0C2.08934 0 0 2.08934 0 4.66667V11.3333C0 13.9107 2.08934 16 4.66667 16H11.3333C13.9107 16 16 13.9107 16 11.3333V4.66667C16 2.08934 13.9107 0 11.3333 0H4.66667ZM8 4.5C5.79086 4.5 4 6.29086 4 8.5C4 10.7091 5.79086 12.5 8 12.5C10.2091 12.5 12 10.7091 12 8.5C12 6.29086 10.2091 4.5 8 4.5ZM8 6C6.61929 6 5.5 7.11929 5.5 8.5C5.5 9.88071 6.61929 11 8 11C9.38071 11 10.5 9.88071 10.5 8.5C10.5 7.11929 9.38071 6 8 6ZM12.5 3C12.5 2.44772 12.9477 2 13.5 2C14.0523 2 14.5 2.44772 14.5 3C14.5 3.55228 14.0523 4 13.5 4C12.9477 4 12.5 3.55228 12.5 3Z" fill="currentColor"/>
    </svg>
  );
}

function HorizontalEllipsisIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="3" cy="8" r="1.5" fill="currentColor"/>
      <circle cx="8" cy="8" r="1.5" fill="currentColor"/>
      <circle cx="13" cy="8" r="1.5" fill="currentColor"/>
    </svg>
  );
}

function EllipsisButton() {
  return (
    <button className="h-[36px] w-[36px] bg-transparent border border-[#A7B3BF] rounded flex items-center justify-center hover:border-[#0A78BE] transition-colors">
      <HorizontalEllipsisIcon className="text-[#283943]" />
    </button>
  );
}

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M6 1L6.75 3.5L9 4L6.75 4.5L6 7L5.25 4.5L3 4L5.25 3.5L6 1Z" fill="currentColor"/>
      <path d="M9.5 6L10 7.5L11.5 8L10 8.5L9.5 10L9 8.5L7.5 8L9 7.5L9.5 6Z" fill="currentColor"/>
      <path d="M3 8L3.5 9L4.5 9.5L3.5 10L3 11L2.5 10L1.5 9.5L2.5 9L3 8Z" fill="currentColor"/>
    </svg>
  );
}

function TVIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path fillRule="evenodd" clipRule="evenodd" d="M1 3C1 2.44772 1.44772 2 2 2H14C14.5523 2 15 2.44772 15 3V11C15 11.5523 14.5523 12 14 12H9V13H11C11.2761 13 11.5 13.2239 11.5 13.5C11.5 13.7761 11.2761 14 11 14H5C4.72386 14 4.5 13.7761 4.5 13.5C4.5 13.2239 4.72386 13 5 13H7V12H2C1.44772 12 1 11.5523 1 11V3ZM3 4V10H13V4H3Z" fill="currentColor"/>
    </svg>
  );
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M12 8.5V23.5L24 16L12 8.5Z" fill="currentColor"/>
    </svg>
  );
}

function VideoOverlayIcon({ className }: { className?: string }) {
  return (
    <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="0.5" y="0.5" width="17" height="13" rx="1.5" fill="#283943" stroke="white"/>
      <path d="M7 4.5V9.5L11.5 7L7 4.5Z" fill="white"/>
    </svg>
  );
}

function MediaThumbnail({ imageSrc, hasVideo = false }: { imageSrc: string; hasVideo?: boolean }) {
  return (
    <div className="relative w-[48px] h-[48px] rounded-[4px] overflow-hidden">
      <Image 
        src={imageSrc} 
        alt="Media thumbnail" 
        width={48} 
        height={48} 
        className="w-full h-full object-cover"
      />
      {hasVideo && (
        <div className="absolute top-[3px] right-[3px]">
          <VideoOverlayIcon />
        </div>
      )}
    </div>
  );
}

function CollapsedAdPreviewCard({ 
  previewEnabled, 
  onToggle, 
  className = "" 
}: { 
  previewEnabled: boolean; 
  onToggle: () => void; 
  className?: string;
}) {
  return (
    <div className={`bg-white rounded-[4px] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.1),0px_0px_4px_0px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-2">
        <button 
          onClick={onToggle}
          className="flex items-center gap-2 cursor-pointer"
        >
          <ToggleSwitch enabled={previewEnabled} onToggle={onToggle} />
          <span className="font-sf-pro text-[14px] leading-[20px] text-[#1C2B33]">
            Ad preview
          </span>
        </button>
        <div className="flex items-center gap-2">
          <button className="h-[36px] bg-transparent border border-[#A7B3BF] rounded-[4px] px-3 flex items-center gap-2 hover:border-[#0A78BE] transition-colors">
            <ResizeUpIcon className="text-[#283943]" />
            <span className="font-optimistic font-medium text-[14px] leading-[20px] text-[#1C2B33]">
              Advanced preview
            </span>
          </button>
          <button className="h-[36px] bg-transparent border border-[#A7B3BF] rounded-[4px] px-3 flex items-center gap-2 hover:border-[#0A78BE] transition-colors">
            <ShareIcon className="text-[#283943]" />
            <Icon name="SmallTriangleDown" variant="filled" size={16} className="text-[#283943]" />
          </button>
        </div>
      </div>
      {/* Divider */}
      <div className="h-px bg-[#CBD2D9] w-full" />
    </div>
  );
}

function MultiPlatformPreview({ 
  previewEnabled, 
  onToggle, 
  activeTab, 
  setActiveTab,
  className = "" 
}: { 
  previewEnabled: boolean; 
  onToggle: () => void; 
  activeTab: number;
  setActiveTab: (tab: number) => void;
  className?: string;
}) {
  return (
    <div className={`bg-white rounded-[4px] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.1),0px_0px_4px_0px_rgba(0,0,0,0.1)] w-[600px] flex flex-col overflow-hidden ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-2 border-b border-[#CBD2D9]">
        <button 
          onClick={onToggle}
          className="flex items-center gap-2 cursor-pointer"
        >
          <ToggleSwitch enabled={previewEnabled} onToggle={onToggle} />
          <span className="font-sf-pro text-[14px] leading-[20px] text-[#1C2B33]">
            Ad preview
          </span>
        </button>
        <div className="flex items-center gap-2">
          <button className="h-[36px] bg-transparent border border-[#A7B3BF] rounded-[4px] px-3 flex items-center gap-2 hover:border-[#0A78BE] transition-colors">
            <ResizeUpIcon className="text-[#283943]" />
            <span className="font-optimistic font-medium text-[14px] leading-[20px] text-[#1C2B33]">
              Advanced preview
            </span>
          </button>
          <button className="h-[36px] bg-transparent border border-[#A7B3BF] rounded-[4px] px-3 flex items-center gap-2 hover:border-[#0A78BE] transition-colors">
            <ShareIcon className="text-[#283943]" />
            <Icon name="SmallTriangleDown" variant="filled" size={16} className="text-[#283943]" />
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex items-center justify-center gap-2 px-2 py-1 border-b border-[#CBD2D9]">
        <button 
          onClick={() => setActiveTab(0)}
          className={`h-[36px] px-3 rounded flex items-center justify-center ${activeTab === 0 ? 'bg-[#ECF4FE]' : 'bg-transparent'}`}
        >
          <DevicesIcon className={activeTab === 0 ? "text-[#0A78BE]" : "text-[#283943]"} />
        </button>
        <button 
          onClick={() => setActiveTab(1)}
          className={`h-[36px] px-3 rounded flex items-center justify-center ${activeTab === 1 ? 'bg-[#ECF4FE]' : 'bg-transparent'}`}
        >
          <SquareIcon className={activeTab === 1 ? "text-[#0A78BE]" : "text-[#283943]"} />
        </button>
        <button 
          onClick={() => setActiveTab(2)}
          className={`h-[36px] px-3 rounded flex items-center justify-center ${activeTab === 2 ? 'bg-[#ECF4FE]' : 'bg-transparent'}`}
        >
          <VerticalRatioIcon className={activeTab === 2 ? "text-[#0A78BE]" : "text-[#283943]"} />
        </button>
        <button 
          onClick={() => setActiveTab(3)}
          className={`h-[36px] px-3 rounded flex items-center justify-center ${activeTab === 3 ? 'bg-[#ECF4FE]' : 'bg-transparent'}`}
        >
          <VerticalRatioIcon className={activeTab === 3 ? "text-[#0A78BE]" : "text-[#283943]"} />
        </button>
      </div>

      {/* Preview area */}
      <div className="bg-[#F1F4F7] p-4 overflow-y-auto max-h-[625px]">
        <div className="flex gap-4 justify-center">
          {/* Facebook Feed Preview */}
          <div className="flex flex-col gap-3 flex-1 max-w-[270px]">
            <div className="flex items-center gap-2 h-[36px]">
              <FacebookIcon className="text-[#080809]" />
              <span className="flex-1 font-optimistic text-[14px] leading-[20px] text-[#1C2B33]">
                Facebook Feed
              </span>
              <EllipsisButton />
            </div>
            <Image 
              src="/images/facebook-feed-preview.png" 
              alt="Facebook Feed Preview" 
              width={270} 
              height={510}
              className="w-full h-auto rounded-[8px]"
            />
          </div>

          {/* Instagram Reels Preview */}
          <div className="flex flex-col gap-3 flex-1 max-w-[270px]">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 h-[36px]">
                <InstagramIcon className="text-[#080809]" />
                <span className="flex-1 font-optimistic text-[14px] leading-[20px] text-[#1C2B33]">
                  Instagram Reels
                </span>
                <EllipsisButton />
              </div>
              <div className="flex items-center gap-1 h-[18px]">
                <SparkleIcon className="text-[#283943]" />
                <span className="font-sf-pro font-bold text-[12px] leading-[16px] text-[#1C2B33]">
                  Vary aspect ratio
                </span>
              </div>
            </div>
            <Image 
              src="/images/instagram-reels-preview.png" 
              alt="Instagram Reels Preview" 
              width={270} 
              height={510}
              className="w-full h-auto rounded-[8px]"
            />
          </div>
        </div>
      </div>

      {/* Footer disclaimer */}
      <div className="flex items-center gap-2 p-2 border-t border-[rgba(203,210,217,0.5)]">
        <span className="font-optimistic text-[12px] leading-[16px] text-[rgba(28,43,51,0.65)]">
          Ad rendering and interaction may vary based on device, format and other factors.
        </span>
        <InfoIcon />
      </div>
    </div>
  );
}

function EmptyStatePreview({ 
  previewEnabled, 
  onToggle, 
  className = "" 
}: { 
  previewEnabled: boolean; 
  onToggle: () => void; 
  className?: string;
}) {
  return (
    <div className={`bg-white rounded-[4px] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.1),0px_0px_4px_0px_rgba(0,0,0,0.1)] w-[526px] flex flex-col overflow-hidden ${className}`}>
      {/* Header - matches collapsed card design */}
      <div className="flex items-center justify-between p-2 border-b border-[#CBD2D9]">
        <button 
          onClick={onToggle}
          className="flex items-center gap-2 cursor-pointer"
        >
          <ToggleSwitch enabled={previewEnabled} onToggle={onToggle} />
          <span className="font-sf-pro text-[14px] leading-[20px] text-[#1C2B33]">
            Ad preview
          </span>
        </button>
        <div className="flex items-center gap-2">
          <button className="h-[36px] bg-transparent border border-[#A7B3BF] rounded-[4px] px-3 flex items-center gap-2 hover:border-[#0A78BE] transition-colors">
            <ResizeUpIcon className="text-[#283943]" />
            <span className="font-optimistic font-medium text-[14px] leading-[20px] text-[#1C2B33]">
              Advanced preview
            </span>
          </button>
          <button className="h-[36px] bg-transparent border border-[#A7B3BF] rounded-[4px] px-3 flex items-center gap-2 hover:border-[#0A78BE] transition-colors">
            <ShareIcon className="text-[#283943]" />
            <Icon name="SmallTriangleDown" variant="filled" size={16} className="text-[#283943]" />
          </button>
        </div>
      </div>

      {/* Empty state content */}
      <div className="flex flex-col items-center justify-center p-6 min-h-[300px]">
        <Image 
          src="/images/no-ads-empty-state.png" 
          alt="No ads preview" 
          width={180} 
          height={140}
          className="mb-4"
        />
        <span className="font-optimistic text-[14px] leading-[20px] text-[#465A69]">
          Add media to see ad examples.
        </span>
      </div>
    </div>
  );
}

function TVPreview({ 
  previewEnabled, 
  onToggle, 
  className = "",
  selectedVideoThumbnail = null
}: { 
  previewEnabled: boolean; 
  onToggle: () => void; 
  className?: string;
  selectedVideoThumbnail?: string | null;
}) {
  return (
    <div className={`bg-white rounded-[4px] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.1),0px_0px_4px_0px_rgba(0,0,0,0.1)] w-[526px] flex flex-col overflow-hidden ${className}`}>
      {/* Header - matches collapsed card design */}
      <div className="flex items-center justify-between p-2 border-b border-[#CBD2D9]">
        <button 
          onClick={onToggle}
          className="flex items-center gap-2 cursor-pointer"
        >
          <ToggleSwitch enabled={previewEnabled} onToggle={onToggle} />
          <span className="font-sf-pro text-[14px] leading-[20px] text-[#1C2B33]">
            Ad preview
          </span>
        </button>
        <div className="flex items-center gap-2">
          <button className="h-[36px] bg-transparent border border-[#A7B3BF] rounded-[4px] px-3 flex items-center gap-2 hover:border-[#0A78BE] transition-colors">
            <ResizeUpIcon className="text-[#283943]" />
            <span className="font-optimistic font-medium text-[14px] leading-[20px] text-[#1C2B33]">
              Advanced preview
            </span>
          </button>
          <button className="h-[36px] bg-transparent border border-[#A7B3BF] rounded-[4px] px-3 flex items-center gap-2 hover:border-[#0A78BE] transition-colors">
            <ShareIcon className="text-[#283943]" />
            <Icon name="SmallTriangleDown" variant="filled" size={16} className="text-[#283943]" />
          </button>
        </div>
      </div>

      {/* Media thumbnail */}
      <div className="flex items-center gap-2 p-2 bg-white border-b border-[#CBD2D9]">
        <MediaThumbnail imageSrc={selectedVideoThumbnail || "/images/small-square-image.png"} hasVideo />
      </div>

      {/* Preview area */}
      <div className="bg-[#F1F4F7] overflow-y-auto">
        <div className="flex flex-col gap-5 items-center p-4">
          {/* Placement header */}
          <div className="w-full flex items-center gap-2 h-[36px]">
            <TVIcon className="text-[#080809]" />
            <span className="flex-1 font-sf-pro text-[14px] leading-[20px] text-[#1C2B33]">
              TV
            </span>
            <EllipsisButton />
          </div>

          {/* TV Preview Image with Play Button */}
          <div className="relative w-full">
            <Image 
              src={selectedVideoThumbnail || "/images/large-4-people.png"} 
              alt="TV Ad Preview" 
              width={988} 
              height={556}
              unoptimized
              className="w-full h-auto rounded object-cover aspect-video"
            />
            {/* Play button overlay */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[48px] h-[48px] bg-[rgba(40,57,67,0.6)] border-2 border-white rounded-full flex items-center justify-center shadow-[0px_0px_1px_0px_rgba(0,0,0,0.1),0px_0px_4px_0px_rgba(0,0,0,0.1)]">
              <PlayIcon className="text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer disclaimer */}
      <div className="flex items-center gap-2 p-2 border-t border-[rgba(203,210,217,0.5)]">
        <span className="font-optimistic text-[12px] leading-[16px] text-[rgba(28,43,51,0.65)]">
          Ad rendering and interaction may vary based on device, format and other factors.
        </span>
        <InfoIcon />
      </div>
    </div>
  );
}

export function AdPreviewCard({ 
  version, 
  className = "", 
  isTVMode = false,
  hasUploadedMedia = false,
  defaultCollapsed = true,
  selectedVideoThumbnail = null,
  forceExpanded = false,
}: AdPreviewCardProps) {
  const [previewEnabled, setPreviewEnabled] = useState(!defaultCollapsed);
  const [activeTab, setActiveTab] = useState(0);

  // When forceExpanded becomes true, expand the preview
  useEffect(() => {
    if (forceExpanded) {
      setPreviewEnabled(true);
    }
  }, [forceExpanded]);

  if (version !== "before" && version !== "alpha-v1") {
    return null;
  }

  const handleToggle = () => setPreviewEnabled(!previewEnabled);
  const isAlpha = version === "alpha-v1";

  // BEFORE VERSION
  if (!isAlpha) {
    // Before: Expanded by default, toggle between collapsed and multi-platform preview
    if (!previewEnabled) {
      return <CollapsedAdPreviewCard previewEnabled={previewEnabled} onToggle={handleToggle} className={`w-[600px] ${className}`} />;
    }
    return (
      <MultiPlatformPreview 
        previewEnabled={previewEnabled} 
        onToggle={handleToggle} 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        className={className}
      />
    );
  }

  // ALPHA VERSION (Alpha-Embedded & Standalone)
  // Collapsed state
  if (!previewEnabled) {
    return <CollapsedAdPreviewCard previewEnabled={previewEnabled} onToggle={handleToggle} className={`w-[526px] ${className}`} />;
  }

  // Expanded but no uploaded media - show empty state
  if (!hasUploadedMedia) {
    return <EmptyStatePreview previewEnabled={previewEnabled} onToggle={handleToggle} className={className} />;
  }

  // Has uploaded media
  if (isTVMode) {
    // TV MODE ON with uploaded media - show TV preview
    return <TVPreview previewEnabled={previewEnabled} onToggle={handleToggle} className={className} selectedVideoThumbnail={selectedVideoThumbnail} />;
  } else {
    // TV MODE OFF with uploaded media - show multi-platform (Before) preview
    return (
      <MultiPlatformPreview 
        previewEnabled={previewEnabled} 
        onToggle={handleToggle} 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        className={className}
      />
    );
  }
}
