"use client";

import {
  AdSetNameCard,
  ConversionSalesCardStandalone,
  BudgetScheduleCard,
  AudienceCard,
  PlacementsCardStandalone,
  BrandSafetyCard,
  AudienceDefinitionCard,
  EstimatedDailyResultsCard,
  CampaignScoreCard,
} from "@/features/ctv/components/cards";

interface StandaloneL2ViewProps {
  isTVMode?: boolean;
  defaultShowPlacementSettings?: boolean;
  defaultExpandedPlacementSection?: "devices" | "platforms" | "placementControls" | null;
}

export function StandaloneL2View({ 
  isTVMode = false, 
  defaultShowPlacementSettings = false,
  defaultExpandedPlacementSection = null,
}: StandaloneL2ViewProps) {
  return (
    <div className="flex gap-6 p-3 justify-center min-w-fit">
      {/* Left column - Main cards */}
      <div className="flex flex-col gap-[10px]">
        <AdSetNameCard version="alpha-v1" />
        <ConversionSalesCardStandalone version="alpha-v1" isTVMode={isTVMode} />
        <BudgetScheduleCard version="alpha-v1" />
        <AudienceCard version="alpha-v1" />
        {/* Placements card - only shown when TV mode is OFF */}
        {!isTVMode && (
          <PlacementsCardStandalone 
            version="alpha-v1" 
            isTVMode={isTVMode} 
            defaultShowSettings={defaultShowPlacementSettings}
            defaultExpandedSection={defaultExpandedPlacementSection}
          />
        )}
        <BrandSafetyCard version="alpha-v1" isTVMode={isTVMode} />
      </div>

      {/* Right column - Sidebar (sticky with top padding) */}
      <div className="flex flex-col gap-[10px] sticky top-3 self-start">
        {/* Campaign Score - only shown when TV mode is OFF */}
        {!isTVMode && <CampaignScoreCard version="alpha-v1" />}
        <AudienceDefinitionCard version="alpha-v1" />
        <EstimatedDailyResultsCard version="alpha-v1" />
      </div>
    </div>
  );
}
