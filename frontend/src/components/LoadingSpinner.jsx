// ============================================================
// components/LoadingSpinner.jsx  (UPDATED)
// Full-page loading state shown while API is fetching
// ============================================================

import React from "react";

export default function LoadingSpinner({ topic }) {
  const steps = [
    "Analysing topic…",
    "Building learning path…",
    "Adding tools & resources…",
    "Finalising roadmap…",
  ];

  return (
    <div
      className="flex flex-col items-center justify-center py-20 gap-8 animate-fade-in"
      style={{ minHeight: "40vh" }}
    >
      {/* Triple-ring spinner */}
      <div style={{ position: "relative", width: 72, height: 72 }}>
        {[
          { size: 72, color: "var(--neon-cyan)",   duration: "0.9s", direction: "normal"  },
          { size: 54, color: "var(--neon-purple)", duration: "1.4s", direction: "reverse" },
          { size: 36, color: "var(--neon-green)",  duration: "1.1s", direction: "normal"  },
        ].map((ring, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: "50%", left: "50%",
              width: ring.size, height: ring.size,
              marginTop: -ring.size / 2, marginLeft: -ring.size / 2,
              borderRadius: "50%",
              border: `2px solid transparent`,
              borderTopColor: ring.color,
              borderRightColor: `${ring.color}33`,
              animation: `spin ${ring.duration} linear infinite ${ring.direction === "reverse" ? "reverse" : ""}`,
              boxShadow: `0 0 8px ${ring.color}44`,
            }}
          />
        ))}
        {/* Center dot */}
        <div
          style={{
            position: "absolute",
            top: "50%", left: "50%",
            width: 10, height: 10,
            marginTop: -5, marginLeft: -5,
            borderRadius: "50%",
            background: "var(--neon-cyan)",
            boxShadow: "0 0 10px var(--neon-cyan)",
            animation: "pulse2 1.5s ease-in-out infinite",
          }}
        />
      </div>

      {/* Text */}
      <div style={{ textAlign: "center" }}>
        <p
          style={{
            fontSize: "1.15rem",
            fontWeight: 600,
            color: "var(--text-primary)",
            marginBottom: "6px",
          }}
        >
          Generating your roadmap…
        </p>
        <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
          Building a personalised path for{" "}
          <span style={{ color: "var(--neon-cyan)", fontWeight: 600 }}>
            "{topic}"
          </span>
        </p>
      </div>

      {/* Animated step indicators */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "center" }}>
        {steps.map((step, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              opacity: 0,
              animation: `fadeIn 0.4s ease ${0.4 + i * 0.5}s forwards`,
            }}
          >
            <span
              style={{
                width: 6, height: 6,
                borderRadius: "50%",
                background: "var(--neon-cyan)",
                animation: `pulse2 1.2s ease-in-out ${i * 0.3}s infinite`,
              }}
            />
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
