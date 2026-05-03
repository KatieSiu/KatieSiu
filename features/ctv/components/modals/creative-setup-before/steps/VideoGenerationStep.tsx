"use client";

import { cn } from "@/features/ctv/lib/utils";
import { Button } from "@/features/ctv/components/ui/Button";
import { Checkbox } from "@/features/ctv/components/ui/Checkbox";
import { Icon } from "@/features/ctv/components/ui/Icon";
import { Pill } from "@/features/ctv/components/ui/Pill";
import { MediaGrid, type MediaItem } from "@/features/ctv/components/ui/MediaGrid";

// ============================================
// Types
// ============================================
interface VideoGenerationStepData {
  selectedImages: string[];
}

interface VideoGenerationStepProps {
  data: VideoGenerationStepData;
  onChange: (data: VideoGenerationStepData) => void;
}

// ============================================
// Mock Data
// ============================================
const mockImages: MediaItem[] = [
  { id: "vid-img-1", name: "", dimensions: "", type: "image" },
  { id: "vid-img-2", name: "", dimensions: "", type: "image" },
  { id: "vid-img-3", name: "", dimensions: "", type: "image" },
];

// ============================================
// Video Generation Step Component
// ============================================
export function VideoGenerationStep({ data, onChange }: VideoGenerationStepProps) {
  const handleImageToggle = (item: MediaItem) => {
    const isSelected = data.selectedImages.includes(item.id);
    if (isSelected) {
      onChange({
        selectedImages: data.selectedImages.filter((id) => id !== item.id),
      });
    } else {
      onChange({
        selectedImages: [...data.selectedImages, item.id],
      });
    }
  };

  return (
    <div className="flex gap-6">
      {/* Main Content */}
      <div className="flex-1 space-y-4">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-[16px] font-bold leading-[20px] text-[#1C2B33] font-optimistic">
              Advantage+ creative video generation
            </h3>
            <Pill variant="default">AI</Pill>
            <Pill variant="default">Beta</Pill>
          </div>
          <p className="text-[14px] text-[#465A69] font-optimistic mt-1">
            Generate 3 or more vertical videos (9:16 aspect ratio) that are 15 seconds each. You can edit each video by making changes to clips, text overlays and music.
          </p>
          <button className="text-[14px] text-[#0A78BE] font-optimistic hover:underline mt-1">
            View terms
          </button>
        </div>

        {/* Images for videos section */}
        <div className="bg-white rounded-[8px] border border-[#E4E8EB] p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="text-[14px] font-bold leading-[20px] text-[#1C2B33] font-optimistic">
                Images for your videos
              </h4>
              <p className="text-[12px] text-[#465A69] font-optimistic">
                We selected images from your ad account and destination that may work best for this ad. We may also generate additional images when needed. You can upload more or unselect images.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <Checkbox value="select-all" label="Select all" />
            <Button variant="secondary">Upload</Button>
          </div>

          {/* Image Grid */}
          <div className="flex gap-3">
            {mockImages.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleImageToggle(item)}
                className={cn(
                  "w-[80px] h-[80px] rounded-[4px] border-2 transition-colors",
                  "bg-[#F5F7F8] flex items-center justify-center relative",
                  data.selectedImages.includes(item.id)
                    ? "border-[#0A78BE]"
                    : "border-[#E4E8EB] hover:border-[#CBD2D9]"
                )}
              >
                {data.selectedImages.includes(item.id) && (
                  <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[#0A78BE] flex items-center justify-center">
                    <Icon name="Check" variant="filled" size={12} className="text-white" />
                  </div>
                )}
                <Icon name="Photo" variant="outlined" size={24} className="text-[#CBD2D9]" />
              </button>
            ))}
          </div>

          <div className="mt-4 flex justify-end">
            <Button variant="primary">Generate videos</Button>
          </div>
        </div>
      </div>

      {/* Preview Panel */}
      <div className="w-[275px] shrink-0">
        <div className="bg-white rounded-[8px] border border-[#E4E8EB] p-4">
          <h4 className="text-[14px] font-bold leading-[20px] text-[#1C2B33] font-optimistic mb-3">
            Example videos
          </h4>
          <div className="text-center text-[#465A69] mb-4">
            <p className="text-[12px]">Showcase your product in multiple clips.</p>
          </div>
          
          {/* Video Preview Placeholder */}
          <div className="bg-[#F5F7F8] rounded-[4px] h-[200px] flex items-center justify-center mb-3">
            <Icon name="Video" variant="outlined" size={48} className="text-[#CBD2D9]" />
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4">
            <button className="p-1 hover:bg-[#F5F7F8] rounded">
              <Icon name="CaretLeftSmall" variant="outlined" size={16} className="text-[#465A69]" />
            </button>
            <span className="text-[12px] text-[#465A69] font-optimistic">Example 1 of 3</span>
            <button className="p-1 hover:bg-[#F5F7F8] rounded">
              <Icon name="CaretRight" variant="outlined" size={16} className="text-[#465A69]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoGenerationStep;
