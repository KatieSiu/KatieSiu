"use client";

import { Icon } from "@/features/ctv/components/ui/Icon";

export function AdsTrayButtons() {
  return (
    <div className="w-[44px] h-full bg-[#1C2B33] flex flex-col items-center py-2 gap-2 shadow-[0px_2px_8px_0px_rgba(0,0,0,0.1),0px_1px_1px_0px_rgba(0,0,0,0.1)]">
      {/* Close button */}
      <button
        className="w-9 h-9 rounded-[4px] flex items-center justify-center hover:bg-[rgba(70,90,105,0.6)] transition-colors"
        title="Close"
      >
        <Icon name="Close" variant="outlined" size={16} className="text-white" />
      </button>

      {/* Charts button */}
      <button
        className="w-9 h-9 rounded-[4px] bg-[rgba(70,90,105,0.6)] flex items-center justify-center hover:bg-[rgba(70,90,105,0.8)] transition-colors"
        title="Charts"
      >
        <Icon name="ChartVerticalBars" variant="outlined" size={16} className="text-white" />
      </button>

      {/* Edit button - Active state */}
      <button
        className="w-9 h-9 rounded-[4px] bg-white flex items-center justify-center transition-colors"
        title="Edit"
      >
        <Icon name="Pencil" variant="filled" size={16} className="text-[#283943]" />
      </button>

      {/* History button */}
      <button
        className="w-9 h-9 rounded-[4px] bg-[rgba(70,90,105,0.6)] flex items-center justify-center hover:bg-[rgba(70,90,105,0.8)] transition-colors"
        title="History"
      >
        <Icon name="RefreshTime" variant="outlined" size={16} className="text-white" />
      </button>
    </div>
  );
}
