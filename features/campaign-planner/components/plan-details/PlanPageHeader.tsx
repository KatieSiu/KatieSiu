"use client";

import { useRouter } from "next/navigation";
import { Icon } from "@/features/campaign-planner/components/ui/Icon";
import { Avatar } from "@/features/campaign-planner/components/ui/Avatar";
import { DropdownButton } from "@/features/campaign-planner/components/ui/Button";
import { colors } from "@/features/campaign-planner/lib/design-tokens";

// ============================================
// Plan Page Header Component
// ============================================
interface PlanPageHeaderProps {
  onBack: () => void;
}

export function PlanPageHeader({ onBack }: PlanPageHeaderProps) {
  return (
    <header className="flex items-center justify-between gap-4 w-full pb-[10px] min-w-0">
      {/* Left side: Back Button and Company Selector */}
      <div className="flex items-center gap-[10px] shrink-0">
        {/* Back to All Plans */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-0 py-[2px] rounded-[4px] hover:bg-[rgba(0,0,0,0.05)] transition-colors"
        >
          <Icon name="ArrowLeft" variant="outlined" size={20} color={colors.icon.default} />
          <span 
            className="font-optimistic font-bold text-[20px] leading-[24px]" 
            style={{ color: colors.text.heading }}
          >
            All Plans
          </span>
        </button>

        {/* Vertical Divider */}
        <div className="flex items-center justify-center h-6 w-px shrink-0">
          <div className="h-6 w-px" style={{ backgroundColor: colors.border.primary }} />
        </div>

        {/* Company Selector Dropdown */}
        <DropdownButton
          title="Chicken Company"
          subtitle="Business portfolio"
          thumbnail={
            <img 
              src="/placeholder.png" 
              alt="Chicken Company"
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

