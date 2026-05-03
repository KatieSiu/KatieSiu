import { SVGProps } from "react";

export function RefreshLeft(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M12 2a9.93 9.93 0 0 0-7 2.87V3c0-.55-.45-1-1-1s-1 .45-1 1v4c0 .55.45 1 1 1h4c.55 0 1-.45 1-1s-.45-1-1-1H6.72c1.45-1.28 3.3-2 5.28-2 4.41 0 8 3.59 8 8s-3.59 8-8 8-8-3.59-8-8c0-.55-.45-1-1-1s-1 .45-1 1c0 5.51 4.49 10 10 10s10-4.49 10-10S17.51 2 12 2" />
    </svg>
  );
}

