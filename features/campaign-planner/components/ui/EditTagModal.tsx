"use client";

import React, { useState, useEffect, useRef } from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";

export interface EditTagModalProps {
  /** The current tag name to edit */
  tagName: string;
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when modal is closed */
  onClose: () => void;
  /** Callback when tag is saved with new name */
  onSave: (oldName: string, newName: string) => void;
}

export function EditTagModal({
  tagName,
  isOpen,
  onClose,
  onSave,
}: EditTagModalProps) {
  const [newName, setNewName] = useState(tagName);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset input when modal opens with new tag
  useEffect(() => {
    if (isOpen) {
      setNewName(tagName);
      // Focus input after modal opens
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 0);
    }
  }, [isOpen, tagName]);

  const handleSave = () => {
    const trimmedName = newName.trim();
    if (trimmedName && trimmedName !== tagName) {
      onSave(tagName, trimmedName);
    }
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="small">
      <Modal.Header title="Rename tag" showCloseButton={true} />
      <Modal.Body>
        <div>
          <label className="block text-[14px] font-medium font-optimistic text-[#1C2B33] mb-2">
            Name
          </label>
          <input
            ref={inputRef}
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full px-3 py-2.5 text-[14px] font-optimistic text-[#1C2B33] border border-[#CBD2D9] rounded-[4px] outline-none focus:border-[#0A78BE] focus:ring-1 focus:ring-[#0A78BE] transition-colors"
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSave}
          disabled={!newName.trim() || newName.trim() === tagName}
        >
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
