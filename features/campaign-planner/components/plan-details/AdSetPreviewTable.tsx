"use client";

import React, { useRef, useState, useEffect } from "react";
import { Icon } from "@/features/campaign-planner/components/ui/Icon";
import { AdSetData, formatNumber } from "@/features/campaign-planner/lib/mock-data";

// ============================================
// Ad Set Preview Table Component
// ============================================
// A lightweight, read-only table for displaying ad set data
// in the expanded row of the All Plans table.
// No checkbox, no overflow actions, no column selection.

interface AdSetPreviewTableProps {
  adSets: AdSetData[];
  planBudget: number;
  planImpressions: number;
  planFrequency: number;
  showTotal?: boolean;
}

// Column definitions for the preview table
// Matches the default visible columns from AdSetsTable for consistency
const COLUMNS = [
  { id: 'name', label: 'Name', width: 'minmax(120px, 1.5fr)' },
  { id: 'budget', label: 'Budget', width: 'minmax(80px, 1fr)' },
  { id: 'budgetPercent', label: 'Budget %', width: 'minmax(70px, 1fr)' },
  { id: 'reach', label: 'Reach', width: 'minmax(80px, 1fr)' },
  { id: 'reachPercent', label: 'Reach %', width: 'minmax(70px, 1fr)' },
  { id: 'impressions', label: 'Impressions', width: 'minmax(90px, 1fr)' },
  { id: 'avgWeeklyFrequency', label: 'Avg. Weekly Frequency', width: 'minmax(140px, 1fr)', hasInfo: true },
  { id: 'cpm', label: 'CPM', width: 'minmax(60px, 1fr)' },
  { id: 'audience', label: 'Audience', width: 'minmax(120px, 1fr)' },
  { id: 'performanceGoal', label: 'Performance Goal', width: 'minmax(120px, 1fr)' },
];

