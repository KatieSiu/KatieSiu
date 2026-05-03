"use client";

import React from "react";
import { colors } from "@/features/campaign-planner/lib/design-tokens";
import { formatNumber } from "@/features/campaign-planner/lib/mock-data";

// ============================================
// Custom Tooltip Component for Charts
// ============================================
interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  metricType: 'reach' | 'impressions' | 'frequency';
}

export function CustomTooltip({ active, payload, label, metricType }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0]?.payload;
  const dateStr = data?.dateStr || label;

  const getLabel = () => {
    switch (metricType) {
      case 'reach':
        return 'reach';
      case 'impressions':
        return 'impressions';
      case 'frequency':
        return 'frequency';
      default:
        return '';
    }
  };

  const formatValue = (value: number) => {
    switch (metricType) {
      case 'reach':
        return formatNumber(value);
      case 'impressions':
        return formatNumber(value);
      case 'frequency':
        return value.toFixed(2) + 'x';
      default:
        return value;
    }
  };

  return (
    <div 
      className="px-3 py-2 flex flex-col gap-2"
      style={{
        backgroundColor: colors.background.content,
        borderRadius: '6px',
        boxShadow: '0px 2px 12px 0px rgba(0,0,0,0.1), 0px 3px 4px 0px rgba(0,0,0,0.1)',
        opacity: 1,
      }}
    >
      {/* Date at top */}
      {dateStr && (
        <p 
          className="font-optimistic text-[14px] leading-[20px]" 
          style={{ color: colors.text.muted }}
        >
          {dateStr}
        </p>
      )}
      {/* Show each ad set's data */}
      {payload.map((entry: any, index: number) => {
        const adSetName = entry.name || `Ad Set ${index + 1}`;
        const value = entry.value;
        const color = entry.stroke || entry.fill || colors.adSet[index % colors.adSet.length];
        
        return (
          <div key={index} className="flex flex-col gap-1">
            {/* Ad Set Name with color square */}
            <div className="flex items-center gap-2">
              <div 
                className="w-[15px] h-[15px] shrink-0" 
                style={{ backgroundColor: color, borderRadius: '3px' }} 
              />
              <p 
                className="font-optimistic text-[14px] leading-[20px]" 
                style={{ color: colors.text.heading }}
              >
                {adSetName}
              </p>
            </div>
            {/* Value row - indented to align with text */}
            <div className="flex items-center gap-2">
              <div className="w-[15px] h-[15px] shrink-0" />
              <p 
                className="font-optimistic text-[14px] leading-[20px]" 
                style={{ color: colors.text.heading }}
              >
                {formatValue(value)} <span style={{ color: colors.text.muted }}>•</span> <span style={{ color: colors.text.muted }}>{getLabel()}</span>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

