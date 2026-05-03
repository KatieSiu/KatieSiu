"use client";

import Link from "next/link";
import { Text } from "@/features/ctv/components/ui/Text";

export default function PrototypeAlphaV2() {
  return (
    <main className="min-h-screen bg-[#F5F7F8]">
      {/* Header */}
      <header className="bg-white border-b border-[#E4E8EB] px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-[#E8F4FC] rounded-full text-[12px] font-medium text-[#0A78BE]">
              Alpha V2
            </span>
            <div>
              <Text variant="header2" color="primary">Ad Manager - CTV Integration</Text>
              <Text variant="valueDescription" color="description">
                Second iteration with refined CTV options
              </Text>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/ctv/prototype/alpha"
              className="text-[14px] text-[#5C6970] hover:underline"
            >
              ← Alpha
            </Link>
            <Link 
              href="/ctv/prototype/compare"
              className="text-[14px] text-[#0A78BE] hover:underline"
            >
              Compare All →
            </Link>
            <Link 
              href="/"
              className="text-[14px] text-[#5C6970] hover:underline"
            >
              Home
            </Link>
          </div>
        </div>
      </header>

      {/* Content Area */}
      <div className="p-6">
        <div className="bg-white rounded-lg border border-dashed border-[#CBD2D9] p-12 min-h-[600px] flex flex-col items-center justify-center">
          <div className="text-center max-w-md">
            <Text variant="header3" color="primary" className="mb-3">
              Alpha V2
            </Text>
            <Text variant="value" color="description" className="mb-6">
              This page will contain the Ad Manager interface with the second iteration of 
              CTV integration. Includes refinements based on Alpha V1 feedback and additional options.
            </Text>
            <div className="flex items-center justify-center gap-2 text-[12px] text-[#8A9AA8]">
              <span className="w-2 h-2 rounded-full bg-[#0A78BE]" />
              Empty scaffold - ready for implementation
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
