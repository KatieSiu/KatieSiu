"use client";

import { ReactNode, useState, useCallback, useRef, useEffect } from "react";
import { AdsNavigation } from "./AdsNavigation";
import { AdsTrayButtons } from "./AdsTrayButtons";
import { CampaignStructurePanel, type EditorLevel } from "./CampaignStructurePanel";
import { AdsEditorHeader } from "./AdsEditorHeader";
import { AdsEditorFooter } from "./AdsEditorFooter";

type CampaignObjective = "sales" | "awareness";

interface AdsManagerShellProps {
  children: ReactNode;
  currentLevel: EditorLevel;
  onLevelChange: (level: EditorLevel) => void;
  onBack: () => void;
  onNext: () => void;
  onClose?: () => void;
  objective?: CampaignObjective;
}

export function AdsManagerShell({
  children,
  currentLevel,
  onLevelChange,
  onBack,
  onNext,
  onClose,
  objective = "sales",
}: AdsManagerShellProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Reset scroll position when level changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
      setIsScrolled(false);
    }
  }, [currentLevel]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    setIsScrolled(scrollTop > 0);
  }, []);

  return (
    <div className="h-full w-full flex overflow-hidden bg-[#F1F4F7]">
      {/* Left navigation bar */}
      <AdsNavigation />

      {/* Tray buttons */}
      <AdsTrayButtons />

      {/* Campaign structure panel */}
      <CampaignStructurePanel 
        currentLevel={currentLevel} 
        onLevelChange={onLevelChange}
        objective={objective}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header - shows shadow when content is scrolled */}
        <div className={`relative z-10 transition-shadow duration-200 ${isScrolled ? "shadow-[0px_2px_4px_0px_rgba(0,0,0,0.1)]" : ""}`}>
          <AdsEditorHeader 
            currentLevel={currentLevel} 
            onLevelChange={onLevelChange}
            objective={objective}
          />
        </div>

        {/* Scrollable content */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto overflow-x-hidden" 
          onScroll={handleScroll}
        >
          {children}
        </div>

        {/* Footer */}
        <AdsEditorFooter
          currentLevel={currentLevel}
          onBack={onBack}
          onNext={onNext}
          onClose={onClose}
        />
      </div>
    </div>
  );
}

// Re-export types for convenience
export type { EditorLevel };
