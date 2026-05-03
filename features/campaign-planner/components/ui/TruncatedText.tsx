"use client";

import { Tooltip } from "./Tooltip";

interface TruncatedTextProps {
  /** The text content to display */
  children: string;
  /** Additional class names */
  className?: string;
  /** Max width before truncation (optional, uses parent width by default) */
  maxWidth?: number | string;
  /** Click handler */
  onClick?: () => void;
  /** Custom tooltip content (defaults to children if not provided) */
  tooltipContent?: string;
}

/**
 * TruncatedText Component
 * 
 * Displays text that truncates with ellipsis when it overflows.
 * Shows a dark system tooltip with the full text on hover when truncated.
 * 
 * @example
 * <TruncatedText className="text-[14px] text-gray-900">
 *   This is a very long text that might get truncated
 * </TruncatedText>
 * 
 * @example with custom tooltip
 * <TruncatedText 
 *   className="text-[14px]" 
 *   tooltipContent="Full date range: Jan 1, 2025 - Feb 1, 2025"
 * >
 *   Jan 1, 2025...
 * </TruncatedText>
 */
export function TruncatedText({ 
  children, 
  className = "",
  maxWidth,
  onClick,
  tooltipContent,
}: TruncatedTextProps) {
  const style = maxWidth ? { maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth } : undefined;

  return (
    <Tooltip
      content={tooltipContent || children}
      variant="system"
      preferredPosition="top"
      showOnlyWhenTruncated
      showDelay={300}
      hideDelay={0}
    >
      <span 
        className={`block truncate ${className}`}
        style={style}
        data-truncate-check
        onClick={onClick}
      >
        {children}
      </span>
    </Tooltip>
  );
}

