"use client";

import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/features/ctv/lib/utils";
import { Button } from "./Button";
import { Icon } from "./Icon";

// ============================================
// Selection Footer
// ============================================
interface SelectionFooterProps extends HTMLAttributes<HTMLDivElement> {
  /** Number of selected items */
  selectedCount: number;
  /** Total number of selectable items (for "X of Y selected" format) */
  totalCount?: number;
  /** Label for selection (e.g., "Media from you", "Media from AI") */
  selectionLabel?: string;
  /** Thumbnails of selected items */
  selectedThumbnails?: string[];
  /** Maximum thumbnails to show */
  maxThumbnails?: number;
  /** Cancel button label */
  cancelLabel?: string;
  /** Primary action button label */
  primaryLabel?: string;
  /** Secondary action button label (optional, shown between cancel and primary) */
  secondaryLabel?: string;
  /** Whether primary button is disabled */
  primaryDisabled?: boolean;
  /** Whether loading state is active */
  isLoading?: boolean;
  /** Callback for cancel */
  onCancel?: () => void;
  /** Callback for primary action */
  onPrimary?: () => void;
  /** Callback for secondary action */
  onSecondary?: () => void;
  /** Custom left content */
  leftContent?: ReactNode;
}

const SelectionFooter = forwardRef<HTMLDivElement, SelectionFooterProps>(
  (
    {
      className,
      selectedCount,
      totalCount,
      selectionLabel,
      selectedThumbnails = [],
      maxThumbnails = 3,
      cancelLabel = "Cancel",
      primaryLabel = "Next",
      secondaryLabel,
      primaryDisabled = false,
      isLoading = false,
      onCancel,
      onPrimary,
      onSecondary,
      leftContent,
      ...props
    },
    ref
  ) => {
    const displayThumbnails = selectedThumbnails.slice(0, maxThumbnails);

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-between",
          "px-4 py-3",
          "border-t border-[#E4E8EB]",
          "bg-white",
          "shrink-0",
          className
        )}
        {...props}
      >
        {/* Left side - Selection info */}
        <div className="flex items-center gap-3">
          {leftContent ? (
            leftContent
          ) : (
            <>
              {/* Selection count and label - always shown */}
              <div className="flex flex-col">
                <span className="text-[12px] font-bold leading-[16px] text-[#1C2B33] font-optimistic">
                  {totalCount !== undefined ? `${selectedCount} of ${totalCount} selected` : `${selectedCount} selected`}
                </span>
                {selectionLabel && (
                  <span className="text-[12px] font-normal leading-[16px] text-[#465A69] font-optimistic">
                    {selectionLabel}
                  </span>
                )}
              </div>

              {/* Thumbnails - only show when items are selected */}
              {displayThumbnails.length > 0 && (
                <div className="flex items-center gap-1 ml-2">
                  {displayThumbnails.map((thumb, index) => (
                    <div
                      key={index}
                      className="w-10 h-10 rounded-[4px] overflow-hidden bg-[#F5F7F8] border border-[#E4E8EB]"
                    >
                      <img
                        src={thumb}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={onCancel}>
            {cancelLabel}
          </Button>
          {secondaryLabel && (
            <Button variant="secondary" onClick={onSecondary}>
              {secondaryLabel}
            </Button>
          )}
          <Button 
            variant="primary" 
            onClick={onPrimary}
            disabled={primaryDisabled || isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            ) : (
              primaryLabel
            )}
          </Button>
        </div>
      </div>
    );
  }
);

SelectionFooter.displayName = "SelectionFooter";

export { SelectionFooter };
export type { SelectionFooterProps };
