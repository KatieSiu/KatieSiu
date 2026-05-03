"use client";

import React, { useState, useRef, useEffect, useCallback, cloneElement, isValidElement } from "react";
import { Icon } from "./Icon";

// ============================================
// TYPES & INTERFACES
// ============================================

interface DropdownProps {
  /** The trigger element - can be ReactNode or render function that receives { isOpen } */
  trigger: React.ReactNode | ((props: { isOpen: boolean }) => React.ReactNode);
  /** Menu content */
  children: React.ReactNode;
  /** Menu width - defaults to auto */
  width?: number | string;
  /** Horizontal alignment relative to trigger */
  align?: "left" | "right";
  /** Vertical position relative to trigger */
  position?: "bottom" | "top";
  /** Callback when dropdown closes */
  onClose?: () => void;
  /** Whether to close dropdown when clicking an item (default: true) */
  closeOnItemClick?: boolean;
  /** Additional class names */
  className?: string;
}

interface DropdownItemProps {
  /** Main label text */
  label: string;
  /** Optional description text */
  description?: string;
  /** Optional icon name (from icon library) */
  icon?: string;
  /** Icon variant */
  iconVariant?: "filled" | "outlined";
  /** Optional custom thumbnail element (e.g., colored square, avatar) */
  thumbnail?: React.ReactNode;
  /** Selection type: none (simple), checkbox (multi-select), radio (single-select) */
  selectionType?: "none" | "checkbox" | "radio";
  /** Whether this item is selected (for checkbox/radio) */
  selected?: boolean;
  /** Selection change handler */
  onSelectionChange?: (selected: boolean) => void;
  /** Click handler (for simple menu items) */
  onClick?: () => void;
  /** Whether this item is disabled */
  disabled?: boolean;
  /** Additional class names */
  className?: string;
}

interface DropdownSearchProps {
  /** Placeholder text */
  placeholder?: string;
  /** Current search value */
  value?: string;
  /** Change handler */
  onChange?: (value: string) => void;
  /** Auto focus on mount */
  autoFocus?: boolean;
  /** Additional class names */
  className?: string;
}

interface DropdownListProps {
  /** Menu items */
  children: React.ReactNode;
  /** Maximum height before scrolling */
  maxHeight?: number;
  /** Additional class names */
  className?: string;
}

interface DropdownDividerProps {
  /** Additional class names */
  className?: string;
}

// ============================================
// DROPDOWN ITEM COMPONENT
// ============================================

