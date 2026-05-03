"use client";

import { useState } from "react";
import { AdsManagerShell, type EditorLevel } from "@/features/ctv/components/shell";
import { BeforeL3View, BeforeL2View, BeforeL1View } from "@/features/ctv/components/views/before";

export function BeforePrototype() {
  const [currentLevel, setCurrentLevel] = useState<EditorLevel>("L3");

  const handleBack = () => {
    if (currentLevel === "L1") {
      setCurrentLevel("L2");
    } else if (currentLevel === "L2") {
      setCurrentLevel("L3");
    }
  };

  const handleNext = () => {
    if (currentLevel === "L3") {
      setCurrentLevel("L2");
    } else if (currentLevel === "L2") {
      setCurrentLevel("L1");
    } else {
      alert("Campaign published! (This is a prototype)");
    }
  };

  return (
    <AdsManagerShell
      currentLevel={currentLevel}
      onLevelChange={setCurrentLevel}
      onBack={handleBack}
      onNext={handleNext}
    >
      {currentLevel === "L3" && <BeforeL3View />}
      {currentLevel === "L2" && <BeforeL2View />}
      {currentLevel === "L1" && <BeforeL1View />}
    </AdsManagerShell>
  );
}
