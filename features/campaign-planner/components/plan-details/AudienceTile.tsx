"use client";

import React, { useState } from "react";
import { Icon } from "@/features/campaign-planner/components/ui/Icon";
import { colors } from "@/features/campaign-planner/lib/design-tokens";

// ============================================
// Audience Tile - Opens Modal on Click
// ============================================
interface AudienceTileProps {
  audienceLocations?: string[];
  onEdit?: () => void;
}

export function AudienceTile({ 
  audienceLocations = ['United States', 'Canada'],
  onEdit
}: AudienceTileProps) {
  // Track hover state for consistent color changes
  const [isHovered, setIsHovered] = useState(false);
  
  // Determine colors based on hover state
  const activeBlue = colors.interactive.primaryHover;
  const shouldShowBlue = isHovered;

  // Format locations for display (truncate if too long)
  const formatLocations = () => {
    if (audienceLocations.length === 0) return 'No locations selected';
    if (audienceLocations.length === 1) return audienceLocations[0];
    if (audienceLocations.length === 2) return audienceLocations.join(', ');
    // Show first two with ellipsis
    return `${audienceLocations.slice(0, 2).join(', ')}...`;
  };

  return (
    <div 
      className="flex-1 border rounded-[8px] p-3 flex flex-col gap-2 transition-all duration-150 cursor-pointer"
      style={{
        backgroundColor: shouldShowBlue ? colors.interactive.hoverBg : colors.background.content,
        borderColor: shouldShowBlue ? activeBlue : colors.border.card,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onEdit}
    >
      {/* Icon + Edit indicator */}
      <div className="flex items-center justify-between">
        <Icon
          name="People"
          variant="filled"
          size={20}
          color={shouldShowBlue ? colors.interactive.primaryHover : colors.icon.default}
          className="transition-colors duration-150"
        />
        {/* Pencil icon - appears on hover */}
        {onEdit && (
          <Icon
            name="Pencil"
            variant="outlined"
            size={16}
            color={colors.interactive.primaryHover}
            className={`transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}
          />
        )}
      </div>
      
      {/* Value + Label */}
      <div className="flex flex-col gap-0.5">
        <div className="h-[20px] flex items-center">
          <span 
            className="font-optimistic font-medium text-[14px] leading-[20px] transition-colors duration-150 truncate"
            style={{ color: shouldShowBlue ? activeBlue : colors.text.primary }}
          >
            {formatLocations()}
          </span>
        </div>
        <span 
          className="font-optimistic text-[12px] leading-[16px] transition-colors duration-150"
          style={{ color: shouldShowBlue ? activeBlue : colors.text.muted }}
        >
          Audience
        </span>
      </div>
    </div>
  );
}

