import { SVGProps } from "react";

export function Globe(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle 
        cx="10" 
        cy="10" 
        r="8.5" 
        stroke="currentColor" 
        strokeWidth="1.5"
      />
      <ellipse 
        cx="10" 
        cy="10" 
        rx="3.5" 
        ry="8.5" 
        stroke="currentColor" 
        strokeWidth="1.5"
      />
      <path 
        d="M2 10H18" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round"
      />
    </svg>
  );
}
