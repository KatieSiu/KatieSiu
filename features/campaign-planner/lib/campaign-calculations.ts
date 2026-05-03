// ============================================
// Campaign Calculation Engine
// ============================================
// Handles interdependent field calculations for campaign metrics.
// When one field is edited, related fields are automatically recalculated.

// ============================================
// CONSTANTS - Derived from real campaign data
// ============================================

// Power curve coefficients derived from real campaign data (Jan 2026)
// These represent diminishing returns as budget increases
const REACH_EXPONENT = 0.71;      // Reach ~ Budget^0.71
const FREQUENCY_EXPONENT = 0.05;  // Frequency ~ Budget^0.05 (relatively flat)

// Base reference point (from $50K sample data)
const BASE_BUDGET = 50000;
const BASE_REACH = 26394115;
const BASE_FREQUENCY = 1.36;

// Default audience size (US 18-65+)
export const DEFAULT_AUDIENCE_SIZE = 188000000;

// Saturation ceiling - maximum reachable percentage of audience
// Based on observed data: ~57% at $1M, ~41% at $500K
// Set slightly above observed max to allow for variance
const SATURATION_CEILING = 0.65; // 65% of audience is practical maximum

// ============================================
// VALIDATION BOUNDS
// ============================================
export const METRIC_BOUNDS = {
  budget: { min: 0, max: 100_000_000 },        // $0 - $100M
  totalReach: { min: 0, max: 500_000_000 },    // 0 - 500M people
  reachPercent: { min: 0, max: 100 },          // 0% - 100%
  frequency: { min: 0, max: 50 },               // 0 - 50x (reasonable cap)
  impressions: { min: 0, max: 25_000_000_000 }, // 0 - 25B
  cpm: { min: 0, max: 1000 },                   // $0 - $1000
} as const;

// ============================================
// TYPES
// ============================================

export interface CampaignMetrics {
  budget: number;
  totalReach: number;
  reachPercent: number;
  frequency: number;
  impressions: number;
  cpm: number;
}

export type EditableMetricField = 
  | 'budget' 
  | 'totalReach' 
  | 'reachPercent' 
  | 'frequency' 
  | 'impressions';

// ============================================
// VALIDATION FUNCTIONS
// ============================================

/**
 * Clamp a value within specified bounds
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Validate and clamp a metric value within its allowed bounds
 */
export function validateMetricValue(
  field: keyof typeof METRIC_BOUNDS,
  value: number
): number {
  const bounds = METRIC_BOUNDS[field];
  return clamp(value, bounds.min, bounds.max);
}

/**
 * Check if a value is a valid number (not NaN, not Infinity)
 */
export function isValidNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
}

/**
 * Parse a string to a number, returning 0 for invalid inputs
 */
export function parseNumericInput(value: string): number {
  // Remove currency symbols, commas, and whitespace
  const cleaned = value.replace(/[$,\s]/g, '');
  const parsed = parseFloat(cleaned);
  return isValidNumber(parsed) ? parsed : 0;
}

// ============================================
// CORE CALCULATION FUNCTIONS
// ============================================

/**
 * Calculate impressions from reach and frequency
 */
export function calculateImpressions(reach: number, frequency: number): number {
  return Math.round(reach * frequency);
}

/**
 * Calculate CPM (Cost Per Mille) from budget and impressions
 */
export function calculateCPM(budget: number, impressions: number): number {
  if (impressions === 0) return 0;
  return (budget / impressions) * 1000;
}

/**
 * Calculate reach percentage from reach and audience size
 */
export function calculateReachPercent(reach: number, audienceSize: number): number {
  if (audienceSize === 0) return 0;
  return (reach / audienceSize) * 100;
}

/**
 * Calculate reach from reach percentage and audience size
 */
export function calculateReachFromPercent(reachPercent: number, audienceSize: number): number {
  return Math.round((reachPercent / 100) * audienceSize);
}

/**
 * Calculate frequency from impressions and reach
 */
export function calculateFrequency(impressions: number, reach: number): number {
  if (reach === 0) return 0;
  return impressions / reach;
}

// ============================================
// SCALING FUNCTIONS (Power Curves with Saturation)
// ============================================

