import { SVGProps } from "react";

export function Duplicate(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" {...props}>
      <mask id="mask0_duplicate_outline" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
        <rect width="20" height="20" fill="url(#pattern0_duplicate_outline)"/>
      </mask>
      <g mask="url(#mask0_duplicate_outline)">
        <rect width="20" height="20" fill="currentColor"/>
      </g>
      <defs>
        <pattern id="pattern0_duplicate_outline" patternContentUnits="objectBoundingBox" width="1" height="1">
          <use xlinkHref="#image0_duplicate_outline" transform="scale(0.025)"/>
        </pattern>
        <image id="image0_duplicate_outline" width="40" height="40" preserveAspectRatio="none" xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGDSURBVHgB7ZjPTcMwFId/0AvHjOANYIRsACNkkyIWaJigYgKunAgbIBbAbBC49URxVCu8urHz/K+VKn/SkyIn772vdlLFAc6QWkWrolMhVfQqtjMxXCtwBFYMGVvI3JIxctklBQ6X7E6PV5Ycen2fW7IlDdbMHCp4k1uyI8VrZg4VRG5Jif3Z4GAKZpWkzaqAHBiSMrWkrVlojkCE5FInLZnNbMzNujAkOwQUdo3NIeH3H9lPFblEPh7hB/feTjaDA42Kd/Bn8YALTAua57czOTE4a+dc4iQUwViKYCxFMJYiGEsRjIUr+E2O2W8dDCpLj5FTCwpLjxGu4Bc5vkY6KkuPEa7gBzlukI7G0sPJ1AtkbYyv9ZiAH5XOGb5KPBs1BbcI3bfSJWjht8fwiRU8kI5flVry11duoCMFbifOC+x/H/TduX2qeNViNQKgs9ThxCwmxjb4f7qEjh/s7seNjhCSbrZyPRD3SEguSS8WjnMvKp6wWxq6rFfgYwo9qHjDOfEHpDMwEOmZAf0AAAAASUVORK5CYII="/>
      </defs>
    </svg>
  );
}

