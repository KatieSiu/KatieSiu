"use client";

import { useState } from "react";
import { Icon } from "@/features/ctv/components/ui/Icon";

interface BlockList {
  id: string;
  name: string;
  subtitle?: string;
  isLocked?: boolean;
}

const BLOCK_LISTS: BlockList[] = [
  { id: "my-block-list", name: "My block list" },
  { id: "list-2", name: "List 2", subtitle: "Applied to business", isLocked: true },
  { id: "list-3", name: "List 3" },
  { id: "list-4", name: "List 4" },
  { id: "list-5", name: "List 5" },
  { id: "list-6", name: "List 6" },
  { id: "list-7", name: "List 7" },
  { id: "list-8", name: "List 8" },
  { id: "list-9", name: "List 9" },
];

export function PublisherBlockListsRow() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedLists, setSelectedLists] = useState<string[]>(["my-block-list", "list-2", "list-3"]);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleListToggle = (listId: string) => {
    setSelectedLists(prev => {
      if (prev.includes(listId)) {
        return prev.filter(id => id !== listId);
      } else {
        return [...prev, listId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedLists.length === BLOCK_LISTS.length) {
      setSelectedLists([]);
    } else {
      setSelectedLists(BLOCK_LISTS.map(list => list.id));
    }
  };

  const selectedListNames = BLOCK_LISTS
    .filter(list => selectedLists.includes(list.id))
    .map(list => list.name)
    .slice(0, 3);

  return (
    <div className="py-4 border-b border-[#E4E8EB]">
      {/* Header Row - Clickable */}
      <div
        onClick={handleToggle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          flex items-start gap-3 p-2 -m-2 rounded-[8px] cursor-pointer transition-colors
          ${isHovered ? "bg-[rgba(0,0,0,0.05)]" : ""}
        `}
      >
        <div className="w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">
          <Icon name="ShieldSlash" variant="outlined" size={20} className="text-[#465A69]" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="font-optimistic font-semibold text-[16px] leading-[20px] text-[#1C2B33]">
              Publisher block lists
            </span>
            <Icon name="Info" variant="filled" size={12} className="text-[#283943]" />
          </div>
          
          <p className="font-sf-pro text-[14px] leading-[20px] text-[#465A69] mb-1">
            Applies only to: Facebook in-stream reels, Audience Network, Instagram profile feed, Instagram profile reels, Facebook profile feed, Ads on Facebook Reels and CTV
          </p>
          
          <p className="font-sf-pro text-[12px] leading-[16px] text-[#465A69]">
            <span>Current selection: </span>
            <span className="font-semibold">
              {selectedListNames.join(", ")}
              {selectedLists.length > 3 && ` and ${selectedLists.length - 3} more`}
            </span>
          </p>
        </div>
        
        <button
          className="w-9 h-9 flex items-center justify-center rounded transition-colors shrink-0"
        >
          <Icon 
            name={isExpanded ? "CaretUp" : "Pencil"} 
            variant="outlined" 
            size={16} 
            className={isHovered || isExpanded ? "text-[#0A78BE]" : "text-[#465A69]"} 
          />
        </button>
      </div>
      
      {/* Expanded Content */}
      {isExpanded && (
        <div className="mt-4 ml-9">
          {/* Search Dropdown */}
          <div className="mb-4">
            <button className="w-full flex items-center justify-between px-3 py-2 border border-[#CBD2D9] rounded bg-white hover:border-[#0A78BE] transition-colors">
              <span className="font-sf-pro text-[14px] leading-[20px] text-[#465A69]">
                Search for and apply publisher block lists
              </span>
              <Icon name="SmallTriangleDown" variant="filled" size={16} className="text-[#283943]" />
            </button>
          </div>
          
          {/* Select All Row */}
          <div className="flex items-center justify-between py-3 border-b border-[#E4E8EB]">
            <button
              onClick={handleSelectAll}
              className="flex items-center gap-3"
            >
              <div className={`
                w-6 h-6 rounded-[4px] border flex items-center justify-center
                ${selectedLists.length === BLOCK_LISTS.length 
                  ? "bg-white border-[#CBD2D9]" 
                  : "bg-white border-[#CBD2D9]"
                }
              `}>
                {selectedLists.length === BLOCK_LISTS.length && (
                  <Icon name="Check" variant="filled" size={16} className="text-[#0A78BE]" />
                )}
              </div>
              <span className="font-optimistic font-bold text-[15px] leading-[20px] text-[#1C2B33]">
                Select all
              </span>
            </button>
            <span className="font-sf-pro text-[14px] leading-[20px] text-[#1C2B33]">
              Total applied: <span className="font-semibold">{selectedLists.length}</span>
            </span>
          </div>
          
          {/* List Items */}
          <div className="max-h-[400px] overflow-y-auto flex flex-col gap-[1px] bg-[#E4E8EB]">
            {BLOCK_LISTS.map((list) => {
              const isSelected = selectedLists.includes(list.id);
              const getRowBackground = () => {
                if (list.isLocked) {
                  return "bg-[#F1F4F7]";
                }
                return "bg-white hover:bg-[rgba(0,0,0,0.03)]";
              };
              
              return (
                <button
                  key={list.id}
                  onClick={() => handleListToggle(list.id)}
                  className={`
                    w-full h-[40px] flex items-center justify-between px-3 transition-colors
                    ${getRowBackground()}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-6 h-6 rounded-[4px] border flex items-center justify-center shrink-0
                      bg-white border-[#CBD2D9]
                    `}>
                      {isSelected && (
                        <Icon name="Check" variant="filled" size={16} className="text-[#0A78BE]" />
                      )}
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="font-sf-pro text-[14px] leading-[20px] text-[#1C2B33]">
                        {list.name}
                      </span>
                      {list.subtitle && (
                        <span className="font-sf-pro text-[12px] leading-[16px] text-[#465A69]">
                          {list.subtitle}
                        </span>
                      )}
                    </div>
                  </div>
                  {list.isLocked && (
                    <Icon name="LockOn" variant="outlined" size={16} className="text-[#465A69]" />
                  )}
                </button>
              );
            })}
          </div>
          
          {/* Footer */}
          <div className="pt-3 border-t border-[#E4E8EB] mt-0">
            <span className="font-sf-pro text-[14px] leading-[20px] text-[#1C2B33]">
              80 items
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
