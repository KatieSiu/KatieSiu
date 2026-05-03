"use client";

import { useState, ReactNode, type HTMLAttributes, forwardRef } from "react";
import Link from "next/link";
import { Text } from "@/features/ctv/components/ui/Text";
import { Button, IconButton } from "@/features/ctv/components/ui/Button";
import { Modal } from "@/features/ctv/components/ui/Modal";
import { Icon } from "@/features/ctv/components/ui/Icon";
import { cn } from "@/features/ctv/lib/utils";
import { 
  CreativeSetupAlphaPreview,
  CreativeSetupBeforePreview,
  VideoGeneratingToastPreview,
  VideoUploadCompleteToastPreview,
  VideoGenerationToastFlowPreview
} from "@/features/ctv/components/modals";

// ============================================
// Preview-only modal subcomponents (no context required)
// These mirror Modal.Header/Body/Footer styling
// but can render outside a <Modal> wrapper.
// ============================================
function PreviewHeader({ title, description, children, className }: {
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start justify-between pl-4 pr-1 py-0 bg-white shrink-0", className)}>
      <div className="flex-1 flex flex-col justify-center py-4 pr-2 min-w-0">
        <h2 className="text-[16px] font-bold leading-[20px] text-[#1C2B33] font-optimistic truncate">{title}</h2>
        {description && (
          <p className="text-[14px] font-normal leading-[20px] text-[#465A69] font-optimistic mt-0">{description}</p>
        )}
      </div>
      <div className="flex items-start gap-2 py-2 pr-1">
        {children}
        <IconButton icon="Close" iconVariant="outlined" variant="flat" aria-label="Close modal" />
      </div>
    </div>
  );
}

function PreviewBody({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("flex-1 overflow-y-auto px-4 pt-0 pb-2", className)}>
      <div className="text-[14px] font-normal leading-[20px] text-[#1C2B33] font-optimistic">{children}</div>
    </div>
  );
}

function PreviewFooter({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-center justify-end gap-2 px-4 pt-3 pb-4 shrink-0", className)}>
      {children}
    </div>
  );
}

