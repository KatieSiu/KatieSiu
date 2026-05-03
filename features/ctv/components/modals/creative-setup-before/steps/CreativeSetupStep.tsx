"use client";

import { useState } from "react";
import { cn } from "@/features/ctv/lib/utils";
import { Checkbox } from "@/features/ctv/components/ui/Checkbox";
import { Icon } from "@/features/ctv/components/ui/Icon";
import { IconButton } from "@/features/ctv/components/ui/Button";

// ============================================
// Types
// ============================================
interface CreativeSetupData {
  siteLinks: boolean;
  catalogItems: boolean;
  summary: boolean;
  websiteHighlights: boolean;
  sellingPoints: boolean;
  promotions: boolean;
  branding: boolean;
}

interface CreativeSetupStepProps {
  data: CreativeSetupData;
  onChange: (data: CreativeSetupData) => void;
}

// ============================================
// Mock Data
// ============================================
const siteLinksData = ["Best Sellers", "Sensitive Skin", "Eyes", "Body Care", "+3"];
const catalogItemsData = ["Catalog: Global", "Skincare Spring Collection"];
const summaryText = "LaLueur Hydrating Moisturizer provides long-lasting hydration for a radiant glow, perfect for daily use on normal to dry skin.";
const websiteHighlightsData = ["LaLuer Complete + Hydrating Lotion Sensitive", "+4"];
const sellingPointsData = ["Clinically proven", "Lightweight formula", "Long lasting"];
const promotionsData = ["Promo codes: Automatically source codes", "Email sign-up offer: 20% off"];

// ============================================
// Section Component
// ============================================
interface SectionProps {
  title: string;
  isChecked: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  hasAI?: boolean;
  showEditIcon?: boolean;
}

function Section({ title, isChecked, onToggle, children, hasAI, showEditIcon = true }: SectionProps) {
  return (
    <div className="flex gap-3">
      <div className="pt-0.5">
        <Checkbox
          value={title}
          label=""
          checked={isChecked}
          onChange={onToggle}
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-1 mb-1">
          <span className="text-[15px] font-bold leading-[20px] text-[#1C2B33] font-optimistic">
            {title}
          </span>
          {hasAI && (
            <span className="flex items-center gap-0.5 text-[#0A78BE]">
              <Icon name="GenAIStar" variant="filled" size={12} />
              <span className="text-[12px] font-medium">AI</span>
            </span>
          )}
        </div>
        <div className="text-[14px] text-[#465A69] font-optimistic">
          {children}
        </div>
      </div>
      {showEditIcon && (
        <div className="shrink-0">
          <IconButton
            icon="Pencil"
            iconVariant="outlined"
            variant="flat"
            aria-label={`Edit ${title}`}
          />
        </div>
      )}
    </div>
  );
}

// ============================================
// Token/Tag Component
// ============================================
interface TokenProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
}

function Token({ children, icon }: TokenProps) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-[#F5F7F8] rounded-[4px] text-[14px] text-[#1C2B33] font-optimistic">
      {icon}
      {children}
    </span>
  );
}

