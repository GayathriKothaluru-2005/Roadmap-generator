// ============================================================
// components/ErrorMessage.jsx
// Displays API or validation errors
// ============================================================

import React from "react";

export default function ErrorMessage({ message }) {
  if (!message) return null;

  return (
    <div
      className="animate-slide-up max-w-2xl mx-auto mt-6"
      style={{
        background: "rgba(255, 69, 58, 0.08)",
        border: "1px solid rgba(255, 69, 58, 0.3)",
        borderRadius: "12px",
        padding: "14px 20px",
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}
    >
      <span style={{ fontSize: "1.2rem" }}>⚠️</span>
      <p style={{ color: "#ff6b6b", fontSize: "0.95rem" }}>{message}</p>
    </div>
  );
}
