"use client";

import React, { useState, useEffect } from "react";
import { Icon } from "@/features/campaign-planner/components/ui/Icon";
import { colors } from "@/features/campaign-planner/lib/design-tokens";

// ============================================
// Action Tile (Stat Card) - With Inline Editing
// ============================================
interface ActionTileProps {
  icon: string;
  value: string | number;
  displayValue: string;
  label: string;
  isEditing?: boolean;
  onStartEdit?: () => void;
  onSave?: (value: string) => void;
  onCancel?: () => void;
  type?: 'text' | 'number' | 'currency';
}

export function ActionTile({ 
  icon, 
  value, 
  displayValue,
  label, 
  isEditing = false,
  onStartEdit,
  onSave,
  onCancel,
  type = 'text'
}: ActionTileProps) {
  const [editValue, setEditValue] = useState(String(value));

  // Reset edit value when starting to edit
  useEffect(() => {
    if (isEditing) {
      setEditValue(String(value));
    }
  }, [isEditing, value]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSave?.(editValue);
    } else if (e.key === 'Escape') {
      onCancel?.();
    }
  };

  const isValid = type === 'number' || type === 'currency' 
    ? editValue === '' || !isNaN(Number(editValue.replace(/,/g, '')))
    : true;

  // Handle card click - only trigger edit when not already editing
  const handleCardClick = () => {
    if (!isEditing && onStartEdit) {
      onStartEdit();
    }
  };

  // Track hover state for consistent color changes
  const [isHovered, setIsHovered] = useState(false);
  
  // Determine colors based on editing/hover state
  const activeBlue = colors.interactive.primaryHover;
  const shouldShowBlue = isEditing || isHovered;

  return (
    <div 
      className="flex-1 border rounded-[8px] p-3 flex flex-col gap-2 transition-all duration-150 cursor-pointer"
      style={{
        backgroundColor: shouldShowBlue ? colors.interactive.hoverBg : colors.background.content,
        borderColor: shouldShowBlue ? activeBlue : colors.border.card,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Icon + Edit indicator */}
      <div className="flex items-center justify-between">
        <Icon
          name={icon}
          variant="filled"
          size={20}
          color={shouldShowBlue ? colors.interactive.primaryHover : colors.icon.default}
          className="transition-colors duration-150"
        />
        {/* Pencil icon - appears on hover when not editing */}
        {!isEditing && onStartEdit && (
          <Icon
            name="Pencil"
            variant="outlined"
            size={16}
            color={colors.interactive.primaryHover}
            className={`transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}
          />
        )}
      </div>
      
      {/* Value + Edit - Fixed height container to prevent jumping */}
      <div className="flex flex-col gap-0.5">
        {/* Value container - fixed height of 20px to match text line height */}
        <div className="h-[20px] flex items-center">
          {isEditing ? (
            <div className="w-full" onClick={(e) => e.stopPropagation()}>
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={() => {
                  if (isValid) {
                    onSave?.(editValue);
                  } else {
                    onCancel?.();
                  }
                }}
                autoFocus
                className="w-full h-[20px] px-1 text-[14px] font-optimistic font-medium rounded-[2px] outline-none"
                style={{ 
                  color: colors.text.primary,
                  backgroundColor: colors.background.content,
                  borderWidth: 1,
                  borderStyle: 'solid',
                  borderColor: isValid ? activeBlue : colors.status.error,
                }}
              />
            </div>
          ) : (
            <span 
              className="font-optimistic font-medium text-[14px] leading-[20px] transition-colors duration-150"
              style={{ color: shouldShowBlue ? activeBlue : colors.text.primary }}
            >
              {displayValue}
            </span>
          )}
        </div>
        <span 
          className="font-optimistic text-[12px] leading-[16px] transition-colors duration-150"
          style={{ color: shouldShowBlue ? activeBlue : colors.text.muted }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

