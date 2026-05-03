"use client";

import { useState } from "react";
import { cn } from "@/features/ctv/lib/utils";
import { Button, IconButton } from "@/features/ctv/components/ui/Button";
import { Input } from "@/features/ctv/components/ui/Input";
import { MediaGrid, type MediaItem } from "@/features/ctv/components/ui/MediaGrid";
import { SelectionFooter } from "@/features/ctv/components/ui/SelectionFooter";
import { Icon } from "@/features/ctv/components/ui/Icon";

// ============================================
// Mock Data - Alpha modal specific
// All thumbnails are placeholders by default (no thumbnail property)
// ============================================
const mockAccountVideos: MediaItem[] = [
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

// ============================================
// Creative Setup Alpha Preview Component
// Renders inline without portal/backdrop for gallery viewing
// ============================================
export function CreativeSetupAlphaPreview() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState<MediaItem[]>([]);

  const handleSelect = (item: MediaItem) => {
    setSelectedItems((prev) => {
      const isSelected = prev.some((i) => i.id === item.id);
      if (isSelected) {
        return prev.filter((i) => i.id !== item.id);
      }
      return [...prev, item];
    });
  };

  const filterMedia = (media: MediaItem[]) => {
    if (!searchQuery) return media;
    return media.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <div
      className={cn(
        "flex flex-col",
        "bg-white rounded-[4px]",
        "shadow-[0px_8px_24px_4px_rgba(0,0,0,0.1),0px_2px_2px_0px_rgba(0,0,0,0.1)]",
        "h-[700px]",
        "w-full",
        "overflow-hidden"
      )}
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
            Select or upload the media you want to use for your ad. You can select one image or video.
          </p>
        </div>
        <IconButton
          icon="Close"
          iconVariant="outlined"
          variant="flat"
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
              <Button variant="secondary" icon="Plus" iconVariant="outlined">
                Upload
              </Button>
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
              {filterMedia(mockAccountVideos).map((item) => (
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
        onCancel={() => {}}
        onPrimary={() => {}}
      />
    </div>
  );
}

export default CreativeSetupAlphaPreview;
