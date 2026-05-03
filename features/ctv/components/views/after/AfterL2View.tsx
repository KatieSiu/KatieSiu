"use client";

import {
  AdSetNameCard,
  ConversionSalesCard,
  BudgetScheduleCard,
  AudienceCard,
  PlacementsCard,
  BrandSafetyCard,
  AudienceDefinitionCard,
  EstimatedDailyResultsCard,
  CampaignScoreCard,
  AwarenessCard,
  AudienceControlsCard,
  AdvantagePlusAudienceCard,
  DynamicCreativeCard,
  AwarenessBudgetScheduleCard,
  AdTransparencyCard,
} from "@/features/ctv/components/cards";
import type { CampaignObjective, BudgetType } from "@/features/ctv/components/prototypes";

interface AfterL2ViewProps {
  isTVMode?: boolean;
  onTVModeChange?: (isTVMode: boolean) => void;
  objective?: CampaignObjective;
  /** Whether to show placement settings expanded by default */
  defaultShowPlacementSettings?: boolean;
  /** Which placement section to expand by default */
  defaultExpandedPlacementSection?: "devices" | "platforms" | "placementControls" | null;
  // Advantage+ Budget props (from L3)
  isAdvantageBudgetOn?: boolean;
  budgetType?: BudgetType;
  budgetValue?: string;
}

export function AfterL2View({ 
  isTVMode = false, 
  onTVModeChange,
  objective = "sales",
  defaultShowPlacementSettings = false,
  defaultExpandedPlacementSection = null,
  isAdvantageBudgetOn = true,
  budgetType = "daily",
  budgetValue = "$100.00",
}: AfterL2ViewProps) {
  const isSales = objective === "sales";
  const isAwareness = objective === "awareness";

  return (
    <div className="flex gap-6 p-3 justify-center min-w-fit">
      {/* Left column - Main cards */}
      <div className="flex flex-col gap-[10px]">
        {/* Common card */}
        <AdSetNameCard version="alpha-v1" />
        
        {/* Sales-specific cards */}
        {isSales && (
          <>
            <ConversionSalesCard version="alpha-v1" isTVMode={isTVMode} />
            <BudgetScheduleCard 
              version="alpha-v1" 
              isTVMode={isTVMode}
              isAdvantageBudgetOn={isAdvantageBudgetOn}
              budgetValue={budgetValue}
            />
            <AudienceCard version="alpha-v1" />
          </>
        )}
        
        {/* Awareness-specific cards */}
        {isAwareness && (
          <>
            <AwarenessCard version="alpha-v1" isTVMode={isTVMode} />
            <DynamicCreativeCard version="alpha-v1" />
            <AwarenessBudgetScheduleCard 
              version="alpha-v1"
              isAdvantageBudgetOn={isAdvantageBudgetOn}
              budgetType={budgetType}
              budgetValue={budgetValue}
            />
            <AudienceControlsCard version="alpha-v1" />
            <AdvantagePlusAudienceCard version="alpha-v1" />
            <AdTransparencyCard version="alpha-v1" />
          </>
        )}
        
        {/* Common cards */}
        <PlacementsCard 
          version="alpha-v1" 
          isTVMode={isTVMode} 
          onTVModeChange={onTVModeChange}
          defaultShowSettings={defaultShowPlacementSettings}
          defaultExpandedSection={defaultExpandedPlacementSection}
        />
        <BrandSafetyCard version="alpha-v1" isTVMode={isTVMode} />
      </div>

      {/* Right column - Sidebar (sticky with top padding) */}
      <div className="flex flex-col gap-[10px] sticky top-3 self-start">
        {/* Campaign Score - shows TV Mode variant when TV mode is ON */}
        <CampaignScoreCard version="alpha-v1" isTVMode={isTVMode} />
        <AudienceDefinitionCard version="alpha-v1" />
        <EstimatedDailyResultsCard version="alpha-v1" />
      </div>
    </div>
  );
}
