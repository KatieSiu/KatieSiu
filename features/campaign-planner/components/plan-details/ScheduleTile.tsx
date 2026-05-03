"use client";

import React from "react";
import { Icon } from "@/features/campaign-planner/components/ui/Icon";
import { colors } from "@/features/campaign-planner/lib/design-tokens";

// ============================================
// Schedule Tile (Date Range) - Read-Only Display
// ============================================
interface ScheduleTileProps {
  startDate: Date;
  endDate: Date;
}

export function ScheduleTile({ 
  startDate, 
  endDate, 
}: ScheduleTileProps) {
  // Format date as MM/DD/YY
  const formatTileDate = (date: Date) => {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${month}/${day}/${year}`;
  };

  return (
    <div 
      className="flex-1 border rounded-[8px] p-[8px] flex flex-col gap-[4px]"
      style={{
        backgroundColor: colors.background.content,
        borderColor: colors.border.card,
      }}
    >
      {/* Icon */}
      <Icon
        name="Calendar"
        variant="outlined"
        size={20}
        color={colors.icon.default}
      />
      
      {/* Date Range + Label */}
      <div className="flex flex-col">
        <div className="flex items-center gap-[5px]">
          <span 
            className="font-optimistic font-medium text-[14px] leading-[20px]"
            style={{ color: colors.text.primary }}
          >
            {formatTileDate(startDate)}
          </span>
          <span 
            className="font-optimistic font-medium text-[14px] leading-[20px]"
            style={{ color: colors.text.primary }}
          >
            -
          </span>
          <span 
            className="font-optimistic font-medium text-[14px] leading-[20px]"
            style={{ color: colors.text.primary }}
          >
            {formatTileDate(endDate)}
          </span>
        </div>
        <span 
          className="font-optimistic text-[12px] leading-[16px]"
          style={{ color: colors.text.muted }}
        >
          Schedule
        </span>
      </div>
    </div>
  );
}

