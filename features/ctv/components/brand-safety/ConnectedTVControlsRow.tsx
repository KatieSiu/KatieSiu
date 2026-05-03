"use client";

import { useState } from "react";
import { Icon } from "@/features/ctv/components/ui/Icon";

// Maturity rating options
const MATURITY_RATINGS = [
  { id: "tv-y", label: "TV-Y: All children", description: "Appropriate for all children, including ages 2–6" },
  { id: "tv-y7", label: "TV-Y7: Directed to older children", description: "Designed for children age 7 and above" },
  { id: "tv-y7-fv", label: "TV-Y7 FV: Directed to older children (fantasy violence)", description: "Designed for children age 7 and above; may contain mild fantasy violence" },
  { id: "tv-g", label: "TV-G: General audience", description: "Suitable for all ages, with little or no violence, sexual content or coarse language" },
  { id: "tv-pg", label: "TV-PG: Parental guidance suggested", description: "Contains material that parents may find unsuitable for younger children, including some suggestive dialog, infrequent coarse language or moderate violence" },
  { id: "tv-14", label: "TV-14: Parents strongly cautioned", description: "Contains material unsuitable for children under 14, such as strong language, intense violence or intense sexual situations" },
  { id: "tv-ma", label: "TV-MA: Mature audience only", description: "Designed for adults and unsuitable for children under 17 due to graphic violence, explicit sexual content or crude indecent language" },
];

// Genre options
const GENRES = [
  { id: "action", label: "Action" },
  { id: "adventure", label: "Adventure" },
  { id: "animation", label: "Animation" },
  { id: "comedy", label: "Comedy" },
  { id: "crime", label: "Crime" },
  { id: "documentary", label: "Documentary" },
  { id: "drama", label: "Drama" },
  { id: "family", label: "Family" },
  { id: "fantasy", label: "Fantasy" },
  { id: "game-show", label: "Game show" },
  { id: "history", label: "History" },
  { id: "horror", label: "Horror" },
  { id: "music", label: "Music" },
  { id: "mystery", label: "Mystery" },
  { id: "news", label: "News" },
  { id: "reality", label: "Reality" },
  { id: "romance", label: "Romance" },
  { id: "sci-fi", label: "Sci-Fi" },
  { id: "sport", label: "Sport" },
  { id: "thriller", label: "Thriller" },
  { id: "war", label: "War" },
  { id: "western", label: "Western" },
];

interface AccordionSectionProps {
  title: string;
  currentSelectionLabel: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function AccordionSection({ title, currentSelectionLabel, isExpanded, onToggle, children }: AccordionSectionProps) {
  return (
    <div className="border border-[#CBD2D9] rounded-[8px] overflow-hidden">
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full bg-[#F1F4F7] px-4 py-3 flex items-start justify-between text-left"
      >
        <div className="flex-1 min-w-0">
          <span className="font-optimistic font-bold text-[15px] leading-[20px] text-[#1C2B33] block">
            {title}
          </span>
          <span className="font-sf-pro text-[14px] leading-[20px] text-[#465A69] block">
            Applies only to: Connected TV
          </span>
          <span className="font-sf-pro text-[14px] leading-[20px] text-[#465A69]">
            Current selection: <span className="font-bold text-[#1C2B33]">{currentSelectionLabel}</span>
          </span>
        </div>
        <div className="w-6 h-6 flex items-center justify-center shrink-0 mt-1">
          <Icon 
            name={isExpanded ? "CaretUp" : "CaretDown"} 
            variant="outlined" 
            size={16} 
            className="text-[#0A78BE]" 
          />
        </div>
      </button>
      
      {/* Content */}
      {isExpanded && (
        <div className="bg-white">
          {children}
        </div>
      )}
    </div>
  );
}

interface CheckboxItemProps {
  label: string;
  description?: string;
  isSelected: boolean;
  onToggle: () => void;
}

function CheckboxItem({ label, description, isSelected, onToggle }: CheckboxItemProps) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-start gap-3 px-4 py-3 text-left transition-colors border-b border-[#E4E8EB] last:border-b-0 bg-white hover:bg-[rgba(0,0,0,0.03)]"
    >
      {/* Checkbox */}
      <div className={`
        w-5 h-5 rounded-[4px] border-2 flex items-center justify-center shrink-0 mt-0.5
        ${isSelected ? "bg-[#0A78BE] border-[#0A78BE]" : "bg-white border-[#CBD2D9]"}
      `}>
        {isSelected && (
          <Icon name="Check" variant="filled" size={12} className="text-white" />
        )}
      </div>
      
      {/* Label and description */}
      <div className="flex-1 min-w-0">
        <span className="font-optimistic text-[14px] leading-[20px] text-[#1C2B33] block">
          {label}
        </span>
        {description && (
          <span className="font-sf-pro text-[12px] leading-[16px] text-[#465A69] block">
            {description}
          </span>
        )}
      </div>
    </button>
  );
}

export function ConnectedTVControlsRow() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Accordion states for nested sections
  const [isMaturityExpanded, setIsMaturityExpanded] = useState(true);
  const [isGenreExpanded, setIsGenreExpanded] = useState(true);
  