// ============================================
// Creative Setup Step Component
// ============================================
export function CreativeSetupStep({ data, onChange }: CreativeSetupStepProps) {
  const handleToggle = (key: keyof CreativeSetupData) => {
    onChange({ ...data, [key]: !data[key] });
  };

  return (
    <div className="flex gap-6 h-full">
      {/* Main Content */}
      <div className="flex-1 space-y-4">
        {/* Product or service section */}
        <div className="bg-white rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.1)] p-4">
          {/* Section Header with Icon */}
          <div className="flex items-center gap-2 mb-3">
            <Icon name="ShoppingBag" variant="outlined" size={20} className="text-[#465A69]" />
            <h3 className="text-[15px] font-bold leading-[20px] text-[#1C2B33] font-optimistic">
              Product or service you&apos;re advertising
            </h3>
          </div>
          
          {/* Divider */}
          <div className="border-b border-[#E4E8EB] mb-4" />
          
          <div className="space-y-4">
            <Section
              title="Site links"
              isChecked={data.siteLinks}
              onToggle={() => handleToggle("siteLinks")}
            >
              <div className="flex flex-wrap gap-2 mt-1">
                {siteLinksData.map((item, i) => (
                  <Token 
                    key={i}
                    icon={i < 4 ? <span className="w-4 h-4 rounded bg-[#E8B4A8] shrink-0" /> : undefined}
                  >
                    {item}
                  </Token>
                ))}
              </div>
            </Section>

            <Section
              title="Catalog items"
              isChecked={data.catalogItems}
              onToggle={() => handleToggle("catalogItems")}
            >
              <div className="flex flex-wrap gap-2 mt-1">
                {catalogItemsData.map((item, i) => (
                  <Token key={i}>{item}</Token>
                ))}
              </div>
            </Section>

            <Section
              title="Summary"
              isChecked={data.summary}
              onToggle={() => handleToggle("summary")}
              hasAI
            >
              <p className="mt-1">{summaryText}</p>
            </Section>

            <Section
              title="Website highlights"
              isChecked={data.websiteHighlights}
              onToggle={() => handleToggle("websiteHighlights")}
            >
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="w-5 h-5 rounded bg-[#E8B4A8] shrink-0" />
                {websiteHighlightsData.map((item, i) => (
                  <span key={i} className="text-[14px] text-[#465A69]">{item}</span>
                ))}
              </div>
            </Section>
          </div>
        </div>

        {/* Messaging section */}
        <div className="bg-white rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.1)] p-4">
          {/* Section Header with Icon */}
          <div className="flex items-center gap-2 mb-3">
            <Icon name="MessageEmoji" variant="outlined" size={20} className="text-[#465A69]" />
            <h3 className="text-[15px] font-bold leading-[20px] text-[#1C2B33] font-optimistic">
              Messaging about your product or service
            </h3>
          </div>
          
          {/* Divider */}
          <div className="border-b border-[#E4E8EB] mb-4" />
          
          <div className="space-y-4">
            <Section
              title="Selling points"
              isChecked={data.sellingPoints}
              onToggle={() => handleToggle("sellingPoints")}
              hasAI
            >
              <div className="flex flex-wrap gap-2 mt-1">
                {sellingPointsData.map((item, i) => (
                  <Token key={i}>{item}</Token>
                ))}
              </div>
            </Section>

            <Section
              title="Promotions"
              isChecked={data.promotions}
              onToggle={() => handleToggle("promotions")}
            >
              <div className="flex flex-wrap gap-2 mt-1">
                {promotionsData.map((item, i) => (
                  <Token key={i}>{item}</Token>
                ))}
              </div>
            </Section>
          </div>
        </div>

        {/* Creative settings section */}
        <div className="bg-white rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.1)] p-4">
          {/* Section Header with Icon */}
          <div className="flex items-center gap-2 mb-3">
            <Icon name="Settings" variant="outlined" size={20} className="text-[#465A69]" />
            <h3 className="text-[15px] font-bold leading-[20px] text-[#1C2B33] font-optimistic">
              Creative settings
            </h3>
          </div>
          
          {/* Divider */}
          <div className="border-b border-[#E4E8EB] mb-4" />
          
          <Section
            title="Branding"
            isChecked={data.branding}
            onToggle={() => handleToggle("branding")}
          >
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[14px] text-[#465A69]">Logos:</span>
              <div className="w-6 h-6 rounded bg-[#163029]" />
              <span className="text-[14px] text-[#465A69]">Font: Trade Gothic</span>
              <span className="text-[14px] text-[#465A69]">Colors:</span>
              <div className="w-4 h-4 rounded-full bg-[#163029]" />
              <div className="w-4 h-4 rounded-full bg-[#A6E0D0]" />
              <span className="text-[14px] text-[#465A69]">+2</span>
            </div>
          </Section>
        </div>
      </div>

      {/* Preview Panel */}
      <div className="w-[240px] shrink-0">
        <div className="bg-white rounded-[8px] shadow-[0px_1px_2px_0px_rgba(0,0,0,0.1)] overflow-hidden">
          {/* Preview Header with Navigation */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-[#E4E8EB]">
            <button className="p-1 hover:bg-[#F5F7F8] rounded">
              <Icon name="CaretLeftSmall" variant="outlined" size={16} className="text-[#465A69]" />
            </button>
            <span className="text-[14px] font-bold text-[#1C2B33] font-optimistic">Site links</span>
            <button className="p-1 hover:bg-[#F5F7F8] rounded">
              <Icon name="CaretRight" variant="outlined" size={16} className="text-[#465A69]" />
            </button>
          </div>
          
          {/* Preview Illustration */}
          <div className="p-3">
            <div className="bg-[#E8F4FC] rounded-[4px] p-4 h-[280px] flex flex-col">
              {/* Phone mockup top area */}
              <div className="flex-1 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-[#C5E3F6] flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-white" />
                </div>
              </div>
              
              {/* Card area */}
              <div className="space-y-2">
                <div className="bg-[#5BA4D9] h-20 rounded-[4px] flex items-end p-3">
                  <div className="w-full">
                    <div className="h-2 bg-white/70 rounded w-3/4 mb-1.5" />
                    <div className="h-2 bg-white/50 rounded w-1/2" />
                  </div>
                </div>
                
                {/* Link buttons */}
                <div className="flex gap-2">
                  <div className="flex-1 bg-[#C5E3F6] h-10 rounded-[4px] flex items-center justify-center">
                    <Icon name="Link" variant="outlined" size={16} className="text-[#5BA4D9]" />
                  </div>
                  <div className="flex-1 bg-[#C5E3F6] h-10 rounded-[4px] flex items-center justify-center">
                    <Icon name="Link" variant="outlined" size={16} className="text-[#5BA4D9]" />
                  </div>
                  <div className="flex-1 bg-[#C5E3F6] h-10 rounded-[4px] flex items-center justify-center">
                    <Icon name="Link" variant="outlined" size={16} className="text-[#5BA4D9]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreativeSetupStep;
