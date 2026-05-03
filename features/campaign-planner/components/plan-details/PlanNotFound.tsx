"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/features/campaign-planner/components/ui/Button";
import { Icon } from "@/features/campaign-planner/components/ui/Icon";
import { colors } from "@/features/campaign-planner/lib/design-tokens";

// ============================================
// Plan Not Found Component
// ============================================
export function PlanNotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-4">
      <div className="w-[150px] h-[150px]">
        <svg viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <rect x="30" y="40" width="90" height="70" rx="4" fill="#FEE2E2" stroke={colors.status.error} strokeWidth="2"/>
          <circle cx="75" cy="70" r="20" fill="#FEE2E2" stroke={colors.status.error} strokeWidth="2"/>
          <path d="M68 63L82 77M82 63L68 77" stroke={colors.status.error} strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
      <div className="flex flex-col items-center gap-1 text-center w-[348px] pt-[10px]">
        <h2 
          className="font-optimistic font-bold text-[15px] leading-[20px]"
          style={{ color: colors.text.heading }}
        >
          Plan Not Found
        </h2>
        <p 
          className="font-optimistic font-medium text-[14px] leading-[20px]"
          style={{ color: colors.text.heading }}
        >
          The plan you&apos;re looking for doesn&apos;t exist or may have been deleted.
        </p>
      </div>
      <Button variant="primary" onClick={() => router.push("/campaign-planner/prototype")}>
        <Icon name="ArrowLeft" variant="outlined" size={16} />
        Back to All Plans
      </Button>
    </div>
  );
}

