"use client";

import Link from "next/link";
import { Text } from "@/features/ctv/components/ui/Text";
import { 
  CampaignNameCard, 
  CampaignDetailsCard, 
  AdvantageCatalogAdsCard, 
  BudgetCard, 
  ABTestCard, 
  AudienceSegmentReportingCard, 
  SpecialAdCategoriesCard, 
  AdSetNameCard, 
  ConversionSalesCard, 
  BudgetScheduleCard,
  AudienceCard,
  PlacementsCard,
  BrandSafetyCard,
  AdNameCard,
  PartnershipAdCard,
  IdentityCard,
  TrackingCard,
  AdSetupCard,
  DestinationCard,
  AdSourcesCard,
  AdCreativeCard,
  LanguagesCard,
  OpportunityScoreCard,
  AdPreviewCard,
  PreflightHubCard,
  CampaignScoreCard,
  AudienceDefinitionCard,
  EstimatedDailyResultsCard,
  AdvantageCampaignBudgetCard,
  AwarenessCard,
  AudienceControlsCard,
  AdvantagePlusAudienceCard,
  DynamicCreativeCard,
  AwarenessBudgetScheduleCard,
  AdTransparencyCard,
} from "@/features/ctv/components/cards";
import type { PrototypeVersion } from "@/features/ctv/components/cards";

// Card definitions for each table - matches what's in Before and Alpha prototypes
const SALES_L3_CARDS = [
  "Campaign Name",
  "Campaign Details",
  "Advantage+ Catalog Ads",
  "Budget",
  "A/B Test",
  "Audience Segment Reporting",
  "Special Ad Categories",
  "Campaign Score",
];

const SALES_L2_CARDS = [
  "Ad Set Name",
  "Conversion",
  "Budget & Schedule",
  "Audience",
  "Placements",
  "Brand Safety and Suitability",
  "Audience Definition",
  "Estimated Daily Results",
];

const SALES_L1_CARDS = [
  "Ad Name",
  "Partnership Ad",
  "Identity",
  "Tracking",
  "Ad Setup",
  "Destination",
  "Ad Sources",
  "Ad Creative",
  "Languages",
  "Preflight Hub",
  "Ad Preview",
];

const AWARENESS_L3_CARDS = [
  "Campaign Name",
  "Campaign Details",
  "A/B Test",
  "Advantage Campaign Budget",
  "Special Ad Categories",
];

const AWARENESS_L2_CARDS = [
  "Ad Set Name",
  "Awareness",
  "Dynamic Creative",
  "Awareness Budget & Schedule",
  "Audience Controls",
  "Advantage+ Audience",
  "Ad Transparency",
  "Placements",
  "Brand Safety and Suitability",
];

const AWARENESS_L1_CARDS = [
  "Ad Name",
  "Partnership Ad",
  "Identity",
  "Tracking",
  "Ad Setup",
  "Destination",
  "Ad Sources",
  "Ad Creative",
  "Languages",
  "Opportunity Score",
  "Ad Preview",
];

// Column configuration for the cards showcase
// Each column represents a different view: Before (baseline), TV Mode OFF, TV Mode ON
type ColumnConfig = {
  label: string;
  version: PrototypeVersion;
  isTVMode: boolean;
};

const COLUMNS: ColumnConfig[] = [
  { label: "Before", version: "before", isTVMode: false },
  { label: "TV Mode OFF", version: "alpha-v1", isTVMode: false },
  { label: "TV Mode ON", version: "alpha-v1", isTVMode: true },
];

// Architecture for future objectives - add card arrays as designs become available
type ObjectiveConfig = {
  L3: string[];
  L2: string[];
  L1: string[];
};

const OBJECTIVE_CONFIGS: Record<string, ObjectiveConfig> = {
  sales: { L3: SALES_L3_CARDS, L2: SALES_L2_CARDS, L1: SALES_L1_CARDS },
  awareness: { L3: AWARENESS_L3_CARDS, L2: AWARENESS_L2_CARDS, L1: AWARENESS_L1_CARDS },
  traffic: { L3: [], L2: [], L1: [] },
  engagement: { L3: [], L2: [], L1: [] },
  leads: { L3: [], L2: [], L1: [] },
  appPromotion: { L3: [], L2: [], L1: [] },
};