export function AdSetPreviewTable({ 
  adSets, 
  planBudget, 
  planImpressions,
  planFrequency,
  showTotal = true,
}: AdSetPreviewTableProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // Track horizontal scroll for shadow effect
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setIsScrolled(container.scrollLeft > 0);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate totals for the footer row
  const totals = {
    budget: planBudget,
    impressions: planImpressions,
    frequency: planFrequency,
  };

  // Grid template for columns
  const gridTemplateColumns = COLUMNS.map(col => col.width).join(' ');

  return (
    <div 
      className="border rounded-[12px] overflow-hidden"
      style={{ borderColor: 'rgba(203,210,217,0.5)' }}
    >
      <div 
        ref={scrollContainerRef}
        className="overflow-x-auto"
      >
        <div style={{ minWidth: '900px' }}>
          {/* Header Row */}
          <div 
            className="bg-[#F1F4F7] px-[10px]"
            style={{ 
              boxShadow: '0px 0px 1px 0px rgba(0,0,0,0.1), 0px 0px 5px 0px rgba(0,0,0,0.1)',
            }}
          >
            <div 
              className="grid gap-4 h-[34px] items-center px-2"
              style={{ gridTemplateColumns }}
            >
              {COLUMNS.map(col => (
                <div key={col.id} className="flex items-center gap-1.5 min-w-0">
                  <span className="font-['Roboto'] font-normal text-[12px] leading-[16px] text-[rgba(28,43,51,0.6)] truncate">
                    {col.label}
                  </span>
                  {col.hasInfo && (
                    <Icon 
                      name="InfoCircle" 
                      variant="filled" 
                      size={12} 
                      className="text-[#080809] shrink-0 opacity-60" 
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Data Rows */}
          {adSets.map((adSet, index) => (
            <div 
              key={adSet.id}
              className="bg-white px-[10px] py-2"
              style={{ 
                boxShadow: index < adSets.length - 1 ? '0px 1px 0px 0px rgba(0,0,0,0.1)' : undefined,
              }}
            >
              <div 
                className="grid gap-4 items-center px-2"
                style={{ gridTemplateColumns }}
              >
                {/* Name */}
                <div className="min-w-0">
                  <span className="font-optimistic text-[14px] leading-[20px] text-[rgba(0,0,0,0.75)] truncate block">
                    {adSet.name}
                  </span>
                </div>

                {/* Budget */}
                <div className="min-w-0">
                  <span className="font-optimistic text-[14px] leading-[20px] text-[rgba(0,0,0,0.75)]">
                    ${formatNumber(adSet.budget)}
                  </span>
                </div>

                {/* Budget % */}
                <div className="min-w-0">
                  <span className="font-optimistic text-[14px] leading-[20px] text-[rgba(0,0,0,0.75)]">
                    {adSet.budgetPercent}%
                  </span>
                </div>

                {/* Reach */}
                <div className="min-w-0">
                  <span className="font-optimistic text-[14px] leading-[20px] text-[rgba(0,0,0,0.75)]">
                    {formatNumber(adSet.reach)}
                  </span>
                </div>

                {/* Reach % */}
                <div className="min-w-0">
                  <span className="font-optimistic text-[14px] leading-[20px] text-[rgba(0,0,0,0.75)]">
                    {adSet.reachPercent}%
                  </span>
                </div>

                {/* Impressions */}
                <div className="min-w-0">
                  <span className="font-optimistic text-[14px] leading-[20px] text-[rgba(0,0,0,0.75)]">
                    {formatNumber(adSet.impressions)}
                  </span>
                </div>

                {/* Avg. Weekly Frequency */}
                <div className="min-w-0">
                  <span className="font-optimistic text-[14px] leading-[20px] text-[rgba(0,0,0,0.75)]">
                    {adSet.avgWeeklyFrequency.toFixed(2)}
                  </span>
                </div>

                {/* CPM */}
                <div className="min-w-0">
                  <span className="font-optimistic text-[14px] leading-[20px] text-[rgba(0,0,0,0.75)]">
                    ${adSet.cpm.toFixed(2)}
                  </span>
                </div>

                {/* Audience */}
                <div className="min-w-0">
                  <span className="font-optimistic text-[14px] leading-[20px] text-[rgba(0,0,0,0.75)] truncate block">
                    {adSet.audience}
                  </span>
                </div>

                {/* Performance Goal */}
                <div className="min-w-0">
                  <span className="font-optimistic text-[14px] leading-[20px] text-[rgba(0,0,0,0.75)] truncate block">
                    {adSet.performanceGoal}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Total Row */}
          {showTotal && (
          <div className="bg-white px-[10px] py-2">
            <div 
              className="grid gap-4 items-center px-2"
              style={{ gridTemplateColumns }}
            >
              {/* Total Label */}
              <div className="min-w-0">
                <span className="font-optimistic font-medium text-[14px] leading-[20px] text-[rgba(0,0,0,0.75)]">
                  Total
                </span>
              </div>

              {/* Total Budget */}
              <div className="min-w-0">
                <span className="font-optimistic text-[14px] leading-[20px] text-[rgba(0,0,0,0.75)]">
                  ${formatNumber(totals.budget)}
                </span>
              </div>

              {/* Budget % - dash */}
              <div className="min-w-0">
                <span className="font-optimistic text-[14px] leading-[20px] text-[rgba(0,0,0,0.75)]">
                  -
                </span>
              </div>

              {/* Reach - dash */}
              <div className="min-w-0">
                <span className="font-optimistic text-[14px] leading-[20px] text-[rgba(0,0,0,0.75)]">
                  -
                </span>
              </div>

              {/* Reach % - dash */}
              <div className="min-w-0">
                <span className="font-optimistic text-[14px] leading-[20px] text-[rgba(0,0,0,0.75)]">
                  -
                </span>
              </div>

              {/* Total Impressions */}
              <div className="min-w-0">
                <span className="font-optimistic text-[14px] leading-[20px] text-[rgba(0,0,0,0.75)]">
                  {formatNumber(totals.impressions)}
                </span>
              </div>

              {/* Avg. Weekly Frequency - dash */}
              <div className="min-w-0">
                <span className="font-optimistic text-[14px] leading-[20px] text-[rgba(0,0,0,0.75)]">
                  -
                </span>
              </div>

              {/* CPM - dash */}
              <div className="min-w-0">
                <span className="font-optimistic text-[14px] leading-[20px] text-[rgba(0,0,0,0.75)]">
                  -
                </span>
              </div>

              {/* Audience - dash */}
              <div className="min-w-0">
                <span className="font-optimistic text-[14px] leading-[20px] text-[rgba(0,0,0,0.75)]">
                  -
                </span>
              </div>

              {/* Performance Goal - dash */}
              <div className="min-w-0">
                <span className="font-optimistic text-[14px] leading-[20px] text-[rgba(0,0,0,0.75)]">
                  -
                </span>
              </div>
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
  );
}
