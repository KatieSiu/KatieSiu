"use client";

import { DropdownButton } from "./Button";
import { Avatar } from "./Avatar";

// ============================================
// Page Header Component
// Contains title, company selector, and user avatar
// ============================================

interface PageHeaderProps {
  title?: string;
  companyName?: string;
  companySubtitle?: string;
}

export function PageHeader({ 
  title = "Campaign Planner",
  companyName = "Chicken Company",
  companySubtitle = "Business portfolio"
}: PageHeaderProps) {
  return (
    <header className="flex items-center justify-between gap-4 w-full pb-[10px] min-w-0">
      {/* Left side: Title and Company Selector */}
      <div className="flex items-center gap-[10px] shrink-0">
        <h1 className="font-optimistic font-bold text-[20px] leading-[24px] text-[#1C2B33] whitespace-nowrap">
          {title}
        </h1>

        {/* Vertical Divider */}
        <div className="flex items-center justify-center h-6 w-px shrink-0">
          <div className="h-6 w-px bg-[#CBD2D9]" />
        </div>

        {/* Company Selector Dropdown */}
        <DropdownButton
          title={companyName}
          subtitle={companySubtitle}
          thumbnail={
            <img 
              src="/placeholder.png" 
              alt={companyName}
              className="w-full h-full object-cover"
            />
          }
        />
      </div>

      {/* Right side: User Avatar */}
      <Avatar 
        size={32} 
        src="/placeholder.png" 
        alt="User profile"
        className="shrink-0"
      />
    </header>
  );
}
