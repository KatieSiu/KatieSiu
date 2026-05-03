"use client";

import { useState, useEffect, useCallback } from "react";
import { AdsManagerShell, type EditorLevel } from "@/features/ctv/components/shell";
import { AfterL3View, AfterL2View, AfterL1View } from "@/features/ctv/components/views/after";
import { TVModeConfirmationModal, VideoGenerationToastFlow } from "@/features/ctv/components/modals";

interface UploadingItem {
  id: string;
  name: string;
}

export function AlphaV2Prototype() {
  const [currentLevel, setCurrentLevel] = useState<EditorLevel>("L3");
  const [isTVMode, setIsTVMode] = useState(false);
  const [showTVModeModal, setShowTVModeModal] = useState(false);
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(10);
  const [uploadingItem, setUploadingItem] = useState<UploadingItem | null>(null);
  const [isUploadComplete, setIsUploadComplete] = useState(false);
  const [isCreativeModalOpen, setIsCreativeModalOpen] = useState(false);

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

  const handleStartUpload = useCallback((item: UploadingItem) => {
    setUploadingItem(item);
    setIsUploading(true);
    setUploadPercent(10);
    setIsUploadComplete(false);
  }, []);

  const handleUploadComplete = useCallback(() => {
    setIsUploadComplete(true);
    setIsUploading(false);
  }, []);

  const handleCloseToast = useCallback(() => {
    setIsUploading(false);
    setIsUploadComplete(false);
    setUploadingItem(null);
    setUploadPercent(10);
  }, []);

  const handleViewAd = useCallback(() => {
    setIsCreativeModalOpen(true);
    handleCloseToast();
  }, [handleCloseToast]);

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
      >
        {currentLevel === "L3" && <AfterL3View isTVMode={isTVMode} />}
        {currentLevel === "L2" && (
          <AfterL2View 
            isTVMode={isTVMode} 
            onTVModeChange={handleTVModeChange}
            defaultShowPlacementSettings={true}
            defaultExpandedPlacementSection="devices"
          />
        )}
        {currentLevel === "L1" && (
          <AfterL1View 
            isTVMode={isTVMode}
            isUploading={isUploading}
            uploadPercent={uploadPercent}
            uploadingItemId={uploadingItem?.id || null}
            onStartUpload={handleStartUpload}
            isCreativeModalOpen={isCreativeModalOpen}
            onCreativeModalOpenChange={setIsCreativeModalOpen}
            hasUploadedMedia={isUploadComplete}
          />
        )}
      </AdsManagerShell>

      <TVModeConfirmationModal
        isOpen={showTVModeModal}
        onClose={() => setShowTVModeModal(false)}
        onConfirm={handleTVModeConfirm}
      />

      {(isUploading || isUploadComplete) && !isCreativeModalOpen && (
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
