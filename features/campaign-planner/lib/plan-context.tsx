"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { CampaignPlan, mockCampaignPlans } from "./mock-data";

// ============================================
// Plan Context Types
// ============================================

interface PlanContextType {
  /** All campaign plans */
  plans: CampaignPlan[];
  /** Add a new plan and return its ID */
  addPlan: (plan: CampaignPlan) => string;
  /** Update an existing plan by ID */
  updatePlan: (id: string, updates: Partial<CampaignPlan>) => void;
  /** Delete a plan by ID */
  deletePlan: (id: string) => void;
  /** Delete multiple plans by IDs */
  deletePlans: (ids: string[]) => void;
  /** Duplicate a plan and return the new plan's ID */
  duplicatePlan: (id: string, customName?: string) => string | null;
  /** Duplicate multiple plans and return their new IDs */
  duplicatePlans: (ids: string[]) => string[];
  /** Get a plan by ID */
  getPlanById: (id: string) => CampaignPlan | undefined;
  /** Set all plans (for bulk operations) */
  setPlans: React.Dispatch<React.SetStateAction<CampaignPlan[]>>;
}

// ============================================
// Context Creation
// ============================================

const PlanContext = createContext<PlanContextType | undefined>(undefined);

// ============================================
// Provider Component
// ============================================

interface PlanProviderProps {
  children: ReactNode;
  /** Optional initial plans (defaults to mock data) */
  initialPlans?: CampaignPlan[];
}

export function PlanProvider({ children, initialPlans }: PlanProviderProps) {
  const [plans, setPlans] = useState<CampaignPlan[]>(initialPlans ?? mockCampaignPlans);

  const addPlan = useCallback((plan: CampaignPlan): string => {
    setPlans((prev) => [plan, ...prev]);
    return plan.id;
  }, []);

  const updatePlan = useCallback((id: string, updates: Partial<CampaignPlan>) => {
    setPlans((prev) =>
      prev.map((plan) =>
        plan.id === id
          ? { ...plan, ...updates, lastEdited: new Date() }
          : plan
      )
    );
  }, []);

  const deletePlan = useCallback((id: string) => {
    setPlans((prev) => prev.filter((plan) => plan.id !== id));
  }, []);

  const deletePlans = useCallback((ids: string[]) => {
    const idSet = new Set(ids);
    setPlans((prev) => prev.filter((plan) => !idSet.has(plan.id)));
  }, []);

  const duplicatePlan = useCallback((id: string, customName?: string): string | null => {
    const planToDuplicate = plans.find((p) => p.id === id);
    if (!planToDuplicate) return null;

    const today = new Date();
    const newId = String(Date.now());
    const newPlan: CampaignPlan = {
      ...planToDuplicate,
      id: newId,
      name: customName ?? `${planToDuplicate.name} (copy)`,
      createdDate: today,
      lastEdited: today,
    };

    setPlans((prev) => [newPlan, ...prev]);
    return newId;
  }, [plans]);

  const duplicatePlans = useCallback((ids: string[]): string[] => {
    const today = new Date();
    const newIds: string[] = [];
    const newPlans: CampaignPlan[] = [];

    ids.forEach((id, index) => {
      const planToDuplicate = plans.find((p) => p.id === id);
      if (planToDuplicate) {
        const newId = String(Date.now() + index);
        newIds.push(newId);
        newPlans.push({
          ...planToDuplicate,
          id: newId,
          name: `${planToDuplicate.name} (copy)`,
          createdDate: today,
          lastEdited: today,
        });
      }
    });

    setPlans((prev) => [...newPlans, ...prev]);
    return newIds;
  }, [plans]);

  const getPlanById = useCallback(
    (id: string): CampaignPlan | undefined => {
      return plans.find((plan) => plan.id === id);
    },
    [plans]
  );

  const value: PlanContextType = {
    plans,
    addPlan,
    updatePlan,
    deletePlan,
    deletePlans,
    duplicatePlan,
    duplicatePlans,
    getPlanById,
    setPlans,
  };

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
}

// ============================================
// Hook for consuming context
// ============================================

export function usePlans(): PlanContextType {
  const context = useContext(PlanContext);
  if (context === undefined) {
    throw new Error("usePlans must be used within a PlanProvider");
  }
  return context;
}

// ============================================
// Export types for external use
// ============================================

export type { PlanContextType };

