"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { createPortal, flushSync } from "react-dom";
import { Icon } from "./Icon";
import { Dropdown } from "./Dropdown";
import { TruncatedText } from "./TruncatedText";

// ============================================
// COLUMN RESIZE CONSTANTS
// ============================================

const COLUMN_MIN_WIDTH = 75;
const COLUMN_MAX_WIDTH = 300;
const COLUMN_GRID_SNAP = 10; // Snap to 10px increments
const STORAGE_KEY = "datatable-column-widths";

// ============================================
// TYPES & INTERFACES
// ============================================

/** Column widths stored by column ID */
export type ColumnWidths = Record<string, number>;

/** Column configuration for the data table */
export interface ColumnConfig<T> {
  /** Unique identifier for the column */
  id: string;
  /** Display label for the column header */
  label: string;
  /** Whether the column is sortable */
  sortable?: boolean;
  /** Whether the column is editable inline */
  editable?: boolean;
  /** Minimum width to expand to when editing (in pixels) - column temporarily expands while editing */
  editMinWidth?: number;
  /** Whether to show an info icon next to the column header */
  hasInfoIcon?: boolean;
  /** Tooltip text for the info icon */
  infoTooltip?: string;
  /** Custom render function for the cell content */
  render?: (item: T, isEditing: boolean, editProps: EditProps) => React.ReactNode;
}

/** Props passed to editable cells */
export interface EditProps {
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  /** Callback to start editing this cell */
  onStartEdit: () => void;
}

/** Action item for the overflow menu */
export interface RowAction<T> {
  /** Display label for the action */
  label: string;
  /** Icon name from the Icon component */
  icon?: string;
  /** Click handler receiving the row item */
  onClick: (item: T) => void;
  /** Whether to show a divider before this action */
  dividerBefore?: boolean;
}

/** Props for DataTableRow */
export interface DataTableRowProps<T> {
  /** The data item for this row */
  item: T;
  /** Unique identifier for the item (used for keys and tracking) */
  itemId: string;
  /** Column configurations */
  columns: ColumnConfig<T>[];
  /** Which columns are currently visible */
  visibleColumns: string[];
  /** Minimum column width in pixels */
  minColumnWidth?: number;
  /** Whether to show the checkbox */
  showCheckbox?: boolean;
  /** Whether this row's checkbox is checked */
  isChecked?: boolean;
  /** Callback when checkbox changes */
  onCheckChange?: (checked: boolean) => void;
  /** Whether this row is in active/selected state */
  isActive?: boolean;
  /** Callback to activate this row */
  onActivate?: () => void;
  /** Callback to deactivate this row */
  onDeactivate?: () => void;
  /** Whether to show the overflow actions menu */
  showActions?: boolean;
  /** Actions for the overflow menu */
  actions?: RowAction<T>[];
  /** Currently editing cell info */
  editingCell?: { itemId: string; columnId: string } | null;
  /** Callback when starting to edit a cell */
  onStartEdit?: (itemId: string, columnId: string) => void;
  /** Callback when saving an edit */
  onSaveEdit?: (itemId: string, columnId: string, value: string) => void;
  /** Callback when canceling an edit */
  onCancelEdit?: () => void;
  /** Whether this is the last row (no bottom border) */
  isLastRow?: boolean;
  /** Custom class name */
  className?: string;
  /** Callback when row is clicked (not on interactive elements) */
  onRowClick?: (item: T) => void;
  /** Whether the row is expandable */
  expandable?: boolean;
  /** Whether the row is currently expanded */
  isExpanded?: boolean;
  /** Callback when expand/collapse is toggled */
  onToggleExpand?: () => void;
  /** Content to render when row is expanded */
  expandedContent?: React.ReactNode;
}

/** Props for DataTableHeader */
export interface DataTableHeaderProps<T> {
  /** Column configurations */
  columns: ColumnConfig<T>[];
  /** Which columns are currently visible */
  visibleColumns: string[];
  /** Minimum column width in pixels */
  minColumnWidth?: number;
  /** Whether to show the checkbox */
  showCheckbox?: boolean;
  /** Whether all rows are checked */
  allChecked?: boolean;
  /** Callback when check all changes */
  onCheckAll?: (checked: boolean) => void;
  /** Current sort column */
  sortColumn?: string | null;
  /** Current sort direction */
  sortDirection?: "asc" | "desc";
  /** Callback when sort changes */
  onSort?: (columnId: string) => void;
  /** Whether to show the actions column spacer */
  showActions?: boolean;
  /** Whether the header should stick to the top when scrolling */
  sticky?: boolean;
  /** Whether the table is scrolled (for showing shadow) */
  isScrolled?: boolean;
  /** Custom background color (Tailwind class or arbitrary value) */
  backgroundColor?: string;
  /** Custom class name */
  className?: string;
  /** Whether columns are resizable */
  resizable?: boolean;
  /** Custom column widths by column ID */
  columnWidths?: ColumnWidths;
  /** Callback when column width changes */
  onColumnResize?: (columnId: string, width: number) => void;
  /** Callback when column width is reset (double-click) */
  onColumnResetWidth?: (columnId: string) => void;
  /** Callback when resize starts to snapshot all column widths */
  onResizeStart?: (columnElements: NodeListOf<Element>) => void;
}

/** Footer row cell configuration */
export interface FooterCell {
  /** Column ID this cell belongs to */
  columnId: string;
  /** Content to render in the cell */
  content: React.ReactNode;
}

