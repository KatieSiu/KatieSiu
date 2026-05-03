"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/features/ctv/lib/utils";
import { Button, IconButton } from "@/features/ctv/components/ui/Button";
import { Input } from "@/features/ctv/components/ui/Input";
import { MediaGrid, type MediaItem } from "@/features/ctv/components/ui/MediaGrid";
import { SelectionFooter } from "@/features/ctv/components/ui/SelectionFooter";
import { Icon } from "@/features/ctv/components/ui/Icon";
import { VideoGeneratingToastControlled } from "./VideoGeneratingToast";

// ============================================
// Mock Data - Alpha modal specific
// All thumbnails are placeholders by default (no thumbnail property)
// ============================================
const mockAccountMedia: MediaItem[] = [
  { id: "vid-1", name: "untitled", dimensions: "1920x1080", type: "video" },
  { id: "vid-2", name: "untitled", dimensions: "1920x1080", type: "video" },
  { id: "vid-3", name: "untitled", dimensions: "1920x1080", type: "video" },
  { id: "vid-4", name: "untitled", dimensions: "1920x1080", type: "video" },
  { id: "vid-5", name: "untitled", dimensions: "1920x1080", type: "video" },
  { id: "vid-6", name: "untitled", dimensions: "1920x1080", type: "video" },
  { id: "vid-7", name: "untitled", dimensions: "1920x1080", type: "video" },
];

const mockVideoUrlMedia: MediaItem[] = [
  { id: "url-1", name: "untitled", dimensions: "1920x1080", type: "video" },
  { id: "url-2", name: "untitled", dimensions: "1920x1080", type: "video" },
  { id: "url-3", name: "untitled", dimensions: "1920x1080", type: "video" },
  { id: "url-4", name: "untitled", dimensions: "1920x1080", type: "video" },
  { id: "url-5", name: "untitled", dimensions: "1920x1080", type: "video" },
  { id: "url-6", name: "untitled", dimensions: "1920x1080", type: "video" },
  { id: "url-7", name: "untitled", dimensions: "1920x1080", type: "video" },
  { id: "url-8", name: "untitled", dimensions: "1920x1080", type: "video" },
  { id: "url-9", name: "untitled", dimensions: "1920x1080", type: "video" },
  { id: "url-10", name: "untitled", dimensions: "1920x1080", type: "video" },
];

// Uploaded item that appears after upload completes
const uploadedMediaItem: MediaItem = {
  id: "uploaded-1",
  name: "skincare",
  dimensions: "1440 × 1440",
  type: "video",
  thumbnail: "/images/skincare-models.png",
};

// ============================================
// Creative Setup Alpha Modal Props
// ============================================
interface CreativeSetupAlphaModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when modal should close */
  onClose: () => void;
  /** Callback when upload is complete */
  onUpload?: (selectedItems: MediaItem[]) => void;
  /** Callback when Done button is clicked - passes selected items */
  onDone?: (selectedItems: MediaItem[]) => void;
  /** Initial selected items */
  initialSelection?: MediaItem[];
  /** Whether an upload is in progress (controlled externally) */
  isUploading?: boolean;
  /** Current upload percentage (controlled externally) */
  uploadPercent?: number;
  /** ID of the item being uploaded */
  uploadingItemId?: string | null;
  /** Callback when upload starts */
  onStartUpload?: (item: { id: string; name: string }) => void;
  /** Whether upload has completed (shows uploaded thumbnail) */
  isUploadComplete?: boolean;
}

