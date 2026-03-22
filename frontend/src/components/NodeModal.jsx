// ============================================================
// components/NodeModal.jsx  — AI Tutor v2
// Desktop: slides in from right  |  Mobile: slides up from bottom
// Framer Motion animations + auto-scroll + Escape to close
// ============================================================

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence }             from "framer-motion";
import ChatBubble, { ThinkingBubble }          from "./ChatBubble";
import { useExplain }                          from "../hooks/useExplain";

// ── Framer Motion variants ─────────────────────────────────

const backdrop = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.22 } },
  exit:    { opacity: 0, transition: { duration: 0.2  } },
};

const desktopPanel = {
  hidden:  { x: "100%", opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { type: "spring", damping: 26, stiffness: 260 } },
  exit:    { x: "100%", opacity: 0, transition: { duration: 0.22, ease: "easeIn" } },
};

const mobileSheet = {
  hidden:  { y: "100%", opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", damping: 28, stiffness: 280 } },
  exit:    { y: "100%", opacity: 0, transition: { duration: 0.22, ease: "easeIn" } },
};

// ── Hook: detect mobile viewport ──────────────────────────
function useIsMobile() {
  const [mobile, setMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 768);
    window.addEventListener("resize", fn, { passive: true });
    return () => window.removeEventListener("resize", fn);
  }, []);
  return mobile;
}

