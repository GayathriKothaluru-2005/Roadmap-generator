// ============================================================
// pages/Home.jsx
// Main page: hero input → loading → roadmap display
// Receives prefillTopic from Navbar recent searches
// ============================================================

import React from "react";
import HeroSection    from "../components/HeroSection";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage   from "../components/ErrorMessage";
import RoadmapDisplay from "../components/RoadmapDisplay";
import { useRoadmap } from "../hooks/useRoadmap";

export default function Home({ prefillTopic, onPrefillUsed }) {
  const {
    topic, setTopic,
    roadmap, loading, error,
    generateRoadmap, clearRoadmap,
  } = useRoadmap();

  return (
    <main style={{ width: "100%", maxWidth: "1100px", margin: "0 auto", padding: "0 16px 80px" }}>

      {/* ── No roadmap yet: show hero ─────────────── */}
      {!roadmap && (
        <>
          <HeroSection
            topic={topic}
            setTopic={setTopic}
            onGenerate={generateRoadmap}
            loading={loading}
            prefillTopic={prefillTopic}  /* from Navbar recent click */
          />

          <div style={{ display: "flex", justifyContent: "center" }}>
            <ErrorMessage message={error} />
          </div>

          {loading && (
            <div style={{ marginTop: "32px" }}>
              <LoadingSpinner topic={topic} />
            </div>
          )}
        </>
      )}

      {/* ── Roadmap ready ─────────────────────────── */}
      {roadmap && !loading && (
        <div style={{ paddingTop: "calc(var(--nav-height) + 32px)" }}>
          <RoadmapDisplay data={roadmap} onReset={clearRoadmap} />
        </div>
      )}
    </main>
  );
}
