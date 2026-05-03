"use client";

import React from "react";
import { colors } from "@/features/campaign-planner/lib/design-tokens";
import { formatCurrency } from "@/features/campaign-planner/lib/mock-data";

// ============================================
// Custom Tooltip for Spend per Day (supports multiple ad sets)
// ============================================
interface SpendTooltipProps {
  active?: boolean;
  payload?: any[];
}

export function SpendTooltip({ active, payload }: SpendTooltipProps) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0]?.payload;
  const dateStr = data?.dateStr;
  const hasMultipleAdSets = payload.length > 1;

  // ============================================
  // SINGLE AD SET TOOLTIP
  // Date + "$X • spend"
  // ============================================
  if (!hasMultipleAdSets) {
    const spend = payload[0]?.value || 0;
    
    return (
      <div 
        className="flex flex-col gap-1 px-3 py-2"
        style={{
          backgroundColor: colors.background.content,
          borderRadius: '6px',
          boxShadow: '0px 2px 12px 0px rgba(0,0,0,0.1), 0px 3px 4px 0px rgba(0,0,0,0.1)',
        }}
      >
        {/* Date row */}
        <div className="flex items-center gap-2 h-[20px]">
          <p className="font-optimistic text-[14px] leading-[20px]" style={{ color: colors.text.heading }}>
            {dateStr}
          </p>
        </div>
        {/* Spend row */}
        <div className="flex items-center gap-2 h-[20px]">
          <p className="font-optimistic text-[14px] leading-[20px]" style={{ color: colors.text.heading }}>
            {formatCurrency(spend)}{' '}
            <span style={{ color: colors.text.muted }}>•</span>{' '}
            <span style={{ color: colors.text.muted }}>spend</span>
          </p>
        </div>
      </div>
    );
  }

  // ============================================
  // MULTIPLE AD SETS TOOLTIP
  // Date header + each ad set with name and spend
  // ============================================
  return (
    <div 
      className="flex flex-col gap-2 px-3 py-2"
      style={{
        backgroundColor: colors.background.content,
        borderRadius: '6px',
        boxShadow: '0px 2px 12px 0px rgba(0,0,0,0.1), 0px 3px 4px 0px rgba(0,0,0,0.1)',
      }}
    >
      {/* Date header */}
      <div className="flex items-center gap-2 h-[20px]">
        <p className="font-optimistic text-[14px] leading-[20px]" style={{ color: colors.text.heading }}>
          {dateStr}
        </p>
      </div>

      {/* Each Ad Set's data */}
      {payload.map((entry: any, index: number) => {
        const adSetName = entry.name || `Ad Set ${index + 1}`;
        const spend = entry.value;
        const color = entry.stroke || entry.fill || colors.adSet[index % colors.adSet.length];
        
        return (
          <div key={index} className="flex flex-col gap-1">
            {/* Ad Set Name with color square */}
            <div className="flex items-center gap-2 h-[20px]">
              <div 
                className="w-[15px] h-[15px] shrink-0" 
                style={{ backgroundColor: color, borderRadius: '3px' }} 
              />
              <p className="font-optimistic text-[14px] leading-[20px]" style={{ color: colors.text.heading }}>
                {adSetName}
              </p>
            </div>
            {/* Value row - indented with spacer div */}
            <div className="flex items-center gap-2 h-[20px]">
              <div className="w-[15px] h-[15px] shrink-0" /> {/* Spacer for alignment */}
              <p className="font-optimistic text-[14px] leading-[20px]" style={{ color: colors.text.heading }}>
                {formatCurrency(spend)}{' '}
                <span style={{ color: colors.text.muted }}>•</span>{' '}
                <span style={{ color: colors.text.muted }}>spend</span>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

