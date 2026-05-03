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

export function BeforeL3View() {
  return (
    <div className="flex gap-6 p-3 justify-center min-w-fit">
      {/* Left column - Main cards */}
      <div className="flex flex-col gap-[10px]">
        <CampaignNameCard version="before" />
        <CampaignDetailsCard version="before" />
        <AdvantageCatalogAdsCard version="before" />
        <BudgetCard version="before" />
        <ABTestCard version="before" />
        <AudienceSegmentReportingCard version="before" />
        <SpecialAdCategoriesCard version="before" />
      </div>

      {/* Right column - Sidebar (sticky with top padding) */}
      <div className="flex flex-col gap-[10px] sticky top-3 self-start">
        <CampaignScoreCard version="before" />
      </div>
    </div>
  );
}
