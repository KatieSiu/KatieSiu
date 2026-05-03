"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "./Button";
import { Icon } from "./Icon";
import { NumberInput } from "./NumberInput";

// ============================================
// Edit Frequency Modal Props
// ============================================
interface EditFrequencyModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when modal should close */
  onClose: () => void;
  /** Initial frequency values */
  initialFrequency?: {
    type: "target" | "cap";
    count: number;
    days: number;
  };
  /** Callback when frequency is saved - receives updated frequency data */
  onSave?: (frequency: {
    type: "target" | "cap";
    count: number;
    days: number;
  }) => void;
}

// ============================================
// Frequency Type Radio Option
// ============================================
interface FrequencyOptionProps {
  type: "target" | "cap";
  selected: boolean;
  onSelect: () => void;
}

function FrequencyOption({ type, selected, onSelect }: FrequencyOptionProps) {
  const isTarget = type === "target";
  
  return (
    <label 
      className="flex items-center gap-2 py-2 cursor-pointer rounded-[6px] hover:bg-[rgba(0,0,0,0.02)] transition-colors"
      onClick={onSelect}
    >
      {/* Radio Button */}
      <div 
        className={`
          w-6 h-6 rounded-full border shrink-0
          flex items-center justify-center
          ${selected ? "border-[rgba(70,90,105,0.6)]" : "border-[rgba(70,90,105,0.6)]"}
        `}
      >
        {selected && (
          <div className="w-3 h-3 rounded-full bg-[#1877F2]" />
        )}
      </div>

      {/* Thumbnail Icon */}
      <div className="w-8 h-8 rounded-[4px] overflow-hidden shrink-0 bg-[#E4E8EB]">
        {isTarget ? (
          // Target icon - ascending bars pattern
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="4" fill="#E4E8EB"/>
            <path d="M8 22V18H12V22H8Z" fill="#9AA8B2"/>
            <path d="M14 22V14H18V22H14Z" fill="#9AA8B2"/>
            <path d="M20 22V10H24V22H20Z" fill="#9AA8B2"/>
            <path d="M6 10L16 16L26 10" stroke="#1877F2" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        ) : (
          // Cap icon - descending bars with cap line
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="4" fill="#D4E4F2"/>
            <path d="M8 22V14H12V22H8Z" fill="#9AA8B2"/>
            <path d="M14 22V16H18V22H14Z" fill="#9AA8B2"/>
            <path d="M20 22V18H24V22H20Z" fill="#9AA8B2"/>
            <path d="M6 12H26" stroke="#1877F2" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 2"/>
          </svg>
        )}
      </div>

      {/* Label and Description */}
      <div className="flex flex-col">
        <span className="text-[14px] leading-[20px] text-[rgba(0,0,0,0.85)]">
          {isTarget ? "Target" : "Cap"}
        </span>
        <span className="text-[12px] leading-[16px] text-[#1C2B33]">
          {isTarget 
            ? "The average number of times per week you want people to see your ads" 
            : "The maximum number of times you want people to see your ads"
          }
        </span>
      </div>
    </label>
  );
}

