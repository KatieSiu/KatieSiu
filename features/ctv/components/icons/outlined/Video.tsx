import { SVGProps } from "react";

export function Video(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M2 4.5C2 3.67157 2.67157 3 3.5 3H9.5C10.3284 3 11 3.67157 11 4.5V11.5C11 12.3284 10.3284 13 9.5 13H3.5C2.67157 13 2 12.3284 2 11.5V4.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11 6L14 4V12L11 10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
