"use client";

import {
  forwardRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/features/campaign-planner/lib/utils";
import { Icon } from "./Icon";

// ============================================
// CollapsibleCard Variants
// ============================================
const collapsibleCardVariants = cva(
  [
    "bg-white",
    "rounded-[4px]",
    "shadow-[0px_0px_1px_0px_rgba(0,0,0,0.1),0px_0px_4px_0px_rgba(0,0,0,0.1)]",
    // Note: No overflow-hidden here - allows dropdowns to extend outside
  ],
  {
    variants: {},
    defaultVariants: {},
  }
);

// ============================================
// CollapsibleCard Props
// ============================================
interface CollapsibleCardProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof collapsibleCardVariants> {
  /** Card title displayed in the header */
  title: string;
  /** Whether the card is expanded by default */
  defaultExpanded?: boolean;
  /** Controlled expanded state (overrides defaultExpanded) */
  expanded?: boolean;
  /** Callback when expanded state changes */
  onExpandedChange?: (expanded: boolean) => void;
  /** Card content */
  children: ReactNode;
}

// ============================================
// CollapsibleCard Component
// ============================================
const CollapsibleCard = forwardRef<HTMLDivElement, CollapsibleCardProps>(
  (
    {
      className,
      title,
      defaultExpanded = true,
      expanded: controlledExpanded,
      onExpandedChange,
      children,
      ...props
    },
    ref
  ) => {
    // Support both controlled and uncontrolled modes
    const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
    const isControlled = controlledExpanded !== undefined;
    const isExpanded = isControlled ? controlledExpanded : internalExpanded;

    const handleToggle = () => {
      const newExpanded = !isExpanded;
      if (!isControlled) {
        setInternalExpanded(newExpanded);
      }
      onExpandedChange?.(newExpanded);
    };

    return (
      <div
        ref={ref}
        className={cn(collapsibleCardVariants(), className)}
        {...props}
      >
        {/* Header */}
        <button
          type="button"
          onClick={handleToggle}
          className={cn(
            "w-full flex items-center justify-between",
            "px-4 py-2",
            "bg-white",
            "rounded-t-[4px]",
            "cursor-pointer",
            "hover:bg-[#F5F7F8]",
            "transition-colors",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1877F2] focus-visible:ring-inset"
          )}
        >
          <span className="text-[15px] font-bold leading-[20px] text-[#1C2B33] font-optimistic">
            {title}
          </span>
          <span
            className={cn(
              "transition-transform duration-200",
              isExpanded ? "rotate-180" : "rotate-0"
            )}
          >
            <Icon
              name="CaretDownSmall"
              variant="outlined"
              size={16}
              className="text-[#283943]"
            />
          </span>
        </button>

        {/* Divider */}
        <div className="h-px bg-[#CBD2D9]" />

        {/* Content */}
        <div
          className={cn(
            "transition-all duration-200 ease-in-out",
            isExpanded
              ? "max-h-[2000px] opacity-100 overflow-visible"
              : "max-h-0 opacity-0 overflow-hidden"
          )}
        >
          <div className="px-4 py-4">{children}</div>
        </div>
      </div>
    );
  }
);

CollapsibleCard.displayName = "CollapsibleCard";

export { CollapsibleCard, collapsibleCardVariants };
export type { CollapsibleCardProps };
