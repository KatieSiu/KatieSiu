// ============================================
// Plan Details - Shared Types
// ============================================

import { CampaignPlan, AdSetData } from "@/features/campaign-planner/lib/mock-data";

/** Ad Set data for table display - uses unified AdSetData type from mock-data */
export type AdSet = AdSetData;

/** Ad Set data for charts (simplified version for chart visualization) */
export interface ChartAdSet {
  id: string;
  name: string;
  budget: number;
  reach: number;
  impressions: number;
}

/** Modal type options */
export type ModalType = 'schedule' | 'frequency' | 'audience' | 'editAdSet' | 'deletePlan' | 'deleteAdSet' | 'duplicatePlan' | 'editAdSetAudience' | 'editNameDescription' | 'bookInAdsManager' | null;

/** Modal state with optional context data */
export interface ModalState {
  type: ModalType;
  data?: {
    adSet?: AdSet;
    adSetId?: string;
    isPlanSettings?: boolean;
  };
}

/** Ad Set Column Configuration */
export interface AdSetColumnConfig {
  id: string;
  label: string;
  defaultVisible: boolean;
  editable: boolean;
  getValue: (adSet: AdSet) => string | number;
  formatValue: (adSet: AdSet, isTotal: boolean) => string;
}