export default function CardsShowcase() {
  return (
    <main className="min-h-screen bg-[#F5F7F8]">
      {/* Header */}
      <header className="bg-white border-b border-[#E4E8EB] px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <Text variant="header1" color="primary">Cards Showcase</Text>
            <Text variant="valueDescription" color="description" className="mt-1">
              Compare card components across versions (Before, TV Mode OFF, TV Mode ON)
            </Text>
          </div>
          <Link 
            href="/"
            className="text-[14px] text-[#0A78BE] hover:underline"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="p-6 space-y-16">
        
        {/* ==================== SALES ==================== */}
        <div>
          <div className="mb-8">
            <Text variant="header1" color="primary" className="text-[24px]">
              Sales Objective
            </Text>
            <Text variant="valueDescription" color="description" className="mt-1">
              Cards for campaigns with Sales as the objective
            </Text>
          </div>

          {/* L3 - Sales (Campaign Level) */}
          <CardTable 
            title="L3 - Campaign Level"
            subtitle="8 cards"
            cards={SALES_L3_CARDS}
            level="L3"
          />

          {/* L2 - Sales (Ad Set Level) */}
          <CardTable 
            title="L2 - Ad Set Level"
            subtitle="8 cards"
            cards={SALES_L2_CARDS}
            level="L2"
          />

          {/* L1 - Sales (Ad Level) */}
          <CardTable 
            title="L1 - Ad Level"
            subtitle="11 cards"
            cards={SALES_L1_CARDS}
            level="L1"
          />
        </div>

        {/* ==================== AWARENESS ==================== */}
        <div>
          <div className="mb-8">
            <Text variant="header1" color="primary" className="text-[24px]">
              Awareness Objective
            </Text>
            <Text variant="valueDescription" color="description" className="mt-1">
              Cards for campaigns with Awareness as the objective
            </Text>
          </div>

          {/* L3 - Awareness (Campaign Level) */}
          <CardTable 
            title="L3 - Campaign Level"
            subtitle="6 cards"
            cards={AWARENESS_L3_CARDS}
            level="L3"
          />

          {/* L2 - Awareness (Ad Set Level) */}
          <CardTable 
            title="L2 - Ad Set Level"
            subtitle="8 cards"
            cards={AWARENESS_L2_CARDS}
            level="L2"
          />

          {/* L1 - Awareness (Ad Level) */}
          <CardTable 
            title="L1 - Ad Level"
            subtitle="10 cards"
            cards={AWARENESS_L1_CARDS}
            level="L1"
          />
        </div>

      </div>
    </main>
  );
}

// Card column width - matches Figma card width (600px) + padding
const CARD_COLUMN_WIDTH = 632;

// Table level type for determining placeholder behavior
type TableLevel = "L3" | "L2" | "L1";

