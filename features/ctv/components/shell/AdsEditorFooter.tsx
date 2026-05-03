"use client";

import Link from "next/link";
import type { EditorLevel } from "./CampaignStructurePanel";

interface AdsEditorFooterProps {
  currentLevel: EditorLevel;
  onBack: () => void;
  onNext: () => void;
  onClose?: () => void;
}

function SecondaryButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="h-9 px-3 bg-transparent border border-[#A7B3BF] rounded-[4px] font-optimistic font-medium text-[14px] leading-[20px] text-[#1C2B33] hover:bg-[#F8F9FB] transition-colors"
    >
      {children}
    </button>
  );
}

function PrimaryButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="h-9 px-3 bg-[#0A78BE] rounded-[4px] font-optimistic font-medium text-[14px] leading-[20px] text-white hover:bg-[#0061A0] transition-colors"
    >
      {children}
    </button>
  );
}

export function AdsEditorFooter({ 
  currentLevel, 
  onBack, 
  onNext,
  onClose 
}: AdsEditorFooterProps) {
  const isFirstLevel = currentLevel === "L3";
  const isLastLevel = currentLevel === "L1";

  return (
    <div className="bg-white border-t border-[#CBD2D9] flex flex-col gap-3 p-3">
      {/* Terms text - only on L1 */}
      {isLastLevel && (
        <p className="font-optimistic text-[14px] leading-[20px] text-[#1C2B33]">
          By clicking "Publish", you agree to Facebook's{" "}
          <span className="text-[#0A78BE] cursor-pointer hover:underline">
            Terms and Advertising Guidelines
          </span>
          .
        </p>
      )}

      {/* Buttons row */}
      <div className="flex items-center justify-between">
        {/* Left side - Close button */}
        <div className="flex items-center gap-2">
          {onClose ? (
            <SecondaryButton onClick={onClose}>Close</SecondaryButton>
          ) : (
            <Link href="/">
              <SecondaryButton>Close</SecondaryButton>
            </Link>
          )}
        </div>

        {/* Right side - Navigation buttons */}
        <div className="flex items-center gap-2">
          {!isFirstLevel && (
            <SecondaryButton onClick={onBack}>Back</SecondaryButton>
          )}
          <PrimaryButton onClick={onNext}>
            {isLastLevel ? "Publish" : "Next"}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
