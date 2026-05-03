import { forwardRef, type ImgHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/features/ctv/lib/utils";

// ============================================
// Avatar Variants
// ============================================
const avatarVariants = cva(
  [
    "rounded-full",
    "overflow-hidden",
    "shrink-0",
    "bg-[#E4E8EB]",
    "object-cover",
  ],
  {
    variants: {
      size: {
        16: "w-4 h-4",
        24: "w-6 h-6",
        32: "w-8 h-8",
        48: "w-12 h-12",
        64: "w-16 h-16",
      },
    },
    defaultVariants: {
      size: 32,
    },
  }
);

// ============================================
// Avatar Props
// ============================================
interface AvatarProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, "size">,
    VariantProps<typeof avatarVariants> {
  /** Image source URL */
  src?: string;
  /** Alt text for accessibility */
  alt?: string;
  /** Fallback initials when no image */
  initials?: string;
}

// ============================================
// Avatar Component
// ============================================
const Avatar = forwardRef<HTMLImageElement, AvatarProps>(
  ({ className, src, alt = "", initials, size = 32, ...props }, ref) => {
    // If no src provided, show initials fallback
    if (!src && initials) {
      return (
        <div
          className={cn(
            avatarVariants({ size }),
            "flex items-center justify-center",
            "bg-[#CBD2D9]",
            "text-[#1C2B33]",
            "font-optimistic font-medium",
            size === 16 && "text-[8px]",
            size === 24 && "text-[10px]",
            size === 32 && "text-[12px]",
            size === 48 && "text-[16px]",
            size === 64 && "text-[20px]",
            className
          )}
        >
          {initials.slice(0, 2).toUpperCase()}
        </div>
      );
    }

    // If no src and no initials, show empty placeholder
    if (!src) {
      return (
        <div
          className={cn(
            avatarVariants({ size }),
            "bg-[#E4E8EB]",
            className
          )}
        />
      );
    }

    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        className={cn(avatarVariants({ size }), className)}
        {...props}
      />
    );
  }
);

Avatar.displayName = "Avatar";

export { Avatar, avatarVariants };
export type { AvatarProps };

