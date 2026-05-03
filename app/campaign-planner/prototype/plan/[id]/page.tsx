"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { SideNavigation } from "@/features/campaign-planner/components/ui/SideNavigation";
import { EditScheduleModal } from "@/features/campaign-planner/components/ui/EditScheduleModal";
import { EditFrequencyModal } from "@/features/campaign-planner/components/ui/EditFrequencyModal";
import { EditAudienceModal } from "@/features/campaign-planner/components/ui/EditAudienceModal";
import { EditAdSetModal2 } from "@/features/campaign-planner/components/ui/EditAdSetModal2";
import { DeleteConfirmationModal } from "@/features/campaign-planner/components/ui/DeleteConfirmationModal";
import { DuplicatePlanModal } from "@/features/campaign-planner/components/ui/DuplicatePlanModal";
import { EditNameDescriptionModal } from "@/features/campaign-planner/components/ui/EditNameDescriptionModal";
import { BookInAdsManagerModal } from "@/features/campaign-planner/components/ui/BookInAdsManagerModal";
import { usePlans } from "@/features/campaign-planner/lib/plan-context";
import { CampaignPlan, DEFAULT_AUDIENCE_SIZE, generateAdSetData, AdSetData, formatCurrency, formatCurrencyWithDecimals, formatNumber, formatDate } from "@/features/campaign-planner/lib/mock-data";
import { colors } from "@/features/campaign-planner/lib/design-tokens";

// Import extracted components
import {
  PlanPageHeader,
  PlanNotFound,
  QuickActionBar,
  ChartsSection,
  AdSetsTable,
  AdSet,
  ChartAdSet,
  ModalState,
} from "@/features/campaign-planner/components/plan-details";

