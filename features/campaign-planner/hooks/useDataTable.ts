import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { flushSync } from "react-dom";

// ============================================
// COLUMN RESIZE CONSTANTS
// ============================================
const COLUMN_MIN_WIDTH = 75;
const COLUMN_MAX_WIDTH = 300;
const COLUMN_GRID_SNAP = 10;
const STORAGE_KEY = "datatable-column-widths";

// ============================================
// TYPES
// ============================================

export type ColumnWidths = Record<string, number>;

export interface SortState {
  column: string | null;
  direction: "asc" | "desc";
}

export interface UseDataTableOptions {
  tableId?: string;
  defaultSortColumn?: string | null;
  defaultSortDirection?: "asc" | "desc";
}

export interface UseDataTableReturn<T> {
  // Selection
  checkedIds: Set<string>;
  setCheckedIds: (ids: Set<string>) => void;
  isChecked: (id: string) => boolean;
  toggleChecked: (id: string) => void;
  checkAll: (ids: string[]) => void;
  uncheckAll: () => void;
  checkedCount: number;
  hasChecked: boolean;
  
  // Sorting
  sortColumn: string | null;
  sortDirection: "asc" | "desc";
  handleSort: (columnId: string) => void;
  sortData: (data: T[], getKey: (item: T, columnId: string) => any) => T[];
  
  // Column widths
  columnWidths: ColumnWidths;
  handleColumnResize: (columnId: string, width: number) => void;
  handleResetColumnWidth: (columnId: string) => void;
  snapshotColumnWidths: (columnElements: NodeListOf<Element>) => void;
  
  // Expansion
  expandedIds: Set<string>;
  setExpandedIds: (ids: Set<string>) => void;
  isExpanded: (id: string) => boolean;
  toggleExpanded: (id: string) => void;
  expandAll: (ids: string[]) => void;
  collapseAll: () => void;
  
  // Editing
  editingCell: { itemId: string; columnId: string } | null;
  setEditingCell: (cell: { itemId: string; columnId: string } | null) => void;
  isEditing: (itemId: string, columnId: string) => boolean;
  startEdit: (itemId: string, columnId: string) => void;
  cancelEdit: () => void;
}

// ============================================
// HOOK IMPLEMENTATION
// ============================================

