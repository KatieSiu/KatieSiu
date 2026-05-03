"use client";

import { useState, useCallback, useMemo, useRef } from "react";

// ============================================
// Chart Focus Hook
// Implements Mixpanel-style nearest-line detection for multi-series charts
// ============================================

export interface ChartFocusState {
  focusedSeriesIndex: number | null;
  focusedDataIndex: number | null;
  isHovering: boolean;
}

export interface UseChartFocusOptions {
  /** Number of series (ad sets) in the chart */
  seriesCount: number;
  /** Chart data array */
  data: any[];
  /** Keys for each series data (e.g., ['adSet0', 'adSet1']) */
  seriesKeys: string[];
  /** Minimum pixel distance to consider lines as "overlapping" - uses adaptive threshold */
  overlapThreshold?: number;
}

export interface UseChartFocusReturn {
  /** Current focus state */
  focusState: ChartFocusState;
  /** Handler for mouse move events - calculates nearest series */
  handleMouseMove: (e: any, chartHeight: number, yAxisDomain: [number, number]) => void;
  /** Handler for mouse leave */
  handleMouseLeave: () => void;
  /** Get opacity for a series based on focus state */
  getSeriesOpacity: (seriesIndex: number) => number;
  /** Check if a series is currently focused */
  isSeriesFocused: (seriesIndex: number) => boolean;
  /** Get the focused series data for tooltip */
  getFocusedPayload: (payload: any[]) => any[];
}

/**
 * Custom hook for managing chart focus state with nearest-line detection
 * 
 * Key features:
 * 1. Detects which line is closest to cursor Y position
 * 2. Handles overlapping lines with cycling behavior
 * 3. Provides opacity values for visual dimming
 * 4. Filters tooltip payload to show only focused series
 */
export function useChartFocus({
  seriesCount,
  data,
  seriesKeys,
  overlapThreshold = 8,
}: UseChartFocusOptions): UseChartFocusReturn {
  const [focusState, setFocusState] = useState<ChartFocusState>({
    focusedSeriesIndex: null,
    focusedDataIndex: null,
    isHovering: false,
  });

  // Track previous Y position for cycling through overlapping lines
  const lastYRef = useRef<number | null>(null);
  const cycleIndexRef = useRef<number>(0);

  /**
   * Calculate the Y pixel position for a data value
   */
  const valueToPixel = useCallback((
    value: number,
    chartHeight: number,
    yAxisDomain: [number, number]
  ): number => {
    const [minY, maxY] = yAxisDomain;
    const range = maxY - minY;
    if (range === 0) return chartHeight / 2;
    // Invert because SVG Y increases downward
    return chartHeight - ((value - minY) / range) * chartHeight;
  }, []);

  /**
   * Find the nearest series to the cursor Y position
   * Handles overlapping lines by cycling through them on small Y movements
   */
  const handleMouseMove = useCallback((
    e: any,
    chartHeight: number,
    yAxisDomain: [number, number]
  ) => {
    if (!e || !e.activePayload || e.activePayload.length === 0) {
      return;
    }

    const dataIndex = e.activeTooltipIndex;
    if (dataIndex === undefined || dataIndex < 0 || dataIndex >= data.length) {
      return;
    }

    // Get cursor Y position relative to chart area
    // Recharts provides chartY in the event
    const cursorY = e.chartY;
    if (cursorY === undefined) return;

    // Calculate Y positions for all series at this data point
    const seriesPositions: { index: number; yPixel: number; value: number }[] = [];
    
    for (let i = 0; i < seriesCount; i++) {
      const key = seriesKeys[i];
      const value = data[dataIndex]?.[key];
      if (value !== undefined && value !== null) {
        const yPixel = valueToPixel(value, chartHeight, yAxisDomain);
        seriesPositions.push({ index: i, yPixel, value });
      }
    }

    if (seriesPositions.length === 0) return;

    // Sort by distance to cursor
    const sortedByDistance = [...seriesPositions].sort(
      (a, b) => Math.abs(a.yPixel - cursorY) - Math.abs(b.yPixel - cursorY)
    );

    // Find all series within the overlap threshold of the cursor
    const nearestDistance = Math.abs(sortedByDistance[0].yPixel - cursorY);
    const overlappingSeries = sortedByDistance.filter(
      s => Math.abs(s.yPixel - cursorY) <= nearestDistance + overlapThreshold
    );

    let selectedIndex: number;

    if (overlappingSeries.length > 1) {
      // Multiple lines are close - use cycling behavior based on Y movement direction
      const lastY = lastYRef.current;
      
      if (lastY !== null) {
        const yDelta = cursorY - lastY;
        
        // If user moved cursor vertically by more than 2px, cycle to next/prev series
        if (Math.abs(yDelta) > 2) {
          if (yDelta > 0) {
            // Moving down - cycle forward
            cycleIndexRef.current = (cycleIndexRef.current + 1) % overlappingSeries.length;
          } else {
            // Moving up - cycle backward
            cycleIndexRef.current = (cycleIndexRef.current - 1 + overlappingSeries.length) % overlappingSeries.length;
          }
        }
      }
      
      // Ensure cycle index is within bounds
      cycleIndexRef.current = cycleIndexRef.current % overlappingSeries.length;
      selectedIndex = overlappingSeries[cycleIndexRef.current].index;
    } else {
      // Single nearest line - reset cycle
      cycleIndexRef.current = 0;
      selectedIndex = sortedByDistance[0].index;
    }

    lastYRef.current = cursorY;

    setFocusState({
      focusedSeriesIndex: selectedIndex,
      focusedDataIndex: dataIndex,
      isHovering: true,
    });
  }, [data, seriesCount, seriesKeys, overlapThreshold, valueToPixel]);

  /**
   * Reset focus state when mouse leaves chart
   */
  const handleMouseLeave = useCallback(() => {
    setFocusState({
      focusedSeriesIndex: null,
      focusedDataIndex: null,
      isHovering: false,
    });
    lastYRef.current = null;
    cycleIndexRef.current = 0;
  }, []);

  /**
   * Get opacity for a series based on current focus state
   * Focused series: 1.0 (full opacity)
   * Other series: 0.3 (dimmed)
   * No focus: 1.0 (all full opacity)
   */
  const getSeriesOpacity = useCallback((seriesIndex: number): number => {
    if (!focusState.isHovering || focusState.focusedSeriesIndex === null) {
      return 1;
    }
    return focusState.focusedSeriesIndex === seriesIndex ? 1 : 0.3;
  }, [focusState.isHovering, focusState.focusedSeriesIndex]);

  /**
   * Check if a specific series is currently focused
   */
  const isSeriesFocused = useCallback((seriesIndex: number): boolean => {
    if (!focusState.isHovering || focusState.focusedSeriesIndex === null) {
      return true; // All focused when not hovering
    }
    return focusState.focusedSeriesIndex === seriesIndex;
  }, [focusState.isHovering, focusState.focusedSeriesIndex]);

  /**
   * Filter tooltip payload to only include the focused series
   */
  const getFocusedPayload = useCallback((payload: any[]): any[] => {
    if (!payload || payload.length === 0) return payload;
    
    // If only one series or no focus, return as-is
    if (payload.length === 1 || focusState.focusedSeriesIndex === null) {
      return payload;
    }

    // Return only the focused series
    const focusedEntry = payload[focusState.focusedSeriesIndex];
    return focusedEntry ? [focusedEntry] : payload;
  }, [focusState.focusedSeriesIndex]);

  return {
    focusState,
    handleMouseMove,
    handleMouseLeave,
    getSeriesOpacity,
    isSeriesFocused,
    getFocusedPayload,
  };
}