/** Props for DataTable container */
export interface DataTableProps<T> {
  /** Data items to display */
  data: T[];
  /** Function to get unique ID from an item */
  getItemId: (item: T) => string;
  /** Column configurations */
  columns: ColumnConfig<T>[];
  /** Which columns are currently visible */
  visibleColumns: string[];
  /** Minimum column width in pixels */
  minColumnWidth?: number;
  /** Whether to show checkboxes */
  showCheckbox?: boolean;
  /** Set of checked item IDs */
  checkedItems?: Set<string>;
  /** Callback when checked items change */
  onCheckedItemsChange?: (items: Set<string>) => void;
  /** Current sort column */
  sortColumn?: string | null;
  /** Current sort direction */
  sortDirection?: "asc" | "desc";
  /** Callback when sort changes */
  onSort?: (columnId: string) => void;
  /** Whether to show the overflow actions menu */
  showActions?: boolean;
  /** Actions for the overflow menu */
  actions?: RowAction<T>[];
  /** Currently editing cell info */
  editingCell?: { itemId: string; columnId: string } | null;
  /** Callback when starting to edit a cell */
  onStartEdit?: (itemId: string, columnId: string) => void;
  /** Callback when saving an edit */
  onSaveEdit?: (itemId: string, columnId: string, value: string) => void;
  /** Callback when canceling an edit */
  onCancelEdit?: () => void;
  /** Custom class name for the container */
  className?: string;
  /** Empty state content */
  emptyState?: React.ReactNode;
  /** Whether columns are resizable */
  resizable?: boolean;
  /** Unique ID for this table (used for storing column widths) */
  tableId?: string;
  /** Callback when a row is clicked (not on interactive elements like checkbox, actions, or editable cells) */
  onRowClick?: (item: T) => void;
  /** Footer row cells - renders a summary/total row at the bottom that follows column widths */
  footerCells?: FooterCell[];
  /** Custom background color for footer row */
  footerBackground?: string;
  /** Whether rows are expandable */
  expandable?: boolean;
  /** Set of expanded item IDs */
  expandedItems?: Set<string>;
  /** Callback when expanded items change */
  onExpandedItemsChange?: (items: Set<string>) => void;
  /** Function to render expanded content for a row */
  renderExpandedContent?: (item: T) => React.ReactNode;
}

// ============================================
// DEFAULT VALUES
// ============================================

const DEFAULT_MIN_COLUMN_WIDTH = 110;

// ============================================
// COLUMN RESIZE HOOK
// ============================================

/** Hook for managing column resize state and persistence */
function useColumnResize(tableId: string = "default") {
  const [columnWidths, setColumnWidths] = useState<ColumnWidths>({});
  // Ref for immediate synchronous access during resize operations
  const columnWidthsRef = useRef<ColumnWidths>({});
  const storageKey = `${STORAGE_KEY}-${tableId}`;

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

  // Save widths to sessionStorage when they change
  const saveWidths = useCallback((widths: ColumnWidths) => {
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(widths));
    } catch (e) {
      // Ignore storage errors
    }
  }, [storageKey]);

  // Snapshot all column widths - called when resize starts
  // This ensures all columns become fixed-width so only the resized column changes
  // Uses flushSync for IMMEDIATE synchronous state update before drag begins
  const snapshotColumnWidths = useCallback((columnElements: NodeListOf<Element>) => {
    const newWidths = { ...columnWidthsRef.current };
    let hasNewWidths = false;
    
    columnElements.forEach((el) => {
      const columnId = el.getAttribute('data-column-id');
      if (columnId && !newWidths[columnId]) {
        // Capture current rendered width for columns that don't have a stored width
        newWidths[columnId] = (el as HTMLElement).offsetWidth;
        hasNewWidths = true;
      }
    });
    
    if (hasNewWidths) {
      // Update ref immediately
      columnWidthsRef.current = newWidths;
      // Use flushSync to force synchronous state update and re-render
      // This ensures all columns have fixed widths BEFORE drag calculations begin
      flushSync(() => {
        setColumnWidths(newWidths);
      });
      saveWidths(newWidths);
    }
  }, [saveWidths]);

  // Handle column resize with grid snapping
  const handleColumnResize = useCallback((columnId: string, width: number) => {
    // Snap to grid
    const snappedWidth = Math.round(width / COLUMN_GRID_SNAP) * COLUMN_GRID_SNAP;
    // Clamp to min/max
    const clampedWidth = Math.min(COLUMN_MAX_WIDTH, Math.max(COLUMN_MIN_WIDTH, snappedWidth));
    
    // Update ref immediately
    const newWidths = { ...columnWidthsRef.current, [columnId]: clampedWidth };
    columnWidthsRef.current = newWidths;
    
    // Update state - no flushSync needed here since we want smooth drag performance
    setColumnWidths(newWidths);
    saveWidths(newWidths);
  }, [saveWidths]);

  // Reset a single column to default (remove from stored widths)
  const handleResetColumnWidth = useCallback((columnId: string) => {
    const newWidths = { ...columnWidthsRef.current };
    delete newWidths[columnId];
    columnWidthsRef.current = newWidths;
    
    setColumnWidths(newWidths);
    saveWidths(newWidths);
  }, [saveWidths]);

  return {
    columnWidths,
    handleColumnResize,
    handleResetColumnWidth,
    snapshotColumnWidths,
  };
}

// ============================================
// COLUMN RESIZE HANDLE COMPONENT
// ============================================

