import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/features/ctv/lib/utils";

// ============================================
// Header Variants
// ============================================
const headerVariants = cva(
  [
    "flex flex-col",
    "w-full",
  ],
  {
    variants: {},
    defaultVariants: {},
  }
);

// ============================================
// Header Props
// ============================================
interface HeaderProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof headerVariants> {
  /** Header text */
  children: ReactNode;
  /** Icon to display on the left side (16px) */
  leftIcon?: ReactNode;
  /** Icon to display on the right side (12px) */
  rightIcon?: ReactNode;
  /** Optional description text below the header */
  description?: ReactNode;
}

// ============================================
// Header Component
// ============================================
const Header = forwardRef<HTMLDivElement, HeaderProps>(
  ({ className, children, leftIcon, rightIcon, description, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(headerVariants(), "gap-2", className)}
        {...props}
      >
        {/* Title Row */}
        <div className="flex items-center gap-2 h-[20px] w-full">
          {/* Left Icon (16px) */}
          {leftIcon && (
            <span className="shrink-0 w-[16px] h-[16px] flex items-center justify-center">
              {leftIcon}
            </span>
          )}
          
          {/* Title with optional right icon */}
          <div className="flex flex-1 items-center gap-1 min-w-0">
            <span
              className={cn(
                "text-[16px] font-bold leading-[20px]",
                "text-[#1C2B33]",
                "font-optimistic",
                "truncate",
              )}
            >
              {children}
            </span>
            
            {/* Right Icon (12px) */}
            {rightIcon && (
              <span className="shrink-0 w-[12px] h-[12px] flex items-center justify-center text-[#283943]">
                {rightIcon}
              </span>
            )}
          </div>
        </div>
        
        {/* Optional Description */}
        {description && (
          <p
            className={cn(
              "text-[14px] font-normal leading-[20px]",
              "text-[#1C2B33]",
              "font-optimistic",
              "w-full",
            )}
          >
            {description}
          </p>
        )}
      </div>
    );
  }
);

Header.displayName = "Header";

export { Header, headerVariants };
export type { HeaderProps };

