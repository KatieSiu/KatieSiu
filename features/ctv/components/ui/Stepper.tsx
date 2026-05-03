"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/features/ctv/lib/utils";
import { Icon } from "./Icon";

// ============================================
// Step Status Types
// ============================================
type StepStatus = "completed" | "current" | "upcoming";

// ============================================
// Stepper Container
// ============================================
interface StepperProps extends HTMLAttributes<HTMLDivElement> {
  /** Title displayed above the steps */
  title?: string;
  /** Current step index (0-based) */
  currentStep: number;
  /** Callback when a step is clicked */
  onStepClick?: (index: number) => void;
}

const StepperRoot = forwardRef<HTMLDivElement, StepperProps>(
  ({ className, title, currentStep, onStepClick, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col gap-2",
          "bg-[#F1F4F7]",
          "p-4",
          "w-[204px]",
          "shrink-0",
          "shadow-[2px_0px_4px_0px_rgba(0,0,0,0.08)]",
          className
        )}
        {...props}
      >
        {title && (
          <div className="pb-1">
            <p className="text-[16px] font-bold leading-[20px] text-[#1C2B33] font-optimistic">
              {title}
            </p>
          </div>
        )}
        <div className="flex flex-col gap-1">
          {children}
        </div>
      </div>
    );
  }
);

StepperRoot.displayName = "Stepper";

// ============================================
// Step Item
// ============================================
const stepVariants = cva(
  [
    "flex items-center gap-2",
    "h-[38px]",
    "px-2 py-2",
    "rounded-[4px]",
    "transition-colors",
    "w-full",
  ],
  {
    variants: {
      status: {
        completed: [
          "cursor-pointer",
          "hover:bg-[rgba(0,0,0,0.05)]",
        ],
        current: [
          "bg-[#E1EDF7]",
        ],
        upcoming: [
          "cursor-pointer",
          "hover:bg-[rgba(0,0,0,0.05)]",
        ],
      },
    },
    defaultVariants: {
      status: "upcoming",
    },
  }
);

interface StepProps extends HTMLAttributes<HTMLButtonElement>, VariantProps<typeof stepVariants> {
  /** Step label */
  label: string;
  /** Step icon name */
  icon?: string;
  /** Step status */
  status: StepStatus;
  /** Whether this step has a connector line above */
  showTopConnector?: boolean;
  /** Whether this step has a connector line below */
  showBottomConnector?: boolean;
}

const Step = forwardRef<HTMLButtonElement, StepProps>(
  (
    {
      className,
      label,
      icon,
      status,
      showTopConnector = false,
      showBottomConnector = false,
      onClick,
      ...props
    },
    ref
  ) => {
    const textColor = status === "current" ? "#0A78BE" : status === "completed" ? "#1C2B33" : "#1C2B33";
    const fontWeight = status === "current" ? "font-bold" : "font-normal";

    const renderStepIcon = () => {
      switch (status) {
        case "completed":
          return <Icon name="CheckCircle" variant="filled" size={20} className="text-[#007E59]" />;
        case "current":
          return <Icon name="CircleHalf" variant="filled" size={20} className="text-[#0A78BE]" />;
        case "upcoming":
        default:
          return <Icon name="Circle" variant="outlined" size={20} className="text-[#8D9CA8]" />;
      }
    };

    return (
      <button
        ref={ref}
        type="button"
        className={cn(stepVariants({ status }), className)}
        onClick={onClick}
        {...props}
      >
        {/* Step Icon with connectors */}
        <div className="flex flex-col items-center gap-1 py-[1px]">
          {/* Top connector */}
          <div className="h-1 w-1">
            {showTopConnector && (
              <div className="w-1 h-1 rounded-full bg-[#8D9CA8]" />
            )}
          </div>
          
          {/* Icon */}
          <div className="w-5 h-5 flex items-center justify-center">
            {renderStepIcon()}
          </div>
          
          {/* Bottom connector */}
          <div className="h-1 w-1">
            {showBottomConnector && (
              <div className="w-1 h-1 rounded-full bg-[#8D9CA8]" />
            )}
          </div>
        </div>

        {/* Label */}
        <span
          className={cn(
            "text-[15px] leading-[20px] font-optimistic whitespace-nowrap",
            fontWeight
          )}
          style={{ color: textColor }}
        >
          {label}
        </span>
      </button>
    );
  }
);

Step.displayName = "Step";

// ============================================
// Compound Component Export
// ============================================
const Stepper = Object.assign(StepperRoot, {
  Step,
});

export { Stepper, stepVariants };
export type { StepperProps, StepProps, StepStatus };