// ── NodeModal ─────────────────────────────────────────────
export default function NodeModal({ topic, onClose }) {
  const { messages, loading, error, explain } = useExplain();
  const bottomRef = useRef(null);
  const isMobile  = useIsMobile();
  const isOpen    = Boolean(topic);

  // Trigger AI fetch every time topic changes
  useEffect(() => {
    if (topic) explain(topic);
  }, [topic, explain]);

  // Auto-scroll to newest message / thinking bubble
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Close on Escape
  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  // Prevent body scroll while panel is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Dim backdrop ─────────────────────────── */}
          <motion.div
            key="backdrop"
            variants={backdrop}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            style={{
              position: "fixed", inset: 0,
              background: "rgba(0,0,0,0.62)",
              backdropFilter: "blur(5px)",
              WebkitBackdropFilter: "blur(5px)",
              zIndex: 200,
            }}
          />

          {/* ── Panel (desktop: right side | mobile: bottom sheet) ── */}
          <motion.div
            key="panel"
            variants={isMobile ? mobileSheet : desktopPanel}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={isMobile ? {
              // Mobile: bottom sheet
              position: "fixed",
              left: 0, right: 0, bottom: 0,
              height: "88vh",
              zIndex: 201,
              display: "flex",
              flexDirection: "column",
              background: "rgba(6, 9, 20, 0.97)",
              borderTop: "1px solid rgba(0,245,255,0.14)",
              borderRadius: "22px 22px 0 0",
              backdropFilter: "blur(28px)",
              WebkitBackdropFilter: "blur(28px)",
              boxShadow: "0 -12px 60px rgba(0,0,0,0.6), 0 -1px 0 rgba(0,245,255,0.08)",
            } : {
              // Desktop: right panel
              position: "fixed",
              top: 0, right: 0, bottom: 0,
              width: "clamp(380px, 38vw, 520px)",
              zIndex: 201,
              display: "flex",
              flexDirection: "column",
              background: "rgba(6, 9, 20, 0.97)",
              borderLeft: "1px solid rgba(0,245,255,0.1)",
              backdropFilter: "blur(28px)",
              WebkitBackdropFilter: "blur(28px)",
              boxShadow: "-12px 0 60px rgba(0,0,0,0.5)",
            }}
          >
            {/* Mobile drag handle */}
            {isMobile && (
              <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
                <div style={{ width: 38, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.14)" }} />
              </div>
            )}

            {/* ── Panel content ──────────────────────── */}
            <PanelContent
              topic={topic}
              messages={messages}
              loading={loading}
              error={error}
              onClose={onClose}
              bottomRef={bottomRef}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ── Panel content (header + chat + footer) ─────────────────
function PanelContent({ topic, messages, loading, error, onClose, bottomRef }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 0 }}>

      {/* ── Header ───────────────────────────────────── */}
      <div
        style={{
          padding: "18px 20px 14px",
          borderBottom: "1px solid rgba(255,255,255,0.055)",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", justifyContent: "space-between" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Eyebrow label */}
            <p style={{
              fontSize: "0.58rem",
              color: "rgba(0,245,255,0.5)",
              fontFamily: "JetBrains Mono, monospace",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginBottom: "5px",
            }}>
              AI Tutor ✦ Topic Explainer
            </p>

            {/* Topic title */}
            <h2 style={{
              fontSize: "1.1rem",
              fontWeight: 700,
              lineHeight: 1.25,
              background: "linear-gradient(135deg, #eef2ff, rgba(0,245,255,0.88))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}>
              {topic}
            </h2>

            {/* Status indicator */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "5px" }}>
              <span style={{
                width: 6, height: 6,
                borderRadius: "50%",
                background: loading ? "#febc2e" : messages.length > 1 ? "#30d158" : "rgba(255,255,255,0.2)",
                boxShadow: loading ? "0 0 6px #febc2e" : messages.length > 1 ? "0 0 6px #30d158" : "none",
                animation: loading ? "pulse2 1s ease-in-out infinite" : "none",
              }} />
              <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", fontFamily: "JetBrains Mono, monospace" }}>
                {loading ? "generating..." : messages.length > 1 ? "ready" : "waiting"}
              </span>
            </div>
          </div>

          {/* Close button */}
          <CloseButton onClose={onClose} />
        </div>
      </div>

      {/* ── Scrollable chat area ──────────────────────── */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px",
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(0,245,255,0.18) transparent",
          minHeight: 0,
        }}
      >
        {/* Error banner */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: "rgba(255,69,58,0.08)",
              border: "1px solid rgba(255,69,58,0.22)",
              borderRadius: "12px",
              padding: "12px 16px",
              marginBottom: "16px",
              display: "flex",
              gap: "10px",
              alignItems: "flex-start",
            }}
          >
            <span>⚠️</span>
            <div>
              <p style={{ color: "#ff6b6b", fontSize: "0.85rem", fontWeight: 600 }}>Error</p>
              <p style={{ color: "#ff8f8f", fontSize: "0.8rem", marginTop: "2px" }}>{error}</p>
            </div>
          </motion.div>
        )}

        {/* Chat messages */}
        {messages.map((msg, i) => (
          <motion.div
            key={`${topic}-${i}`}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32, delay: i * 0.08 }}
          >
            <ChatBubble message={msg} />
          </motion.div>
        ))}

        {/* Thinking skeleton */}
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28 }}
          >
            <ThinkingBubble />
          </motion.div>
        )}

        {/* Scroll anchor */}
        <div ref={bottomRef} style={{ height: 1 }} />
      </div>

      {/* ── Footer ───────────────────────────────────── */}
      <div style={{
        padding: "10px 20px",
        borderTop: "1px solid rgba(255,255,255,0.045)",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
      }}>
        <span style={{ fontSize: "0.55rem", color: "rgba(255,255,255,0.18)", fontFamily: "JetBrains Mono, monospace" }}>
          Powered by Groq · llama-3.3-70b-versatile · Press Esc to close
        </span>
      </div>
    </div>
  );
}

// ── Close button ──────────────────────────────────────────
function CloseButton({ onClose }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClose}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label="Close AI Tutor"
      style={{
        width: 34, height: 34,
        borderRadius: "50%",
        border: `1px solid ${hovered ? "rgba(255,69,58,0.4)" : "rgba(255,255,255,0.1)"}`,
        background: hovered ? "rgba(255,69,58,0.12)" : "rgba(255,255,255,0.04)",
        color: hovered ? "#ff453a" : "rgba(255,255,255,0.45)",
        cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
        fontSize: "0.85rem",
        transition: "all 0.2s ease",
      }}
    >
      ✕
    </button>
  );
}
