"use client";

import { Icon } from "@/features/campaign-planner/components/ui/Icon";

interface NoResultsStateProps {
  onReset: () => void;
}

export function NoResultsState({ onReset }: NoResultsStateProps) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-4 pb-[60px]">
      {/* Telescope Illustration */}
      <div className="w-[200px] h-[200px]">
        <img 
          src="/no-results-illustration.png" 
          alt="No results" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Text Content */}
      <div className="flex flex-col items-center gap-1 text-center w-[348px] pt-[10px] leading-[20px]">
        <h2 className="font-optimistic font-bold text-[15px] leading-[20px] text-black">
          No Results
        </h2>
        <p className="font-optimistic font-medium text-[14px] leading-[20px] text-[#1C2B33]">
          Try changing your search or filters
        </p>
      </div>

      {/* Reset Button */}
      <button 
        onClick={onReset}
        className="inline-flex items-center justify-center gap-2 h-[36px] px-3 py-2 border border-[#A7B3BF] rounded-[4px] bg-transparent hover:bg-[rgba(0,0,0,0.05)] transition-colors"
      >
        <Icon name="RefreshLeft" variant="outlined" size={16} className="text-[#1C2B33]" />
        <span className="font-optimistic font-medium text-[14px] leading-[20px] text-[#1C2B33]">Reset</span>
      </button>
    </div>
  );
}
