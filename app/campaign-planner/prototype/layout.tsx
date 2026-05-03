"use client";

import { PlanProvider } from "@/features/campaign-planner/lib/plan-context";

export default function PrototypeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PlanProvider>{children}</PlanProvider>;
}

