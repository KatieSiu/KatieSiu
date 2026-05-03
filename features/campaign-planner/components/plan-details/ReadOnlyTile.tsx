"use client";

import React from "react";
import { Icon } from "@/features/campaign-planner/components/ui/Icon";
import { colors } from "@/features/campaign-planner/lib/design-tokens";

// ============================================
// Read-Only Tile (Stat Card) - Display Only
// ============================================
interface ReadOnlyTileProps {
  icon: string;
  iconVariant?: "filled" | "outlined";
  value: string;
  label: string;
}

export function ReadOnlyTile({ 
  icon, 
  iconVariant = "filled",
  value, 
  label, 
}: ReadOnlyTileProps) {
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
        name={icon}
        variant={iconVariant}
        size={20}
        color={colors.icon.default}
      />
      
      {/* Value + Label */}
      <div className="flex flex-col">
        <span 
          className="font-optimistic font-medium text-[14px] leading-[20px]"
          style={{ color: colors.text.primary }}
        >
          {value}
        </span>
        <span 
          className="font-optimistic text-[12px] leading-[16px]"
          style={{ color: colors.text.muted }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
