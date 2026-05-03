"use client";

import { Icon } from "@/features/ctv/components/ui/Icon";

export type NavItemId = 
  | "overview" 
  | "controls" 
  | "publisher-block-lists" 
  | "partner-publisher-lists" 
  | "delivery-reports" 
  | "resources";

interface NavItem {
  id: NavItemId;
  label: string;
  description?: string;
  icon: string;
  iconVariant?: "filled" | "outlined";
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: "Review and apply controls",
    items: [
      { id: "overview", label: "Overview", description: "Your settings at a glance", icon: "Dashboard", iconVariant: "outlined" },
      { id: "controls", label: "Controls", description: "Review and adjust your settings", icon: "Shield", iconVariant: "outlined" },
    ],
  },
  {
    title: "Manage your lists",
    items: [
      { id: "publisher-block-lists", label: "Publisher block lists", description: "Block specific publishers", icon: "ShieldSlash", iconVariant: "outlined" },
    ],
  },
  {
    title: "View and download reports",
    items: [
      { id: "partner-publisher-lists", label: "Partner-publisher lists", description: "See lists of monetizing publishers", icon: "BulletList", iconVariant: "outlined" },
      { id: "delivery-reports", label: "Delivery reports", description: "Where your ads have appeared", icon: "NotebookStack", iconVariant: "outlined" },
    ],
  },
  {
    title: "More info",
    items: [
      { id: "resources", label: "Resources", description: "Get help and see the latest updates", icon: "Notebook", iconVariant: "outlined" },
    ],
  },
];

interface BrandSafetySidebarProps {
  activeItem: NavItemId;
  onItemSelect: (id: NavItemId) => void;
  selectedAccount: string;
}

export function BrandSafetySidebar({
  activeItem,
  onItemSelect,
  selectedAccount,
}: BrandSafetySidebarProps) {
  return (
    <div className="w-[200px] h-full bg-white border-r border-[#E4E8EB] flex flex-col shrink-0">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#E4E8EB]">
        <div className="flex items-center justify-between mb-3">
          <img src="/images/meta-logo.png" alt="Meta" className="h-5 w-auto" />
          <Icon name="Menu" variant="outlined" size={20} className="text-[#1C2B33]" />
        </div>
        <h1 className="font-optimistic font-bold text-[16px] leading-[20px] text-[#1C2B33]">
          Brand Safety and Suitability Center
        </h1>
      </div>
      
      {/* Account Selector */}
      <div className="px-3 py-2 border-b border-[#E4E8EB]">
        <button className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-[rgba(0,0,0,0.05)] transition-colors">
          <div className="w-6 h-6 rounded-full bg-[#0A78BE] flex items-center justify-center text-white text-[11px] font-bold shrink-0">
            A
          </div>
          <span className="font-sf-pro text-[13px] leading-[18px] text-[#1C2B33] truncate flex-1 text-left">
            {selectedAccount}
          </span>
          <Icon name="SmallTriangleDown" variant="filled" size={12} className="text-[#465A69] shrink-0" />
        </button>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2">
        {navSections.map((section) => (
          <div key={section.title} className="mb-2">
            <div className="px-4 py-1.5">
              <span className="font-sf-pro text-[11px] leading-[14px] text-[#465A69] uppercase tracking-wide">
                {section.title}
              </span>
            </div>
            
            {section.items.map((item) => {
              const isActive = activeItem === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onItemSelect(item.id)}
                  className={`
                    w-full flex items-start gap-2 px-4 py-2 text-left transition-colors
                    ${isActive 
                      ? "bg-[#E7F3FF] border-l-2 border-[#0A78BE]" 
                      : "hover:bg-[rgba(0,0,0,0.03)] border-l-2 border-transparent"
                    }
                  `}
                >
                  <Icon 
                    name={item.icon} 
                    variant={item.iconVariant || "outlined"} 
                    size={16} 
                    className={`shrink-0 mt-0.5 ${isActive ? "text-[#0A78BE]" : "text-[#465A69]"}`} 
                  />
                  <div className="flex flex-col min-w-0">
                    <span className={`
                      font-sf-pro text-[13px] leading-[18px] truncate
                      ${isActive ? "text-[#0A78BE] font-medium" : "text-[#1C2B33]"}
                    `}>
                      {item.label}
                    </span>
                    {item.description && (
                      <span className="font-sf-pro text-[11px] leading-[14px] text-[#465A69] truncate">
                        {item.description}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </nav>
      
      {/* Bottom Toolbar */}
      <div className="px-3 py-2 border-t border-[#E4E8EB] flex items-center gap-1">
        <ToolbarButton icon="Settings" />
        <ToolbarButton icon="Bell" />
        <ToolbarButton icon="Search" />
        <ToolbarButton icon="Help" />
        <ToolbarButton icon="RightRectangles" />
      </div>
    </div>
  );
}

function ToolbarButton({ icon }: { icon: string }) {
  return (
    <button className="w-8 h-8 flex items-center justify-center rounded hover:bg-[rgba(0,0,0,0.05)] transition-colors">
      <Icon name={icon} variant="outlined" size={18} className="text-[#465A69]" />
    </button>
  );
}