interface ResizeHandleProps {
  columnId: string;
  onResize: (columnId: string, width: number) => void;
  onResetWidth: (columnId: string) => void;
  onResizeStart?: (columnElements: NodeListOf<Element>) => void;
}

function ResizeHandle({ columnId, onResize, onResetWidth, onResizeStart }: ResizeHandleProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [indicatorPosition, setIndicatorPosition] = useState<{ x: number; top: number; height: number } | null>(null);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);
  const columnRef = useRef<HTMLElement | null>(null);
  const tableRef = useRef<HTMLElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const handleRef = useRef<HTMLDivElement | null>(null);

  // Calculate and update indicator position
  const updateIndicatorPosition = useCallback((xPosition?: number) => {
    const handleElement = handleRef.current;
    if (!handleElement) return;
    
    const columnElement = handleElement.closest('[data-column-id]') as HTMLElement;
    if (!columnElement) return;
    
    // Find the main table grid container (not the subgrid header)
    const tableContainer = columnElement.closest('[data-table-grid]') as HTMLElement;
    if (!tableContainer) return;
    
    tableRef.current = tableContainer;
    const tableRect = tableContainer.getBoundingClientRect();
    const columnRect = columnElement.getBoundingClientRect();
    
    setIndicatorPosition({
      x: xPosition ?? columnRect.right,
      top: tableRect.top,
      height: tableRect.height,
    });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
    updateIndicatorPosition();
  }, [updateIndicatorPosition]);

  const handleMouseLeave = useCallback(() => {
    if (!isDragging) {
      setIsHovering(false);
      setIndicatorPosition(null);
    }
  }, [isDragging]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Find the parent column element to get its current width
    const columnElement = (e.target as HTMLElement).closest('[data-column-id]') as HTMLElement;
    if (!columnElement) return;
    
    // Find the main table grid container (not the subgrid header)
    const tableContainer = columnElement.closest('[data-table-grid]') as HTMLElement;
    tableRef.current = tableContainer;
    
    // Snapshot all column widths before starting resize
    // This ensures all columns become fixed-width so only the resized column changes
    if (tableContainer && onResizeStart) {
      const allColumns = tableContainer.querySelectorAll('[data-column-id]');
      onResizeStart(allColumns);
    }
    
    columnRef.current = columnElement;
    startXRef.current = e.clientX;
    startWidthRef.current = columnElement.offsetWidth;
    setIsDragging(true);
    
    // Prevent text selection during drag
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';
  }, [onResizeStart]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      
      rafRef.current = requestAnimationFrame(() => {
        const delta = e.clientX - startXRef.current;
        const newWidth = startWidthRef.current + delta;
        onResize(columnId, newWidth);
        
        // Calculate the constrained indicator position within min/max bounds
        const columnElement = columnRef.current;
        if (columnElement) {
          const columnRect = columnElement.getBoundingClientRect();
          const columnLeft = columnRect.left;
          
          // Calculate min and max X positions based on column constraints
          const minX = columnLeft + COLUMN_MIN_WIDTH;
          const maxX = columnLeft + COLUMN_MAX_WIDTH;
          
          // Clamp the indicator position to stay within bounds
          const clampedX = Math.min(maxX, Math.max(minX, e.clientX));
          updateIndicatorPosition(clampedX);
        } else {
          updateIndicatorPosition(e.clientX);
        }
      });
    };

    const handleMouseUp = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      setIsDragging(false);
      setIsHovering(false);
      setIndicatorPosition(null);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isDragging, columnId, onResize, updateIndicatorPosition]);

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onResetWidth(columnId);
  }, [columnId, onResetWidth]);

  // Show indicator on hover or while dragging
  const showIndicator = (isHovering || isDragging) && indicatorPosition;

  return (
    <>
      {/* Resize handle - invisible but interactive */}
      <div
        ref={handleRef}
        className="absolute top-0 right-0 w-2 h-full cursor-col-resize z-10"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
      />
      {/* Visual indicator line - shown on hover and while dragging */}
      {showIndicator && typeof document !== 'undefined' && createPortal(
        <div 
          className="fixed w-[2px] bg-[#0A78BE] z-50 pointer-events-none"
          style={{
            left: indicatorPosition.x,
            top: indicatorPosition.top,
            height: indicatorPosition.height,
          }}
        />,
        document.body
      )}
    </>
  );
}

// ============================================
// DATA TABLE ROW COMPONENT
// ============================================

