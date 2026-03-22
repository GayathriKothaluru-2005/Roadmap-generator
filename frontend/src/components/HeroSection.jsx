// ============================================================
// components/HeroSection.jsx
// ✅ Recent Searches REMOVED from here (moved to Navbar)
// ✅ Still saves searches via shared useRecentSearches hook
// ✅ Accepts prefillTopic prop from Navbar recent click
// ============================================================

import React, { useEffect } from "react";
import { useRecentSearches } from "../hooks/useRecentSearches";

export default function HeroSection({ topic, setTopic, onGenerate, loading, prefillTopic }) {
  const { add } = useRecentSearches();

  // When navbar recent click triggers prefill → set topic
  useEffect(() => {
    if (prefillTopic) setTopic(prefillTopic);
  }, [prefillTopic, setTopic]);

  const handleGenerate = () => {
    if (!topic.trim()) return;
    add(topic.trim()); // save to recent searches
    onGenerate();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading) handleGenerate();
  };

  const suggestions = ["Python", "AI / ML", "React", "Cloud", "Cybersecurity", "Flutter", "Java", "DevOps"];

  return (
    <section
      className="w-full flex flex-col items-center text-center animate-fade-in"
      style={{
        paddingTop: "calc(var(--nav-height) + 72px)",
        paddingBottom: "48px",
        paddingLeft: "16px",
        paddingRight: "16px",
      }}
    >
      {/* ── Live badge ─────────────────────────────── */}
      <div className="hero-badge animate-slide-up">
        <span className="hero-badge-dot" />
        Powered by Groq · LLaMA 3.3
      </div>

      {/* ── Headline ───────────────────────────────── */}
      <h1
        className="font-bold animate-slide-up delay-100"
        style={{
          fontSize: "clamp(2.2rem, 6vw, 4rem)",
          lineHeight: 1.1,
          letterSpacing: "-0.03em",
          marginBottom: "20px",
          maxWidth: "760px",
          opacity: 0,
        }}
      >
        Build Your Tech Career{" "}
        <span style={{
          background: "linear-gradient(135deg, var(--neon-cyan), var(--neon-purple))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>
          with AI
        </span>
      </h1>

      {/* ── Subtitle ───────────────────────────────── */}
      <p
        className="animate-slide-up delay-200"
        style={{
          fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
          color: "var(--text-muted)",
          maxWidth: "520px",
          lineHeight: 1.65,
          marginBottom: "40px",
          opacity: 0,
        }}
      >
        Generate structured learning paths from beginner to advanced in seconds.
      </p>

      {/* ── Input box ──────────────────────────────── */}
      <div
        className="w-full animate-slide-up delay-300"
        style={{ maxWidth: "620px", opacity: 0 }}
      >
        <div style={{
          display: "flex",
          gap: "10px",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "16px",
          padding: "6px 6px 6px 0",
          boxShadow: "0 8px 40px rgba(0,0,0,0.3)",
        }}>
          <input
            className="neon-input"
            style={{ border: "none", background: "transparent", borderRadius: "12px", padding: "14px 20px", fontSize: "1.05rem" }}
            type="text"
            placeholder='Try "Python", "AI", "React", "Cloud"…'
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            maxLength={80}
          />
          <button
            className="neon-btn"
            style={{ borderRadius: "12px", padding: "14px 28px", flexShrink: 0 }}
            onClick={handleGenerate}
            disabled={loading || !topic.trim()}
          >
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{
                  display: "inline-block", width: 16, height: 16,
                  border: "2px solid rgba(0,245,255,0.3)",
                  borderTopColor: "var(--neon-cyan)",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                }} />
                Generating…
              </span>
            ) : "Generate →"}
          </button>
        </div>

        {/* Suggestion chips */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "14px", justifyContent: "center" }}>
          {suggestions.map((s) => (
            <button
              key={s}
              className="tech-tag"
              style={{ cursor: "pointer", opacity: loading ? 0.4 : 1 }}
              disabled={loading}
              onClick={() => setTopic(s)}
            >
              {s}
            </button>
          ))}
        </div>
        {/* ✅ Recent Searches removed from here — now in Navbar dropdown */}
      </div>

      {/* ── Stats bar ──────────────────────────────── */}
      <div
        className="stats-bar animate-slide-up delay-400"
        style={{ maxWidth: "580px", width: "100%", opacity: 0 }}
      >
        {[
          
          { value: "3",    label: "LEARNING STAGES"    },
          { value: "< 3s", label: "GENERATION TIME"    },
          { value: "SECURE", label: "PRIVACY FOCUSED" },
          { value: "OPEN SOURCE", label: "BUILT FOR EVERYONE"   },
        ].map((s, i) => (
          <React.Fragment key={s.label}>
            {i > 0 && <div className="stat-divider" />}
            <div className="stat-item">
              <span className="stat-value">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}
