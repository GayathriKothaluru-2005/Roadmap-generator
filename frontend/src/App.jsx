// ============================================================
// App.jsx — RoadmapAI v3
// ✅ React Router DOM for real navigation (no page reload)
// ✅ Navbar with Recent Searches dropdown
// ✅ Home / Explore / About routes
// ✅ prefillTopic flows from Navbar → Home page
// ============================================================

import React, { useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Navbar  from "./components/Navbar";
import Home    from "./pages/Home";
import Explore from "./pages/Explore";
import About   from "./pages/About";

// ── Inner app (needs to be inside BrowserRouter for hooks) ─
function AppInner() {
  const navigate = useNavigate();

  // When user clicks a recent search in the Navbar dropdown,
  // we store it here and pass it into <Home> as a prop.
  const [prefillTopic, setPrefillTopic] = useState(null);

  const handleSelectRecent = (topic) => {
    setPrefillTopic(topic);
    navigate("/");               // go to home page
    // Clear prefill after a tick so it doesn't re-trigger
    setTimeout(() => setPrefillTopic(null), 200);
  };

  // When Explore page clicks a topic, same flow
  const handleTopicSelect = (topic) => {
    setPrefillTopic(topic);
    navigate("/");
    setTimeout(() => setPrefillTopic(null), 200);
  };

  return (
    <div
      className="min-h-screen bg-grid"
      style={{ background: "var(--bg-primary)" }}
    >
      {/* Ambient glow orbs */}
      <div style={{
        position: "fixed", top: "-250px", left: "-250px",
        width: "700px", height: "700px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,245,255,0.05) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0,
      }} />
      <div style={{
        position: "fixed", bottom: "-250px", right: "-250px",
        width: "700px", height: "700px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(191,90,242,0.05) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0,
      }} />

      {/* ── Navbar (always visible) ──────────────── */}
      <Navbar onSelectRecent={handleSelectRecent} />

      {/* ── Page routes ──────────────────────────── */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <Routes>
          <Route
            path="/"
            element={
              <Home
                prefillTopic={prefillTopic}
                onPrefillUsed={() => setPrefillTopic(null)}
              />
            }
          />
          <Route
            path="/explore"
            element={<Explore onTopicSelect={handleTopicSelect} />}
          />
          <Route path="/about" element={<About />} />
          {/* 404 fallback → redirect to home */}
          <Route path="*" element={<Home prefillTopic={null} />} />
        </Routes>

        {/* ── Footer ───────────────────────────── */}
        <footer className="site-footer">
          <p>
            © 2026 RoadmapAI
            <span className="footer-dot" />
            All rights reserved
          </p>
        </footer>
      </div>
    </div>
  );
}

// ── Root export wraps everything in BrowserRouter ─────────
export default function App() {
  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}
