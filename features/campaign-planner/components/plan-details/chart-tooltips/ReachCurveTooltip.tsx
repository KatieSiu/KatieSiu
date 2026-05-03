"use client";

import React from "react";
import { colors } from "@/features/campaign-planner/lib/design-tokens";
import { ChartAdSet } from "../types";

// ============================================
// Custom Tooltip for Reach Curve Chart (supports multiple ad sets)
// ============================================
interface ReachCurveTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: any;
  adSets?: ChartAdSet[];
}

export function ReachCurveTooltip({ active, payload, adSets }: ReachCurveTooltipProps) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0]?.payload;
  const budgetValue = data?.budget;

  // Format currency with commas (e.g., "$700,000")
  const formatCurrencyValue = (value: number) => {
    return `$${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  };

  // Format reach with commas (e.g., "2,700,000")
  const formatReachValue = (value: number) => {
    return value.toLocaleString('en-US', { maximumFractionDigits: 0 });
  };

  // Format total budget header (e.g., "$100K Total Budget")
  const formatTotalBudgetHeader = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(value % 1000000 === 0 ? 0 : 1)}M Total Budget`;
    } else if (value >= 1000) {
      return `$${Math.round(value / 1000)}K Total Budget`;
    }
    return `$${Math.round(value)} Total Budget`;
  };

  const hasMultipleAdSets = adSets && adSets.length > 1;

  // ============================================
  // SINGLE AD SET TOOLTIP
  // Simple two-line format: budget and reach
  // ============================================
  if (!hasMultipleAdSets) {
    const reach = payload[0]?.value || 0;
    
    return (
      <div 
        className="flex flex-col gap-1 px-3 py-2"
        style={{
          backgroundColor: colors.background.content,
          borderRadius: '6px',
          boxShadow: '0px 2px 12px 0px rgba(0,0,0,0.1), 0px 3px 4px 0px rgba(0,0,0,0.1)',
        }}
      >
        {/* Budget row */}
        <div className="flex items-center gap-2 h-[20px]">
          <p className="font-optimistic text-[14px] leading-[20px]" style={{ color: colors.text.heading }}>
            {formatCurrencyValue(budgetValue)}{' '}
            <span style={{ color: colors.text.muted }}>budget</span>
          </p>
        </div>
        {/* Reach row */}
        <div className="flex items-center gap-2 h-[20px]">
          <p className="font-optimistic text-[14px] leading-[20px]" style={{ color: colors.text.heading }}>
            {formatReachValue(reach)}{' '}
            <span style={{ color: colors.text.muted }}>reach</span>
          </p>
        </div>
      </div>
    );
  }

  // ============================================
  // MULTIPLE AD SETS TOOLTIP
  // Header + each ad set with name, budget, reach
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
      {/* Header: Total Budget */}
      <div className="flex flex-col items-start">
        <div className="flex items-center h-[20px]">
          <p className="font-optimistic text-[14px] leading-[20px]" style={{ color: colors.text.muted }}>
            {formatTotalBudgetHeader(budgetValue)}
          </p>
        </div>
      </div>

      {/* Each Ad Set's data */}
      {payload.map((entry: any, index: number) => {
        const adSetName = entry.name || `Ad Set ${index + 1}`;
        const reach = entry.value || 0;
        const color = entry.stroke || colors.adSet[index % colors.adSet.length];
        
        // Calculate this ad set's budget at this point
        // Each ad set's budget is proportional to their current allocation
        const adSet = adSets?.[index];
        const totalCurrentBudget = adSets?.reduce((sum, as) => sum + as.budget, 0) || budgetValue;
        const proportion = adSet ? adSet.budget / totalCurrentBudget : 1 / payload.length;
        const adSetBudgetAtPoint = Math.round(budgetValue * proportion);
        
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
            {/* Budget row (indented) */}
            <div className="flex items-center gap-2 h-[20px]">
              <div className="w-[15px] h-[15px] shrink-0" /> {/* Spacer for alignment */}
              <p className="font-optimistic text-[14px] leading-[20px]" style={{ color: colors.text.heading }}>
                {formatCurrencyValue(adSetBudgetAtPoint)}{' '}
                <span style={{ color: colors.text.muted }}>budget</span>
              </p>
            </div>
            {/* Reach row (indented) */}
            <div className="flex items-center gap-2 h-[20px]">
              <div className="w-[15px] h-[15px] shrink-0" /> {/* Spacer for alignment */}
              <p className="font-optimistic text-[14px] leading-[20px]" style={{ color: colors.text.heading }}>
                {formatReachValue(reach)}{' '}
                <span style={{ color: colors.text.muted }}>reach</span>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

