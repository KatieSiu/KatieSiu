"use client";

import { Icon } from "@/features/ctv/components/ui/Icon";

interface ControlRowProps {
  icon: string;
  iconVariant?: "filled" | "outlined";
  title: string;
  titleBadge?: string;
  description: string;
  currentSelection?: string;
  currentSelectionLinks?: string[];
  onEdit?: () => void;
  children?: React.ReactNode;
}

export function ControlRow({
  icon,
  iconVariant = "outlined",
  title,
  titleBadge,
  description,
  currentSelection,
  currentSelectionLinks,
  onEdit,
  children,
}: ControlRowProps) {
  return (
    <div className="py-4 border-b border-[#E4E8EB] last:border-b-0">
      <div className="flex items-start gap-3">
        <div className="w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">
          <Icon name={icon} variant={iconVariant} size={20} className="text-[#465A69]" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="font-optimistic font-semibold text-[15px] leading-[20px] text-[#1C2B33]">
              {title}
            </span>
            {titleBadge && (
              <Icon name="Info" variant="filled" size={14} className="text-[#465A69]" />
            )}
          </div>
          
          <p className="font-sf-pro text-[13px] leading-[18px] text-[#465A69] mb-1">
            {description}
          </p>
          
          {currentSelection && (
            <p className="font-sf-pro text-[13px] leading-[18px] text-[#465A69]">
              <span className="text-[#465A69]">Current selection: </span>
              {currentSelectionLinks ? (
                <>
                  {currentSelectionLinks.map((link, index) => (
                    <span key={link}>
                      <span className="text-[#0A78BE] hover:underline cursor-pointer">{link}</span>
                      {index < currentSelectionLinks.length - 1 && ", "}
                    </span>
                  ))}
                </>
              ) : (
                <span className={currentSelection === "none" ? "text-[#465A69]" : "text-[#0A78BE]"}>
                  {currentSelection}
                </span>
              )}
            </p>
          )}
        </div>
        
        {onEdit && (
          <button
            onClick={onEdit}
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-[rgba(0,0,0,0.05)] transition-colors shrink-0"
          >
            <Icon name="Pencil" variant="outlined" size={16} className="text-[#465A69]" />
          </button>
        )}
      </div>
      
      {children && (
        <div className="ml-9 mt-3">
          {children}
        </div>
      )}
    </div>
  );
}

interface NestedControlRowProps {
  title: string;
  description: string;
  currentSelection?: string;
  onEdit?: () => void;
}

export function NestedControlRow({
  title,
  description,
  currentSelection,
  onEdit,
}: NestedControlRowProps) {
  return (
    <div className="py-3 border-b border-[#E4E8EB] last:border-b-0 first:pt-0">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <span className="font-optimistic font-medium text-[14px] leading-[20px] text-[#1C2B33] block mb-0.5">
            {title}
          </span>
          
          <p className="font-sf-pro text-[13px] leading-[18px] text-[#465A69]">
            {description}
          </p>
          
          {currentSelection && (
            <p className="font-sf-pro text-[13px] leading-[18px] text-[#465A69] mt-0.5">
              <span>Current selection: </span>
              <span className="text-[#0A78BE]">{currentSelection}</span>
            </p>
          )}
        </div>
        
        {onEdit && (
          <button
            onClick={onEdit}
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-[rgba(0,0,0,0.05)] transition-colors shrink-0"
          >
            <Icon name="Pencil" variant="outlined" size={16} className="text-[#465A69]" />
          </button>
        )}
      </div>
    </div>
  );
}
