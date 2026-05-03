"use client";

import { useState, useRef, useEffect } from "react";
import { Icon } from "@/features/ctv/components/ui/Icon";

interface AdSetRow {
  id: string;
  name: string;
  isOn: boolean;
  delivery: string;
  recommendations?: { type: "pill" | "score"; value: string };
  results: { value: number; label: string };
  reach: number;
  frequency: number;
  impressions: number;
  amountSpent: number;
  cpm: number;
  costPerResult: number;
  roas: number;
  thruPlays: number;
  costPerThruPlay: number;
  videoCompletionRate: number;
}

const tableData: AdSetRow[] = [
  {
    id: "1",
    name: "RT_ | Promo Sale 2024 | S...",
    isOn: true,
    delivery: "Active",
    recommendations: { type: "pill", value: "1 recommend..." },
    results: { value: 122, label: "Website Purchase" },
    reach: 372032,
    frequency: 2.32,
    impressions: 372032,
    amountSpent: 1000.00,
    cpm: 1000.00,
    costPerResult: 1000.00,
    roas: 1000.00,
    thruPlays: 51505,
    costPerThruPlay: 1.01,
    videoCompletionRate: 95,
  },
  {
    id: "2",
    name: "RT_ | Promo Sale 2024 | S...",
    isOn: true,
    delivery: "Active",
    recommendations: { type: "score", value: "3" },
    results: { value: 250, label: "Website Purchase" },
    reach: 890240,
    frequency: 2.32,
    impressions: 890240,
    amountSpent: 1000.00,
    cpm: 1000.00,
    costPerResult: 1000.00,
    roas: 1000.00,
    thruPlays: 51505,
    costPerThruPlay: 1.01,
    videoCompletionRate: 95,
  },
  {
    id: "3",
    name: "RT_ | Promo Sale 2024 | S...",
    isOn: true,
    delivery: "Active",
    recommendations: { type: "score", value: "2" },
    results: { value: 100, label: "Website Purchase" },
    reach: 1718940,
    frequency: 2.32,
    impressions: 1718940,
    amountSpent: 1000.00,
    cpm: 1000.00,
    costPerResult: 1000.00,
    roas: 1000.00,
    thruPlays: 51505,
    costPerThruPlay: 1.01,
    videoCompletionRate: 95,
  },
  {
    id: "4",
    name: "RT_ | Promo Sale 2024 | S...",
    isOn: true,
    delivery: "Active",
    results: { value: 113, label: "Website Purchase" },
    reach: 595343,
    frequency: 2.32,
    impressions: 595343,
    amountSpent: 1000.00,
    cpm: 1000.00,
    costPerResult: 1000.00,
    roas: 1000.00,
    thruPlays: 51505,
    costPerThruPlay: 1.01,
    videoCompletionRate: 95,
  },
  {
    id: "5",
    name: "RT_ | Promo Sale 2024 | S...",
    isOn: true,
    delivery: "Active",
    results: { value: 122, label: "Website Purchase" },
    reach: 216029,
    frequency: 2.32,
    impressions: 216029,
    amountSpent: 1000.00,
    cpm: 1000.00,
    costPerResult: 1000.00,
    roas: 1000.00,
    thruPlays: 51505,
    costPerThruPlay: 1.01,
    videoCompletionRate: 95,
  },
  {
    id: "6",
    name: "RT_ | Promo Sale 2024 | S...",
    isOn: true,
    delivery: "Active",
    results: { value: 51, label: "Website Purchase" },
    reach: 194856,
    frequency: 2.32,
    impressions: 194856,
    amountSpent: 1000.00,
    cpm: 1000.00,
    costPerResult: 1000.00,
    roas: 1000.00,
    thruPlays: 51505,
    costPerThruPlay: 1.01,
    videoCompletionRate: 95,
  },
  {
    id: "7",
    name: "RT_ | Promo Sale 2024 | S...",
    isOn: true,
    delivery: "Active",
    results: { value: 40, label: "Website Purchase" },
    reach: 1004983,
    frequency: 2.32,
    impressions: 1004983,
    amountSpent: 1000.00,
    cpm: 1000.00,
    costPerResult: 1000.00,
    roas: 1000.00,
    thruPlays: 51505,
    costPerThruPlay: 1.01,
    videoCompletionRate: 95,
  },
];

const scrollableColumns = [
  { id: "delivery", label: "Delivery", width: 100 },
  { id: "recommendations", label: "Recommendations", width: 140 },
  { id: "results", label: "Results", width: 130 },
  { id: "reach", label: "Reach", width: 100 },
  { id: "frequency", label: "Frequency", width: 90 },
  { id: "impressions", label: "Impressions", width: 100 },
  { id: "amountSpent", label: "Amount\nspent", width: 90 },
  { id: "cpm", label: "CPM (cost per\n1,000 impres...", width: 110 },
  { id: "costPerResult", label: "Cost Per\nResult", width: 90 },
  { id: "roas", label: "ROAS", width: 80 },
  { id: "thruPlays", label: "ThruPlays", width: 90 },
  { id: "costPerThruPlay", label: "Cost per\nThruPlays", width: 100 },
  { id: "videoCompletionRate", label: "Video\nComplet...", width: 90 },
];

