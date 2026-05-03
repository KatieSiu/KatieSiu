// ============================================
// Campaign Plan Types
// ============================================

/** Buying type options */
export type BuyingType = 'Auction' | 'Reservation';

/** Schedule with date range and timestamps */
export interface Schedule {
  startDate: Date;
  startTime: string; // e.g., "10:00 AM EST"
  endDate: Date;
  endTime: string; // e.g., "10:00 AM EST"
}

/** Ad Set data - unified type for both preview tables and full ad set management */
export interface AdSetData {
  id: string;
  name: string;
  budget: number;
  budgetPercent: number;
  audienceSize: number;
  audienceSizeRange?: string; // Range like "200M-300M"
  reach: number;
  reachPercent: number;
  impressions: number;
  cpm: number;
  frequency: number;
  frequencyCap?: number; // Optional frequency cap
  avgWeeklyFrequency: number;
  performanceGoal: string;
  audience: string; // Geographic summary, e.g., "United States, 18-65+"
  schedule: string; // Display string like "Jan 1, 2025..."
  scheduleStartDate?: Date; // Actual start date for the ad set
  scheduleEndDate?: Date; // Actual end date for the ad set
  numWeeks?: number;
  placements?: string; // Placements like "Facebook, Instagram"
  // Detailed audience settings for each ad set
  audienceLocations?: { id: string; name: string; radius?: string }[];
  audienceAgeMin?: string;
  audienceAgeMax?: string;
  audienceGender?: 'all' | 'men' | 'women';
}

export interface CampaignPlan {
  id: string;
  name: string;
  description?: string; // Optional - long form text description
  buyingType: BuyingType;
  adSets: number; // 1-5
  adSetData?: AdSetData[]; // Pre-generated ad set data for preview
  schedule: Schedule;
  createdDate: Date;
  budget: number;
  totalReach: number;
  reachPercent: number;
  audienceSize: number; // Total audience size for reach % calculations
  creator: string;
  lastEdited: Date;
  frequency: number;
  impressions: number;
  cpm: number;
  flightDate: Date;
  lastForecasted: Date;
  tags: string[];
  // Audience settings
  audienceLocations?: string[];
  audienceAgeRange?: { min: number; max: number };
  audienceGender?: 'all' | 'male' | 'female';
}

// ============================================
// Column Configuration
// ============================================

export interface ColumnConfig {
  id: keyof CampaignPlan | 'select' | 'actions';
  label: string;
  defaultVisible: boolean;
  sortable: boolean;
  editable: boolean;
  width?: string;
  type: 'text' | 'number' | 'currency' | 'percent' | 'date' | 'tags' | 'select' | 'actions' | 'longtext' | 'buyingType' | 'schedule';
}

export const columnConfigs: ColumnConfig[] = [
  // Fixed columns
  { id: 'select', label: '', defaultVisible: true, sortable: false, editable: false, width: '48px', type: 'select' },
  
  // Default visible columns (in display order): Name, Description, Total budget, Impressions, CPM, Schedule, Tags, Created
  { id: 'name', label: 'Name', defaultVisible: true, sortable: true, editable: true, width: '160px', type: 'text' },
  { id: 'description', label: 'Description', defaultVisible: true, sortable: false, editable: true, width: '140px', type: 'longtext' },
  { id: 'budget', label: 'Total budget', defaultVisible: true, sortable: true, editable: true, width: '100px', type: 'currency' },
  { id: 'impressions', label: 'Impressions', defaultVisible: true, sortable: true, editable: true, width: '110px', type: 'number' },
  { id: 'cpm', label: 'CPM', defaultVisible: true, sortable: true, editable: false, width: '50px', type: 'currency' }, // Auto-calculated
  { id: 'schedule', label: 'Schedule', defaultVisible: true, sortable: true, editable: true, width: '200px', type: 'schedule' },
  { id: 'tags', label: 'Tags', defaultVisible: true, sortable: false, editable: true, width: '140px', type: 'tags' },
  { id: 'createdDate', label: 'Created', defaultVisible: true, sortable: true, editable: false, width: '100px', type: 'date' },
  
  // Hidden by default columns (available in Edit Columns menu)
  { id: 'adSets', label: '# of Ad sets', defaultVisible: false, sortable: true, editable: false, width: '100px', type: 'number' },
  { id: 'buyingType', label: 'Buying type', defaultVisible: false, sortable: true, editable: false, width: '100px', type: 'buyingType' },
  { id: 'creator', label: 'Creator', defaultVisible: false, sortable: false, editable: false, width: '100px', type: 'text' },
  { id: 'lastEdited', label: 'Last edited', defaultVisible: false, sortable: true, editable: false, width: '100px', type: 'date' },
  { id: 'lastForecasted', label: 'Last forecasted', defaultVisible: false, sortable: true, editable: false, width: '120px', type: 'date' },
  
  // Fixed columns
  { id: 'actions', label: '', defaultVisible: true, sortable: false, editable: false, width: '48px', type: 'actions' },
];

