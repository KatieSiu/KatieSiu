"use client";

import { Button } from "@/features/campaign-planner/components/ui/Button";
import { Icon } from "@/features/campaign-planner/components/ui/Icon";

interface EmptyStateProps {
  onCreatePlan: () => void;
}

export function EmptyState({ onCreatePlan }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-4">
      {/* Illustration */}
      <div className="w-[150px] h-[150px]">
        <svg viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <rect x="30" y="40" width="90" height="70" rx="4" fill="#E8F4FC" stroke="#0A78BE" strokeWidth="2"/>
          <rect x="40" y="55" width="50" height="6" rx="2" fill="#CBD2D9"/>
          <rect x="40" y="67" width="70" height="6" rx="2" fill="#CBD2D9"/>
          <rect x="40" y="79" width="35" height="6" rx="2" fill="#CBD2D9"/>
          <circle cx="105" cy="45" r="15" fill="#EAF8EF" stroke="#006B4E" strokeWidth="2"/>
          <path d="M100 45L103 48L110 41" stroke="#006B4E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <rect x="95" y="85" width="25" height="8" rx="2" fill="#0A78BE"/>
          <path d="M115 75L125 65" stroke="#F5A623" strokeWidth="3" strokeLinecap="round"/>
          <circle cx="128" cy="62" r="5" fill="#F5A623"/>
        </svg>
      </div>

      {/* Text Content */}
      <div className="flex flex-col items-center gap-1 text-center w-[348px] pt-[10px]">
        <h2 className="font-optimistic font-bold text-[15px] leading-[20px] text-black">
          Welcome to Campaign Planner
        </h2>
        <p className="font-optimistic font-medium text-[14px] leading-[20px] text-[#1C2B33]">
          This is your hub to draft, compare, and estimate the reach of your campaign plans.{" "}
          <button className="text-[#0A78BE] hover:underline">Learn more</button>
        </p>
      </div>

      {/* Create Plan Button */}
      <Button variant="primary" onClick={onCreatePlan}>
        <Icon name="Plus" variant="outlined" size={16} />
        Create Plan
      </Button>
    </div>
  );
}
