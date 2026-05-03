import { forwardRef, createContext, useContext, type InputHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/features/ctv/lib/utils";

// ============================================
// Context for RadioGroup state
// ============================================
interface RadioGroupContextValue {
  value: string | null;
  onChange: (value: string) => void;
  name: string;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

const useRadioGroupContext = () => {
  return useContext(RadioGroupContext);
};

// ============================================
// RadioGroup Container
// ============================================
const radioGroupVariants = cva("flex gap-3", {
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

interface RadioGroupProps extends VariantProps<typeof radioGroupVariants> {
  /** Currently selected value */
  value: string | null;
  /** Callback when selection changes */
  onChange: (value: string) => void;
  /** Name attribute for the radio group */
  name: string;
  /** Radio button children */
  children: React.ReactNode;
  /** Additional className */
  className?: string;
}

const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ value, onChange, name, orientation = "vertical", children, className }, ref) => {
    return (
      <RadioGroupContext.Provider value={{ value, onChange, name }}>
        <div ref={ref} role="radiogroup" className={cn(radioGroupVariants({ orientation }), className)}>
          {children}
        </div>
      </RadioGroupContext.Provider>
    );
  }
);

RadioGroup.displayName = "RadioGroup";

// ============================================
// RadioButton
// ============================================
const radioVariants = cva(
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

interface RadioButtonProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange">,
    VariantProps<typeof radioVariants> {
  /** Value for this radio button */
  value: string;
  /** Label text */
  label: string;
  /** Standalone onChange (used when not in RadioGroup) */
  onChange?: (value: string) => void;
}

const RadioButton = forwardRef<HTMLInputElement, RadioButtonProps>(
  ({ className, value, label, disabled, onChange, ...props }, ref) => {
    const groupContext = useRadioGroupContext();
    
    // Use group context if available, otherwise use props
    const isSelected = groupContext ? groupContext.value === value : props.checked;
    const handleChange = () => {
      if (disabled) return;
      if (groupContext) {
        groupContext.onChange(value);
      } else if (onChange) {
        onChange(value);
      }
    };
    const name = groupContext?.name || props.name;

    return (
      <label
        className={cn(radioVariants(), className)}
      >
        {/* Hidden input for accessibility */}
        <input
          ref={ref}
          type="radio"
          name={name}
          value={value}
          checked={isSelected}
          disabled={disabled}
          onChange={handleChange}
          className="sr-only"
          {...props}
        />
        
        {/* Custom radio circle */}
        <span
          className={cn(
            "relative shrink-0",
            "w-[24px] h-[24px]",
            "rounded-full",
            "border border-[rgba(0,0,0,0.15)]",
            "transition-colors",
          )}
        >
          {/* Inner dot when selected */}
          {isSelected && (
            <span
              className={cn(
                "absolute",
                "w-[12px] h-[12px]",
                "top-[5px] left-[5px]",
                "rounded-full",
                "bg-[#1877F2]",
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

RadioButton.displayName = "RadioButton";

// ============================================
// Compound Component Export
// ============================================
const Radio = Object.assign(RadioButton, {
  Group: RadioGroup,
});

export { Radio, RadioButton, RadioGroup, radioVariants, radioGroupVariants };
export type { RadioButtonProps, RadioGroupProps };

