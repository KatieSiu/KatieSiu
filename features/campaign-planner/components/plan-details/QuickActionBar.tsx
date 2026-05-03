"use client";

import React from "react";
import { Icon } from "@/features/campaign-planner/components/ui/Icon";
import { Button } from "@/features/campaign-planner/components/ui/Button";
import { Dropdown } from "@/features/campaign-planner/components/ui/Dropdown";
import { colors } from "@/features/campaign-planner/lib/design-tokens";
import { CampaignPlan } from "@/features/campaign-planner/lib/mock-data";

// ============================================
// Quick Action Bar (Title Header)
// ============================================
interface QuickActionBarProps {
  plan: CampaignPlan;
  onUpdatePlan: (updates: Partial<CampaignPlan>) => void;
  onOpenEditSettingsModal: () => void;
  onOpenDeletePlanModal: () => void;
  onOpenDuplicatePlanModal: () => void;
  onOpenEditNameDescriptionModal: () => void;
  onOpenBookInAdsManagerModal: () => void;
}

export function QuickActionBar({ 
  plan, 
  onUpdatePlan,
  onOpenEditSettingsModal,
  onOpenDeletePlanModal,
  onOpenDuplicatePlanModal,
  onOpenEditNameDescriptionModal,
  onOpenBookInAdsManagerModal,
}: QuickActionBarProps) {
  return (
    <div 
      className="rounded-[8px] shadow-[0px_0px_8px_0px_rgba(10,120,190,0.08)] p-[16px]"
      style={{ backgroundColor: colors.background.content }}
    >
      {/* Title Row */}
      <div className="flex items-center justify-between gap-[10px]">
        {/* Plan Name + Buying Type + Description */}
        <div className="flex-1 flex flex-col">
          <div className="flex items-center gap-[8px]">
            <h1 
              className="font-optimistic font-bold text-[18px] leading-[22px]"
              style={{ color: '#1c2b33' }}
            >
              {plan.name}
            </h1>
            <button
              onClick={onOpenEditNameDescriptionModal}
              className="shrink-0 hover:opacity-70 transition-opacity"
              aria-label="Edit plan name and description"
            >
              <Icon name="Pencil" variant="outlined" size={16} color={colors.icon.default} />
            </button>
          </div>
          {/* Buying Type • Description */}
          <div 
            className="flex gap-[4px] font-optimistic text-[12px] leading-[16px]"
            style={{ color: 'rgba(70,90,105,0.6)' }}
          >
            <span>{plan.buyingType} •</span>
            <span>{plan.description || "Add Description..."}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-[4px]">
          {/* Overflow Menu */}
          <Dropdown
            trigger={
              <button 
                className="flex items-center justify-center h-[36px] px-[12px] py-[8px] rounded-[4px] hover:bg-[rgba(0,0,0,0.05)] transition-colors"
              >
                <Icon name="ThreeDots" variant="outlined" size={16} color={colors.icon.default} />
              </button>
            }
            width={180}
          >
            <Dropdown.List>
              <Dropdown.Item label="Edit Settings" icon="Settings" onClick={onOpenEditSettingsModal} />
              <Dropdown.Item label="Share" icon="ArrowUpRightSquare" onClick={() => console.log('Share clicked')} />
              <Dropdown.Divider />
              <Dropdown.Item label="Delete Plan" icon="Trash" onClick={onOpenDeletePlanModal} />
            </Dropdown.List>
          </Dropdown>

          {/* Download CSV */}
          <Button variant="flat" onClick={() => console.log('Download CSV clicked')}>
            <Icon name="FileDownload" variant="outlined" size={16} />
            Download CSV
          </Button>

          {/* Duplicate */}
          <Button variant="flat" onClick={onOpenDuplicatePlanModal}>
            <Icon name="Duplicate" variant="outlined" size={16} />
            Duplicate
          </Button>

          {/* Book in Ads Manager */}
          <Button variant="primary" onClick={onOpenBookInAdsManagerModal}>
            Book in Ads Manager
          </Button>
        </div>
      </div>
    </div>
  );
}

