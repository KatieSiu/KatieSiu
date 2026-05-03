"use client";

import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
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
} from "./steps";

// ============================================
// Types
// ============================================
interface CreativeSetupBeforeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: (data: WizardData) => void;
}

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
    siteLinks: false,
    catalogItems: false,
    summary: false,
    websiteHighlights: false,
    sellingPoints: false,
    promotions: false,
    branding: false,
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
// Creative Setup Before Modal Component
// ============================================
export function CreativeSetupBeforeModal({
  isOpen,
  onClose,
  onComplete,
}: CreativeSetupBeforeModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<WizardData>(initialData);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setData(initialData);
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

  // Get step status
  const getStepStatus = (index: number): StepStatus => {
    if (index < currentStep) return "completed";
    if (index === currentStep) return "current";
    return "upcoming";
  };

  // Handle next step
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete?.(data);
      onClose();
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Get selection count for footer
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

  // Get selection label for footer
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

  // Render current step content
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

  if (!isOpen) return null;

  const currentStepConfig = stepHeaders[steps[currentStep].id];
  const selectionCount = getSelectionCount();
  const isLastStep = currentStep === steps.length - 1;

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
          "relative flex",
          "bg-white rounded-[4px]",
          "shadow-[0px_8px_24px_4px_rgba(0,0,0,0.1),0px_2px_2px_0px_rgba(0,0,0,0.1)]",
          "max-h-[90vh]",
          "w-[calc(100vw-80px)] max-w-[1100px]",
          "overflow-hidden"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Stepper Sidebar */}
        <Stepper
          title="Set up your creative"
          currentStep={currentStep}
          onStepClick={setCurrentStep}
          className="h-auto self-stretch rounded-tl-[4px] rounded-bl-[4px]"
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
        <div className="flex-1 flex flex-col min-w-0 bg-white">
          {/* Header */}
          <div className="flex items-start justify-between px-4 py-3 shrink-0 border-b border-[#E4E8EB]">
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
              onClick={onClose}
              aria-label="Close modal"
            />
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
            onCancel={onClose}
            onPrimary={handleNext}
            leftContent={
              selectionCount === 0 ? (
                <div /> // Empty div to maintain layout
              ) : undefined
            }
          />
        </div>
      </div>
    </div>,
    document.body
  );
}

export default CreativeSetupBeforeModal;
