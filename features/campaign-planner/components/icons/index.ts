// Master icon registry - organizes icons by variant
// Import all variants
import * as FilledIcons from "./filled";
import * as OutlinedIcons from "./outlined";
import * as XsIcons from "./xs";

// Icon registry organized by variant
export const iconRegistry = {
  filled: FilledIcons,
  outlined: OutlinedIcons,
  xs: XsIcons,
} as const;

// Export variant types
export type IconVariant = keyof typeof iconRegistry;

// Get all icon names from a specific variant
export type FilledIconName = keyof typeof FilledIcons;
export type OutlinedIconName = keyof typeof OutlinedIcons;
export type XsIconName = keyof typeof XsIcons;

// Union of all possible icon names
export type IconName = FilledIconName | OutlinedIconName | XsIconName;

// Re-export individual variant collections for direct access if needed
export { FilledIcons, OutlinedIcons, XsIcons };
