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
  AdvantageCampaignBudgetCard,
} from "@/features/ctv/components/cards";
import type { CampaignObjective, BudgetType } from "@/features/ctv/components/prototypes";

interface AfterL3ViewProps {
  isTVMode?: boolean;
  objective?: CampaignObjective;
  onObjectiveChange?: (objective: CampaignObjective) => void;
  // Advantage+ Budget props (for Awareness campaigns)
  isAdvantageBudgetOn?: boolean;
  onAdvantageBudgetChange?: (isOn: boolean) => void;
  budgetType?: BudgetType;
  onBudgetTypeChange?: (type: BudgetType) => void;
  budgetValue?: string;
  onBudgetValueChange?: (value: string) => void;
}

export function AfterL3View({ 
  isTVMode = false, 
  objective = "sales",
  onObjectiveChange,
  isAdvantageBudgetOn = true,
  onAdvantageBudgetChange,
  budgetType = "daily",
  onBudgetTypeChange,
  budgetValue = "$100.00",
  onBudgetValueChange,
}: AfterL3ViewProps) {
  const isSales = objective === "sales";
  const isAwareness = objective === "awareness";

  return (
    <div className="flex gap-6 p-3 justify-center min-w-fit">
      {/* Left column - Main cards */}
      <div className="flex flex-col gap-[10px]">
        {/* Common cards for both objectives */}
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
        
        {/* Sales-specific cards */}
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
            />
            <ABTestCard version="alpha-v1" isTVMode={isTVMode} />
            <AudienceSegmentReportingCard version="alpha-v1" isTVMode={isTVMode} />
          </>
        )}
        
        {/* Awareness-specific cards */}
        {isAwareness && (
          <>
            <ABTestCard version="alpha-v1" isTVMode={isTVMode} />
            <AdvantageCampaignBudgetCard 
              version="alpha-v1"
              isEnabled={isAdvantageBudgetOn}
              onEnabledChange={onAdvantageBudgetChange}
              budgetType={budgetType}
              onBudgetTypeChange={onBudgetTypeChange}
              budgetValue={budgetValue}
              onBudgetValueChange={onBudgetValueChange}
            />
          </>
        )}
        
        {/* Common card at the end */}
        <SpecialAdCategoriesCard version="alpha-v1" />
      </div>

      {/* Right column - Sidebar (sticky with top padding) */}
      <div className="flex flex-col gap-[10px] sticky top-3 self-start">
        {/* Campaign Score - shows TV Mode variant when TV mode is ON */}
        <CampaignScoreCard version="alpha-v1" isTVMode={isTVMode} />
      </div>
    </div>
  );
}
