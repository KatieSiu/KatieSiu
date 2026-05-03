"use client";

import { useState, useEffect } from "react";
import { cn } from "@/features/ctv/lib/utils";
import { Icon } from "@/features/ctv/components/ui/Icon";
import { Button } from "@/features/ctv/components/ui/Button";

// ============================================
// Types
// ============================================
interface VideoGeneratingToastProps {
  /** Whether the toast is visible */
  isVisible?: boolean;
  /** Callback when generation completes (reaches 100%) */
  onComplete?: () => void;
  /** Callback when close button is clicked */
  onClose?: () => void;
  /** Callback when "View Ad" button is clicked */
  onViewAd?: () => void;
  /** Initial percentage (default: 10) */
  initialPercent?: number;
  /** Duration in ms to go from 0 to 100 (default: 15000 = 15 seconds) */
  duration?: number;
  /** Whether to auto-start the animation */
  autoStart?: boolean;
}

interface VideoUploadCompleteToastProps {
  /** Whether the toast is visible */
  isVisible?: boolean;
  /** Callback when close button is clicked */
  onClose?: () => void;
  /** Callback when "View Ad" button is clicked */
  onViewAd?: () => void;
}

// ============================================
// Animated Progress Bar Component
// ============================================
function AnimatedProgressBar({ percent }: { percent: number }) {
  return (
    <div className="w-full h-2 bg-[#F1F4F7] rounded-full overflow-hidden">
      <div 
        className="h-full rounded-full transition-all duration-500 ease-out relative overflow-hidden"
        style={{ width: `${percent}%` }}
      >
        {/* Animated striped background */}
        <div 
          className="absolute inset-0 bg-[#0A78BE]"
          style={{
            backgroundImage: `repeating-linear-gradient(
              -45deg,
              rgba(10, 120, 190, 0.6),
              rgba(10, 120, 190, 0.6) 4px,
              rgba(10, 120, 190, 0.9) 4px,
              rgba(10, 120, 190, 0.9) 8px
            )`,
            backgroundSize: '16px 16px',
            animation: 'progress-stripes 0.5s linear infinite',
          }}
        />
      </div>
      
      {/* CSS Animation */}
      <style jsx>{`
        @keyframes progress-stripes {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 16px 0;
          }
        }
      `}</style>
    </div>
  );
}

// ============================================
// Video Generating Toast Component (Loading State)
// ============================================
export function VideoGeneratingToast({
  isVisible = true,
  onComplete,
  onClose,
  onViewAd,
  initialPercent = 10,
  duration = 15000,
  autoStart = true,
}: VideoGeneratingToastProps) {
  const [percent, setPercent] = useState(initialPercent);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!autoStart || isComplete) return;

    // Calculate interval to increment by 10% each step
    const steps = (100 - initialPercent) / 10;
    const intervalTime = duration / steps;

    const interval = setInterval(() => {
      setPercent((prev) => {
        const next = prev + 10;
        if (next >= 100) {
          clearInterval(interval);
          setIsComplete(true);
          onComplete?.();
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [autoStart, duration, initialPercent, isComplete, onComplete]);

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "bg-white rounded-[4px]",
        "shadow-[0px_2px_12px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)]",
        "p-4",
        "w-[360px]",
        "flex gap-2"
      )}
    >
      {/* Refresh Icon */}
      <div className="shrink-0 w-8 h-8 rounded-[2px] overflow-hidden">
        <img 
          src="/images/refresh-icon.png" 
          alt="Generating" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col gap-2">
        {/* Progress Bar */}
        <AnimatedProgressBar percent={percent} />

        {/* Header */}
        <p className="text-[14px] font-bold leading-[20px] text-[#1C2B33] font-optimistic">
          Uploading video {percent}%
        </p>

        {/* Description */}
        <p className="text-[14px] font-normal leading-[20px] text-[#1C2B33] font-optimistic">
          This may take up to 30 minutes. Keep this window open.
        </p>
      </div>

      {/* Close Button */}
      <button
        type="button"
        onClick={onClose}
        className="shrink-0 w-4 h-4 flex items-center justify-center hover:opacity-70 transition-opacity"
      >
        <Icon name="Close" variant="outlined" size={16} className="text-[#283943]" />
      </button>
    </div>
  );
}

