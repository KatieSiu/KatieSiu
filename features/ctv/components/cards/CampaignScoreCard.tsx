"use client";

import { Icon } from "@/features/ctv/components/ui/Icon";
import type { PrototypeVersion } from "./types";

interface CampaignScoreCardProps {
  version: PrototypeVersion;
  className?: string;
  collapsed?: boolean;
  isTVMode?: boolean;
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path 
        fillRule="evenodd" 
        clipRule="evenodd" 
        d="M6 12C9.31371 12 12 9.31371 12 6C12 2.68629 9.31371 0 6 0C2.68629 0 0 2.68629 0 6C0 9.31371 2.68629 12 6 12ZM6 3C5.58579 3 5.25 3.33579 5.25 3.75C5.25 4.16421 5.58579 4.5 6 4.5C6.41421 4.5 6.75 4.16421 6.75 3.75C6.75 3.33579 6.41421 3 6 3ZM5.25 5.5C5.25 5.08579 5.58579 4.75 6 4.75C6.41421 4.75 6.75 5.08579 6.75 5.5V8.5C6.75 8.91421 6.41421 9.25 6 9.25C5.58579 9.25 5.25 8.91421 5.25 8.5V5.5Z" 
        fill="#283943"
      />
    </svg>
  );
}

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5L6 0Z" fill="currentColor"/>
    </svg>
  );
}

function ScoreRing() {
  return (
    <svg width="42" height="36" viewBox="0 0 42 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M33.7279 33.75C36.2453 31.2308 37.9596 28.0212 38.6541 24.5271C39.3487 21.0329 38.9922 17.4111 37.6298 14.1197C36.2674 10.8282 33.9603 8.01501 31.0003 6.03573C28.0402 4.05644 24.5601 3 21 3C17.4399 3 13.9598 4.05644 10.9997 6.03573C8.03966 8.01501 5.73255 10.8282 4.37018 14.1197C3.0078 17.4111 2.65134 21.0329 3.34587 24.5271C4.04041 28.0212 5.75474 31.2308 8.27208 33.75" stroke="#CBD2D9" strokeOpacity="0.5" strokeWidth="4" strokeLinecap="round"/>
      <path d="M33.7279 33.75C36.2453 31.2308 37.9596 28.0212 38.6541 24.5271C39.3487 21.0329 38.9922 17.4111 37.6298 14.1197C36.2674 10.8282 33.9603 8.01501 31.0003 6.03573C28.0402 4.05644 24.5601 3 21 3C17.4399 3 13.9598 4.05644 10.9997 6.03573C8.03966 8.01501 5.73255 10.8282 4.37018 14.1197C3.0078 17.4111 2.65134 21.0329 3.34587 24.5271C4.04041 28.0212 5.75474 31.2308 8.27208 33.75" stroke="#006B4E" strokeWidth="4" strokeLinecap="round"/>
      <path d="M10.7319 16.52L11.3694 17L8.85691 19.4375L7.62691 18.17L10.4169 15.5H12.7344V26H10.7319V16.52ZM15.38 20.75C15.38 19.905 15.4725 19.1475 15.6575 18.4775C15.8425 17.8075 16.1125 17.2375 16.4675 16.7675C16.8225 16.2925 17.2525 15.9325 17.7575 15.6875C18.2675 15.4375 18.8425 15.3125 19.4825 15.3125H19.685C20.33 15.3125 20.905 15.4375 21.41 15.6875C21.915 15.9325 22.345 16.2925 22.7 16.7675C23.055 17.2375 23.325 17.8075 23.51 18.4775C23.695 19.1475 23.7875 19.905 23.7875 20.75C23.7875 21.595 23.695 22.3525 23.51 23.0225C23.325 23.6925 23.055 24.265 22.7 24.74C22.345 25.21 21.915 25.57 21.41 25.82C20.905 26.065 20.33 26.1875 19.685 26.1875H19.4825C18.8425 26.1875 18.2675 26.065 17.7575 25.82C17.2525 25.57 16.8225 25.21 16.4675 24.74C16.1125 24.265 15.8425 23.6925 15.6575 23.0225C15.4725 22.3525 15.38 21.595 15.38 20.75ZM17.69 18.68C17.53 19.235 17.45 19.925 17.45 20.75C17.45 21.245 17.48 21.6925 17.54 22.0925C17.6 22.4875 17.6875 22.835 17.8025 23.135C17.9175 23.435 18.0575 23.685 18.2225 23.885C18.3875 24.085 18.575 24.2375 18.785 24.3425C19 24.4425 19.235 24.4925 19.49 24.4925H19.6775C20.1075 24.4925 20.4725 24.3525 20.7725 24.0725C21.0775 23.7925 21.31 23.375 21.47 22.82C21.635 22.265 21.7175 21.575 21.7175 20.75C21.7175 20.255 21.6875 19.81 21.6275 19.415C21.5675 19.015 21.48 18.665 21.365 18.365C21.255 18.065 21.1175 17.815 20.9525 17.615C20.7875 17.415 20.5975 17.265 20.3825 17.165C20.1675 17.06 19.9325 17.0075 19.6775 17.0075H19.49C19.065 17.0075 18.7 17.1475 18.395 17.4275C18.09 17.7075 17.855 18.125 17.69 18.68ZM25.4728 20.75C25.4728 19.905 25.5653 19.1475 25.7503 18.4775C25.9353 17.8075 26.2053 17.2375 26.5603 16.7675C26.9153 16.2925 27.3453 15.9325 27.8503 15.6875C28.3603 15.4375 28.9353 15.3125 29.5753 15.3125H29.7778C30.4228 15.3125 30.9978 15.4375 31.5028 15.6875C32.0078 15.9325 32.4378 16.2925 32.7928 16.7675C33.1478 17.2375 33.4178 17.8075 33.6028 18.4775C33.7878 19.1475 33.8803 19.905 33.8803 20.75C33.8803 21.595 33.7878 22.3525 33.6028 23.0225C33.4178 23.6925 33.1478 24.265 32.7928 24.74C32.4378 25.21 32.0078 25.57 31.5028 25.82C30.9978 26.065 30.4228 26.1875 29.7778 26.1875H29.5753C28.9353 26.1875 28.3603 26.065 27.8503 25.82C27.3453 25.57 26.9153 25.21 26.5603 24.74C26.2053 24.265 25.9353 23.6925 25.7503 23.0225C25.5653 22.3525 25.4728 21.595 25.4728 20.75ZM27.7828 18.68C27.6228 19.235 27.5428 19.925 27.5428 20.75C27.5428 21.245 27.5728 21.6925 27.6328 22.0925C27.6928 22.4875 27.7803 22.835 27.8953 23.135C28.0103 23.435 28.1503 23.685 28.3153 23.885C28.4803 24.085 28.6678 24.2375 28.8778 24.3425C29.0928 24.4425 29.3278 24.4925 29.5828 24.4925H29.7703C30.2003 24.4925 30.5653 24.3525 30.8653 24.0725C31.1703 23.7925 31.4028 23.375 31.5628 22.82C31.7278 22.265 31.8103 21.575 31.8103 20.75C31.8103 20.255 31.7803 19.81 31.7203 19.415C31.6603 19.015 31.5728 18.665 31.4578 18.365C31.3478 18.065 31.2103 17.815 31.0453 17.615C30.8803 17.415 30.6903 17.265 30.4753 17.165C30.2603 17.06 30.0253 17.0075 29.7703 17.0075H29.5828C29.1578 17.0075 28.7928 17.1475 28.4878 17.4275C28.1828 17.7075 27.9478 18.125 27.7828 18.68Z" fill="#1C2B33"/>
    </svg>
  );
}