// ============================================
// Mock Campaign Data
// ============================================

// Default audience size (US 18-65+)
export const DEFAULT_AUDIENCE_SIZE = 188000000;

// All campaign metrics are calculated using power curve scaling based on budget:
// - Reach = BASE_REACH × (Budget / BASE_BUDGET)^0.51
// - Frequency = BASE_FREQUENCY × (Budget / BASE_BUDGET)^0.30
// - Impressions = Reach × Frequency
// - CPM = (Budget / Impressions) × 1000
// - ReachPercent = (Reach / AudienceSize) × 100
// Base values: $100K budget → 39.4M reach, 1.56 frequency

// Mock data calculated using new model:
// - BASE_BUDGET = $50K, BASE_REACH = 26.4M, BASE_FREQUENCY = 1.36
// - REACH_EXPONENT = 0.71, FREQUENCY_EXPONENT = 0.05
// - SATURATION_CEILING = 65% of audience
export const mockCampaignPlans: CampaignPlan[] = [
  {
    id: '1',
    name: 'Superbowl 2026 V1',
    buyingType: 'Auction',
    adSets: 3,
    schedule: {
      startDate: new Date('2026-03-02'),
      startTime: '12:01 AM EST',
      endDate: new Date('2026-03-23'),
      endTime: '11:59 PM EST',
    },
    createdDate: new Date('2026-01-20'),
    budget: 85000,
    totalReach: 38403000,      // 26.4M × (1.7)^0.71
    reachPercent: 20.43,       // 38.4M / 188M × 100
    audienceSize: DEFAULT_AUDIENCE_SIZE,
    creator: 'Chill Jill',
    lastEdited: new Date('2026-01-20'),
    frequency: 1.40,           // 1.36 × (1.7)^0.05
    impressions: 53764200,     // 38.4M × 1.40
    cpm: 1.58,                 // 85K / 53.8M × 1000
    flightDate: new Date('2025-11-15'),
    lastForecasted: new Date('2025-08-02'),
    tags: ['Superbowl 2026'],
  },
  {
    id: '2',
    name: 'Superbowl 2026 V2',
    buyingType: 'Reservation',
    adSets: 5,
    schedule: {
      startDate: new Date('2026-04-06'),
      startTime: '12:01 AM EST',
      endDate: new Date('2026-05-04'),
      endTime: '11:59 PM EST',
    },
    createdDate: new Date('2026-01-20'),
    budget: 45000,
    totalReach: 24494000,      // 26.4M × (0.9)^0.71
    reachPercent: 13.03,       // 24.5M / 188M × 100
    audienceSize: DEFAULT_AUDIENCE_SIZE,
    creator: 'Chill Jill',
    lastEdited: new Date('2026-01-20'),
    frequency: 1.35,           // 1.36 × (0.9)^0.05
    impressions: 33066900,     // 24.5M × 1.35
    cpm: 1.36,                 // 45K / 33.1M × 1000
    flightDate: new Date('2025-11-15'),
    lastForecasted: new Date('2025-08-02'),
    tags: ['Superbowl 2026'],
  },
  {
    id: '3',
    name: 'Superbowl 2026 V3',
    buyingType: 'Auction',
    adSets: 2,
    schedule: {
      startDate: new Date('2026-05-11'),
      startTime: '12:01 AM EST',
      endDate: new Date('2026-05-25'),
      endTime: '11:59 PM EST',
    },
    createdDate: new Date('2026-01-20'),
    budget: 120000,
    totalReach: 50587000,      // 26.4M × (2.4)^0.71
    reachPercent: 26.91,       // 50.6M / 188M × 100
    audienceSize: DEFAULT_AUDIENCE_SIZE,
    creator: 'Chill Jill',
    lastEdited: new Date('2026-01-20'),
    frequency: 1.42,           // 1.36 × (2.4)^0.05
    impressions: 71833540,     // 50.6M × 1.42
    cpm: 1.67,                 // 120K / 71.8M × 1000
    flightDate: new Date('2025-11-15'),
    lastForecasted: new Date('2025-08-02'),
    tags: ['Superbowl 2026'],
  },
  {
    id: '4',
    name: 'Back to school V2',
    buyingType: 'Reservation',
    adSets: 4,
    schedule: {
      startDate: new Date('2026-06-01'),
      startTime: '12:01 AM EST',
      endDate: new Date('2026-07-06'),
      endTime: '11:59 PM EST',
    },
    createdDate: new Date('2024-12-20'),
    budget: 25000,
    totalReach: 16153000,      // 26.4M × (0.5)^0.71
    reachPercent: 8.59,        // 16.2M / 188M × 100
    audienceSize: DEFAULT_AUDIENCE_SIZE,
    creator: 'Chill Jill',
    lastEdited: new Date('2025-01-08'),
    frequency: 1.31,           // 1.36 × (0.5)^0.05
    impressions: 21160430,     // 16.2M × 1.31
    cpm: 1.18,                 // 25K / 21.2M × 1000
    flightDate: new Date('2025-08-15'),
    lastForecasted: new Date('2025-07-12'),
    tags: ['Summer 2025'],
  },
  {
    id: '5',
    name: 'Back to school V1',
    buyingType: 'Auction',
    adSets: 1,
    schedule: {
      startDate: new Date('2026-08-03'),
      startTime: '12:01 AM EST',
      endDate: new Date('2026-08-24'),
      endTime: '11:59 PM EST',
    },
    createdDate: new Date('2024-12-15'),
    budget: 70000,
    totalReach: 33600000,      // 26.4M × (1.4)^0.71
    reachPercent: 17.87,       // 33.6M / 188M × 100
    audienceSize: DEFAULT_AUDIENCE_SIZE,
    creator: 'Chill Jill',
    lastEdited: new Date('2025-01-02'),
    frequency: 1.38,           // 1.36 × (1.4)^0.05
    impressions: 46368000,     // 33.6M × 1.38
    cpm: 1.51,                 // 70K / 46.4M × 1000
    flightDate: new Date('2025-08-15'),
    lastForecasted: new Date('2025-07-01'),
    tags: ['Summer 2025'],
  },
  {
    id: '6',
    name: '4th of July 2025',
    buyingType: 'Reservation',
    adSets: 2,
    schedule: {
      startDate: new Date('2026-09-07'),
      startTime: '12:01 AM EST',
      endDate: new Date('2026-10-19'),
      endTime: '11:59 PM EST',
    },
    createdDate: new Date('2024-11-28'),
    budget: 15000,
    totalReach: 11006000,      // 26.4M × (0.3)^0.71
    reachPercent: 5.85,        // 11M / 188M × 100
    audienceSize: DEFAULT_AUDIENCE_SIZE,
    creator: 'Chill Jill',
    lastEdited: new Date('2024-12-18'),
    frequency: 1.28,           // 1.36 × (0.3)^0.05
    impressions: 14087680,     // 11M × 1.28
    cpm: 1.06,                 // 15K / 14.1M × 1000
    flightDate: new Date('2025-07-04'),
    lastForecasted: new Date('2025-06-01'),
    tags: ['4th of July'],
  },
  {
    id: '7',
    name: 'Father Day V3',
    buyingType: 'Auction',
    adSets: 3,
    schedule: {
      startDate: new Date('2026-11-02'),
      startTime: '12:01 AM EST',
      endDate: new Date('2026-11-30'),
      endTime: '11:59 PM EST',
    },
    createdDate: new Date('2024-11-15'),
    budget: 95000,
    totalReach: 41201000,      // 26.4M × (1.9)^0.71
    reachPercent: 21.91,       // 41.2M / 188M × 100
    audienceSize: DEFAULT_AUDIENCE_SIZE,
    creator: 'Chill Jill',
    lastEdited: new Date('2024-12-10'),
    frequency: 1.40,           // 1.36 × (1.9)^0.05
    impressions: 57681400,     // 41.2M × 1.40
    cpm: 1.65,                 // 95K / 57.7M × 1000
    flightDate: new Date('2025-06-15'),
    lastForecasted: new Date('2025-04-21'),
    tags: ['Fathers Day'],
  },
  {
    id: '8',
    name: 'Father Day V2',
    buyingType: 'Auction',
    adSets: 1,
    schedule: {
      startDate: new Date('2025-06-10'),
      startTime: '7:00 AM EST',
      endDate: new Date('2025-06-15'),
      endTime: '11:59 PM EST',
    },
    createdDate: new Date('2025-04-20'),
    budget: 45000,
    totalReach: 24494000,      // 26.4M × (0.9)^0.71
    reachPercent: 13.03,       // 24.5M / 188M × 100
    audienceSize: DEFAULT_AUDIENCE_SIZE,
    creator: 'Chill Jill',
    lastEdited: new Date('2025-04-20'),
    frequency: 1.35,           // 1.36 × (0.9)^0.05
    impressions: 33066900,     // 24.5M × 1.35
    cpm: 1.36,                 // 45K / 33.1M × 1000
    flightDate: new Date('2025-06-15'),
    lastForecasted: new Date('2025-04-20'),
    tags: ['Fathers Day'],
  },
  {
    id: '9',
    name: 'Father Day V1',
    buyingType: 'Reservation',
    adSets: 4,
    schedule: {
      startDate: new Date('2025-05-15'),
      startTime: '12:01 AM EST',
      endDate: new Date('2025-06-15'),
      endTime: '11:59 PM EST',
    },
    createdDate: new Date('2025-04-19'),
    budget: 150000,
    totalReach: 58410000,      // 26.4M × (3)^0.71
    reachPercent: 31.07,       // 58.4M / 188M × 100
    audienceSize: DEFAULT_AUDIENCE_SIZE,
    creator: 'Chill Jill',
    lastEdited: new Date('2025-04-19'),
    frequency: 1.44,           // 1.36 × (3)^0.05
    impressions: 84110400,     // 58.4M × 1.44
    cpm: 1.78,                 // 150K / 84.1M × 1000
    flightDate: new Date('2025-06-15'),
    lastForecasted: new Date('2025-04-19'),
    tags: ['Fathers Day'],
  },
  {
    id: '10',
    name: 'Spring Sale 2025',
    buyingType: 'Auction',
    adSets: 2,
    schedule: {
      startDate: new Date('2025-03-15'),
      startTime: '9:00 AM EST',
      endDate: new Date('2025-04-15'),
      endTime: '11:59 PM EST',
    },
    createdDate: new Date('2025-02-28'),
    budget: 85000,
    totalReach: 38403000,      // 26.4M × (1.7)^0.71
    reachPercent: 20.43,       // 38.4M / 188M × 100
    audienceSize: DEFAULT_AUDIENCE_SIZE,
    creator: 'Mike Chen',
    lastEdited: new Date('2025-03-05'),
    frequency: 1.40,           // 1.36 × (1.7)^0.05
    impressions: 53764200,     // 38.4M × 1.40
    cpm: 1.58,                 // 85K / 53.8M × 1000
    flightDate: new Date('2025-03-15'),
    lastForecasted: new Date('2025-03-05'),
    tags: ['Spring 2025'],
  },
  {
    id: '11',
    name: 'Valentine\'s Day Promo',
    buyingType: 'Reservation',
    adSets: 3,
    schedule: {
      startDate: new Date('2025-02-01'),
      startTime: '12:01 AM EST',
      endDate: new Date('2025-02-14'),
      endTime: '11:59 PM EST',
    },
    createdDate: new Date('2025-01-15'),
    budget: 175000,
    totalReach: 64613000,      // 26.4M × (3.5)^0.71
    reachPercent: 34.37,       // 64.6M / 188M × 100
    audienceSize: DEFAULT_AUDIENCE_SIZE,
    creator: 'Sarah Lopez',
    lastEdited: new Date('2025-01-22'),
    frequency: 1.45,           // 1.36 × (3.5)^0.05
    impressions: 93688850,     // 64.6M × 1.45
    cpm: 1.87,                 // 175K / 93.7M × 1000
    flightDate: new Date('2025-02-01'),
    lastForecasted: new Date('2025-01-22'),
    tags: ['Valentines Day'],
  },
  {
    id: '12',
    name: 'Memorial Day Weekend',
    buyingType: 'Auction',
    adSets: 5,
    schedule: {
      startDate: new Date('2025-05-20'),
      startTime: '6:00 AM EST',
      endDate: new Date('2025-05-26'),
      endTime: '11:59 PM EST',
    },
    createdDate: new Date('2025-04-10'),
    budget: 95000,
    totalReach: 41201000,      // 26.4M × (1.9)^0.71
    reachPercent: 21.91,       // 41.2M / 188M × 100
    audienceSize: DEFAULT_AUDIENCE_SIZE,
    creator: 'Chill Jill',
    lastEdited: new Date('2025-04-18'),
    frequency: 1.40,           // 1.36 × (1.9)^0.05
    impressions: 57681400,     // 41.2M × 1.40
    cpm: 1.65,                 // 95K / 57.7M × 1000
    flightDate: new Date('2025-05-20'),
    lastForecasted: new Date('2025-04-18'),
    tags: ['Memorial Day'],
  },
  {
    id: '13',
    name: 'Labor Day Sale',
    buyingType: 'Reservation',
    adSets: 2,
    schedule: {
      startDate: new Date('2025-08-28'),
      startTime: '10:00 AM EST',
      endDate: new Date('2025-09-02'),
      endTime: '10:00 PM EST',
    },
    createdDate: new Date('2025-07-20'),
    budget: 65000,
    totalReach: 31779000,      // 26.4M × (1.3)^0.71
    reachPercent: 16.90,       // 31.8M / 188M × 100
    audienceSize: DEFAULT_AUDIENCE_SIZE,
    creator: 'Mike Chen',
    lastEdited: new Date('2025-07-25'),
    frequency: 1.38,           // 1.36 × (1.3)^0.05
    impressions: 43854820,     // 31.8M × 1.38
    cpm: 1.48,                 // 65K / 43.9M × 1000
    flightDate: new Date('2025-08-28'),
    lastForecasted: new Date('2025-07-25'),
    tags: ['Labor Day'],
  },
  {
    id: '14',
    name: 'Cyber Monday Blitz',
    buyingType: 'Auction',
    adSets: 4,
    schedule: {
      startDate: new Date('2025-11-28'),
      startTime: '12:01 AM EST',
      endDate: new Date('2025-12-02'),
      endTime: '11:59 PM EST',
    },
    createdDate: new Date('2025-09-15'),
    budget: 425000,
    totalReach: 119961000,     // 26.4M × (8.5)^0.71 - just under saturation ceiling
    reachPercent: 63.81,       // 120M / 188M × 100
    audienceSize: DEFAULT_AUDIENCE_SIZE,
    creator: 'Sarah Lopez',
    lastEdited: new Date('2025-09-22'),
    frequency: 1.51,           // 1.36 × (8.5)^0.05
    impressions: 181141110,    // 120M × 1.51
    cpm: 2.35,                 // 425K / 181M × 1000
    flightDate: new Date('2025-11-28'),
    lastForecasted: new Date('2025-09-22'),
    tags: ['Black Friday 2025', 'Cyber Monday'],
  },
];