/**
 * Calculate reach based on budget using power curve scaling with saturation cap
 * Reach = min(BASE_REACH × (Budget / BASE_BUDGET)^REACH_EXPONENT, audienceSize × SATURATION_CEILING)
 * 
 * @param budget - Campaign budget in dollars
 * @param audienceSize - Total audience size (defaults to DEFAULT_AUDIENCE_SIZE)
 * @returns Estimated reach, capped at saturation ceiling
 */
export function calculateReachFromBudget(budget: number, audienceSize: number = DEFAULT_AUDIENCE_SIZE): number {
  if (budget <= 0) return 0;
  
  // Calculate raw reach using power curve
  const scaleFactor = Math.pow(budget / BASE_BUDGET, REACH_EXPONENT);
  const rawReach = BASE_REACH * scaleFactor;
  
  // Apply saturation cap - can't reach more than SATURATION_CEILING of audience
  const maxReach = audienceSize * SATURATION_CEILING;
  
  return Math.round(Math.min(rawReach, maxReach));
}

/**
 * Calculate frequency based on budget using power curve scaling
 * Frequency = BASE_FREQUENCY × (Budget / BASE_BUDGET)^FREQUENCY_EXPONENT
 */
export function calculateFrequencyFromBudget(budget: number): number {
  if (budget <= 0) return 0;
  const scaleFactor = Math.pow(budget / BASE_BUDGET, FREQUENCY_EXPONENT);
  return BASE_FREQUENCY * scaleFactor;
}

/**
 * Calculate budget required to achieve a target reach
 * Inverse of calculateReachFromBudget (without saturation - for estimation only)
 * Note: If target reach exceeds saturation ceiling, returns budget for max achievable reach
 * 
 * @param targetReach - Desired reach
 * @param audienceSize - Total audience size (defaults to DEFAULT_AUDIENCE_SIZE)
 * @returns Estimated budget required
 */
export function calculateBudgetFromReach(targetReach: number, audienceSize: number = DEFAULT_AUDIENCE_SIZE): number {
  if (targetReach <= 0) return 0;
  
  // Cap target reach at saturation ceiling
  const maxReach = audienceSize * SATURATION_CEILING;
  const effectiveTargetReach = Math.min(targetReach, maxReach);
  
  // Reach = BASE_REACH × (Budget / BASE_BUDGET)^REACH_EXPONENT
  // Solving for Budget:
  // Budget = BASE_BUDGET × (Reach / BASE_REACH)^(1/REACH_EXPONENT)
  const scaleFactor = Math.pow(effectiveTargetReach / BASE_REACH, 1 / REACH_EXPONENT);
  return Math.round(BASE_BUDGET * scaleFactor);
}

// ============================================
// MAIN RECALCULATION FUNCTION
// ============================================

/**
 * Recalculate all dependent fields based on which field was changed.
 * 
 * @param current - Current campaign metrics
 * @param changedField - The field that was edited
 * @param newValue - The new value for the changed field
 * @param audienceSize - Total audience size for reach % calculations
 * @returns Updated campaign metrics with all dependent fields recalculated
 * 
 * @example
 * // User edits budget from $50K to $100K
 * const updated = recalculateMetrics(current, 'budget', 100000, audienceSize);
 * // Returns: { budget: 100000, totalReach: ~43M, frequency: ~1.39, impressions: ~60M, cpm: ~$1.67 }
 */
