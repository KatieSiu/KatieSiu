"use client";

import { Icon } from "@/features/ctv/components/ui/Icon";

interface ReportingPageHeaderProps {
  accountName?: string;
  accountId?: string;
  draftCount?: number;
}

export function ReportingPageHeader({
  accountName = "Happy Plants",
  accountId = "18823498723489761",
  draftCount = 46,
}: ReportingPageHeaderProps) {
  return (
    <div className="h-[68px] px-4 flex items-center justify-between border-b border-[#E4E8EB] bg-white">
      {/* Left side - Title and Account */}
      <div className="flex items-center gap-3">
        <h1 className="font-optimistic font-bold text-[18px] leading-[22px] text-[#1C2B33]">
          Campaigns
        </h1>
        
        {/* Account Selector */}
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-[#CBD2D9] hover:bg-[rgba(0,0,0,0.03)] transition-colors">
          <span className="font-sf-pro text-[14px] leading-[20px] text-[#1C2B33]">
            {accountName} ({accountId})
          </span>
          <Icon name="SmallTriangleDown" variant="filled" size={16} className="text-[#283943]" />
        </button>
      </div>
      
      {/* Right side - Status and Actions */}
      <div className="flex items-center gap-3">
        {/* Updated Status */}
        <div className="flex items-center gap-2 text-[#465A69]">
          <span className="font-sf-pro text-[14px] leading-[20px]">Updated just now</span>
          <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[rgba(0,0,0,0.05)] transition-colors">
            <Icon name="Refresh" variant="outlined" size={20} className="text-[#465A69]" />
          </button>
        </div>
        
        {/* Discard Drafts Button */}
        <button className="px-4 py-2 rounded-md border border-[#CBD2D9] hover:bg-[rgba(0,0,0,0.03)] transition-colors">
          <span className="font-optimistic font-medium text-[14px] leading-[20px] text-[#1C2B33]">
            Discard drafts
          </span>
        </button>
        
        {/* Review and Publish Button */}
        <button className="px-4 py-2 rounded-md bg-[#0A78BE] hover:bg-[#0869a8] transition-colors">
          <span className="font-optimistic font-medium text-[14px] leading-[20px] text-white">
            Review and publish ({draftCount})
          </span>
        </button>
        
        {/* More Options */}
        <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[rgba(0,0,0,0.05)] transition-colors">
          <Icon name="More" variant="outlined" size={20} className="text-[#283943]" />
        </button>
      </div>
    </div>
  );
}
