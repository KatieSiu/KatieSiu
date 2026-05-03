"use client";

import { formatNumber, formatCurrencyWithDecimals } from "@/features/campaign-planner/lib/mock-data";
import { AdSet, AdSetColumnConfig } from "./types";

// ============================================
// Ad Set Column Configuration
// ============================================
// These configs are used by AdSetsTable to define column behavior
// and by the Edit Columns dropdown to show available columns
//
// Default visible columns (in order):
// 1. Ad Set, 2. Budget, 3. Budget %, 4. Reach, 5. Frequency,
// 6. Impressions, 7. Audience, 8. CPM, 9. Schedule
//
// Additional columns available in Edit Columns:
// • Placements, # of weeks, Audience size, Average weekly frequency

export const adSetColumnConfigs: AdSetColumnConfig[] = [
  // === DEFAULT VISIBLE COLUMNS (in display order) ===
  {
    id: 'name',
    label: 'Ad Set',
    defaultVisible: true,
    editable: true,
    getValue: (adSet) => adSet.name,
    formatValue: (adSet) => adSet.name,
  },
  {
    id: 'budget',
    label: 'Budget',
    defaultVisible: true,
    editable: true,
    getValue: (adSet) => adSet.budget,
    formatValue: (adSet) => `$${formatNumber(adSet.budget)}`,
  },
  {
    id: 'budgetPercent',
    label: 'Budget %',
    defaultVisible: true,
    editable: true,
    getValue: (adSet) => adSet.budgetPercent,
    formatValue: (adSet, isTotal) => isTotal ? '-' : `${adSet.budgetPercent}%`,
  },
  {
    id: 'reach',
    label: 'Reach',
    defaultVisible: true,
    editable: true,
    getValue: (adSet) => adSet.reach,
    formatValue: (adSet) => formatNumber(adSet.reach),
  },
  {
    id: 'frequency',
    label: 'Frequency',
    defaultVisible: true,
    editable: false,
    getValue: (adSet) => adSet.frequency,
    formatValue: (adSet) => adSet.frequency.toFixed(1),
  },
  {
    id: 'impressions',
    label: 'Impressions',
    defaultVisible: true,
    editable: true,
    getValue: (adSet) => adSet.impressions,
    formatValue: (adSet) => formatNumber(adSet.impressions),
  },
  {
    id: 'audience',
    label: 'Audience',
    defaultVisible: true,
    editable: false,
    getValue: (adSet) => adSet.audience || 'United States, 18-65+',
    formatValue: (adSet, isTotal) => isTotal ? '-' : (adSet.audience || 'United States, 18-65+'),
  },
  {
    id: 'cpm',
    label: 'CPM',
    defaultVisible: true,
    editable: false,
    getValue: (adSet) => adSet.cpm,
    formatValue: (adSet) => formatCurrencyWithDecimals(adSet.cpm),
  },
  {
    id: 'performanceGoal',
    label: 'Performance goal',
    defaultVisible: true,
    editable: false,
    getValue: (adSet) => adSet.performanceGoal,
    formatValue: (adSet, isTotal) => isTotal ? '-' : (adSet.performanceGoal || 'Reach'),
  },
  {
    id: 'schedule',
    label: 'Schedule',
    defaultVisible: true,
    editable: false,
    getValue: (adSet) => adSet.schedule || 'Jan 1 - Dec 31',
    formatValue: (adSet, isTotal) => isTotal ? '-' : (adSet.schedule || 'Jan 1 - Dec 31'),
  },
  
  // === HIDDEN BY DEFAULT COLUMNS (available in Edit Columns) ===
  {
    id: 'placements',
    label: 'Placements',
    defaultVisible: false,
    editable: false,
    getValue: (adSet) => adSet.placements || 'Facebook, Instagram',
    formatValue: (adSet, isTotal) => isTotal ? '-' : (adSet.placements || 'Facebook, Instagram'),
  },
  {
    id: 'numWeeks',
    label: '# of weeks',
    defaultVisible: false,
    editable: false,
    getValue: (adSet) => adSet.numWeeks || 0,
    formatValue: (adSet, isTotal) => isTotal ? '-' : (adSet.numWeeks ? String(adSet.numWeeks) : '-'),
  },
  {
    id: 'audienceSize',
    label: 'Audience size',
    defaultVisible: false,
    editable: false,
    getValue: (adSet) => adSet.audienceSize,
    formatValue: (adSet, isTotal) => isTotal ? '-' : (adSet.audienceSizeRange || formatNumber(adSet.audienceSize)),
  },
  {
    id: 'avgWeeklyFrequency',
    label: 'Average weekly frequency',
    defaultVisible: false,
    editable: false,
    getValue: (adSet) => adSet.avgWeeklyFrequency,
    formatValue: (adSet) => adSet.avgWeeklyFrequency.toFixed(2),
  },
];

// Default visible columns for ad set table (in specific display order)
export const defaultAdSetVisibleColumns = [
  'name',
  'budget',
  'budgetPercent',
  'reach',
  'frequency',
  'impressions',
  'audience',
  'cpm',
  'schedule',
];