export default function ModalGallery() {
  // State for "View as Modal" functionality
  const [activeModal, setActiveModal] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-[#F5F7F8]">
      {/* Header */}
      <header className="bg-white border-b border-[#E4E8EB] px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <Text variant="header1" color="primary">Modal Gallery</Text>
            <Text variant="valueDescription" color="description" className="mt-1">
              Review and refine all modal content in one place
            </Text>
          </div>
          <Link 
            href="/"
            className="text-[14px] text-[#0A78BE] hover:underline"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="p-6">
        {/* Instructions */}
        <div className="bg-white rounded-lg border border-[#E4E8EB] p-6 mb-8">
          <Text variant="header3" color="primary" className="mb-2">
            How to use this page
          </Text>
          <Text variant="value" color="description">
            This gallery displays all modals used in the CTV prototype in a static preview mode. 
            Each modal is shown inline so you can review content side-by-side. Click "View as Modal" 
            to test the actual modal behavior with backdrop and interactions.
          </Text>
        </div>

        {/* Modal Sections */}
        <div className="space-y-12">

          {/* Confirmation Modals */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Text variant="header2" color="primary">Confirmation Modals</Text>
              <span className="px-2 py-0.5 bg-[#E4E8EB] rounded text-[12px] text-[#5C6970]">
                Small (400px)
              </span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              
              {/* Delete Confirmation */}
              <ModalPreview
                id="delete-confirmation"
                title="Delete Confirmation"
                size="small"
                activeModal={activeModal}
                onViewAsModal={setActiveModal}
              >
                <PreviewHeader
                  title="Delete Campaign?"
                  description="This action cannot be undone"
                />
                <PreviewBody>
                  Are you sure you want to delete "Summer Sale Campaign"?
                  All associated data including performance metrics and creative assets will be permanently removed.
                </PreviewBody>
                <PreviewFooter>
                  <Button variant="secondary">Cancel</Button>
                  <Button variant="primary">Delete</Button>
                </PreviewFooter>
              </ModalPreview>

              {/* Discard Changes */}
              <ModalPreview
                id="discard-changes"
                title="Discard Changes"
                size="small"
                activeModal={activeModal}
                onViewAsModal={setActiveModal}
              >
                <PreviewHeader
                  title="Discard unsaved changes?"
                />
                <PreviewBody>
                  You have unsaved changes that will be lost if you leave this page.
                  Do you want to discard these changes?
                </PreviewBody>
                <PreviewFooter>
                  <Button variant="secondary">Keep Editing</Button>
                  <Button variant="primary">Discard</Button>
                </PreviewFooter>
              </ModalPreview>

              {/* Placeholder */}
              <ModalPlaceholder title="Add Confirmation Modal" />

            </div>
          </section>

          {/* Form Modals */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Text variant="header2" color="primary">Form Modals</Text>
              <span className="px-2 py-0.5 bg-[#E4E8EB] rounded text-[12px] text-[#5C6970]">
                Medium (560px)
              </span>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              
              {/* Edit Campaign Name */}
              <ModalPreview
                id="edit-campaign"
                title="Edit Campaign"
                size="medium"
                activeModal={activeModal}
                onViewAsModal={setActiveModal}
              >
                <PreviewHeader
                  title="Edit Campaign"
                  description="Update campaign details"
                />
                <PreviewBody>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[14px] font-medium text-[#1C2B33] mb-1">
                        Campaign Name
                      </label>
                      <input
                        type="text"
                        defaultValue="Summer Sale Campaign"
                        className="w-full px-3 py-2 border border-[#CBD2D9] rounded text-[14px] focus:outline-none focus:border-[#0A78BE] focus:ring-1 focus:ring-[#0A78BE]"
                      />
                    </div>
                    <div>
                      <label className="block text-[14px] font-medium text-[#1C2B33] mb-1">
                        Description
                      </label>
                      <textarea
                        rows={3}
                        defaultValue="Promotional campaign for summer product line"
                        className="w-full px-3 py-2 border border-[#CBD2D9] rounded text-[14px] focus:outline-none focus:border-[#0A78BE] focus:ring-1 focus:ring-[#0A78BE] resize-none"
                      />
                    </div>
                  </div>
                </PreviewBody>
                <PreviewFooter>
                  <Button variant="secondary">Cancel</Button>
                  <Button variant="primary">Save Changes</Button>
                </PreviewFooter>
              </ModalPreview>

              {/* Placeholder */}
              <ModalPlaceholder title="Add Form Modal" size="medium" />

            </div>
          </section>

          {/* Informational Modals */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Text variant="header2" color="primary">Informational Modals</Text>
              <span className="px-2 py-0.5 bg-[#E4E8EB] rounded text-[12px] text-[#5C6970]">
                Medium (560px)
              </span>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              
              {/* Help Modal */}
              <ModalPreview
                id="help-ctv"
                title="CTV Help"
                size="medium"
                activeModal={activeModal}
                onViewAsModal={setActiveModal}
              >
                <PreviewHeader
                  title="About CTV Placements"
                  description="Learn how Connected TV ads work"
                />
                <PreviewBody>
                  <div className="space-y-4">
                    <p>
                      Connected TV (CTV) placements allow you to reach audiences watching
                      streaming content on smart TVs and connected devices.
                    </p>
                    <div className="bg-[#F5F7F8] rounded p-3">
                      <Text variant="label" color="primary" className="mb-2 block">
                        Key Benefits
                      </Text>
                      <ul className="list-disc list-inside text-[14px] text-[#465A69] space-y-1">
                        <li>Premium, brand-safe inventory</li>
                        <li>Full-screen, non-skippable formats</li>
                        <li>Household-level targeting</li>
                        <li>Cross-device measurement</li>
                      </ul>
                    </div>
                    <p className="text-[#0A78BE] cursor-pointer hover:underline">
                      Learn more about CTV advertising →
                    </p>
                  </div>
                </PreviewBody>
                <PreviewFooter>
                  <Button variant="primary">Got it</Button>
                </PreviewFooter>
              </ModalPreview>

              {/* Placeholder */}
              <ModalPlaceholder title="Add Informational Modal" size="medium" />

            </div>
          </section>

          {/* Large Modals */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Text variant="header2" color="primary">Large Modals</Text>
              <span className="px-2 py-0.5 bg-[#E4E8EB] rounded text-[12px] text-[#5C6970]">
                Large (800px+)
              </span>
            </div>
            <div className="grid grid-cols-1 gap-6">
              
              {/* Placeholder */}
              <ModalPlaceholder title="Add Large Modal" size="large" />

            </div>
          </section>

          {/* Toast Modals Section */}
          <section>
            <Text variant="header2" color="primary" className="mb-4">Toast Notifications</Text>
            <Text variant="value" color="description" className="mb-6">
              Toast notifications that appear in the bottom-right corner. Used for progress indicators and confirmations.
            </Text>
            
            <div className="space-y-8">
              {/* Video Generating Toast */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Text variant="header3" color="primary">Video Generating Toast</Text>
                  <span className="px-2 py-0.5 bg-[#D4EDDA] rounded text-[12px] text-[#155724]">
                    Animated
                  </span>
                </div>
                <Text variant="value" color="description" className="mb-4">
                  Shows video generation progress with animated striped progress bar. Auto-increments from 10% to 100% over ~15 seconds.
                </Text>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 bg-[#F5F7F8] rounded text-[11px] text-[#465A69]">Progress bar</span>
                  <span className="px-2 py-1 bg-[#F5F7F8] rounded text-[11px] text-[#465A69]">Auto-increment</span>
                  <span className="px-2 py-1 bg-[#F5F7F8] rounded text-[11px] text-[#465A69]">Striped animation</span>
                </div>
                <div className="p-6 bg-[#F5F7F8] rounded-lg">
                  <VideoGeneratingToastPreview />
                </div>
              </div>

              {/* Upload Complete Toast */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Text variant="header3" color="primary">Upload Complete Toast</Text>
                  <span className="px-2 py-0.5 bg-[#D4EDDA] rounded text-[12px] text-[#155724]">
                    Success
                  </span>
                </div>
                <Text variant="value" color="description" className="mb-4">
                  Confirmation toast shown after video generation completes. "View Ad" button opens the Creative Setup Alpha modal.
                </Text>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 bg-[#F5F7F8] rounded text-[11px] text-[#465A69]">Success state</span>
                  <span className="px-2 py-1 bg-[#F5F7F8] rounded text-[11px] text-[#465A69]">View Ad action</span>
                </div>
                <div className="p-6 bg-[#F5F7F8] rounded-lg">
                  <VideoUploadCompleteToastPreview />
                </div>
              </div>

              {/* Full Flow Toast */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Text variant="header3" color="primary">Full Flow (Generating → Complete)</Text>
                  <span className="px-2 py-0.5 bg-[#FFF3CD] rounded text-[12px] text-[#856404]">
                    Auto-transition
                  </span>
                </div>
                <Text variant="value" color="description" className="mb-4">
                  Complete toast flow: starts with generating state, automatically transitions to success state when progress reaches 100%.
                </Text>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 bg-[#F5F7F8] rounded text-[11px] text-[#465A69]">Two states</span>
                  <span className="px-2 py-1 bg-[#F5F7F8] rounded text-[11px] text-[#465A69]">Auto-transition</span>
                  <span className="px-2 py-1 bg-[#F5F7F8] rounded text-[11px] text-[#465A69]">~15 second duration</span>
                </div>
                <div className="p-6 bg-[#F5F7F8] rounded-lg">
                  <VideoGenerationToastFlowPreview />
                </div>
              </div>
            </div>
          </section>

          {/* Creative Setup Before - Full Width Preview */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Text variant="header2" color="primary">Creative Setup Before</Text>
              <span className="px-2 py-0.5 bg-[#FFF3CD] rounded text-[12px] text-[#856404]">
                7 Steps
              </span>
            </div>
            <Text variant="value" color="description" className="mb-4">
              Full creative setup wizard with AI-powered features: Creative setup, Media, Text, Image generation, Video generation, Enhancement, and Translations.
            </Text>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-2 py-1 bg-[#F5F7F8] rounded text-[11px] text-[#465A69]">Stepper sidebar</span>
              <span className="px-2 py-1 bg-[#F5F7F8] rounded text-[11px] text-[#465A69]">Preview panel</span>
              <span className="px-2 py-1 bg-[#F5F7F8] rounded text-[11px] text-[#465A69]">AI features</span>
              <span className="px-2 py-1 bg-[#F5F7F8] rounded text-[11px] text-[#465A69]">Persistent state</span>
            </div>
            <CreativeSetupBeforePreview />
          </section>

          {/* Creative Setup Alpha - Full Width Preview */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Text variant="header2" color="primary">Creative Setup Alpha</Text>
              <span className="px-2 py-0.5 bg-[#D4EDDA] rounded text-[12px] text-[#155724]">
                Single Step
              </span>
            </div>
            <Text variant="value" color="description" className="mb-4">
              Simplified video selection modal for the Alpha experience. Features search, filters, and multi-select grid.
            </Text>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-2 py-1 bg-[#F5F7F8] rounded text-[11px] text-[#465A69]">Video picker</span>
              <span className="px-2 py-1 bg-[#F5F7F8] rounded text-[11px] text-[#465A69]">Search & filter</span>
              <span className="px-2 py-1 bg-[#F5F7F8] rounded text-[11px] text-[#465A69]">Multi-select</span>
            </div>
            <CreativeSetupAlphaPreview />
          </section>

        </div>
      </div>

      {/* Actual Modal Renders (for "View as Modal" functionality) */}
      <Modal 
        isOpen={activeModal === "delete-confirmation"} 
        onClose={() => setActiveModal(null)} 
        size="small"
      >
        <Modal.Header 
          title="Delete Campaign?" 
          description="This action cannot be undone"
        />
        <Modal.Body>
          Are you sure you want to delete "Summer Sale Campaign"? 
          All associated data including performance metrics and creative assets will be permanently removed.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setActiveModal(null)}>Cancel</Button>
          <Button variant="primary" onClick={() => setActiveModal(null)}>Delete</Button>
        </Modal.Footer>
      </Modal>

      <Modal 
        isOpen={activeModal === "discard-changes"} 
        onClose={() => setActiveModal(null)} 
        size="small"
      >
        <Modal.Header title="Discard unsaved changes?" />
        <Modal.Body>
          You have unsaved changes that will be lost if you leave this page. 
          Do you want to discard these changes?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setActiveModal(null)}>Keep Editing</Button>
          <Button variant="primary" onClick={() => setActiveModal(null)}>Discard</Button>
        </Modal.Footer>
      </Modal>

      <Modal 
        isOpen={activeModal === "edit-campaign"} 
        onClose={() => setActiveModal(null)} 
        size="medium"
      >
        <Modal.Header 
          title="Edit Campaign" 
          description="Update campaign details"
        />
        <Modal.Body>
          <div className="space-y-4">
            <div>
              <label className="block text-[14px] font-medium text-[#1C2B33] mb-1">
                Campaign Name
              </label>
              <input 
                type="text" 
                defaultValue="Summer Sale Campaign"
                className="w-full px-3 py-2 border border-[#CBD2D9] rounded text-[14px] focus:outline-none focus:border-[#0A78BE] focus:ring-1 focus:ring-[#0A78BE]"
              />
            </div>
            <div>
              <label className="block text-[14px] font-medium text-[#1C2B33] mb-1">
                Description
              </label>
              <textarea 
                rows={3}
                defaultValue="Promotional campaign for summer product line"
                className="w-full px-3 py-2 border border-[#CBD2D9] rounded text-[14px] focus:outline-none focus:border-[#0A78BE] focus:ring-1 focus:ring-[#0A78BE] resize-none"
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setActiveModal(null)}>Cancel</Button>
          <Button variant="primary" onClick={() => setActiveModal(null)}>Save Changes</Button>
        </Modal.Footer>
      </Modal>

      <Modal 
        isOpen={activeModal === "help-ctv"} 
        onClose={() => setActiveModal(null)} 
        size="medium"
      >
        <Modal.Header 
          title="About CTV Placements" 
          description="Learn how Connected TV ads work"
        />
        <Modal.Body>
          <div className="space-y-4">
            <p>
              Connected TV (CTV) placements allow you to reach audiences watching 
              streaming content on smart TVs and connected devices.
            </p>
            <div className="bg-[#F5F7F8] rounded p-3">
              <Text variant="label" color="primary" className="mb-2 block">
                Key Benefits
              </Text>
              <ul className="list-disc list-inside text-[14px] text-[#465A69] space-y-1">
                <li>Premium, brand-safe inventory</li>
                <li>Full-screen, non-skippable formats</li>
                <li>Household-level targeting</li>
                <li>Cross-device measurement</li>
              </ul>
            </div>
            <p className="text-[#0A78BE] cursor-pointer hover:underline">
              Learn more about CTV advertising →
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setActiveModal(null)}>Got it</Button>
        </Modal.Footer>
      </Modal>

    </main>
  );
}

// ============================================
// Modal Preview Component (inline display)
// ============================================
interface ModalPreviewProps {
  id: string;
  title: string;
  size: 'small' | 'medium' | 'large';
  children: ReactNode;
  activeModal: string | null;
  onViewAsModal: (id: string | null) => void;
}

const sizeWidths = {
  small: 'max-w-[400px]',
  medium: 'max-w-[560px]',
  large: 'max-w-[800px]',
};

function ModalPreview({ id, title, size, children, onViewAsModal }: ModalPreviewProps) {
  return (
    <div className="flex flex-col">
      {/* Preview Header */}
      <div className="flex items-center justify-between mb-2">
        <Text variant="label" color="primary">{title}</Text>
        <button
          onClick={() => onViewAsModal(id)}
          className="text-[12px] text-[#0A78BE] hover:underline flex items-center gap-1"
        >
          <Icon name="Expand" variant="outlined" size={12} />
          View as Modal
        </button>
      </div>
      
      {/* Modal Preview (inline) */}
      <div className={`${sizeWidths[size]} w-full`}>
        <div className="bg-white rounded-[4px] shadow-[0px_8px_24px_4px_rgba(0,0,0,0.1),0px_2px_2px_0px_rgba(0,0,0,0.1)] overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}

// ============================================
// Modal Placeholder Component
// ============================================
interface ModalPlaceholderProps {
  title: string;
  size?: 'small' | 'medium' | 'large';
}

function ModalPlaceholder({ title, size = 'small' }: ModalPlaceholderProps) {
  return (
    <div className={`${sizeWidths[size]} w-full`}>
      <div className="bg-white rounded-[4px] border border-dashed border-[#CBD2D9] p-6 min-h-[150px] flex flex-col items-center justify-center">
        <Icon name="PlusCircle" variant="outlined" size={24} className="text-[#CBD2D9] mb-2" />
        <Text variant="value" color="disabled" className="text-center">
          {title}
        </Text>
      </div>
    </div>
  );
}