// ============================================
// Date/Time Conversion Utilities
// ============================================
const MONTH_ABBR = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Convert Date object to display string (e.g., "Jan 15, 2024") */
function dateToDisplayString(date: Date): string {
  return `${MONTH_ABBR[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

/** Parse display string back to Date object */
function displayStringToDate(dateStr: string): Date {
  const match = dateStr.match(/^([A-Za-z]{3})\s+(\d{1,2}),?\s*(\d{4})$/);
  if (match) {
    const monthIndex = MONTH_ABBR.findIndex(m => m.toLowerCase() === match[1].toLowerCase());
    if (monthIndex !== -1) {
      return new Date(parseInt(match[3]), monthIndex, parseInt(match[2]));
    }
  }
  return new Date();
}

/** Convert time string like "12:00 AM PST" to "12:00 AM" format for modal */
function normalizeTimeForModal(timeStr: string): string {
  return timeStr.replace(/\s*(PST|EST|UTC)$/i, '').trim();
}

/** Convert schedule from plan format to modal format */
function planScheduleToModalFormat(schedule: CampaignPlan['schedule']) {
  return {
    startDate: dateToDisplayString(schedule.startDate),
    startTime: normalizeTimeForModal(schedule.startTime),
    endDate: dateToDisplayString(schedule.endDate),
    endTime: normalizeTimeForModal(schedule.endTime),
  };
}

/** Convert modal schedule format back to plan format */
function modalScheduleToPlanFormat(modalSchedule: {
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
}) {
  return {
    startDate: displayStringToDate(modalSchedule.startDate),
    startTime: modalSchedule.startTime,
    endDate: displayStringToDate(modalSchedule.endDate),
    endTime: modalSchedule.endTime,
  };
}

// ============================================
// Main Plan Details Page Component
// ============================================
export default function PlanDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { getPlanById, updatePlan, deletePlan, duplicatePlan } = usePlans();
  const [isReady, setIsReady] = useState(false);

  const planId = params.id as string;
  const plan = getPlanById(planId);

  // ============================================
  // Ad Sets State (lifted from AdSetsTable for chart sync)
  // Initialize from plan.adSetData for consistency with All Plans table
  // ============================================
  const [adSets, setAdSets] = useState<AdSet[]>(() => {
    if (!plan) return [];
    // Use existing ad set data from plan, or generate if not available
    const adSetData = plan.adSetData || generateAdSetData(plan);
    return adSetData as AdSet[];
  });
  const [adSetCounter, setAdSetCounter] = useState(() => {
    if (!plan) return 1;
    const adSetData = plan.adSetData || [];
    return adSetData.length > 0 ? adSetData.length : 1;
  });

  // ============================================
  // Modal State Management
  // ============================================
  const [activeModal, setActiveModal] = useState<ModalState>({ type: null });
  
  // Callbacks stored for modal save/confirm actions
  const [adSetSaveCallback, setAdSetSaveCallback] = useState<((updates: Partial<AdSet>) => void) | null>(null);
  const [deleteAdSetCallback, setDeleteAdSetCallback] = useState<(() => void) | null>(null);
  const [audienceSaveCallback, setAudienceSaveCallback] = useState<((updates: Partial<AdSet>) => void) | null>(null);

  // Wait for client-side hydration
  useEffect(() => {
    setIsReady(true);
  }, []);

  // Sync ad set changes back to plan context
  // This ensures the All Plans expanded row shows the same data
  useEffect(() => {
    if (!plan || !isReady) return;
    // Convert AdSet[] to AdSetData[] and update plan
    updatePlan(planId, { adSetData: adSets as AdSetData[] });
  }, [adSets, planId, isReady]); // eslint-disable-line react-hooks/exhaustive-deps

  // Convert AdSet[] to ChartAdSet[] for charts
  const chartAdSets: ChartAdSet[] = adSets.map(as => ({
    id: as.id,
    name: as.name,
    budget: as.budget,
    reach: as.reach,
    impressions: as.impressions,
  }));

  // ============================================
  // Modal Open Handlers
  // ============================================
  const openScheduleModal = () => setActiveModal({ type: 'schedule' });
  const openFrequencyModal = () => setActiveModal({ type: 'frequency' });
  const openAudienceModal = () => setActiveModal({ type: 'audience' });
  const openEditSettingsModal = () => setActiveModal({ type: 'editAdSet', data: { isPlanSettings: true } });
  const openDeletePlanModal = () => setActiveModal({ type: 'deletePlan' });
  const openDuplicatePlanModal = () => setActiveModal({ type: 'duplicatePlan' });
  const openEditNameDescriptionModal = () => setActiveModal({ type: 'editNameDescription' });
  const openBookInAdsManagerModal = () => setActiveModal({ type: 'bookInAdsManager' });
  
  const openEditAdSetModal = (adSet: AdSet, onSave: (updates: Partial<AdSet>) => void) => {
    setAdSetSaveCallback(() => onSave);
    setActiveModal({ type: 'editAdSet', data: { adSet } });
  };
  
  const openDeleteAdSetModal = (adSetId: string, onConfirm: () => void) => {
    setDeleteAdSetCallback(() => onConfirm);
    setActiveModal({ type: 'deleteAdSet', data: { adSetId } });
  };
  
  const openEditAdSetAudienceModal = (adSet: AdSet, onSave: (updates: Partial<AdSet>) => void) => {
    setAudienceSaveCallback(() => onSave);
    setActiveModal({ type: 'editAdSetAudience', data: { adSet } });
  };
  
  const closeModal = () => {
    setActiveModal({ type: null });
    setAdSetSaveCallback(null);
    setDeleteAdSetCallback(null);
    setAudienceSaveCallback(null);
  };

  // ============================================
  // Modal Save Handlers
  // ============================================
  const handleSaveSchedule = (schedule: {
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
  }) => {
    if (!plan) return;
    const planSchedule = modalScheduleToPlanFormat(schedule);
    updatePlan(planId, { schedule: planSchedule });
    closeModal();
  };

  const handleSaveFrequency = (frequency: {
    type: "target" | "cap";
    count: number;
    days: number;
  }) => {
    if (!plan) return;
    updatePlan(planId, { frequency: frequency.count });
    closeModal();
  };

  const handleSaveAudience = (audience: {
    locations: { id: string; name: string; radius?: string }[];
    ageMin: string;
    ageMax: string;
    gender: 'all' | 'men' | 'women';
    languages: string;
    detailedTargeting: string;
    customAudiences: string;
  }) => {
    if (!plan) return;
    const locationNames = audience.locations.map(loc => loc.name);
    updatePlan(planId, { 
      audienceLocations: locationNames,
      audienceAgeRange: { min: parseInt(audience.ageMin) || 18, max: parseInt(audience.ageMax) || 65 },
      audienceGender: audience.gender === 'men' ? 'male' : audience.gender === 'women' ? 'female' : 'all',
    });
    closeModal();
  };

  const handleSaveAdSetAudience = (audience: {
    locations: { id: string; name: string; radius?: string }[];
    ageMin: string;
    ageMax: string;
    gender: 'all' | 'men' | 'women';
    languages: string;
    detailedTargeting: string;
    customAudiences: string;
  }) => {
    if (!audienceSaveCallback) return;
    
    // Build the audience summary string from the data
    const locationSummary = audience.locations.length > 0 
      ? audience.locations[0].name 
      : 'United States';
    const ageRange = `${audience.ageMin}-${audience.ageMax}`;
    const audienceSummary = `${locationSummary}, ${ageRange}`;
    
    // Update the ad set with the new audience data
    audienceSaveCallback({
      audience: audienceSummary,
      audienceLocations: audience.locations,
      audienceAgeMin: audience.ageMin,
      audienceAgeMax: audience.ageMax,
      audienceGender: audience.gender,
    });
    closeModal();
  };

  const handleSaveAdSet = (adSetData: any) => {
    if (!plan) return;
    
    if (activeModal.data?.isPlanSettings) {
      if (adSetData.name !== plan.name) {
        updatePlan(planId, { name: adSetData.name });
      }
    } else if (activeModal.data?.adSet && adSetSaveCallback) {
      // The modal now returns partial table format data
      // Pass all the updates from the modal to the save callback
      adSetSaveCallback({
        name: adSetData.name,
        performanceGoal: adSetData.performanceGoal,
        audience: adSetData.audience,
        schedule: adSetData.schedule,
        scheduleStartDate: adSetData.scheduleStartDate,
        scheduleEndDate: adSetData.scheduleEndDate,
        numWeeks: adSetData.numWeeks,
        frequencyCap: adSetData.frequencyCap,
        placements: adSetData.placements,
      });
    }
    closeModal();
  };

  const handleConfirmDeletePlan = () => {
    deletePlan(planId);
    router.push("/campaign-planner/prototype");
  };

  const handleConfirmDeleteAdSet = () => {
    if (deleteAdSetCallback) {
      deleteAdSetCallback();
    }
    closeModal();
  };

  const handleDuplicatePlan = (newName: string) => {
    const newPlanId = duplicatePlan(planId, newName);
    if (newPlanId) {
      router.push(`/campaign-planner/prototype/plan/${newPlanId}`);
    }
  };

  const handleSaveNameDescription = (name: string, description: string) => {
    handleUpdatePlan({ name, description });
  };

  // ============================================
  // Navigation & Plan Updates
  // ============================================
  const handleBack = () => {
    router.push("/campaign-planner/prototype");
  };

  const handleUpdatePlan = (updates: Partial<CampaignPlan>) => {
    updatePlan(planId, updates);
  };

  // ============================================
  // Prepare Modal Data
  // ============================================
  const getScheduleModalData = () => {
    if (!plan) return undefined;
    return planScheduleToModalFormat(plan.schedule);
  };

  const getFrequencyModalData = () => {
    if (!plan) return undefined;
    return {
      type: "cap" as const,
      count: Math.round(plan.frequency),
      days: 7,
    };
  };

  const getAdSetModalData = () => {
    if (!plan) return undefined;
    
    if (activeModal.data?.isPlanSettings) {
      const scheduleStr = `${dateToDisplayString(plan.schedule.startDate)} • ${plan.schedule.startTime} - ${dateToDisplayString(plan.schedule.endDate)} • ${plan.schedule.endTime}`;
      return {
        name: plan.name,
        performanceGoal: "maximize-reach",
        audience: "United States, 18-65+",
        schedule: scheduleStr,
        frequency: {
          type: "Cap",
          description: `${Math.round(plan.frequency)} times every 7 days`,
        },
        formatPlacements: {
          format: "Image or carousel",
          placements: "Facebook, Instagram, Audience Network",
        },
      };
    } else if (activeModal.data?.adSet) {
      // Pass the full table AdSet data - the modal will convert it internally
      return activeModal.data.adSet;
    }
    return undefined;
  };

  // Data mapper for EditAdSetModal2
  const getAdSetModal2Data = () => {
    if (!plan) return undefined;
    
    if (activeModal.data?.isPlanSettings) {
      return {
        adSetName: plan.name,
        budget: String(plan.budget),
        performanceGoal: "Maximize reach of ads",
      };
    } else if (activeModal.data?.adSet) {
      const adSet = activeModal.data.adSet;
      // Map performance goal from table format to modal format
      const performanceGoalMap: Record<string, string> = {
        'Reach': 'Maximize reach of ads',
        'reach': 'Maximize reach of ads',
        'Thruplay': 'Maximize ThruPlay views',
        'thruplay': 'Maximize ThruPlay views',
        'Impressions': 'Maximize number of impressions',
        'impressions': 'Maximize number of impressions',
      };
      return {
        adSetName: adSet.name,
        budget: String(adSet.budget),
        performanceGoal: performanceGoalMap[adSet.performanceGoal] || 'Maximize reach of ads',
      };
    }
    return undefined;
  };

  // Save handler for EditAdSetModal2
  const handleSaveAdSet2 = (adSetData: any) => {
    if (!plan) return;
    
    if (activeModal.data?.isPlanSettings) {
      if (adSetData.adSetName !== plan.name) {
        updatePlan(planId, { name: adSetData.adSetName });
      }
    } else if (activeModal.data?.adSet && adSetSaveCallback) {
      // Map performance goal back to table format
      const performanceGoalReverseMap: Record<string, string> = {
        'Maximize reach of ads': 'Reach',
        'Maximize ThruPlay views': 'Thruplay',
        'Maximize number of impressions': 'Impressions',
      };
      
      // Parse budget string to number
      const budgetStr = adSetData.budget?.replace(/,/g, '') || '0';
      const budgetNum = parseFloat(budgetStr);
      
      adSetSaveCallback({
        name: adSetData.adSetName,
        budget: isNaN(budgetNum) ? undefined : budgetNum,
        performanceGoal: performanceGoalReverseMap[adSetData.performanceGoal] || adSetData.performanceGoal,
      });
    }
    closeModal();
  };

  // ============================================
  // Loading State
  // ============================================
  if (!isReady) {
    return (
      <div className="flex h-screen w-full overflow-hidden">
        <SideNavigation />
        <main 
          className="flex-1 flex items-center justify-center"
          style={{
            background: `
              radial-gradient(ellipse at 95% 105%, rgba(224,245,232,0.85) 0%, rgba(224,245,232,0) 45%),
              radial-gradient(ellipse at -20% 10%, rgba(250,235,235,1) 0%, rgba(240,230,245,1) 20%, rgba(220,236,252,1) 40%, rgba(235,241,248,1) 70%),
              linear-gradient(to right, rgba(241,244,250,1) 0%, rgba(245,248,252,1) 100%)
            `,
          }}
        >
          <div 
            className="text-[14px] font-optimistic"
            style={{ color: colors.text.disabled }}
          >
            Loading...
          </div>
        </main>
      </div>
    );
  }

  // ============================================
  // Main Render
  // ============================================
  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Side Navigation */}
      <SideNavigation />

      {/* Main Content */}
      <main 
        className="flex-1 overflow-y-auto px-6 py-4 relative"
        style={{
          background: `
            radial-gradient(ellipse at 95% 105%, rgba(224,245,232,0.85) 0%, rgba(224,245,232,0) 45%),
            radial-gradient(ellipse at -20% 10%, rgba(250,235,235,1) 0%, rgba(240,230,245,1) 20%, rgba(220,236,252,1) 40%, rgba(235,241,248,1) 70%),
            linear-gradient(to right, rgba(241,244,250,1) 0%, rgba(245,248,252,1) 100%)
          `,
        }}
      >
        {/* Content */}
        {!plan ? (
          <PlanNotFound />
        ) : (
          <div className="flex flex-col gap-[10px] pb-24">
            {/* Section 1: Page Header */}
            <PlanPageHeader onBack={handleBack} />

            {/* Section 2: Quick Action Bar */}
            <QuickActionBar
              plan={plan}
              onUpdatePlan={handleUpdatePlan}
              onOpenEditSettingsModal={openEditSettingsModal}
              onOpenDeletePlanModal={openDeletePlanModal}
              onOpenDuplicatePlanModal={openDuplicatePlanModal}
              onOpenEditNameDescriptionModal={openEditNameDescriptionModal}
              onOpenBookInAdsManagerModal={openBookInAdsManagerModal}
            />

            {/* Section 3: Charts */}
            <ChartsSection
              forecastDate={plan.lastEdited}
              onRefreshForecast={() => console.log("Refresh forecast")}
              userBudget={plan.budget}
              audienceSize={plan.audienceSize || DEFAULT_AUDIENCE_SIZE}
              startDate={plan.schedule.startDate}
              endDate={plan.schedule.endDate}
              avgFrequency={plan.frequency}
              adSets={chartAdSets}
            />

            {/* Section 4: Ad Sets Table */}
            <AdSetsTable 
              plan={plan} 
              onUpdatePlan={handleUpdatePlan}
              onOpenEditAdSetModal={openEditAdSetModal}
              onOpenDeleteAdSetModal={openDeleteAdSetModal}
              onOpenEditAudienceModal={openEditAdSetAudienceModal}
              adSets={adSets}
              setAdSets={setAdSets}
              adSetCounter={adSetCounter}
              setAdSetCounter={setAdSetCounter}
            />
          </div>
        )}
      </main>

      {/* ============================================ */}
      {/* Modals */}
      {/* ============================================ */}
      
      {/* Edit Schedule Modal */}
      <EditScheduleModal
        isOpen={activeModal.type === 'schedule'}
        onClose={closeModal}
        initialSchedule={getScheduleModalData()}
        onSave={handleSaveSchedule}
      />

      {/* Edit Frequency Modal */}
      <EditFrequencyModal
        isOpen={activeModal.type === 'frequency'}
        onClose={closeModal}
        initialFrequency={getFrequencyModalData()}
        onSave={handleSaveFrequency}
      />

      {/* Edit Audience Modal (Plan-level) */}
      <EditAudienceModal
        isOpen={activeModal.type === 'audience'}
        onClose={closeModal}
        initialData={{
          locations: (plan?.audienceLocations || ['United States', 'Canada']).map((name, i) => ({
            id: String(i + 1),
            name,
          })),
          ageMin: String(plan?.audienceAgeRange?.min || 18),
          ageMax: String(plan?.audienceAgeRange?.max || 65),
          gender: plan?.audienceGender === 'male' ? 'men' : plan?.audienceGender === 'female' ? 'women' : 'all',
          languages: '',
          detailedTargeting: '',
          customAudiences: '',
        }}
        onSave={handleSaveAudience}
      />

      {/* Edit Audience Modal (Ad Set-level) */}
      <EditAudienceModal
        isOpen={activeModal.type === 'editAdSetAudience'}
        onClose={closeModal}
        initialData={activeModal.data?.adSet ? {
          locations: activeModal.data.adSet.audienceLocations || [{ id: '1', name: 'United States' }],
          ageMin: activeModal.data.adSet.audienceAgeMin || '18',
          ageMax: activeModal.data.adSet.audienceAgeMax || '65+',
          gender: activeModal.data.adSet.audienceGender || 'all',
          languages: '',
          detailedTargeting: '',
          customAudiences: '',
        } : undefined}
        onSave={handleSaveAdSetAudience}
      />

      {/* Edit Ad Set Modal (also used for Edit Settings) */}
      <EditAdSetModal2
        isOpen={activeModal.type === 'editAdSet'}
        onClose={closeModal}
        initialData={getAdSetModal2Data()}
        onSave={handleSaveAdSet2}
      />

      {/* Delete Plan Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={activeModal.type === 'deletePlan'}
        onClose={closeModal}
        onConfirm={handleConfirmDeletePlan}
        itemCount={1}
        itemType="plan"
      />

      {/* Delete Ad Set Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={activeModal.type === 'deleteAdSet'}
        onClose={closeModal}
        onConfirm={handleConfirmDeleteAdSet}
        itemCount={1}
        itemType="ad set"
      />

      {/* Duplicate Plan Modal */}
      <DuplicatePlanModal
        isOpen={activeModal.type === 'duplicatePlan'}
        onClose={closeModal}
        onConfirm={handleDuplicatePlan}
        currentPlanName={plan?.name || ''}
      />

      {/* Edit Name & Description Modal */}
      <EditNameDescriptionModal
        isOpen={activeModal.type === 'editNameDescription'}
        onClose={closeModal}
        onSave={handleSaveNameDescription}
        currentName={plan?.name || ''}
        currentDescription={plan?.description || ''}
      />

      {/* Book in Ads Manager Modal */}
      <BookInAdsManagerModal
        isOpen={activeModal.type === 'bookInAdsManager'}
        onClose={closeModal}
        onBook={() => {
          closeModal();
        }}
        campaignData={plan ? {
          campaignName: plan.name,
          campaignType: `${plan.buyingType} Campaign`,
          totalBudget: formatCurrency(plan.budget),
          impressions: formatNumber(plan.impressions),
          cpm: formatCurrencyWithDecimals(plan.cpm),
          scheduleStart: formatDate(plan.schedule.startDate),
          scheduleEnd: formatDate(plan.schedule.endDate),
          lastRefreshed: formatDate(new Date()),
        } : undefined}
      />
    </div>
  );
}
