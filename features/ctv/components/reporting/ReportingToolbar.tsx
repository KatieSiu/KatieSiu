"use client";

import { useState } from "react";
import { Icon } from "@/features/ctv/components/ui/Icon";

export function ReportingToolbar() {
  const [viewSetupOn, setViewSetupOn] = useState(false);

  return (
    <div className="h-[52px] px-4 flex items-center justify-between border-b border-[#E4E8EB] bg-white">
      {/* Left side - Action buttons */}
      <div className="flex items-center gap-2">
        {/* Create Button */}
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#0A78BE] hover:bg-[#0869a8] transition-colors">
          <Icon name="Plus" variant="outlined" size={16} className="text-white" />
          <span className="font-optimistic font-medium text-[14px] leading-[20px] text-white">
            Create
          </span>
          <Icon name="SmallTriangleDown" variant="filled" size={12} className="text-white" />
        </button>
        
        {/* Edit Button */}
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#CBD2D9] hover:bg-[rgba(0,0,0,0.03)] transition-colors">
          <Icon name="Pencil" variant="filled" size={16} className="text-[#283943]" />
          <span className="font-optimistic font-medium text-[14px] leading-[20px] text-[#1C2B33]">
            Edit
          </span>
          <Icon name="SmallTriangleDown" variant="filled" size={12} className="text-[#283943]" />
        </button>
        
        {/* A/B Test Button */}
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#CBD2D9] hover:bg-[rgba(0,0,0,0.03)] transition-colors">
          <Icon name="ABTest" variant="outlined" size={16} className="text-[#283943]" />
          <span className="font-optimistic font-medium text-[14px] leading-[20px] text-[#1C2B33]">
            A/B test
          </span>
        </button>
        
        {/* Divider */}
        <div className="w-px h-6 bg-[#CBD2D9] mx-1" />
        
        {/* Icon buttons */}
        <ToolbarIconButton icon="Columns" />
        <ToolbarIconButton icon="Delete" />
        <ToolbarIconButton icon="Duplicate" />
        <ToolbarIconButton icon="Refresh" />
        
        {/* Divider */}
        <div className="w-px h-6 bg-[#CBD2D9] mx-1" />
        
        {/* Rules Dropdown */}
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#CBD2D9] hover:bg-[rgba(0,0,0,0.03)] transition-colors">
          <span className="font-optimistic font-medium text-[14px] leading-[20px] text-[#1C2B33]">
            Rules
          </span>
          <Icon name="SmallTriangleDown" variant="filled" size={12} className="text-[#283943]" />
        </button>
      </div>
      
      {/* Right side - View controls */}
      <div className="flex items-center gap-2">
        {/* View Setup Toggle */}
        <div className="flex items-center gap-2">
          <span className="font-sf-pro text-[14px] leading-[20px] text-[#1C2B33]">
            View Setup
          </span>
          <button
            onClick={() => setViewSetupOn(!viewSetupOn)}
            className={`
              w-[44px] h-[24px] rounded-full transition-colors relative
              ${viewSetupOn ? "bg-[#0A78BE]" : "bg-[#CBD2D9]"}
            `}
          >
            <div
              className={`
                w-[20px] h-[20px] rounded-full bg-white absolute top-[2px] transition-all
                ${viewSetupOn ? "left-[22px]" : "left-[2px]"}
              `}
            />
          </button>
        </div>
        
        {/* Divider */}
        <div className="w-px h-6 bg-[#CBD2D9] mx-1" />
        
        {/* Columns Button */}
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#CBD2D9] hover:bg-[rgba(0,0,0,0.03)] transition-colors">
          <Icon name="Columns" variant="outlined" size={16} className="text-[#283943]" />
          <Icon name="SmallTriangleDown" variant="filled" size={12} className="text-[#283943]" />
        </button>
        
        {/* Filter Button */}
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#CBD2D9] hover:bg-[rgba(0,0,0,0.03)] transition-colors">
          <Icon name="Filter" variant="outlined" size={16} className="text-[#283943]" />
          <Icon name="SmallTriangleDown" variant="filled" size={12} className="text-[#283943]" />
        </button>
        
        {/* Reports Button */}
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#CBD2D9] hover:bg-[rgba(0,0,0,0.03)] transition-colors">
          <Icon name="BarChart" variant="outlined" size={16} className="text-[#283943]" />
          <span className="font-optimistic font-medium text-[14px] leading-[20px] text-[#1C2B33]">
            Reports
          </span>
          <Icon name="SmallTriangleDown" variant="filled" size={12} className="text-[#283943]" />
        </button>
        
        {/* Export Button */}
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#CBD2D9] hover:bg-[rgba(0,0,0,0.03)] transition-colors">
          <Icon name="Download" variant="outlined" size={16} className="text-[#283943]" />
          <span className="font-optimistic font-medium text-[14px] leading-[20px] text-[#1C2B33]">
            Export
          </span>
          <Icon name="SmallTriangleDown" variant="filled" size={12} className="text-[#283943]" />
        </button>
      </div>
    </div>
  );
}

function ToolbarIconButton({ icon }: { icon: string }) {
  return (
    <button className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[rgba(0,0,0,0.05)] transition-colors">
      <Icon name={icon} variant="outlined" size={16} className="text-[#283943]" />
    </button>
  );
}
