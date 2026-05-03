"use client";

import { useState } from "react";
import {
  AdNameCard,
  PartnershipAdCard,
  IdentityCard,
  TrackingCard,
  AdSetupCard,
  DestinationCard,
  AdSourcesCard,
  AdCreativeCard,
  LanguagesCard,
  AdPreviewCard,
  CampaignScoreCard,
} from "@/features/ctv/components/cards";
import { CreativeSetupAlphaModal } from "@/features/ctv/components/modals/CreativeSetupAlphaModal";
import { CreativeSetupBeforeModal } from "@/features/ctv/components/modals/creative-setup-before/CreativeSetupBeforeModal";

interface StandaloneL1ViewProps {
  isTVMode?: boolean;
  isUploading?: boolean;
  uploadPercent?: number;
  uploadingItemId?: string | null;
  onStartUpload?: (item: { id: string; name: string }) => void;
  isCreativeModalOpen?: boolean;
  onCreativeModalOpenChange?: (open: boolean) => void;
  hasUploadedMedia?: boolean;
  /** Selected video thumbnail URL */
  selectedVideoThumbnail?: string | null;
  /** Callback when video is selected via Done button */
  onVideoSelected?: (thumbnail: string | null) => void;
  /** Whether upload has completed (shows uploaded thumbnail in modal) */
  isUploadComplete?: boolean;
}

export function StandaloneL1View({ 
  isTVMode = false,
  isUploading = false,
  uploadPercent = 10,
  uploadingItemId = null,
  onStartUpload,
  isCreativeModalOpen,
  onCreativeModalOpenChange,
  hasUploadedMedia = false,
  selectedVideoThumbnail = null,
  onVideoSelected,
  isUploadComplete = false,
}: StandaloneL1ViewProps) {
  // Use internal state if not controlled externally
  const [internalShowCreativeModal, setInternalShowCreativeModal] = useState(false);
  
  // Determine if modal is controlled or uncontrolled
  const isControlled = isCreativeModalOpen !== undefined;
  const showCreativeModal = isControlled ? isCreativeModalOpen : internalShowCreativeModal;
  
  const setShowCreativeModal = (open: boolean) => {
    if (isControlled && onCreativeModalOpenChange) {
      onCreativeModalOpenChange(open);
    } else {
      setInternalShowCreativeModal(open);
    }
  };
  // L1 cards are narrower (428px) compared to L2/L3 (600px)
  const cardClassName = "!w-[428px]";
  
  // TV Mode ON: Ad Name, Identity, Ad Creative, Tracking
  // TV Mode OFF: Ad Name, Partnership Ad, Identity, Ad Setup, Destination, Ad Sources, Ad Creative, Languages, Tracking
  
  return (
    <div className="flex gap-6 p-3 justify-center min-w-fit">
      {/* Left column - Main cards (narrower for L1) */}
      <div className="flex flex-col gap-[10px]">
        <AdNameCard version="alpha-v1" className={cardClassName} />
        
        {/* Partnership Ad - only in non-TV mode */}
        {!isTVMode && <PartnershipAdCard version="alpha-v1" className={cardClassName} />}
        
        <IdentityCard version="alpha-v1" className={cardClassName} />
        
        {/* Ad Setup - only in non-TV mode */}
        {!isTVMode && <AdSetupCard version="alpha-v1" className={cardClassName} />}
        
        {/* Destination - only in non-TV mode */}
        {!isTVMode && <DestinationCard version="alpha-v1" className={cardClassName} />}
        
        {/* Ad Sources - only in non-TV mode */}
        {!isTVMode && <AdSourcesCard version="alpha-v1" className={cardClassName} />}
        
        <AdCreativeCard 
          version="alpha-v1" 
          className={cardClassName} 
          onAddVideo={() => setShowCreativeModal(true)}
          isTVMode={isTVMode}
        />
        
        {/* Languages - only in non-TV mode */}
        {!isTVMode && <LanguagesCard version="alpha-v1" className={cardClassName} />}
        
        {/* Tracking card is at the bottom for both modes */}
        <TrackingCard version="alpha-v1" className={cardClassName} />
      </div>

      {/* Right column - Sidebar */}
      <div className="flex flex-col gap-[10px] sticky top-3 self-start">
        {/* Campaign Score (collapsed) - only in non-TV mode */}
        {!isTVMode && <CampaignScoreCard version="alpha-v1" collapsed />}
        
        {/* Ad Preview - shows collapsed by default, empty state when toggled on, TV preview when uploaded */}
        <AdPreviewCard 
          version="alpha-v1" 
          isTVMode={isTVMode} 
          hasUploadedMedia={hasUploadedMedia}
          defaultCollapsed={true}
          selectedVideoThumbnail={selectedVideoThumbnail}
        />
      </div>

      {/* Creative Setup Modal - shows Alpha version for TV mode, Before version for non-TV mode */}
      {isTVMode ? (
        <CreativeSetupAlphaModal
          isOpen={showCreativeModal}
          onClose={() => setShowCreativeModal(false)}
          isUploading={isUploading}
          uploadPercent={uploadPercent}
          uploadingItemId={uploadingItemId}
          onStartUpload={onStartUpload}
          isUploadComplete={isUploadComplete}
          onDone={(selectedItems) => {
            // Find the first selected item with a thumbnail, or use null
            const selectedThumbnail = selectedItems.find(item => item.thumbnail)?.thumbnail || null;
            onVideoSelected?.(selectedThumbnail);
          }}
        />
      ) : (
        <CreativeSetupBeforeModal
          isOpen={showCreativeModal}
          onClose={() => setShowCreativeModal(false)}
        />
      )}
    </div>
  );
}