function DropdownItem({
  label,
  description,
  icon,
  iconVariant = "outlined",
  thumbnail,
  selectionType = "none",
  selected = false,
  onSelectionChange,
  onClick,
  disabled = false,
  className = "",
}: DropdownItemProps) {
  const handleClick = () => {
    if (disabled) return;

    if (selectionType !== "none" && onSelectionChange) {
      onSelectionChange(!selected);
    } else if (onClick) {
      onClick();
    }
  };

  // Determine row background based on selection state
  const getRowBackground = () => {
    if (disabled) return "bg-transparent";
    if (selected && selectionType !== "none") {
      // Selected items have blue background, hover slightly darker
      return "bg-[#E1EDF7] hover:bg-[#D1E3F3]";
    }
    // Non-selected items: transparent idle, subtle gray on hover
    return "bg-transparent hover:bg-[rgba(0,0,0,0.05)]";
  };

  // Determine text color based on disabled state
  const getTextColor = () => {
    if (disabled) return "text-[rgba(28,43,51,0.4)]";
    return "text-[#1C2B33]";
  };

  const getDescriptionColor = () => {
    if (disabled) return "text-[rgba(70,90,105,0.4)]";
    return "text-[#465A69]";
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={`
        w-full
        flex items-center gap-2
        px-3 py-2
        rounded-[4px]
        text-left
        transition-colors
        ${getRowBackground()}
        ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
    >
      {/* Checkbox Selection Control */}
      {selectionType === "checkbox" && (
        <div
          className={`
            shrink-0
            w-6 h-6
            flex items-center justify-center
            bg-white
            border rounded-[4px]
            ${disabled ? "border-[rgba(203,210,217,0.6)]" : "border-[#CBD2D9]"}
          `}
        >
          {selected && (
            <Icon
              name="Check"
              variant="filled"
              size={16}
              className={disabled ? "text-[rgba(10,120,190,0.4)]" : "text-[#0A78BE]"}
            />
          )}
        </div>
      )}

      {/* Radio Selection Control */}
      {selectionType === "radio" && (
        <div
          className={`
            shrink-0
            w-6 h-6
            flex items-center justify-center
            bg-white
            border rounded-full
            ${disabled ? "border-[rgba(203,210,217,0.6)]" : "border-[#CBD2D9]"}
          `}
        >
          {selected && (
            <div
              className={`
                w-3 h-3 rounded-full
                ${disabled ? "bg-[rgba(10,120,190,0.4)]" : "bg-[#0A78BE]"}
              `}
            />
          )}
        </div>
      )}

      {/* Thumbnail (optional) */}
      {thumbnail && (
        <div className={`shrink-0 ${disabled ? "opacity-40" : ""}`}>
          {thumbnail}
        </div>
      )}

      {/* Icon (optional) */}
      {icon && (
        <Icon
          name={icon}
          variant={iconVariant}
          size={16}
          className={`shrink-0 ${disabled ? "text-[rgba(40,57,67,0.4)]" : "text-[#283943]"}`}
        />
      )}

      {/* Label & Description */}
      <div className="flex-1 min-w-0 flex flex-col">
        <span
          className={`
            text-[14px] leading-[20px] font-optimistic
            truncate
            ${getTextColor()}
          `}
        >
          {label}
        </span>
        {description && (
          <span
            className={`
              text-[12px] leading-[16px] font-optimistic
              truncate
              ${getDescriptionColor()}
            `}
          >
            {description}
          </span>
        )}
      </div>
    </button>
  );
}

// ============================================
// DROPDOWN SEARCH COMPONENT
// ============================================

function DropdownSearch({
  placeholder = "Search",
  value,
  onChange,
  autoFocus = true,
  className = "",
}: DropdownSearchProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [internalValue, setInternalValue] = useState(value || "");

  const currentValue = value !== undefined ? value : internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (onChange) {
      onChange(newValue);
    } else {
      setInternalValue(newValue);
    }
  };

  const handleClear = () => {
    if (onChange) {
      onChange("");
    } else {
      setInternalValue("");
    }
  };

  return (
    <div
      className={`
        flex items-center gap-2
        px-3 py-2
        bg-white
        border-b
        ${isFocused ? "border-[#0A78BE]" : "border-[#CBD2D9]"}
        rounded-t-[6px]
        transition-colors
        ${className}
      `}
    >
      {/* Search Icon */}
      <Icon
        name="Search"
        variant="outlined"
        size={16}
        className="text-[#283943] shrink-0"
      />

      {/* Input */}
      <input
        type="text"
        value={currentValue}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={`
          flex-1 min-w-0
          bg-transparent
          text-[14px] leading-[20px]
          font-optimistic
          outline-none
          ${currentValue ? "text-[#1C2B33]" : "text-[rgba(28,43,51,0.65)]"}
          placeholder:text-[rgba(28,43,51,0.65)]
        `}
      />

      {/* Clear Button */}
      {currentValue && (
        <button
          type="button"
          onClick={handleClear}
          className="shrink-0 text-[#283943] hover:text-[#1C2B33] transition-colors"
        >
          <Icon name="Close" variant="outlined" size={16} />
        </button>
      )}
    </div>
  );
}

// ============================================
// DROPDOWN LIST COMPONENT
// ============================================

function DropdownList({
  children,
  maxHeight = 300,
  className = "",
}: DropdownListProps) {
  return (
    <div
      className={`
        flex flex-col gap-1
        p-1
        overflow-y-auto
        dropdown-scrollbar
        ${className}
      `}
      style={{ maxHeight: `${maxHeight}px` }}
    >
      {children}
    </div>
  );
}

// ============================================
// DROPDOWN DIVIDER COMPONENT
// ============================================

function DropdownDivider({ className = "" }: DropdownDividerProps) {
  return (
    <div
      className={`
        h-px
        mx-2 my-1
        bg-[#E4E8EB]
        ${className}
      `}
    />
  );
}

// ============================================
// MAIN DROPDOWN COMPONENT
// ============================================

function DropdownRoot({
  trigger,
  children,
  width = "auto",
  align = "left",
  position = "bottom",
  onClose,
  closeOnItemClick = true,
  className = "",
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Helper to close dropdown and call onClose callback
  const closeDropdown = useCallback(() => {
    setIsOpen(false);
    onClose?.();
  }, [onClose]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, closeDropdown]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeDropdown();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, closeDropdown]);

  // Close menu when an item is clicked (if closeOnItemClick is true)
  const handleMenuClick = (e: React.MouseEvent) => {
    if (!closeOnItemClick) return;
    
    // Check if click was on a menu item (button element)
    const target = e.target as HTMLElement;
    if (target.closest('button[type="button"]')) {
      // Small delay to allow the click handler to complete
      setTimeout(() => closeDropdown(), 50);
    }
  };

  // Calculate menu width
  const getMenuWidth = () => {
    if (width === "100%") return "100%";
    if (typeof width === "number") return `${width}px`;
    return width;
  };

  // Handle trigger click
  const handleTriggerClick = (e: React.MouseEvent) => {
    // Prevent any parent handlers from firing
    e.stopPropagation();
    
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    // Call onClose when closing via trigger click
    if (!newIsOpen) {
      onClose?.();
    }
  };

  // Render trigger with injected onClick
  const renderTrigger = () => {
    const triggerElement = typeof trigger === 'function' ? trigger({ isOpen }) : trigger;
    
    // If it's a valid React element, clone it and inject onClick
    if (isValidElement(triggerElement)) {
      return cloneElement(triggerElement as React.ReactElement<any>, {
        onClick: (e: React.MouseEvent) => {
          // Call the original onClick if it exists
          const originalOnClick = (triggerElement as React.ReactElement<any>).props?.onClick;
          if (originalOnClick) {
            originalOnClick(e);
          }
          handleTriggerClick(e);
        },
      });
    }
    
    // Fallback: wrap in a div with onClick
    return <div onClick={handleTriggerClick}>{triggerElement}</div>;
  };

  return (
    <div ref={wrapperRef} className={`relative ${className || 'inline-block'}`}>
      {/* Trigger */}
      {renderTrigger()}

      {/* Menu - simple absolute positioning, scrolls with parent */}
      {isOpen && (
        <div
          ref={menuRef}
          onClick={handleMenuClick}
          className={`
            absolute z-50
            ${position === "top" ? "bottom-full mb-1" : "top-full mt-1"}
            bg-white
            rounded-[4px]
            shadow-[0px_2px_12px_2px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)]
            ${align === "right" ? "right-0" : "left-0"}
          `}
          style={{ 
            width: getMenuWidth(),
            minWidth: "160px",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

// ============================================
// COMPOUND COMPONENT EXPORT
// ============================================

/**
 * Dropdown Menu Component
 * 
 * A flexible dropdown menu system supporting:
 * - Simple menus (click actions)
 * - Multi-select menus (checkboxes)
 * - Single-select menus (radio buttons)
 * 
 * @example
 * // Simple Menu
 * <Dropdown trigger={<Button dropdown>Actions</Button>} width={180}>
 *   <Dropdown.List>
 *     <Dropdown.Item label="Edit" onClick={() => {}} />
 *     <Dropdown.Item label="Delete" onClick={() => {}} />
 *   </Dropdown.List>
 * </Dropdown>
 * 
 * @example
 * // Multi-Select Menu with Search
 * <Dropdown trigger={<Button dropdown>Filter</Button>} width={240}>
 *   <Dropdown.Search placeholder="Search..." value={search} onChange={setSearch} />
 *   <Dropdown.List>
 *     <Dropdown.Item 
 *       label="Option 1" 
 *       selectionType="checkbox"
 *       selected={selected}
 *       onSelectionChange={setSelected}
 *     />
 *   </Dropdown.List>
 * </Dropdown>
 * 
 * @example
 * // Single-Select Menu
 * <Dropdown trigger={<Button dropdown>Sort By</Button>} width={200}>
 *   <Dropdown.List>
 *     <Dropdown.Item 
 *       label="Name" 
 *       selectionType="radio"
 *       selected={sortBy === "name"}
 *       onSelectionChange={() => setSortBy("name")}
 *     />
 *   </Dropdown.List>
 * </Dropdown>
 */
export const Dropdown = Object.assign(DropdownRoot, {
  Item: DropdownItem,
  Search: DropdownSearch,
  List: DropdownList,
  Divider: DropdownDivider,
});

// Also export individual components for flexibility
export { DropdownItem, DropdownSearch, DropdownList, DropdownDivider };
export type { DropdownProps, DropdownItemProps, DropdownSearchProps, DropdownListProps, DropdownDividerProps };

