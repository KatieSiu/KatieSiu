import { SVGProps } from "react";

export function Duplicate(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" {...props}>
      <mask id="mask0_duplicate_filled" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
        <rect width="20" height="20" fill="url(#pattern0_duplicate_filled)"/>
      </mask>
      <g mask="url(#mask0_duplicate_filled)">
        <rect width="20" height="20" fill="currentColor"/>
      </g>
      <defs>
        <pattern id="pattern0_duplicate_filled" patternContentUnits="objectBoundingBox" width="1" height="1">
          <use xlinkHref="#image0_duplicate_filled" transform="scale(0.025)"/>
        </pattern>
        <image id="image0_duplicate_filled" width="40" height="40" preserveAspectRatio="none" xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAACXBIWXMAABYlAAAWJQFJUiTwAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAE4SURBVHgB7ZjNjcIwEEY/lssetwR3sC2kg90SKIEOQDQALdAFJ0ILNEDSAXDjRJgII0XBSezMDETIT3oSiiF+YH6CgYEzQjgJ+U/+kob8sXbNUd43hzJLsgj0QWYjBxVXDSw0Iw36xdUD1SJXkAtUiUwhGygemUE+UDSyYNh1DpFITuDjOzKTipzZB80gEziHMCHL4+sU7b82jYwaAuvjBV7DU88XBk4M5BIDucRALjGQSwzkEgO5+AaeoI9zjo8JzKFP7jroG7iHPt5zuC75E/Av+7s08OSI539kJZzdhS6XCCBreVbSkdfQuJK0coI/x7ixoSnCdxzK1TmQWxuWoAfVVynFmxk7jl3Iib1trGfc348Xax/67OY2ovWBmEMQrcggxi1jG3KN+9JUl/Ub/tSDFuQOn8QNwWhe4+dqIn0AAAAASUVORK5CYII="/>
      </defs>
    </svg>
  );
}

