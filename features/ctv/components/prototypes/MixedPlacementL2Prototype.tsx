"use client";

import { useState } from "react";
import { AdsManagerShell, type EditorLevel } from "@/features/ctv/components/shell";
import { MixedL2View } from "@/features/ctv/components/views/mixed";

export function MixedPlacementL2Prototype() {
  const [isTVMode, setIsTVMode] = useState(false);
  
  // Advantage+ Budget state
  const [isAdvantageBudgetOn] = useState(true);
  const [budgetValue] = useState("$350.00");

  const handleTVModeChange = (newTVMode: boolean) => {
    setIsTVMode(newTVMode);
  };

  return (
    <AdsManagerShell
      currentLevel="L2"
      onLevelChange={() => {}}
      onBack={() => {}}
      onNext={() => {}}
      objective="sales"
    >
      <MixedL2View 
        isTVMode={isTVMode} 
        onTVModeChange={handleTVModeChange}
        isAdvantageBudgetOn={isAdvantageBudgetOn}
        budgetValue={budgetValue}
      />
    </AdsManagerShell>
  );
}