function NullScoreRingLarge() {
  return (
    <div className="relative w-[54px] h-[46px]">
      <svg width="54" height="46" viewBox="0 0 54 46" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M43.5 43.5C46.75 40.25 49 36 50 31.5C51 27 50.5 22.5 48.75 18.25C47 14 44 10.5 40 7.75C36 5 31 3.5 27 3.5C23 3.5 18 5 14 7.75C10 10.5 7 14 5.25 18.25C3.5 22.5 3 27 4 31.5C5 36 7.25 40.25 10.5 43.5" stroke="#CBD2D9" strokeOpacity="0.5" strokeWidth="5" strokeLinecap="round"/>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-optimistic font-bold text-[16px] leading-[20px] text-[#1C2B33]">--</span>
      </div>
    </div>
  );
}

function NullScoreRingSmall() {
  return (
    <div className="relative w-[42px] h-[36px]">
      <svg width="42" height="36" viewBox="0 0 42 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M33.7279 33.75C36.2453 31.2308 37.9596 28.0212 38.6541 24.5271C39.3487 21.0329 38.9922 17.4111 37.6298 14.1197C36.2674 10.8282 33.9603 8.01501 31.0003 6.03573C28.0402 4.05644 24.5601 3 21 3C17.4399 3 13.9598 4.05644 10.9997 6.03573C8.03966 8.01501 5.73255 10.8282 4.37018 14.1197C3.0078 17.4111 2.65134 21.0329 3.34587 24.5271C4.04041 28.0212 5.75474 31.2308 8.27208 33.75" stroke="#CBD2D9" strokeOpacity="0.5" strokeWidth="4" strokeLinecap="round"/>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-optimistic font-bold text-[16px] leading-[20px] text-[#1C2B33]">--</span>
      </div>
    </div>
  );
}

export function CampaignScoreCard({ version, className = "", collapsed = false, isTVMode = false }: CampaignScoreCardProps) {
  // Render for "before" and "alpha-v1" versions
  if (version !== "before" && version !== "alpha-v1") {
    return null;
  }

  // TV Mode ON - Collapsed version (L1)
  if (isTVMode && collapsed) {
    return (
      <div className={`bg-white rounded-[6px] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.1),0px_0px_4px_0px_rgba(0,0,0,0.1)] p-2 flex items-center gap-2 ${className}`}>
        <NullScoreRingSmall />
        <div className="flex flex-col gap-1 flex-1">
          <div className="flex items-center gap-1">
            <span className="font-optimistic font-bold text-[15px] leading-[20px] text-[#1C2B33]">
              Campaign score
            </span>
            <InfoIcon />
          </div>
          <span className="font-sf-pro text-[14px] leading-[20px] text-[rgba(0,0,0,0.85)]">
            Score unavailable for TV campaigns
          </span>
        </div>
        <Icon name="SmallTriangleDown" variant="filled" size={16} className="text-[rgba(0,0,0,0.75)]" />
      </div>
    );
  }

  // TV Mode ON - Full version (L3/L2)
  if (isTVMode) {
    return (
      <div className={`bg-white rounded-[6px] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.1),0px_0px_4px_0px_rgba(0,0,0,0.1)] p-4 w-[350px] flex flex-col gap-4 ${className}`}>
        {/* Header with null score ring */}
        <div className="flex items-center gap-3">
          <NullScoreRingLarge />
          <div className="flex flex-col gap-1 w-[252px]">
            <div className="flex items-center gap-1">
              <span className="font-optimistic font-bold text-[18px] leading-[22px] text-[#1C2B33]">
                Campaign score
              </span>
              <InfoIcon />
            </div>
            <span className="font-optimistic text-[14px] leading-[20px] text-[#1C2B33]">
              Score unavailable for TV campaigns
            </span>
          </div>
        </div>
      </div>
    );
  }

  // TV Mode OFF - Collapsed version - simpler card with just header
  if (collapsed) {
    return (
      <div className={`bg-white rounded-[6px] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.1),0px_0px_4px_0px_rgba(0,0,0,0.1)] px-4 py-[10px] flex flex-col gap-4 ${className}`}>
        {/* Header with score ring */}
        <div className="flex items-center gap-3">
          <ScoreRing />
          <div className="flex flex-col gap-1 flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="font-optimistic font-bold text-[18px] leading-[22px] text-[#1C2B33]">
                  Campaign score
                </span>
                <InfoIcon />
              </div>
              <Icon name="SmallTriangleDown" variant="filled" size={16} className="text-[#283943]" />
            </div>
            <span className="font-optimistic text-[14px] leading-[20px] text-[#465A69]">
              You&apos;re using our recommended setup.
            </span>
          </div>
        </div>
      </div>
    );
  }

  // TV Mode OFF - Full version with ASC status and footer
  return (
    <div className={`bg-white rounded-[6px] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.1),0px_0px_4px_0px_rgba(0,0,0,0.1)] p-4 w-[350px] flex flex-col gap-4 ${className}`}>
      {/* Header with score ring */}
      <div className="flex items-center gap-3">
        <ScoreRing />
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <span className="font-optimistic font-bold text-[18px] leading-[22px] text-[#1C2B33]">
              Campaign score
            </span>
            <InfoIcon />
          </div>
          <span className="font-optimistic text-[14px] leading-[20px] text-[#1C2B33]">
            You&apos;re using our recommended setup.
          </span>
        </div>
      </div>

      {/* ASC Status */}
      <div className="flex items-center justify-between py-1">
        <div className="flex items-center gap-1">
          <SparkleIcon className="text-[#283943]" />
          <span className="font-optimistic font-bold text-[15px] leading-[20px] text-[rgba(0,0,0,0.75)]">
            Advantage+ sales campaign
          </span>
          <InfoIcon />
        </div>
        <div className="flex items-center gap-1">
          <span className="bg-[#EFF6EA] px-[6px] rounded-full font-optimistic font-bold text-[12px] leading-[16px] text-[#007E59]">
            On
          </span>
          <Icon name="CaretDown" variant="filled" size={16} className="text-[rgba(0,0,0,0.75)]" />
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-[#CBD2D9]" />

      {/* Footer */}
      <p className="font-optimistic text-[14px] leading-[20px] text-[#465A69] text-center">
        No additional recommendations available.
      </p>
    </div>
  );
}