// ============================================
// Main Edit Frequency Modal Component
// ============================================
export function EditFrequencyModal({ 
  isOpen, 
  onClose, 
  initialFrequency,
  onSave 
}: EditFrequencyModalProps) {
  const defaults = initialFrequency || { type: "cap" as const, count: 2, days: 7 };
  
  const [frequencyType, setFrequencyType] = useState<"target" | "cap">(defaults.type);
  const [frequencyCount, setFrequencyCount] = useState(defaults.count);
  const [frequencyDays, setFrequencyDays] = useState(defaults.days);

  const handleSave = () => {
    onSave?.({ 
      type: frequencyType, 
      count: frequencyCount, 
      days: frequencyDays 
    });
    onClose();
  };

  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen && initialFrequency) {
      setFrequencyType(initialFrequency.type);
      setFrequencyCount(initialFrequency.count);
      setFrequencyDays(initialFrequency.days);
    }
  }, [isOpen, initialFrequency]);

  if (!isOpen) return null;

  // Generate description text based on frequency type
  const descriptionText = frequencyType === "target"
    ? `On average, we'll aim for ${frequencyCount} impressions every ${frequencyDays} days.`
    : `As a maximum, we'll aim to stay under ${frequencyCount} impressions every ${frequencyDays} days.`;

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      aria-hidden="true"
    >
      <div
        role="dialog"
        aria-modal="true"
        className="bg-white rounded-[8px] shadow-[0px_8px_24px_4px_rgba(0,0,0,0.1),0px_2px_2px_0px_rgba(0,0,0,0.1)] w-[500px] max-w-[calc(100vw-80px)] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pl-4 pr-2 py-0 bg-white shrink-0">
          <div className="flex-1 flex flex-col justify-center py-4 pr-2 min-w-0">
            <h2 className="text-[20px] font-bold leading-[24px] text-[#1C2B33] font-optimistic">
              Edit frequency
            </h2>
          </div>
          <div className="flex items-start py-2">
            <button 
              className="p-3 hover:bg-[rgba(0,0,0,0.05)] rounded-[4px] transition-colors"
              onClick={onClose}
            >
              <Icon name="Close" variant="outlined" size={16} className="text-[#283943]" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 space-y-3">
          {/* Frequency Type Selection */}
          <div className="space-y-1">
            <FrequencyOption 
              type="target" 
              selected={frequencyType === "target"} 
              onSelect={() => setFrequencyType("target")} 
            />
            <FrequencyOption 
              type="cap" 
              selected={frequencyType === "cap"} 
              onSelect={() => setFrequencyType("cap")} 
            />
          </div>

          {/* Frequency Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            <NumberInput
              value={frequencyCount}
              onChange={setFrequencyCount}
              min={1}
              max={99}
              containerClassName="w-[100px]"
            />
            <span className="text-[14px] text-[rgba(0,0,0,0.85)]">times every</span>
            <NumberInput
              value={frequencyDays}
              onChange={setFrequencyDays}
              min={1}
              max={30}
              containerClassName="w-[100px]"
            />
            <span className="text-[14px] text-[rgba(0,0,0,0.85)]">days</span>
          </div>

          {/* Description Text */}
          <p className="text-[12px] leading-[16px] text-[#1C2B33]">
            {descriptionText}
          </p>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-2 px-4 pt-3 pb-4 bg-white shrink-0">
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>Save</Button>
        </div>
      </div>
    </div>,
    document.body
  );
}

// ============================================
// Export a Preview version for the Modal Gallery
// (Renders without portal/overlay for display purposes)
// ============================================
export function EditFrequencyModalPreview() {
  const [frequencyType, setFrequencyType] = useState<"target" | "cap">("cap");
  const [frequencyCount, setFrequencyCount] = useState(2);
  const [frequencyDays, setFrequencyDays] = useState(7);

  // Generate description text based on frequency type
  const descriptionText = frequencyType === "target"
    ? `On average, we'll aim for ${frequencyCount} impressions every ${frequencyDays} days.`
    : `As a maximum, we'll aim to stay under ${frequencyCount} impressions every ${frequencyDays} days.`;

  return (
    <div className="bg-white rounded-[8px] shadow-[0px_8px_24px_4px_rgba(0,0,0,0.1),0px_2px_2px_0px_rgba(0,0,0,0.1)] w-[500px] overflow-hidden">
      {/* Modal Header */}
      <div className="flex items-center justify-between pl-4 pr-2 py-0 bg-white shrink-0">
        <div className="flex-1 flex flex-col justify-center py-4 pr-2 min-w-0">
          <h2 className="text-[20px] font-bold leading-[24px] text-[#1C2B33] font-optimistic">
            Edit frequency
          </h2>
        </div>
        <div className="flex items-start py-2">
          <button className="p-3 hover:bg-[rgba(0,0,0,0.05)] rounded-[4px] transition-colors">
            <Icon name="Close" variant="outlined" size={16} className="text-[#283943]" />
          </button>
        </div>
      </div>

      {/* Modal Body */}
      <div className="p-4 space-y-3">
        {/* Frequency Type Selection */}
        <div className="space-y-1">
          <FrequencyOption 
            type="target" 
            selected={frequencyType === "target"} 
            onSelect={() => setFrequencyType("target")} 
          />
          <FrequencyOption 
            type="cap" 
            selected={frequencyType === "cap"} 
            onSelect={() => setFrequencyType("cap")} 
          />
        </div>

        {/* Frequency Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <NumberInput
            value={frequencyCount}
            onChange={setFrequencyCount}
            min={1}
            max={99}
            containerClassName="w-[100px]"
          />
          <span className="text-[14px] text-[rgba(0,0,0,0.85)]">times every</span>
          <NumberInput
            value={frequencyDays}
            onChange={setFrequencyDays}
            min={1}
            max={30}
            containerClassName="w-[100px]"
          />
          <span className="text-[14px] text-[rgba(0,0,0,0.85)]">days</span>
        </div>

        {/* Description Text */}
        <p className="text-[12px] leading-[16px] text-[#1C2B33]">
          {descriptionText}
        </p>
      </div>

      {/* Modal Footer */}
      <div className="flex items-center justify-end gap-2 px-4 pt-3 pb-4 bg-white shrink-0">
        <Button variant="secondary">Cancel</Button>
        <Button variant="primary">Save</Button>
      </div>
    </div>
  );
}

