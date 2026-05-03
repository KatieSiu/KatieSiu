"use client";

import { Button } from "@/features/campaign-planner/components/ui/Button";
import { Icon } from "@/features/campaign-planner/components/ui/Icon";
import { CreatePlanModalPreview } from "@/features/campaign-planner/components/ui/CreatePlanModal";
import { EditScheduleModalPreview } from "@/features/campaign-planner/components/ui/EditScheduleModal";
import { EditFrequencyModalPreview } from "@/features/campaign-planner/components/ui/EditFrequencyModal";
import { EditAdSetModalPreview } from "@/features/campaign-planner/components/ui/EditAdSetModal";
import { EditAdSetModal2Preview } from "@/features/campaign-planner/components/ui/EditAdSetModal2";
import { EditFormatPlacementsModalPreview } from "@/features/campaign-planner/components/ui/EditFormatPlacementsModal";
import { EditAudienceModalPreview } from "@/features/campaign-planner/components/ui/EditAudienceModal";
import { BookInAdsManagerModalPreview } from "@/features/campaign-planner/components/ui/BookInAdsManagerModal";

// ============================================
// Delete Confirmation Modal Preview (Inline)
// ============================================
// Renders modal content directly without portal/overlay for gallery view
// Matches the exact styling from components/ui/Modal.tsx
function DeleteConfirmationModalPreview({ itemCount }: { itemCount: number }) {
  const isSingle = itemCount === 1;
  const title = isSingle
    ? "Do you want to delete the campaign?"
    : `Do you want to delete ${itemCount} campaigns?`;
  const bodyText = isSingle
    ? "If you delete this campaign, you won't be able to recover it later."
    : "If you delete these campaigns, you won't be able to recover them later.";

  return (
    <div className="w-[400px] bg-white rounded-[4px] shadow-[0px_8px_24px_4px_rgba(0,0,0,0.1),0px_2px_2px_0px_rgba(0,0,0,0.1)] overflow-clip">
      {/* Header - matches Modal.Header */}
      <div className="flex items-start justify-between pl-4 pr-1 py-0 bg-white shrink-0">
        <div className="flex-1 flex flex-col justify-center py-4 pr-2 min-w-0">
          <h2 className="text-[16px] font-bold leading-[20px] text-[#1C2B33] font-optimistic">
            {title}
          </h2>
        </div>
        <div className="flex items-start gap-2 py-2 pr-1">
          <button className="p-2 hover:bg-[rgba(0,0,0,0.05)] rounded-[4px] transition-colors">
            <Icon name="Close" variant="outlined" size={16} className="text-[#283943]" />
          </button>
        </div>
      </div>

      {/* Body - matches Modal.Body */}
      <div className="px-4 pt-0 pb-2">
        <div className="text-[14px] font-normal leading-[20px] text-[#1C2B33] font-optimistic">
          {bodyText}
        </div>
      </div>

      {/* Footer - matches Modal.Footer */}
      <div className="flex items-center justify-end gap-2 px-4 pt-3 pb-4 shrink-0">
        <Button variant="secondary">Cancel</Button>
        <Button variant="primary">Delete</Button>
      </div>
    </div>
  );
}

