"use client";

import { useState } from "react";
import { cn } from "@/features/ctv/lib/utils";
import { IconButton } from "@/features/ctv/components/ui/Button";
import { Stepper, type StepStatus } from "@/features/ctv/components/ui/Stepper";
import { SelectionFooter } from "@/features/ctv/components/ui/SelectionFooter";
import { Icon } from "@/features/ctv/components/ui/Icon";
import { type MediaItem } from "@/features/ctv/components/ui/MediaGrid";

import {
  CreativeSetupStep,
  MediaStep,
  TextStep,
  ImageGenerationStep,
  VideoGenerationStep,
  EnhancementStep,
  TranslationsStep,
} from "./creative-setup-before/steps";

// ============================================
// Types
// ============================================
interface WizardData {
  creativeSetup: {
    siteLinks: boolean;
    catalogItems: boolean;
    summary: boolean;
    websiteHighlights: boolean;
    sellingPoints: boolean;
    promotions: boolean;
    branding: boolean;
  };
  media: {
    selectedImages: MediaItem[];
    selectedVideos: MediaItem[];
  };
  text: {
    primaryText: string;
    headline: string;
    description: string;
    callToAction: string;
  };
  imageGeneration: {
    selectedPersonas: string[];
    selectedImages: string[];
    imageType: "full" | "product";
  };
  videoGeneration: {
    selectedImages: string[];
  };
  enhancement: {
    enhancements: Array<{
      id: string;
      name: string;
      description: string;
      enabled: boolean;
      isBeta?: boolean;
      exampleCount: number;
    }>;
    flexMediaEnabled: boolean;
  };
  translations: {
    textEnabled: boolean;
    voiceEnabled: boolean;
    destinationsEnabled: boolean;
    selectedLanguages: string[];
  };
}

// ============================================
// Steps Configuration
// ============================================
const steps = [
  { id: "creative-setup", label: "Creative setup", icon: "Settings" },
  { id: "media", label: "Media", icon: "Photo" },
  { id: "text", label: "Text", icon: "PencilSquare" },
  { id: "image-generation", label: "Image generation", icon: "Photo" },
  { id: "video-generation", label: "Video generation", icon: "Video" },
  { id: "enhancement", label: "Enhancement", icon: "GenAIStar" },
  { id: "translations", label: "Translations", icon: "People" },
];

// ============================================
// Initial Data
// ============================================
const initialData: WizardData = {
  creativeSetup: {
    siteLinks: true,
    catalogItems: true,
    summary: true,
    websiteHighlights: true,
    sellingPoints: true,
    promotions: true,
    branding: true,
  },
  media: {
    selectedImages: [],
    selectedVideos: [],
  },
  text: {
    primaryText: "",
    headline: "",
    description: "",
    callToAction: "shop_now",
  },
  imageGeneration: {
    selectedPersonas: [],
    selectedImages: [],
    imageType: "full",
  },
  videoGeneration: {
    selectedImages: [],
  },
  enhancement: {
    enhancements: [
      {
        id: "add-summaries",
        name: "Add summaries",
        description: "Showing AI generated selling points above ad comments.",
        enabled: true,
        exampleCount: 3,
      },
      {
        id: "virtual-try-on",
        name: "Virtual try-on",
        description: "Displaying products from your catalog on AI generated fashion models.",
        enabled: true,
        exampleCount: 5,
      },
      {
        id: "replace-media-text",
        name: "Replace media text",
        description: "Replacing your media text with AI-generated text.",
        enabled: true,
        exampleCount: 5,
      },
      {
        id: "create-sticker-cta",
        name: "Create sticker CTA",
        description: "Adding AI-generated stickers to CTAs in your Stories ads...",
        enabled: false,
        isBeta: true,
        exampleCount: 2,
      },
    ],
    flexMediaEnabled: true,
  },
  translations: {
    textEnabled: true,
    voiceEnabled: true,
    destinationsEnabled: true,
    selectedLanguages: ["ja", "es", "fr", "de", "pt"],
  },
};

// ============================================
// Step Headers
// ============================================
const stepHeaders: Record<string, { title: string; description?: string }> = {
  "creative-setup": {
    title: "Creative setup",
    description: "To help us better personalize your creatives, confirm the information we'll use for new and existing AI generations and enhancements. Some information may be shown to customers, as well.",
  },
  "media": {
    title: "Media",
    description: "Choose up to 10 media to improve creative diversity and we'll crop them for your selected placements.",
  },
  "text": {
    title: "Text",
    description: "Add multiple text options and we'll show the one we predict will perform best when your ad is delivered.",
  },
  "image-generation": {
    title: "Advantage+ creative image generation",
  },
  "video-generation": {
    title: "Advantage+ creative video generation",
  },
  "enhancement": {
    title: "Review Advantage+ creative enhancements",
  },
  "translations": {
    title: "Translations",
  },
};

