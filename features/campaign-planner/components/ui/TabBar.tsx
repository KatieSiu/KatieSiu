import {
  forwardRef,
  createContext,
  useContext,
  type HTMLAttributes,
  type ButtonHTMLAttributes,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/features/campaign-planner/lib/utils";
import { Icon } from "./Icon";
import { IconVariant } from "@/features/campaign-planner/components/icons";

// ============================================
// Context for TabBar state
// ============================================
interface TabBarContextValue {
  value: string | null;
  onChange: (value: string) => void;
}

const TabBarContext = createContext<TabBarContextValue | null>(null);

const useTabBarContext = () => {
  const context = useContext(TabBarContext);
  if (!context) {
    throw new Error("Tab must be used within a TabBar");
  }
  return context;
};

// ============================================
// TabBar Container
// ============================================
const tabBarVariants = cva("inline-flex items-start gap-2", {
  variants: {
    fullWidth: {
      true: "w-full",
      false: "w-auto",
    },
  },
  defaultVariants: {
    fullWidth: false,
  },
});

interface TabBarProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange">,
    VariantProps<typeof tabBarVariants> {
  /** Currently selected tab value */
  value: string | null;
  /** Callback when tab selection changes */
  onChange: (value: string) => void;
}

const TabBarRoot = forwardRef<HTMLDivElement, TabBarProps>(
  ({ className, value, onChange, fullWidth, children, ...props }, ref) => {
    return (
      <TabBarContext.Provider value={{ value, onChange }}>
        <div
          ref={ref}
          role="tablist"
          className={cn(tabBarVariants({ fullWidth }), className)}
          {...props}
        >
          {children}
        </div>
      </TabBarContext.Provider>
    );
  }
);

TabBarRoot.displayName = "TabBar";

// ============================================
// Tab Item
// ============================================
const tabVariants = cva(
  [
    "inline-flex items-center justify-center",
    "h-[36px] px-3 py-2",
    "text-[14px] leading-[20px]",
    "rounded-[4px]",
    "font-optimistic",
    "cursor-pointer",
    "disabled:cursor-not-allowed disabled:opacity-50",
  ],
  {
    variants: {
      isSelected: {
        true: [
          "bg-[#E1EDF7] text-[#0A78BE] font-bold",
          "hover:bg-[#D4E4F2]",
          "active:bg-[#C7DBED]",
        ],
        false: [
          "bg-transparent text-[#1C2B33] font-medium",
          "hover:bg-[rgba(0,0,0,0.05)]",
          "active:bg-[rgba(0,0,0,0.1)]",
        ],
      },
    },
    defaultVariants: {
      isSelected: false,
    },
  }
);

interface TabProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value"> {
  /** Unique value for this tab */
  value: string;
  /** Tab label text (optional if icon-only) */
  label?: string;
  /** Icon name (optional) */
  icon?: string;
  /** Icon variant */
  iconVariant?: IconVariant;
  /** Accessible label for icon-only tabs */
  "aria-label"?: string;
}

const Tab = forwardRef<HTMLButtonElement, TabProps>(
  (
    {
      className,
      value,
      label,
      icon,
      iconVariant = "filled",
      disabled,
      "aria-label": ariaLabel,
      ...props
    },
    ref
  ) => {
    const { value: selectedValue, onChange } = useTabBarContext();
    const isSelected = selectedValue === value;

    // Require aria-label for icon-only tabs
    const accessibleLabel = ariaLabel || label;

    return (
      <button
        ref={ref}
        role="tab"
        type="button"
        aria-selected={isSelected}
        aria-label={accessibleLabel}
        disabled={disabled}
        className={cn(tabVariants({ isSelected }), className)}
        onClick={() => onChange(value)}
        {...props}
      >
        {icon && (
          <Icon
            name={icon}
            variant={iconVariant}
            size={16}
            className={cn(
              isSelected ? "text-[#0A78BE]" : "text-[#1C2B33]",
              label && "mr-2"
            )}
          />
        )}
        {label && <span>{label}</span>}
      </button>
    );
  }
);

Tab.displayName = "Tab";

// ============================================
// Compound Component Export
// ============================================
const TabBar = Object.assign(TabBarRoot, {
  Tab,
});

export { TabBar, tabBarVariants, tabVariants };
export type { TabBarProps, TabProps };
