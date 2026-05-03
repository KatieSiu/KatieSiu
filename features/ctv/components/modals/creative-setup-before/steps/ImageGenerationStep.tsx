"use client";

import { cn } from "@/features/ctv/lib/utils";
import { Button } from "@/features/ctv/components/ui/Button";
import { TabBar } from "@/features/ctv/components/ui/TabBar";
import { Checkbox } from "@/features/ctv/components/ui/Checkbox";
import { Icon } from "@/features/ctv/components/ui/Icon";
import { Pill } from "@/features/ctv/components/ui/Pill";

// ============================================
// Types
// ============================================
interface ImageGenerationStepData {
  selectedPersonas: string[];
  selectedImages: string[];
  imageType: "full" | "product";
}

interface ImageGenerationStepProps {
  data: ImageGenerationStepData;
  onChange: (data: ImageGenerationStepData) => void;
}

// ============================================
// Mock Personas
// ============================================
const personas = [
  {
    id: "busy-professional",
    name: "The Busy Professional",
    description: "A driven achiever balancing career and self-care. Highly motivated by convenience.",
    traits: ["Values efficiency", "Prefers online shopping", "Limited self-care time", "High-quality"],
  },
  {
    id: "eco-conscious",
    name: "The Eco-Conscious Millennial",
    description: "An individual who prioritizes sustainability and ethical practices in their purchasing decisions.",
    traits: ["Values sustainability", "Actively researches brands", "Has ethical sourcing uncertainty", "Organic"],
  },
  {
    id: "skincare-enthusiast",
    name: "The Skincare Enthusiast",
    description: "An individual who is passionate about skincare and beauty products.",
    traits: ["Values self-expression", "Follows beauty influencers", "Suffers from inconsistent results"],
  },
];

// ============================================
// Persona Card Component
// ============================================
interface PersonaCardProps {
  persona: typeof personas[0];
  isSelected: boolean;
  onToggle: () => void;
  selectedImages: string[];
  onImageToggle: (imageId: string) => void;
}

function PersonaCard({ persona, isSelected, onToggle, selectedImages, onImageToggle }: PersonaCardProps) {
  const imageIds = [`${persona.id}-1`, `${persona.id}-2`, `${persona.id}-3`];

  return (
    <div className="flex gap-4">
      {/* Persona Info */}
      <div className="w-[280px] shrink-0">
        <h4 className="text-[15px] font-bold leading-[20px] text-[#1C2B33] font-optimistic mb-1">
          {persona.name}
        </h4>
        <p className="text-[14px] text-[#465A69] font-optimistic mb-2">
          {persona.description}
        </p>
        <ul className="space-y-1">
          {persona.traits.map((trait, i) => (
            <li key={i} className="text-[12px] text-[#465A69] font-optimistic flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-[#465A69]" />
              {trait}
            </li>
          ))}
        </ul>
      </div>

      {/* Image Selection */}
      <div className="flex gap-3">
        {imageIds.map((imageId) => (
          <button
            key={imageId}
            type="button"
            onClick={() => onImageToggle(imageId)}
            className={cn(
              "w-[140px] h-[180px] rounded-[4px] border-2 transition-colors",
              "bg-[#F5F7F8] flex flex-col items-center justify-center",
              selectedImages.includes(imageId)
                ? "border-[#0A78BE]"
                : "border-[#E4E8EB] hover:border-[#CBD2D9]"
            )}
          >
            <Checkbox
              value={imageId}
              label=""
              checked={selectedImages.includes(imageId)}
              onChange={() => onImageToggle(imageId)}
              className="absolute top-2 left-2"
            />
            <Icon name="Photo" variant="outlined" size={32} className="text-[#CBD2D9]" />
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================
// Image Generation Step Component
// ============================================
export function ImageGenerationStep({ data, onChange }: ImageGenerationStepProps) {
  const handleImageTypeChange = (type: "full" | "product") => {
    onChange({ ...data, imageType: type });
  };

  const handleImageToggle = (imageId: string) => {
    const isSelected = data.selectedImages.includes(imageId);
    if (isSelected) {
      onChange({
        ...data,
        selectedImages: data.selectedImages.filter((id) => id !== imageId),
      });
    } else {
      onChange({
        ...data,
        selectedImages: [...data.selectedImages, imageId],
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-[16px] font-bold leading-[20px] text-[#1C2B33] font-optimistic">
              Advantage+ creative image generation
            </h3>
            <Pill variant="default">AI</Pill>
          </div>
          <p className="text-[14px] text-[#465A69] font-optimistic mt-1">
            In our experiment, campaigns with all ads adding AI-generated images saw{" "}
            <span className="text-[#006B4E] font-medium">11% CTR lift</span> and{" "}
            <span className="text-[#006B4E] font-medium">8% CVR lift</span>
          </p>
        </div>
      </div>

      {/* Image Type Tabs */}
      <div className="flex items-center justify-between">
        <TabBar value={data.imageType} onChange={(v) => handleImageTypeChange(v as "full" | "product")}>
          <TabBar.Tab value="full" label="Full image" />
          <TabBar.Tab value="product" label="Product image" />
          <TabBar.Tab value="generate" label="Generate new images" />
        </TabBar>

        <div className="flex items-center gap-3">
          <Checkbox value="select-all" label="Select all" />
          <Button variant="secondary">Refine AI Inputs</Button>
        </div>
      </div>

      {/* Personas Grid */}
      <div className="space-y-6">
        {personas.map((persona) => (
          <PersonaCard
            key={persona.id}
            persona={persona}
            isSelected={data.selectedPersonas.includes(persona.id)}
            onToggle={() => {
              const isSelected = data.selectedPersonas.includes(persona.id);
              if (isSelected) {
                onChange({
                  ...data,
                  selectedPersonas: data.selectedPersonas.filter((id) => id !== persona.id),
                });
              } else {
                onChange({
                  ...data,
                  selectedPersonas: [...data.selectedPersonas, persona.id],
                });
              }
            }}
            selectedImages={data.selectedImages}
            onImageToggle={handleImageToggle}
          />
        ))}
      </div>
    </div>
  );
}

export default ImageGenerationStep;
