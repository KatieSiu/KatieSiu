"use client";

import { useState, useEffect } from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { colors } from "@/features/campaign-planner/lib/design-tokens";

interface EditNameDescriptionModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when modal should close */
  onClose: () => void;
  /** Callback when save is confirmed */
  onSave: (name: string, description: string) => void;
  /** Current plan name */
  currentName: string;
  /** Current plan description */
  currentDescription: string;
}

export function EditNameDescriptionModal({
  isOpen,
  onClose,
  onSave,
  currentName,
  currentDescription,
}: EditNameDescriptionModalProps) {
  const [name, setName] = useState(currentName);
  const [description, setDescription] = useState(currentDescription);

  // Reset values when modal opens
  useEffect(() => {
    if (isOpen) {
      setName(currentName);
      setDescription(currentDescription);
    }
  }, [isOpen, currentName, currentDescription]);

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim(), description.trim());
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && name.trim()) {
      e.preventDefault();
      handleSave();
    }
  };

  const inputBaseStyles = `
    w-full h-[36px] px-[12px] py-[8px] 
    text-[14px] font-['SF_Pro_Text',sans-serif] 
    rounded-[4px] border outline-none transition-colors 
    focus:border-[#0A78BE] focus:ring-1 focus:ring-[#0A78BE]
  `;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="small">
      <Modal.Header title="Edit name & description" showCloseButton={true} />
      <Modal.Body>
        <div className="flex flex-col gap-[16px] pt-[8px]">
          {/* Name Field */}
          <div className="flex items-center gap-[12px]">
            <label 
              className="font-optimistic font-bold text-[14px] leading-[20px] w-[77px] shrink-0"
              style={{ color: colors.text.heading }}
            >
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              placeholder="Enter plan name"
              className={inputBaseStyles}
              style={{
                color: colors.text.primary,
                borderColor: colors.border.element,
                backgroundColor: colors.background.content,
              }}
            />
          </div>

          {/* Description Field */}
          <div className="flex items-center gap-[12px]">
            <label 
              className="font-optimistic font-bold text-[14px] leading-[20px] w-[77px] shrink-0"
              style={{ color: colors.text.heading }}
            >
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add description..."
              className={inputBaseStyles}
              style={{
                color: colors.text.primary,
                borderColor: colors.border.element,
                backgroundColor: colors.background.content,
              }}
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={!name.trim()}
        >
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
