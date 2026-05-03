"use client";

import { useState } from "react";
import { BeforePrototype, AlphaV1Prototype, AlphaV2Prototype, StandalonePrototype, BrandSafetyPrototype } from "@/features/ctv/components/prototypes";

type TabId = "before" | "alpha-v1" | "alpha-v2" | "standalone" | "brand-safety";

const tabs: { id: TabId; label: string }[] = [
  // { id: "before", label: "Before" },  // Hidden for now
  { id: "alpha-v1", label: "Alpha experience" },
  // { id: "alpha-v2", label: "Alpha V2" },  // Hidden for now
  // { id: "standalone", label: "Standalone" },  // Hidden for now
  { id: "brand-safety", label: "Brand Safety" },
];

function BrowserChrome() {
  return (
    <div className="bg-[#E8EAED] px-4 py-2 flex items-center rounded-t-lg border-b border-gray-300">
      <div className="flex gap-1.5">
        <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
        <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
        <div className="w-3 h-3 rounded-full bg-[#28CA41]" />
      </div>
    </div>
  );
}

export default function PrototypeTabs() {
  const [activeTab, setActiveTab] = useState<TabId>("alpha-v1");

  return (
    <div className="h-screen flex flex-col bg-[#1C2B33]">
      {/* Dark Tab Bar */}
      <div className="flex shrink-0 px-4 pt-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              px-5 py-2.5 text-sm font-medium transition-colors relative rounded-t-lg
              ${activeTab === tab.id 
                ? "bg-[#2D3E4A] text-white" 
                : "text-gray-400 hover:text-gray-200 hover:bg-[#2D3E4A]/50"
              }
            `}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#0A78BE] rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* Browser Frame Container */}
      <div className="flex-1 p-4 pt-0 min-h-0">
        <div className="h-full flex flex-col rounded-lg shadow-2xl overflow-hidden">
          {/* Browser Chrome Header */}
          <BrowserChrome />
          
          {/* Prototype Content */}
          <div className="flex-1 min-h-0 bg-white">
            {activeTab === "before" && <BeforePrototype />}
            {activeTab === "alpha-v1" && <AlphaV1Prototype />}
            {activeTab === "alpha-v2" && <AlphaV2Prototype />}
            {activeTab === "standalone" && <StandalonePrototype />}
            {activeTab === "brand-safety" && <BrandSafetyPrototype />}
          </div>
        </div>
      </div>
    </div>
  );
}
