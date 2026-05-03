"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

// ============================================
// Portal Tooltip HOC
// Creates a tooltip component that renders via portal to document.body
// This ensures tooltips are never clipped by chart container bounds
// Tooltip is vertically centered on the chart, only moves horizontally
// ============================================
export function createPortalTooltip<P extends { active?: boolean; coordinate?: { x: number; y: number } }>(
  TooltipContent: React.ComponentType<P>,
  chartRef: React.RefObject<HTMLDivElement | null>
) {
  return function PortalTooltip(props: P) {
    const [mounted, setMounted] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const tooltipRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      setMounted(true);
    }, []);

    useEffect(() => {
      if (props.active && props.coordinate && chartRef?.current) {
        const chartRect = chartRef.current.getBoundingClientRect();
        
        // Horizontal position: based on data point's x coordinate
        let x = chartRect.left + props.coordinate.x + window.scrollX;
        
        // Vertical position: fixed at chart's vertical center (not cursor-based)
        // This keeps the tooltip stable vertically
        const chartCenterY = chartRect.top + (chartRect.height / 2) + window.scrollY;
        let y = chartCenterY;

        // Adjust position to keep tooltip within viewport
        if (tooltipRef.current) {
          const tooltipRect = tooltipRef.current.getBoundingClientRect();
          const viewportWidth = window.innerWidth;
          const viewportHeight = window.innerHeight;

          // Center tooltip vertically on the chart center point
          y = chartCenterY - (tooltipRect.height / 2);

          // If tooltip would go off right edge, position to left of data point
          if (x + tooltipRect.width + 20 > viewportWidth + window.scrollX) {
            x = x - tooltipRect.width - 20;
          } else {
            x = x + 15; // Default offset to right
          }

          // If tooltip would go off bottom edge, adjust up
          if (y + tooltipRect.height > viewportHeight + window.scrollY) {
            y = viewportHeight + window.scrollY - tooltipRect.height - 10;
          }

          // Ensure tooltip doesn't go off top
          if (y < window.scrollY) {
            y = window.scrollY + 10;
          }

          // Ensure tooltip doesn't go off left
          if (x < window.scrollX) {
            x = window.scrollX + 10;
          }
        }

        setPosition({ x, y });
      }
    }, [props.active, props.coordinate]);

    if (!mounted || !props.active) return null;

    const tooltipElement = (
      <div
        ref={tooltipRef}
        style={{
          position: 'absolute',
          left: position.x,
          top: position.y,
          zIndex: 9999,
          pointerEvents: 'none',
          transition: 'none',
        }}
      >
        <TooltipContent {...props} />
      </div>
    );

    return createPortal(tooltipElement, document.body);
  };
}

