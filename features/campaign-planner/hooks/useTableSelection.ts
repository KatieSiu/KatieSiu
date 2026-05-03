import { useState, useCallback, useMemo } from "react";

interface UseTableSelectionReturn<T> {
  selectedIds: Set<string>;
  selectedCount: number;
  hasSelection: boolean;
  isSelected: (id: string) => boolean;
  select: (id: string) => void;
  deselect: (id: string) => void;
  toggle: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clearSelection: () => void;
  setSelectedIds: (ids: Set<string>) => void;
  getSelectedItems: (items: T[], getId: (item: T) => string) => T[];
}

export function useTableSelection<T>(): UseTableSelectionReturn<T> {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const selectedCount = selectedIds.size;
  const hasSelection = selectedCount > 0;

  const isSelected = useCallback((id: string) => selectedIds.has(id), [selectedIds]);

  const select = useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const deselect = useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const toggle = useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const selectAll = useCallback((ids: string[]) => {
    setSelectedIds(new Set(ids));
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const getSelectedItems = useCallback((items: T[], getId: (item: T) => string) => {
    return items.filter(item => selectedIds.has(getId(item)));
  }, [selectedIds]);

  return {
    selectedIds,
    selectedCount,
    hasSelection,
    isSelected,
    select,
    deselect,
    toggle,
    selectAll,
    clearSelection,
    setSelectedIds,
    getSelectedItems,
  };
}
