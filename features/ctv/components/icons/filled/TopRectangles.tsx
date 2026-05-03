import { SVGProps } from "react";

export function TopRectangles(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M14.8881 13.3624C14.8881 14.2039 14.2059 14.8862 13.3643 14.8862H2.69764C1.85606 14.8862 1.17383 14.2039 1.17383 13.3624V6.50372H14.8881V13.3624Z" />
      <path d="M4.98335 4.97991H1.17383V2.69568C1.17383 1.85411 1.85606 1.17188 2.69764 1.17188H4.98335V4.97991Z" />
      <path d="M13.3643 1.17188C14.2059 1.17188 14.8881 1.85411 14.8881 2.69568V4.97991H11.0786V1.17188H13.3643Z" />
      <path d="M9.55478 4.97991H6.50716V1.17188H9.55478V4.97991Z" />
    </svg>
  );
}

