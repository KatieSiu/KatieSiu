"use client";

import { Icon } from "@/features/ctv/components/ui/Icon";
import type { EditorLevel } from "./CampaignStructurePanel";
import type { CampaignObjective } from "@/features/ctv/components/prototypes";

interface AdsEditorHeaderProps {
  currentLevel: EditorLevel;
  onLevelChange: (level: EditorLevel) => void;
  objective?: CampaignObjective;
}

function SidebarIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path fillRule="evenodd" clipRule="evenodd" d="M2 3C2 2.44772 2.44772 2 3 2H13C13.5523 2 14 2.44772 14 3V13C14 13.5523 13.5523 14 13 14H3C2.44772 14 2 13.5523 2 13V3ZM6 4V12H12V4H6Z" fill="currentColor"/>
    </svg>
  );
}

function FolderIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path fillRule="evenodd" clipRule="evenodd" d="M1 4C1 2.89543 1.89543 2 3 2H6.17157C6.70201 2 7.21071 2.21071 7.58579 2.58579L8.41421 3.41421C8.78929 3.78929 9.29799 4 9.82843 4H13C14.1046 4 15 4.89543 15 6V12C15 13.1046 14.1046 14 13 14H3C1.89543 14 1 13.1046 1 12V4Z" fill="currentColor"/>
    </svg>
  );
}

function GridIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path fillRule="evenodd" clipRule="evenodd" d="M2 3C2 2.44772 2.44772 2 3 2H6C6.55228 2 7 2.44772 7 3V6C7 6.55228 6.55228 7 6 7H3C2.44772 7 2 6.55228 2 6V3ZM9 3C9 2.44772 9.44772 2 10 2H13C13.5523 2 14 2.44772 14 3V6C14 6.55228 13.5523 7 13 7H10C9.44772 7 9 6.55228 9 6V3ZM2 10C2 9.44772 2.44772 9 3 9H6C6.55228 9 7 9.44772 7 10V13C7 13.5523 6.55228 14 6 14H3C2.44772 14 2 13.5523 2 13V10ZM9 10C9 9.44772 9.44772 9 10 9H13C13.5523 9 14 9.44772 14 10V13C14 13.5523 13.5523 14 13 14H10C9.44772 14 9 13.5523 9 13V10Z" fill="currentColor"/>
    </svg>
  );
}

function AdIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="2" y="2" width="12" height="12" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      <path d="M5 8H11M5 5H11M5 11H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M4.5 2.5L8 6L4.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function PencilIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path fillRule="evenodd" clipRule="evenodd" d="M11.2929 1.29289C11.6834 0.902369 12.3166 0.902369 12.7071 1.29289L14.7071 3.29289C15.0976 3.68342 15.0976 4.31658 14.7071 4.70711L5.70711 13.7071C5.51957 13.8946 5.26522 14 5 14H3C2.44772 14 2 13.5523 2 13V11C2 10.7348 2.10536 10.4804 2.29289 10.2929L11.2929 1.29289Z" fill="currentColor"/>
    </svg>
  );
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path fillRule="evenodd" clipRule="evenodd" d="M8 4C4.36364 4 1.25818 6.28067 0.105573 9.44721C-0.0351909 9.83431 0.160573 10.2627 0.547671 10.4034C0.93477 10.5442 1.36318 10.3484 1.50394 9.96133C2.43091 7.41933 4.99636 5.5 8 5.5C11.0036 5.5 13.5691 7.41933 14.4961 9.96133C14.6368 10.3484 15.0652 10.5442 15.4523 10.4034C15.8394 10.2627 16.0352 9.83431 15.8944 9.44721C14.7418 6.28067 11.6364 4 8 4ZM8 7C6.34315 7 5 8.34315 5 10C5 11.6569 6.34315 13 8 13C9.65685 13 11 11.6569 11 10C11 8.34315 9.65685 7 8 7Z" fill="currentColor"/>
    </svg>
  );
}

function EllipsisButton() {
  return (
    <button className="h-9 px-3 border border-[#A7B3BF] rounded-[4px] flex items-center justify-center hover:bg-[#F8F9FB] transition-colors">
      <Icon name="ThreeLines" variant="outlined" size={16} className="text-[#283943] rotate-90" />
    </button>
  );
}

