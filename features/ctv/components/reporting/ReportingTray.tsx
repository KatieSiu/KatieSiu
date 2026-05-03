"use client";

import { Icon } from "@/features/ctv/components/ui/Icon";

interface TrayItem {
  id: string;
  icon: string;
  iconVariant?: "filled" | "outlined";
}

const trayItems: TrayItem[] = [
  { id: "chart", icon: "BarChart", iconVariant: "outlined" },
  { id: "edit", icon: "Pencil", iconVariant: "filled" },
  { id: "help", icon: "Help", iconVariant: "outlined" },
];

export function ReportingTray() {
  return (
    <div className="w-[44px] h-full bg-white border-l border-[#E4E8EB] flex flex-col items-center py-2 gap-1 shrink-0">
      {trayItems.map((item) => (
        <button
          key={item.id}
          className="w-10 h-10 flex items-center justify-center rounded-md hover:bg-[rgba(0,0,0,0.05)] transition-colors"
        >
          <Icon 
            name={item.icon} 
            variant={item.iconVariant || "outlined"} 
            size={20} 
            className="text-[#465A69]" 
          />
        </button>
      ))}
    </div>
  );
}
