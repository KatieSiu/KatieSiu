"use client";

import {
  AdNameCard,
  PartnershipAdCard,
  IdentityCard,
  TrackingCard,
  AdSetupCard,
  DestinationCard,
  AdSourcesCard,
  AdCreativeCard,
  LanguagesCard,
  AdPreviewCard,
  CampaignScoreCard,
} from "@/features/ctv/components/cards";

export function BeforeL1View() {
  // L1 cards are narrower (428px) compared to L2/L3 (600px)
  const cardClassName = "!w-[428px]";
  
  return (
    <div className="flex gap-6 p-3 justify-center min-w-fit">
      {/* Left column - Main cards (narrower for L1) */}
      <div className="flex flex-col gap-[10px]">
        <AdNameCard version="before" className={cardClassName} />
        <PartnershipAdCard version="before" className={cardClassName} />
        <IdentityCard version="before" className={cardClassName} />
        <TrackingCard version="before" className={cardClassName} />
        <AdSetupCard version="before" className={cardClassName} />
        <DestinationCard version="before" className={cardClassName} />
        <AdSourcesCard version="before" className={cardClassName} />
        <AdCreativeCard version="before" className={cardClassName} />
        <LanguagesCard version="before" className={cardClassName} />
      </div>

      {/* Right column - Sidebar (sticky with top padding) */}
      <div className="flex flex-col gap-[10px] sticky top-3 self-start">
        <CampaignScoreCard version="before" collapsed />
        <AdPreviewCard version="before" defaultCollapsed={false} />
      </div>
    </div>
  );
}
