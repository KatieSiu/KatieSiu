"use client";

import React from "react";
import { colors } from "@/features/campaign-planner/lib/design-tokens";

// ============================================
// Focused Tooltip Components
// Single-series tooltips for Mixpanel-style interactions
// Only shows data for the currently focused series
// ============================================

interface FocusedTooltipProps {
  active?: boolean;
  payload?: any[];
  focusedIndex?: number | null;
}

/** Format reach value with commas (e.g., "2,700,000") */
function formatReachValue(value: number): string {
  return value.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

/** Format currency value (e.g., "$1,234") */
function formatCurrency(value: number): string {
  return `$${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

/** Format date with day of week (e.g., "Tue, Mar 10, 2026") */
function formatDateWithDayOfWeek(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) {
    // If invalid date, return the original string
    return typeof date === 'string' ? date : '';
  }
  const dayOfWeek = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
  const month = dateObj.toLocaleDateString('en-US', { month: 'short' });
  const day = dateObj.getDate();
  const year = dateObj.getFullYear();
  return `${dayOfWeek}, ${month} ${day}, ${year}`;
}

// ============================================
// Focused Spend Tooltip
// Shows date + ad set name + spend for single focused series
// ============================================
interface FocusedSpendTooltipProps extends FocusedTooltipProps {}

export function FocusedSpendTooltip({ active, payload, focusedIndex }: FocusedSpendTooltipProps) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0]?.payload;
  const date = data?.date;

  // Get the focused entry by finding the one with matching dataKey
  // Recharts payload order may not match our index order
  const focusedDataKey = focusedIndex !== null && focusedIndex !== undefined 
    ? `adSet${focusedIndex}` 
    : null;
  
  const focusedEntry = focusedDataKey 
    ? payload.find(p => p.dataKey === focusedDataKey) || payload[0]
    : payload[0];

  const spend = focusedEntry?.value || 0;
  const adSetName = focusedEntry?.name || 'Ad Set 1';
  const color = focusedEntry?.stroke || focusedEntry?.fill || colors.adSet[focusedIndex ?? 0];

  return (
    <div 
      className="flex flex-col gap-[8px] px-[12px] py-[8px]"
      style={{
        backgroundColor: colors.background.content,
        borderRadius: '6px',
        boxShadow: '0px 2px 12px 0px rgba(0,0,0,0.1), 0px 3px 4px 0px rgba(0,0,0,0.1)',
      }}
    >
      {/* Date row - light grey, smaller font */}
      <p className="font-optimistic text-[12px] leading-[16px]" style={{ color: colors.text.muted }}>
        {formatDateWithDayOfWeek(date)}
      </p>
      
      {/* Ad Set name with color indicator */}
      <div className="flex items-center gap-[8px]">
        <div 
          className="w-[15px] h-[15px] shrink-0 rounded-[3px]" 
          style={{ backgroundColor: color }} 
        />
        <p className="font-optimistic text-[14px] leading-[20px]" style={{ color: colors.text.heading }}>
          {adSetName}
        </p>
      </div>
      
      {/* Spend row - aligned with ad set name (offset by color indicator width + gap) */}
      <p 
        className="font-optimistic text-[14px] leading-[20px]" 
        style={{ color: colors.text.heading, marginLeft: '23px' }}
      >
        {formatCurrency(spend)}{' '}
        <span style={{ color: colors.text.muted }}>• spend</span>
      </p>
    </div>
  );
}

// ============================================
// Focused Reach Tooltip
// Shows date + ad set name + reach for single focused series
// ============================================
interface FocusedReachTooltipProps extends FocusedTooltipProps {}

export function FocusedReachTooltip({ active, payload, focusedIndex }: FocusedReachTooltipProps) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0]?.payload;
  const date = data?.date;

  // Get the focused entry by finding the one with matching dataKey
  // Recharts payload order may not match our index order
  const focusedDataKey = focusedIndex !== null && focusedIndex !== undefined 
    ? `adSet${focusedIndex}` 
    : null;
  
  const focusedEntry = focusedDataKey 
    ? payload.find(p => p.dataKey === focusedDataKey) || payload[0]
    : payload[0];

  const reach = focusedEntry?.value || 0;
  const adSetName = focusedEntry?.name || 'Ad Set 1';
  const color = focusedEntry?.stroke || focusedEntry?.fill || colors.adSet[focusedIndex ?? 0];

  return (
    <div 
      className="flex flex-col gap-[8px] px-[12px] py-[8px]"
      style={{
        backgroundColor: colors.background.content,
        borderRadius: '6px',
        boxShadow: '0px 2px 12px 0px rgba(0,0,0,0.1), 0px 3px 4px 0px rgba(0,0,0,0.1)',
      }}
    >
      {/* Date row - light grey, smaller font */}
      <p className="font-optimistic text-[12px] leading-[16px]" style={{ color: colors.text.muted }}>
        {formatDateWithDayOfWeek(date)}
      </p>
      
      {/* Ad Set name with color indicator */}
      <div className="flex items-center gap-[8px]">
        <div 
          className="w-[15px] h-[15px] shrink-0 rounded-[3px]" 
          style={{ backgroundColor: color }} 
        />
        <p className="font-optimistic text-[14px] leading-[20px]" style={{ color: colors.text.heading }}>
          {adSetName}
        </p>
      </div>
      
      {/* Reach row - aligned with ad set name (offset by color indicator width + gap) */}
      <p 
        className="font-optimistic text-[14px] leading-[20px]" 
        style={{ color: colors.text.heading, marginLeft: '23px' }}
      >
        {formatReachValue(reach)}{' '}
        <span style={{ color: colors.text.muted }}>• reach</span>
      </p>
    </div>
  );
}

// ============================================
// Focused Frequency Tooltip
// Shows frequency label + ad set name + percentage for single focused series
// ============================================
interface FocusedFrequencyTooltipProps extends FocusedTooltipProps {}

export function FocusedFrequencyTooltip({ active, payload, focusedIndex }: FocusedFrequencyTooltipProps) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0]?.payload;
  const frequency = data?.frequency;

  // Get the focused entry by finding the one with matching dataKey
  // Recharts payload order may not match our index order
  const focusedDataKey = focusedIndex !== null && focusedIndex !== undefined 
    ? `adSet${focusedIndex}` 
    : null;
  
  const focusedEntry = focusedDataKey 
    ? payload.find(p => p.dataKey === focusedDataKey) || payload[0]
    : payload[0];

  const percentage = focusedEntry?.value || 0;
  const adSetName = focusedEntry?.name || 'Ad Set 1';
  const color = focusedEntry?.fill || colors.adSet[focusedIndex ?? 0];

  return (
    <div 
      className="flex flex-col gap-[8px] px-[12px] py-[8px]"
      style={{
        backgroundColor: colors.background.content,
        borderRadius: '6px',
        boxShadow: '0px 2px 12px 0px rgba(0,0,0,0.1), 0px 3px 4px 0px rgba(0,0,0,0.1)',
      }}
    >
      {/* Title: Reached X Times - light grey, smaller font */}
      <p className="font-optimistic text-[12px] leading-[16px]" style={{ color: colors.text.muted }}>
        Reached {frequency} Times
      </p>
      
      {/* Ad Set name with color indicator */}
      <div className="flex items-center gap-[8px]">
        <div 
          className="w-[15px] h-[15px] shrink-0 rounded-[3px]" 
          style={{ backgroundColor: color }} 
        />
        <p className="font-optimistic text-[14px] leading-[20px]" style={{ color: colors.text.heading }}>
          {adSetName}
        </p>
      </div>
      
      {/* Percentage row - aligned with ad set name (offset by color indicator width + gap) */}
      <p 
        className="font-optimistic text-[14px] leading-[20px]" 
        style={{ color: colors.text.heading, marginLeft: '23px' }}
      >
        {percentage}%{' '}
        <span style={{ color: colors.text.muted }}>of audience</span>
      </p>
    </div>
  );
}
