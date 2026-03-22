// ============================================================
// components/SearchInput.jsx
// Topic input + generate button
// ============================================================

import React from "react";

export default function SearchInput({ topic, setTopic, onGenerate, loading }) {
  // Allow pressing Enter to trigger generation
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading) onGenerate();
  };

  return (
    <div className="w-full max-w-2xl mx-auto animate-slide-up">
      {/* Heading */}
      <div className="text-center mb-8">
        <h2
          className="font-bold mb-3"
          style={{
            fontSize: "clamp(2rem, 5vw, 3.2rem)",
            lineHeight: 1.15,
            background: "linear-gradient(135deg, #f0f4ff, rgba(0,245,255,0.85))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Your Learning Roadmap,
          <br />
          <span className="gradient-text">Powered by AI</span>
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "1rem" }}>
          Enter any technology or skill — get a structured Beginner → Advanced roadmap instantly.
        </p>
      </div>

      {/* Input Row */}
      <div className="flex gap-3 w-full">
        <input
          className="neon-input flex-1"
          type="text"
          placeholder='Try "Python", "Machine Learning", "React"…'
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          maxLength={80}
        />
        <button
          className="neon-btn"
          onClick={onGenerate}
          disabled={loading || !topic.trim()}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="inline-block w-4 h-4 border-2 border-cyan-300 border-t-transparent rounded-full animate-spin" />
              Generating…
            </span>
          ) : (
            "Generate →"
          )}
        </button>
      </div>

      {/* Example chips */}
      <div className="flex flex-wrap gap-2 mt-4 justify-center">
        {["Java", "AI / ML", "Web Dev", "Cloud", "Cybersecurity", "Flutter"].map((ex) => (
          <button
            key={ex}
            onClick={() => { setTopic(ex); }}
            disabled={loading}
            className="tech-tag cursor-pointer transition-all"
            style={{ opacity: loading ? 0.4 : 0.7 }}
            onMouseEnter={(e) => (e.target.style.opacity = 1)}
            onMouseLeave={(e) => (e.target.style.opacity = 0.7)}
          >
            {ex}
          </button>
        ))}
      </div>
    </div>
  );
}
