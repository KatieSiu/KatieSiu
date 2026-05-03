import { SVGProps } from "react";

export function TV(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path 
        d="M2.5 4.5H17.5C18.0523 4.5 18.5 4.94772 18.5 5.5V14.5C18.5 15.0523 18.0523 15.5 17.5 15.5H2.5C1.94772 15.5 1.5 15.0523 1.5 14.5V5.5C1.5 4.94772 1.94772 4.5 2.5 4.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path 
        d="M6 18.5H14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path 
        d="M10 15.5V18.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