// Inner component (not exported directly)
function DataTableRowInner<T>({
  item,
  itemId,
  columns,
  visibleColumns,
  minColumnWidth = DEFAULT_MIN_COLUMN_WIDTH,
  showCheckbox = true,
  isChecked = false,
  onCheckChange,
  isActive = false,
  onActivate,
  onDeactivate,
  showActions = true,
  actions = [],
  editingCell,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  isLastRow = false,
  className = "",
  onRowClick,
  expandable = false,
  isExpanded = false,
  onToggleExpand,
  expandedContent,
}: DataTableRowProps<T>) {
  const [editValue, setEditValue] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Check if a specific cell is being edited
  const isEditing = (columnId: string) =>
    editingCell?.itemId === itemId && editingCell?.columnId === columnId;

  // Handle starting edit on a cell
  const handleStartEdit = (columnId: string, currentValue: string) => {
    setEditValue(currentValue);
    onStartEdit?.(itemId, columnId);
    onActivate?.();
  };

  // Handle keyboard events during edit
  const handleKeyDown = (e: React.KeyboardEvent, columnId: string) => {
    if (e.key === "Enter") {
      onSaveEdit?.(itemId, columnId, editValue);
      onDeactivate?.();
    } else if (e.key === "Escape") {
      onCancelEdit?.();
      onDeactivate?.();
    }
  };

  // Handle saving edit on blur
  const handleSaveEdit = (columnId: string) => {
    onSaveEdit?.(itemId, columnId, editValue);
    onDeactivate?.();
  };

  // Row background based on state (checked rows are also active)
  const getRowBackground = () => {
    if (isActive || isDropdownOpen || isChecked) {
      return "bg-[rgba(0,0,0,0.1)]";
    }
    return "bg-white";
  };

  // Row hover background
  const getRowHoverBackground = () => {
    if (isActive || isDropdownOpen || isChecked) {
      return "hover:bg-[rgba(0,0,0,0.12)]";
    }
    return "hover:bg-[rgba(0,0,0,0.05)]";
  };

  // Handle checkbox change - checked rows stay active
  const handleCheckboxChange = (checked: boolean) => {
    onCheckChange?.(checked);
    // Don't deactivate when unchecking - let the parent handle active state
  };

  // Handle dropdown toggle
  const handleDropdownToggle = () => {
    if (!isDropdownOpen) {
      setIsDropdownOpen(true);
      onActivate?.();
    }
  };

  // Handle dropdown close
  const handleDropdownClose = () => {
    setIsDropdownOpen(false);
    onDeactivate?.();
  };

  // Handle row click - navigate only if clicking on non-interactive area
  const handleRowClick = (e: React.MouseEvent) => {
    if (!onRowClick) return;
    
    const target = e.target as HTMLElement;
    
    // Check if click is on an interactive element
    // 1. Checkbox area
    if (target.closest('[data-checkbox-cell]')) return;
    // 2. Actions/overflow menu area
    if (target.closest('[data-actions-cell]')) return;
    // 3. Any button or input (catches edit inputs, checkboxes, overflow buttons)
    if (target.closest('button, input, [role="button"]')) return;
    // 4. Dropdown elements
    if (target.closest('[data-dropdown]')) return;
    // 5. Inline edit triggers (specific clickable text elements)
    if (target.closest('[data-inline-edit]')) return;
    
    // If we passed all checks, trigger the row click
    onRowClick(item);
  };

  // Get visible data columns in the order specified by columns array (from createCampaignColumns)
  // This maintains consistent column ordering based on the defined config
  const visibleDataColumns = columns.filter(
    (col) =>
      visibleColumns.includes(col.id) &&
      col.id !== "select" &&
      col.id !== "actions"
  );

  // Determine background and hover classes
  const bgClass = getRowBackground();
  const hoverClass = getRowHoverBackground();
  // Don't show bottom border if expanded (the expanded content will have its own border)
  const borderClass = (isLastRow || (expandable && isExpanded)) ? '' : 'border-b border-[rgba(0,0,0,0.1)]';

  // Row uses subgrid to span all columns while supporting row-level hover
  // Add cursor-pointer when onRowClick is provided
  const cursorClass = onRowClick ? 'cursor-pointer' : '';
  
  // For expanded rows, we need a wrapper to handle hover state for both row and expanded content
  // The wrapper uses group class so children can respond to hover
  const isExpandedRow = expandable && isExpanded && expandedContent;
  
  const rowContent = (
    <div 
      className={`grid col-span-full transition-colors ${isExpandedRow ? '' : bgClass} ${isExpandedRow ? '' : hoverClass} ${isExpandedRow ? '' : borderClass} ${cursorClass} ${className} ${isExpandedRow ? 'bg-transparent' : ''}`}
      style={{ gridTemplateColumns: 'subgrid' }}
      onClick={handleRowClick}
    >
      {/* Checkbox */}
      {showCheckbox && (
        <div data-checkbox-cell className="flex items-center justify-center py-2 pl-2 pr-2">
          <button
            type="button"
            onClick={() => handleCheckboxChange(!isChecked)}
            className="shrink-0 w-6 h-6 flex items-center justify-center bg-white border border-[#CBD2D9] rounded-[4px] cursor-pointer hover:border-[#0A78BE] transition-colors"
            aria-checked={isChecked}
            role="checkbox"
          >
            {isChecked && (
              <Icon
                name="Check"
                variant="filled"
                size={16}
                className="text-[#0A78BE]"
              />
            )}
          </button>
        </div>
      )}

      {/* Data cells */}
      {visibleDataColumns.map((column) => {
        const isEditingThis = isEditing(column.id);

        // Edit props for custom renderers
        const editProps: EditProps = {
          value: editValue,
          onChange: setEditValue,
          onSave: () => handleSaveEdit(column.id),
          onCancel: () => {
            onCancelEdit?.();
            onDeactivate?.();
          },
          onKeyDown: (e) => handleKeyDown(e, column.id),
          onStartEdit: () => {
            if (column.editable) {
              const rawValue = (item as Record<string, unknown>)[column.id];
              let currentValue: string;
              
              // Handle schedule column specially - look for scheduleStartDate and scheduleEndDate
              if (column.id === 'schedule') {
                const itemRecord = item as Record<string, unknown>;
                const startDate = itemRecord.scheduleStartDate as Date | undefined;
                const endDate = itemRecord.scheduleEndDate as Date | undefined;
                
                if (startDate && endDate) {
                  const formatDateForInput = (date: Date) => {
                    const d = new Date(date);
                    const month = String(d.getMonth() + 1).padStart(2, '0');
                    const day = String(d.getDate()).padStart(2, '0');
                    const year = d.getFullYear();
                    return `${month}/${day}/${year}`;
                  };
                  currentValue = `${formatDateForInput(startDate)}|${formatDateForInput(endDate)}`;
                } else {
                  currentValue = '';
                }
              }
              // Handle schedule objects specially (convert to "YYYY-MM-DD|YYYY-MM-DD" format)
              else if (rawValue && typeof rawValue === 'object' && 'startDate' in rawValue && 'endDate' in rawValue) {
                const schedule = rawValue as { startDate: Date; endDate: Date };
                const formatDateForInput = (date: Date) => {
                  const d = new Date(date);
                  return d.toISOString().split('T')[0];
                };
                currentValue = `${formatDateForInput(schedule.startDate)}|${formatDateForInput(schedule.endDate)}`;
              } 
              // Handle numeric values with decimals - limit to 2 decimal places
              else if (typeof rawValue === 'number' && !Number.isInteger(rawValue)) {
                currentValue = rawValue.toFixed(2);
              } else {
                currentValue = String(rawValue ?? "");
              }
              
              setEditValue(currentValue);
              onStartEdit?.(itemId, column.id);
              onActivate?.();
            }
          },
        };

        return (
          <div
            key={column.id}
            className="flex items-center py-2 px-1 overflow-hidden min-w-0"
          >
            {column.render ? (
              column.render(item, isEditingThis, editProps)
            ) : (
              <TruncatedText className="font-optimistic text-[14px] text-[rgba(0,0,0,0.75)]">
                {String((item as Record<string, unknown>)[column.id] ?? "")}
              </TruncatedText>
            )}
          </div>
        );
      })}

      {/* Actions (overflow menu + expand button) */}
      {showActions && (actions.length > 0 || expandable) && (
        <div data-actions-cell className="flex items-center justify-end py-2 pr-2 gap-0">
          {/* Overflow menu */}
          {actions.length > 0 && (
            <Dropdown
              trigger={
                <button
                  className={`flex items-center justify-center w-9 h-9 rounded-[4px] transition-colors ${
                    isDropdownOpen
                      ? "bg-[rgba(0,0,0,0.1)]"
                      : "hover:bg-[rgba(0,0,0,0.05)]"
                  }`}
                  onClick={handleDropdownToggle}
                >
                  <Icon
                    name="ThreeDots"
                    variant="filled"
                    size={16}
                    className="text-[#283943]"
                  />
                </button>
              }
              width={180}
              align="right"
              onClose={handleDropdownClose}
            >
              <Dropdown.List>
                {actions.map((action, index) => (
                  <React.Fragment key={action.label}>
                    {action.dividerBefore && <Dropdown.Divider />}
                    <Dropdown.Item
                      label={action.label}
                      icon={action.icon}
                      onClick={() => action.onClick(item)}
                    />
                  </React.Fragment>
                ))}
              </Dropdown.List>
            </Dropdown>
          )}
          
          {/* Expand/Collapse button */}
          {expandable && (
            <button
              className="flex items-center justify-center w-9 h-9 rounded-[4px] transition-colors hover:bg-[rgba(0,0,0,0.05)]"
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpand?.();
              }}
              aria-expanded={isExpanded}
              aria-label={isExpanded ? "Collapse row" : "Expand row"}
            >
              <Icon
                name={isExpanded ? "CaretDownSmall" : "CaretRight"}
                variant="outlined"
                size={16}
                className="text-[#283943]"
              />
            </button>
          )}
        </div>
      )}
    </div>
  );

  // If row is expanded, render the main row + expanded content wrapped in a group for shared hover
  if (expandable && isExpanded && expandedContent) {
    return (
      <div 
        className={`col-span-full grid transition-colors ${bgClass} ${hoverClass} border-b border-[rgba(0,0,0,0.1)]`}
        style={{ gridTemplateColumns: 'subgrid' }}
      >
        {rowContent}
        {/* Expanded content - spans all columns, white background, shares parent hover */}
        <div className="col-span-full">
          {expandedContent}
        </div>
      </div>
    );
  }

  return rowContent;
}

