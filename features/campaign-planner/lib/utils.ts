import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ============================================
// Shared Interactive Field Styles
// ============================================
// Use these for inputs, dropdown triggers, and custom form fields
// to ensure consistent hover/focus behavior across all modals

export const interactiveFieldStyles = {
  // Base styles - always apply these
  base: [
    "bg-white",
    "border",
    "border-[#CBD2D9]",
    "rounded-[4px]",
    "transition-colors",
  ].join(" "),

  // Hover state - for direct focus elements (inputs)
  hover: "hover:bg-[rgba(0,0,0,0.05)]",

  // Focus state - for direct focus (standard inputs)
  // Includes bg-white to override hover background when focused
  focus: "focus:border-[#1877F2] focus:ring-1 focus:ring-[#1877F2] focus:bg-white",

  // Focus-within state - for container elements with nested inputs
  focusWithin: "focus-within:border-[#1877F2] focus-within:ring-1 focus-within:ring-[#1877F2]",

  // Active/pressed state
  active: "active:bg-[rgba(0,0,0,0.1)]",
};

// Combined class strings for common use cases
export const interactiveField = {
  // For standard input elements (Input component)
  input: cn(
    interactiveFieldStyles.base,
    interactiveFieldStyles.hover,
    interactiveFieldStyles.focus
  ),

  // For dropdown triggers and custom buttons
  trigger: cn(
    interactiveFieldStyles.base,
    interactiveFieldStyles.hover,
    interactiveFieldStyles.active
  ),

  // For containers with nested inputs (date/time fields)
  // Uses arbitrary selector to only show hover when NOT focus-within
  container: [
    interactiveFieldStyles.base,
    "[&:not(:focus-within)]:hover:bg-[rgba(0,0,0,0.05)]",
    interactiveFieldStyles.focusWithin,
  ].join(" "),
};

// Helper to get trigger styles with open state
export function getTriggerStyles(isOpen: boolean): string {
  if (isOpen) {
    return cn(
      interactiveFieldStyles.base,
      "border-[#1877F2] ring-1 ring-[#1877F2]"
    );
  }
  return interactiveField.trigger;
}

// ============================================
// Number Formatting Utilities
// ============================================
// Use these for currency/budget inputs across all modals

/**
 * Format a number string with commas (e.g., "1000000.50" → "1,000,000.50")
 * Supports up to 2 decimal places
 * Used for Display state
 */
export function formatWithCommas(value: string): string {
  // Remove all non-numeric characters except decimal point
  const cleanValue = value.replace(/[^0-9.]/g, "");
  if (!cleanValue) return "";
  
  // Split into integer and decimal parts
  const parts = cleanValue.split(".");
  const integerPart = parts[0];
  const decimalPart = parts[1];
  
  // Format integer part with commas
  const formattedInteger = Number(integerPart).toLocaleString("en-US");
  
  // If there's a decimal part, append it (up to 2 digits)
  if (decimalPart !== undefined) {
    return `${formattedInteger}.${decimalPart.slice(0, 2)}`;
  }
  
  return formattedInteger;
}

/**
 * Strip commas from a number string (e.g., "1,000,000.50" → "1000000.50")
 * Used for Edit state
 */
export function stripCommas(value: string): string {
  return value.replace(/,/g, "");
}

/**
 * Round a number string to 2 decimal places (rounds up)
 * e.g., "1000.555" → "1000.56", "1000.551" → "1000.56"
 */
export function roundToHundredths(value: string): string {
  const cleanValue = value.replace(/[^0-9.]/g, "");
  if (!cleanValue) return "";
  
  const num = parseFloat(cleanValue);
  if (isNaN(num)) return value;
  
  // Round up to nearest hundredth (2 decimal places)
  const rounded = Math.ceil(num * 100) / 100;
  
  // Format with up to 2 decimal places (only if there are decimals)
  if (rounded % 1 === 0) {
    return rounded.toString();
  }
  return rounded.toFixed(2);
}

