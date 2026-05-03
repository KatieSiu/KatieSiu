"use client";

import { useState } from "react";
import Image from "next/image";
import { Icon } from "@/features/ctv/components/ui/Icon";
import type { PrototypeVersion } from "./types";

interface AwarenessCardProps {
  version: PrototypeVersion;
  className?: string;
  isTVMode?: boolean;
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path 
        fillRule="evenodd" 
        clipRule="evenodd" 
        d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM11.7071 6.70711C12.0976 6.31658 12.0976 5.68342 11.7071 5.29289C11.3166 4.90237 10.6834 4.90237 10.2929 5.29289L7 8.58579L5.70711 7.29289C5.31658 6.90237 4.68342 6.90237 4.29289 7.29289C3.90237 7.68342 3.90237 8.31658 4.29289 8.70711L6.29289 10.7071C6.68342 11.0976 7.31658 11.0976 7.70711 10.7071L11.7071 6.70711Z" 
        fill="#007E59"
      />
    </svg>
  );
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path 
        fillRule="evenodd" 
        clipRule="evenodd" 
        d="M6 12C9.31371 12 12 9.31371 12 6C12 2.68629 9.31371 0 6 0C2.68629 0 0 2.68629 0 6C0 9.31371 2.68629 12 6 12ZM6.75 3.75C6.75 4.16421 6.41421 4.5 6 4.5C5.58579 4.5 5.25 4.16421 5.25 3.75C5.25 3.33579 5.58579 3 6 3C6.41421 3 6.75 3.33579 6.75 3.75ZM5.25 5.25C5.25 5.66421 5.58579 6 6 6C6.41421 6 6.75 6.33579 6.75 6.75V8.25C6.75 8.66421 6.41421 9 6 9C5.58579 9 5.25 8.66421 5.25 8.25V6.75C5.25 6.33579 5.58579 6 6 6C5.58579 6 5.25 5.66421 5.25 5.25Z" 
        fill="#283943"
      />
    </svg>
  );
}

function TriangleDownIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M4 6L8 10L12 6" stroke="#283943" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function TriangleUpIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M4 10L8 6L12 10" stroke="#0A78BE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M8 3V13M3 8H13" stroke="#283943" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function PlusCircleIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="8" cy="8" r="7" stroke="#1C2B33" strokeWidth="1.5"/>
      <path d="M8 5V11M5 8H11" stroke="#1C2B33" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function ChevronUpIcon({ className }: { className?: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M3 7.5L6 4.5L9 7.5" stroke="rgba(0,0,0,0.75)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M3 4.5L6 7.5L9 4.5" stroke="rgba(0,0,0,0.75)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function TargetFrequencyIcon() {
  return (
    <div className="w-8 h-8 rounded bg-[#F5F7FA] flex items-center justify-center overflow-hidden">
      <Image 
        src="/icons/TargetFrequency.png" 
        alt="Target frequency" 
        width={32} 
        height={32}
        className="object-contain"
      />
    </div>
  );
}

function FrequencyCapIcon() {
  return (
    <div className="w-8 h-8 rounded bg-[#F5F7FA] flex items-center justify-center overflow-hidden">
      <Image 
        src="/icons/FrequencyCap.png" 
        alt="Frequency cap" 
        width={32} 
        height={32}
        className="object-contain"
      />
    </div>
  );
}

interface NumericInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

function NumericInput({ value, onChange, min = 1, max = 99 }: NumericInputProps) {
  const increment = () => {
    if (value < max) onChange(value + 1);
  };
  
  const decrement = () => {
    if (value > min) onChange(value - 1);
  };

  return (
    <div className="flex items-center h-[34px] border border-[rgba(0,0,0,0.15)] rounded-[6px] bg-white px-3 py-[7px] w-[70px]">
      <span className="flex-1 text-[14px] leading-[20px] text-[rgba(0,0,0,0.85)]">
        {value}
      </span>
      <div className="flex flex-col">
        <button onClick={increment} className="h-3 flex items-center justify-center hover:bg-gray-100 rounded">
          <ChevronUpIcon />
        </button>
        <button onClick={decrement} className="h-3 flex items-center justify-center hover:bg-gray-100 rounded">
          <ChevronDownIcon />
        </button>
      </div>
    </div>
  );
}

export function AwarenessCard({ version, className = "", isTVMode = false }: AwarenessCardProps) {
  const [frequencyType, setFrequencyType] = useState<"target" | "cap">("target");
  const [frequencyTimes, setFrequencyTimes] = useState(2);
  const [frequencyDays, setFrequencyDays] = useState(7);
  const [showMoreSettings, setShowMoreSettings] = useState(true);

  if (version !== "before" && version !== "alpha-v1") {
    return null;
  }

  return (
    <div className={`bg-white rounded-[4px] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.1),0px_0px_4px_0px_rgba(0,0,0,0.1)] p-4 w-[600px] flex flex-col gap-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-2 h-5">
        <CheckCircleIcon />
        <span className="font-optimistic font-bold text-[16px] leading-[20px] text-[#1C2B33]">
          Awareness
        </span>
      </div>

      {/* Performance goal */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1 pb-1">
          <span className="font-optimistic font-bold text-[15px] leading-[20px] text-[#1C2B33]">
            Performance goal
          </span>
          <InfoIcon />
        </div>
        <div className="relative">
          <div className="flex items-center justify-between h-9 px-3 border border-[#CBD2D9] rounded bg-white cursor-pointer">
            <span className="text-[14px] leading-[20px] text-[#1C2B33]">
              Maximize reach of ads
            </span>
            <TriangleDownIcon />
          </div>
        </div>
      </div>

      {/* Helper text */}
      <p className="text-[12px] leading-[16px] text-[rgba(28,43,51,0.6)]">
        To help us improve delivery, we may survey a small section of your audience.
      </p>

      {/* Facebook Page */}
      <div className="flex gap-2 items-end">
        <div className="flex-1 flex flex-col gap-1">
          <span className="font-optimistic font-bold text-[15px] leading-[20px] text-[#1C2B33] pb-1">
            Facebook Page
          </span>
          <div className="flex items-center justify-between h-9 px-3 border border-[#CBD2D9] rounded bg-white cursor-pointer">
            <span className="text-[14px] leading-[20px] text-[rgba(28,43,51,0.65)]">
              Select Page
            </span>
            <TriangleDownIcon />
          </div>
        </div>
        <button className="flex items-center justify-center h-9 w-9 border border-[#A7B3BF] rounded bg-white hover:bg-gray-50">
          <PlusIcon />
        </button>
      </div>

      {/* Cost per result goal */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1 pb-1">
          <span className="font-optimistic font-bold text-[15px] leading-[20px] text-[#1C2B33]">
            Cost per result goal
          </span>
          <span className="text-[14px] leading-[20px] text-[rgba(28,43,51,0.65)]">∙</span>
          <span className="font-optimistic font-bold text-[15px] leading-[20px] text-[rgba(28,43,51,0.65)]">
            Optional
          </span>
        </div>
        <div className="flex items-center justify-between h-9 px-3 border border-[#CBD2D9] rounded bg-white">
          <span className="text-[14px] leading-[20px] text-[rgba(28,43,51,0.65)]">
            $X.XX
          </span>
          <span className="text-[14px] leading-[20px] text-[rgba(28,43,51,0.65)]">
            USD
          </span>
        </div>
        <p className="text-[12px] leading-[16px] text-[#1C2B33] pt-1">
          Meta will aim to spend your entire budget and get the most 1,000 impressions using the highest-volume bid strategy. If keeping the average cost per result around a certain amount is important, enter a cost per result goal.
        </p>
      </div>

      {/* Frequency control */}
      {!isTVMode && (
        <div className="flex flex-col gap-0">
          <div className="flex items-center gap-1">
            <span className="font-bold text-[14px] leading-[20px] text-[rgba(0,0,0,0.75)]">
              Frequency control
            </span>
            <InfoIcon />
          </div>

          {/* Target option */}
          <div 
            className="flex items-center gap-2 py-2 cursor-pointer"
            onClick={() => setFrequencyType("target")}
          >
            <div className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 ${
              frequencyType === "target" ? "border-[rgba(70,90,105,0.6)]" : "border-[rgba(70,90,105,0.6)]"
            }`}>
              {frequencyType === "target" && (
                <div className="w-3 h-3 rounded-full bg-[#1877F2]" />
              )}
            </div>
            <TargetFrequencyIcon />
            <div className="flex flex-col">
              <span className="text-[14px] leading-[20px] text-[rgba(0,0,0,0.85)]">
                Target
              </span>
              <span className="text-[12px] leading-[16px] text-[#1C2B33]">
                The average number of times per week you want people to see your ads
              </span>
            </div>
          </div>

          {/* Cap option */}
          <div 
            className="flex items-center gap-2 py-2 cursor-pointer"
            onClick={() => setFrequencyType("cap")}
          >
            <div className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 ${
              frequencyType === "cap" ? "border-[rgba(70,90,105,0.6)]" : "border-[rgba(70,90,105,0.6)]"
            }`}>
              {frequencyType === "cap" && (
                <div className="w-3 h-3 rounded-full bg-[#1877F2]" />
              )}
            </div>
            <FrequencyCapIcon />
            <div className="flex flex-col">
              <span className="text-[14px] leading-[20px] text-[rgba(0,0,0,0.85)]">
                Cap
              </span>
              <span className="text-[12px] leading-[16px] text-[#1C2B33]">
                The maximum number of times you want people to see your ads
              </span>
            </div>
          </div>

          {/* Frequency inputs */}
          <div className="flex items-center gap-2 mt-2">
            <NumericInput value={frequencyTimes} onChange={setFrequencyTimes} />
            <span className="text-[14px] leading-[20px] text-[rgba(0,0,0,0.85)]">times every</span>
            <NumericInput value={frequencyDays} onChange={setFrequencyDays} />
            <span className="text-[14px] leading-[20px] text-[rgba(0,0,0,0.85)]">days</span>
          </div>

          <p className="text-[12px] leading-[16px] text-[#1C2B33] mt-2">
            {frequencyType === "target" 
              ? `To help achieve your target, we'll aim to deliver about ${frequencyTimes} impressions every ${frequencyDays} days.`
              : `As a maximum, we'll aim to stay under ${frequencyTimes} impressions every ${frequencyDays} days.`
            }
          </p>
        </div>
      )}

      {/* TV Mode - Frequency control disabled */}
      {isTVMode && (
        <div className="flex flex-col py-1 opacity-50">
          <div className="flex items-center gap-1">
            <span className="font-bold text-[14px] leading-[20px] text-[#465A69]">
              Frequency control
            </span>
            <InfoIcon />
          </div>
          <span className="text-[14px] leading-[20px] text-[#465A69]">
            Not available for Connected TV
          </span>
        </div>
      )}

      {/* Value rules */}
      <div className="flex flex-col gap-2 py-1">
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="font-bold text-[14px] leading-[20px] text-[rgba(0,0,0,0.75)]">
              Value rules
            </span>
            <InfoIcon />
          </div>
          <p className="text-[12px] leading-[16px] text-[#1C2B33]">
            Tell us how much more certain audiences, conversion locations and placements are worth to your business. Our system will optimize for outcomes based on these rules.{" "}
            <span className="text-[#0A78BE] cursor-pointer hover:underline">About value rules</span>
          </p>
        </div>
        <button className="flex items-center gap-2 h-9 px-3 border border-[#A7B3BF] rounded bg-white hover:bg-gray-50 w-fit">
          <PlusCircleIcon />
          <span className="font-medium text-[14px] leading-[20px] text-[#1C2B33]">
            Create a rule set
          </span>
        </button>
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-[#CBD2D9]" />

      {/* Hide/Show settings toggle */}
      <button
        className="flex items-center gap-1 text-[#0A78BE] font-medium text-[14px] leading-[20px] hover:underline w-fit"
        onClick={() => setShowMoreSettings(!showMoreSettings)}
      >
        <span>{showMoreSettings ? "Hide settings" : "Show more settings"}</span>
        {showMoreSettings ? <TriangleUpIcon /> : <TriangleDownIcon />}
      </button>

      {/* Expanded Settings - Delivery Type */}
      {showMoreSettings && (
        <div className="flex flex-col py-1">
          <div className="flex items-center gap-1">
            <span className="font-bold text-[14px] leading-[20px] text-[rgba(0,0,0,0.75)]">
              Delivery Type
            </span>
            <InfoIcon />
          </div>
          <span className="text-[14px] leading-[20px] text-[#1C2B33]">
            Standard
          </span>
        </div>
      )}
    </div>
  );
}
