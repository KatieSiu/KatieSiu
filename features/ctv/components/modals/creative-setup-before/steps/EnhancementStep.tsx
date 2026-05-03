"use client";

import { cn } from "@/features/ctv/lib/utils";
import { Button } from "@/features/ctv/components/ui/Button";
import { TabBar } from "@/features/ctv/components/ui/TabBar";
import { Icon } from "@/features/ctv/components/ui/Icon";
import { Pill } from "@/features/ctv/components/ui/Pill";

// ============================================
// Types
// ============================================
interface Enhancement {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  isBeta?: boolean;
  exampleCount: number;
}

interface EnhancementStepData {
  enhancements: Enhancement[];
  flexMediaEnabled: boolean;
}

interface EnhancementStepProps {
  data: EnhancementStepData;
  onChange: (data: EnhancementStepData) => void;
}

// ============================================
// Toggle Switch Component
// ============================================
interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

function ToggleSwitch({ enabled, onChange }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
      className={cn(
        "relative inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors",
        enabled ? "bg-[#0A78BE]" : "bg-[#CBD2D9]"
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-lg ring-0 transition-transform",
          enabled ? "translate-x-[20px]" : "translate-x-0"
        )}
      />
    </button>
  );
}

// ============================================
// Enhancement Card Component
// ============================================
interface EnhancementCardProps {
  enhancement: Enhancement;
  onToggle: () => void;
}

function EnhancementCard({ enhancement, onToggle }: EnhancementCardProps) {
  return (
    <div className="bg-white rounded-[8px] border border-[#E4E8EB] p-4 w-[220px]">
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <ToggleSwitch enabled={enhancement.enabled} onChange={onToggle} />
          <span className="text-[14px] font-bold leading-[20px] text-[#1C2B33] font-optimistic">
            {enhancement.name}
          </span>
        </div>
      </div>

      {/* Tags */}
      <div className="flex items-center gap-1 mb-3">
        {enhancement.isBeta && <Pill variant="default">Beta</Pill>}
        <Pill variant="default">AI</Pill>
      </div>

      {/* Preview Placeholder */}
      <div className="bg-[#F5F7F8] rounded-[4px] h-[200px] flex items-center justify-center mb-3">
        <Icon name="Photo" variant="outlined" size={32} className="text-[#CBD2D9]" />
      </div>

      {/* Description */}
      <p className="text-[12px] text-[#465A69] font-optimistic mb-3">
        {enhancement.description}
      </p>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-4 mb-3">
        <button className="p-1 hover:bg-[#F5F7F8] rounded">
          <Icon name="CaretLeftSmall" variant="outlined" size={16} className="text-[#465A69]" />
        </button>
        <span className="text-[12px] text-[#465A69] font-optimistic">
          Example 1 of {enhancement.exampleCount}
        </span>
        <button className="p-1 hover:bg-[#F5F7F8] rounded">
          <Icon name="CaretRight" variant="outlined" size={16} className="text-[#465A69]" />
        </button>
      </div>

      {/* Customize button */}
      <Button variant="secondary" className="w-full">
        Customize
      </Button>
    </div>
  );
}

// ============================================
// Enhancement Step Component
// ============================================
export function EnhancementStep({ data, onChange }: EnhancementStepProps) {
  const handleEnhancementToggle = (id: string) => {
    onChange({
      ...data,
      enhancements: data.enhancements.map((e) =>
        e.id === id ? { ...e, enabled: !e.enabled } : e
      ),
    });
  };

  const forReviewCount = data.enhancements.filter((e) => e.enabled).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h3 className="text-[16px] font-bold leading-[20px] text-[#1C2B33] font-optimistic">
          Review Advantage+ creative enhancements
        </h3>
        <p className="text-[14px] text-[#465A69] font-optimistic mt-1">
          Use enhancements to create variations of your ad we'll show when they're more likely to resonate with people who see it. Some enhancements may be on by default.
        </p>
      </div>

      {/* Tabs */}
      <TabBar value="for-review" onChange={() => {}}>
        <TabBar.Tab value="for-review" label={`For review (${forReviewCount})`} />
        <TabBar.Tab value="media" label="Media (5)" />
        <TabBar.Tab value="text" label="Text (5)" />
        <TabBar.Tab value="interactivity" label="Interactivity (4)" />
      </TabBar>

      {/* Section Title */}
      <h4 className="text-[14px] font-medium leading-[20px] text-[#1C2B33] font-optimistic">
        For review
      </h4>

      {/* Enhancement Cards Grid */}
      <div className="flex flex-wrap gap-4">
        {data.enhancements.map((enhancement) => (
          <EnhancementCard
            key={enhancement.id}
            enhancement={enhancement}
            onToggle={() => handleEnhancementToggle(enhancement.id)}
          />
        ))}
      </div>

      {/* Flex Media Section */}
      <div className="bg-white rounded-[8px] border border-[#E4E8EB] p-4 mt-4">
        <div className="flex items-center gap-3">
          <ToggleSwitch
            enabled={data.flexMediaEnabled}
            onChange={(enabled) => onChange({ ...data, flexMediaEnabled: enabled })}
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-bold leading-[20px] text-[#1C2B33] font-optimistic">
                Flex media
              </span>
              <Pill variant="default">AI</Pill>
            </div>
          </div>
        </div>
        
        {/* Preview placeholder */}
        <div className="mt-3 bg-[#F5F7F8] rounded-[4px] h-[60px] flex items-center justify-center">
          <Icon name="Photo" variant="outlined" size={24} className="text-[#CBD2D9]" />
        </div>
      </div>
    </div>
  );
}

export default EnhancementStep;
