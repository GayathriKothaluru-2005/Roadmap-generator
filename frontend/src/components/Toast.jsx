// ============================================================
// components/Toast.jsx
// Slide-up toast notification for share / copy feedback
// ============================================================

import React, { useEffect, useState } from "react";

export default function Toast({ message, onHide }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!message) return;

    // Trigger entrance animation
    const showTimer = setTimeout(() => setVisible(true), 10);

    // Auto-hide after 2.8s
    const hideTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onHide && onHide(), 350); // wait for exit animation
    }, 2800);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [message]);

  if (!message) return null;

  return (
    <div className={`toast ${visible ? "show" : ""}`}>
      {message}
    </div>
  );
}