  // Selection states
  const [selectedMaturityRatings, setSelectedMaturityRatings] = useState<string[]>(["tv-14", "tv-ma"]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([
    "action", "crime", "drama", "family", "fantasy", "horror", "thriller"
  ]);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleMaturityToggle = (id: string) => {
    setSelectedMaturityRatings(prev => 
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const handleGenreToggle = (id: string) => {
    setSelectedGenres(prev => 
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  // Generate selection labels
  const getMaturityLabel = () => {
    const selected = MATURITY_RATINGS.filter(r => selectedMaturityRatings.includes(r.id));
    if (selected.length === 0) return "None";
    return selected.map(r => r.label.split(":")[0]).join(", ");
  };

  const getGenreLabel = () => {
    const selected = GENRES.filter(g => selectedGenres.includes(g.id));
    if (selected.length === 0) return "None";
    if (selected.length <= 7) {
      return selected.map(g => g.label).join(", ");
    }
    const shown = selected.slice(0, 7).map(g => g.label).join(", ");
    return `${shown} and ${selected.length - 7} more`;
  };

  return (
    <div className="py-4 border-b border-[#E4E8EB] last:border-b-0">
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
          <Icon name="TV" variant="outlined" size={20} className="text-[#465A69]" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="font-optimistic font-semibold text-[16px] leading-[20px] text-[#1C2B33]">
              Connected TV controls
            </span>
            <Icon name="Info" variant="filled" size={12} className="text-[#283943]" />
          </div>
          
          <p className="font-sf-pro text-[14px] leading-[20px] text-[#465A69]">
            Fullscreen video ads on TV streaming services
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
      
      {/* Expanded Content - Accordion Sections */}
      {isExpanded && (
        <div className="mt-4 ml-9 space-y-4">
          {/* Maturity Rating Exclusions */}
          <AccordionSection
            title="Maturity rating exclusions"
            currentSelectionLabel={getMaturityLabel()}
            isExpanded={isMaturityExpanded}
            onToggle={() => setIsMaturityExpanded(!isMaturityExpanded)}
          >
            <div className="max-h-[400px] overflow-y-auto">
              {MATURITY_RATINGS.map((rating) => (
                <CheckboxItem
                  key={rating.id}
                  label={rating.label}
                  description={rating.description}
                  isSelected={selectedMaturityRatings.includes(rating.id)}
                  onToggle={() => handleMaturityToggle(rating.id)}
                />
              ))}
            </div>
          </AccordionSection>
          
          {/* Genre Exclusions */}
          <AccordionSection
            title="Genre exclusions"
            currentSelectionLabel={getGenreLabel()}
            isExpanded={isGenreExpanded}
            onToggle={() => setIsGenreExpanded(!isGenreExpanded)}
          >
            <div className="max-h-[400px] overflow-y-auto">
              {GENRES.map((genre) => (
                <CheckboxItem
                  key={genre.id}
                  label={genre.label}
                  isSelected={selectedGenres.includes(genre.id)}
                  onToggle={() => handleGenreToggle(genre.id)}
                />
              ))}
            </div>
          </AccordionSection>
        </div>
      )}
    </div>
  );
}