// Reusable table component for displaying cards in a grid
function CardTable({ 
  title, 
  subtitle, 
  cards,
  level
}: { 
  title: string; 
  subtitle: string; 
  cards: string[];
  level: TableLevel;
}) {
  return (
    <section className="mb-12">
      {/* Table Header */}
      <div className="flex items-center gap-3 mb-4">
        <Text variant="header2" color="primary">{title}</Text>
        <span className="px-2 py-0.5 bg-[#E4E8EB] rounded text-[12px] text-[#5C6970]">
          {subtitle}
        </span>
      </div>

      {/* Scrollable Table Container */}
      <div className="overflow-x-auto">
        <div className="bg-white rounded-lg border border-[#E4E8EB] inline-block min-w-full">
          {/* Column Headers */}
          <div 
            className="grid border-b border-[#E4E8EB] bg-[#F5F7F8]"
            style={{ gridTemplateColumns: `200px repeat(${COLUMNS.length}, ${CARD_COLUMN_WIDTH}px)` }}
          >
            <div className="px-4 py-3 font-medium text-[12px] text-[#5C6970] uppercase tracking-wide">
              Card Name
            </div>
            {COLUMNS.map((column, idx) => (
              <div 
                key={`${column.label}-${idx}`} 
                className="px-4 py-3 font-medium text-[12px] text-[#5C6970] uppercase tracking-wide border-l border-[#E4E8EB]"
              >
                {column.label}
              </div>
            ))}
          </div>

          {/* Card Rows */}
          {cards.map((cardName, index) => (
            <div 
              key={cardName}
              className={`grid ${
                index !== cards.length - 1 ? 'border-b border-[#E4E8EB]' : ''
              }`}
              style={{ gridTemplateColumns: `200px repeat(${COLUMNS.length}, ${CARD_COLUMN_WIDTH}px)` }}
            >
              {/* Card Name Column */}
              <div className="px-4 py-4 flex items-center bg-[#FAFBFC] sticky left-0 z-[1]">
                <Text variant="label" color="primary" className="text-[13px]">
                  {cardName}
                </Text>
              </div>

              {/* Version Columns */}
              {COLUMNS.map((column, idx) => (
                <div 
                  key={`${cardName}-${column.label}-${idx}`} 
                  className="px-4 py-4 border-l border-[#E4E8EB]"
                >
                  <CardCell cardName={cardName} version={column.version} level={level} isTVMode={column.isTVMode} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Renders the appropriate card component or a placeholder
function CardCell({ cardName, version, level, isTVMode = false }: { cardName: string; version: PrototypeVersion; level: TableLevel; isTVMode?: boolean }) {
  // Map card names to their components
  // Cards are shown for both Before and Alpha unless they differ between versions
  switch (cardName) {
    // L3 Cards (Campaign Level)
    case "Campaign Name":
      if (version === "before" || version === "alpha-v1") {
        return <CampaignNameCard version={version} />;
      }
      return <CardPlaceholder cardName={cardName} version={version} isTVMode={isTVMode} />;
    case "Campaign Details":
      if (version === "before" || version === "alpha-v1") {
        return <CampaignDetailsCard version={version} />;
      }
      return <CardPlaceholder cardName={cardName} version={version} isTVMode={isTVMode} />;
    case "Advantage+ Catalog Ads":
      if (version === "before" || version === "alpha-v1") {
        return <AdvantageCatalogAdsCard version={version} />;
      }
      return <CardPlaceholder cardName={cardName} version={version} isTVMode={isTVMode} />;
    case "Budget":
      if (version === "before" || version === "alpha-v1") {
        return <BudgetCard version={version} />;
      }
      return <CardPlaceholder cardName={cardName} version={version} isTVMode={isTVMode} />;
    case "A/B Test":
      if (version === "before" || version === "alpha-v1") {
        return <ABTestCard version={version} />;
      }
      return <CardPlaceholder cardName={cardName} version={version} isTVMode={isTVMode} />;
    case "Audience Segment Reporting":
      if (version === "before" || version === "alpha-v1") {
        return <AudienceSegmentReportingCard version={version} />;
      }
      return <CardPlaceholder cardName={cardName} version={version} isTVMode={isTVMode} />;
    case "Special Ad Categories":
      if (version === "before" || version === "alpha-v1") {
        return <SpecialAdCategoriesCard version={version} />;
      }
      return <CardPlaceholder cardName={cardName} version={version} isTVMode={isTVMode} />;
    case "Campaign Score":
      if (version === "before" || version === "alpha-v1") {
        return <CampaignScoreCard version={version} isTVMode={isTVMode} />;
      }
      return <CardPlaceholder cardName={cardName} version={version} isTVMode={isTVMode} />;

    // L2 Cards (Ad Set Level)
    case "Ad Set Name":
      if (version === "before" || version === "alpha-v1") {
        return <AdSetNameCard version={version} />;
      }
      return <CardPlaceholder cardName={cardName} version={version} isTVMode={isTVMode} />;
    case "Conversion":
      if (version === "before" || version === "alpha-v1") {
        return <ConversionSalesCard version={version} isTVMode={isTVMode} />;
      }
      return <CardPlaceholder cardName={cardName} version={version} isTVMode={isTVMode} />;
    case "Budget & Schedule":
      if (version === "before" || version === "alpha-v1") {
        // For showcase: TV Mode OFF shows Campaign Budget state, TV Mode ON shows Ad Set Budget state
        return <BudgetScheduleCard 
          version={version} 
          isTVMode={isTVMode}
          isAdvantageBudgetOn={!isTVMode} // Campaign Budget when TV OFF, Ad Set Budget when TV ON
          budgetValue="$20.00"
        />;
      }
      return <CardPlaceholder cardName={cardName} version={version} isTVMode={isTVMode} />;
    case "Audience":
      if (version === "before" || version === "alpha-v1") {
        return <AudienceCard version={version} />;
      }
      return <CardPlaceholder cardName={cardName} version={version} isTVMode={isTVMode} />;
    case "Placements":
      if (version === "before" || version === "alpha-v1") {
        return <PlacementsCard version={version} isTVMode={isTVMode} />;
      }
      return <CardPlaceholder cardName={cardName} version={version} isTVMode={isTVMode} />;
    case "Brand Safety and Suitability":
      if (version === "before" || version === "alpha-v1") {
        return <BrandSafetyCard version={version} isTVMode={isTVMode} />;
      }
      return <CardPlaceholder cardName={cardName} version={version} isTVMode={isTVMode} />;
    case "Audience Definition":
      if (version === "before" || version === "alpha-v1") {
        return <AudienceDefinitionCard version={version} />;
      }
      return <CardPlaceholder cardName={cardName} version={version} isTVMode={isTVMode} />;
    case "Estimated Daily Results":
      if (version === "before" || version === "alpha-v1") {
        return <EstimatedDailyResultsCard version={version} />;
      }
      return <CardPlaceholder cardName={cardName} version={version} isTVMode={isTVMode} />;

    // L1 Cards (Ad Level)
    case "Ad Name":
      if (version === "before" || version === "alpha-v1") {
        return <AdNameCard version={version} />;
      }
      return <CardPlaceholder cardName={cardName} version={version} isTVMode={isTVMode} />;
    case "Partnership Ad":
      if (version === "before" || version === "alpha-v1") {
        return <PartnershipAdCard version={version} />;
      }
      return <CardPlaceholder cardName={cardName} version={version} isTVMode={isTVMode} />;
    case "Identity":
      if (version === "before" || version === "alpha-v1") {
        return <IdentityCard version={version} />;
      }
      return <CardPlaceholder cardName={cardName} version={version} isTVMode={isTVMode} />;
    case "Tracking":
      if (version === "before" || version === "alpha-v1") {
        return <TrackingCard version={version} />;
      }
      return <CardPlaceholder cardName={cardName} version={version} isTVMode={isTVMode} />;
    case "Ad Setup":
      if (version === "before" || version === "alpha-v1") {
        return <AdSetupCard version={version} />;
      }
      return <CardPlaceholder cardName={cardName} version={version} isTVMode={isTVMode} />;
    case "Destination":
      if (version === "before" || version === "alpha-v1") {
        return <DestinationCard version={version} />;
      }
      return <CardPlaceholder cardName={cardName} version={version} isTVMode={isTVMode} />;
    case "Ad Sources":
      if (version === "before" || version === "alpha-v1") {
        return <AdSourcesCard version={version} />;
      }
      return <CardPlaceholder cardName={cardName} version={version} isTVMode={isTVMode} />;
    case "Ad Creative":
      if (version === "before" || version === "alpha-v1") {
        return <AdCreativeCard version={version} />;
      }
      return <CardPlaceholder cardName={cardName} version={version} isTVMode={isTVMode} />;
    case "Languages":
      if (version === "before" || version === "alpha-v1") {
        return <LanguagesCard version={version} />;
      }
      return <CardPlaceholder cardName={cardName} version={version} isTVMode={isTVMode} />;
    case "Preflight Hub":
      if (version === "before" || version === "alpha-v1") {
        return <PreflightHubCard version={version} />;
      }
      return <CardPlaceholder cardName={cardName} version={version} isTVMode={isTVMode} />;
    case "Ad Preview":
      if (version === "before" || version === "alpha-v1") {
        return <AdPreviewCard version={version} isTVMode={isTVMode} />;
      }
      return <CardPlaceholder cardName={cardName} version={version} isTVMode={isTVMode} />;

    // Awareness-specific L3 Cards
    case "Advantage Campaign Budget":
      if (version === "alpha-v1") {
        return <AdvantageCampaignBudgetCard version={version} />;
      }
      return <CardPlaceholder cardName={cardName} version={version} isTVMode={isTVMode} />;

    // Awareness-specific L2 Cards
    case "Awareness":
      if (version === "alpha-v1") {
        return <AwarenessCard version={version} />;
      }
      return <CardPlaceholder cardName={cardName} version={version} isTVMode={isTVMode} />;
    case "Dynamic Creative":
      if (version === "alpha-v1") {
        return <DynamicCreativeCard version={version} />;
      }
      return <CardPlaceholder cardName={cardName} version={version} isTVMode={isTVMode} />;
    case "Awareness Budget & Schedule":
      if (version === "alpha-v1") {
        return <AwarenessBudgetScheduleCard version={version} />;
      }
      return <CardPlaceholder cardName={cardName} version={version} isTVMode={isTVMode} />;
    case "Audience Controls":
      if (version === "alpha-v1") {
        return <AudienceControlsCard version={version} />;
      }
      return <CardPlaceholder cardName={cardName} version={version} isTVMode={isTVMode} />;
    case "Advantage+ Audience":
      if (version === "alpha-v1") {
        return <AdvantagePlusAudienceCard version={version} />;
      }
      return <CardPlaceholder cardName={cardName} version={version} isTVMode={isTVMode} />;
    case "Ad Transparency":
      if (version === "alpha-v1") {
        return <AdTransparencyCard version={version} />;
      }
      return <CardPlaceholder cardName={cardName} version={version} isTVMode={isTVMode} />;

    // Awareness-specific L1 Cards
    case "Opportunity Score":
      if (version === "before" || version === "alpha-v1") {
        return <OpportunityScoreCard version={version} />;
      }
      return <CardPlaceholder cardName={cardName} version={version} isTVMode={isTVMode} />;

    default:
      return <CardPlaceholder cardName={cardName} version={version} isTVMode={isTVMode} />;
  }
}

// Placeholder types
type PlaceholderType = "default" | "na" | "coming-soon";

// Placeholder component for cards not yet built
function CardPlaceholder({ cardName, version, type = "default", isTVMode = false }: { cardName: string; version: PrototypeVersion; type?: PlaceholderType; isTVMode?: boolean }) {
  // Determine the display label based on version and TV mode
  const getDisplayLabel = () => {
    if (version === "before") return "Before";
    if (version === "alpha-v1") {
      return isTVMode ? "TV Mode ON" : "TV Mode OFF";
    }
    return version;
  };
  
  const displayLabel = getDisplayLabel();
  
  // N/A placeholder - simple gray box
  if (type === "na") {
    return (
      <div className="bg-[#F5F7F8] rounded-lg border border-[#E4E8EB] p-4 w-[600px] min-h-[80px] flex items-center justify-center">
        <Text variant="value" color="disabled" className="text-center text-[14px]">
          N/A
        </Text>
      </div>
    );
  }
  
  // Coming soon placeholder
  if (type === "coming-soon") {
    return (
      <div className="bg-[#F5F7F8] rounded-lg border border-[#E4E8EB] p-4 w-[600px] min-h-[80px] flex items-center justify-center">
        <Text variant="value" color="disabled" className="text-center text-[14px]">
          Coming soon
        </Text>
      </div>
    );
  }
  
  // Default placeholder - clickable with "Add Figma link"
  return (
    <div className="bg-[#F5F7F8] rounded-lg border border-dashed border-[#CBD2D9] p-4 w-[600px] min-h-[120px] flex flex-col items-center justify-center hover:border-[#0A78BE] hover:bg-[#F8FAFC] transition-colors cursor-pointer">
      <span className={`text-[11px] font-medium px-2 py-0.5 rounded mb-2 ${
        isTVMode ? "text-[#006B4E] bg-[#EBF2E6]" : "text-[#0A78BE] bg-[#E8F4FC]"
      }`}>
        {displayLabel}
      </span>
      <Text variant="value" color="disabled" className="text-center text-[12px]">
        Add Figma link
      </Text>
    </div>
  );
}
