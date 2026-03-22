// ============================================================
// hooks/useExplain.js
// Manages AI Tutor API call, message history, loading & error
// ============================================================

import { useState, useCallback } from "react";

export function useExplain() {
  const [messages, setMessages] = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);

  const explain = useCallback(async (topic) => {
    // Clear previous conversation and immediately show user message
    setError(null);
    setLoading(true);
    setMessages([{ role: "user", text: `Explain: ${topic}` }]);

    try {
      const res  = await fetch("/api/explain", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ topic }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to get explanation.");

      // Append AI response after user message
      setMessages([
        { role: "user", text: `Explain: ${topic}` },
        { role: "ai",   explanation: data.explanation, code: data.code },
      ]);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return { messages, loading, error, explain, clearChat };
}
