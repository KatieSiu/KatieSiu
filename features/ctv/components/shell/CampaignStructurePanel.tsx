"use client";

import { Icon } from "@/features/ctv/components/ui/Icon";

export type EditorLevel = "L3" | "L2" | "L1";

type CampaignObjective = "sales" | "awareness";

interface CampaignStructurePanelProps {
  currentLevel: EditorLevel;
  onLevelChange: (level: EditorLevel) => void;
  objective?: CampaignObjective;
}

interface TreeItem {
  level: EditorLevel;
  label: string;
  iconType: "folder" | "grid" | "ad";
  paddingLeft: number;
}

function getTreeItems(objective: CampaignObjective = "sales"): TreeItem[] {
  const label = objective === "awareness" ? "Awareness" : "Sales";
  return [
    { level: "L3", label: `New ${label} Campaign`, iconType: "folder", paddingLeft: 12 },
    { level: "L2", label: `New ${label} Ad set`, iconType: "grid", paddingLeft: 24 },
    { level: "L1", label: `New ${label} Ad`, iconType: "ad", paddingLeft: 40 },
  ];
}

interface IconProps {
  className?: string;
  style?: React.CSSProperties;
}

// Filled folder icon for active state
function FolderFilledIcon({ className, style }: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <path fillRule="evenodd" clipRule="evenodd" d="M1 4C1 2.89543 1.89543 2 3 2H6.17157C6.70201 2 7.21071 2.21071 7.58579 2.58579L8.41421 3.41421C8.78929 3.78929 9.29799 4 9.82843 4H13C14.1046 4 15 4.89543 15 6V12C15 13.1046 14.1046 14 13 14H3C1.89543 14 1 13.1046 1 12V4Z" fill="currentColor"/>
    </svg>
  );
}

// Outlined folder icon for inactive state
function FolderOutlinedIcon({ className, style }: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <path d="M1.5 4C1.5 3.17157 2.17157 2.5 3 2.5H6.17157C6.56878 2.5 6.94971 2.65804 7.23223 2.93934L8.06066 3.76777C8.48043 4.18754 9.04241 4.5 9.82843 4.5H13C13.8284 4.5 14.5 5.17157 14.5 6V12C14.5 12.8284 13.8284 13.5 13 13.5H3C2.17157 13.5 1.5 12.8284 1.5 12V4Z" stroke="currentColor" strokeWidth="1"/>
    </svg>
  );
}

// Filled grid icon for active state
function GridFilledIcon({ className, style }: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <path fillRule="evenodd" clipRule="evenodd" d="M2 3C2 2.44772 2.44772 2 3 2H6C6.55228 2 7 2.44772 7 3V6C7 6.55228 6.55228 7 6 7H3C2.44772 7 2 6.55228 2 6V3ZM9 3C9 2.44772 9.44772 2 10 2H13C13.5523 2 14 2.44772 14 3V6C14 6.55228 13.5523 7 13 7H10C9.44772 7 9 6.55228 9 6V3ZM2 10C2 9.44772 2.44772 9 3 9H6C6.55228 9 7 9.44772 7 10V13C7 13.5523 6.55228 14 6 14H3C2.44772 14 2 13.5523 2 13V10ZM9 10C9 9.44772 9.44772 9 10 9H13C13.5523 9 14 9.44772 14 10V13C14 13.5523 13.5523 14 13 14H10C9.44772 14 9 13.5523 9 13V10Z" fill="currentColor"/>
    </svg>
  );
}

// Outlined grid icon for inactive state
function GridOutlinedIcon({ className, style }: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <rect x="2.5" y="2.5" width="4" height="4" rx="0.5" stroke="currentColor"/>
      <rect x="9.5" y="2.5" width="4" height="4" rx="0.5" stroke="currentColor"/>
      <rect x="2.5" y="9.5" width="4" height="4" rx="0.5" stroke="currentColor"/>
      <rect x="9.5" y="9.5" width="4" height="4" rx="0.5" stroke="currentColor"/>
    </svg>
  );
}

// Filled ad icon for active state
function AdFilledIcon({ className, style }: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <rect x="2" y="2" width="12" height="12" rx="1" fill="currentColor"/>
      <path d="M5 8H11M5 5H11M5 11H8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

// Outlined ad icon for inactive state
function AdOutlinedIcon({ className, style }: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      <rect x="2.5" y="2.5" width="11" height="11" rx="0.5" stroke="currentColor"/>
      <path d="M5 8H11M5 5H11M5 11H8" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
    </svg>
  );
}

function EllipsisIcon() {
  return (
    <div 
      className="w-9 h-9 rounded-[4px] flex items-center justify-center hover:bg-[rgba(0,0,0,0.05)] transition-colors opacity-0 group-hover:opacity-100"
      onClick={(e) => e.stopPropagation()}
    >
      <Icon name="ThreeLines" variant="outlined" size={16} className="text-[#283943] rotate-90" />
    </div>
  );
}

export function CampaignStructurePanel({ 
  currentLevel, 
  onLevelChange,
  objective = "sales",
}: CampaignStructurePanelProps) {
  const treeItems = getTreeItems(objective);
  
  return (
    <div className="w-[280px] h-full bg-white border-r border-[#CBD2D9] flex flex-col">
      {/* Panel content */}
      <div className="flex-1 overflow-y-auto pb-4">
        {treeItems.map((item) => {
          const isActive = item.level === currentLevel;
          
          // Only two states: active (blue) or inactive (green)
          // Active = Blue (#0A78BE) with light blue background (#ECF4FE), filled icon
          // Inactive = Green (#79BA3A) with light green background (#EBF2E6), outlined icon
          const borderColor = isActive ? "#0A78BE" : "#79BA3A";
          const bgColor = isActive ? "#ECF4FE" : "#EBF2E6";
          const iconColor = isActive ? "#0A78BE" : "#283943";
          
          return (
            <button
              key={item.level}
              onClick={() => onLevelChange(item.level)}
              className="group w-full h-10 flex items-center gap-2 pr-3 text-left transition-colors"
              style={{ 
                paddingLeft: item.paddingLeft,
                backgroundColor: bgColor,
                borderLeft: `2px solid ${borderColor}`,
              }}
            >
              {/* Icon - filled when active (blue), outlined when inactive (green) */}
              {item.iconType === "folder" && (
                isActive 
                  ? <FolderFilledIcon style={{ color: iconColor }} />
                  : <FolderOutlinedIcon style={{ color: iconColor }} />
              )}
              {item.iconType === "grid" && (
                isActive
                  ? <GridFilledIcon style={{ color: iconColor }} />
                  : <GridOutlinedIcon style={{ color: iconColor }} />
              )}
              {item.iconType === "ad" && (
                isActive
                  ? <AdFilledIcon style={{ color: iconColor }} />
                  : <AdOutlinedIcon style={{ color: iconColor }} />
              )}

              {/* Label */}
              <span className="flex-1 font-optimistic font-medium text-[14px] leading-[20px] text-[#1C2B33] truncate">
                {item.label}
              </span>

              {/* Ellipsis icon */}
              <EllipsisIcon />
            </button>
          );
        })}
      </div>
    </div>
  );
}
