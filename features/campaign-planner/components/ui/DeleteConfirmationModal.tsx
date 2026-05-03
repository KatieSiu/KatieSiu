"use client";

import { Modal } from "./Modal";
import { Button } from "./Button";

interface DeleteConfirmationModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when modal should close */
  onClose: () => void;
  /** Callback when delete is confirmed */
  onConfirm: () => void;
  /** Number of items being deleted */
  itemCount: number;
  /** Type of item being deleted - affects the text shown */
  itemType?: "campaign" | "plan" | "ad set";
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  itemCount,
  itemType = "campaign",
}: DeleteConfirmationModalProps) {
  // Dynamic text based on item count and item type
  const isSingle = itemCount === 1;
  
  // Generate appropriate article ("the" for singular, count for plural)
  const itemArticle = isSingle ? "the" : `${itemCount}`;
  
  // Generate singular/plural item name
  const itemName = isSingle ? itemType : `${itemType}s`;
  
  // Build title and body text
  const title = isSingle
    ? `Do you want to delete ${itemArticle} ${itemName}?`
    : `Do you want to delete ${itemArticle} ${itemName}?`;
  const bodyText = isSingle
    ? `If you delete this ${itemType}, you won't be able to recover it later.`
    : `If you delete these ${itemName}, you won't be able to recover them later.`;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="small">
      <Modal.Header title={title} showCloseButton={true} />
      <Modal.Body>
        <p>{bodyText}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleConfirm}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

