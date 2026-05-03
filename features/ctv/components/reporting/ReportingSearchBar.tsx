"use client";

import { Icon } from "@/features/ctv/components/ui/Icon";

interface ReportingSearchBarProps {
  dateRange?: string;
}

export function ReportingSearchBar({
  dateRange = "1 Aug 2021 - 31 Aug 2021",
}: ReportingSearchBarProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-[#F1F4F7]">
      {/* Search Input - outlined bar with white background */}
      <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-white border border-[#CBD2D9] rounded">
        <Icon name="Search" variant="outlined" size={16} className="text-[#283943]" />
        <input
          type="text"
          placeholder="Search and filter"
          className="flex-1 font-sf-pro text-[14px] leading-[20px] text-[#1C2B33] placeholder:text-[rgba(28,43,51,0.65)] outline-none bg-transparent"
        />
      </div>
      
      {/* Date Range Picker - grey background button */}
      <button className="flex items-center gap-2 h-[36px] px-3 py-2 rounded bg-[rgba(0,0,0,0.05)] hover:bg-[rgba(0,0,0,0.08)] transition-colors shrink-0">
        <span className="font-optimistic font-medium text-[14px] leading-[20px] text-[#1C2B33] whitespace-nowrap">
          {dateRange}
        </span>
        <Icon name="SmallTriangleDown" variant="filled" size={16} className="text-[#283943]" />
      </button>
    </div>
  );
}
