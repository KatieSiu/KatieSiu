import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/features/ctv/lib/utils";
import { Icon } from "./Icon";
import { IconVariant } from "@/features/ctv/components/icons";
import { SmallTriangleDown } from "@/features/ctv/components/icons/filled/SmallTriangleDown";

const buttonVariants = cva(
  // Base styles
  "inline-flex items-center justify-center border rounded-[4px] font-optimistic transition-all duration-150 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary: [
          "bg-[#0A78BE] text-white border-transparent",
          "hover:bg-[#0061A0]",
          "active:bg-[#004B87]",
          "disabled:bg-[#C3DCF5] disabled:text-[rgba(255,255,255,0.9)] disabled:border-transparent",
        ],
        secondary: [
          "bg-white text-[#1C2B33] border-[#A7B3BF]",
          "hover:bg-[rgba(167,179,191,0.20)] hover:border-[#A7B3BF]",
          "active:bg-[rgba(167,179,191,0.40)] active:border-[#A7B3BF]",
          "disabled:bg-transparent disabled:text-[rgba(28,43,51,0.40)] disabled:border-[rgba(167,179,191,0.60)]",
        ],
        flat: [
          "bg-transparent text-[#1C2B33] border-transparent",
          "hover:bg-[rgba(0,0,0,0.05)]",
          "active:bg-[rgba(0,0,0,0.1)]",
          "disabled:bg-transparent disabled:text-[rgba(28,43,51,0.6)] disabled:border-transparent",
        ],
      },
      size: {
        default: "h-[36px] px-[12px] py-[8px] gap-2 text-[14px] font-medium leading-[20px]",
        icon: "px-[12px] py-[8px]",
      },
    },
    defaultVariants: {
      variant: "secondary",
      size: "default",
    },
  }
);

const caretColors: Record<string, string> = {
  primary: "text-white",
  secondary: "text-[#283943]",
  flat: "text-[#283943]",
};

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Show dropdown caret */
  dropdown?: boolean;
  /** Leading icon name */
  icon?: string;
  /** Icon variant */
  iconVariant?: IconVariant;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "secondary",
      size = "default",
      dropdown = false,
      icon,
      iconVariant = "outlined",
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        {icon && <Icon name={icon} variant={iconVariant} size={16} />}
        {children}
        {dropdown && (
          <Icon
            name="SmallTriangleDown"
            variant="filled"
            size={16}
            className={disabled ? "opacity-40" : caretColors[variant ?? "secondary"]}
          />
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

// IconButton - Icon-only button variant
interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    Omit<VariantProps<typeof buttonVariants>, "size"> {
  /** Icon name from the icon library */
  icon: string;
  /** Icon variant */
  iconVariant?: IconVariant;
  /** Accessible label for screen readers */
  "aria-label"?: string;
}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      className,
      variant = "secondary",
      icon,
      iconVariant = "outlined",
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(buttonVariants({ variant, size: "icon" }), className)}
        {...props}
      >
        <Icon name={icon} variant={iconVariant} size={16} />
      </button>
    );
  }
);

IconButton.displayName = "IconButton";

// ============================================
// DropdownButton - Button with thumbnail, title, subtitle
// ============================================
const dropdownButtonVariants = cva(
  [
    "inline-flex items-center gap-2",
    "bg-transparent",
    "px-3 py-2",
    "rounded-[4px]",
    "transition-colors",
    "cursor-pointer",
    "hover:bg-[rgba(0,0,0,0.05)]",
    "active:bg-[rgba(0,0,0,0.1)]",
    "disabled:cursor-not-allowed disabled:opacity-50",
  ],
  {
    variants: {},
    defaultVariants: {},
  }
);

interface DropdownButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof dropdownButtonVariants> {
  /** Title text (main label) */
  title: string;
  /** Subtitle text (secondary label) */
  subtitle?: string;
  /** Image/thumbnail element on the left */
  thumbnail?: ReactNode;
  /** Whether to show the dropdown arrow */
  showArrow?: boolean;
}

const DropdownButton = forwardRef<HTMLButtonElement, DropdownButtonProps>(
  (
    {
      className,
      title,
      subtitle,
      thumbnail,
      showArrow = true,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(dropdownButtonVariants(), className)}
        {...props}
      >
        {/* Thumbnail */}
        {thumbnail && (
          <span className="shrink-0 w-8 h-8 rounded overflow-hidden">
            {thumbnail}
          </span>
        )}

        {/* Text Content */}
        <div className="flex flex-col items-start min-w-0">
          <span
            className={cn(
              "text-[16px] font-bold leading-[20px]",
              "text-[rgba(0,0,0,0.85)]",
              "font-optimistic",
              "truncate w-full text-left",
            )}
          >
            {title}
          </span>
          {subtitle && (
            <span
              className={cn(
                "text-[12px] font-normal leading-[16px]",
                "text-[#1C2B33]",
                "font-optimistic",
                "truncate w-full text-left",
              )}
            >
              {subtitle}
            </span>
          )}
        </div>

        {/* Dropdown Arrow */}
        {showArrow && (
          <SmallTriangleDown className="shrink-0 w-4 h-4 text-[#283943]" />
        )}
      </button>
    );
  }
);

DropdownButton.displayName = "DropdownButton";

export { Button, IconButton, DropdownButton, buttonVariants, dropdownButtonVariants };
export type { ButtonProps, IconButtonProps, DropdownButtonProps };
