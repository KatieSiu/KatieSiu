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
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/features/ctv/lib/utils";
import { IconButton } from "./Button";

// ============================================
// Context for Modal state
// ============================================
interface ModalContextValue {
  onClose: () => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

const useModalContext = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("Modal components must be used within a Modal");
  }
  return context;
};

// ============================================
// Modal Container
// ============================================
const modalVariants = cva(
  [
    "relative flex flex-col",
    "bg-white rounded-[4px]",
    "shadow-[0px_8px_24px_4px_rgba(0,0,0,0.1),0px_2px_2px_0px_rgba(0,0,0,0.1)]",
    "max-h-[90vh]",
    "overflow-clip",
  ],
  {
    variants: {
      size: {
        small: "w-[400px] max-w-[calc(100vw-80px)]",
        medium: "w-[560px] max-w-[calc(100vw-80px)]",
        large: "w-[calc(100vw-80px)] max-w-[2000px] min-[880px]:min-w-[800px]",
      },
    },
    defaultVariants: {
      size: "medium",
    },
  }
);

interface ModalProps extends VariantProps<typeof modalVariants> {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when modal should close */
  onClose: () => void;
  /** Modal content */
  children: ReactNode;
  /** Close modal when clicking backdrop */
  closeOnBackdropClick?: boolean;
  /** Close modal when pressing Escape key */
  closeOnEscape?: boolean;
  /** Additional className for the modal container */
  className?: string;
}

const ModalRoot = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      isOpen,
      onClose,
      size = "medium",
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

    // Render in portal
    return createPortal(
      <ModalContext.Provider value={{ onClose }}>
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
            className={cn(modalVariants({ size }), className)}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </div>
        </div>
      </ModalContext.Provider>,
      document.body
    );
  }
);

ModalRoot.displayName = "Modal";

// ============================================
// Modal Header
// ============================================
interface ModalHeaderProps extends HTMLAttributes<HTMLDivElement> {
  /** Header title */
  title: string;
  /** Optional description below title */
  description?: string;
  /** Show close button */
  showCloseButton?: boolean;
}

const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(
  ({ className, title, description, showCloseButton = true, children, ...props }, ref) => {
    const { onClose } = useModalContext();

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-start justify-between",
          "pl-4 pr-1 py-0",
          "bg-white",
          "shrink-0",
          className
        )}
        {...props}
      >
        {/* Title and description */}
        <div className="flex-1 flex flex-col justify-center py-4 pr-2 min-w-0">
          <h2 className="text-[16px] font-bold leading-[20px] text-[#1C2B33] font-optimistic truncate">
            {title}
          </h2>
          {description && (
            <p className="text-[14px] font-normal leading-[20px] text-[#465A69] font-optimistic mt-0">
              {description}
            </p>
          )}
        </div>
        
        {/* Actions */}
        <div className="flex items-start gap-2 py-2 pr-1">
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

ModalHeader.displayName = "ModalHeader";

// ============================================
// Modal Body
// ============================================
interface ModalBodyProps extends HTMLAttributes<HTMLDivElement> {}

const ModalBody = forwardRef<HTMLDivElement, ModalBodyProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex-1 overflow-y-auto",
          "px-4 pt-0 pb-2",
          className
        )}
        {...props}
      >
        <div className="text-[14px] font-normal leading-[20px] text-[#1C2B33] font-optimistic">
          {children}
        </div>
      </div>
    );
  }
);

ModalBody.displayName = "ModalBody";

// ============================================
// Modal Footer
// ============================================
interface ModalFooterProps extends HTMLAttributes<HTMLDivElement> {}

const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-end gap-2",
          "px-4 pt-3 pb-4",
          "shrink-0",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ModalFooter.displayName = "ModalFooter";

// ============================================
// Compound Component Export
// ============================================
const Modal = Object.assign(ModalRoot, {
  Header: ModalHeader,
  Body: ModalBody,
  Footer: ModalFooter,
});

export { Modal, modalVariants };
export type { ModalProps, ModalHeaderProps, ModalBodyProps, ModalFooterProps };
