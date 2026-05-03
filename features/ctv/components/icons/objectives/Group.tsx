import { SVGProps } from "react";

export function Group(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="7" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="14" cy="6" r="2" stroke="currentColor" strokeWidth="1.5" />
      <path 
        d="M1 17V15.5C1 13.5 3.5 12 7 12C10.5 12 13 13.5 13 15.5V17"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path 
        d="M13 12.5C15 12.5 17 13.5 17 15V17"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
