import { ImageResponse } from "next/og";

// Replaces the default Next.js favicon with the VDS text mark, matching the
// sidebar logo in `src/components/layout/sidebar.tsx`. Next.js renders
// this at build time and auto-injects <link rel="icon"> into <head>.
//
// This route takes precedence over src/app/favicon.ico, which is the
// Next.js default and can stay on disk harmlessly (or be removed).

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #fb923c, #ea580c)",
          borderRadius: 6,
        }}
      >
        <span
          style={{
            color: "#ffffff",
            fontSize: 9,
            fontWeight: 800,
            letterSpacing: "-0.08em",
          }}
        >
          VDS
        </span>
      </div>
    ),
    { ...size },
  );
}
