"use client";

import { useState, useEffect } from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { colors } from "@/features/campaign-planner/lib/design-tokens";

interface DuplicatePlanModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when modal should close */
  onClose: () => void;
  /** Callback when duplicate is confirmed with the new name */
  onConfirm: (newName: string) => void;
  /** Current plan name to pre-fill the input */
  currentPlanName: string;
}

export function DuplicatePlanModal({
  isOpen,
  onClose,
  onConfirm,
  currentPlanName,
}: DuplicatePlanModalProps) {
  // Initialize with current plan name + (Copy)
  const [planName, setPlanName] = useState(`${currentPlanName} (Copy)`);

  // Reset the name when modal opens with a new plan name
  useEffect(() => {
    if (isOpen) {
      setPlanName(`${currentPlanName} (Copy)`);
    }
  }, [isOpen, currentPlanName]);

  const handleConfirm = () => {
    if (planName.trim()) {
      onConfirm(planName.trim());
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && planName.trim()) {
      handleConfirm();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="small">
      <Modal.Header title="Duplicate Plan" showCloseButton={true} />
      <Modal.Body>
        <div className="flex flex-col gap-[10px]">
          <p
            className="font-optimistic text-[14px] leading-[20px]"
            style={{ color: colors.text.primary }}
          >
            Give your new plan a name.
          </p>
          <input
            type="text"
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            className="w-full h-[36px] px-[12px] py-[8px] text-[14px] font-['SF_Pro_Text',sans-serif] rounded-[4px] border outline-none transition-colors focus:border-[#0A78BE] focus:ring-1 focus:ring-[#0A78BE]"
            style={{
              color: colors.text.primary,
              borderColor: colors.border.element,
              backgroundColor: colors.background.content,
            }}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleConfirm}
          disabled={!planName.trim()}
        >
          Duplicate
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
