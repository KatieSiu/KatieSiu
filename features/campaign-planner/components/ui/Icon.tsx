import { ComponentType, SVGProps } from "react";
import { iconRegistry, IconVariant } from "@/features/campaign-planner/components/icons";

interface IconProps {
  /** Icon name (e.g., "Home", "Search", "Arrow") */
  name: string;
  /** Icon variant: "filled", "outlined", "xs" */
  variant?: IconVariant;
  /** Icon size in pixels (default: 16) */
  size?: number;
  /** Icon color (CSS color value) */
  color?: string;
  /** Additional CSS classes */
  className?: string;
}

export function Icon({
  name,
  variant = "outlined",
  size = 16,
  color,
  className = ""
}: IconProps) {
  // Get the icon collection for the specified variant
  const variantIcons = iconRegistry[variant];
  
  if (!variantIcons) {
    console.warn(`Icon variant "${variant}" not found`);
    return null;
  }

  // Look up the icon by name
  const IconComponent = (variantIcons as Record<string, ComponentType<SVGProps<SVGSVGElement>>>)[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in "${variant}" variant`);
    return null;
  }

  return (
    <IconComponent
      width={size}
      height={size}
      className={`shrink-0 ${className}`}
      style={color ? { color } : undefined}
      aria-hidden="true"
    />
  );
}

// Export types for external use
export type { IconProps, IconVariant };