export function ReportingDataTable() {
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      setIsScrolled(scrollContainer.scrollLeft > 0);
    };

    scrollContainer.addEventListener("scroll", handleScroll);
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(tableData.map((row) => row.id)));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectRow = (id: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
    setSelectAll(newSelected.size === tableData.length);
  };

  const formatNumber = (num: number) => num.toLocaleString();
  const formatCurrency = (num: number) => `$${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const formatPercent = (num: number) => `${num}%`;

  const totalResults = tableData.reduce((sum, row) => sum + row.results.value, 0);
  const totalAmountSpent = tableData.reduce((sum, row) => sum + row.amountSpent, 0);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white">
      <div className="flex-1 flex overflow-hidden relative">
        {/* Fixed Columns Container - Checkbox, Off/On, Ad sets */}
        <div className="flex shrink-0 bg-white z-20">
          {/* Checkbox Column */}
          <div className="w-[40px] flex flex-col">
            <div className="h-[44px] flex items-center justify-center border-b border-[#E4E8EB] bg-white">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
                className="w-4 h-4 rounded border-[#CBD2D9] text-[#0A78BE] focus:ring-[#0A78BE]"
              />
            </div>
            {tableData.map((row) => (
              <div key={row.id} className="h-[40px] flex items-center justify-center border-b border-[#E4E8EB]">
                <input
                  type="checkbox"
                  checked={selectedRows.has(row.id)}
                  onChange={() => handleSelectRow(row.id)}
                  className="w-4 h-4 rounded border-[#CBD2D9] text-[#0A78BE] focus:ring-[#0A78BE]"
                />
              </div>
            ))}
            <div className="h-[40px] flex items-center justify-center border-b border-[#E4E8EB] bg-white" />
          </div>

          {/* Off/On Column */}
          <div className="w-[70px] flex flex-col">
            <div className="h-[44px] flex items-center px-2 border-b border-[#E4E8EB] bg-white">
              <div className="flex items-center gap-1">
                <span className="font-sf-pro text-[13px] leading-[18px] text-[#1C2B33]">Off/On</span>
                <Icon name="SmallTriangleDown" variant="filled" size={12} className="text-[#283943]" />
              </div>
            </div>
            {tableData.map((row) => (
              <div key={row.id} className="h-[40px] flex items-center px-2 border-b border-[#E4E8EB]">
                <div
                  className={`w-[32px] h-[18px] rounded-full transition-colors relative cursor-pointer ${row.isOn ? "bg-[#0A78BE]" : "bg-[#CBD2D9]"}`}
                >
                  <div className={`w-[14px] h-[14px] rounded-full bg-white absolute top-[2px] transition-all ${row.isOn ? "left-[16px]" : "left-[2px]"}`} />
                </div>
              </div>
            ))}
            <div className="h-[40px] flex items-center px-2 border-b border-[#E4E8EB] bg-white" />
          </div>

          {/* Ad sets Column (Name) */}
          <div className="w-[200px] flex flex-col">
            <div className="h-[44px] flex items-center px-2 border-b border-[#E4E8EB] bg-white">
              <div className="flex items-center gap-1">
                <span className="font-sf-pro text-[13px] leading-[18px] text-[#1C2B33]">Ad sets</span>
                <Icon name="SmallTriangleDown" variant="filled" size={12} className="text-[#283943]" />
              </div>
            </div>
            {tableData.map((row) => (
              <div key={row.id} className="h-[40px] flex items-center px-2 border-b border-[#E4E8EB]">
                <span className="font-sf-pro text-[13px] leading-[18px] text-[#0A78BE] truncate cursor-pointer hover:underline">
                  {row.name}
                </span>
              </div>
            ))}
            <div className="h-[40px] flex flex-col justify-center px-2 border-b border-[#E4E8EB] bg-white">
              <div className="flex items-center gap-1">
                <span className="font-sf-pro text-[13px] leading-[18px] text-[#1C2B33] truncate">Results from 36 campai...</span>
                <Icon name="Info" variant="filled" size={12} className="text-[#465A69] shrink-0" />
              </div>
              <span className="font-sf-pro text-[12px] leading-[16px] text-[#465A69]">App Installs</span>
            </div>
          </div>
        </div>

        {/* Drop shadow overlay - appears on scroll */}
        <div 
          className={`absolute left-[310px] top-0 bottom-0 w-[12px] pointer-events-none z-10 transition-opacity duration-200 ${
            isScrolled ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background: "linear-gradient(to right, rgba(0,0,0,0.1), rgba(0,0,0,0.02), transparent)",
          }}
        />

        {/* Scrollable Columns Container */}
        <div ref={scrollContainerRef} className="flex-1 overflow-x-auto overflow-y-hidden">
          <div className="flex min-w-max">
            {scrollableColumns.map((column) => (
              <div key={column.id} className="flex flex-col border-r border-[#E4E8EB]" style={{ width: column.width }}>
                {/* Header */}
                <div className="h-[44px] flex items-center px-2 border-b border-[#E4E8EB] bg-white">
                  <div className="flex items-center gap-1 flex-1 min-w-0">
                    <span className="font-sf-pro text-[13px] leading-[18px] text-[#1C2B33] whitespace-pre-line line-clamp-2">
                      {column.label}
                    </span>
                    <Icon name="SmallTriangleDown" variant="filled" size={12} className="text-[#283943] shrink-0" />
                  </div>
                </div>
                {/* Cells */}
                {tableData.map((row) => (
                  <div key={row.id} className="h-[40px] flex items-center px-2 border-b border-[#E4E8EB]">
                    {renderCellContent(column.id, row, formatNumber, formatCurrency, formatPercent)}
                  </div>
                ))}
                {/* Footer */}
                <div className="h-[40px] flex items-center px-2 border-b border-[#E4E8EB] bg-white">
                  {column.id === "results" && (
                    <div className="flex flex-col items-end w-full">
                      <span className="font-sf-pro font-bold text-[13px] leading-[18px] text-[#1C2B33]">{formatNumber(308858)}</span>
                      <span className="font-sf-pro text-[12px] leading-[16px] text-[#465A69] whitespace-nowrap">Website purch...</span>
                    </div>
                  )}
                  {column.id === "amountSpent" && (
                    <div className="flex flex-col items-end w-full">
                      <span className="font-sf-pro font-bold text-[13px] leading-[18px] text-[#1C2B33]">{formatCurrency(25067.47)}</span>
                      <span className="font-sf-pro text-[11px] leading-[14px] text-[#465A69]">Total</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function renderCellContent(
  columnId: string,
  row: AdSetRow,
  formatNumber: (n: number) => string,
  formatCurrency: (n: number) => string,
  formatPercent: (n: number) => string
) {
  switch (columnId) {
    case "delivery":
      return (
        <div className="flex items-center gap-1">
          <span className="w-[6px] h-[6px] rounded-full bg-[#006B4E]" />
          <span className="font-sf-pro text-[13px] leading-[18px] text-[#1C2B33]">{row.delivery}</span>
        </div>
      );
    case "recommendations":
      if (!row.recommendations) return null;
      if (row.recommendations.type === "pill") {
        return (
          <div className="flex items-center gap-1 px-2 py-0.5 bg-[#ECF4FE] rounded-full">
            <Icon name="Warning" variant="outlined" size={12} className="text-[#0A78BE]" />
            <span className="font-sf-pro text-[11px] leading-[14px] text-[#0A78BE]">{row.recommendations.value}</span>
          </div>
        );
      }
      return (
        <div className="flex items-center gap-1 px-2 py-0.5 bg-[#EBF2E6] rounded-full">
          <Icon name="CheckCircle" variant="filled" size={12} className="text-[#006B4E]" />
          <span className="font-sf-pro text-[11px] leading-[14px] text-[#006B4E]">{row.recommendations.value}</span>
        </div>
      );
    case "results":
      return (
        <div className="flex flex-col items-end w-full">
          <span 
            className="font-sf-pro text-[13px] leading-[18px] text-[#1C2B33]"
            style={{ textDecoration: "underline", textDecorationStyle: "dashed", textUnderlineOffset: "2px" }}
          >
            {formatNumber(row.results.value)}
          </span>
          <span className="font-sf-pro text-[12px] leading-[16px] text-[#465A69] whitespace-nowrap">{row.results.label}</span>
        </div>
      );
    case "reach":
      return <span className="font-sf-pro text-[13px] leading-[18px] text-[#1C2B33]">{formatNumber(row.reach)}</span>;
    case "frequency":
      return <span className="font-sf-pro text-[13px] leading-[18px] text-[#1C2B33]">{row.frequency.toFixed(2)}</span>;
    case "impressions":
      return <span className="font-sf-pro text-[13px] leading-[18px] text-[#1C2B33]">{formatNumber(row.impressions)}</span>;
    case "amountSpent":
      return <span className="font-sf-pro text-[13px] leading-[18px] text-[#1C2B33]">{formatCurrency(row.amountSpent)}</span>;
    case "cpm":
      return <span className="font-sf-pro text-[13px] leading-[18px] text-[#1C2B33]">{formatCurrency(row.cpm)}</span>;
    case "costPerResult":
      return <span className="font-sf-pro text-[13px] leading-[18px] text-[#1C2B33]">{formatCurrency(row.costPerResult)}</span>;
    case "roas":
      return <span className="font-sf-pro text-[13px] leading-[18px] text-[#1C2B33]">{formatCurrency(row.roas)}</span>;
    case "thruPlays":
      return <span className="font-sf-pro text-[13px] leading-[18px] text-[#1C2B33]">{formatNumber(row.thruPlays)}</span>;
    case "costPerThruPlay":
      return <span className="font-sf-pro text-[13px] leading-[18px] text-[#1C2B33]">{formatCurrency(row.costPerThruPlay)}</span>;
    case "videoCompletionRate":
      return <span className="font-sf-pro text-[13px] leading-[18px] text-[#1C2B33]">{formatPercent(row.videoCompletionRate)}</span>;
    default:
      return null;
  }
}
