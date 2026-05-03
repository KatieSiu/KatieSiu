"use client";

import { useState, useRef, useEffect } from "react";
import { Icon } from "@/features/ctv/components/ui/Icon";
import { ControlRow, NestedControlRow } from "./ControlRow";
import { PublisherBlockListsRow } from "./PublisherBlockListsRow";
import { ConnectedTVControlsRow } from "./ConnectedTVControlsRow";

type ContentTab = "business" | "ad-account";

const PLACEMENT_OPTIONS = [
  { id: "ads-on-facebook-reels", label: "Ads on Facebook Reels" },
  { id: "audience-network-ads", label: "Audience Network ads" },
  { id: "connected-tv-ads", label: "Connected TV ads" },
  { id: "facebook-instagram-feed-reels", label: "Facebook and Instagram feed ads and Reels feed ads" },
  { id: "facebook-in-stream-video", label: "Facebook in-stream video ads" },
  { id: "instagram-profile-feed", label: "Instagram profile feed ads" },
  { id: "instagram-profile-reels", label: "Instagram profile reels ads" },
  { id: "threads-feed-ads", label: "Threads feed ads" },
];

interface BrandSafetyContentProps {
  selectedAccount: string;
}

export function BrandSafetyContent({ selectedAccount }: BrandSafetyContentProps) {
  const [activeTab, setActiveTab] = useState<ContentTab>("ad-account");
  const [showBanner, setShowBanner] = useState(true);
  const [isPlacementDropdownOpen, setIsPlacementDropdownOpen] = useState(false);
  const [selectedPlacements, setSelectedPlacements] = useState<string[]>(
    PLACEMENT_OPTIONS.map(opt => opt.id)
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsPlacementDropdownOpen(false);
      }
    };

    if (isPlacementDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPlacementDropdownOpen]);

  const handlePlacementToggle = (placementId: string) => {
    setSelectedPlacements(prev => {
      if (prev.includes(placementId)) {
        return prev.filter(id => id !== placementId);
      } else {
        return [...prev, placementId];
      }
    });
  };

  const getPlacementLabel = () => {
    if (selectedPlacements.length === PLACEMENT_OPTIONS.length) {
      return "All placements selected";
    } else if (selectedPlacements.length === 0) {
      return "No placements selected";
    } else {
      return `${selectedPlacements.length} placements selected`;
    }
  };

  return (
    <div className="flex-1 h-full overflow-y-auto bg-[#F5F6F7]">
      {/* Header */}
      <div className="bg-white border-b border-[#E4E8EB] px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="font-optimistic font-bold text-[20px] leading-[24px] text-[#1C2B33]">
            Controls
          </h1>
          
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-1.5 border border-[#CBD2D9] rounded hover:bg-[rgba(0,0,0,0.03)] transition-colors">
              <span className="font-sf-pro text-[13px] leading-[18px] text-[#1C2B33]">
                Markt Shampoo (123456789)
              </span>
              <Icon name="SmallTriangleDown" variant="filled" size={12} className="text-[#465A69]" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center border border-[#CBD2D9] rounded hover:bg-[rgba(0,0,0,0.03)] transition-colors">
              <Icon name="RightRectangles" variant="outlined" size={16} className="text-[#465A69]" />
            </button>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex items-center gap-4 mt-4">
          <button
            onClick={() => setActiveTab("business")}
            className={`
              pb-2 border-b-2 transition-colors
              ${activeTab === "business" 
                ? "border-[#0A78BE] text-[#0A78BE]" 
                : "border-transparent text-[#465A69] hover:text-[#1C2B33]"
              }
            `}
          >
            <span className="font-sf-pro text-[14px] leading-[20px] font-medium">
              Business settings
            </span>
          </button>
          <button
            onClick={() => setActiveTab("ad-account")}
            className={`
              pb-2 border-b-2 transition-colors
              ${activeTab === "ad-account" 
                ? "border-[#0A78BE] text-[#0A78BE]" 
                : "border-transparent text-[#465A69] hover:text-[#1C2B33]"
              }
            `}
          >
            <span className="font-sf-pro text-[14px] leading-[20px] font-medium">
              Ad account settings
            </span>
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        {/* Educational Banner */}
        {showBanner && (
          <div className="bg-white rounded-lg border border-[#E4E8EB] p-4 mb-6 relative">
            <button 
              onClick={() => setShowBanner(false)}
              className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded hover:bg-[rgba(0,0,0,0.05)] transition-colors"
            >
              <Icon name="Close" variant="outlined" size={16} className="text-[#465A69]" />
            </button>
            
            <div className="flex gap-4">
              <div className="w-[200px] h-[120px] rounded-lg overflow-hidden shrink-0">
                <img
                  src="/images/brand-safety-image.png"
                  alt="Brand Safety"
                  className="object-cover w-full h-full"
                />
              </div>
              
              <div className="flex-1 pr-8">
                <h3 className="font-optimistic font-bold text-[15px] leading-[20px] text-[#1C2B33] mb-2">
                  Header
                </h3>
                <p className="font-sf-pro text-[13px] leading-[18px] text-[#465A69] mb-3">
                  Use these controls to apply brand suitability settings to an ad account&apos;s existing and future campaigns. You can add more restrictive controls to a specific ad set in Ads Manager (but you can&apos;t make it less restrictive than your ad account settings). You can switch ad accounts using the dropdown menu above.
                </p>
                <p className="font-sf-pro text-[13px] leading-[18px] text-[#465A69]">
                  <span className="font-semibold text-[#1C2B33]">Inventory filters</span> are the simplest way to exclude groups of sensitive content. <span className="font-semibold text-[#1C2B33]">Publisher block lists</span> prevent your ads from appearing in specific places. <span className="font-semibold text-[#1C2B33]">Topic exclusions</span> stop your Facebook in-stream reels ads from appearing in on-demand videos about specific topics. <span className="font-semibold text-[#1C2B33]">Content type exclusions</span> filter out live videos or content from nonpartner-publishers that did not sign up for monetization. <span className="font-semibold text-[#1C2B33]">Content allow lists</span> give you more granular control of where your ads appear. <span className="font-semibold text-[#1C2B33]">Content block lists</span> prevent your ads from appearing with specific content. <span className="font-semibold text-[#1C2B33]">Connected TV controls</span> let you select maturity ratings and genre exclusions for fullscreen video ads on TV screens. <span className="text-[#0A78BE] hover:underline cursor-pointer">Learn more</span>
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Settings Panel */}
        <div className="bg-white rounded-lg border border-[#E4E8EB]">
          {/* Panel Header */}
          <div className="px-4 py-3 border-b border-[#E4E8EB]">
            <h2 className="font-optimistic font-bold text-[15px] leading-[20px] text-[#1C2B33] mb-3">
              Ad account settings: Markt Shampoo
            </h2>
            
            <div className="mb-2">
              <span className="font-sf-pro text-[13px] leading-[18px] text-[#465A69]">
                Filter controls by placements
              </span>
              <p className="font-sf-pro text-[12px] leading-[16px] text-[#465A69]">
                Settings will still be applied to all placements that a control covers.
              </p>
            </div>
            
            {/* Placement Filter Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsPlacementDropdownOpen(!isPlacementDropdownOpen)}
                className={`w-full max-w-[487px] flex items-center justify-between px-3 py-2 border rounded transition-colors bg-white ${
                  isPlacementDropdownOpen ? "border-[#0A78BE]" : "border-[#CBD2D9] hover:border-[#0A78BE]"
                }`}
              >
                <span className="font-sf-pro text-[14px] leading-[20px] text-[#1C2B33]">
                  {getPlacementLabel()}
                </span>
                <Icon 
                  name={isPlacementDropdownOpen ? "SmallTriangleUp" : "SmallTriangleDown"} 
                  variant="filled" 
                  size={12} 
                  className="text-[#465A69]" 
                />
              </button>
              
              {/* Dropdown Menu */}
              {isPlacementDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-[487px] bg-white rounded-[8px] shadow-[0px_8px_24px_0px_rgba(0,0,0,0.1),0px_2px_2px_0px_rgba(0,0,0,0.1)] z-20">
                  <div className="p-1">
                    {/* Header */}
                    <div className="px-2 pt-1 pb-2">
                      <span className="font-optimistic font-bold text-[14px] leading-[20px] text-[#1C2B33]">
                        Show controls that apply to:
                      </span>
                    </div>
                    
                    {/* Options */}
                    {PLACEMENT_OPTIONS.map((option) => {
                      const isSelected = selectedPlacements.includes(option.id);
                      return (
                        <button
                          key={option.id}
                          onClick={() => handlePlacementToggle(option.id)}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-[4px] hover:bg-[rgba(0,0,0,0.05)] transition-colors"
                        >
                          {/* Checkbox */}
                          <div className={`
                            w-6 h-6 rounded-[4px] border flex items-center justify-center shrink-0
                            ${isSelected 
                              ? "bg-white border-[#CBD2D9]" 
                              : "bg-white border-[#CBD2D9]"
                            }
                          `}>
                            {isSelected && (
                              <Icon name="Check" variant="filled" size={16} className="text-[#0A78BE]" />
                            )}
                          </div>
                          
                          {/* Label */}
                          <span className="font-sf-pro text-[14px] leading-[20px] text-[#1C2B33] text-left">
                            {option.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Control Rows */}
          <div className="px-4">
            <ControlRow
              icon="FilterSliders"
              title="Inventory filters"
              titleBadge="info"
              description="We apply the default inventory filter unless you change it. Content that's excessively controversial or offensive is always excluded, regardless of what filter you choose."
            >
              <NestedControlRow
                title="Feed ads"
                description="Applies only to: Facebook and Instagram feed ads, Reels feed ads and Threads feed ads"
                currentSelection="Expanded (default)"
                onEdit={() => {}}
              />
              <NestedControlRow
                title="In-content ads"
                description="Applies only to: Facebook in-stream reels and Ads on Facebook Reels"
                currentSelection="Expanded (default)"
                onEdit={() => {}}
              />
              <NestedControlRow
                title="Audience Network ads"
                description="Applies only to: Audience Network"
                currentSelection="Expanded (default)"
                onEdit={() => {}}
              />
            </ControlRow>
            
            <PublisherBlockListsRow />
            
            <ControlRow
              icon="TwoSquaresStackedX"
              title="Topic exclusions"
              titleBadge="info"
              description="Applies only to: Facebook in-stream reels"
              currentSelection="none"
              onEdit={() => {}}
            />
            
            <ControlRow
              icon="XBulletsRectangle"
              title="Content type exclusions"
              titleBadge="info"
              description="Applies only to: Facebook in-stream reels, Ads on Facebook Reels"
              currentSelection="all live videos, in-stream non-partner publishers"
              onEdit={() => {}}
            />
            
            <ControlRow
              icon="TwoSquaresStackedX"
              title="Content block lists"
              titleBadge="info"
              description="Applies only to: Facebook and Instagram feed and Reels feed ads"
              currentSelectionLinks={["list 1", "list 2", "list 3"]}
              onEdit={() => {}}
            />
            
            <ConnectedTVControlsRow />
          </div>
          
          {/* Footer Note */}
          <div className="px-4 py-4 border-t border-[#E4E8EB]">
            <p className="font-sf-pro text-[12px] leading-[16px] text-[#465A69]">
              <span className="font-semibold">WhatsApp Status</span> is end-to-end encrypted. Because we can&apos;t see the content that appears before or after your ad, we can&apos;t apply brand suitability controls. Your ads won&apos;t appear next to reported content that violates our guidelines. <span className="text-[#0A78BE] hover:underline cursor-pointer">About end-to-end encryption for advertisers using WhatsApp</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
