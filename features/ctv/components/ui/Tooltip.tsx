"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Icon } from "./Icon";

// ============================================
// TYPES & INTERFACES
// ============================================

type TooltipPosition = "top" | "bottom" | "left" | "right";

interface TooltipProps {
  /** The element that triggers the tooltip */
  children: React.ReactNode;
  /** Tooltip content - string for simple, or use Tooltip.Content for popover */
  content: React.ReactNode;
  /** Tooltip variant */
  variant?: "simple" | "popover";
  /** Preferred position (will auto-adjust to stay in viewport) */
  preferredPosition?: TooltipPosition;
  /** Delay before showing tooltip (ms) */
  showDelay?: number;
  /** Delay before hiding tooltip (ms) - allows user to move cursor to tooltip */
  hideDelay?: number;
  /** Additional class names for the tooltip container */
  className?: string;
}

interface TooltipContentProps {
  /** Popover title */
  title: string;
  /** Popover description */
  description?: string;
  /** Show close button */
  showClose?: boolean;
  /** Close handler */
  onClose?: () => void;
  /** Optional link text */
  linkText?: string;
  /** Optional link URL */
  linkHref?: string;
  /** Link click handler (alternative to href) */
  onLinkClick?: () => void;
  /** Additional class names */
  className?: string;
}

// ============================================
// TOOLTIP CONTENT (POPOVER)
// ============================================

