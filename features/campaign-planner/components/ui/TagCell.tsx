"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Pill } from "./Pill";
import { Icon } from "./Icon";
import { EditTagModal } from "./EditTagModal";
import { DeleteTagModal } from "./DeleteTagModal";

// ============================================
// TYPES & INTERFACES
// ============================================

export interface TagCellProps {
  /** Tags currently assigned to this item */
  selectedTags: string[];
  /** All available tags across the system */
  allTags: string[];
  /** Callback when tags change for this item */
  onTagsChange: (tags: string[]) => void;
  /** Callback when a new tag is created */
  onCreateTag: (tagName: string) => void;
  /** Callback when a tag is edited (renamed) */
  onEditTag?: (oldName: string, newName: string) => void;
  /** Callback when a tag is deleted */
  onDeleteTag?: (tagName: string) => void;
  /** Callback when dropdown opens/closes (for column width expansion) */
  onOpenChange?: (isOpen: boolean) => void;
  /** Maximum tags to show before overflow indicator */
  maxVisibleTags?: number;
  /** Placeholder text when no tags */
  placeholder?: string;
}

// ============================================
// TAG CELL COMPONENT
// ============================================

export function TagCell({
  selectedTags,
  allTags,
  onTagsChange,
  onCreateTag,
  onEditTag,
  onDeleteTag,
  onOpenChange,
  maxVisibleTags = 2,
  placeholder = "Add tag",
}: TagCellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const [hoveredTag, setHoveredTag] = useState<string | null>(null);
  const [overflowMenuTag, setOverflowMenuTag] = useState<string | null>(null);
  const [overflowMenuPosition, setOverflowMenuPosition] = useState({ top: 0, left: 0 });
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const [deletingTag, setDeletingTag] = useState<string | null>(null);
  
  const cellRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const overflowMenuRef = useRef<HTMLDivElement>(null);

  // Calculate dropdown position
  const updateDropdownPosition = useCallback(() => {
    if (cellRef.current) {
      const rect = cellRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 4,
        left: rect.left,
        width: Math.max(rect.width, 220), // Minimum width of 220px
      });
    }
  }, []);

  // Open dropdown and focus input
  const handleOpen = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(true);
    setSearchValue("");
    onOpenChange?.(true);
    // Update position after state change
    requestAnimationFrame(() => {
      updateDropdownPosition();
    });
  }, [onOpenChange, updateDropdownPosition]);

  // Close dropdown
  const handleClose = useCallback(() => {
    setIsOpen(false);
    setSearchValue("");
    onOpenChange?.(false);
  }, [onOpenChange]);

  // Handle click outside to close dropdown
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        cellRef.current && !cellRef.current.contains(e.target as Node) &&
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node)
      ) {
        handleClose();
        setOverflowMenuTag(null);
        setHoveredTag(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, handleClose]);

  // Handle click outside to close overflow menu
  useEffect(() => {
    if (!overflowMenuTag) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (overflowMenuRef.current && !overflowMenuRef.current.contains(e.target as Node)) {
        setOverflowMenuTag(null);
        setHoveredTag(null);
      }
    };

    // Use setTimeout to avoid immediate close when opening
    const timeoutId = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 0);
    
    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [overflowMenuTag]);

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Update position on scroll/resize
  useEffect(() => {
    if (!isOpen) return;

    const handleUpdate = () => updateDropdownPosition();
    window.addEventListener("scroll", handleUpdate, true);
    window.addEventListener("resize", handleUpdate);
    
    return () => {
      window.removeEventListener("scroll", handleUpdate, true);
      window.removeEventListener("resize", handleUpdate);
    };
  }, [isOpen, updateDropdownPosition]);

  // Filter tags based on search
  const filteredTags = allTags.filter(tag =>
    tag.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Check if search value matches any existing tag exactly (case-insensitive)
  const exactMatch = allTags.some(
    tag => tag.toLowerCase() === searchValue.toLowerCase()
  );

  // Show "Create Tag" option when there's input and no exact match
  const showCreateOption = searchValue.trim() !== "" && !exactMatch;

  // Toggle tag selection
  const handleToggleTag = useCallback((tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter(t => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  }, [selectedTags, onTagsChange]);

  // Create new tag
  const handleCreateTag = useCallback(() => {
    const newTag = searchValue.trim();
    if (newTag && !exactMatch) {
      onCreateTag(newTag);
      onTagsChange([...selectedTags, newTag]);
      setSearchValue("");
    }
  }, [searchValue, exactMatch, onCreateTag, onTagsChange, selectedTags]);

  // Remove tag from input area
  const handleRemoveTag = useCallback((tag: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onTagsChange(selectedTags.filter(t => t !== tag));
  }, [selectedTags, onTagsChange]);

  // Handle keyboard events
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && showCreateOption) {
      e.preventDefault();
      handleCreateTag();
    } else if (e.key === "Escape") {
      handleClose();
    } else if (e.key === "Backspace" && searchValue === "" && selectedTags.length > 0) {
      // Remove last tag when backspace is pressed with empty input
      onTagsChange(selectedTags.slice(0, -1));
    }
  }, [showCreateOption, handleCreateTag, handleClose, searchValue, selectedTags, onTagsChange]);

  // Render the closed state (cell display)
  const renderClosedContent = () => {
    if (selectedTags.length === 0) {
      return (
        <span className="text-[14px] text-[#9AA5AD] font-optimistic">
          {placeholder}
        </span>
      );
    }

    return (
      <div className="flex items-center gap-1.5 overflow-hidden">
        {selectedTags.slice(0, maxVisibleTags).map(tag => (
          <Pill key={tag} variant="default" className="shrink-0 max-w-[120px] truncate">
            {tag}
          </Pill>
        ))}
        {selectedTags.length > maxVisibleTags && (
          <span className="text-[12px] text-[rgba(0,0,0,0.5)] shrink-0">
            +{selectedTags.length - maxVisibleTags}
          </span>
        )}
      </div>
    );
  };

  // Auto-scroll to keep input visible when tags change
  useEffect(() => {
    if (isOpen && scrollContainerRef.current) {
      // Scroll to the right to keep input visible
      scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
    }
  }, [isOpen, selectedTags]);

  // Render the open/editing state (inline input with tags)
  const renderOpenContent = () => {
    return (
      <div 
        ref={scrollContainerRef}
        className="flex items-center gap-1.5 w-full overflow-x-auto tag-cell-scrollbar"
      >
        {/* Selected tags as removable pills */}
        {selectedTags.map(tag => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2 py-0.5 text-[12px] font-bold leading-[16px] rounded-full font-optimistic bg-[#F1F4F7] text-[#1C2B33] shrink-0"
          >
            {tag}
            <button
              type="button"
              onClick={(e) => handleRemoveTag(tag, e)}
              className="hover:text-[#A20C17] transition-colors"
            >
              <Icon name="Close" variant="outlined" size={10} />
            </button>
          </span>
        ))}
        {/* Input field - always on the right */}
        <input
          ref={inputRef}
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="New Tag..."
          className="flex-1 min-w-[70px] text-[14px] font-optimistic text-[#1C2B33] outline-none bg-transparent placeholder:text-[#9AA5AD] caret-[#1C2B33] shrink-0"
        />
      </div>
    );
  };

  // Render dropdown content (only the tag list, no input)
  const renderDropdown = () => {
    if (!isOpen) return null;

    return createPortal(
      <div
        ref={dropdownRef}
        className="fixed z-[9999] bg-white rounded-lg shadow-lg border border-[#CBD2D9] overflow-hidden"
        style={{
          top: dropdownPosition.top,
          left: dropdownPosition.left,
          width: dropdownPosition.width,
          minWidth: 220,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tag list */}
        <div className="max-h-[240px] overflow-y-auto py-1">
          {/* No tag found message */}
          {showCreateOption && filteredTags.length === 0 && (
            <div className="px-3 py-2 text-[14px] font-optimistic text-[#9AA5AD]">
              No tag found
            </div>
          )}

          {/* Create tag option */}
          {showCreateOption && (
            <button
              type="button"
              onClick={handleCreateTag}
              className="w-full px-3 py-2 text-left text-[14px] font-optimistic text-[#1C2B33] hover:bg-[#F1F4F7] transition-colors"
            >
              Create Tag: {searchValue.trim()}
            </button>
          )}

          {/* Existing tags list */}
          {filteredTags.map(tag => {
            const isSelected = selectedTags.includes(tag);
            const isHovered = hoveredTag === tag;
            const isMenuOpen = overflowMenuTag === tag;
            return (
              <div
                key={tag}
                className={`relative flex items-center transition-colors ${
                  isHovered || isMenuOpen ? "bg-[#F1F4F7]" : ""
                }`}
                onMouseEnter={() => setHoveredTag(tag)}
                onMouseLeave={() => {
                  if (!isMenuOpen) {
                    setHoveredTag(null);
                  }
                }}
              >
                <button
                  type="button"
                  onClick={() => handleToggleTag(tag)}
                  className="flex-1 px-3 py-2.5 flex items-center gap-3 text-left"
                >
                  <div
                    className={`w-6 h-6 rounded border flex items-center justify-center transition-colors shrink-0 ${
                      isSelected
                        ? "bg-[#0A78BE] border-[#0A78BE]"
                        : "bg-white border-[#CBD2D9]"
                    }`}
                  >
                    {isSelected && (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.5 4L5.5 10L2.5 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <span className="flex-1 text-[14px] font-optimistic text-[#1C2B33]">{tag}</span>
                </button>
                
                {/* Overflow button - appears on hover */}
                {(isHovered || isMenuOpen) && (
                  <div className="pr-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isMenuOpen) {
                          setOverflowMenuTag(null);
                        } else {
                          // Calculate position for the menu (to the left of the button)
                          const rect = e.currentTarget.getBoundingClientRect();
                          setOverflowMenuPosition({
                            top: rect.top + rect.height / 2,
                            left: rect.left,
                          });
                          setOverflowMenuTag(tag);
                        }
                      }}
                      className={`w-7 h-7 flex items-center justify-center rounded transition-colors ${
                        isMenuOpen ? "bg-[#E5E9ED]" : "hover:bg-[#E5E9ED]"
                      }`}
                    >
                      {/* Three dots icon */}
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="3" cy="8" r="1.5" fill="#1C2B33"/>
                        <circle cx="8" cy="8" r="1.5" fill="#1C2B33"/>
                        <circle cx="13" cy="8" r="1.5" fill="#1C2B33"/>
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {/* Empty state when no tags exist and no search */}
          {allTags.length === 0 && searchValue === "" && (
            <div className="px-3 py-4 text-center text-[14px] font-optimistic text-[#9AA5AD]">
              No tags available. Type to create one.
            </div>
          )}
        </div>
      </div>,
      document.body
    );
  };

  // Handle edit tag save
  const handleEditSave = useCallback((oldName: string, newName: string) => {
    onEditTag?.(oldName, newName);
    // Update selected tags if the edited tag was selected
    if (selectedTags.includes(oldName)) {
      onTagsChange(selectedTags.map(t => t === oldName ? newName : t));
    }
    setEditingTag(null);
  }, [onEditTag, selectedTags, onTagsChange]);

  // Handle delete tag
  const handleDeleteConfirm = useCallback((tagName: string) => {
    onDeleteTag?.(tagName);
    // Remove from selected tags if it was selected
    if (selectedTags.includes(tagName)) {
      onTagsChange(selectedTags.filter(t => t !== tagName));
    }
    setDeletingTag(null);
  }, [onDeleteTag, selectedTags, onTagsChange]);

  // Render overflow menu via portal (to avoid z-index issues with parent dropdown)
  const renderOverflowMenu = () => {
    if (!overflowMenuTag) return null;

    return createPortal(
      <div
        ref={overflowMenuRef}
        className="fixed z-[10001] bg-white rounded-lg shadow-lg border border-[#CBD2D9] py-1 min-w-[100px]"
        style={{
          top: overflowMenuPosition.top,
          left: overflowMenuPosition.left,
          transform: "translate(-100%, -50%)",
          marginLeft: -4,
        }}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onMouseDown={(e) => {
            e.stopPropagation();
            e.preventDefault();
            const tagToEdit = overflowMenuTag;
            setOverflowMenuTag(null);
            setHoveredTag(null);
            setEditingTag(tagToEdit);
          }}
          className="w-full px-3 py-2 text-left text-[14px] font-optimistic text-[#1C2B33] hover:bg-[#F1F4F7] transition-colors"
        >
          Edit
        </button>
        <button
          type="button"
          onMouseDown={(e) => {
            e.stopPropagation();
            e.preventDefault();
            const tagToDelete = overflowMenuTag;
            setOverflowMenuTag(null);
            setHoveredTag(null);
            setDeletingTag(tagToDelete);
          }}
          className="w-full px-3 py-2 text-left text-[14px] font-optimistic text-[#1C2B33] hover:bg-[#F1F4F7] transition-colors"
        >
          Delete
        </button>
      </div>,
      document.body
    );
  };

  return (
    <>
      <div
        ref={cellRef}
        onClick={!isOpen ? handleOpen : undefined}
        className={`min-h-[28px] flex items-center rounded-[4px] border transition-colors w-full ${
          isOpen
            ? "px-2 py-1 border-[#0A78BE] bg-white ring-1 ring-[#0A78BE] cursor-text"
            : "px-1 py-1 -mx-1 -my-1 border-transparent hover:border-[rgba(10,120,190,0.4)] hover:bg-[rgba(10,120,190,0.05)] cursor-pointer"
        }`}
      >
        {isOpen ? renderOpenContent() : renderClosedContent()}
      </div>
      {renderDropdown()}
      {renderOverflowMenu()}
      
      {/* Edit Tag Modal */}
      <EditTagModal
        tagName={editingTag || ""}
        isOpen={!!editingTag}
        onClose={() => setEditingTag(null)}
        onSave={handleEditSave}
      />
      
      {/* Delete Tag Modal */}
      <DeleteTagModal
        tagName={deletingTag || ""}
        isOpen={!!deletingTag}
        onClose={() => setDeletingTag(null)}
        onDelete={handleDeleteConfirm}
      />
    </>
  );
}
