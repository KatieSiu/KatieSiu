"use client";

import { Icon } from "@/features/ctv/components/ui/Icon";

interface NavItem {
  id: string;
  icon: string;
  iconVariant: "filled" | "outlined";
  isActive?: boolean;
}

const mainNavItems: NavItem[] = [
  { id: "home", icon: "House", iconVariant: "outlined" },
  { id: "history", icon: "RefreshTime", iconVariant: "outlined" },
  { id: "data-table", icon: "TableData", iconVariant: "filled", isActive: true },
  { id: "notes", icon: "NotebookStack", iconVariant: "outlined" },
  { id: "people", icon: "People", iconVariant: "outlined" },
  { id: "cards", icon: "XBulletsRectangle", iconVariant: "outlined" },
  { id: "dollar", icon: "DollarCircle", iconVariant: "outlined" },
  { id: "menu", icon: "ThreeLines", iconVariant: "outlined" },
];

const bottomNavItems: NavItem[] = [
  { id: "help", icon: "Help", iconVariant: "outlined" },
  { id: "notebook", icon: "Notebook", iconVariant: "outlined" },
  { id: "settings", icon: "Settings", iconVariant: "outlined" },
  { id: "bell", icon: "Bell", iconVariant: "outlined" },
  { id: "search", icon: "Search", iconVariant: "outlined" },
  { id: "warning", icon: "WarningCircle", iconVariant: "outlined" },
];

export function ReportingNavSidebar() {
  return (
    <div className="w-[56px] h-full bg-white border-r border-[#E4E8EB] flex flex-col shrink-0">
      {/* Meta Logo */}
      <div className="h-[56px] flex items-center justify-center">
        <img src="/images/meta-logo.png" alt="Meta" className="h-6 w-auto" />
      </div>
      
      {/* Main Navigation Icons */}
      <nav className="flex-1 flex flex-col items-center py-1 gap-0.5">
        {mainNavItems.map((item) => (
          <button
            key={item.id}
            className={`
              w-10 h-10 flex items-center justify-center rounded-md transition-colors
              ${item.isActive 
                ? "bg-[#E1EDF7]" 
                : "hover:bg-[rgba(0,0,0,0.05)]"
              }
            `}
          >
            <Icon 
              name={item.icon} 
              variant={item.iconVariant} 
              size={24} 
              className={item.isActive ? "text-[#0A78BE]" : "text-[#283943]"} 
            />
          </button>
        ))}
      </nav>
      
      {/* Divider */}
      <div className="mx-3 h-px bg-[#CBD2D9]" />
      
      {/* Bottom Navigation Icons */}
      <div className="flex flex-col items-center py-2 gap-0.5">
        {bottomNavItems.map((item) => (
          <button
            key={item.id}
            className="w-10 h-10 flex items-center justify-center rounded-md hover:bg-[rgba(0,0,0,0.05)] transition-colors"
          >
            <Icon 
              name={item.icon} 
              variant={item.iconVariant} 
              size={20} 
              className="text-[#283943]" 
            />
          </button>
        ))}
      </div>
    </div>
  );
}
