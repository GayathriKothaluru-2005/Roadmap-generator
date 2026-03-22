// ============================================================
// components/RoadmapSection.jsx
// One learning stage (Beginner / Intermediate / Advanced)
// Passes onExplain callback down to every RoadmapCard
// ============================================================

import React from "react";
import RoadmapCard from "./RoadmapCard";

const STAGE_CONFIG = {
  beginner: {
    label: "Beginner", emoji: "🌱", subtitle: "Foundation & Core Concepts",
    accentColor: "#30d158",
    accentGlow: "0 0 22px rgba(48,209,88,0.15)",
  },
  intermediate: {
    label: "Intermediate", emoji: "⚡", subtitle: "Building Real Skills",
    accentColor: "#00f5ff",
    accentGlow: "0 0 22px rgba(0,245,255,0.15)",
  },
  advanced: {
    label: "Advanced", emoji: "🚀", subtitle: "Industry-Level Mastery",
    accentColor: "#bf5af2",
    accentGlow: "0 0 22px rgba(191,90,242,0.15)",
  },
};

// onExplain(topic) — called when a card is clicked
export default function RoadmapSection({ stage, items, onExplain }) {
  const cfg = STAGE_CONFIG[stage];
  if (!cfg || !items?.length) return null;

  return (
    <div style={{ marginBottom: "44px" }} className="animate-fade-in">

      {/* Stage header */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "18px" }}>
        {/* Icon */}
        <div
          style={{
            width: 44, height: 44,
            borderRadius: "12px",
            background: `${cfg.accentColor}12`,
            border: `1px solid ${cfg.accentColor}32`,
            boxShadow: cfg.accentGlow,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.2rem", flexShrink: 0,
          }}
        >
          {cfg.emoji}
        </div>

        {/* Labels */}
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <h3 style={{ fontWeight: 700, fontSize: "1.1rem", color: cfg.accentColor }}>
              {cfg.label}
            </h3>
            <span
              style={{
                fontSize: "0.63rem",
                fontFamily: "JetBrains Mono, monospace",
                padding: "2px 8px",
                borderRadius: "5px",
                background: `${cfg.accentColor}10`,
                border: `1px solid ${cfg.accentColor}25`,
                color: cfg.accentColor,
              }}
            >
              {items.length} topics
            </span>
            {/* Hint: only show if AI Tutor is enabled */}
            {onExplain && (
              <span style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.28)" }}>
                · tap card to ask AI 🤖
              </span>
            )}
          </div>
          <p style={{ fontSize: "0.77rem", color: "rgba(140,155,185,0.8)", marginTop: "2px" }}>
            {cfg.subtitle}
          </p>
        </div>
      </div>

      {/* Responsive card grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(275px, 1fr))",
          gap: "14px",
        }}
      >
        {items.map((item, idx) => (
          <RoadmapCard
            key={idx}
            item={item}
            index={idx}
            accentColor={cfg.accentColor}
            accentGlow={cfg.accentGlow}
            onExplain={onExplain}   // ← AI Tutor wiring
          />
        ))}
      </div>
    </div>
  );
}