function TooltipContent({
  title,
  description,
  showClose = true,
  onClose,
  linkText,
  linkHref,
  onLinkClick,
  className = "",
}: TooltipContentProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {/* Header with title and close button */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-[16px] leading-[20px] font-bold font-optimistic text-[#1C2B33] flex-1">
          {title}
        </h3>
        {showClose && (
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 p-1 -m-1 text-[#283943] hover:text-[#1C2B33] transition-colors"
          >
            <Icon name="Close" variant="outlined" size={16} />
          </button>
        )}
      </div>

      {/* Description */}
      {description && (
        <p className="text-[14px] leading-[20px] font-optimistic text-[#1C2B33]">
          {description}
        </p>
      )}

      {/* Optional Link */}
      {linkText && (linkHref || onLinkClick) && (
        <a
          href={linkHref || "#"}
          onClick={(e) => {
            if (onLinkClick) {
              e.preventDefault();
              onLinkClick();
            }
          }}
          className="text-[14px] leading-[20px] font-medium font-optimistic text-[#0A78BE] hover:text-[#0061A0] hover:underline transition-colors"
        >
          {linkText}
        </a>
      )}
    </div>
  );
}

// ============================================
// MAIN TOOLTIP COMPONENT
// ============================================

function TooltipRoot({
  children,
  content,
  variant = "simple",
  preferredPosition = "top",
  showDelay = 0,
  hideDelay = 150,
  className = "",
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<TooltipPosition>(preferredPosition);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const showTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Character limit for simple tooltips
  const MAX_SIMPLE_CHARS = 140;

  // Get content for simple tooltip (with character limit)
  const getSimpleContent = () => {
    if (typeof content === "string") {
      return content.length > MAX_SIMPLE_CHARS
        ? content.slice(0, MAX_SIMPLE_CHARS) + "..."
        : content;
    }
    return content;
  };

  // State for position offset adjustments
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Calculate best position and offset to stay within viewport
  const calculatePositionAndOffset = useCallback(() => {
    if (!triggerRef.current || !tooltipRef.current) {
      return { position: preferredPosition, offset: { x: 0, y: 0 } };
    }

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    const spacing = 8; // Gap between trigger and tooltip
    const edgePadding = 8; // Minimum distance from viewport edge

    // Check available space in each direction
    const spaceAbove = triggerRect.top - spacing;
    const spaceBelow = viewport.height - triggerRect.bottom - spacing;
    const spaceLeft = triggerRect.left - spacing;
    const spaceRight = viewport.width - triggerRect.right - spacing;

    // Priority order: top → bottom → left → right
    const positions: TooltipPosition[] = ["top", "bottom", "left", "right"];
    
    // Reorder based on preferred position
    const orderedPositions = [
      preferredPosition,
      ...positions.filter((p) => p !== preferredPosition),
    ];

    let selectedPosition = preferredPosition;

    for (const pos of orderedPositions) {
      switch (pos) {
        case "top":
          if (spaceAbove >= tooltipRect.height) {
            selectedPosition = "top";
            break;
          }
          continue;
        case "bottom":
          if (spaceBelow >= tooltipRect.height) {
            selectedPosition = "bottom";
            break;
          }
          continue;
        case "left":
          if (spaceLeft >= tooltipRect.width) {
            selectedPosition = "left";
            break;
          }
          continue;
        case "right":
          if (spaceRight >= tooltipRect.width) {
            selectedPosition = "right";
            break;
          }
          continue;
      }
      break;
    }

    // Calculate offset to keep tooltip within viewport
    let offsetX = 0;
    let offsetY = 0;

    if (selectedPosition === "top" || selectedPosition === "bottom") {
      // For top/bottom, tooltip is centered horizontally
      // Check if it overflows left or right
      const tooltipCenterX = triggerRect.left + triggerRect.width / 2;
      const tooltipLeft = tooltipCenterX - tooltipRect.width / 2;
      const tooltipRight = tooltipCenterX + tooltipRect.width / 2;

      if (tooltipLeft < edgePadding) {
        // Overflows left - shift right
        offsetX = edgePadding - tooltipLeft;
      } else if (tooltipRight > viewport.width - edgePadding) {
        // Overflows right - shift left
        offsetX = viewport.width - edgePadding - tooltipRight;
      }
    }

    if (selectedPosition === "left" || selectedPosition === "right") {
      // For left/right, tooltip is centered vertically
      // Check if it overflows top or bottom
      const tooltipCenterY = triggerRect.top + triggerRect.height / 2;
      const tooltipTop = tooltipCenterY - tooltipRect.height / 2;
      const tooltipBottom = tooltipCenterY + tooltipRect.height / 2;

      if (tooltipTop < edgePadding) {
        // Overflows top - shift down
        offsetY = edgePadding - tooltipTop;
      } else if (tooltipBottom > viewport.height - edgePadding) {
        // Overflows bottom - shift up
        offsetY = viewport.height - edgePadding - tooltipBottom;
      }
    }

    return { position: selectedPosition, offset: { x: offsetX, y: offsetY } };
  }, [preferredPosition]);

  // Update position when tooltip becomes visible
  useEffect(() => {
    if (isVisible && tooltipRef.current) {
      // Use requestAnimationFrame to ensure tooltip is rendered
      requestAnimationFrame(() => {
        const { position: newPosition, offset: newOffset } = calculatePositionAndOffset();
        setPosition(newPosition);
        setOffset(newOffset);
      });
    }
  }, [isVisible, calculatePositionAndOffset]);

  // Clear timeouts on unmount
  useEffect(() => {
    return () => {
      if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }

    if (showDelay > 0) {
      showTimeoutRef.current = setTimeout(() => {
        setIsVisible(true);
      }, showDelay);
    } else {
      setIsVisible(true);
    }
  };

  const handleMouseLeave = () => {
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = null;
    }

    hideTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, hideDelay);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  // Position styles with offset adjustments for viewport containment
  const getPositionStyles = (): React.CSSProperties => {
    const spacing = 8;

    switch (position) {
      case "top":
        return {
          bottom: "100%",
          left: "50%",
          transform: `translateX(calc(-50% + ${offset.x}px))`,
          marginBottom: `${spacing}px`,
        };
      case "bottom":
        return {
          top: "100%",
          left: "50%",
          transform: `translateX(calc(-50% + ${offset.x}px))`,
          marginTop: `${spacing}px`,
        };
      case "left":
        return {
          right: "100%",
          top: "50%",
          transform: `translateY(calc(-50% + ${offset.y}px))`,
          marginRight: `${spacing}px`,
        };
      case "right":
        return {
          left: "100%",
          top: "50%",
          transform: `translateY(calc(-50% + ${offset.y}px))`,
          marginLeft: `${spacing}px`,
        };
    }
  };

  // Tooltip styles based on variant
  const getTooltipStyles = () => {
    const baseStyles = `
      absolute z-50
      bg-white
      rounded-[4px]
      shadow-[0px_2px_12px_2px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)]
    `;

    if (variant === "simple") {
      // Simple tooltip sizing rules:
      // 1. Fixed height of 36px
      // 2. Text grows horizontally up to 280px max width
      // 3. Text truncates with ellipsis if it exceeds available space
      return `
        ${baseStyles}
        px-3
        h-[36px]
        max-w-[280px]
        flex items-center justify-center
      `;
    }

    // Popover variant
    return `
      ${baseStyles}
      p-4
      w-[328px]
    `;
  };

  return (
    <div
      ref={triggerRef}
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger Element */}
      {children}

      {/* Tooltip */}
      {isVisible && (
        <div
          ref={tooltipRef}
          className={getTooltipStyles()}
          style={getPositionStyles()}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {variant === "simple" ? (
            <p className="flex-1 text-[14px] leading-[20px] font-optimistic text-[#1C2B33] truncate">
              {getSimpleContent()}
            </p>
          ) : (
            // For popover, if content is a string, wrap it in TooltipContent
            typeof content === "string" ? (
              <TooltipContent title={content} showClose onClose={handleClose} />
            ) : (
              // Clone the content element and inject onClose handler
              React.isValidElement(content) && content.type === TooltipContent
                ? React.cloneElement(content as React.ReactElement<TooltipContentProps>, {
                    onClose: handleClose,
                  })
                : content
            )
          )}
        </div>
      )}
    </div>
  );
}

// ============================================
// COMPOUND COMPONENT EXPORT
// ============================================

/**
 * Tooltip Component
 *
 * A flexible tooltip system supporting:
 * - Simple tooltips (text only, 140 char limit)
 * - Popover tooltips (title, description, optional link)
 *
 * @example
 * // Simple Tooltip
 * <Tooltip content="This is a simple tooltip">
 *   <button>Hover me</button>
 * </Tooltip>
 *
 * @example
 * // Popover Tooltip
 * <Tooltip variant="popover" content={
 *   <Tooltip.Content
 *     title="Popover Title"
 *     description="This is a detailed description."
 *     linkText="Learn more"
 *     linkHref="/docs"
 *   />
 * }>
 *   <button>Hover me</button>
 * </Tooltip>
 */
export const Tooltip = Object.assign(TooltipRoot, {
  Content: TooltipContent,
});

// Also export individual components for flexibility
export { TooltipContent };
export type { TooltipProps, TooltipContentProps, TooltipPosition };

