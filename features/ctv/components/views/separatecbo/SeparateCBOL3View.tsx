"use client";

import {
  CampaignNameCard,
  CampaignDetailsCard,
  AdvantageCatalogAdsCard,
  BudgetCard,
  ABTestCard,
  AudienceSegmentReportingCard,
  SpecialAdCategoriesCard,
  CampaignScoreCard,
} from "@/features/ctv/components/cards";
import type { CampaignObjective, BudgetType } from "@/features/ctv/components/prototypes";

interface SeparateCBOL3ViewProps {
  isTVMode?: boolean;
  objective?: CampaignObjective;
  onObjectiveChange?: (objective: CampaignObjective) => void;
  isAdvantageBudgetOn?: boolean;
  onAdvantageBudgetChange?: (isOn: boolean) => void;
  budgetType?: BudgetType;
  onBudgetTypeChange?: (type: BudgetType) => void;
  budgetValue?: string;
  onBudgetValueChange?: (value: string) => void;
}

export function SeparateCBOL3View({ 
  isTVMode = false, 
  objective = "sales",
  onObjectiveChange,
  isAdvantageBudgetOn = true,
  onAdvantageBudgetChange,
  budgetValue = "$100.00",
  onBudgetValueChange,
}: SeparateCBOL3ViewProps) {
  const isSales = objective === "sales";

  return (
    <div className="flex gap-6 p-3 justify-center min-w-fit">
      {/* Left column - Main cards */}
      <div className="flex flex-col gap-[10px]">
        <CampaignNameCard version="alpha-v1" />
        <CampaignDetailsCard 
          version="alpha-v1" 
          objective={objective}
          onObjectiveChange={(newObjective) => {
            if (newObjective === "sales" || newObjective === "awareness") {
              onObjectiveChange?.(newObjective);
            }
          }}
        />
        
        {isSales && (
          <>
            <AdvantageCatalogAdsCard version="alpha-v1" isTVMode={isTVMode} />
            <BudgetCard 
              version="alpha-v1" 
              isTVMode={isTVMode}
              isAdvantageBudgetOn={isAdvantageBudgetOn}
              onAdvantageBudgetChange={onAdvantageBudgetChange}
              budgetValue={budgetValue}
              onBudgetValueChange={onBudgetValueChange}
              disableTVModeRestrictions={true}
            />
            <ABTestCard version="alpha-v1" isTVMode={isTVMode} />
            <AudienceSegmentReportingCard version="alpha-v1" isTVMode={isTVMode} />
          </>
        )}
        
        <SpecialAdCategoriesCard version="alpha-v1" />
      </div>

      {/* Right column - Sidebar */}
      <div className="flex flex-col gap-[10px] sticky top-3 self-start">
        <CampaignScoreCard version="alpha-v1" isTVMode={isTVMode} />
      </div>
    </div>
  );
}
