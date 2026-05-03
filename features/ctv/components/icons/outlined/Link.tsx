import { SVGProps } from "react";

export function Link(props: SVGProps<SVGSVGElement>) {
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
        d="M6.5 9.5L9.5 6.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 11L7.5 12.5C6.11929 13.8807 3.88071 13.8807 2.5 12.5C1.11929 11.1193 1.11929 8.88071 2.5 7.5L4 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 5L8.5 3.5C9.88071 2.11929 12.1193 2.11929 13.5 3.5C14.8807 4.88071 14.8807 7.11929 13.5 8.5L12 10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
