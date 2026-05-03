"use client";

import { useState } from "react";
import Link from "next/link";
import { Text } from "@/features/ctv/components/ui/Text";
import { Button } from "@/features/ctv/components/ui/Button";

type CompareView = '2-up' | '3-up';

export default function PrototypeCompare() {
  const [view, setView] = useState<CompareView>('2-up');

  return (
    <main className="min-h-screen bg-[#F5F7F8]">
      {/* Header */}
      <header className="bg-white border-b border-[#E4E8EB] px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <Text variant="header2" color="primary">Compare Versions</Text>
            <Text variant="valueDescription" color="description">
              Side-by-side comparison at reduced scale
            </Text>
          </div>
          <div className="flex items-center gap-4">
            {/* View Toggle */}
            <div className="flex items-center gap-2 bg-[#F5F7F8] rounded-lg p-1">
              <button
                onClick={() => setView('2-up')}
                className={`px-3 py-1.5 rounded text-[13px] font-medium transition-colors ${
                  view === '2-up' 
                    ? 'bg-white text-[#1C2B33] shadow-sm' 
                    : 'text-[#5C6970] hover:text-[#1C2B33]'
                }`}
              >
                2-Up
              </button>
              <button
                onClick={() => setView('3-up')}
                className={`px-3 py-1.5 rounded text-[13px] font-medium transition-colors ${
                  view === '3-up' 
                    ? 'bg-white text-[#1C2B33] shadow-sm' 
                    : 'text-[#5C6970] hover:text-[#1C2B33]'
                }`}
              >
                3-Up
              </button>
            </div>
            <Link 
              href="/"
              className="text-[14px] text-[#5C6970] hover:underline"
            >
              Home
            </Link>
          </div>
        </div>
      </header>

      {/* Scale Notice */}
      <div className="bg-[#FFF8E6] border-b border-[#F5D799] px-6 py-2">
        <Text variant="valueDescription" color="warning">
          Viewing at reduced scale for comparison. Click on a version to view full-screen.
        </Text>
      </div>

      {/* Comparison View */}
      <div className="p-6">
        <div className={`grid gap-6 ${view === '2-up' ? 'grid-cols-2' : 'grid-cols-3'}`}>
          
          {/* Before */}
          <ComparePanel 
            version="Before"
            href="/ctv/prototype/before"
            description="Current state without CTV"
            accentColor="#E4E8EB"
            textColor="#465A69"
          />

          {/* Alpha */}
          <ComparePanel 
            version="Alpha"
            href="/ctv/prototype/alpha"
            description="First CTV iteration"
            accentColor="#E8F4FC"
            textColor="#0A78BE"
          />

          {/* Alpha V2 - Only show in 3-up view */}
          {view === '3-up' && (
            <ComparePanel 
              version="Alpha V2"
              href="/ctv/prototype/alpha-v2"
              description="Refined CTV options"
              accentColor="#E8F4FC"
              textColor="#0A78BE"
            />
          )}

        </div>

        {/* 2-up version selector */}
        {view === '2-up' && (
          <div className="mt-6 flex items-center justify-center gap-4">
            <Text variant="valueDescription" color="description">
              Comparing: Before vs Alpha
            </Text>
            <Button variant="flat" onClick={() => setView('3-up')}>
              Add Alpha V2
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}

interface ComparePanelProps {
  version: string;
  href: string;
  description: string;
  accentColor: string;
  textColor: string;
}

function ComparePanel({ version, href, description, accentColor, textColor }: ComparePanelProps) {
  return (
    <Link href={href} className="block group">
      <div className="bg-white rounded-lg border border-[#E4E8EB] overflow-hidden hover:shadow-lg transition-shadow">
        {/* Version Label */}
        <div className="px-4 py-3 border-b border-[#E4E8EB] flex items-center justify-between">
          <span 
            className="px-2 py-1 rounded-full text-[11px] font-medium"
            style={{ backgroundColor: accentColor, color: textColor }}
          >
            {version}
          </span>
          <span className="text-[12px] text-[#8A9AA8] group-hover:text-[#0A78BE] transition-colors">
            View full →
          </span>
        </div>
        
        {/* Scaled Preview Area */}
        <div className="aspect-[4/3] bg-[#F5F7F8] flex items-center justify-center p-4">
          <div className="text-center">
            <Text variant="value" color="disabled" className="mb-2">
              {description}
            </Text>
            <div className="flex items-center justify-center gap-2 text-[11px] text-[#8A9AA8]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#CBD2D9]" />
              Preview will render here
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