// ============================================
// Utility Functions
// ============================================

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCurrencyWithDecimals(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function formatScheduleDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  }).format(date);
}

export function formatSchedule(schedule: Schedule): string {
  const startDate = formatScheduleDate(schedule.startDate);
  const endDate = formatScheduleDate(schedule.endDate);
  return `${startDate} - ${endDate}`;
}

// Get all unique tags from campaigns
export function getAllTags(plans: CampaignPlan[]): string[] {
  const tagSet = new Set<string>();
  plans.forEach(plan => plan.tags.forEach(tag => tagSet.add(tag)));
  return Array.from(tagSet).sort();
}

// Get all unique creators from campaigns
export function getAllCreators(plans: CampaignPlan[]): string[] {
  const creatorSet = new Set<string>();
  plans.forEach(plan => creatorSet.add(plan.creator));
  return Array.from(creatorSet).sort();
}

// ============================================
// Ad Set Data Generation
// ============================================

// Audience options for variety
const AUDIENCE_OPTIONS = [
  'United States, 18-65+',
  'United States, 25-54',
  'United States, 18-34',
  'Brazil, 18-65+',
  'Canada, 25-54',
  'Mexico, 18-44',
  'UK, 25-65+',
  'Germany, 18-54',
  'France, 25-44',
  'Australia, 18-65+',
];

