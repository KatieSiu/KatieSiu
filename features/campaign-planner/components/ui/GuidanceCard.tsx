"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/features/campaign-planner/lib/utils";
import { Icon } from "./Icon";

// ============================================
// GuidanceCard Variants Configuration
// ============================================

// Variant-specific styling
const variantConfig = {
  activeFeedback: {
    borderColor: "bg-[#0A78BE]",
    iconColor: "text-[#0A78BE]",
    icon: "Info",
  },
  help: {
    borderColor: "bg-[#89A1AC]",
    iconColor: "text-[#89A1AC]",
    icon: "Help",
  },
  success: {
    borderColor: "bg-[#007E59]",
    iconColor: "text-[#007E59]",
    icon: "WarningCircle", // Note: Ideally use CheckmarkCircle if available
  },
  warning: {
    borderColor: "bg-[#D27805]",
    iconColor: "text-[#D27805]",
    icon: "WarningTriangle",
  },
  error: {
    borderColor: "bg-[#DC373C]",
    iconColor: "text-[#DC373C]",
    icon: "WarningTriangle",
  },
} as const;

// ============================================
// GuidanceCard CVA Variants
// ============================================
const guidanceCardVariants = cva(
  // Base styles
  [
    "relative",
    "w-full",
  ],
  {
    variants: {
      variant: {
        activeFeedback: "",
        help: "",
        success: "",
        warning: "",
        error: "",
      },
    },
    defaultVariants: {
      variant: "activeFeedback",
    },
  }
);

// ============================================
// GuidanceCard Props
// ============================================
interface GuidanceCardProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof guidanceCardVariants> {
  /** Card title (required) */
  title: string;
  /** Card content/description */
  children?: ReactNode;
}

// ============================================
// GuidanceCard Component
// ============================================
const GuidanceCard = forwardRef<HTMLDivElement, GuidanceCardProps>(
  (
    {
      className,
      variant = "activeFeedback",
      title,
      children,
      ...props
    },
    ref
  ) => {
    const config = variantConfig[variant ?? "activeFeedback"];

    return (
      <div
        ref={ref}
        className={cn(guidanceCardVariants({ variant }), className)}
        {...props}
      >
        {/* Card Container with Shadow */}
        <div className="flex shadow-[0px_0px_1px_0px_rgba(0,0,0,0.1),0px_0px_4px_0px_rgba(0,0,0,0.1)]">
          {/* Left Colored Border Strip */}
          <div
            className={cn(
              "w-1 shrink-0 rounded-l-[4px]",
              config.borderColor
            )}
          />

          {/* Main Card Content */}
          <div className="flex-1 bg-white rounded-r-[4px] p-3">
            {/* Icon + Content Row */}
            <div className="flex gap-2">
              {/* Icon */}
              <div className="shrink-0 pt-[2px]">
                <Icon
                  name={config.icon}
                  variant="outlined"
                  size={16}
                  className={config.iconColor}
                />
              </div>

              {/* Text Content */}
              <div className="flex flex-col gap-2 min-w-0">
                {/* Title */}
                <h4 className="text-[15px] font-bold leading-[20px] text-[#1C2B33] font-optimistic">
                  {title}
                </h4>

                {/* Description/Content */}
                {children && (
                  <div className="text-[14px] font-normal leading-[20px] text-[#1C2B33] font-optimistic">
                    {children}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

GuidanceCard.displayName = "GuidanceCard";

export { GuidanceCard, guidanceCardVariants };
export type { GuidanceCardProps };

