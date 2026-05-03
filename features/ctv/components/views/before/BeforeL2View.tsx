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
} from "@/features/ctv/components/cards";

export function BeforeL2View() {
  return (
    <div className="flex gap-6 p-3 justify-center min-w-fit">
      {/* Left column - Main cards */}
      <div className="flex flex-col gap-[10px]">
        <AdSetNameCard version="before" />
        <ConversionSalesCard version="before" />
        <BudgetScheduleCard version="before" />
        <AudienceCard version="before" />
        <PlacementsCard version="before" />
        <BrandSafetyCard version="before" />
      </div>

      {/* Right column - Sidebar (sticky with top padding) */}
      <div className="flex flex-col gap-[10px] sticky top-3 self-start">
        <AudienceDefinitionCard version="before" />
        <EstimatedDailyResultsCard version="before" />
      </div>
    </div>
  );
}
