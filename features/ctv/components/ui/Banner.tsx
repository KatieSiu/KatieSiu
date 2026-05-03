"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/features/ctv/lib/utils";
import { Icon } from "./Icon";

// ============================================
// Banner Variants
// ============================================
const bannerVariants = cva(
  // Base styles - full width, flex layout, centered items
  [
    "flex items-center gap-2",
    "px-3",
    "w-full",
    "rounded-[4px]",
  ],
  {
    variants: {
      variant: {
        info: "bg-[#CBD2D9]",
        warning: "bg-[#FCDBB6]",
      },
      hasDescription: {
        true: "py-2", // Standard padding when description present
        false: "h-[52px]", // Fixed height when no description
      },
    },
    defaultVariants: {
      variant: "info",
      hasDescription: false,
    },
  }
);

// ============================================
// Banner Button Styles (Flat variant)
// ============================================
const bannerButtonStyles = cn(
  "shrink-0",
  "inline-flex items-center justify-center",
  "h-9 px-3 py-2",
  "bg-transparent border-transparent rounded-[4px]",
  "text-[14px] font-medium leading-[20px] text-[#1C2B33] font-optimistic",
  "transition-colors cursor-pointer",
  "hover:bg-[rgba(0,0,0,0.05)]",
  "active:bg-[rgba(0,0,0,0.1)]"
);

// ============================================
// Banner Props
// ============================================
interface BannerProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof bannerVariants> {
  /** Banner title (required) */
  title: string;
  /** Optional description text */
  description?: ReactNode;
  /** Optional button text - shows button if provided */
  buttonText?: string;
  /** Button click handler */
  onButtonClick?: () => void;
}

// ============================================
// Banner Component
// ============================================
const Banner = forwardRef<HTMLDivElement, BannerProps>(
  (
    {
      className,
      variant = "info",
      title,
      description,
      buttonText,
      onButtonClick,
      ...props
    },
    ref
  ) => {
    // Determine which icon to show based on variant
    const iconName = variant === "warning" ? "WarningTriangle" : "Info";
    const hasDescription = !!description;

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(bannerVariants({ variant, hasDescription }), className)}
        {...props}
      >
        {/* Icon + Text Container */}
        <div className="flex flex-1 items-center gap-2 min-w-0">
          {/* Icon */}
          <span className="shrink-0">
            <Icon name={iconName} variant="outlined" size={24} className="text-[#283943]" />
          </span>

          {/* Text Content */}
          <div className="flex flex-col min-w-0">
            <span className="text-[15px] font-bold leading-[20px] text-[#1C2B33] font-optimistic">
              {title}
            </span>
            {description && (
              <span className="text-[12px] font-normal leading-[16px] text-[#1C2B33] font-optimistic">
                {description}
              </span>
            )}
          </div>
        </div>

        {/* Optional Button */}
        {buttonText && (
          <button
            type="button"
            className={bannerButtonStyles}
            onClick={onButtonClick}
          >
            {buttonText}
          </button>
        )}
      </div>
    );
  }
);

Banner.displayName = "Banner";

export { Banner, bannerVariants };
export type { BannerProps };

