// ============================================================
// components/ChatBubble.jsx
// User bubble + AI bubble (10-12 bullets) + Thinking skeleton
// ============================================================

import React from "react";
import CodeBlock from "./CodeBlock";

// ── User message bubble ───────────────────────────────────
function UserBubble({ text }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "18px" }}>
      <div
        style={{
          maxWidth: "82%",
          background: "linear-gradient(135deg, rgba(0,245,255,0.13), rgba(191,90,242,0.13))",
          border: "1px solid rgba(0,245,255,0.22)",
          borderRadius: "18px 18px 4px 18px",
          padding: "11px 16px",
          fontSize: "0.875rem",
          color: "#e8edf8",
          lineHeight: 1.55,
          letterSpacing: "0.01em",
        }}
      >
        {text}
      </div>
    </div>
  );
}

// ── AI response bubble ────────────────────────────────────
function AIBubble({ explanation, code }) {
  // Split explanation on newline, filter empties
  const lines = (explanation || "")
    .split("\n")
    .map(l => l.trim())
    .filter(Boolean);

  // Separate intro sentences from bullet points
  const intro   = lines.filter(l => !l.startsWith("•") && !l.startsWith("-") && !l.startsWith("*"));
  const bullets = lines.filter(l =>  l.startsWith("•") ||  l.startsWith("-") ||  l.startsWith("*"));

  return (
    <div style={{ display: "flex", gap: "10px", marginBottom: "20px", alignItems: "flex-start" }}>
      {/* AI avatar */}
      <div
        style={{
          width: 34, height: 34,
          borderRadius: "50%",
          background: "linear-gradient(135deg, rgba(0,245,255,0.18), rgba(191,90,242,0.28))",
          border: "1.5px solid rgba(0,245,255,0.28)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "0.88rem",
          flexShrink: 0,
          boxShadow: "0 0 14px rgba(0,245,255,0.12)",
        }}
      >
        🤖
      </div>

      {/* Bubble card */}
      <div
        style={{
          flex: 1,
          background: "rgba(255,255,255,0.035)",
          border: "1px solid rgba(255,255,255,0.075)",
          borderRadius: "4px 18px 18px 18px",
          padding: "16px 18px",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        {/* "AI Tutor" label */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            marginBottom: "12px",
            background: "rgba(0,245,255,0.07)",
            border: "1px solid rgba(0,245,255,0.15)",
            borderRadius: "100px",
            padding: "3px 10px",
          }}
        >
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--neon-cyan, #00f5ff)", display: "inline-block" }} />
          <span style={{ fontSize: "0.58rem", color: "rgba(0,245,255,0.7)", fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            AI Tutor
          </span>
        </div>

        {/* Intro paragraph (if any non-bullet lines exist) */}
        {intro.length > 0 && (
          <p style={{ fontSize: "0.85rem", color: "#b8c4d8", lineHeight: 1.65, marginBottom: "12px" }}>
            {intro.join(" ")}
          </p>
        )}

        {/* Bullet points */}
        <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
          {bullets.map((line, i) => {
            const text = line.replace(/^[•\-\*]\s*/, "");
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "flex-start",
                  // Stagger entrance via CSS animation delay
                  animation: `fadeIn 0.3s ease ${i * 0.04}s both`,
                }}
              >
                {/* Bullet marker */}
                <span
                  style={{
                    color: "rgba(0,245,255,0.6)",
                    fontSize: "0.6rem",
                    marginTop: "5px",
                    flexShrink: 0,
                    lineHeight: 1,
                  }}
                >
                  ◆
                </span>
                <p
                  style={{
                    fontSize: "0.845rem",
                    color: "#c4cfe8",
                    lineHeight: 1.65,
                    margin: 0,
                  }}
                >
                  {text}
                </p>
              </div>
            );
          })}
        </div>

        {/* Code block */}
        {code && <CodeBlock code={code} />}
      </div>
    </div>
  );
}

// ── Thinking / loading skeleton ───────────────────────────
export function ThinkingBubble() {
  return (
    <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", marginBottom: "20px" }}>
      {/* Pulsing avatar */}
      <div
        style={{
          width: 34, height: 34,
          borderRadius: "50%",
          background: "linear-gradient(135deg, rgba(0,245,255,0.18), rgba(191,90,242,0.28))",
          border: "1.5px solid rgba(0,245,255,0.28)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "0.88rem", flexShrink: 0,
          animation: "pulse2 1.4s ease-in-out infinite",
        }}
      >
        🤖
      </div>

      {/* Skeleton card */}
      <div
        style={{
          flex: 1,
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "4px 18px 18px 18px",
          padding: "16px 18px",
        }}
      >
        {/* "Thinking" label */}
        <p style={{ fontSize: "0.6rem", color: "rgba(0,245,255,0.4)", fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.1em", marginBottom: "14px" }}>
          AI IS THINKING...
        </p>

        {/* Shimmer skeleton lines — 10 lines to hint at the 10-12 bullets */}
        {[95, 80, 88, 72, 90, 76, 85, 65, 82, 70].map((w, i) => (
          <div
            key={i}
            style={{
              height: "9px",
              width: `${w}%`,
              borderRadius: "5px",
              background: "rgba(255,255,255,0.055)",
              marginBottom: "9px",
              animation: `pulse2 1.5s ease-in-out ${i * 0.1}s infinite`,
            }}
          />
        ))}

        {/* Code skeleton block */}
        <div
          style={{
            marginTop: "16px",
            height: "72px",
            borderRadius: "10px",
            background: "rgba(0,0,0,0.3)",
            border: "1px solid rgba(0,245,255,0.07)",
            animation: "pulse2 1.5s ease-in-out 1s infinite",
          }}
        />
      </div>
    </div>
  );
}

// ── Default export: dispatch to correct bubble type ───────
export default function ChatBubble({ message }) {
  if (message.role === "user") return <UserBubble text={message.text} />;
  return <AIBubble explanation={message.explanation} code={message.code} />;
}
