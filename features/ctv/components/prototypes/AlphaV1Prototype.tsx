"use client";

import { useState, useEffect, useCallback } from "react";
import { AdsManagerShell, type EditorLevel } from "@/features/ctv/components/shell";
import { AfterL3View, AfterL2View, AfterL1View } from "@/features/ctv/components/views/after";
import { TVModeConfirmationModal, VideoGenerationToastFlow } from "@/features/ctv/components/modals";

export type CampaignObjective = "sales" | "awareness";
export type BudgetType = "daily" | "lifetime";

interface UploadingItem {
  id: string;
  name: string;
}

export function AlphaV1Prototype() {
  const [currentLevel, setCurrentLevel] = useState<EditorLevel>("L3");
  const [objective, setObjective] = useState<CampaignObjective>("sales");
  const [isTVMode, setIsTVMode] = useState(false);
  const [showTVModeModal, setShowTVModeModal] = useState(false);
  
  // Advantage+ Budget state (controlled on L3, reflected on L2)
  const [isAdvantageBudgetOn, setIsAdvantageBudgetOn] = useState(true);
  const [budgetType, setBudgetType] = useState<BudgetType>("lifetime");
  const [budgetValue, setBudgetValue] = useState("$350.00");
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(10);
  const [uploadingItem, setUploadingItem] = useState<UploadingItem | null>(null);
  const [isUploadComplete, setIsUploadComplete] = useState(false);
  const [isCreativeModalOpen, setIsCreativeModalOpen] = useState(false);
  const [selectedVideoThumbnail, setSelectedVideoThumbnail] = useState<string | null>(null);
  const [isToastVisible, setIsToastVisible] = useState(false);

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

  const handleStartUpload = useCallback((item: UploadingItem) => {
    setUploadingItem(item);
    setIsUploading(true);
    setUploadPercent(10);
    setIsUploadComplete(false);
    setIsToastVisible(true);
  }, []);

  const handleUploadComplete = useCallback(() => {
    setIsUploadComplete(true);
    setIsUploading(false);
  }, []);

  const handleCloseToast = useCallback(() => {
    setIsUploading(false);
    setIsToastVisible(false);
    // Don't reset isUploadComplete - keep it true so the uploaded thumbnail persists
    setUploadingItem(null);
    setUploadPercent(10);
  }, []);

  const handleViewAd = useCallback(() => {
    setIsCreativeModalOpen(true);
    handleCloseToast();
  }, [handleCloseToast]);

  const handleVideoSelected = useCallback((thumbnail: string | null) => {
    setSelectedVideoThumbnail(thumbnail);
  }, []);

  useEffect(() => {
    if (!isUploading) return;

    const interval = setInterval(() => {
      setUploadPercent((prev) => {
        const next = prev + 10;
        if (next >= 100) {
          clearInterval(interval);
          handleUploadComplete();
          return 100;
        }
        return next;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [isUploading, handleUploadComplete]);

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
          <AfterL3View 
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
        {currentLevel === "L1" && (
          <AfterL1View 
            isTVMode={isTVMode}
            objective={objective}
            isUploading={isUploading}
            uploadPercent={uploadPercent}
            uploadingItemId={uploadingItem?.id || null}
            onStartUpload={handleStartUpload}
            isCreativeModalOpen={isCreativeModalOpen}
            onCreativeModalOpenChange={setIsCreativeModalOpen}
            hasUploadedMedia={selectedVideoThumbnail !== null}
            selectedVideoThumbnail={selectedVideoThumbnail}
            onVideoSelected={handleVideoSelected}
            isUploadComplete={isUploadComplete}
          />
        )}
      </AdsManagerShell>

      <TVModeConfirmationModal
        isOpen={showTVModeModal}
        onClose={() => setShowTVModeModal(false)}
        onConfirm={handleTVModeConfirm}
      />

      {isToastVisible && !isCreativeModalOpen && (
        <div className="absolute bottom-[30px] right-[10px] z-50">
          <VideoGenerationToastFlow
            isVisible={true}
            autoStart={false}
            onClose={handleCloseToast}
            onViewAd={handleViewAd}
            externalPercent={uploadPercent}
            externalComplete={isUploadComplete}
          />
        </div>
      )}
    </div>
  );
}
