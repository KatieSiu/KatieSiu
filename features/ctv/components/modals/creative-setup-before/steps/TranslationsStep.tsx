"use client";

import { cn } from "@/features/ctv/lib/utils";
import { Button } from "@/features/ctv/components/ui/Button";
import { Icon } from "@/features/ctv/components/ui/Icon";
import { Pill } from "@/features/ctv/components/ui/Pill";

// ============================================
// Types
// ============================================
interface TranslationsStepData {
  textEnabled: boolean;
  voiceEnabled: boolean;
  destinationsEnabled: boolean;
  selectedLanguages: string[];
}

interface TranslationsStepProps {
  data: TranslationsStepData;
  onChange: (data: TranslationsStepData) => void;
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
// Translation Option Component
// ============================================
interface TranslationOptionProps {
  title: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
  showInfoIcon?: boolean;
}

function TranslationOption({ title, description, enabled, onToggle, showInfoIcon = true }: TranslationOptionProps) {
  return (
    <div className="flex items-start gap-3 py-3">
      <ToggleSwitch enabled={enabled} onChange={onToggle} />
      <div className="flex-1">
        <div className="flex items-center gap-1">
          <span className="text-[14px] font-bold leading-[20px] text-[#1C2B33] font-optimistic">
            {title}
          </span>
          {showInfoIcon && (
            <Icon name="Info" variant="filled" size={16} className="text-[#465A69]" />
          )}
        </div>
        <p className="text-[14px] text-[#465A69] font-optimistic mt-0.5">
          {description}
        </p>
        <Button variant="secondary" className="mt-2">
          See details
        </Button>
      </div>
    </div>
  );
}

// ============================================
// Translations Step Component
// ============================================
export function TranslationsStep({ data, onChange }: TranslationsStepProps) {
  return (
    <div className="flex gap-6">
      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-[16px] font-bold leading-[20px] text-[#1C2B33] font-optimistic">
            Translations
          </h3>
          <p className="text-[14px] text-[#465A69] font-optimistic mt-1">
            Your audience includes people who speak multiple languages. Translating your ad will help to connect with them.
          </p>
        </div>

        {/* Languages Section */}
        <div className="bg-white rounded-[8px] border border-[#E4E8EB] p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1">
              <span className="text-[14px] font-bold leading-[20px] text-[#1C2B33] font-optimistic">
                Languages
              </span>
              <Icon name="Info" variant="filled" size={16} className="text-[#465A69]" />
            </div>
            <Pill variant="success">5 selected</Pill>
          </div>

          {/* Translation Options */}
          <div className="divide-y divide-[#E4E8EB]">
            <TranslationOption
              title="Text"
              description="Translate your ad text to reach people in their preferred language."
              enabled={data.textEnabled}
              onToggle={() => onChange({ ...data, textEnabled: !data.textEnabled })}
            />

            <TranslationOption
              title="Voice"
              description="Match your video ad experience to each language."
              enabled={data.voiceEnabled}
              onToggle={() => onChange({ ...data, voiceEnabled: !data.voiceEnabled })}
            />

            <TranslationOption
              title="Destinations"
              description="Match your video ad experience to each language."
              enabled={data.destinationsEnabled}
              onToggle={() => onChange({ ...data, destinationsEnabled: !data.destinationsEnabled })}
            />
          </div>
        </div>

        {/* Add your own assets */}
        <div className="bg-white rounded-[8px] border border-[#E4E8EB] p-4">
          <h4 className="text-[14px] font-bold leading-[20px] text-[#1C2B33] font-optimistic mb-1">
            Add your own assets · <span className="font-normal text-[#465A69]">Optional</span>
          </h4>
          <p className="text-[14px] text-[#465A69] font-optimistic mb-3">
            Customize your ad translations with your own files: subtitles, captions, voice-overs and images.
          </p>
          <Button variant="secondary">Upload</Button>
        </div>
      </div>

      {/* Preview Panel */}
      <div className="w-[400px] shrink-0">
        <div className="bg-white rounded-[8px] border border-[#E4E8EB] p-4">
          {/* Language Selector */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-[14px] text-[#465A69] font-optimistic">Previewing</span>
            <Button variant="secondary" dropdown>
              Japanese
            </Button>
          </div>

          {/* Preview Tabs */}
          <div className="grid grid-cols-3 gap-4">
            {/* Image ads */}
            <div className="text-center">
              <span className="text-[12px] text-[#465A69] font-optimistic block mb-2">Image ads</span>
              <div className="bg-[#F5F7F8] rounded-[4px] p-3 h-[200px] flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-[#E4E8EB]" />
                  <div>
                    <p className="text-[10px] font-bold text-[#1C2B33]">LaLueur Beauty</p>
                    <p className="text-[8px] text-[#465A69]">スポンサー</p>
                  </div>
                </div>
                <p className="text-[10px] text-[#1C2B33] mb-2">
                  自分の肌を愛して。想像力の力を解き放ちましょう。
                </p>
                <div className="flex-1 bg-[#E4E8EB] rounded" />
              </div>
              <span className="text-[10px] text-[#465A69] font-optimistic">1 of 6 images</span>
            </div>

            {/* Video */}
            <div className="text-center">
              <span className="text-[12px] text-[#465A69] font-optimistic block mb-2">Video</span>
              <div className="bg-[#F5F7F8] rounded-[4px] p-3 h-[200px] flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-[#E4E8EB]" />
                  <div>
                    <p className="text-[10px] font-bold text-[#1C2B33]">LaLueur Beauty</p>
                    <p className="text-[8px] text-[#465A69]">スポンサー</p>
                  </div>
                </div>
                <p className="text-[10px] text-[#1C2B33] mb-2">
                  自分の肌を愛して。想像力の力を解き放ちましょう。
                </p>
                <div className="flex-1 bg-[#E4E8EB] rounded flex items-center justify-center">
                  <Icon name="Video" variant="outlined" size={24} className="text-[#CBD2D9]" />
                </div>
                <Button variant="secondary" className="mt-2 text-[10px] h-auto py-1">
                  今すぐ購入
                </Button>
              </div>
              <span className="text-[10px] text-[#465A69] font-optimistic">1 of 6 videos</span>
            </div>

            {/* Destination */}
            <div className="text-center">
              <span className="text-[12px] text-[#465A69] font-optimistic block mb-2">Destination</span>
              <div className="bg-[#283943] rounded-[4px] p-3 h-[200px] flex flex-col">
                <div className="flex-1 flex flex-col justify-end">
                  <p className="text-[8px] text-[#A6E0D0] mb-1">lalueurbeauty 2h</p>
                  <p className="text-[8px] text-[#A6E0D0] mb-1">スポンサー</p>
                  <div className="bg-[#163029] rounded p-2 mb-2">
                    <p className="text-[8px] text-white">
                      自分の肌を愛して。想像力の力を解き放ちましょう。
                    </p>
                  </div>
                  <Button variant="secondary" className="text-[10px] h-auto py-1 bg-white">
                    今すぐ購入
                  </Button>
                </div>
              </div>
              <span className="text-[10px] text-[#465A69] font-optimistic">1 of 5: landing page</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TranslationsStep;
