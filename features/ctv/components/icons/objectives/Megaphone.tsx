import { SVGProps } from "react";

export function Megaphone(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path 
        d="M17.5 3.75V16.25M17.5 4.5L4.5 7.5H2.5C1.67157 7.5 1 8.17157 1 9V11C1 11.8284 1.67157 12.5 2.5 12.5H4.5M17.5 15.5L4.5 12.5M4.5 12.5L5.5 17C5.5 17.5523 5.94772 18 6.5 18H7C7.55228 18 8 17.5523 8 17L7 12.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
