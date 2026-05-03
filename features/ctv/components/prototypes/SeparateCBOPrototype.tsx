"use client";

import { useState } from "react";
import { AdsManagerShell, type EditorLevel } from "@/features/ctv/components/shell";
import { SeparateCBOL3View } from "@/features/ctv/components/views/separatecbo";
import { AfterL2View } from "@/features/ctv/components/views/after";
import { TVModeConfirmationModal } from "@/features/ctv/components/modals";

export type CampaignObjective = "sales" | "awareness";
export type BudgetType = "daily" | "lifetime";

export function SeparateCBOPrototype() {
  const [currentLevel, setCurrentLevel] = useState<EditorLevel>("L3");
  const [objective, setObjective] = useState<CampaignObjective>("sales");
  const [isTVMode, setIsTVMode] = useState(false);
  const [showTVModeModal, setShowTVModeModal] = useState(false);
  
  const [isAdvantageBudgetOn, setIsAdvantageBudgetOn] = useState(true);
  const [budgetType, setBudgetType] = useState<BudgetType>("daily");
  const [budgetValue, setBudgetValue] = useState("$100.00");

  const handleBack = () => {
    if (currentLevel === "L2") {
      setCurrentLevel("L3");
    }
  };

  const handleNext = () => {
    if (currentLevel === "L3") {
      setCurrentLevel("L2");
    } else if (currentLevel === "L2") {
      alert("This prototype only includes L3 and L2. (No L1)");
    }
  };

  const handleTVModeChange = (newTVMode: boolean) => {
    if (newTVMode && !isTVMode) {
      setShowTVModeModal(true);
    } else {
      setIsTVMode(newTVMode);
    }
  };

  const handleTVModeConfirm = () => {
    setIsTVMode(true);
    setShowTVModeModal(false);
  };

  const handleObjectiveChange = (newObjective: CampaignObjective) => {
    setObjective(newObjective);
  };

  return (
    <div className="relative h-full">
      <AdsManagerShell
        currentLevel={currentLevel}
        onLevelChange={setCurrentLevel}
        onBack={handleBack}
        onNext={handleNext}
        objective={objective}
      >
        {currentLevel === "L3" && (
          <SeparateCBOL3View 
            isTVMode={isTVMode} 
            objective={objective}
            onObjectiveChange={handleObjectiveChange}
            isAdvantageBudgetOn={isAdvantageBudgetOn}
            onAdvantageBudgetChange={setIsAdvantageBudgetOn}
            budgetType={budgetType}
            onBudgetTypeChange={setBudgetType}
            budgetValue={budgetValue}
            onBudgetValueChange={setBudgetValue}
          />
        )}
        {currentLevel === "L2" && (
          <AfterL2View 
            isTVMode={isTVMode} 
            onTVModeChange={handleTVModeChange}
            objective={objective}
            isAdvantageBudgetOn={isAdvantageBudgetOn}
            budgetType={budgetType}
            budgetValue={budgetValue}
          />
        )}
      </AdsManagerShell>

      <TVModeConfirmationModal
        isOpen={showTVModeModal}
        onClose={() => setShowTVModeModal(false)}
        onConfirm={handleTVModeConfirm}
      />
    </div>
  );
}