// ============================================
// Video Generating Toast Component (Controlled - External Percent)
// ============================================
interface VideoGeneratingToastControlledProps {
  /** Whether the toast is visible */
  isVisible?: boolean;
  /** Current percentage (controlled externally) */
  percent: number;
  /** Callback when close button is clicked */
  onClose?: () => void;
}

export function VideoGeneratingToastControlled({
  isVisible = true,
  percent,
  onClose,
}: VideoGeneratingToastControlledProps) {
  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "bg-white rounded-[4px]",
        "shadow-[0px_2px_12px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)]",
        "p-4",
        "w-[360px]",
        "flex gap-2"
      )}
    >
      {/* Refresh Icon */}
      <div className="shrink-0 w-8 h-8 rounded-[2px] overflow-hidden">
        <img 
          src="/images/refresh-icon.png" 
          alt="Generating" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col gap-2">
        {/* Progress Bar */}
        <AnimatedProgressBar percent={percent} />

        {/* Header */}
        <p className="text-[14px] font-bold leading-[20px] text-[#1C2B33] font-optimistic">
          Uploading video {percent}%
        </p>

        {/* Description */}
        <p className="text-[14px] font-normal leading-[20px] text-[#1C2B33] font-optimistic">
          This may take up to 30 minutes. Keep this window open.
        </p>
      </div>

      {/* Close Button */}
      <button
        type="button"
        onClick={onClose}
        className="shrink-0 w-4 h-4 flex items-center justify-center hover:opacity-70 transition-opacity"
      >
        <Icon name="Close" variant="outlined" size={16} className="text-[#283943]" />
      </button>
    </div>
  );
}

// ============================================
// Video Upload Complete Toast Component (Success State)
// ============================================
export function VideoUploadCompleteToast({
  isVisible = true,
  onClose,
  onViewAd,
}: VideoUploadCompleteToastProps) {
  if (!isVisible) return null;

  return (
    <div
      className={cn(
        "bg-white rounded-[4px]",
        "shadow-[0px_2px_12px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)]",
        "p-4",
        "w-[360px]",
        "flex gap-2"
      )}
    >
      {/* Success Icon */}
      <div className="shrink-0 w-8 h-8 rounded-[2px] overflow-hidden">
        <img 
          src="/images/success-icon.png" 
          alt="Success" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col gap-2">
        {/* Header */}
        <p className="text-[14px] font-bold leading-[20px] text-[#1C2B33] font-optimistic">
          Upload complete
        </p>

        {/* Description */}
        <p className="text-[14px] font-normal leading-[20px] text-[#1C2B33] font-optimistic">
          Review your video ad to finish and publish.
        </p>

        {/* View Ad Button */}
        <button
          type="button"
          onClick={onViewAd}
          className={cn(
            "self-start",
            "h-9 px-3",
            "flex items-center justify-center",
            "bg-white border border-[#CBD2D9] rounded-[4px]",
            "hover:bg-[#F5F7F8] transition-colors"
          )}
        >
          <span className="text-[14px] font-medium leading-[20px] text-[#1C2B33] font-optimistic">
            Review
          </span>
        </button>
      </div>

      {/* Close Button */}
      <button
        type="button"
        onClick={onClose}
        className="shrink-0 w-4 h-4 flex items-center justify-center hover:opacity-70 transition-opacity self-start"
      >
        <Icon name="Close" variant="outlined" size={16} className="text-[#283943]" />
      </button>
    </div>
  );
}

