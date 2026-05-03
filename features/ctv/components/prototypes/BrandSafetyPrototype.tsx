"use client";

import { useState } from "react";
import { BrandSafetySidebar, BrandSafetyContent, type NavItemId } from "@/features/ctv/components/brand-safety";

export function BrandSafetyPrototype() {
  const [activeNavItem, setActiveNavItem] = useState<NavItemId>("controls");
  const selectedAccount = "Acme Industries, Inc.";

  return (
    <div className="h-full flex overflow-hidden">
      <BrandSafetySidebar
        activeItem={activeNavItem}
        onItemSelect={setActiveNavItem}
        selectedAccount={selectedAccount}
      />
      <BrandSafetyContent selectedAccount={selectedAccount} />
    </div>
  );
}