// Memoized export - prevents re-renders when props haven't changed
// This is especially useful for tables with many rows
export const DataTableRow = React.memo(DataTableRowInner) as <T>(
  props: DataTableRowProps<T>
) => React.ReactElement;

// ============================================
// DATA TABLE HEADER COMPONENT
// ============================================

// Inner component (not exported directly)
function DataTableHeaderInner<T>({
  columns,
  visibleColumns,
  minColumnWidth = DEFAULT_MIN_COLUMN_WIDTH,
  showCheckbox = true,
  allChecked = false,
  onCheckAll,
  sortColumn,
  sortDirection = "asc",
  onSort,
  showActions = true,
  sticky = false,
  isScrolled = false,
  backgroundColor,
  className = "",
  resizable = false,
  columnWidths = {},
  onColumnResize,
  onColumnResetWidth,
  onResizeStart,
}: DataTableHeaderProps<T>) {
  // Get visible data columns in the order specified by columns array (from createCampaignColumns)
  // This maintains consistent column ordering based on the defined config
  const visibleDataColumns = columns.filter(
    (col) =>
      visibleColumns.includes(col.id) &&
      col.id !== "select" &&
      col.id !== "actions"
  );

  // Build header classes - shadow only appears when scrolled
  const stickyClasses = sticky ? "sticky top-0 z-10" : "";
  const shadowClass = sticky && isScrolled ? "shadow-[0_2px_4px_rgba(0,0,0,0.08)]" : "";
  const bgClass = backgroundColor || "bg-[#F1F4F7]";

  // Header row wrapper with subgrid
  return (
    <div 
      className={`grid col-span-full ${bgClass} rounded-t-[8px] border-b border-[rgba(0,0,0,0.1)] ${stickyClasses} ${shadowClass} transition-shadow ${className}`}
      style={{ gridTemplateColumns: 'subgrid' }}
    >
      {/* Checkbox column */}
      {showCheckbox && (
        <div className="flex items-center justify-center py-3 pl-2 pr-2">
          <button
            type="button"
            onClick={() => onCheckAll?.(!allChecked)}
            className="shrink-0 w-6 h-6 flex items-center justify-center bg-white border border-[#CBD2D9] rounded-[4px] cursor-pointer hover:border-[#0A78BE] transition-colors"
            aria-checked={allChecked}
            role="checkbox"
          >
            {allChecked && (
              <Icon
                name="Check"
                variant="filled"
                size={16}
                className="text-[#0A78BE]"
              />
            )}
          </button>
        </div>
      )}

      {/* Data columns */}
      {visibleDataColumns.map((column) => (
        <div
          key={column.id}
          data-column-id={column.id}
          className="relative flex items-center py-3 px-1 overflow-hidden min-w-0"
        >
          {/* Column name and sort arrow - localized hover target */}
          <div className="group flex items-center gap-1.5 min-w-0">
            <TruncatedText 
              className={`font-optimistic font-bold text-[14px] leading-[20px] text-[rgba(28,43,51,0.6)] transition-colors ${
                column.sortable ? "group-hover:text-[#0A78BE]" : ""
              }`}
            >
              {column.label}
            </TruncatedText>
            {/* Info icon for columns that have it */}
            {column.hasInfoIcon && (
              <div 
                className="shrink-0 cursor-help"
                title={column.infoTooltip}
              >
                <Icon
                  name="Info"
                  variant="filled"
                  size={12}
                  className="text-[rgba(28,43,51,0.6)]"
                />
              </div>
            )}
            {/* Active sort column - always show arrow, clickable */}
            {column.sortable && sortColumn === column.id && (
              <button
                onClick={() => onSort?.(column.id)}
                className="flex items-center justify-center shrink-0 p-0.5 -m-0.5 rounded hover:bg-[rgba(0,0,0,0.05)] transition-colors cursor-pointer"
                aria-label={`Sort by ${column.label}`}
              >
                <Icon
                  name={sortDirection === "asc" ? "ArrowUp" : "ArrowDown"}
                  variant="outlined"
                  size={16}
                  className="text-[#0A78BE]"
                />
              </button>
            )}
            {/* Other sortable columns - show arrow on hover, clickable */}
            {column.sortable && sortColumn !== column.id && (
              <button
                onClick={() => onSort?.(column.id)}
                className="flex items-center justify-center shrink-0 p-0.5 -m-0.5 rounded hover:bg-[rgba(0,0,0,0.05)] transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                aria-label={`Sort by ${column.label}`}
              >
                <Icon
                  name="ArrowDown"
                  variant="outlined"
                  size={16}
                  className="text-[#0A78BE]"
                />
              </button>
            )}
          </div>
          {/* Resize handle - outside of hover group */}
          {resizable && onColumnResize && onColumnResetWidth && (
            <ResizeHandle
              columnId={column.id}
              onResize={onColumnResize}
              onResetWidth={onColumnResetWidth}
              onResizeStart={onResizeStart}
            />
          )}
        </div>
      ))}

      {/* Actions column spacer - matches the width of the overflow button in rows */}
      {showActions && (
        <div className="py-3 pr-[14px]" />
      )}
    </div>
  );
}

