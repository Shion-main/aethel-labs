export const PART_IDS = ["bar", "blade", "counter", "leg"] as const;
export type PartId = (typeof PART_IDS)[number];

// Paste the exact `d` values from public/brand/mark-white.svg:
const trianglePath = "M2775.07 2746.5L2977.68 2401.5L3339 2605.95L2775.07 2746.5Z";
const framePath =
  "M3307 1266H565V1678H896.573L2234.5 2444L2437.64 2092L1720.57 1678H2775.07L1523 3846.64H1998.74L1999.07 3846.06L2802.3 3855.86L2234.5 3522L3307 1691.5L3818.5 1987.86H4557.3L3307 1266Z";

/**
 * The four build parts. `counter` is the small triangle; the other three are
 * horizontal bands of the frame path revealed via clip rectangles so each can
 * fly in independently. Bands (in viewBox units) top→bottom: bar 1266–1900,
 * blade 1900–2600, leg 2600–3860.
 */
export function MarkParts({ fill = "currentColor" }: { fill?: string }) {
  return (
    <g>
      <defs>
        <clipPath id="band-bar"><rect x="0" y="1200" width="5122" height="700" /></clipPath>
        <clipPath id="band-blade"><rect x="0" y="1900" width="5122" height="700" /></clipPath>
        <clipPath id="band-leg"><rect x="0" y="2600" width="5122" height="1300" /></clipPath>
      </defs>
      <g data-part="bar"><path d={framePath} fill={fill} clipPath="url(#band-bar)" /></g>
      <g data-part="blade"><path d={framePath} fill={fill} clipPath="url(#band-blade)" /></g>
      <g data-part="leg"><path d={framePath} fill={fill} clipPath="url(#band-leg)" /></g>
      <g data-part="counter"><path d={trianglePath} fill={fill} /></g>
    </g>
  );
}
