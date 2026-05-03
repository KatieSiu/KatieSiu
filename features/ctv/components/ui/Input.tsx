import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/features/ctv/lib/utils";
import { Search } from "@/features/ctv/components/icons/outlined/Search";

// ============================================
// Input Variants
// ============================================
const inputVariants = cva(
  [
    "w-full",
    "bg-white",
    "border border-[#CBD2D9]",
    "rounded-[4px]",
    "px-3 py-2",
    "text-[14px] font-normal leading-[20px]",
    "text-[#1C2B33]",
    "font-optimistic",
    "placeholder:text-[rgba(28,43,51,0.65)]",
    "outline-none",
    "transition-colors",
    "focus:border-[#1877F2] focus:ring-1 focus:ring-[#1877F2]",
    "disabled:bg-[#F5F7F8] disabled:text-[#5C6970] disabled:cursor-not-allowed",
  ],
  {
    variants: {
      hasError: {
        true: "border-[#D3212C] focus:border-[#D3212C] focus:ring-[#D3212C]",
        false: "",
      },
    },
    defaultVariants: {
      hasError: false,
    },
  }
);

// ============================================
// Input Props
// ============================================
interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  /** Input variant */
  variant?: "default" | "search";
  /** Label text displayed above the input */
  label?: string;
  /** Helper text displayed below the input */
  helperText?: string;
  /** Error message displayed below the input (sets error styling) */
  errorMessage?: string;
  /** Left addon element (icon or text) */
  leftAddon?: ReactNode;
  /** Right addon element (icon or text) */
  rightAddon?: ReactNode;
  /** Container className */
  containerClassName?: string;
}

// ============================================
// Input Component
// ============================================
const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      containerClassName,
      variant = "default",
      label,
      helperText,
      errorMessage,
      leftAddon,
      rightAddon,
      hasError,
      disabled,
      ...props
    },
    ref
  ) => {
    const showError = hasError || !!errorMessage;
    
    // For search variant, use search icon as left addon
    const isSearch = variant === "search";
    const effectiveLeftAddon = isSearch 
      ? <Search className="w-4 h-4 text-[#283943]" />
      : leftAddon;

    return (
      <div className={cn("flex flex-col w-full", containerClassName)}>
        {/* Label */}
        {label && (
          <label
            className={cn(
              "text-[16px] font-bold leading-[20px]",
              "text-[#1C2B33]",
              "font-optimistic",
              "pb-1",
            )}
          >
            {label}
          </label>
        )}

        {/* Input Container */}
        <div className="relative flex items-center">
          {/* Left Addon */}
          {effectiveLeftAddon && (
            <span className="absolute left-3 flex items-center text-[#283943]">
              {effectiveLeftAddon}
            </span>
          )}

          {/* Input */}
          <input
            ref={ref}
            disabled={disabled}
            className={cn(
              inputVariants({ hasError: showError }),
              effectiveLeftAddon && "pl-10",
              rightAddon && "pr-10",
              className
            )}
            {...props}
          />

          {/* Right Addon */}
          {rightAddon && (
            <span className="absolute right-3 flex items-center text-[#5C6970]">
              {rightAddon}
            </span>
          )}
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

Input.displayName = "Input";

export { Input, inputVariants };
export type { InputProps };

