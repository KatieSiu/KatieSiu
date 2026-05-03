import { forwardRef, type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/features/ctv/lib/utils";
import { Icon } from "./Icon";
import { IconVariant } from "@/features/ctv/components/icons";

const pillVariants = cva(
  // Base styles - matches Figma design
  "inline-flex items-center justify-center gap-1 px-1.5 py-0 text-[12px] font-bold leading-[16px] rounded-full font-optimistic",
  {
    variants: {
      variant: {
        default: "bg-[#F1F4F7] text-[#1C2B33]",
        success: "bg-[#EBF2E6] text-[#006B4E]",
        warning: "bg-[#FFF1E0] text-[#B35401]",
        error: "bg-[#A20C17] text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const iconColors: Record<NonNullable<VariantProps<typeof pillVariants>["variant"]>, string> = {
  default: "text-[#344854]",
  success: "text-[#006B4E]",
  warning: "text-[#B35401]",
  error: "text-white",
};

interface PillProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof pillVariants> {
  icon?: string;
  iconVariant?: IconVariant;
}

const Pill = forwardRef<HTMLSpanElement, PillProps>(
  ({ className, variant = "default", icon, iconVariant = "outlined", children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(pillVariants({ variant }), className)}
        {...props}
      >
        {icon && (
          <Icon
            name={icon}
            variant={iconVariant}
            size={12}
            className={iconColors[variant ?? "default"]}
          />
        )}
        {children}
      </span>
    );
  }
);

Pill.displayName = "Pill";

export { Pill, pillVariants };
export type { PillProps };
