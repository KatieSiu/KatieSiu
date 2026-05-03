"use client";

import { Modal } from "./Modal";
import { Button } from "./Button";

export interface DeleteTagModalProps {
  /** The tag name to delete */
  tagName: string;
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when modal is closed */
  onClose: () => void;
  /** Callback when delete is confirmed */
  onDelete: (tagName: string) => void;
}

export function DeleteTagModal({
  tagName,
  isOpen,
  onClose,
  onDelete,
}: DeleteTagModalProps) {
  const handleDelete = () => {
    onDelete(tagName);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="small">
      <Modal.Header title="Delete tag?" showCloseButton={true} />
      <Modal.Body>
        <p>Removing this tag will delete it from your list and all plans where it is applied.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleDelete}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
