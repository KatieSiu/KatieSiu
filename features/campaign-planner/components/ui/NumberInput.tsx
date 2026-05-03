"use client";

import {
  forwardRef,
  type InputHTMLAttributes,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/features/campaign-planner/lib/utils";
import { Icon } from "./Icon";

// ============================================
// NumberInput Variants
// ============================================
const numberInputVariants = cva(
  [
    "bg-white",
    "border border-[#CBD2D9]",
    "rounded-[4px]",
    "text-[14px] font-normal leading-[20px]",
    "text-[#1C2B33]",
    "font-optimistic",
    "outline-none",
    "transition-colors",
    "focus-within:border-[#1877F2] focus-within:ring-1 focus-within:ring-[#1877F2]",
    "disabled:bg-[#F5F7F8] disabled:text-[#5C6970] disabled:cursor-not-allowed",
  ],
  {
    variants: {
      hasError: {
        true: "border-[#D3212C] focus-within:border-[#D3212C] focus-within:ring-[#D3212C]",
        false: "",
      },
    },
    defaultVariants: {
      hasError: false,
    },
  }
);

// ============================================
// NumberInput Props
// ============================================
interface NumberInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange" | "value">,
    VariantProps<typeof numberInputVariants> {
  /** Current value */
  value: number;
  /** Callback when value changes */
  onChange: (value: number) => void;
  /** Minimum allowed value */
  min?: number;
  /** Maximum allowed value */
  max?: number;
  /** Step increment/decrement amount */
  step?: number;
  /** Label text displayed above the input */
  label?: string;
  /** Helper text displayed below the input */
  helperText?: string;
  /** Error message displayed below the input */
  errorMessage?: string;
  /** Container className */
  containerClassName?: string;
}

// ============================================
// NumberInput Component
// ============================================
const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      className,
      containerClassName,
      value,
      onChange,
      min,
      max,
      step = 1,
      label,
      helperText,
      errorMessage,
      hasError,
      disabled,
      ...props
    },
    ref
  ) => {
    const showError = hasError || !!errorMessage;

    const handleIncrement = () => {
      if (disabled) return;
      const newValue = value + step;
      if (max !== undefined && newValue > max) return;
      onChange(newValue);
    };

    const handleDecrement = () => {
      if (disabled) return;
      const newValue = value - step;
      if (min !== undefined && newValue < min) return;
      onChange(newValue);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseInt(e.target.value, 10);
      if (isNaN(newValue)) return;
      if (min !== undefined && newValue < min) return;
      if (max !== undefined && newValue > max) return;
      onChange(newValue);
    };

    return (
      <div className={cn("flex flex-col", containerClassName)}>
        {/* Label */}
        {label && (
          <label
            className={cn(
              "text-[14px] font-bold leading-[20px]",
              "text-[#1C2B33]",
              "font-optimistic",
              "pb-1"
            )}
          >
            {label}
          </label>
        )}

        {/* Input Container */}
        <div
          className={cn(
            numberInputVariants({ hasError: showError }),
            "flex items-center h-[36px] px-3",
            className
          )}
        >
          {/* Input */}
          <input
            ref={ref}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={value}
            onChange={handleInputChange}
            disabled={disabled}
            className={cn(
              "flex-1 min-w-0",
              "bg-transparent",
              "text-[14px] font-normal leading-[20px]",
              "text-[#1C2B33]",
              "font-optimistic",
              "outline-none",
              "disabled:text-[#5C6970] disabled:cursor-not-allowed"
            )}
            {...props}
          />

          {/* Stepper Arrows */}
          <div className="flex flex-col items-center ml-2">
            <button
              type="button"
              onClick={handleIncrement}
              disabled={disabled || (max !== undefined && value >= max)}
              className={cn(
                "flex items-center justify-center",
                "w-[12px] h-[12px]",
                "text-[rgba(0,0,0,0.75)]",
                "hover:text-[#1C2B33]",
                "disabled:text-[#CBD2D9] disabled:cursor-not-allowed",
                "transition-colors"
              )}
              aria-label="Increase value"
            >
              <Icon
                name="CaretDownSmall"
                variant="outlined"
                size={12}
                className="rotate-180"
              />
            </button>
            <button
              type="button"
              onClick={handleDecrement}
              disabled={disabled || (min !== undefined && value <= min)}
              className={cn(
                "flex items-center justify-center",
                "w-[12px] h-[12px]",
                "text-[rgba(0,0,0,0.75)]",
                "hover:text-[#1C2B33]",
                "disabled:text-[#CBD2D9] disabled:cursor-not-allowed",
                "transition-colors"
              )}
              aria-label="Decrease value"
            >
              <Icon
                name="CaretDownSmall"
                variant="outlined"
                size={12}
              />
            </button>
          </div>
        </div>

        {/* Helper Text or Error Message */}
        {(helperText || errorMessage) && (
          <p
            className={cn(
              "text-[12px] font-normal leading-[16px] mt-1",
              "font-optimistic",
              errorMessage ? "text-[#D3212C]" : "text-[#5C6970]"
            )}
          >
            {errorMessage || helperText}
          </p>
        )}
      </div>
    );
  }
);

NumberInput.displayName = "NumberInput";

export { NumberInput, numberInputVariants };
export type { NumberInputProps };
