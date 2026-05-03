import { IconProps } from "../types";

export function Shield({ size = 24, className = "" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.74414 5.1134C8.88746 2.29586 15.1125 2.29586 20.2559 5.1134C20.7145 5.36473 21 5.84627 21 6.36926V10.2452L20.9932 10.6554C20.849 14.8789 18.4896 18.7296 14.7656 20.7696L12.9609 21.7579L12.8477 21.8155C12.3109 22.0667 11.6891 22.0667 11.1523 21.8155L11.0391 21.7579L9.23438 20.7696C5.51037 18.7296 3.15097 14.8789 3.00684 10.6554L3 10.2452V6.36926C3.00004 5.84627 3.28551 5.36473 3.74414 5.1134Z"
        fill="currentColor"
      />
    </svg>
  );
}
