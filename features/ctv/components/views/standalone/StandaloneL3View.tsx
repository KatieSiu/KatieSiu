"use client";

import {
  CampaignNameCard,
  CampaignDetailsCardStandalone,
  AdvantageCatalogAdsCard,
  BudgetCard,
  ABTestCard,
  AudienceSegmentReportingCard,
  SpecialAdCategoriesCard,
  CampaignScoreCard,
} from "@/features/ctv/components/cards";

interface StandaloneL3ViewProps {
  isTVMode?: boolean;
  onChannelChange?: (channel: "social" | "ctv") => void;
}

export function StandaloneL3View({ isTVMode = false, onChannelChange }: StandaloneL3ViewProps) {
  return (
    <div className="flex gap-6 p-3 justify-center min-w-fit">
      {/* Left column - Main cards */}
      <div className="flex flex-col gap-[10px]">
        <CampaignNameCard version="alpha-v1" />
        <CampaignDetailsCardStandalone 
          version="alpha-v1" 
          onChannelChange={onChannelChange}
          currentChannel={isTVMode ? "ctv" : "social"}
        />
        {/* Advantage+ Catalog Ads - hidden when Connected TV is selected */}
        {!isTVMode && <AdvantageCatalogAdsCard version="alpha-v1" isTVMode={isTVMode} />}
        <BudgetCard version="alpha-v1" />
        {/* AB Test - hidden when Connected TV is selected */}
        {!isTVMode && <ABTestCard version="alpha-v1" isTVMode={isTVMode} />}
        {/* Audience Segment Reporting - hidden when Connected TV is selected */}
        {!isTVMode && <AudienceSegmentReportingCard version="alpha-v1" isTVMode={isTVMode} />}
        <SpecialAdCategoriesCard version="alpha-v1" />
      </div>

      {/* Right column - Sidebar (sticky with top padding) */}
      <div className="flex flex-col gap-[10px] sticky top-3 self-start">
        {/* Campaign Score - only shown when TV mode is OFF */}
        {/* When TV mode is ON, show invisible placeholder to maintain layout */}
        {isTVMode ? (
          <div className="w-[350px] invisible" aria-hidden="true" />
        ) : (
          <CampaignScoreCard version="alpha-v1" />
        )}
      </div>
    </div>
  );
}
