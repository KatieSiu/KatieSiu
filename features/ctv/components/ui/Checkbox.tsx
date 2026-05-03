import { forwardRef, createContext, useContext, type InputHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/features/ctv/lib/utils";
import { Check } from "@/features/ctv/components/icons/filled/Check";

// ============================================
// Context for CheckboxGroup state
// ============================================
interface CheckboxGroupContextValue {
  values: string[];
  onChange: (value: string, checked: boolean) => void;
  name: string;
}

const CheckboxGroupContext = createContext<CheckboxGroupContextValue | null>(null);

const useCheckboxGroupContext = () => {
  return useContext(CheckboxGroupContext);
};

// ============================================
// CheckboxGroup Container
// ============================================
const checkboxGroupVariants = cva("flex gap-3", {
  variants: {
    orientation: {
      vertical: "flex-col",
      horizontal: "flex-row flex-wrap",
    },
  },
  defaultVariants: {
    orientation: "vertical",
  },
});

interface CheckboxGroupProps extends VariantProps<typeof checkboxGroupVariants> {
  /** Currently selected values */
  values: string[];
  /** Callback when selection changes */
  onChange: (values: string[]) => void;
  /** Name attribute for the checkbox group */
  name: string;
  /** Checkbox children */
  children: React.ReactNode;
  /** Additional className */
  className?: string;
}

const CheckboxGroup = forwardRef<HTMLDivElement, CheckboxGroupProps>(
  ({ values, onChange, name, orientation = "vertical", children, className }, ref) => {
    const handleChange = (value: string, checked: boolean) => {
      if (checked) {
        onChange([...values, value]);
      } else {
        onChange(values.filter((v) => v !== value));
      }
    };

    return (
      <CheckboxGroupContext.Provider value={{ values, onChange: handleChange, name }}>
        <div ref={ref} role="group" className={cn(checkboxGroupVariants({ orientation }), className)}>
          {children}
        </div>
      </CheckboxGroupContext.Provider>
    );
  }
);

CheckboxGroup.displayName = "CheckboxGroup";

// ============================================
// Checkbox
// ============================================
const checkboxVariants = cva(
  [
    "inline-flex items-center gap-2",
    "cursor-pointer",
    "disabled:cursor-not-allowed disabled:opacity-50",
  ],
  {
    variants: {},
    defaultVariants: {},
  }
);

interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange">,
    VariantProps<typeof checkboxVariants> {
  /** Value for this checkbox */
  value: string;
  /** Label text */
  label: string;
  /** Standalone onChange (used when not in CheckboxGroup) */
  onChange?: (checked: boolean) => void;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, value, label, disabled, onChange, checked: controlledChecked, ...props }, ref) => {
    const groupContext = useCheckboxGroupContext();
    
    // Use group context if available, otherwise use props
    const isChecked = groupContext ? groupContext.values.includes(value) : controlledChecked;
    const handleChange = () => {
      if (disabled) return;
      if (groupContext) {
        groupContext.onChange(value, !isChecked);
      } else if (onChange) {
        onChange(!isChecked);
      }
    };
    const name = groupContext?.name || props.name;

    return (
      <label
        className={cn(checkboxVariants(), className)}
      >
        {/* Hidden input for accessibility */}
        <input
          ref={ref}
          type="checkbox"
          name={name}
          value={value}
          checked={isChecked}
          disabled={disabled}
          onChange={handleChange}
          className="sr-only"
          {...props}
        />
        
        {/* Custom checkbox box */}
        <span
          className={cn(
            "relative shrink-0",
            "w-[24px] h-[24px]",
            "rounded-[6px]",
            "border border-[rgba(0,0,0,0.15)]",
            "bg-white",
            "transition-colors",
          )}
        >
          {/* Checkmark icon when checked */}
          {isChecked && (
            <Check
              className={cn(
                "absolute",
                "w-[16px] h-[16px]",
                "top-[3px] left-[3px]",
                "text-[#1877F2]",
              )}
            />
          )}
        </span>
        
        {/* Label */}
        <span className="text-[14px] font-normal leading-[20px] text-[rgba(0,0,0,0.85)] font-optimistic">
          {label}
        </span>
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";

// ============================================
// Compound Component Export
// ============================================
const CheckboxComponent = Object.assign(Checkbox, {
  Group: CheckboxGroup,
});

export { CheckboxComponent as Checkbox, Checkbox as CheckboxItem, CheckboxGroup, checkboxVariants, checkboxGroupVariants };
export type { CheckboxProps, CheckboxGroupProps };