// Placement options
const PLACEMENT_OPTIONS = [
  'Facebook, Instagram',
  'Facebook, Instagram, Audience Network',
  'Instagram only',
  'Facebook only',
  'Facebook, Messenger',
];

// Optimization goal options (only Reach and Thruplay per design)
const OPTIMIZATION_OPTIONS = [
  'Reach',
  'Thruplay',
];

// Seeded random number generator for consistent results
function seededRandom(seed: number): () => number {
  return function() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

// Helper to format audience size as range (e.g., "200M-300M")
function formatAudienceSizeRange(size: number): string {
  if (size >= 1000000000) {
    const billions = size / 1000000000;
    const lowerB = Math.floor(billions * 10) / 10;
    const upperB = Math.ceil(billions * 10) / 10 + 0.1;
    return `${lowerB.toFixed(1)}B-${upperB.toFixed(1)}B`;
  } else if (size >= 1000000) {
    const millions = size / 1000000;
    const lowerM = Math.floor(millions / 10) * 10;
    const upperM = Math.ceil(millions / 10) * 10 + 10;
    return `${lowerM}M-${upperM}M`;
  } else if (size >= 1000) {
    const thousands = size / 1000;
    const lowerK = Math.floor(thousands / 10) * 10;
    const upperK = Math.ceil(thousands / 10) * 10 + 10;
    return `${lowerK}K-${upperK}K`;
  }
  return `${size}-${size + 1000}`;
}

// Generate ad set data for a plan
export function generateAdSetData(plan: CampaignPlan, seed?: number): AdSetData[] {
  const random = seededRandom(seed ?? parseInt(plan.id, 10) * 12345);
  
  // Generate 1-4 ad sets based on plan's adSets count (capped at 4)
  const adSetCount = Math.min(plan.adSets, 4);
  
  // Distribute budget across ad sets with some variation
  const budgetShares: number[] = [];
  let remainingShare = 100;
  
  for (let i = 0; i < adSetCount - 1; i++) {
    // Each ad set gets between 15% and 40% of remaining budget
    const minShare = Math.max(15, Math.floor(remainingShare / (adSetCount - i) * 0.5));
    const maxShare = Math.min(50, Math.floor(remainingShare / (adSetCount - i) * 1.5));
    const share = Math.floor(minShare + random() * (maxShare - minShare));
    budgetShares.push(share);
    remainingShare -= share;
  }
  budgetShares.push(remainingShare); // Last ad set gets the remainder
  
  // Plan schedule dates
  const planStart = plan.schedule.startDate;
  const planEnd = plan.schedule.endDate;
  const planDurationMs = planEnd.getTime() - planStart.getTime();
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  const msPerDay = 24 * 60 * 60 * 1000;
  
  const adSets: AdSetData[] = [];
  
  for (let i = 0; i < adSetCount; i++) {
    const budgetPercent = budgetShares[i];
    const budget = Math.round(plan.budget * (budgetPercent / 100));
    const reach = Math.round(plan.totalReach * (budgetPercent / 100));
    const reachPercent = budgetPercent; // Simplified: reach % matches budget %
    const impressions = Math.round(plan.impressions * (budgetPercent / 100));
    const frequency = reach > 0 ? impressions / reach : 0;
    const cpm = impressions > 0 ? (budget / impressions) * 1000 : 0;
    const audienceSize = Math.round((plan.audienceSize || DEFAULT_AUDIENCE_SIZE) * (budgetPercent / 100));
    
    // Generate individual ad set schedule (some variation from plan schedule)
    // First ad set starts at plan start, others may start later
    const startOffset = i === 0 ? 0 : Math.floor(random() * (planDurationMs * 0.3));
    const adSetStartDate = new Date(planStart.getTime() + startOffset);
    // End date is between ad set start and plan end (at least 1 week duration)
    const minDuration = msPerWeek;
    const maxDuration = planEnd.getTime() - adSetStartDate.getTime();
    const adSetDuration = Math.max(minDuration, Math.floor(minDuration + random() * (maxDuration - minDuration)));
    const adSetEndDate = new Date(Math.min(adSetStartDate.getTime() + adSetDuration, planEnd.getTime()));
    
    // Calculate number of weeks for this ad set
    const numWeeks = Math.max(1, Math.ceil((adSetEndDate.getTime() - adSetStartDate.getTime()) / msPerWeek));
    
    // Average weekly frequency = frequency / numWeeks
    const avgWeeklyFrequency = numWeeks > 0 ? frequency / numWeeks : 0;
    
    // Format schedule string
    const scheduleStr = `${formatScheduleDate(adSetStartDate)}...`;
    
    // Pick audience, optimization, and placements with some randomness
    const audienceIndex = Math.floor(random() * AUDIENCE_OPTIONS.length);
    const optimizationIndex = Math.floor(random() * OPTIMIZATION_OPTIONS.length);
    const placementIndex = Math.floor(random() * PLACEMENT_OPTIONS.length);
    
    // Some ad sets have frequency caps
    const hasFrequencyCap = random() > 0.4;
    const frequencyCap = hasFrequencyCap ? Math.round(1 + random() * 1.5 * 10) / 10 : undefined;
    
    adSets.push({
      id: `${plan.id}-adset-${i + 1}`,
      name: `Ad Set ${i + 1}`,
      budget,
      budgetPercent,
      audienceSize,
      audienceSizeRange: formatAudienceSizeRange(audienceSize),
      reach,
      reachPercent,
      impressions,
      cpm: parseFloat(cpm.toFixed(2)),
      frequency: parseFloat(frequency.toFixed(2)),
      frequencyCap,
      avgWeeklyFrequency: parseFloat(avgWeeklyFrequency.toFixed(2)),
      performanceGoal: OPTIMIZATION_OPTIONS[optimizationIndex],
      audience: AUDIENCE_OPTIONS[audienceIndex],
      schedule: scheduleStr,
      scheduleStartDate: adSetStartDate,
      scheduleEndDate: adSetEndDate,
      numWeeks,
      placements: PLACEMENT_OPTIONS[placementIndex],
    });
  }
  
  return adSets;
}

// Generate ad set data for all mock plans
function initializeAdSetData(): void {
  mockCampaignPlans.forEach(plan => {
    plan.adSetData = generateAdSetData(plan);
    // Update adSets count to match generated data
    plan.adSets = plan.adSetData.length;
  });
}

// Initialize ad set data on module load
initializeAdSetData();
