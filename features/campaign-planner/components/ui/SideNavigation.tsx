"use client";

import { Icon } from "./Icon";

// ============================================
// Static Side Navigation Component
// Meta-style collapsed navigation bar
// ============================================

interface NavItemProps {
  icon: string;
  isActive?: boolean;
}

function NavItem({ icon, isActive = false }: NavItemProps) {
  return (
    <button
      className={`
        flex items-center justify-center p-[10px] rounded-[6px] transition-colors shrink-0
        ${isActive 
          ? 'bg-[#1C2B33]' 
          : 'bg-white hover:bg-[rgba(0,0,0,0.05)]'
        }
      `}
    >
      <Icon 
        name={icon} 
        variant="outlined" 
        size={20} 
        className={isActive ? 'text-white' : 'text-[rgba(0,0,0,0.75)]'}
      />
    </button>
  );
}

export function SideNavigation() {
  return (
    <nav className="flex flex-col h-full w-[56px] bg-white pt-4 pb-2 px-2 shadow-[0px_0px_24px_0px_rgba(10,120,190,0.08)] shrink-0 z-10 relative">
      {/* Meta Logo */}
      <div className="flex items-center justify-center h-10 shrink-0">
        <img 
          src="/meta-logo.svg" 
          alt="Meta" 
          className="w-10 h-10"
        />
      </div>

      {/* Company/Scope Icon */}
      <div className="flex items-center justify-center p-1 mt-4 shrink-0">
        <div className="w-8 h-8 rounded-[6px] bg-[rgba(0,0,0,0.05)] overflow-hidden">
          <img 
            src="/placeholder.png" 
            alt="Company" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex flex-col gap-1 mt-4 shrink-0">
        <NavItem icon="House" />
        <NavItem icon="Bell" />
        <NavItem icon="ChartPie" />
        <NavItem icon="DollarCircle" />
        <NavItem icon="Table" />
        <NavItem icon="People" />
        <NavItem icon="Tag" />
        <NavItem icon="ChartAscendingBars" />
        <NavItem icon="ThreeLines" isActive />
        </div>

        {/* Divider */}
      <div className="h-px bg-[#E4E8EB] mx-1 my-4 shrink-0" />

      {/* Spacer to push bottom nav down */}
      <div className="flex-1" />

      {/* Bottom Navigation */}
      <div className="flex flex-col gap-1 shrink-0">
        <NavItem icon="Search" />
        <NavItem icon="Settings" />
        <NavItem icon="Help" />
      </div>
    </nav>
  );
}
