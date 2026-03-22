// ============================================================
// components/Header.jsx
// Top navigation / branding bar
// ============================================================

import React from "react";

export default function Header() {
  return (
    <header className="w-full py-6 px-6 flex items-center justify-between animate-fade-in">
      {/* Logo / Brand */}
      <div className="flex items-center gap-3">
        {/* Glowing icon */}
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
          style={{
            background: "linear-gradient(135deg, rgba(0,245,255,0.2), rgba(191,90,242,0.2))",
            border: "1px solid rgba(0,245,255,0.3)",
            boxShadow: "0 0 15px rgba(0,245,255,0.2)",
          }}
        >
          🗺️
        </div>
        <div>
          <p className="text-xs text-muted" style={{ color: "var(--text-muted)", letterSpacing: "0.1em" }}>
            AI-POWERED
          </p>
          <h1
            className="font-bold text-sm leading-none gradient-text"
            style={{ fontSize: "0.95rem" }}
          >
            Roadmap Generator
          </h1>
        </div>
      </div>

      {/* Badge */}
      <div
        className="tech-tag"
        style={{ fontSize: "0.65rem", opacity: 0.8 }}
      >
        BTech Final Year Project
      </div>
    </header>
  );
}
