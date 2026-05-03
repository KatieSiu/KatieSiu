"use client";

import {
  forwardRef,
  createContext,
  useContext,
  useEffect,
  useCallback,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "@/features/ctv/lib/utils";
import { IconButton } from "./Button";
import { Stepper, type StepStatus } from "./Stepper";

// ============================================
// Context for WizardModal state
// ============================================
interface WizardModalContextValue {
  onClose: () => void;
  currentStep: number;
  onStepChange: (step: number) => void;
}

const WizardModalContext = createContext<WizardModalContextValue | null>(null);

const useWizardModalContext = () => {
  const context = useContext(WizardModalContext);
  if (!context) {
    throw new Error("WizardModal components must be used within a WizardModal");
  }
  return context;
};

// ============================================
// Step Definition
// ============================================
export interface WizardStep {
  id: string;
  label: string;
  icon?: string;
}

// ============================================
// WizardModal Container
// ============================================
interface WizardModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when modal should close */
  onClose: () => void;
  /** Current step index (0-based) */
  currentStep: number;
  /** Callback when step changes */
  onStepChange: (step: number) => void;
  /** Steps configuration */
  steps: WizardStep[];
  /** Stepper title */
  stepperTitle?: string;
  /** Modal content */
  children: ReactNode;
  /** Close modal when clicking backdrop */
  closeOnBackdropClick?: boolean;
  /** Close modal when pressing Escape key */
  closeOnEscape?: boolean;
  /** Additional className for the modal container */
  className?: string;
}

const WizardModalRoot = forwardRef<HTMLDivElement, WizardModalProps>(
  (
    {
      isOpen,
      onClose,
      currentStep,
      onStepChange,
      steps,
      stepperTitle = "Set up your creative",
      closeOnBackdropClick = true,
      closeOnEscape = true,
      className,
      children,
    },
    ref
  ) => {
    // Handle Escape key
    const handleKeyDown = useCallback(
      (event: KeyboardEvent) => {
        if (closeOnEscape && event.key === "Escape") {
          onClose();
        }
      },
      [closeOnEscape, onClose]
    );

    // Handle backdrop click
    const handleBackdropClick = useCallback(
      (event: React.MouseEvent) => {
        if (closeOnBackdropClick && event.target === event.currentTarget) {
          onClose();
        }
      },
      [closeOnBackdropClick, onClose]
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

    if (!isOpen) return null;

    // Determine step status
    const getStepStatus = (index: number): StepStatus => {
      if (index < currentStep) return "completed";
      if (index === currentStep) return "current";
      return "upcoming";
    };

    // Render in portal
    return createPortal(
      <WizardModalContext.Provider value={{ onClose, currentStep, onStepChange }}>
        {/* Backdrop */}
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={handleBackdropClick}
          aria-hidden="true"
        >
          {/* Modal */}
          <div
            ref={ref}
            role="dialog"
            aria-modal="true"
            className={cn(
              "relative flex",
              "bg-white rounded-[4px]",
              "shadow-[0px_8px_24px_4px_rgba(0,0,0,0.1),0px_2px_2px_0px_rgba(0,0,0,0.1)]",
              "max-h-[90vh]",
              "w-[calc(100vw-80px)] max-w-[1000px]",
              "overflow-hidden",
              className
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Stepper Sidebar */}
            <Stepper
              title={stepperTitle}
              currentStep={currentStep}
              onStepClick={onStepChange}
              className="h-full rounded-tl-[4px]"
            >
              {steps.map((step, index) => (
                <Stepper.Step
                  key={step.id}
                  label={step.label}
                  icon={step.icon}
                  status={getStepStatus(index)}
                  showTopConnector={index > 0}
                  showBottomConnector={index < steps.length - 1}
                  onClick={() => onStepChange(index)}
                />
              ))}
            </Stepper>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-white">
              {children}
            </div>
          </div>
        </div>
      </WizardModalContext.Provider>,
      document.body
    );
  }
);

WizardModalRoot.displayName = "WizardModal";

// ============================================
// WizardModal Header
// ============================================
interface WizardModalHeaderProps extends HTMLAttributes<HTMLDivElement> {
  /** Header title */
  title: string;
  /** Optional description below title */
  description?: string;
  /** Show close button */
  showCloseButton?: boolean;
  /** Optional info icon after title */
  showInfoIcon?: boolean;
}

const WizardModalHeader = forwardRef<HTMLDivElement, WizardModalHeaderProps>(
  ({ className, title, description, showCloseButton = true, showInfoIcon = false, children, ...props }, ref) => {
    const { onClose } = useWizardModalContext();

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-start justify-between",
          "px-4 py-3",
          "bg-white",
          "shrink-0",
          className
        )}
        {...props}
      >
        {/* Title and description */}
        <div className="flex-1 flex flex-col justify-center min-w-0">
          <div className="flex items-center gap-1">
            <h2 className="text-[16px] font-bold leading-[20px] text-[#1C2B33] font-optimistic">
              {title}
            </h2>
            {showInfoIcon && (
              <span className="text-[#465A69] cursor-help">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8zm8-3a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 018 5zm0 8a1 1 0 100-2 1 1 0 000 2z" />
                </svg>
              </span>
            )}
          </div>
          {description && (
            <p className="text-[14px] font-normal leading-[20px] text-[#465A69] font-optimistic mt-0.5">
              {description}
            </p>
          )}
        </div>
        
        {/* Actions */}
        <div className="flex items-start gap-2">
          {children}
          {showCloseButton && (
            <IconButton
              icon="Close"
              iconVariant="outlined"
              variant="flat"
              onClick={onClose}
              aria-label="Close modal"
            />
          )}
        </div>
      </div>
    );
  }
);

WizardModalHeader.displayName = "WizardModalHeader";

// ============================================
// WizardModal Body
// ============================================
interface WizardModalBodyProps extends HTMLAttributes<HTMLDivElement> {
  /** Whether to show the preview panel */
  showPreview?: boolean;
  /** Preview panel content */
  previewContent?: ReactNode;
}

const WizardModalBody = forwardRef<HTMLDivElement, WizardModalBodyProps>(
  ({ className, showPreview, previewContent, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex-1 flex overflow-hidden",
          className
        )}
        {...props}
      >
        {/* Main content */}
        <div className={cn(
          "flex-1 overflow-y-auto",
          "px-4 py-3",
          "bg-[#F5F7F8]",
        )}>
          {children}
        </div>

        {/* Preview panel */}
        {showPreview && previewContent && (
          <div className="w-[275px] shrink-0 border-l border-[#E4E8EB] bg-white p-4 overflow-y-auto">
            {previewContent}
          </div>
        )}
      </div>
    );
  }
);

WizardModalBody.displayName = "WizardModalBody";

// ============================================
// WizardModal Footer
// ============================================
interface WizardModalFooterProps extends HTMLAttributes<HTMLDivElement> {}

const WizardModalFooter = forwardRef<HTMLDivElement, WizardModalFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "shrink-0",
          "border-t border-[#E4E8EB]",
          "bg-white",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

WizardModalFooter.displayName = "WizardModalFooter";

// ============================================
// Compound Component Export
// ============================================
const WizardModal = Object.assign(WizardModalRoot, {
  Header: WizardModalHeader,
  Body: WizardModalBody,
  Footer: WizardModalFooter,
});

export { WizardModal, useWizardModalContext };
export type { WizardModalProps, WizardModalHeaderProps, WizardModalBodyProps, WizardModalFooterProps };
