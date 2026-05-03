"use client";

import { useState } from "react";
import { AdsNavigation, AdsTrayButtons } from "@/features/ctv/components/shell";
import {
  ReportingPageHeader,
  ReportingSearchBar,
  ReportingTabs,
  ReportingToolbar,
  ReportingDataTable,
  type ReportingTabId,
} from "@/features/ctv/components/reporting";

export function ReportingPrototype() {
  const [activeTab, setActiveTab] = useState<ReportingTabId>("campaigns");

  return (
    <div className="h-full flex overflow-hidden bg-[#F1F4F7]">
      {/* Left Navigation - same as Alpha Experience */}
      <AdsNavigation />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <ReportingPageHeader />
        <ReportingSearchBar />
        <ReportingTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <ReportingToolbar />
        <ReportingDataTable />
      </div>
      
      {/* Right Tray Buttons - same as Alpha Experience */}
      <AdsTrayButtons />
    </div>
  );
}
