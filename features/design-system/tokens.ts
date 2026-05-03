export const designSystemMeta = {
  name: "Linear landing page prototype",
  source: "Figma MCP",
  status: "Limited to the colors and font styles shown in Figma frame 26:15603.",
  figmaNode: "26:15603",
} as const;

export const colorTokens = [
  {
    name: "Background Color",
    value: "#181818",
    nodeId: "26:15604",
  },
  {
    name: "Background Color",
    value: "#000000",
    nodeId: "26:15607",
  },
  {
    name: "Background Color",
    value: "#F6ECD9",
    nodeId: "26:15605",
  },
  {
    name: "Background Color",
    value: "#4073FF",
    nodeId: "26:15608",
  },
] as const;

export const typographyTokens = [
  {
    name: "Heading",
    sample: "Heading",
    fontFamily: "var(--font-eb-garamond), EB Garamond, Georgia, serif",
    size: "50px",
    lineHeight: "normal",
    weight: "400",
    letterSpacing: "normal",
    color: "#000000",
    nodeId: "26:15609",
  },
  {
    name: "Body",
    sample: "Body",
    fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
    size: "18px",
    lineHeight: "26px",
    weight: "400",
    letterSpacing: "0.18px",
    color: "#7F7973",
    nodeId: "26:15610",
  },
  {
    name: "Body Heading",
    sample: "Body Heading",
    fontFamily: "var(--font-inter), Inter, Helvetica, Arial, sans-serif",
    size: "18px",
    lineHeight: "26px",
    weight: "500",
    letterSpacing: "0.18px",
    color: "#000000",
    nodeId: "26:15611",
  },
  {
    name: "Link",
    sample: "Link",
    fontFamily: "var(--font-inter), Inter, Helvetica, Arial, sans-serif",
    size: "18px",
    lineHeight: "26px",
    weight: "500",
    letterSpacing: "0.18px",
    color: "#4073FF",
    nodeId: "26:15612",
  },
] as const;

export type ColorToken = (typeof colorTokens)[number];
export type TypographyToken = (typeof typographyTokens)[number];
