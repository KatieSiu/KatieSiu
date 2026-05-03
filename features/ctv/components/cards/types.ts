// ============================================
// Shared Types for Ad Manager Cards
// ============================================

/**
 * Prototype versions for the CTV Ad Manager prototype
 * - before: Current state without CTV
 * - alpha-v1, alpha-v2: Initial CTV integration iterations
 * - beta-v1, beta-v2: Refined iterations (future)
 */
export type PrototypeVersion = 
  | 'before' 
  | 'alpha-v1' 
  | 'alpha-v2' 
  | 'beta-v1' 
  | 'beta-v2';

/**
 * Field dependency action types
 */
export type DependencyAction = 
  | 'show' 
  | 'hide' 
  | 'disable' 
  | 'enable' 
  | 'setOptions' 
  | 'setValue';

/**
 * Defines what happens when a field value changes
 */
export interface DependencyEffect {
  field: string;
  action: DependencyAction;
  payload?: any;
}

/**
 * Rule for field dependencies
 * When trigger.field equals trigger.value, apply all effects
 */
export interface DependencyRule {
  trigger: { 
    field: string; 
    value: any;
  };
  effects: DependencyEffect[];
}

/**
 * Base props that all card components share
 */
export interface BaseCardProps {
  version: PrototypeVersion;
  className?: string;
}

/**
 * Common option structure for dropdowns/selects
 */
export interface SelectOption {
  id: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

/**
 * Field visibility and state managed by dependency system
 */
export interface FieldState {
  visible: boolean;
  disabled: boolean;
  options?: SelectOption[];
  value?: any;
}