export function AdsEditorHeader({ currentLevel, onLevelChange, objective = "sales" }: AdsEditorHeaderProps) {
  const objectiveLabel = objective === "awareness" ? "Awareness" : "Sales";
  const campaignName = `New ${objectiveLabel} Campaign`;
  const adSetName = `New ${objectiveLabel} Ad set`;
  const adName = `New ${objectiveLabel} Ad`;
  
  return (
    <div className="bg-white flex flex-col gap-1 pt-1 pb-2">
      {/* Top row - breadcrumbs and status */}
      <div className="flex items-center justify-between px-3">
        {/* Left side - Sidebar toggle + Breadcrumbs */}
        <div className="flex items-center gap-3">
          {/* Sidebar toggle button */}
          <button className="h-9 px-3 border border-[#A7B3BF] rounded-[4px] flex items-center justify-center hover:bg-[#F8F9FB] transition-colors">
            <SidebarIcon className="text-[#283943]" />
          </button>

          {/* Breadcrumbs */}
          <div className="flex items-center gap-3">
            {/* Campaign - Active style */}
            <button 
              onClick={() => onLevelChange("L3")}
              className={`flex items-center gap-1 p-1 rounded-[4px] ${
                currentLevel === "L3" 
                  ? "bg-[#E1EDF7]" 
                  : "hover:bg-[#F8F9FB]"
              }`}
            >
              <FolderIcon className={currentLevel === "L3" ? "text-[#0A78BE]" : "text-[#283943]"} />
              <span className={`font-optimistic font-bold text-[14px] leading-[20px] ${
                currentLevel === "L3" ? "text-[#0A78BE]" : "text-[#1C2B33]"
              }`}>
                {campaignName}
              </span>
            </button>

            <ChevronRight className="text-[rgba(40,57,67,0.6)]" />

            {/* Ad Set */}
            <button 
              onClick={() => onLevelChange("L2")}
              className={`flex items-center gap-1 p-1 rounded-[4px] ${
                currentLevel === "L2" 
                  ? "bg-[#E1EDF7]" 
                  : "hover:bg-[#F8F9FB]"
              }`}
            >
              <GridIcon className={currentLevel === "L2" ? "text-[#0A78BE]" : "text-[#283943]"} />
              <span className={`font-optimistic font-medium text-[14px] leading-[20px] ${
                currentLevel === "L2" ? "text-[#0A78BE]" : "text-[rgba(70,90,105,0.6)]"
              }`}>
                {adSetName}
              </span>
            </button>

            <ChevronRight className="text-[rgba(40,57,67,0.6)]" />

            {/* Ad */}
            <button 
              onClick={() => onLevelChange("L1")}
              className={`flex items-center gap-1 p-1 rounded-[4px] ${
                currentLevel === "L1" 
                  ? "bg-[#E1EDF7]" 
                  : "hover:bg-[#F8F9FB]"
              }`}
            >
              <AdIcon className={currentLevel === "L1" ? "text-[#0A78BE]" : "text-[#283943]"} />
              <span className={`font-optimistic font-medium text-[14px] leading-[20px] ${
                currentLevel === "L1" ? "text-[#0A78BE]" : "text-[rgba(70,90,105,0.6)]"
              }`}>
                {adName}
              </span>
            </button>
          </div>
        </div>

        {/* Right side - status, toggle, ellipsis */}
        <div className="flex items-center gap-3">
          {/* Draft status */}
          <div className="flex items-center gap-2">
            <span className="w-[6px] h-[6px] rounded-full bg-[#F5B800]" />
            <span className="font-optimistic text-[14px] leading-[20px] text-[#1C2B33]">In draft</span>
          </div>

          {/* Vertical divider */}
          <div className="w-px h-[22px] bg-[#CBD2D9]" />

          {/* Toggle switch */}
          <div className="w-10 h-6 bg-[#E1EDF7] border border-[#CBD2D9] rounded-full relative">
            <div className="absolute left-4 top-0 w-[22px] h-[22px] bg-[#0A78BE] rounded-full" />
          </div>

          {/* Ellipsis button */}
          <EllipsisButton />
        </div>
      </div>

      {/* Bottom row - Edit/Review tabs */}
      <div className="flex items-center justify-center gap-2">
        <button className="h-9 px-3 py-2 rounded-[4px] flex items-center gap-2 hover:bg-[#F8F9FB] transition-colors">
          <PencilIcon className="text-[#0A78BE]" />
          <span className="font-sf-pro font-bold text-[14px] leading-[20px] text-[#1C2B33]">Edit</span>
        </button>
        <button className="h-9 px-3 py-2 rounded-[4px] flex items-center gap-2 hover:bg-[#F8F9FB] transition-colors">
          <EyeIcon className="text-[#283943]" />
          <span className="font-sf-pro text-[14px] leading-[20px] text-[#1C2B33]">Review</span>
        </button>
      </div>
    </div>
  );
}
