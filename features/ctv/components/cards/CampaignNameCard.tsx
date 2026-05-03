"use client";

import { useState } from "react";
import { Input } from "@/features/ctv/components/ui/Input";
import { Button } from "@/features/ctv/components/ui/Button";
import { Icon } from "@/features/ctv/components/ui/Icon";
import type { PrototypeVersion } from "./types";

interface CampaignNameCardProps {
  version: PrototypeVersion;
  className?: string;
}

export function CampaignNameCard({ version, className = "" }: CampaignNameCardProps) {
  const [campaignName, setCampaignName] = useState("New Sales campaign");

  return (
    <div className={`bg-white rounded-[4px] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.1),0px_0px_4px_0px_rgba(0,0,0,0.1)] p-4 w-[600px] ${className}`}>
      {/* Header with check icon */}
      <div className="flex items-center gap-2 mb-4">
        <Icon name="CheckCircle" variant="filled" size={16} className="text-[#006B4E]" />
        <h3 className="font-optimistic font-bold text-[16px] leading-[20px] text-[#1C2B33]">
          Campaign name
        </h3>
      </div>

      {/* Content */}
      <div className="flex gap-3 items-start">
        {/* Input - takes remaining space minus button width */}
        <div className="flex-1">
          <Input
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
            placeholder="Enter campaign name"
          />
        </div>

        {/* Create Template Button */}
        <Button variant="secondary">
          Create template
        </Button>
      </div>
    </div>
  );
}
