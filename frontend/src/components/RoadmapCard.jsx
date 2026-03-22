// ════════════════════════════════════════════════════════════════
// components/RoadmapCard.jsx  —  PDF-safe version
// ════════════════════════════════════════════════════════════════
//
// PDF-SAFETY CHANGES vs previous version:
//
//  1. All colours are literal hex/rgba — no CSS variables.
//     html2canvas CANNOT resolve var(--text-primary) etc.
//     It renders them as black or transparent, breaking the PDF.
//
//  2. Transform on hover uses translateY(-3px) — this is fine for
//     the live UI but the PDF engine resets all transforms in the
//     off-screen clone before capture, so PDF is always flat.
//
//  3. animation / animationFillMode are isolated to the screen UI.
//     In the PDF clone, all animations are set to "none" and
//     opacity is forced to 1 (entrance animations start at opacity:0).
//
//  4. overflow:hidden on the card is changed to overflow:visible
//     in the clone to prevent content clipping.
// ════════════════════════════════════════════════════════════════

import React, { useState } from "react";

export default function RoadmapCard({ item, index, accentColor, accentGlow, onExplain }) {
  const [hovered, setHovered] = useState(false);
  const clickable = Boolean(onExplain);

  return (
    <div
      // ── DO NOT use className="glass-card" here ──
      // glass-card uses CSS variables and backdrop-filter.
      // We replicate its look with explicit values instead.
      onClick={() => clickable && onExplain(item.topic)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        // ── Explicit background (no CSS var) ────────────
        background:   "rgba(255, 255, 255, 0.04)",   /* was: var(--glass-bg) */
        border:       `1px solid ${hovered ? accentColor + "48" : accentColor + "18"}`,
        borderRadius: "16px",

        padding:       "18px 20px",

        // ── Entrance animation ───────────────────────────
        // opacity:0 + animation is for the screen UI.
        // The PDF engine clone will override opacity → 1
        // and animation → none before capturing.
        animationDelay:     `${index * 65}ms`,
        animationFillMode:  "both",
        opacity:            0,
        animation:          "slideUp 0.5s ease forwards",

        // ── Hover transform ──────────────────────────────
        // Safe: PDF engine resets all transforms in clone.
        transform:  hovered ? "translateY(-3px) scale(1.005)" : "translateY(0) scale(1)",
        boxShadow:  hovered ? accentGlow : "none",
        transition: "border-color 0.25s, transform 0.22s, box-shadow 0.25s",

        cursor:   clickable ? "pointer" : "default",
        position: "relative",
        overflow: "hidden",   // PDF engine changes to visible in clone
      }}
    >
      {/* "Ask AI" hover badge */}
      {clickable && hovered && (
        <div style={{
          position: "absolute", top: 10, right: 10,
          background:   `${accentColor}15`,
          border:       `1px solid ${accentColor}38`,
          borderRadius: "7px",
          padding:      "3px 9px",
          fontSize:     "0.6rem",
          color:        accentColor,           /* ← explicit colour, not var() */
          fontFamily:   "JetBrains Mono, monospace",
          letterSpacing: "0.04em",
          pointerEvents: "none",
          animation:    "fadeIn 0.15s ease",
          display:      "flex",
          alignItems:   "center",
          gap:          "4px",
        }}>
          🤖 <span>Ask AI</span>
        </div>
      )}

      {/* Index badge + topic name */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "11px", marginBottom: "10px" }}>
        <span style={{
          color:        accentColor,
          background:   `${accentColor}15`,
          border:       `1px solid ${accentColor}2e`,
          borderRadius: "7px",
          padding:      "2px 8px",
          fontSize:     "0.67rem",
          fontFamily:   "JetBrains Mono, monospace",
          fontWeight:   600,
          flexShrink:   0,
          marginTop:    "2px",
        }}>
          {String(index + 1).padStart(2, "0")}
        </span>
        <h4 style={{
          fontWeight:  600,
          fontSize:    "0.92rem",
          lineHeight:  1.35,
          color:       "#eef2ff",    /* ← explicit, not var(--text-primary) */
        }}>
          {item.topic}
        </h4>
      </div>

      {/* Explanation */}
      <p style={{
        fontSize:     "0.82rem",
        color:        "rgba(180, 190, 215, 0.8)",   /* ← explicit rgba */
        lineHeight:   1.65,
        marginBottom: "13px",
      }}>
        {item.explanation}
      </p>

      {/* Tool tags */}
      {item.tools?.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
          {item.tools.map((tool, i) => (
            <span key={i} style={{
              background:   `${accentColor}0d`,
              border:       `1px solid ${accentColor}22`,
              borderRadius: "6px",
              color:        accentColor,
              fontSize:     "0.63rem",
              fontFamily:   "JetBrains Mono, monospace",
              padding:      "2px 8px",
            }}>
              {tool}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
