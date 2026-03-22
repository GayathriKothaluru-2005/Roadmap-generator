// ============================================================
// components/CodeBlock.jsx
// Syntax-highlighted code block with copy button
// ============================================================

import React, { useState } from "react";

export default function CodeBlock({ code }) {
  const [copied, setCopied] = useState(false);

  if (!code?.trim()) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const ta = document.createElement("textarea");
      ta.value = code;
      ta.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      style={{
        marginTop: "16px",
        borderRadius: "12px",
        overflow: "hidden",
        border: "1px solid rgba(0,245,255,0.12)",
        background: "rgba(0,0,0,0.45)",
      }}
    >
      {/* Header bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 14px",
          background: "rgba(0,245,255,0.04)",
          borderBottom: "1px solid rgba(0,245,255,0.08)",
        }}
      >
        {/* Traffic light dots + label */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          {["#ff5f57","#febc2e","#28c840"].map((c, i) => (
            <span key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c, display: "inline-block" }} />
          ))}
          <span style={{ marginLeft: "8px", fontSize: "0.62rem", color: "rgba(0,245,255,0.45)", fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.08em" }}>
            code example
          </span>
        </div>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          style={{
            background: copied ? "rgba(48,209,88,0.12)" : "rgba(0,245,255,0.07)",
            border: `1px solid ${copied ? "rgba(48,209,88,0.35)" : "rgba(0,245,255,0.18)"}`,
            borderRadius: "6px",
            color: copied ? "#30d158" : "rgba(0,245,255,0.65)",
            cursor: "pointer",
            fontSize: "0.62rem",
            fontFamily: "JetBrains Mono, monospace",
            padding: "3px 10px",
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          {copied ? "✓ copied" : "copy"}
        </button>
      </div>

      {/* Code content */}
      <pre
        style={{
          margin: 0,
          padding: "14px 16px",
          overflowX: "auto",
          fontFamily: "JetBrains Mono, monospace",
          fontSize: "0.78rem",
          lineHeight: 1.75,
          color: "#cdd6f4",
          whiteSpace: "pre",
          wordBreak: "normal",
        }}
      >
        <code>{code.trim()}</code>
      </pre>
    </div>
  );
}
