// ============================================================
// pages/Explore.jsx
// Discover popular roadmap topics, click to go generate
// ============================================================

import React from "react";
import { useNavigate } from "react-router-dom";

// Curated topic categories
const CATEGORIES = [
  {
    name: "Programming Languages",
    icon: "💻",
    color: "#00f5ff",
    topics: ["Python", "Java", "C++", "TypeScript", "Rust", "Go", "c",],
  },
  {
    name: "Web Development",
    icon: "🌐",
    color: "#30d158",
    topics: ["React","JavaScript", "HTML","Vue.js", "Angular", "Node.js", "Express.js","Next.js", "GraphQL", "REST APIs", "CSS / Tailwind"],
  },
  {
    name: "AI & Data Science",
    icon: "🤖",
    color: "#bf5af2",
    topics: ["Machine Learning", "Deep Learning", "NLP", "Computer Vision", "Data Analysis", "TensorFlow", "PyTorch", "LLMs"],
  },
  {
    name: "Databases",
    icon: " 🗂️",
    color: "#9a0e4f",
    topics: ["SQL", "Mongo DB", "Postgre SQL", "MySQL"]
  },
  {
    name: "Cloud & DevOps",
    icon: "☁️",
    color: "#ff9f0a",
    topics: ["AWS", "Docker", "Kubernetes", "CI/CD", "Terraform", "Azure",],
  },
  {
    name: "Mobile Development",
    icon: "📱",
    color: "#ff6b6b",
    topics: ["Flutter", "React Native", "Android", "iOS / Swift", "Kotlin", "Dart", "Firebase", "Expo"],
  },
  {
    name: "Cybersecurity",
    icon: "🔐",
    color: "#ffd60a",
    topics: ["Ethical Hacking", "Network Security", "Cryptography", "Penetration Testing", "OWASP", "SOC Analyst", "Forensics", "Zero Trust"],
  },
];

export default function Explore({ onTopicSelect }) {
  const navigate = useNavigate();

  const handleTopic = (topic) => {
    // Pass topic to home page and navigate
    onTopicSelect && onTopicSelect(topic);
    navigate("/");
  };

  return (
    <main
      style={{
        width: "100%",
        maxWidth: "1100px",
        margin: "0 auto",
        padding: "calc(var(--nav-height) + 48px) 16px 80px",
      }}
    >
      {/* ── Page header ─────────────────────────── */}
      <div style={{ marginBottom: "48px" }} className="animate-fade-in">
        <div className="hero-badge" style={{ marginBottom: "16px" }}>
          <span className="hero-badge-dot" />
          Browse Topics
        </div>
        <h1 style={{
          fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
          fontWeight: 800,
          letterSpacing: "-0.03em",
          marginBottom: "12px",
          background: "linear-gradient(135deg, #eef2ff, rgba(0,245,255,0.85))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>
          Explore Roadmaps
        </h1>
        <p style={{ fontSize: "1rem", color: "var(--text-muted)", maxWidth: "500px", lineHeight: 1.65 }}>
          Choose any technology below to instantly generate a personalised Beginner → Advanced learning path.
        </p>
      </div>

      {/* ── Category grid ───────────────────────── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "36px" }}>
        {CATEGORIES.map((cat, ci) => (
          <div key={ci} className="animate-slide-up" style={{ animationDelay: `${ci * 80}ms`, animationFillMode: "both", opacity: 0 }}>
            {/* Category header */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
              <span style={{ fontSize: "1.3rem" }}>{cat.icon}</span>
              <h2 style={{ fontSize: "1.05rem", fontWeight: 700, color: cat.color }}>{cat.name}</h2>
              <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, ${cat.color}30, transparent)`, marginLeft: "8px" }} />
            </div>

            {/* Topic chips */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {cat.topics.map((topic, ti) => (
                <TopicChip key={ti} topic={topic} color={cat.color} onClick={() => handleTopic(topic)} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

// ── Individual topic chip ─────────────────────────────────
function TopicChip({ topic, color, onClick }) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? `${color}15` : "rgba(255,255,255,0.04)",
        border: `1px solid ${hovered ? color + "50" : "rgba(255,255,255,0.08)"}`,
        borderRadius: "10px",
        color: hovered ? color : "var(--text-muted)",
        cursor: "pointer",
        fontSize: "0.85rem",
        fontWeight: 500,
        padding: "8px 18px",
        transition: "all 0.2s ease",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hovered ? `0 4px 16px ${color}20` : "none",
        display: "flex",
        alignItems: "center",
        gap: "6px",
      }}
    >
      {hovered && <span style={{ fontSize: "0.75rem" }}>→</span>}
      {topic}
    </button>
  );
}
