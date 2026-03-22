// ============================================================
// pages/About.jsx
// About RoadmapAI — project info, tech stack, how it works
// ============================================================

import React from "react";
import { useNavigate } from "react-router-dom";

const TECH_STACK = [
  { icon: "⚛️",  name: "Personalized Learning Paths",        desc: "Get roadmaps tailored to your goals"              },
  { icon: "🎨",  name: "Instant Results",     desc: "Generate complete plans in seconds"            },
  { icon: "⚡",  name: "Beginner to Advanced",       desc: "Suitable for all skill levels"                 },
  { icon: "🤖",  name: "Easy Download & Sharing",         desc: "Save & Share your roadmap anytime" },

];

const HOW_IT_WORKS = [
  { step: "01", title: "Enter a Topic",         desc: "Type any technology, language, or skill you want to learn." },
  { step: "02", title: "AI Generates Roadmap",  desc: "Groq's LLaMA 3.3 model builds a structured 3-stage learning path." },
  { step: "03", title: "Explore & Learn",       desc: "Click any card to ask the AI Tutor for a detailed explanation." },
  { step: "04", title: "Download or Share",     desc: "Save your roadmap as a clean PDF or share it with others." },
];

export default function About() {
  const navigate = useNavigate();

  return (
    <main
      style={{
        width: "100%",
        maxWidth: "860px",
        margin: "0 auto",
        padding: "calc(var(--nav-height) + 48px) 16px 80px",
      }}
    >
      {/* ── Hero ────────────────────────────────── */}
      <div style={{ marginBottom: "56px", textAlign: "center" }} className="animate-fade-in">
        <div style={{ fontSize: "3.5rem", marginBottom: "16px" }}>🚀</div>
        <h1 style={{
          fontSize: "clamp(2rem, 5vw, 3rem)",
          fontWeight: 800,
          letterSpacing: "-0.03em",
          marginBottom: "16px",
          background: "linear-gradient(135deg, #eef2ff, rgba(0,245,255,0.88))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>
          About RoadmapAI
        </h1>
        <p style={{ fontSize: "1.05rem", color: "var(--text-muted)", maxWidth: "540px", margin: "0 auto", lineHeight: 1.7 }}>
          RoadmapAI helps developers and students build structured learning paths using the power of Groq's lightning-fast AI.
          No more guessing where to start — just type a topic and get a complete roadmap in seconds.
        </p>
      </div>

      {/* ── How it works ────────────────────────── */}
      <Section title="How It Works" accent="#00f5ff">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
          {HOW_IT_WORKS.map((item, i) => (
            <div
              key={i}
              className="glass-card"
              style={{
                padding: "20px",
                animationDelay: `${i * 80}ms`,
                animation: "slideUp 0.5s ease forwards",
                animationFillMode: "both",
                opacity: 0,
              }}
            >
              <span style={{
                display: "inline-block",
                fontSize: "0.65rem",
                fontFamily: "JetBrains Mono, monospace",
                fontWeight: 700,
                color: "var(--neon-cyan)",
                background: "rgba(0,245,255,0.08)",
                border: "1px solid rgba(0,245,255,0.2)",
                borderRadius: "6px",
                padding: "2px 8px",
                marginBottom: "10px",
              }}>
                {item.step}
              </span>
              <h3 style={{ fontWeight: 700, fontSize: "0.95rem", color: "#eef2ff", marginBottom: "6px" }}>
                {item.title}
              </h3>
              <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Tech stack ──────────────────────────── */}
      <Section title="Why Choose us" accent="#bf5af2">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "12px" }}>
          {TECH_STACK.map((t, i) => (
            <div
              key={i}
              className="glass-card"
              style={{
                padding: "14px 18px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <span style={{ fontSize: "1.4rem", flexShrink: 0 }}>{t.icon}</span>
              <div>
                <p style={{ fontWeight: 600, fontSize: "0.88rem", color: "#eef2ff" }}>{t.name}</p>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── CTA ─────────────────────────────────── */}
      <div style={{ textAlign: "center", marginTop: "56px", padding: "36px 24px", background: "rgba(0,245,255,0.03)", border: "1px solid rgba(0,245,255,0.1)", borderRadius: "20px" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#eef2ff", marginBottom: "10px" }}>
          Ready to start learning?
        </h2>
        <p style={{ color: "var(--text-muted)", marginBottom: "24px", fontSize: "0.9rem" }}>
          Generate your first AI-powered roadmap in under 3 seconds.
        </p>
        <button
          className="neon-btn"
          onClick={() => navigate("/")}
          style={{ padding: "14px 36px", fontSize: "1rem" }}
        >
          Generate a Roadmap →
        </button>
      </div>
    </main>
  );
}

// ── Reusable section wrapper ──────────────────────────────
function Section({ title, accent, children }) {
  return (
    <div style={{ marginBottom: "52px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
        <h2 style={{ fontSize: "1.15rem", fontWeight: 700, color: accent }}>{title}</h2>
        <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, ${accent}30, transparent)` }} />
      </div>
      {children}
    </div>
  );
}
