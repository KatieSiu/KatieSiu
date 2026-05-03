"use client";

import { Icon } from "@/features/ctv/components/ui/Icon";

export type ReportingTabId = "campaigns" | "adsets" | "ads";

interface Tab {
  id: ReportingTabId;
  label: string;
  icon: string;
  iconVariant: "filled" | "outlined";
}

const tabs: Tab[] = [
  { id: "campaigns", label: "Campaigns", icon: "Folder", iconVariant: "outlined" },
  { id: "adsets", label: "Ad sets", icon: "TopRectangles", iconVariant: "filled" },
  { id: "ads", label: "Ads", icon: "Photo", iconVariant: "outlined" },
];

interface ReportingTabsProps {
  activeTab: ReportingTabId;
  onTabChange: (tab: ReportingTabId) => void;
}

export function ReportingTabs({ activeTab, onTabChange }: ReportingTabsProps) {
  return (
    <div className="flex items-end gap-2 px-2 bg-[#F1F4F7]">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const isClickable = tab.id === "campaigns";
        return (
          <button
            key={tab.id}
            onClick={() => isClickable && onTabChange(tab.id)}
            disabled={!isClickable}
            className={`
              flex items-center gap-2 px-3 rounded-t-lg transition-colors flex-1
              ${isActive 
                ? "bg-white h-[44px]" 
                : "bg-[#F1F4F7] h-[40px]"
              }
              ${isClickable ? "cursor-pointer" : "cursor-default"}
            `}
          >
            <Icon 
              name={tab.icon} 
              variant={tab.iconVariant} 
              size={20} 
              className={isActive ? "text-[#0A78BE]" : "text-[#283943]"} 
            />
            <span className={`
              font-optimistic font-bold text-[16px] leading-[20px]
              ${isActive ? "text-[#0A78BE]" : "text-[#1C2B33]"}
            `}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