// ============================================
// Combined Toast with Auto-Transition
// Starts with generating state, transitions to complete state
// Supports both internal auto-progress and external percent control
// ============================================
interface VideoGenerationToastFlowProps {
  /** Whether the toast is visible */
  isVisible?: boolean;
  /** Callback when close button is clicked */
  onClose?: () => void;
  /** Callback when "View Ad" button is clicked - opens Creative Setup Alpha modal */
  onViewAd?: () => void;
  /** Duration in ms to go from 10% to 100% (default: 15000 = 15 seconds) */
  duration?: number;
  /** Whether to auto-start the animation (ignored if externalPercent is provided) */
  autoStart?: boolean;
  /** External percent value - when provided, disables internal progress */
  externalPercent?: number;
  /** External complete state - when true, shows the complete toast */
  externalComplete?: boolean;
}

export function VideoGenerationToastFlow({
  isVisible = true,
  onClose,
  onViewAd,
  duration = 15000,
  autoStart = true,
  externalPercent,
  externalComplete,
}: VideoGenerationToastFlowProps) {
  const [internalShowComplete, setInternalShowComplete] = useState(false);

  // Use external complete state if provided, otherwise use internal
  const showComplete = externalComplete !== undefined ? externalComplete : internalShowComplete;

  const handleComplete = () => {
    setInternalShowComplete(true);
  };

  if (!isVisible) return null;

  if (showComplete) {
    return (
      <VideoUploadCompleteToast
        isVisible={true}
        onClose={onClose}
        onViewAd={onViewAd}
      />
    );
  }

  // If external percent is provided, use controlled mode
  if (externalPercent !== undefined) {
    return (
      <VideoGeneratingToastControlled
        isVisible={true}
        percent={externalPercent}
        onClose={onClose}
      />
    );
  }

  return (
    <VideoGeneratingToast
      isVisible={true}
      onComplete={handleComplete}
      onClose={onClose}
      duration={duration}
      autoStart={autoStart}
    />
  );
}

// ============================================
// Preview Components for Modal Gallery
// ============================================

// Preview for Generating Toast only
export function VideoGeneratingToastPreview() {
  const [key, setKey] = useState(0);

  const handleRestart = () => {
    setKey((prev) => prev + 1);
  };

  return (
    <div className="relative">
      {/* Restart button */}
      <button
        onClick={handleRestart}
        className="mb-4 px-3 py-2 bg-[#0A78BE] text-white text-[14px] font-medium rounded-[4px] hover:bg-[#0969A5] transition-colors"
      >
        Restart Animation
      </button>
      
      {/* Toast Preview */}
      <VideoGeneratingToast
        key={key}
        isVisible={true}
        autoStart={true}
        duration={15000}
        onComplete={() => console.log("Generation complete!")}
      />
    </div>
  );
}

// Preview for Upload Complete Toast only
export function VideoUploadCompleteToastPreview() {
  return (
    <div className="relative">
      <VideoUploadCompleteToast
        isVisible={true}
        onViewAd={() => console.log("View Ad clicked - would open Creative Setup Alpha modal")}
      />
    </div>
  );
}

// Preview for Full Flow (Generating → Complete)
export function VideoGenerationToastFlowPreview() {
  const [key, setKey] = useState(0);

  const handleRestart = () => {
    setKey((prev) => prev + 1);
  };

  return (
    <div className="relative">
      {/* Restart button */}
      <button
        onClick={handleRestart}
        className="mb-4 px-3 py-2 bg-[#0A78BE] text-white text-[14px] font-medium rounded-[4px] hover:bg-[#0969A5] transition-colors"
      >
        Restart Full Flow
      </button>
      
      {/* Toast Flow Preview */}
      <VideoGenerationToastFlow
        key={key}
        isVisible={true}
        autoStart={true}
        duration={15000}
        onViewAd={() => console.log("View Ad clicked - would open Creative Setup Alpha modal")}
      />
    </div>
  );
}

export default VideoGeneratingToast;
