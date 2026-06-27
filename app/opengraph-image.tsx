import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Aethel Labs — Brand & Web Studio. Design worth the name.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background:
            "radial-gradient(1100px 700px at 78% 18%, rgba(199,93,58,0.42), rgba(199,93,58,0) 60%), #0a1a2f",
          color: "#faf8f5",
          fontFamily: "Georgia, 'Times New Roman', serif",
        }}
      >
        <div
          style={{
            fontFamily: "ui-monospace, monospace",
            fontSize: 24,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#d67955",
          }}
        >
          Brand &amp; Web Studio
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", fontSize: 72, lineHeight: 1.05, letterSpacing: -2 }}>
            Designing brands.
          </div>
          <div style={{ display: "flex", fontSize: 72, lineHeight: 1.05, letterSpacing: -2 }}>
            <span style={{ color: "#d67955" }}>Building&nbsp;</span>
            <span>what they live on.</span>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 30,
          }}
        >
          <div style={{ color: "#cdd5dd" }}>Aethel Labs</div>
          <div style={{ color: "#faf8f5" }}>Design worth the name.</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