export function useDataTable<T>(options: UseDataTableOptions = {}): UseDataTableReturn<T> {
  const {
    tableId = "default",
    defaultSortColumn = null,
    defaultSortDirection = "desc",
  } = options;

  // Selection state
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
  
  // Sort state
  const [sortColumn, setSortColumn] = useState<string | null>(defaultSortColumn);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">(defaultSortDirection);
  
  // Column widths state
  const [columnWidths, setColumnWidths] = useState<ColumnWidths>({});
  const columnWidthsRef = useRef<ColumnWidths>({});
  const storageKey = `${STORAGE_KEY}-${tableId}`;
  
  // Expansion state
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  
  // Editing state
  const [editingCell, setEditingCell] = useState<{ itemId: string; columnId: string } | null>(null);

  // ============================================
  // SELECTION HANDLERS
  // ============================================
  
  const isChecked = useCallback((id: string) => checkedIds.has(id), [checkedIds]);
  
  const toggleChecked = useCallback((id: string) => {
    setCheckedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);
  
  const checkAll = useCallback((ids: string[]) => {
    setCheckedIds(new Set(ids));
  }, []);
  
  const uncheckAll = useCallback(() => {
    setCheckedIds(new Set());
  }, []);
  
  const checkedCount = checkedIds.size;
  const hasChecked = checkedCount > 0;

  // ============================================
  // SORT HANDLERS
  // ============================================
  
  const handleSort = useCallback((columnId: string) => {
    if (sortColumn === columnId) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnId);
      setSortDirection("desc");
    }
  }, [sortColumn]);
  
  const sortData = useCallback((data: T[], getKey: (item: T, columnId: string) => any): T[] => {
    if (!sortColumn) return data;
    
    return [...data].sort((a, b) => {
      const aVal = getKey(a, sortColumn);
      const bVal = getKey(b, sortColumn);
      
      let comparison = 0;
      if (aVal instanceof Date && bVal instanceof Date) {
        comparison = aVal.getTime() - bVal.getTime();
      } else if (typeof aVal === "number" && typeof bVal === "number") {
        comparison = aVal - bVal;
      } else {
        comparison = String(aVal).localeCompare(String(bVal));
      }
      
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [sortColumn, sortDirection]);

  // ============================================
  // COLUMN RESIZE HANDLERS
  // ============================================
  
  // Keep ref in sync with state
  useEffect(() => {
    columnWidthsRef.current = columnWidths;
  }, [columnWidths]);

  // Load widths from sessionStorage on mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(storageKey);
      if (stored) {
        const parsedWidths = JSON.parse(stored);
        setColumnWidths(parsedWidths);
        columnWidthsRef.current = parsedWidths;
      }
    } catch (e) {
      // Ignore storage errors
    }
  }, [storageKey]);

  const saveWidths = useCallback((widths: ColumnWidths) => {
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(widths));
    } catch (e) {
      // Ignore storage errors
    }
  }, [storageKey]);

  const snapshotColumnWidths = useCallback((columnElements: NodeListOf<Element>) => {
    const newWidths = { ...columnWidthsRef.current };
    let hasNewWidths = false;
    
    columnElements.forEach((el) => {
      const columnId = el.getAttribute("data-column-id");
      if (columnId && !newWidths[columnId]) {
        newWidths[columnId] = (el as HTMLElement).offsetWidth;
        hasNewWidths = true;
      }
    });
    
    if (hasNewWidths) {
      columnWidthsRef.current = newWidths;
      flushSync(() => {
        setColumnWidths(newWidths);
      });
      saveWidths(newWidths);
    }
  }, [saveWidths]);

  const handleColumnResize = useCallback((columnId: string, width: number) => {
    const snappedWidth = Math.round(width / COLUMN_GRID_SNAP) * COLUMN_GRID_SNAP;
    const clampedWidth = Math.min(COLUMN_MAX_WIDTH, Math.max(COLUMN_MIN_WIDTH, snappedWidth));
    
    const newWidths = { ...columnWidthsRef.current, [columnId]: clampedWidth };
    columnWidthsRef.current = newWidths;
    
    setColumnWidths(newWidths);
    saveWidths(newWidths);
  }, [saveWidths]);

  const handleResetColumnWidth = useCallback((columnId: string) => {
    const newWidths = { ...columnWidthsRef.current };
    delete newWidths[columnId];
    columnWidthsRef.current = newWidths;
    
    setColumnWidths(newWidths);
    saveWidths(newWidths);
  }, [saveWidths]);

  // ============================================
  // EXPANSION HANDLERS
  // ============================================
  
  const isExpanded = useCallback((id: string) => expandedIds.has(id), [expandedIds]);
  
  const toggleExpanded = useCallback((id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);
  
  const expandAll = useCallback((ids: string[]) => {
    setExpandedIds(new Set(ids));
  }, []);
  
  const collapseAll = useCallback(() => {
    setExpandedIds(new Set());
  }, []);

  // ============================================
  // EDITING HANDLERS
  // ============================================
  
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

  return {
    // Selection
    checkedIds,
    setCheckedIds,
    isChecked,
    toggleChecked,
    checkAll,
    uncheckAll,
    checkedCount,
    hasChecked,
    
    // Sorting
    sortColumn,
    sortDirection,
    handleSort,
    sortData,
    
    // Column widths
    columnWidths,
    handleColumnResize,
    handleResetColumnWidth,
    snapshotColumnWidths,
    
    // Expansion
    expandedIds,
    setExpandedIds,
    isExpanded,
    toggleExpanded,
    expandAll,
    collapseAll,
    
    // Editing
    editingCell,
    setEditingCell,
    isEditing,
    startEdit,
    cancelEdit,
  };
}