export function recalculateMetrics(
  current: CampaignMetrics,
  changedField: EditableMetricField,
  newValue: number,
  audienceSize: number = DEFAULT_AUDIENCE_SIZE
): CampaignMetrics {
  // Validate input value is a valid number
  if (!isValidNumber(newValue)) {
    console.warn(`Invalid value for ${changedField}: ${newValue}. Returning current metrics.`);
    return current;
  }

  // Start with current values
  let { budget, totalReach, reachPercent, frequency, impressions, cpm } = current;

  switch (changedField) {
    case 'budget':
      // Budget change triggers full recalculation using power curves with saturation
      budget = validateMetricValue('budget', newValue);
      totalReach = calculateReachFromBudget(budget, audienceSize); // Pass audienceSize for saturation
      frequency = calculateFrequencyFromBudget(budget);
      impressions = calculateImpressions(totalReach, frequency);
      cpm = calculateCPM(budget, impressions);
      reachPercent = calculateReachPercent(totalReach, audienceSize);
      break;

    case 'totalReach':
      // Reach change: keep budget and frequency, recalculate derived fields
      totalReach = validateMetricValue('totalReach', newValue);
      reachPercent = calculateReachPercent(totalReach, audienceSize);
      impressions = calculateImpressions(totalReach, frequency);
      cpm = calculateCPM(budget, impressions);
      break;

    case 'reachPercent':
      // Reach % change: convert to reach, then cascade
      reachPercent = validateMetricValue('reachPercent', newValue);
      totalReach = calculateReachFromPercent(reachPercent, audienceSize);
      impressions = calculateImpressions(totalReach, frequency);
      cpm = calculateCPM(budget, impressions);
      break;

    case 'frequency':
      // Frequency change: keep reach, recalculate impressions and CPM
      frequency = validateMetricValue('frequency', newValue);
      impressions = calculateImpressions(totalReach, frequency);
      cpm = calculateCPM(budget, impressions);
      break;

    case 'impressions':
      // Impressions change: derive frequency from reach, recalculate CPM
      impressions = validateMetricValue('impressions', newValue);
      frequency = calculateFrequency(impressions, totalReach);
      cpm = calculateCPM(budget, impressions);
      break;

    default:
      // No recalculation needed for other fields
      break;
  }

  // Final validation pass - ensure all values are within bounds
  return {
    budget: validateMetricValue('budget', budget),
    totalReach: validateMetricValue('totalReach', totalReach),
    reachPercent: validateMetricValue('reachPercent', reachPercent),
    frequency: validateMetricValue('frequency', frequency),
    impressions: validateMetricValue('impressions', impressions),
    cpm: validateMetricValue('cpm', cpm),
  };
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Round a number to a specified number of decimal places
 */
export function roundToDecimals(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

/**
 * Format CPM for display (2 decimal places)
 */
export function formatCPMValue(cpm: number): number {
  return roundToDecimals(cpm, 2);
}

/**
 * Format frequency for display (2 decimal places)
 */
export function formatFrequencyValue(frequency: number): number {
  return roundToDecimals(frequency, 2);
}

/**
 * Format reach percent for display (2 decimal places)
 */
export function formatReachPercentValue(reachPercent: number): number {
  return roundToDecimals(reachPercent, 2);
}

// ============================================
// CONVENIENCE FUNCTIONS
// ============================================

/**
 * Create initial metrics object with sensible defaults
 * 
 * @param budget - Campaign budget (defaults to $50,000)
 * @param audienceSize - Audience size for saturation calculations
 */
export function createDefaultMetrics(
  budget: number = 50000,
  audienceSize: number = DEFAULT_AUDIENCE_SIZE
): CampaignMetrics {
  const reach = calculateReachFromBudget(budget, audienceSize);
  const freq = calculateFrequencyFromBudget(budget);
  const imps = calculateImpressions(reach, freq);
  
  return {
    budget,
    totalReach: reach,
    reachPercent: calculateReachPercent(reach, audienceSize),
    frequency: formatFrequencyValue(freq),
    impressions: imps,
    cpm: formatCPMValue(calculateCPM(budget, imps)),
  };
}

/**
 * Check if metrics are internally consistent (for debugging/validation)
 */
export function validateMetricsConsistency(metrics: CampaignMetrics): {
  isValid: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  
  // Check impressions = reach × frequency
  const expectedImpressions = Math.round(metrics.totalReach * metrics.frequency);
  const impressionsDiff = Math.abs(metrics.impressions - expectedImpressions);
  if (impressionsDiff > 1) { // Allow for rounding
    issues.push(`Impressions mismatch: expected ${expectedImpressions}, got ${metrics.impressions}`);
  }
  
  // Check CPM calculation
  if (metrics.impressions > 0) {
    const expectedCPM = (metrics.budget / metrics.impressions) * 1000;
    const cpmDiff = Math.abs(metrics.cpm - expectedCPM);
    if (cpmDiff > 0.01) {
      issues.push(`CPM mismatch: expected ${expectedCPM.toFixed(2)}, got ${metrics.cpm}`);
    }
  }
  
  // Check reach percent
  const expectedReachPercent = (metrics.totalReach / DEFAULT_AUDIENCE_SIZE) * 100;
  const reachPercentDiff = Math.abs(metrics.reachPercent - expectedReachPercent);
  if (reachPercentDiff > 0.1) {
    issues.push(`Reach % mismatch: expected ${expectedReachPercent.toFixed(2)}, got ${metrics.reachPercent}`);
  }
  
  return {
    isValid: issues.length === 0,
    issues,
  };
}

