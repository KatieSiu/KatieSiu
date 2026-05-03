"use client";

import React from "react";
import { colors } from "@/features/campaign-planner/lib/design-tokens";

// ============================================
// Custom Tooltip for Frequency Distribution (supports multiple ad sets)
// ============================================
interface FrequencyTooltipProps {
  active?: boolean;
  payload?: any[];
}

export function FrequencyTooltip({ active, payload }: FrequencyTooltipProps) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0]?.payload;
  const frequency = data?.frequency;
  const hasMultipleAdSets = payload.length > 1;

  // ============================================
  // SINGLE AD SET TOOLTIP
  // "Reached X times" title + "X% of audience"
  // ============================================
  if (!hasMultipleAdSets) {
    const percentage = payload[0]?.value || 0;
    
    return (
      <div 
        className="flex flex-col gap-1 px-3 py-2"
        style={{
          backgroundColor: colors.background.content,
          borderRadius: '6px',
          boxShadow: '0px 2px 12px 0px rgba(0,0,0,0.1), 0px 3px 4px 0px rgba(0,0,0,0.1)',
        }}
      >
        {/* Title: Reached X times */}
        <div className="flex items-center gap-2 h-[20px]">
          <p className="font-optimistic text-[14px] leading-[20px]" style={{ color: colors.text.heading }}>
            Reached {frequency} times
          </p>
        </div>
        {/* Percentage row */}
        <div className="flex items-center gap-2 h-[20px]">
          <p className="font-optimistic text-[14px] leading-[20px]" style={{ color: colors.text.heading }}>
            {percentage}%{' '}
            <span style={{ color: colors.text.muted }}>of audience</span>
          </p>
        </div>
      </div>
    );
  }

  // ============================================
  // MULTIPLE AD SETS TOOLTIP
  // "Reached X times" title + each ad set data
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
      {/* Title: Reached X times (in dark text like single ad set) */}
      <div className="flex items-center h-[20px]">
        <p className="font-optimistic text-[14px] leading-[20px]" style={{ color: colors.text.heading }}>
          Reached {frequency} times
        </p>
      </div>
      
      {/* Show each ad set's data */}
      {payload.map((entry: any, index: number) => {
        const adSetName = entry.name || `Ad Set ${index + 1}`;
        const percentage = entry.value;
        const color = entry.fill || colors.adSet[index % colors.adSet.length];
        
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
            {/* Value row - indented to align with text */}
            <div className="flex items-center gap-2 h-[20px]">
              <div className="w-[15px] h-[15px] shrink-0" />
              <p className="font-optimistic text-[14px] leading-[20px]" style={{ color: colors.text.heading }}>
                {percentage}%{' '}
                <span style={{ color: colors.text.muted }}>of audience</span>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

