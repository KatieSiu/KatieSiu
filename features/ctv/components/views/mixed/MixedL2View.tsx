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
} from "@/features/ctv/components/cards";

interface MixedL2ViewProps {
  isTVMode?: boolean;
  onTVModeChange?: (isTVMode: boolean) => void;
  /** Whether to show placement settings expanded by default */
  defaultShowPlacementSettings?: boolean;
  /** Which placement section to expand by default */
  defaultExpandedPlacementSection?: "devices" | "platforms" | "placementControls" | null;
  // Advantage+ Budget props
  isAdvantageBudgetOn?: boolean;
  budgetValue?: string;
}

export function MixedL2View({ 
  isTVMode = false, 
  onTVModeChange,
  defaultShowPlacementSettings = false,
  defaultExpandedPlacementSection = null,
  isAdvantageBudgetOn = true,
  budgetValue = "$350.00",
}: MixedL2ViewProps) {
  return (
    <div className="flex gap-6 p-3 justify-center min-w-fit">
      {/* Left column - Main cards */}
      <div className="flex flex-col gap-[10px]">
        {/* Ad Set Name */}
        <AdSetNameCard version="alpha-v1" />
        
        {/* Sales-specific cards */}
        <ConversionSalesCard version="alpha-v1" isTVMode={isTVMode} />
        <BudgetScheduleCard 
          version="alpha-v1" 
          isTVMode={isTVMode}
          isAdvantageBudgetOn={isAdvantageBudgetOn}
          budgetValue={budgetValue}
        />
        <AudienceCard version="alpha-v1" />
        
        {/* Placements - with mixed placement mode (checkboxes for both Mobile/Desktop AND TV) */}
        <PlacementsCard 
          version="alpha-v1" 
          isTVMode={isTVMode} 
          onTVModeChange={onTVModeChange}
          defaultShowSettings={true}
          defaultExpandedSection="devices"
          mixedPlacementMode={true}
        />
        <BrandSafetyCard version="alpha-v1" isTVMode={isTVMode} />
      </div>

      {/* Right column - Sidebar (sticky with top padding) */}
      <div className="flex flex-col gap-[10px] sticky top-3 self-start">
        <CampaignScoreCard version="alpha-v1" isTVMode={isTVMode} />
        <AudienceDefinitionCard version="alpha-v1" />
        <EstimatedDailyResultsCard version="alpha-v1" />
      </div>
    </div>
  );
}
