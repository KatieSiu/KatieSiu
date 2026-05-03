import { SVGProps } from "react";

export function RightRectangles(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M8.79288 14.8891H2.69764C1.85606 14.8891 1.17383 14.2069 1.17383 13.3653V2.69861C1.17383 1.85704 1.85606 1.1748 2.69764 1.1748H8.79288V14.8891Z" />
      <path d="M14.8881 13.3653C14.8881 14.2069 14.2059 14.8891 13.3643 14.8891H10.3167V11.0796H14.8881V13.3653Z" />
      <path d="M14.8881 9.55576H10.3167V6.50814H14.8881V9.55576Z" />
      <path d="M13.3643 1.1748C14.2059 1.1748 14.8881 1.85704 14.8881 2.69861V4.98433H10.3167V1.1748H13.3643Z" />
    </svg>
  );
}

