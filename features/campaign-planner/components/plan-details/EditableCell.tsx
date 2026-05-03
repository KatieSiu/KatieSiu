"use client";

import React, { useState, useEffect } from "react";
import { colors } from "@/features/campaign-planner/lib/design-tokens";

// ============================================
// Editable Cell Component
// ============================================
interface EditableCellProps {
  value: string | number;
  displayValue: string;
  isEditing: boolean;
  onStartEdit: () => void;
  onSave: (value: string) => void;
  onCancel: () => void;
  type?: 'text' | 'number' | 'currency';
  disabled?: boolean;
  className?: string;
}

export function EditableCell({ 
  value, 
  displayValue, 
  isEditing, 
  onStartEdit, 
  onSave, 
  onCancel,
  type = 'text',
  disabled = false,
  className = ''
}: EditableCellProps) {
  const [editValue, setEditValue] = useState(String(value));

  // Reset edit value when starting to edit
  useEffect(() => {
    if (isEditing) {
      setEditValue(String(value));
    }
  }, [isEditing, value]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSave(editValue);
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  const isValid = type === 'number' || type === 'currency' 
    ? editValue === '' || !isNaN(Number(editValue.replace(/,/g, '')))
    : true;

  if (isEditing) {
    return (
      <div className="flex flex-col">
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            if (isValid) {
              onSave(editValue);
            } else {
              onCancel();
            }
          }}
          autoFocus
          className={`w-full h-[28px] px-2 text-[14px] font-optimistic rounded-[4px] outline-none ring-1 ${isValid ? 'ring-[#1877F2]' : 'ring-[#E02020]'}`}
          style={{
            color: colors.text.heading,
            backgroundColor: colors.background.content,
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: isValid ? colors.interactive.primary : colors.status.error,
          }}
        />
        {!isValid && (
          <span 
            className="text-[11px] mt-0.5 font-optimistic"
            style={{ color: colors.status.error }}
          >
            Invalid value
          </span>
        )}
      </div>
    );
  }

  if (disabled) {
    return (
      <span 
        className={`font-optimistic text-[14px] leading-[20px] ${className}`}
        style={{ color: 'rgba(0,0,0,0.75)' }}
      >
        {displayValue}
      </span>
    );
  }

  return (
    <span
      onClick={onStartEdit}
      data-inline-edit
      className={`inline-flex px-1.5 py-0.5 -mx-1.5 -my-0.5 rounded-[4px] cursor-pointer transition-all font-optimistic text-[14px] leading-[20px] hover:bg-[rgba(0,0,0,0.05)] ${className}`}
      style={{ color: 'rgba(0,0,0,0.75)' }}
    >
      {displayValue}
    </span>
  );
}

