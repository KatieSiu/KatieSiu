"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "./Button";
import { Icon } from "./Icon";

// ============================================
// Book in Ads Manager Modal Props
// ============================================
interface CampaignSummary {
  campaignName: string;
  campaignType: string;
  totalBudget: string;
  impressions: string;
  cpm: string;
  scheduleStart: string;
  scheduleEnd: string;
  lastRefreshed: string;
}

interface BookInAdsManagerModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when modal should close */
  onClose: () => void;
  /** Callback when book is clicked */
  onBook?: () => void;
  /** Campaign summary data */
  campaignData?: CampaignSummary;
}

// ============================================
// Date Formatting Utility
// ============================================
const MONTH_ABBR = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatDateForDisplay(date: Date): string {
  return `${MONTH_ABBR[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

// ============================================
// Summary Item Component
// ============================================
interface SummaryItemProps {
  value: string | React.ReactNode;
  label: string;
  width?: string;
  flex?: boolean;
}

function SummaryItem({ value, label, width, flex }: SummaryItemProps) {
  return (
    <div 
      className={`flex flex-col gap-[2px] items-start justify-center shrink-0 ${flex ? 'flex-1 min-w-0' : ''}`}
      style={width ? { width } : undefined}
    >
      <div className="text-[14px] leading-[20px] text-[rgba(0,0,0,0.75)]">
        {value}
      </div>
      <p className="text-[12px] leading-[16px] text-[rgba(70,90,105,0.6)]">
        {label}
      </p>
    </div>
  );
}

// ============================================
// Main Book in Ads Manager Modal Component
// ============================================
export function BookInAdsManagerModal({
  isOpen,
  onClose,
  onBook,
  campaignData,
}: BookInAdsManagerModalProps) {
  const defaultData: CampaignSummary = {
    campaignName: "Fathers Day Campaign",
    campaignType: "Auction Campaign",
    totalBudget: "$85,000",
    impressions: "53,400,000",
    cpm: "$1.58",
    scheduleStart: "Jan 1, 2027",
    scheduleEnd: "Feb 1, 2026",
    lastRefreshed: formatDateForDisplay(new Date()),
  };

  const data = campaignData || defaultData;
  const [lastRefreshed, setLastRefreshed] = useState(data.lastRefreshed);

  const handleRefresh = () => {
    setLastRefreshed(formatDateForDisplay(new Date()));
  };

  const handleBook = () => {
    onBook?.();
    onClose();
  };

  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  // Reset last refreshed when modal opens
  useEffect(() => {
    if (isOpen) {
      setLastRefreshed(data.lastRefreshed);
    }
  }, [isOpen, data.lastRefreshed]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="bg-white rounded-[4px] shadow-[0px_8px_24px_4px_rgba(0,0,0,0.1),0px_2px_2px_0px_rgba(0,0,0,0.1)] w-[850px] max-w-[calc(100vw-80px)] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between pl-4 pr-1 py-0 bg-white shrink-0">
          <div className="flex-1 flex flex-col justify-center py-4 pr-2 min-w-0">
            <h2 className="text-[16px] font-bold leading-[20px] text-[#1C2B33] font-optimistic">
              Book in Ads Manager
            </h2>
          </div>
          <div className="flex items-start gap-2 py-2 pr-1">
            <button
              className="p-3 hover:bg-[rgba(0,0,0,0.05)] rounded-[4px] transition-colors"
              onClick={onClose}
            >
              <Icon name="Close" variant="outlined" size={16} className="text-[#283943]" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex flex-col gap-2 px-4 pt-2 pb-4">
          {/* Campaign Summary Header */}
          <div className="flex flex-col leading-[20px]">
            <p className="text-[14px] font-bold text-[#36383A]">
              Campaign Summary
            </p>
            <p className="text-[14px] text-[#465A69]">
              Please note, the estimates provided may have changed since the prediction was last refreshed.
            </p>
          </div>

          {/* Divider */}
          <div className="h-px bg-[#CBD2D9]" />

          {/* Campaign Summary Row */}
          <div className="flex gap-4 items-start py-1">
            {/* Campaign Name */}
            <div className="flex flex-col gap-[2px] items-start justify-center pr-3 shrink-0">
              <p className="text-[14px] leading-[20px] text-[rgba(0,0,0,0.75)]">
                {data.campaignName}
              </p>
              <p className="text-[12px] leading-[16px] text-[rgba(70,90,105,0.6)]">
                {data.campaignType}
              </p>
            </div>

            {/* Total Budget */}
            <SummaryItem 
              value={data.totalBudget} 
              label="Total budget" 
              width="100px" 
            />

            {/* Impressions */}
            <SummaryItem 
              value={data.impressions} 
              label="Impressions" 
              width="100px" 
            />

            {/* CPM */}
            <SummaryItem 
              value={data.cpm} 
              label="CPM" 
              width="60px" 
            />

            {/* Schedule */}
            <SummaryItem 
              value={`${data.scheduleStart} - ${data.scheduleEnd}`} 
              label="Schedule" 
              width="200px" 
            />

            {/* Last Refreshed */}
            <div className="flex flex-col gap-[2px] items-start justify-center flex-1 min-w-0">
              <div className="flex items-center gap-[6px]">
                <span className="text-[14px] leading-[20px] text-[rgba(0,0,0,0.75)]">
                  {lastRefreshed}
                </span>
                <button
                  type="button"
                  onClick={handleRefresh}
                  className="flex items-center hover:opacity-70 transition-opacity"
                  title="Refresh"
                >
                  <Icon name="RefreshRight" variant="outlined" size={12} className="text-[#283943]" />
                </button>
              </div>
              <p className="text-[12px] leading-[16px] text-[rgba(70,90,105,0.6)]">
                Last refreshed
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-2 px-4 pt-3 pb-4 bg-white shrink-0">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleBook}>
            Book
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ============================================
// Preview Version for Modal Gallery
// ============================================
export function BookInAdsManagerModalPreview() {
  const [lastRefreshed, setLastRefreshed] = useState(() => formatDateForDisplay(new Date()));

  const handleRefresh = () => {
    setLastRefreshed(formatDateForDisplay(new Date()));
  };

  const data = {
    campaignName: "Fathers Day Campaign",
    campaignType: "Auction Campaign",
    totalBudget: "$85,000",
    impressions: "53,400,000",
    cpm: "$1.58",
    scheduleStart: "Jan 1, 2027",
    scheduleEnd: "Feb 1, 2026",
  };

  return (
    <div className="bg-white rounded-[4px] shadow-[0px_8px_24px_4px_rgba(0,0,0,0.1),0px_2px_2px_0px_rgba(0,0,0,0.1)] w-[850px] overflow-hidden flex flex-col">
      {/* Modal Header */}
      <div className="flex items-start justify-between pl-4 pr-1 py-0 bg-white shrink-0">
        <div className="flex-1 flex flex-col justify-center py-4 pr-2 min-w-0">
          <h2 className="text-[16px] font-bold leading-[20px] text-[#1C2B33] font-optimistic">
            Book in Ads Manager
          </h2>
        </div>
        <div className="flex items-start gap-2 py-2 pr-1">
          <button className="p-3 hover:bg-[rgba(0,0,0,0.05)] rounded-[4px] transition-colors">
            <Icon name="Close" variant="outlined" size={16} className="text-[#283943]" />
          </button>
        </div>
      </div>

      {/* Modal Body */}
      <div className="flex flex-col gap-2 px-4 pt-2 pb-4">
        {/* Campaign Summary Header */}
        <div className="flex flex-col leading-[20px]">
          <p className="text-[14px] font-bold text-[#36383A]">
            Campaign Summary
          </p>
          <p className="text-[14px] text-[#465A69]">
            Please note, the estimates provided may have changed since the prediction was last refreshed.
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#CBD2D9]" />

        {/* Campaign Summary Row */}
        <div className="flex gap-4 items-start py-1">
          {/* Campaign Name */}
          <div className="flex flex-col gap-[2px] items-start justify-center pr-3 shrink-0">
            <p className="text-[14px] leading-[20px] text-[rgba(0,0,0,0.75)]">
              {data.campaignName}
            </p>
            <p className="text-[12px] leading-[16px] text-[rgba(70,90,105,0.6)]">
              {data.campaignType}
            </p>
          </div>

          {/* Total Budget */}
          <SummaryItem 
            value={data.totalBudget} 
            label="Total budget" 
            width="100px" 
          />

          {/* Impressions */}
          <SummaryItem 
            value={data.impressions} 
            label="Impressions" 
            width="100px" 
          />

          {/* CPM */}
          <SummaryItem 
            value={data.cpm} 
            label="CPM" 
            width="60px" 
          />

          {/* Schedule */}
          <SummaryItem 
            value={`${data.scheduleStart} - ${data.scheduleEnd}`} 
            label="Schedule" 
            width="200px" 
          />

          {/* Last Refreshed */}
          <div className="flex flex-col gap-[2px] items-start justify-center flex-1 min-w-0">
            <div className="flex items-center gap-[6px]">
              <span className="text-[14px] leading-[20px] text-[rgba(0,0,0,0.75)]">
                {lastRefreshed}
              </span>
              <button
                type="button"
                onClick={handleRefresh}
                className="flex items-center hover:opacity-70 transition-opacity"
                title="Refresh"
              >
                <Icon name="RefreshRight" variant="outlined" size={12} className="text-[#283943]" />
              </button>
            </div>
            <p className="text-[12px] leading-[16px] text-[rgba(70,90,105,0.6)]">
              Last refreshed
            </p>
          </div>
        </div>
      </div>

      {/* Modal Footer */}
      <div className="flex items-center justify-end gap-2 px-4 pt-3 pb-4 bg-white shrink-0">
        <Button variant="secondary">Cancel</Button>
        <Button variant="primary">Book</Button>
      </div>
    </div>
  );
}
