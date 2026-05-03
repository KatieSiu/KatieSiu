"use client";

import { cn } from "@/features/ctv/lib/utils";
import { Button } from "@/features/ctv/components/ui/Button";
import { Input } from "@/features/ctv/components/ui/Input";
import { Icon } from "@/features/ctv/components/ui/Icon";

// ============================================
// Types
// ============================================
interface TextStepData {
  primaryText: string;
  headline: string;
  description: string;
  callToAction: string;
}

interface TextStepProps {
  data: TextStepData;
  onChange: (data: TextStepData) => void;
}

// ============================================
// Text Step Component
// ============================================
export function TextStep({ data, onChange }: TextStepProps) {
  const handleChange = (field: keyof TextStepData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6 max-w-[700px]">
      {/* Header info */}
      <p className="text-[14px] text-[#465A69] font-optimistic">
        Add multiple text options and we'll show the one we predict will perform best when your ad is delivered.
      </p>

      {/* Primary text */}
      <div className="space-y-2">
        <div className="flex items-center gap-1">
          <label className="text-[14px] font-bold leading-[20px] text-[#1C2B33] font-optimistic">
            Primary text
          </label>
          <Icon name="Info" variant="filled" size={16} className="text-[#465A69]" />
        </div>
        <Input
          placeholder="Tell people what your ad is about"
          value={data.primaryText}
          onChange={(e) => handleChange("primaryText", e.target.value)}
        />
        <div className="flex items-center gap-2">
          <Button variant="secondary" icon="Plus" iconVariant="outlined">
            Add text option
          </Button>
        </div>
      </div>

      {/* Headline */}
      <div className="space-y-2">
        <div className="flex items-center gap-1">
          <label className="text-[14px] font-bold leading-[20px] text-[#1C2B33] font-optimistic">
            Headline
          </label>
          <Icon name="Info" variant="filled" size={16} className="text-[#465A69]" />
        </div>
        <Input
          placeholder="Write a short headline"
          value={data.headline}
          onChange={(e) => handleChange("headline", e.target.value)}
        />
        <div className="flex items-center gap-2">
          <Button variant="secondary" icon="Plus" iconVariant="outlined">
            Add headline option
          </Button>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <div className="flex items-center gap-1">
          <label className="text-[14px] font-bold leading-[20px] text-[#1C2B33] font-optimistic">
            Description
          </label>
          <Icon name="Info" variant="filled" size={16} className="text-[#465A69]" />
        </div>
        <textarea
          placeholder="Include additional details"
          value={data.description}
          onChange={(e) => handleChange("description", e.target.value)}
          className={cn(
            "w-full min-h-[80px]",
            "bg-white",
            "border border-[#CBD2D9]",
            "rounded-[4px]",
            "px-3 py-2",
            "text-[14px] font-normal leading-[20px]",
            "text-[#1C2B33]",
            "font-optimistic",
            "placeholder:text-[rgba(28,43,51,0.65)]",
            "outline-none",
            "transition-colors",
            "focus:border-[#1877F2] focus:ring-1 focus:ring-[#1877F2]",
            "resize-none"
          )}
        />
      </div>

      {/* Call to action */}
      <div className="space-y-2">
        <div className="flex items-center gap-1">
          <label className="text-[14px] font-bold leading-[20px] text-[#1C2B33] font-optimistic">
            Call to action
          </label>
          <Icon name="Info" variant="filled" size={16} className="text-[#465A69]" />
        </div>
        <div className="relative">
          <select
            value={data.callToAction}
            onChange={(e) => handleChange("callToAction", e.target.value)}
            className={cn(
              "w-full h-[40px]",
              "bg-white",
              "border border-[#CBD2D9]",
              "rounded-[4px]",
              "px-3 py-2",
              "text-[14px] font-normal leading-[20px]",
              "text-[#1C2B33]",
              "font-optimistic",
              "outline-none",
              "transition-colors",
              "focus:border-[#1877F2] focus:ring-1 focus:ring-[#1877F2]",
              "appearance-none",
              "cursor-pointer"
            )}
          >
            <option value="shop_now">Shop now</option>
            <option value="learn_more">Learn more</option>
            <option value="sign_up">Sign up</option>
            <option value="subscribe">Subscribe</option>
            <option value="contact_us">Contact us</option>
            <option value="get_offer">Get offer</option>
          </select>
          <Icon
            name="SmallTriangleDown"
            variant="filled"
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#283943] pointer-events-none"
          />
        </div>
      </div>
    </div>
  );
}

export default TextStep;
