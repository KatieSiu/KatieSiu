"use client";

import { useState, useEffect, useCallback } from "react";
import { AdsManagerShell, type EditorLevel } from "@/features/ctv/components/shell";
import { StandaloneL3View, StandaloneL2View, StandaloneL1View } from "@/features/ctv/components/views/standalone";
import { VideoGenerationToastFlow } from "@/features/ctv/components/modals";

interface UploadingItem {
  id: string;
  name: string;
}

export function StandalonePrototype() {
  const [currentLevel, setCurrentLevel] = useState<EditorLevel>("L3");
  const [isTVMode, setIsTVMode] = useState(false);
  
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

  const handleChannelChange = (channel: "social" | "ctv") => {
    setIsTVMode(channel === "ctv");
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
      >
        {currentLevel === "L3" && (
          <StandaloneL3View 
            isTVMode={isTVMode} 
            onChannelChange={handleChannelChange}
          />
        )}
        {currentLevel === "L2" && (
          <StandaloneL2View 
            isTVMode={isTVMode} 
          />
        )}
        {currentLevel === "L1" && (
          <StandaloneL1View 
            isTVMode={isTVMode}
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
