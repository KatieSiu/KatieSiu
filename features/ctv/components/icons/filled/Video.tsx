import { SVGProps } from "react";

export function Video(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path fillRule="evenodd" clipRule="evenodd" d="M2 4.5C2 3.67157 2.67157 3 3.5 3H9.5C10.3284 3 11 3.67157 11 4.5V5.38197L13.2111 4.27639C13.4718 4.14602 13.7815 4.15557 14.0333 4.30162C14.2851 4.44766 14.4444 4.71256 14.4444 5V11C14.4444 11.2874 14.2851 11.5523 14.0333 11.6984C13.7815 11.8444 13.4718 11.854 13.2111 11.7236L11 10.618V11.5C11 12.3284 10.3284 13 9.5 13H3.5C2.67157 13 2 12.3284 2 11.5V4.5Z" />
    </svg>
  );
}
