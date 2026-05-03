"use client";

import React, { useState, useRef, useEffect } from "react";
import { Icon } from "./Icon";

// ============================================
// TYPES & INTERFACES
// ============================================

interface DropdownProps {
  /** The trigger element (usually a Button) */
  trigger: React.ReactNode;
  /** Menu content */
  children: React.ReactNode;
  /** Menu width - defaults to auto */
  width?: number | string;
  /** Alignment relative to trigger */
  align?: "left" | "right";
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
// RADIO DROPDOWN MENU COMPONENT
// ============================================

interface RadioDropdownMenuOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
  linkText?: string;
}

interface RadioDropdownMenuProps {
  options: RadioDropdownMenuOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  className?: string;
}

function RadioDropdownMenu({
  options,
  selectedValue,
  onSelect,
  className = "",
}: RadioDropdownMenuProps) {
  return (
    <div
      className={`
        flex flex-col gap-1
        p-1
        ${className}
      `}
    >
      {options.map((option) => {
        const isSelected = selectedValue === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => !option.disabled && onSelect(option.value)}
            disabled={option.disabled}
            className={`
              w-full
              flex items-center gap-2
              px-3 py-2
              rounded-[4px]
              text-left
              transition-colors
              ${isSelected ? "bg-[#E1EDF7]" : "bg-transparent hover:bg-[rgba(0,0,0,0.05)]"}
              ${option.disabled ? "cursor-not-allowed" : "cursor-pointer"}
            `}
          >
            {/* Radio button */}
            <div
              className={`
                shrink-0
                w-6 h-6
                flex items-center justify-center
                bg-white
                border rounded-full
                ${option.disabled ? "border-[rgba(203,210,217,0.6)]" : isSelected ? "border-[#0A78BE]" : "border-[#CBD2D9]"}
              `}
            >
              {isSelected && (
                <div
                  className={`
                    w-3 h-3 rounded-full
                    ${option.disabled ? "bg-[rgba(10,120,190,0.4)]" : "bg-[#0A78BE]"}
                  `}
                />
              )}
            </div>

            {/* Label & Description */}
            <div className="flex-1 min-w-0 flex flex-col">
              <span
                className={`
                  text-[14px] leading-[20px] font-optimistic
                  ${option.disabled ? "text-[rgba(28,43,51,0.4)]" : "text-[#1C2B33]"}
                `}
              >
                {option.label}
              </span>
              {option.description && (
                <span
                  className={`
                    text-[12px] leading-[16px] font-optimistic
                    ${option.disabled ? "text-[rgba(70,90,105,0.4)]" : "text-[#465A69]"}
                  `}
                >
                  {option.description}
                  {option.linkText && (
                    <span className="text-[#0A78BE]"> {option.linkText}</span>
                  )}
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ============================================
// SECTIONED RADIO DROPDOWN MENU COMPONENT
// ============================================

interface SectionedRadioDropdownSection {
  title: string;
  description?: string;
  options: RadioDropdownMenuOption[];
}

interface SectionedRadioDropdownMenuProps {
  sections: SectionedRadioDropdownSection[];
  selectedValue: string;
  onSelect: (value: string) => void;
  className?: string;
}

function SectionedRadioDropdownMenu({
  sections,
  selectedValue,
  onSelect,
  className = "",
}: SectionedRadioDropdownMenuProps) {
  return (
    <div className={`pb-4 px-3 ${className}`}>
      {sections.map((section, sectionIndex) => (
        <div key={section.title || `section-${sectionIndex}`}>
          {/* Section Header */}
          {section.title && (
            <div className="flex items-center justify-between py-2">
              <div className="flex flex-col py-1">
                <span className="font-optimistic font-bold text-[15px] leading-[20px] text-[#1C2B33]">
                  {section.title}
                </span>
                {section.description && (
                  <span className="font-sf-pro text-[14px] leading-[20px] text-[#465A69]">
                    {section.description}
                  </span>
                )}
              </div>
              <Icon name="ChevronUp" variant="filled" size={16} className="text-[#283943]" />
            </div>
          )}
          
          {/* Options */}
          {section.options.map((option) => {
            const isSelected = selectedValue === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => !option.disabled && onSelect(option.value)}
                disabled={option.disabled}
                className={`
                  w-full
                  flex items-center gap-2
                  px-3 py-2
                  rounded-[4px]
                  text-left
                  transition-colors
                  ${isSelected ? "bg-[#E1EDF7]" : "bg-transparent hover:bg-[rgba(0,0,0,0.05)]"}
                  ${option.disabled ? "cursor-not-allowed" : "cursor-pointer"}
                `}
              >
                {/* Radio button */}
                <div
                  className={`
                    shrink-0
                    w-6 h-6
                    flex items-center justify-center
                    bg-white
                    border rounded-full
                    ${option.disabled ? "border-[#CBD2D9] bg-[#F1F4F7]" : isSelected ? "border-[#0A78BE]" : "border-[#CBD2D9]"}
                  `}
                >
                  {isSelected && (
                    <div
                      className={`
                        w-3 h-3 rounded-full
                        ${option.disabled ? "bg-[rgba(10,120,190,0.4)]" : "bg-[#0A78BE]"}
                      `}
                    />
                  )}
                </div>

                {/* Label & Description */}
                <div className="flex-1 min-w-0 flex flex-col">
                  <span
                    className={`
                      text-[14px] leading-[20px] font-optimistic
                      ${option.disabled ? "text-[rgba(28,43,51,0.6)]" : "text-[#1C2B33]"}
                    `}
                  >
                    {option.label}
                  </span>
                  {option.description && (
                    <span
                      className={`
                        text-[12px] leading-[16px] font-optimistic
                        ${option.disabled ? "text-[rgba(28,43,51,0.6)]" : "text-[#465A69]"}
                      `}
                    >
                      {option.description}
                      {option.linkText && (
                        <span className="text-[#0A78BE]"> {option.linkText}</span>
                      )}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
          
          {/* Divider between sections */}
          {sectionIndex < sections.length - 1 && (
            <div className="w-full h-px bg-[#CBD2D9] my-2" />
          )}
        </div>
      ))}
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
// FORM DROPDOWN COMPONENT
// ============================================

interface FormDropdownOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
  linkText?: string;
}

interface FormDropdownSection {
  title: string;
  description?: string;
  options: FormDropdownOption[];
}

interface FormDropdownProps {
  /** Field label */
  label: string;
  /** Currently selected value */
  selectedValue: string;
  /** Callback when selection changes */
  onSelect: (value: string) => void;
  /** Simple options (for flat dropdowns) */
  options?: FormDropdownOption[];
  /** Sectioned options (for grouped dropdowns) */
  sections?: FormDropdownSection[];
  /** Whether the dropdown is open (controlled) */
  isOpen?: boolean;
  /** Callback when dropdown opens/closes (controlled) */
  onToggle?: () => void;
  /** Whether to show the info icon next to the label (default: true) */
  showInfoIcon?: boolean;
  /** Additional class names */
  className?: string;
}

function FormDropdown({
  label,
  selectedValue,
  onSelect,
  options,
  sections,
  isOpen: controlledIsOpen,
  onToggle: controlledOnToggle,
  showInfoIcon = true,
  className = "",
}: FormDropdownProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  
  // Support both controlled and uncontrolled modes
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const handleToggle = controlledOnToggle || (() => setInternalIsOpen(!internalIsOpen));
  const handleClose = () => {
    if (controlledOnToggle) {
      controlledOnToggle();
    } else {
      setInternalIsOpen(false);
    }
  };
  
  // Get selected option label
  const allOptions = sections 
    ? sections.flatMap(s => s.options) 
    : (options || []);
  const selectedOption = allOptions.find(o => o.value === selectedValue);
  
  // Determine if this is a simple dropdown (no sections or single section with no title)
  const isSimpleDropdown = !sections || (sections.length === 1 && !sections[0].title);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const handleSelect = (value: string) => {
    onSelect(value);
    handleClose();
  };

  return (
    <div className={`flex flex-col w-full relative ${className}`}>
      {/* Label */}
      <div className="flex items-center gap-1 pb-1">
        <span className="font-optimistic font-bold text-[14px] leading-[20px] text-[#1C2B33]">
          {label}
        </span>
        {showInfoIcon && (
          <Icon name="Info" variant="filled" size={12} className="text-[#283943]" />
        )}
      </div>
      
      {/* Trigger */}
      <div 
        ref={triggerRef}
        className="bg-white border border-[#CBD2D9] rounded h-[36px] flex items-center px-3 justify-between cursor-pointer hover:border-[#0A78BE]"
        onClick={handleToggle}
      >
        <span className="font-sf-pro text-[14px] leading-[20px] text-[#1C2B33]">
          {selectedOption?.label || selectedValue}
        </span>
        <Icon name={isOpen ? "SmallTriangleUp" : "SmallTriangleDown"} variant="filled" size={16} className="text-[#283943]" />
      </div>
      
      {/* Menu */}
      {isOpen && (
        <div 
          ref={menuRef}
          className={`absolute top-full left-0 right-0 mt-1 bg-white rounded-[8px] shadow-[0px_8px_24px_0px_rgba(0,0,0,0.1),0px_2px_2px_0px_rgba(0,0,0,0.1)] z-10 ${isSimpleDropdown ? "p-1" : ""}`}
        >
          {sections ? (
            <SectionedRadioDropdownMenu
              sections={sections}
              selectedValue={selectedValue}
              onSelect={handleSelect}
            />
          ) : options ? (
            <RadioDropdownMenu
              options={options}
              selectedValue={selectedValue}
              onSelect={handleSelect}
            />
          ) : null}
        </div>
      )}
    </div>
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
  className = "",
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const handleTriggerClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Trigger */}
      <div 
        ref={triggerRef} 
        onClickCapture={handleTriggerClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            handleTriggerClick();
          }
        }}
      >
        {trigger}
      </div>

      {/* Menu */}
      {isOpen && (
        <div
          ref={menuRef}
          className={`
            absolute z-50 mt-1
            bg-white
            rounded-[8px]
            shadow-[0px_8px_24px_0px_rgba(0,0,0,0.1),0px_2px_2px_0px_rgba(0,0,0,0.1)]
            ${align === "right" ? "right-0" : "left-0"}
          `}
          style={{ width: typeof width === "number" ? `${width}px` : width, minWidth: "160px" }}
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
 * - Radio dropdown menus (simplified single-select with descriptions)
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
 * 
 * @example
 * // Radio Dropdown Menu (simplified)
 * <Dropdown trigger={<Button dropdown>Attribution</Button>} width={400}>
 *   <Dropdown.RadioMenu
 *     options={[
 *       { value: "standard", label: "Standard", description: "Optimize ad delivery..." },
 *       { value: "incremental", label: "Incremental", description: "Optimize delivery..." },
 *     ]}
 *     selectedValue={selected}
 *     onSelect={setSelected}
 *   />
 * </Dropdown>
 */
export const Dropdown = Object.assign(DropdownRoot, {
  Item: DropdownItem,
  Search: DropdownSearch,
  List: DropdownList,
  Divider: DropdownDivider,
  RadioMenu: RadioDropdownMenu,
  SectionedRadioMenu: SectionedRadioDropdownMenu,
  Form: FormDropdown,
});

// Also export individual components for flexibility
export { DropdownItem, DropdownSearch, DropdownList, DropdownDivider, RadioDropdownMenu, SectionedRadioDropdownMenu, FormDropdown };
export type { 
  DropdownProps, 
  DropdownItemProps, 
  DropdownSearchProps, 
  DropdownListProps, 
  DropdownDividerProps, 
  RadioDropdownMenuOption, 
  RadioDropdownMenuProps,
  SectionedRadioDropdownSection,
  SectionedRadioDropdownMenuProps,
  FormDropdownOption,
  FormDropdownSection,
  FormDropdownProps,
};

