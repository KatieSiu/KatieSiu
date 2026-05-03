import { SVGProps } from "react";

export function Messages(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path 
        d="M6 5H17.5C18.0523 5 18.5 5.44772 18.5 6V12C18.5 12.5523 18.0523 13 17.5 13H15.5V16L12 13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path 
        d="M12 8H2.5C1.94772 8 1.5 8.44772 1.5 9V15C1.5 15.5523 1.94772 16 2.5 16H4.5V19L8 16H12C12.5523 16 13 15.5523 13 15V9C13 8.44772 12.5523 8 12 8Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