export default function ModalsPage() {
  return (
    <main className="min-h-screen bg-[#F5F7F8] p-12">
      <header className="mb-12">
        <h1 className="text-3xl font-bold text-[#1C2B33]">Modal Gallery</h1>
        <p className="mt-2 text-[#5C6970]">
          A collection of modal designs for the Campaign Planner prototype.
        </p>
      </header>

      {/* Create Modal Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-[#1C2B33] mb-6 pb-2 border-b border-[#E4E8EB]">
          Create Modal
        </h2>
        <p className="text-[#5C6970] mb-6">
          Modal for creating a new campaign plan with setup, campaign details, schedule, audience, and advanced settings.
        </p>
        
        <div className="flex justify-center">
          <CreatePlanModalPreview />
        </div>
      </section>

      {/* Edit Schedule Modal Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-[#1C2B33] mb-6 pb-2 border-b border-[#E4E8EB]">
          Edit Schedule Modal
        </h2>
        <p className="text-[#5C6970] mb-6">
          Compact modal for editing campaign start and end dates/times. Includes validation for future dates and end-after-start logic.
        </p>
        
        <div className="flex justify-center">
          <EditScheduleModalPreview />
        </div>
      </section>

      {/* Edit Frequency Modal Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-[#1C2B33] mb-6 pb-2 border-b border-[#E4E8EB]">
          Edit Frequency Modal
        </h2>
        <p className="text-[#5C6970] mb-6">
          Modal for configuring ad frequency settings. Users can choose between Target (average) or Cap (maximum) frequency, and set the number of impressions per time period.
        </p>
        
        <div className="flex justify-center">
          <EditFrequencyModalPreview />
        </div>
      </section>

      {/* Edit Ad Set Modal Section (Legacy) */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-[#1C2B33] mb-6 pb-2 border-b border-[#E4E8EB]">
          Edit Ad Set Modal (Legacy)
        </h2>
        <p className="text-[#5C6970] mb-6">
          Legacy modal for viewing and editing ad set details. Contains editable fields (Name, Performance goal) and read-only summary fields (Audience, Schedule, Frequency, Format & Placements).
        </p>
        
        <div className="flex justify-center">
          <EditAdSetModalPreview />
        </div>
      </section>

      {/* Edit Ad Set Modal Section (New - with Collapsible Cards) */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-[#1C2B33] mb-6 pb-2 border-b border-[#E4E8EB]">
          Edit Ad Set Modal
        </h2>
        <p className="text-[#5C6970] mb-6">
          Modal for editing ad set details with collapsible card sections. Overview section is expanded by default with Ad set name, Budget (with comma formatting and validation), and Performance goal. Schedule, Audience, Frequency, and Format & placements sections are collapsed by default.
        </p>
        
        <div className="flex justify-center">
          <EditAdSetModal2Preview />
        </div>
      </section>

      {/* Edit Format & Placements Modal Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-[#1C2B33] mb-6 pb-2 border-b border-[#E4E8EB]">
          Edit Format & Placements Modal
        </h2>
        <p className="text-[#5C6970] mb-6">
          Comprehensive modal for configuring ad format and placement settings. Includes placement type selection (Advantage+ or Manual), device targeting, placement checkboxes, and brand safety controls.
        </p>
        
        <div className="flex justify-center">
          <EditFormatPlacementsModalPreview />
        </div>
      </section>

      {/* Edit Audience Modal Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-[#1C2B33] mb-6 pb-2 border-b border-[#E4E8EB]">
          Edit Audience Modal
        </h2>
        <p className="text-[#5C6970] mb-6">
          Comprehensive modal for configuring audience targeting settings. Includes location targeting, age range, gender selection, languages, detailed targeting, and custom audiences.
        </p>
        
        <div className="flex justify-center">
          <EditAudienceModalPreview />
        </div>
      </section>

      {/* Book in Ads Manager Modal Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-[#1C2B33] mb-6 pb-2 border-b border-[#E4E8EB]">
          Book in Ads Manager Modal
        </h2>
        <p className="text-[#5C6970] mb-6">
          Confirmation modal shown before booking a campaign in Ads Manager. Displays campaign summary including name, budget, impressions, CPM, schedule, and last refreshed date. The refresh button updates the "Last refreshed" date to today.
        </p>
        
        <div className="flex justify-center">
          <BookInAdsManagerModalPreview />
        </div>
      </section>

      {/* Delete Confirmation Modal Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-[#1C2B33] mb-6 pb-2 border-b border-[#E4E8EB]">
          Delete Confirmation Modal
        </h2>
        <p className="text-[#5C6970] mb-6">
          Confirmation modal shown when a user attempts to delete one or more campaigns.
        </p>
        
        <div className="flex justify-center">
          <DeleteConfirmationModalPreview itemCount={1} />
        </div>

        {/* Multiple items variant */}
        <p className="text-[#5C6970] mb-6 mt-8">
          Variant: Multiple campaigns selected (3 items)
        </p>
        <div className="flex justify-center">
          <DeleteConfirmationModalPreview itemCount={3} />
        </div>
      </section>
    </main>
  );
}