// ============================================
// Creative Setup Before Preview Component
// Renders inline without portal/backdrop for gallery viewing
// ============================================
export function CreativeSetupBeforePreview() {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<WizardData>(initialData);

  const getStepStatus = (index: number): StepStatus => {
    if (index < currentStep) return "completed";
    if (index === currentStep) return "current";
    return "upcoming";
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const getSelectionCount = () => {
    switch (steps[currentStep].id) {
      case "media":
        return data.media.selectedImages.length + data.media.selectedVideos.length;
      case "image-generation":
        return data.imageGeneration.selectedImages.length;
      case "video-generation":
        return data.videoGeneration.selectedImages.length;
      default:
        return 0;
    }
  };

  const getSelectionLabel = () => {
    switch (steps[currentStep].id) {
      case "media":
        return "Media from you";
      case "image-generation":
        return "Media from AI";
      case "video-generation":
        return "Media from AI";
      default:
        return "";
    }
  };

  const renderStepContent = () => {
    switch (steps[currentStep].id) {
      case "creative-setup":
        return (
          <CreativeSetupStep
            data={data.creativeSetup}
            onChange={(creativeSetup) => setData({ ...data, creativeSetup })}
          />
        );
      case "media":
        return (
          <MediaStep
            data={data.media}
            onChange={(media) => setData({ ...data, media })}
          />
        );
      case "text":
        return (
          <TextStep
            data={data.text}
            onChange={(text) => setData({ ...data, text })}
          />
        );
      case "image-generation":
        return (
          <ImageGenerationStep
            data={data.imageGeneration}
            onChange={(imageGeneration) => setData({ ...data, imageGeneration })}
          />
        );
      case "video-generation":
        return (
          <VideoGenerationStep
            data={data.videoGeneration}
            onChange={(videoGeneration) => setData({ ...data, videoGeneration })}
          />
        );
      case "enhancement":
        return (
          <EnhancementStep
            data={data.enhancement}
            onChange={(enhancement) => setData({ ...data, enhancement })}
          />
        );
      case "translations":
        return (
          <TranslationsStep
            data={data.translations}
            onChange={(translations) => setData({ ...data, translations })}
          />
        );
      default:
        return null;
    }
  };

  const currentStepConfig = stepHeaders[steps[currentStep].id];
  const selectionCount = getSelectionCount();
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div
      className={cn(
        "flex",
        "bg-white rounded-[4px]",
        "shadow-[0px_8px_24px_4px_rgba(0,0,0,0.1),0px_2px_2px_0px_rgba(0,0,0,0.1)]",
        "h-[700px]",
        "w-full",
        "overflow-hidden"
      )}
    >
      {/* Stepper Sidebar */}
      <Stepper
        title="Set up your creative"
        currentStep={currentStep}
        onStepClick={setCurrentStep}
        className="h-full rounded-tl-[4px] rounded-bl-[4px]"
      >
        {steps.map((step, index) => (
          <Stepper.Step
            key={step.id}
            label={step.label}
            icon={step.icon}
            status={getStepStatus(index)}
            showTopConnector={index > 0}
            showBottomConnector={index < steps.length - 1}
            onClick={() => setCurrentStep(index)}
          />
        ))}
      </Stepper>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white shadow-[-2px_0px_4px_0px_rgba(0,0,0,0.08)]">
        {/* Header */}
        <div className="shrink-0 bg-white">
          <div className="flex items-start justify-between px-4 py-3">
            <div className="flex-1">
              <div className="flex items-center gap-1">
                <h2 className="text-[16px] font-bold leading-[20px] text-[#1C2B33] font-optimistic">
                  {currentStepConfig.title}
                </h2>
                <Icon name="Info" variant="filled" size={16} className="text-[#465A69]" />
              </div>
              {currentStepConfig.description && (
                <p className="text-[14px] font-normal leading-[20px] text-[#465A69] font-optimistic mt-0.5 max-w-[700px]">
                  {currentStepConfig.description}
                </p>
              )}
            </div>
            <IconButton
              icon="Close"
              iconVariant="outlined"
              variant="flat"
              aria-label="Close modal"
            />
          </div>
          
          {/* Website URL - only show on creative-setup step */}
          {steps[currentStep].id === "creative-setup" && (
            <div className="px-4 pb-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-[#F5F7F8] border border-[#E4E8EB] rounded-[4px]">
                <div className="w-2.5 h-2.5 rounded-full bg-[#006B4E]" />
                <span className="text-[14px] text-[#1C2B33] font-optimistic">
                  Website URL: https://www.lalueurbeauty.com/
                </span>
                <button className="text-[14px] text-[#0A78BE] font-optimistic hover:underline ml-2">
                  Edit sources
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 py-4 bg-[#F5F7F8]">
          {renderStepContent()}
        </div>

        {/* Footer */}
        <SelectionFooter
          selectedCount={selectionCount}
          selectionLabel={getSelectionLabel()}
          cancelLabel="Cancel"
          primaryLabel={isLastStep ? "Done" : "Next"}
          onCancel={() => {}}
          onPrimary={handleNext}
          leftContent={
            selectionCount === 0 ? (
              <div />
            ) : undefined
          }
        />
      </div>
    </div>
  );
}

export default CreativeSetupBeforePreview;
