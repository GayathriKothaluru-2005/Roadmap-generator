// ============================================================
// hooks/useRoadmap.js
// ============================================================

import { useState, useEffect } from "react";

const STORAGE_KEY = "roadmapai_last";

export function useRoadmap() {
  const [topic, setTopic]     = useState("");
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  // Restore last roadmap on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setRoadmap(parsed);
        setTopic(parsed.topic || "");
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const generateRoadmap = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic to generate a roadmap.");
      return;
    }

    setLoading(true);
    setError(null);
    setRoadmap(null);

    try {
      const API_BASE = "https://roadmap-backend-3yqm.onrender.com";
      const response = await fetch(`${API_BASE}/generate-roadmap`, {
 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topic.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      setRoadmap(data);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      setError(err.message || "Network error. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const clearRoadmap = () => {
    setRoadmap(null);
    setTopic("");
    setError(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return { topic, setTopic, roadmap, loading, error, generateRoadmap, clearRoadmap };
}
