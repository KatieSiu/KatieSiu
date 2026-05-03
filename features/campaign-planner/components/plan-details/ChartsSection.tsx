"use client";

import React, { useState } from "react";
import { Icon } from "@/features/campaign-planner/components/ui/Icon";
import { Pill } from "@/features/campaign-planner/components/ui/Pill";
import { TabBar } from "@/features/campaign-planner/components/ui/TabBar";
import { Tooltip } from "@/features/campaign-planner/components/ui/Tooltip";
import { colors } from "@/features/campaign-planner/lib/design-tokens";
import { ChartAdSet } from "./types";
import { MetricChart } from "./MetricChart";

// ============================================
// Charts Section Component
// ============================================
interface ChartsSectionProps {
  forecastDate: Date;
  onRefreshForecast?: () => void;
  userBudget: number;
  audienceSize: number;
  startDate: Date;
  endDate: Date;
  avgFrequency: number;
  adSets?: ChartAdSet[];
}

export function ChartsSection({ 
  forecastDate: initialForecastDate, 
  onRefreshForecast, 
  userBudget, 
  audienceSize, 
  startDate, 
  endDate, 
  avgFrequency, 
  adSets = [] 
}: ChartsSectionProps) {
  const [activeTab, setActiveTab] = useState<string>("impressions");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshedDate, setLastRefreshedDate] = useState<Date>(initialForecastDate);

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(lastRefreshedDate);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    // Simulate a refresh delay for visual feedback
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Update to today's date
    setLastRefreshedDate(new Date());
    setIsRefreshing(false);
    
    // Call the optional callback if provided
    onRefreshForecast?.();
  };

  return (
    <div 
      className="rounded-[8px] shadow-[0px_0px_8px_0px_rgba(10,120,190,0.08)] overflow-hidden"
      style={{ backgroundColor: colors.background.content }}
    >
      {/* Tab Bar + Forecast Date */}
      <div className="flex items-center justify-between pl-4 pr-[54px] py-3">
        <TabBar value={activeTab} onChange={setActiveTab}>
          <TabBar.Tab value="impressions" label="Daily Spend" />
          <TabBar.Tab value="reach" label="Cumulative Reach" />
          <TabBar.Tab value="frequency" label="Frequency" />
        </TabBar>

        {/* Forecast Date + Refresh */}
        <div className="flex items-center gap-[6px]">
          <Pill variant="default">Forecast as of {formattedDate}</Pill>
          <Tooltip content="Refresh" variant="system" preferredPosition="top">
            <button 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={`shrink-0 flex items-center justify-center transition-all ${isRefreshing ? 'animate-spin' : 'hover:opacity-70'}`}
              aria-label="Refresh forecast"
            >
              <Icon
                name="RefreshRight"
                variant="outlined"
                size={16}
                color={colors.interactive.primaryHover}
              />
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Chart Area - Responsive like tables */}
      <div className="px-4 pb-4 relative">
        {/* Loading overlay */}
        {isRefreshing && (
          <div 
            className="absolute inset-0 flex items-center justify-center z-10 rounded-b-[8px]"
            style={{ backgroundColor: 'rgba(255,255,255,0.7)' }}
          >
            <div className="flex flex-col items-center gap-2">
              <div 
                className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" 
                style={{ borderColor: colors.interactive.primaryHover, borderTopColor: 'transparent' }} 
              />
              <span 
                className="text-sm font-medium"
                style={{ color: colors.text.muted }}
              >
                Refreshing data...
              </span>
            </div>
          </div>
        )}
        
        <MetricChart 
          metricType={activeTab as 'reach' | 'impressions' | 'frequency'} 
          userBudget={userBudget}
          audienceSize={audienceSize}
          startDate={startDate}
          endDate={endDate}
          avgFrequency={avgFrequency}
          adSets={adSets}
        />
      </div>
    </div>
  );
}

