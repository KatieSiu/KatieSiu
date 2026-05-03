"use client";

import React, { useRef, useState, useCallback, useMemo, useEffect } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
} from "recharts";
import { colors } from "@/features/campaign-planner/lib/design-tokens";
import { ChartAdSet } from "./types";
import {
  createPortalTooltip,
  FocusedSpendTooltip,
  FocusedReachTooltip,
  FocusedFrequencyTooltip,
} from "./chart-tooltips";

// ============================================
// Chart Data Generation Functions
// ============================================

/** Generate spend per day data based on schedule */
function generateSpendPerDayData(startDate: Date, endDate: Date, totalBudget: number) {
  const days: { date: Date; dateStr: string; spend: number }[] = [];
  const currentDate = new Date(startDate);
  const end = new Date(endDate);

  const totalDays = Math.ceil((end.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const avgDailySpend = totalBudget / totalDays;

  while (currentDate <= end) {
    const dayOfMonth = currentDate.getDate();
    const variation = Math.sin(dayOfMonth * 0.5) * 0.2 + (Math.cos(dayOfMonth * 0.3) * 0.1);
    const dailySpend = avgDailySpend * (1 + variation);

    days.push({
      date: new Date(currentDate),
      dateStr: currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      spend: Math.round(dailySpend),
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return days;
}

/** Generate frequency distribution data */
function generateFrequencyDistribution(avgFrequency: number) {
  const maxFrequency = 8;
  const data: { frequency: number; percentage: number }[] = [];

  let totalPercentage = 0;
  const rawValues: number[] = [];

  for (let f = 1; f <= maxFrequency; f++) {
    const distanceFromAvg = Math.abs(f - avgFrequency);
    const value = Math.exp(-0.5 * distanceFromAvg) * (1 / f);
    rawValues.push(value);
    totalPercentage += value;
  }

  for (let f = 1; f <= maxFrequency; f++) {
    const normalizedPercent = (rawValues[f - 1] / totalPercentage) * 100;
    const percentage = Math.max(2, Math.min(35, normalizedPercent));
    data.push({
      frequency: f,
      percentage: Math.round(percentage * 10) / 10,
    });
  }

  return data;
}

/** Format large numbers for Y-axis */
function formatLargeNumberTick(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K`;
  }
  return value.toString();
}

/** Generate cumulative reach data over time */
function generateCumulativeReachData(startDate: Date, endDate: Date, totalReach: number) {
  const days: { date: Date; dateStr: string; reach: number }[] = [];
  const currentDate = new Date(startDate);
  const end = new Date(endDate);

  const totalDays = Math.ceil((end.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  let dayIndex = 0;

  while (currentDate <= end) {
    dayIndex++;
    const progress = Math.log(1 + dayIndex) / Math.log(1 + totalDays);
    const dayOfMonth = currentDate.getDate();
    const variation = 1 + (Math.sin(dayOfMonth * 0.7) * 0.02);
    const cumulativeReach = Math.round(totalReach * progress * variation);

    days.push({
      date: new Date(currentDate),
      dateStr: currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      reach: cumulativeReach,
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return days;
}

// ============================================
// Custom Active Dot Component
// Renders for focused series OR when there's only one series
// ============================================
interface CustomActiveDotProps {
  cx?: number;
  cy?: number;
  fill?: string;
  dataKey?: string;
  index?: number;
  focusedSeriesIndex: number | null;
  seriesIndex: number;
  hasMultipleSeries: boolean;
}

function CustomActiveDot({
  cx,
  cy,
  fill,
  focusedSeriesIndex,
  seriesIndex,
  hasMultipleSeries,
}: CustomActiveDotProps) {
  if (cx === undefined || cy === undefined) {
    return null;
  }

  // Show dot if:
  // 1. Single series (always show)
  // 2. Multiple series AND this series is focused
  const shouldShow = !hasMultipleSeries || focusedSeriesIndex === seriesIndex;

  if (!shouldShow) {
    return null;
  }

  return (
    <circle
      cx={cx}
      cy={cy}
      r={6}
      fill={fill}
      stroke="#fff"
      strokeWidth={2}
      style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))' }}
    />
  );
}

// ============================================
// Layout Constants
// ============================================
const BAR_CHART_TOP_MARGIN = 10;
const BAR_PLOT_AREA_HEIGHT = 180 - BAR_CHART_TOP_MARGIN - 10 - 35; // height - top - bottom - xAxis
const FREQ_Y_AXIS_MAX = 36;

const CHART_TOP_MARGIN = 10;
const CHART_BOTTOM_MARGIN = 10;
const CHART_HEIGHT = 180;
const X_AXIS_HEIGHT = 35;
const PLOT_AREA_HEIGHT = CHART_HEIGHT - CHART_TOP_MARGIN - CHART_BOTTOM_MARGIN - X_AXIS_HEIGHT;

// ============================================
// Metric Chart Component
// ============================================
interface MetricChartProps {
  metricType: 'reach' | 'impressions' | 'frequency';
  userBudget: number;
  audienceSize: number;
  startDate?: Date;
  endDate?: Date;
  avgFrequency?: number;
  adSets?: ChartAdSet[];
}

export function MetricChart({
  metricType,
  userBudget,
  audienceSize,
  startDate,
  endDate,
  avgFrequency = 1.5,
  adSets = []
}: MetricChartProps) {
  // === ALL REFS & STATE (unconditional) ===
  const chartRef = useRef<HTMLDivElement>(null);
  const [focusedSeriesIndex, setFocusedSeriesIndex] = useState<number | null>(null);
  const [activeDataIndex, setActiveDataIndex] = useState<number | null>(null);
  const lastMouseYRef = useRef<number | null>(null);
  const cycleIndexRef = useRef<number>(0);
  const barMouseYRef = useRef<number>(0);
  const mouseYRef = useRef<number>(0);

  // Use default single ad set if none provided
  const effectiveAdSets = useMemo(() =>
    adSets.length > 0 ? adSets : [{
      id: '1',
      name: 'Ad Set 1',
      budget: userBudget,
      reach: audienceSize,
      impressions: Math.round(audienceSize * avgFrequency)
    }],
    [adSets, userBudget, audienceSize, avgFrequency]
  );

  const seriesKeys = useMemo(() =>
    effectiveAdSets.map((_, i) => `adSet${i}`),
    [effectiveAdSets.length]
  );

  const hasMultipleSeries = effectiveAdSets.length > 1;

  // === COMPUTE ALL CHART DATA (unconditional) ===

  // Frequency chart data
  const frequencyData = useMemo(() => {
    const baseData = generateFrequencyDistribution(avgFrequency);
    return baseData.map(item => {
      const dataPoint: any = { frequency: item.frequency };
      effectiveAdSets.forEach((_, index) => {
        const variation = 1 + (index * 0.15 - 0.1);
        dataPoint[`adSet${index}`] = Math.max(0, Math.min(36, Math.round(item.percentage * variation)));
      });
      return dataPoint;
    });
  }, [avgFrequency, effectiveAdSets]);

  // Line chart data
  const lineChartConfig = useMemo(() => {
    if (metricType === 'impressions' && startDate && endDate) {
      const baseSpendData = generateSpendPerDayData(startDate, endDate, userBudget);

      const chartData = baseSpendData.map(item => {
        const dataPoint: any = { dateStr: item.dateStr, date: item.date };
        const totalBudget = effectiveAdSets.reduce((sum, as) => sum + as.budget, 0);

        effectiveAdSets.forEach((adSet, index) => {
          const proportion = totalBudget > 0 ? adSet.budget / totalBudget : 1 / effectiveAdSets.length;
          const dayOfMonth = item.date.getDate();
          const variation = 0.9 + (Math.sin(dayOfMonth * (index + 1) * 0.3) * 0.1 + 0.1);
          dataPoint[`adSet${index}`] = Math.round(item.spend * proportion * variation);
        });
        return dataPoint;
      });

      const allSpends = chartData.flatMap(d =>
        effectiveAdSets.map((_, i) => d[`adSet${i}`] || 0)
      );
      const maxSpend = Math.max(...allSpends);
      const yAxisMax = Math.ceil(maxSpend * 1.2 / 1000) * 1000;

      return {
        chartData,
        yAxisMax,
        yAxisFormatter: (value: number) => `$${(value / 1000).toFixed(1)}K`,
        TooltipComponent: FocusedSpendTooltip as React.ComponentType<any>,
      };
    } else if (metricType === 'reach' && startDate && endDate) {
      const totalReach = effectiveAdSets.reduce((sum, as) => sum + as.reach, 0);
      const baseReachData = generateCumulativeReachData(startDate, endDate, totalReach);
      const totalDays = baseReachData.length;

      const chartData = baseReachData.map((item, dayIndex) => {
        const dataPoint: any = { dateStr: item.dateStr, date: item.date };
        const totalAdSetReach = effectiveAdSets.reduce((sum, as) => sum + as.reach, 0);

        effectiveAdSets.forEach((adSet, index) => {
          const proportion = totalAdSetReach > 0 ? adSet.reach / totalAdSetReach : 1 / effectiveAdSets.length;
          const progress = Math.log(1 + (dayIndex + 1)) / Math.log(1 + totalDays);
          const adSetVariation = 1 + (index * 0.03 - 0.02);
          dataPoint[`adSet${index}`] = Math.round(adSet.reach * progress * adSetVariation);
        });
        return dataPoint;
      });

      const allReaches = chartData.flatMap(d =>
        effectiveAdSets.map((_, i) => d[`adSet${i}`] || 0)
      );
      const maxReach = Math.max(...allReaches);
      const yAxisMax = Math.ceil(maxReach * 1.2 / 100000) * 100000 || 100000;

      return {
        chartData,
        yAxisMax,
        yAxisFormatter: formatLargeNumberTick,
        TooltipComponent: FocusedReachTooltip as React.ComponentType<any>,
      };
    }
    return null;
  }, [metricType, startDate, endDate, userBudget, effectiveAdSets]);

  const chartData = lineChartConfig?.chartData ?? [];
  const lineYAxisMax = lineChartConfig?.yAxisMax ?? 0;
  const yAxisFormatter = lineChartConfig?.yAxisFormatter ?? formatLargeNumberTick;
  const TooltipComponent = lineChartConfig?.TooltipComponent ?? FocusedSpendTooltip;

  // === ALL CALLBACKS (unconditional) ===

  // Reset focus on mouse leave
  const handleMouseLeave = useCallback(() => {
    setFocusedSeriesIndex(null);
    setActiveDataIndex(null);
    lastMouseYRef.current = null;
    cycleIndexRef.current = 0;
  }, []);

  // --- Frequency chart callbacks ---

  const FrequencyTooltipWithFocus = useCallback((props: any) => (
    <FocusedFrequencyTooltip {...props} focusedIndex={focusedSeriesIndex} />
  ), [focusedSeriesIndex]);

  // Chart-level mouse move - only used for tooltip positioning, not series detection
  // Series detection is handled by onMouseMove on each Bar component
  const handleBarMouseMove = useCallback(() => {
    // Series and index detection handled by individual Bar onMouseMove
  }, []);

  // Native mouse move for bar chart - simplified since we rely on Recharts events
  const handleBarNativeMouseMove = useCallback(() => {
    // No longer needed - Recharts handleBarMouseMove handles series detection
  }, []);

  // --- Line chart callbacks ---

  // Calculate nearest series based on mouse Y position
  const findNearestSeriesAtPoint = useCallback((
    mouseY: number,
    dataIndex: number
  ): number => {
    // Guard against invalid data access
    if (dataIndex < 0 || dataIndex >= chartData.length || !chartData[dataIndex]) {
      return 0;
    }

    const dataPoint = chartData[dataIndex];
    let nearestIndex = 0;
    let nearestDistance = Infinity;

    // Adjust mouseY to be relative to the plot area (subtract top margin)
    const plotAreaMouseY = mouseY - CHART_TOP_MARGIN;

    // Check for overlapping lines (within threshold)
    const OVERLAP_THRESHOLD = 20; // pixels
    const seriesYPositions: { index: number; yPixel: number; value: number }[] = [];

    effectiveAdSets.forEach((_, index) => {
      const value = dataPoint?.[`adSet${index}`] || 0;
      // Convert value to Y pixel position within plot area
      // In SVG: Y=0 is top, so higher values = lower Y pixel
      const normalizedValue = value / lineYAxisMax; // 0 to 1
      const yPixel = PLOT_AREA_HEIGHT * (1 - normalizedValue); // Invert for SVG coordinates
      seriesYPositions.push({ index, yPixel, value });

      const distance = Math.abs(yPixel - plotAreaMouseY);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });

    // Check if multiple series are within threshold of cursor
    const overlapping = seriesYPositions.filter(
      s => Math.abs(s.yPixel - plotAreaMouseY) <= OVERLAP_THRESHOLD
    );

    if (overlapping.length > 1 && lastMouseYRef.current !== null) {
      // Cycle through overlapping series based on Y movement direction
      const yDelta = mouseY - lastMouseYRef.current;

      if (Math.abs(yDelta) > 5) {
        if (yDelta > 0) {
          cycleIndexRef.current = (cycleIndexRef.current + 1) % overlapping.length;
        } else {
          cycleIndexRef.current = (cycleIndexRef.current - 1 + overlapping.length) % overlapping.length;
        }
        nearestIndex = overlapping[cycleIndexRef.current % overlapping.length].index;
      } else if (focusedSeriesIndex !== null && overlapping.some(s => s.index === focusedSeriesIndex)) {
        // Keep current selection if still in overlapping set
        nearestIndex = focusedSeriesIndex;
      }
    } else {
      cycleIndexRef.current = 0;
    }

    lastMouseYRef.current = mouseY;
    return nearestIndex;
  }, [chartData, effectiveAdSets, lineYAxisMax, focusedSeriesIndex]);

  // Handle mouse move on the chart - capture data index from Recharts
  const handleLineMouseMove = useCallback((state: any, event: any) => {
    // Get data index from Recharts state - always update this
    const dataIndex = state?.activeTooltipIndex;
    if (dataIndex !== undefined && dataIndex >= 0) {
      setActiveDataIndex(dataIndex);
    }

    if (!hasMultipleSeries) return;
    if (dataIndex === undefined || dataIndex < 0) return;

    // Get mouse Y from native event and chart container
    let mouseY: number | undefined;

    if (event?.nativeEvent && chartRef.current) {
      const rect = chartRef.current.getBoundingClientRect();
      // Calculate Y relative to chart container
      mouseY = event.nativeEvent.clientY - rect.top;
    } else if (state?.chartY !== undefined) {
      mouseY = state.chartY;
    }

    if (mouseY === undefined) return;

    const nearestIndex = findNearestSeriesAtPoint(mouseY, dataIndex);
    setFocusedSeriesIndex(nearestIndex);
  }, [hasMultipleSeries, findNearestSeriesAtPoint]);

  // Create focused tooltip
  const TooltipWithFocus = useCallback((props: any) => (
    <TooltipComponent {...props} focusedIndex={focusedSeriesIndex} />
  ), [focusedSeriesIndex, TooltipComponent]);

  // Native mouse move handler for reliable Y tracking
  const handleNativeMouseMove = useCallback((e: React.MouseEvent) => {
    if (!chartRef.current) return;

    const rect = chartRef.current.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    mouseYRef.current = mouseY;

    if (!hasMultipleSeries || activeDataIndex === null) return;

    const nearestIndex = findNearestSeriesAtPoint(mouseY, activeDataIndex);
    setFocusedSeriesIndex(nearestIndex);
  }, [hasMultipleSeries, activeDataIndex, findNearestSeriesAtPoint]);

  // === ALL EFFECTS (unconditional) ===

  // Effect to update focus when activeDataIndex changes (from Recharts)
  useEffect(() => {
    if (!hasMultipleSeries || activeDataIndex === null) return;

    const nearestIndex = findNearestSeriesAtPoint(mouseYRef.current, activeDataIndex);
    setFocusedSeriesIndex(nearestIndex);
  }, [activeDataIndex, hasMultipleSeries, findNearestSeriesAtPoint]);

  // === NON-HOOK DERIVED VALUES ===
  const PortalFrequencyTooltip = createPortalTooltip(FrequencyTooltipWithFocus, chartRef);
  const PortalTooltip = createPortalTooltip(TooltipWithFocus, chartRef);

  // ============================================
  // CONDITIONAL RENDERING
  // ============================================

  // FREQUENCY DISTRIBUTION CHART (Bar Chart)
  if (metricType === 'frequency') {
    return (
      <div
        ref={chartRef}
        className="relative"
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleBarNativeMouseMove}
      >
        <ResponsiveContainer width="100%" height={180} className="outline-none focus:outline-none">
          <BarChart
            style={{ outline: 'none' }}
            data={frequencyData}
            margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
            barCategoryGap="15%"
            barGap={2}
            onMouseMove={handleBarMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <CartesianGrid
              strokeDasharray="0"
              vertical={false}
              stroke={colors.chart.gridLine}
            />
            <XAxis
              dataKey="frequency"
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 12,
                fontFamily: 'SF Pro Text, sans-serif',
                fill: colors.chart.axisLabel
              }}
              dy={10}
              height={35}
            />
            <YAxis
              tickFormatter={(value) => `${value}%`}
              domain={[0, FREQ_Y_AXIS_MAX]}
              ticks={[0, 12, 24, 36]}
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 12,
                fontFamily: 'SF Pro Text, sans-serif',
                fill: colors.chart.axisLabel
              }}
              dx={-4}
              width={40}
            />
            <RechartsTooltip
              content={<PortalFrequencyTooltip />}
              cursor={false}
              animationDuration={0}
              isAnimationActive={false}
            />
            {effectiveAdSets.map((adSet, seriesIndex) => {
              const baseColor = colors.adSet[seriesIndex % colors.adSet.length];

              return (
                <Bar
                  key={adSet.id}
                  dataKey={`adSet${seriesIndex}`}
                  name={adSet.name}
                  fill={baseColor}
                  radius={[2, 2, 0, 0]}
                  maxBarSize={effectiveAdSets.length > 1 ? 30 : 60}
                  onMouseMove={(data: any) => {
                    // When mouse moves over this specific Bar series, set the focused series
                    if (data && data.index !== undefined) {
                      setFocusedSeriesIndex(seriesIndex);
                      setActiveDataIndex(data.index);
                    }
                  }}
                >
                  {/* Use Cell to control individual bar opacity */}
                  {frequencyData.map((_, dataIndex) => {
                    // Only highlight the ONE bar at the intersection of focused series and active data index
                    const isThisCellFocused = focusedSeriesIndex === seriesIndex && activeDataIndex === dataIndex;
                    
                    // If we have a focused bar, dim all others; otherwise show all at full opacity
                    const hasFocus = focusedSeriesIndex !== null && activeDataIndex !== null;
                    const opacity = hasFocus ? (isThisCellFocused ? 1 : 0.3) : 1;
                    
                    return (
                      <Cell
                        key={`cell-${seriesIndex}-${dataIndex}`}
                        fill={baseColor}
                        fillOpacity={opacity}
                      />
                    );
                  })}
                </Bar>
              );
            })}
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  // LINE CHART (shared by Spend and Reach)
  if (!lineChartConfig) {
    // No valid data - show empty state
    return (
      <div ref={chartRef} className="relative flex items-center justify-center h-[180px]">
        <p className="text-sm" style={{ color: colors.text.muted }}>
          Schedule required to display chart
        </p>
      </div>
    );
  }

  const totalDays = chartData.length;
  const tickInterval = Math.max(1, Math.floor(totalDays / 6));

  return (
    <div
      ref={chartRef}
      className="relative"
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleNativeMouseMove}
    >
      <ResponsiveContainer width="100%" height={180} className="outline-none focus:outline-none">
        <LineChart
          style={{ outline: 'none' }}
          data={chartData}
          margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
          onMouseMove={handleLineMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <CartesianGrid
            strokeDasharray="0"
            vertical={false}
            stroke={colors.chart.gridLine}
          />
          <XAxis
            dataKey="dateStr"
            axisLine={false}
            tickLine={false}
            tick={{
              fontSize: 12,
              fontFamily: 'SF Pro Text, sans-serif',
              fill: colors.chart.axisLabel
            }}
            dy={10}
            height={35}
            interval={tickInterval - 1}
            padding={{ left: 20, right: 20 }}
          />
          <YAxis
            tickFormatter={yAxisFormatter}
            domain={[0, lineYAxisMax]}
            axisLine={false}
            tickLine={false}
            tick={{
              fontSize: 12,
              fontFamily: 'SF Pro Text, sans-serif',
              fill: colors.chart.axisLabel
            }}
            dx={-4}
            width={55}
          />
          <RechartsTooltip
            content={<PortalTooltip />}
            animationDuration={0}
            isAnimationActive={false}
          />
          {effectiveAdSets.map((adSet, index) => {
            const baseColor = colors.adSet[index % colors.adSet.length];
            const isFocused = !hasMultipleSeries || focusedSeriesIndex === null || focusedSeriesIndex === index;
            const opacity = isFocused ? 1 : 0.3;
            const strokeWidth = isFocused && hasMultipleSeries && focusedSeriesIndex === index ? 3 : 2;

            return (
              <Line
                key={adSet.id}
                type="monotone"
                dataKey={`adSet${index}`}
                name={adSet.name}
                stroke={baseColor}
                strokeWidth={strokeWidth}
                strokeOpacity={opacity}
                dot={false}
                activeDot={(props: any) => (
                  <CustomActiveDot
                    {...props}
                    focusedSeriesIndex={focusedSeriesIndex}
                    seriesIndex={index}
                    hasMultipleSeries={hasMultipleSeries}
                  />
                )}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
