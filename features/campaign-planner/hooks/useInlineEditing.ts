import { useState, useCallback } from "react";

interface EditingCell {
  itemId: string;
  columnId: string;
}

interface UseInlineEditingReturn {
  editingCell: EditingCell | null;
  isEditing: (itemId: string, columnId: string) => boolean;
  startEdit: (itemId: string, columnId: string) => void;
  cancelEdit: () => void;
  clearEditingCell: () => void;
  setEditingCell: (cell: EditingCell | null) => void;
}

export function useInlineEditing(): UseInlineEditingReturn {
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null);

  const isEditing = useCallback(
    (itemId: string, columnId: string) => 
      editingCell?.itemId === itemId && editingCell?.columnId === columnId,
    [editingCell]
  );

  const startEdit = useCallback((itemId: string, columnId: string) => {
    setEditingCell({ itemId, columnId });
  }, []);

  const cancelEdit = useCallback(() => {
    setEditingCell(null);
  }, []);

  const clearEditingCell = useCallback(() => {
    setEditingCell(null);
  }, []);

  return {
    editingCell,
    isEditing,
    startEdit,
    cancelEdit,
    clearEditingCell,
    setEditingCell,
  };
}