// ============================================
// Creative Setup Alpha Modal Component
// Matches the design from CreativeSetupAlphaPreview
// ============================================
export function CreativeSetupAlphaModal({
  isOpen,
  onClose,
  onUpload,
  onDone,
  initialSelection = [],
  isUploading = false,
  uploadPercent = 10,
  uploadingItemId = null,
  onStartUpload,
  isUploadComplete = false,
}: CreativeSetupAlphaModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState<MediaItem[]>(initialSelection);

  // Reset state when modal opens
  // Note: We only depend on isOpen to avoid infinite loops from initialSelection array reference changes
  useEffect(() => {
    if (isOpen) {
      setSelectedItems([]);
      setSearchQuery("");
    }
  }, [isOpen]);

  // Handle Escape key
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  // Add/remove event listeners and body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  // Handle item selection
  const handleSelect = (item: MediaItem) => {
    setSelectedItems((prev) => {
      const isSelected = prev.some((i) => i.id === item.id);
      if (isSelected) {
        return prev.filter((i) => i.id !== item.id);
      }
      return [...prev, item];
    });
  };

  // Handle toolbar "+Upload" button - starts the video generation process
  const handleToolbarUpload = () => {
    if (onStartUpload) {
      onStartUpload({ id: "new-upload", name: "untitled" });
    }
  };

  // Handle footer "Upload" button - closes modal with selected items
  const handleUpload = () => {
    onUpload?.(selectedItems);
    onClose();
  };

  // Handle footer "Done" button - passes selected items and closes modal
  const handleDone = () => {
    onDone?.(selectedItems);
    onClose();
  };

  // Filter media based on search
  const filterMedia = (media: MediaItem[]) => {
    if (!searchQuery) return media;
    return media.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      aria-hidden="true"
    >
      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative flex flex-col",
          "bg-white rounded-[4px]",
          "shadow-[0px_8px_24px_4px_rgba(0,0,0,0.1),0px_2px_2px_0px_rgba(0,0,0,0.1)]",
          "h-[700px] max-h-[90vh]",
          "w-[calc(100vw-80px)] max-w-[1000px]",
          "overflow-hidden"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-4 py-3 shrink-0 bg-white">
          <div className="flex-1">
            <div className="flex items-center gap-1">
              <h2 className="text-[16px] font-bold leading-[20px] text-[#1C2B33] font-optimistic">
                Video
              </h2>
              <Icon name="Info" variant="filled" size={16} className="text-[#465A69]" />
            </div>
            <p className="text-[14px] font-normal leading-[20px] text-[#465A69] font-optimistic mt-0.5">
              Select or upload the video you want to use for your ad. <a href="#" className="text-[#0A78BE] hover:underline">View video requirements</a>
            </p>
          </div>
          <IconButton
            icon="Close"
            iconVariant="outlined"
            variant="flat"
            onClick={onClose}
            aria-label="Close modal"
          />
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 bg-[#F5F7F8]">
          <div className="space-y-4">
            {/* Toolbar Container - White Background */}
            <div className="bg-white rounded-[8px] p-3 space-y-3">
              {/* Single Videos Button */}
              <div className="flex gap-1">
                <button
                  type="button"
                  className="flex items-center gap-2 px-3 py-2 rounded-[4px] text-[14px] font-medium transition-colors bg-[#E1EDF7] text-[#0A78BE]"
                >
                  <Icon 
                    name="Playbutton" 
                    variant="outlined" 
                    size={16} 
                    className="text-[#0A78BE]" 
                  />
                  Videos
                </button>
              </div>

              {/* Search Bar and Toolbar - Full Width */}
              <div className="flex items-center gap-2">
                <Input
                  variant="search"
                  placeholder="Search videos"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button variant="secondary">
                  <Icon name="FilterSliders" variant="outlined" size={16} />
                </Button>
                <Button variant="secondary" dropdown icon="Photo" iconVariant="outlined">
                  All
                </Button>
                {isUploading ? (
                  <button
                    disabled
                    className="flex items-center justify-center h-[36px] px-4 rounded-[4px] border border-[#CBD2D9] bg-white min-w-[90px]"
                  >
                    <div className="animate-spin">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10"
                          stroke="#0A78BE"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </button>
                ) : (
                  <Button 
                    variant="secondary" 
                    icon="Plus" 
                    iconVariant="outlined"
                    onClick={handleToolbarUpload}
                  >
                    Upload
                  </Button>
                )}
              </div>
            </div>

            {/* Media Grid Sections */}
            <div className="space-y-4">
              <MediaGrid 
                title="Account" 
                titleIcon="Playbutton"
                showSeeAll
                layout="horizontal"
              >
                {/* Show loading item first if uploading */}
                {isUploading && uploadingItemId && (
                  <MediaGrid.LoadingItem percent={uploadPercent} />
                )}
                {/* Show uploaded item first if upload is complete */}
                {isUploadComplete && !isUploading && (
                  <MediaGrid.Item
                    key={uploadedMediaItem.id}
                    item={uploadedMediaItem}
                    isSelected={selectedItems.some((i) => i.id === uploadedMediaItem.id)}
                    onSelect={handleSelect}
                  />
                )}
                {filterMedia(mockAccountMedia).map((item) => (
                  <MediaGrid.Item
                    key={item.id}
                    item={item}
                    isSelected={selectedItems.some((i) => i.id === item.id)}
                    onSelect={handleSelect}
                  />
                ))}
              </MediaGrid>

              <MediaGrid 
                title="Video URL" 
                titleIcon="Link"
                showSeeAll
                layout="horizontal"
              >
                {filterMedia(mockVideoUrlMedia).map((item) => (
                  <MediaGrid.Item
                    key={item.id}
                    item={item}
                    isSelected={selectedItems.some((i) => i.id === item.id)}
                    onSelect={handleSelect}
                  />
                ))}
              </MediaGrid>
            </div>
          </div>
        </div>

        {/* Footer */}
        <SelectionFooter
          selectedCount={selectedItems.length}
          totalCount={mockVideoUrlMedia.length}
          selectionLabel="Media from you"
          selectedThumbnails={selectedItems
            .filter((i) => i.thumbnail)
            .map((i) => i.thumbnail!)}
          cancelLabel="Cancel"
          primaryLabel="Done"
          onCancel={onClose}
          onPrimary={handleDone}
        />

        {/* Toast inside modal - positioned at bottom right (10px from edges) */}
        {isUploading && (
          <div className="absolute bottom-[10px] right-[10px] z-10">
            <VideoGeneratingToastControlled
              isVisible={true}
              percent={uploadPercent}
              onClose={onClose}
            />
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

export default CreativeSetupAlphaModal;
