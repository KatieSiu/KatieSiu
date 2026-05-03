// ============================================
// Design Tokens - Centralized Design System Values
// ============================================

export const colors = {
  // Text
  text: {
    heading: "#1C2B33",
    value: "#1C2B33",
    primary: "#050505",
    secondary: "#465A69",
    muted: "rgba(70,90,105,0.6)",
    placeholder: "rgba(28,43,51,0.65)",
    disabled: "rgba(28,43,51,0.40)",
  },
  
  // Interactive
  interactive: {
    primary: "#1877F2",
    primaryHover: "#0A78BE",
    primaryActive: "#0061A0",
    flat: "rgba(0,0,0,0.05)",
    flatActive: "rgba(0,0,0,0.1)",
    hoverBg: "#ECF4FE",
    hoverBgLight: "rgba(10,120,190,0.05)",
    hoverBorder: "rgba(10,120,190,0.4)",
  },
  
  // Background
  background: {
    page: "#F5F7F8",
    content: "#FFFFFF",
    disabled: "#F5F7F8",
    hover: "#ECF4FE",
  },
  
  // Border
  border: {
    primary: "#CBD2D9",
    secondary: "#E4E8EB",
    card: "#E2E5E9",
    element: "rgba(0,0,0,0.15)",
  },
  
  // Status
  status: {
    success: "#006B4E",
    error: "#D3212C",
    warning: "#F5A623",
    info: "#0A78BE",
  },
  
  // Icon
  icon: {
    default: "#283943",
    secondary: "#5C6970",
    success: "#006B4E",
    error: "#A20C17",
  },
  
  // Data Visualization
  dataviz: {
    blue: "#1D85FC",
    blueHover: "rgba(29, 133, 252, 0.08)",
  },
  
  // Ad Set Colors (for charts and table indicators)
  adSet: [
    "#83C8C0", // 1. Teal
    "#7373BE", // 2. Purple
    "#3D92CA", // 3. Blue
    "#AF5000", // 4. Orange
    "#007A80", // 5. Dark Teal
    "#E36064", // 6. Coral
    "#4B0550", // 7. Dark Purple
    "#A0D9F7", // 8. Light Blue
  ] as const,
  
  // Chart-specific
  chart: {
    gridLine: "#D0D3D7",
    axisLabel: "#65676B",
    tooltipMuted: "rgba(70,90,105,0.6)",
  },
} as const;

export const spacing = {
  0: "0px",
  1: "4px",
  2: "8px",
  3: "12px",
  4: "16px",
  5: "20px",
  6: "24px",
  8: "32px",
  10: "40px",
  12: "48px",
  16: "64px",
} as const;

export const typography = {
  // Font families
  fontFamily: {
    optimistic: "var(--font-optimistic), system-ui, sans-serif",
  },
  
  // Font sizes
  fontSize: {
    xs: "12px",
    sm: "14px",
    base: "16px",
    lg: "18px",
    xl: "20px",
    "2xl": "24px",
  },
  
  // Line heights
  lineHeight: {
    tight: "16px",
    normal: "20px",
    relaxed: "24px",
  },
  
  // Font weights
  fontWeight: {
    normal: "400",
    medium: "500",
    bold: "700",
  },
} as const;

export const borderRadius = {
  none: "0px",
  sm: "2px",
  base: "4px",
  md: "6px",
  lg: "8px",
  full: "999px",
} as const;

export const shadows = {
  sm: "0px 1px 2px 0px rgba(0,0,0,0.05)",
  base: "0px 1px 3px 0px rgba(0,0,0,0.1), 0px 1px 2px -1px rgba(0,0,0,0.1)",
  md: "0px 4px 6px -1px rgba(0,0,0,0.1), 0px 2px 4px -2px rgba(0,0,0,0.1)",
  lg: "0px 8px 24px 4px rgba(0,0,0,0.1), 0px 2px 2px 0px rgba(0,0,0,0.1)",
} as const;

// Type exports for TypeScript
export type Colors = typeof colors;
export type Spacing = typeof spacing;
export type Typography = typeof typography;
export type BorderRadius = typeof borderRadius;
export type Shadows = typeof shadows;

