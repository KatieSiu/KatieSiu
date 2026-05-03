"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/features/ctv/lib/utils";
import { Icon } from "./Icon";

// ============================================
// Media Item Types
// ============================================
export interface MediaItem {
  id: string;
  name: string;
  dimensions?: string;
  thumbnail?: string;
  type?: "image" | "video";
}

// ============================================
// MediaGrid Container
// ============================================
interface MediaGridProps extends HTMLAttributes<HTMLDivElement> {
  /** Section title */
  title?: string;
  /** Show "See all" link */
  showSeeAll?: boolean;
  /** Callback for "See all" click */
  onSeeAllClick?: () => void;
  /** Icon to show before title */
  titleIcon?: string;
  /** Icon variant for title icon */
  titleIconVariant?: "outlined" | "filled";
  /** Layout mode - wrap or horizontal scroll */
  layout?: "wrap" | "horizontal";
}

const MediaGridRoot = forwardRef<HTMLDivElement, MediaGridProps>(
  ({ className, title, showSeeAll, onSeeAllClick, titleIcon, titleIconVariant = "outlined", layout = "wrap", children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex flex-col gap-3 bg-white rounded-[8px] p-4", className)} {...props}>
        {/* Header */}
        {(title || showSeeAll) && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {titleIcon && (
                <div className="w-6 h-6 rounded bg-[#F5F7F8] flex items-center justify-center">
                  <Icon name={titleIcon} variant={titleIconVariant} size={16} className="text-[#465A69]" />
                </div>
              )}
              {title && (
                <span className="text-[14px] font-medium leading-[20px] text-[#1C2B33] font-optimistic">
                  {title}
                </span>
              )}
            </div>
            {showSeeAll && (
              <button
                type="button"
                onClick={onSeeAllClick}
                className="text-[14px] font-normal leading-[20px] text-[#0A78BE] font-optimistic hover:underline"
              >
                See all
              </button>
            )}
          </div>
        )}
        
        {/* Grid */}
        <div className={cn(
          layout === "horizontal" 
            ? "flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-[#CBD2D9] scrollbar-track-transparent" 
            : "flex flex-wrap gap-3"
        )}>
          {children}
        </div>
      </div>
    );
  }
);

MediaGridRoot.displayName = "MediaGrid";

// ============================================
// Media Grid Item
// ============================================
interface MediaGridItemProps extends Omit<HTMLAttributes<HTMLButtonElement>, 'onSelect'> {
  /** Media item data */
  item: MediaItem;
  /** Whether this item is selected */
  isSelected?: boolean;
  /** Callback when item is clicked */
  onSelect?: (item: MediaItem) => void;
  /** Size variant */
  size?: "small" | "medium" | "large";
}

const MediaGridItem = forwardRef<HTMLButtonElement, MediaGridItemProps>(
  ({ className, item, isSelected, onSelect, size = "small", ...props }, ref) => {
    const sizeClasses = {
      small: "w-[72px]",
      medium: "w-[88px]",
      large: "w-[120px]",
    };

    const thumbnailSizes = {
      small: "h-[72px]",
      medium: "h-[88px]",
      large: "h-[120px]",
    };

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "flex flex-col gap-1 shrink-0",
          sizeClasses[size],
          "group cursor-pointer",
          className
        )}
        onClick={() => onSelect?.(item)}
        {...props}
      >
        {/* Thumbnail */}
        <div
          className={cn(
            "relative w-full rounded-[4px] overflow-hidden",
            thumbnailSizes[size],
            !item.thumbnail && "bg-[#F5F7F8]",
            "border-2 transition-colors",
            isSelected ? "border-[#0A78BE]" : "border-transparent",
            "group-hover:border-[#CBD2D9]",
            isSelected && "group-hover:border-[#0A78BE]"
          )}
        >
          {item.thumbnail ? (
            <img
              src={item.thumbnail}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Icon
                name={item.type === "video" ? "Video" : "Photo"}
                variant="outlined"
                size={24}
                className="text-[#CBD2D9]"
              />
            </div>
          )}
          
          {/* Selection indicator */}
          {isSelected && (
            <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[#0A78BE] flex items-center justify-center">
              <Icon name="Check" variant="filled" size={12} className="text-white" />
            </div>
          )}
        </div>

        {/* Label */}
        <div className="flex flex-col items-center w-full">
          <span className="text-[12px] font-normal leading-[16px] text-[#1C2B33] font-optimistic truncate w-full text-center">
            {item.name}
          </span>
          {item.dimensions && (
            <span className="text-[12px] font-normal leading-[16px] text-[#465A69] font-optimistic">
              {item.dimensions}
            </span>
          )}
        </div>
      </button>
    );
  }
);

MediaGridItem.displayName = "MediaGridItem";

// ============================================
// Media Grid Loading Item (for upload progress)
// ============================================
interface MediaGridLoadingItemProps extends HTMLAttributes<HTMLDivElement> {
  /** Upload percentage */
  percent: number;
  /** Size variant */
  size?: "small" | "medium" | "large";
}

const MediaGridLoadingItem = forwardRef<HTMLDivElement, MediaGridLoadingItemProps>(
  ({ className, percent, size = "small", ...props }, ref) => {
    const sizeClasses = {
      small: "w-[72px]",
      medium: "w-[88px]",
      large: "w-[120px]",
    };

    const thumbnailSizes = {
      small: "h-[72px]",
      medium: "h-[88px]",
      large: "h-[120px]",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col gap-1",
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {/* Thumbnail with loading spinner */}
        <div
          className={cn(
            "relative w-full rounded-[4px] overflow-hidden",
            thumbnailSizes[size],
            "bg-[#E8F4FC]",
            "border-2 border-[#0A78BE]",
            "flex items-center justify-center"
          )}
        >
          {/* Spinning loader */}
          <div className="animate-spin">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10"
                stroke="#0A78BE"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Label */}
        <div className="flex flex-col items-center w-full">
          <span className="text-[12px] font-normal leading-[16px] text-[#1C2B33] font-optimistic truncate w-full text-center">
            untitled
          </span>
          <span className="text-[12px] font-normal leading-[16px] text-[#0A78BE] font-optimistic">
            {percent}%
          </span>
        </div>
      </div>
    );
  }
);

MediaGridLoadingItem.displayName = "MediaGridLoadingItem";

// ============================================
// Compound Component Export
// ============================================
const MediaGrid = Object.assign(MediaGridRoot, {
  Item: MediaGridItem,
  LoadingItem: MediaGridLoadingItem,
});

export { MediaGrid };
export type { MediaGridProps, MediaGridItemProps, MediaGridLoadingItemProps };