// Memoized export - header rarely changes, so memoization prevents unnecessary re-renders
export const DataTableHeader = React.memo(DataTableHeaderInner) as <T>(
  props: DataTableHeaderProps<T>
) => React.ReactElement;

// ============================================
// DATA TABLE CONTAINER COMPONENT
// ============================================

export function DataTable<T>({
  data,
  getItemId,
  columns,
  visibleColumns,
  minColumnWidth = DEFAULT_MIN_COLUMN_WIDTH,
  showCheckbox = true,
  checkedItems = new Set(),
  onCheckedItemsChange,
  sortColumn,
  sortDirection = "asc",
  onSort,
  showActions = true,
  actions = [],
  editingCell,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  className = "",
  emptyState,
  resizable = false,
  tableId = "default",
  onRowClick,
  footerCells,
  footerBackground = "#F1F4F7",
  expandable = false,
  expandedItems = new Set(),
  onExpandedItemsChange,
  renderExpandedContent,
}: DataTableProps<T>) {
  const [activeRowId, setActiveRowId] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);

  // Column resize management
  const { columnWidths, handleColumnResize, handleResetColumnWidth, snapshotColumnWidths } = useColumnResize(tableId);

  // Handle click outside to deactivate rows
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tableRef.current &&
        !tableRef.current.contains(event.target as Node)
      ) {
        setActiveRowId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Track scroll position to show/hide header shadow
  useEffect(() => {
    const container = tableRef.current;
    if (!container) return;

    const handleScroll = () => {
      setIsScrolled(container.scrollTop > 0);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle check all
  const handleCheckAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        const allIds = new Set(data.map(getItemId));
        onCheckedItemsChange?.(allIds);
      } else {
        onCheckedItemsChange?.(new Set());
      }
    },
    [data, getItemId, onCheckedItemsChange]
  );

  // Handle individual check change
  const handleCheckChange = useCallback(
    (itemId: string, checked: boolean) => {
      const newChecked = new Set(checkedItems);
      if (checked) {
        newChecked.add(itemId);
      } else {
        newChecked.delete(itemId);
      }
      onCheckedItemsChange?.(newChecked);
    },
    [checkedItems, onCheckedItemsChange]
  );

  // Handle toggle expand for a row
  const handleToggleExpand = useCallback(
    (itemId: string) => {
      const newExpanded = new Set(expandedItems);
      if (newExpanded.has(itemId)) {
        newExpanded.delete(itemId);
      } else {
        newExpanded.add(itemId);
      }
      onExpandedItemsChange?.(newExpanded);
    },
    [expandedItems, onExpandedItemsChange]
  );

  // Check if all items are checked
  const allChecked = data.length > 0 && data.every((item) => checkedItems.has(getItemId(item)));

  // Get visible data columns for grid calculation
  // Order follows columns array (from createCampaignColumns) for consistent ordering
  const visibleDataColumns = columns.filter(
    (col) =>
      visibleColumns.includes(col.id) &&
      col.id !== "select" &&
      col.id !== "actions"
  );

  // Calculate grid template columns - memoized for performance
  // Strategy: 
  // - Resized columns use their fixed px width as a MINIMUM
  // - The LAST data column is ALWAYS flexible (minmax with 1fr) to fill remaining space
  // - This ensures the table always fills the container width (no empty space at the end)
  // - The actions column stays fixed at the right edge
  const gridColumns = useMemo(() => {
    const cols: string[] = [];
    if (showCheckbox) cols.push('56px'); // Checkbox column (24px checkbox + padding)
    
    const lastColumnIndex = visibleDataColumns.length - 1;
    
    // Data columns
    visibleDataColumns.forEach((col, index) => {
      const customWidth = columnWidths[col.id];
      const isBeingEdited = editingCell?.columnId === col.id;
      const editWidth = col.editMinWidth;
      const isLastColumn = index === lastColumnIndex;
      
      // Determine the minimum width for this column
      let minWidth = COLUMN_MIN_WIDTH;
      
      if (isBeingEdited && editWidth) {
        // Editing: use larger of current width or editMinWidth
        const currentWidth = customWidth || COLUMN_MIN_WIDTH;
        minWidth = Math.max(currentWidth, editWidth);
      } else if (customWidth) {
        // Resized: use the custom width as minimum
        minWidth = customWidth;
      }
      
      // Last column is ALWAYS flexible to fill remaining space
      // Other columns: flexible if not resized, fixed if resized
      if (isLastColumn) {
        // Last column always grows to fill space (prevents empty space at end)
        cols.push(`minmax(${minWidth}px, 1fr)`);
      } else if (customWidth || (isBeingEdited && editWidth)) {
        // Non-last columns with custom width: fixed size
        cols.push(`${minWidth}px`);
      } else {
        // Non-last columns without custom width: flexible
        cols.push(`minmax(${COLUMN_MIN_WIDTH}px, 1fr)`);
      }
    });
    
    // Actions column width depends on what's shown:
    // - Just actions: 56px (36px button + padding)
    // - Just expand: 56px (36px button + padding)
    // - Both: 92px (two 36px buttons + padding)
    if (showActions || expandable) {
      const actionsWidth = (actions.length > 0 && expandable) ? '92px' : '56px';
      cols.push(actionsWidth);
    }
    return cols;
  }, [showCheckbox, showActions, expandable, actions.length, visibleDataColumns, columnWidths, editingCell]);

  // Show empty state if no data
  if (data.length === 0 && emptyState) {
    return <>{emptyState}</>;
  }

  return (
    <div ref={tableRef} className={`overflow-auto ${className}`}>
      {/* Grid Container */}
      <div 
        data-table-grid="true"
        className="grid w-full min-w-fit gap-x-0"
        style={{ gridTemplateColumns: gridColumns.join(' ') }}
      >
        {/* Header Row */}
        <DataTableHeader
          columns={columns}
          visibleColumns={visibleColumns}
          minColumnWidth={minColumnWidth}
          showCheckbox={showCheckbox}
          allChecked={allChecked}
          onCheckAll={handleCheckAll}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={onSort}
          showActions={showActions || expandable}
          sticky={true}
          isScrolled={isScrolled}
          resizable={resizable}
          columnWidths={columnWidths}
          onColumnResize={handleColumnResize}
          onColumnResetWidth={handleResetColumnWidth}
          onResizeStart={snapshotColumnWidths}
        />

        {/* Data Rows */}
        {data.map((item, index) => {
          const itemId = getItemId(item);
          // If there's a footer, no row is the "last row" for border purposes
          const isLastRow = !footerCells && index === data.length - 1;
          return (
            <DataTableRow
              key={itemId}
              item={item}
              itemId={itemId}
              columns={columns}
              visibleColumns={visibleColumns}
              minColumnWidth={minColumnWidth}
              showCheckbox={showCheckbox}
              isChecked={checkedItems.has(itemId)}
              onCheckChange={(checked) => handleCheckChange(itemId, checked)}
              isActive={activeRowId === itemId}
              onActivate={() => setActiveRowId(itemId)}
              onDeactivate={() => setActiveRowId(null)}
              showActions={showActions || expandable}
              actions={actions}
              editingCell={editingCell}
              onStartEdit={onStartEdit}
              onSaveEdit={onSaveEdit}
              onCancelEdit={onCancelEdit}
              isLastRow={isLastRow}
              onRowClick={onRowClick}
              expandable={expandable}
              isExpanded={expandedItems.has(itemId)}
              onToggleExpand={() => handleToggleExpand(itemId)}
              expandedContent={renderExpandedContent?.(item)}
            />
          );
        })}

        {/* Footer Row - renders within the same grid for consistent column widths */}
        {footerCells && footerCells.length > 0 && (
          <div 
            className="grid col-span-full border-t border-[rgba(0,0,0,0.1)]"
            style={{ 
              gridTemplateColumns: 'subgrid',
              backgroundColor: footerBackground,
            }}
          >
            {/* Checkbox placeholder - always render when showCheckbox is true to maintain grid alignment */}
            {showCheckbox && (
              <div className="flex items-center justify-center py-2 pl-2 pr-2">
                {/* Empty placeholder - maintains column alignment */}
              </div>
            )}

            {/* Footer cells - match visible columns */}
            {visibleDataColumns.map((column) => {
              const footerCell = footerCells.find(fc => fc.columnId === column.id);
              return (
                <div
                  key={column.id}
                  className="flex items-center py-2 px-1 overflow-hidden min-w-0"
                >
                  {footerCell?.content ?? (
                    <span className="font-optimistic font-medium text-[14px] text-[rgba(0,0,0,0.75)]">
                      -
                    </span>
                  )}
                </div>
              );
            })}

            {/* Actions placeholder */}
            {showActions && (
              <div className="py-2 pr-[14px]" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// HELPER COMPONENTS FOR CELL RENDERING
// ============================================

/** Props for editable text cell */
interface EditableTextCellProps {
  value: string;
  isEditing: boolean;
  editProps: EditProps;
  onStartEdit: () => void;
  className?: string;
}

/** Editable text cell component */
export function EditableTextCell({
  value,
  isEditing,
  editProps,
  onStartEdit,
  className = "",
}: EditableTextCellProps) {
  if (isEditing) {
    return (
      <input
        type="text"
        value={editProps.value}
        onChange={(e) => editProps.onChange(e.target.value)}
        onKeyDown={editProps.onKeyDown}
        onBlur={editProps.onSave}
        autoFocus
        className="w-full px-2 py-1 text-[14px] border border-[#0A78BE] rounded outline-none font-optimistic"
      />
    );
  }

  return (
    <TruncatedText
      className={`font-optimistic text-[14px] text-[rgba(0,0,0,0.75)] cursor-pointer hover:bg-[rgba(0,0,0,0.05)] px-1 -mx-1 rounded ${className}`}
      onClick={onStartEdit}
    >
      {value}
    </TruncatedText>
  );
}

/** Props for editable number cell */
interface EditableNumberCellProps {
  value: number;
  isEditing: boolean;
  editProps: EditProps;
  onStartEdit: () => void;
  formatter?: (value: number) => string;
  className?: string;
}

/** Editable number cell component */
export function EditableNumberCell({
  value,
  isEditing,
  editProps,
  onStartEdit,
  formatter = (v) => String(v),
  className = "",
}: EditableNumberCellProps) {
  if (isEditing) {
    return (
      <input
        type="number"
        value={editProps.value}
        onChange={(e) => editProps.onChange(e.target.value)}
        onKeyDown={editProps.onKeyDown}
        onBlur={editProps.onSave}
        autoFocus
        className="w-full px-2 py-1 text-[14px] border border-[#0A78BE] rounded outline-none font-optimistic"
      />
    );
  }

  return (
    <span
      className={`font-optimistic text-[14px] text-[rgba(0,0,0,0.75)] cursor-pointer hover:bg-[rgba(0,0,0,0.05)] px-1 -mx-1 rounded ${className}`}
      onClick={onStartEdit}
    >
      {formatter(value)}
    </span>
  );
}

/** Props for read-only text cell */
interface TextCellProps {
  value: string;
  className?: string;
}

/** Read-only text cell component */
export function TextCell({ value, className = "" }: TextCellProps) {
  return (
    <TruncatedText
      className={`font-optimistic text-[14px] text-[rgba(0,0,0,0.75)] ${className}`}
    >
      {value}
    </TruncatedText>
  );
}

/** Props for read-only number cell */
interface NumberCellProps {
  value: number;
  formatter?: (value: number) => string;
  className?: string;
}

/** Read-only number cell component */
export function NumberCell({
  value,
  formatter = (v) => String(v),
  className = "",
}: NumberCellProps) {
  return (
    <span
      className={`font-optimistic text-[14px] text-[rgba(0,0,0,0.75)] ${className}`}
    >
      {formatter(value)}
    </span>
  );
}

// ============================================
// EXPORTS
// ============================================

// Export the column resize hook for use in components that need
// to render additional rows (like Total rows) with matching column widths
export { useColumnResize };

// Export constants for consistency
export { COLUMN_MIN_WIDTH, COLUMN_MAX_WIDTH };

export default DataTable;

