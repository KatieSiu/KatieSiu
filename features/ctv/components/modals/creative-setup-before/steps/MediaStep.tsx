"use client";

import { useState } from "react";
import { cn } from "@/features/ctv/lib/utils";
import { Button } from "@/features/ctv/components/ui/Button";
import { Input } from "@/features/ctv/components/ui/Input";
import { MediaGrid, type MediaItem } from "@/features/ctv/components/ui/MediaGrid";
import { Icon } from "@/features/ctv/components/ui/Icon";

// ============================================
// Types
// ============================================
interface MediaStepData {
  selectedImages: MediaItem[];
  selectedVideos: MediaItem[];
}

interface MediaStepProps {
  data: MediaStepData;
  onChange: (data: MediaStepData) => void;
}

// ============================================
// Mock Data
// ============================================
const mockAccountImages: MediaItem[] = [
  { id: "img-1", name: "skincare", dimensions: "1440 × 1440", type: "image", thumbnail: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=200&fit=crop" },
  { id: "img-2", name: "untitled", dimensions: "1440 × 1440", type: "image" },
  { id: "img-3", name: "untitled", dimensions: "1440 × 1440", type: "image" },
  { id: "img-4", name: "all_skintypes", dimensions: "1440 × 1440", type: "image", thumbnail: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=200&h=200&fit=crop" },
  { id: "img-5", name: "untitled", dimensions: "1440 × 1440", type: "image" },
  { id: "img-6", name: "untitled", dimensions: "1440 × 1440", type: "image" },
  { id: "img-7", name: "untitled", dimensions: "1440 × 1440", type: "image" },
  { id: "img-8", name: "untitled", dimensions: "1440 × 1440", type: "image" },
];

const mockInstagramImages: MediaItem[] = [
  { id: "insta-1", name: "cleanse", dimensions: "1440 × 1440", type: "image", thumbnail: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=200&h=200&fit=crop" },
  { id: "insta-2", name: "untitled", dimensions: "1440 × 1440", type: "image" },
  { id: "insta-3", name: "untitled", dimensions: "1440 × 1440", type: "image" },
  { id: "insta-4", name: "untitled", dimensions: "1440 × 1440", type: "image" },
  { id: "insta-5", name: "untitled", dimensions: "1440 × 1440", type: "image" },
  { id: "insta-6", name: "untitled", dimensions: "1440 × 1440", type: "image" },
  { id: "insta-7", name: "untitled", dimensions: "1440 × 1440", type: "image" },
  { id: "insta-8", name: "untitled", dimensions: "1440 × 1440", type: "image" },
  { id: "insta-9", name: "untitled", dimensions: "1440 × 1440", type: "image" },
  { id: "insta-10", name: "untitled", dimensions: "1440 × 144", type: "image" },
];

const mockBusinessImages: MediaItem[] = [
  { id: "biz-1", name: "untitled", dimensions: "1440 × 1440", type: "image" },
  { id: "biz-2", name: "untitled", dimensions: "1440 × 1440", type: "image" },
  { id: "biz-3", name: "untitled", dimensions: "1440 × 1440", type: "image" },
  { id: "biz-4", name: "untitled", dimensions: "1440 × 1440", type: "image" },
  { id: "biz-5", name: "untitled", dimensions: "1440 × 1440", type: "image" },
  { id: "biz-6", name: "untitled", dimensions: "1440 × 1440", type: "image" },
  { id: "biz-7", name: "untitled", dimensions: "1440 × 1440", type: "image" },
  { id: "biz-8", name: "untitled", dimensions: "1440 × 1440", type: "image" },
  { id: "biz-9", name: "untitled", dimensions: "1440 × 1440", type: "image" },
  { id: "biz-10", name: "untitled", dimensions: "1440 × 144", type: "image" },
];

// ============================================
// Media Step Component
// ============================================
export function MediaStep({ data, onChange }: MediaStepProps) {
  const [selectedTab, setSelectedTab] = useState<"images" | "videos">("images");
  const [searchQuery, setSearchQuery] = useState("");

  const handleImageSelect = (item: MediaItem) => {
    const isSelected = data.selectedImages.some((i) => i.id === item.id);
    if (isSelected) {
      onChange({
        ...data,
        selectedImages: data.selectedImages.filter((i) => i.id !== item.id),
      });
    } else {
      onChange({
        ...data,
        selectedImages: [...data.selectedImages, item],
      });
    }
  };

  const filterMedia = (media: MediaItem[]) => {
    if (!searchQuery) return media;
    return media.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <div className="space-y-4">
      {/* Toolbar Container - White Background */}
      <div className="bg-white rounded-[8px] p-3 space-y-3">
        {/* Tab Buttons - Account / Video URL / Page */}
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setSelectedTab("images")}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-[4px] text-[14px] font-medium transition-colors",
              selectedTab === "images"
                ? "bg-[#E1EDF7] text-[#0A78BE]"
                : "text-[#1C2B33] hover:bg-[#F5F7F8]"
            )}
          >
            <Icon 
              name="Playbutton" 
              variant="outlined" 
              size={16} 
              className={selectedTab === "images" ? "text-[#0A78BE]" : "text-[#465A69]"} 
            />
            Account
          </button>
          <button
            type="button"
            onClick={() => setSelectedTab("videos")}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-[4px] text-[14px] font-medium transition-colors",
              selectedTab === "videos"
                ? "bg-[#E1EDF7] text-[#0A78BE]"
                : "text-[#1C2B33] hover:bg-[#F5F7F8]"
            )}
          >
            <Icon 
              name="Folder" 
              variant="outlined" 
              size={16} 
              className={selectedTab === "videos" ? "text-[#0A78BE]" : "text-[#465A69]"} 
            />
            Video URL
          </button>
          <button
            type="button"
            className="flex items-center gap-2 px-3 py-2 rounded-[4px] text-[14px] font-medium transition-colors text-[#1C2B33] hover:bg-[#F5F7F8]"
          >
            <Icon 
              name="FacebookPage" 
              variant="outlined" 
              size={16} 
              className="text-[#465A69]" 
            />
            Page
          </button>
        </div>

        {/* Search Bar and Toolbar - Full Width */}
        <div className="flex items-center gap-2">
          <Input
            variant="search"
            placeholder={`Search ${selectedTab}`}
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
      {selectedTab === "images" && (
        <div className="space-y-4">
          <MediaGrid 
            title="Account images" 
            titleIcon="Photo"
            showSeeAll
            layout="horizontal"
          >
            {filterMedia(mockAccountImages).map((item) => (
              <MediaGrid.Item
                key={item.id}
                item={item}
                isSelected={data.selectedImages.some((i) => i.id === item.id)}
                onSelect={handleImageSelect}
              />
            ))}
          </MediaGrid>

          <MediaGrid 
            title="Instagram images" 
            titleIcon="Instagram"
            showSeeAll
            layout="horizontal"
          >
            {filterMedia(mockInstagramImages).map((item) => (
              <MediaGrid.Item
                key={item.id}
                item={item}
                isSelected={data.selectedImages.some((i) => i.id === item.id)}
                onSelect={handleImageSelect}
              />
            ))}
          </MediaGrid>

          <MediaGrid 
            title="Business images" 
            titleIcon="Briefcase"
            showSeeAll
            layout="horizontal"
          >
            {filterMedia(mockBusinessImages).map((item) => (
              <MediaGrid.Item
                key={item.id}
                item={item}
                isSelected={data.selectedImages.some((i) => i.id === item.id)}
                onSelect={handleImageSelect}
              />
            ))}
          </MediaGrid>
        </div>
      )}

      {selectedTab === "videos" && (
        <div className="flex items-center justify-center h-[300px] bg-white rounded-[8px] text-[#465A69]">
          <p>Video selection coming soon</p>
        </div>
      )}
    </div>
  );
}

export default MediaStep;
