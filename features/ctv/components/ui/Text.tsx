import { ReactNode } from "react";

type TextVariant = 
  | "appName"
  | "header1"
  | "header2"
  | "header3"
  | "header4"
  | "label"
  | "value"
  | "valueDescription"
  | "valueDescriptionBold";

type TextColor =
  | "primary"
  | "value"
  | "description"
  | "disabled"
  | "placeholder"
  | "link"
  | "info"
  | "infoDisabled"
  | "error"
  | "errorDisabled"
  | "success"
  | "successDisabled"
  | "warning"
  | "warningDisabled"
  | "onboarding"
  | "onboardingDisabled";

interface TextProps {
  children: ReactNode;
  variant?: TextVariant;
  color?: TextColor;
  className?: string;
  as?: "p" | "span" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "label";
}

// Typography styles from Figma
const variantStyles: Record<TextVariant, string> = {
  appName: "text-[24px] font-bold leading-[28px]",
  header1: "text-[20px] font-bold leading-[24px]",
  header2: "text-[18px] font-bold leading-[22px]",
  header3: "text-[16px] font-bold leading-[20px]",
  header4: "text-[15px] font-bold leading-[20px]",
  label: "text-[14px] font-medium leading-[20px]",
  value: "text-[14px] font-normal leading-[20px]",
  valueDescription: "text-[12px] font-normal leading-[16px]",
  valueDescriptionBold: "text-[12px] font-bold leading-[16px]",
};

// Color styles from Figma
const colorStyles: Record<TextColor, string> = {
  primary: "text-[#1C2B33]",
  value: "text-[#1C2B33]",
  description: "text-[#465A69]",
  disabled: "text-[rgba(28,43,51,0.6)]",
  placeholder: "text-[rgba(28,43,51,0.65)]",
  link: "text-[#0A78BE]",
  info: "text-[#344854]",
  infoDisabled: "text-[rgba(52,72,84,0.6)]",
  error: "text-[#A20C17]",
  errorDisabled: "text-[rgba(162,12,23,0.6)]",
  success: "text-[#006B4E]",
  successDisabled: "text-[rgba(0,107,78,0.6)]",
  warning: "text-[#B35401]",
  warningDisabled: "text-[rgba(179,84,1,0.6)]",
  onboarding: "text-[#543E8F]",
  onboardingDisabled: "text-[rgba(84,62,143,0.6)]",
};

export function Text({
  children,
  variant = "value",
  color = "primary",
  className = "",
  as: Component = "p",
}: TextProps) {
  return (
    <Component
      className={`
        font-optimistic
        ${variantStyles[variant]}
        ${colorStyles[color]}
        ${className}
      `}
    >
      {children}
    </Component>
  );
}

// Export types for external use
export type { TextVariant, TextColor, TextProps };

