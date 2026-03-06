import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "SnapMock - Beautiful Screenshot Mockups in Seconds";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #8b5cf6 0%, #d946ef 50%, #f43f5e 100%)",
          padding: "60px",
        }}
      >
        {/* Card */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255,255,255,0.95)",
            borderRadius: "32px",
            padding: "60px 80px",
            maxWidth: "1000px",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.3)",
          }}
        >
          {/* Logo */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "14px",
                background: "linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)",
              }}
            />
            <span
              style={{
                fontSize: "48px",
                fontWeight: 800,
                color: "#111827",
              }}
            >
              SnapMock
            </span>
          </div>

          {/* Tagline */}
          <p
            style={{
              fontSize: "28px",
              fontWeight: 600,
              color: "#6b7280",
              textAlign: "center",
              margin: 0,
              lineHeight: 1.4,
            }}
          >
            Beautiful Screenshot Mockups in Seconds
          </p>

          {/* Features */}
          <div
            style={{
              display: "flex",
              gap: "32px",
              marginTop: "32px",
            }}
          >
            {["Free", "No Sign-up", "100% Private"].map((f) => (
              <div
                key={f}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 20px",
                  background: "rgba(139, 92, 246, 0.1)",
                  borderRadius: "100px",
                  fontSize: "18px",
                  fontWeight: 600,
                  color: "#7c3aed",
                }}
              >
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
