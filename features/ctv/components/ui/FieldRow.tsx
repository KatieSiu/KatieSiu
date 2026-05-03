"use client";

import { useState } from "react";
import { Icon } from "./Icon";

export interface FieldRowProps {
  /** Field label text */
  label: string;
  /** Field value text */
  value: string;
  /** Whether the field is disabled */
  disabled?: boolean;
  /** Enable hover interaction (grey background + pencil icon) */
  showHover?: boolean;
  /** Tooltip message to show on hover when disabled */
  disabledTooltip?: string;
  /** Click handler for the field row */
  onClick?: () => void;
  /** Additional class names */
  className?: string;
}

/**
 * FieldRow - A reusable field display component with optional hover interactions
 * 
 * Used across Ad Manager cards to display label/value pairs with consistent styling.
 * Supports hover state with grey background and pencil icon, and disabled state
 * with optional tooltip.
 * 
 * @example
 * // Basic usage with hover
 * <FieldRow label="Campaign bid strategy" value="Highest volume" />
 * 
 * @example
 * // Disabled with tooltip on hover
 * <FieldRow 
 *   label="Ad scheduling" 
 *   value="Run ads all the time"
 *   disabled={true}
 *   disabledTooltip="Ad scheduling is only available when you use lifetime budget."
 * />
 * 
 * @example
 * // Without hover interaction
 * <FieldRow label="Status" value="Active" showHover={false} />
 */
export function FieldRow({ 
  label, 
  value, 
  disabled = false, 
  showHover = true, 
  disabledTooltip,
  onClick,
  className = ""
}: FieldRowProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Disabled state with tooltip
  if (disabled) {
    return (
      <div 
        className={`relative rounded-[4px] py-2 px-3 -mx-3 transition-colors cursor-default ${
          isHovered ? "bg-[#F1F4F7]" : ""
        } ${className}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="font-optimistic font-bold text-[14px] leading-[20px] text-[rgba(0,0,0,0.75)]">
                {label}
              </span>
              <Icon name="Info" variant="filled" size={12} className="text-[rgba(0,0,0,0.75)]" />
            </div>
            <span className="font-optimistic text-[14px] leading-[20px] text-[#A7B3BF]">
              {value}
            </span>
          </div>
          <Icon name="Close" variant="filled" size={16} className="text-[#A7B3BF]" />
        </div>
        
        {/* Tooltip on hover */}
        {isHovered && disabledTooltip && (
          <div className="absolute left-0 bottom-full mb-2 z-10">
            <div className="bg-white rounded-[4px] shadow-[0px_2px_12px_0px_rgba(0,0,0,0.15)] px-3 py-2 max-w-[300px]">
              <p className="font-optimistic text-[14px] leading-[20px] text-[#1C2B33]">
                {disabledTooltip}
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Standard field row with optional hover interaction
  return (
    <div 
      className={`rounded-[4px] py-2 px-3 -mx-3 transition-colors ${
        showHover ? "cursor-pointer" : ""
      } ${
        showHover && isHovered ? "bg-[#F1F4F7]" : ""
      } ${className}`}
      onMouseEnter={() => showHover && setIsHovered(true)}
      onMouseLeave={() => showHover && setIsHovered(false)}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="font-optimistic font-bold text-[14px] leading-[20px] text-[rgba(0,0,0,0.75)]">
              {label}
            </span>
            <Icon name="Info" variant="filled" size={12} className="text-[rgba(0,0,0,0.75)]" />
          </div>
          <span className="font-optimistic text-[14px] leading-[20px] text-[#1C2B33]">
            {value}
          </span>
        </div>
        {showHover && isHovered && (
          <Icon name="Pencil" variant="filled" size={16} className="text-[#0A78BE]" />
        )}
      </div>
    </div>
  );
}
