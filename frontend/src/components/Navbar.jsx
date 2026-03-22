// ============================================================
// components/Navbar.jsx
// ✅ React Router <Link> navigation (no page reload)
// ✅ Recent Searches dropdown in navbar
// ✅ Mobile hamburger menu
// ✅ Scroll-aware background blur
// ============================================================

import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation }                  from "react-router-dom";
import { useRecentSearches }                  from "../hooks/useRecentSearches";

export default function Navbar({ onSelectRecent }) {
  const location                      = useLocation();
  const [scrolled,    setScrolled]    = useState(false);
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [recentOpen,  setRecentOpen]  = useState(false);
  const [recents,     setRecents]     = useState([]);
  const recentRef                     = useRef(null);
  const { read, clear }               = useRecentSearches();

  // Detect scroll for navbar blur effect
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Load recent searches when dropdown opens
  useEffect(() => {
    if (recentOpen) setRecents(read());
  }, [recentOpen, read]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const fn = (e) => {
      if (recentRef.current && !recentRef.current.contains(e.target)) {
        setRecentOpen(false);
      }
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleSelectRecent = (topic) => {
    setRecentOpen(false);
    setMenuOpen(false);
    onSelectRecent && onSelectRecent(topic); // fills input on Home page
  };

  const handleClearRecent = (e) => {
    e.stopPropagation();
    clear();
    setRecents([]);
  };

  const navLinks = [
    { to: "/",        label: "Home"    },
    { to: "/explore", label: "Explore" },
    { to: "/about",   label: "About"   },
  ];

  const isActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname === path;

  return (
    <>
      {/* ══════════════════════════════════════════════
          Main Navbar
      ══════════════════════════════════════════════ */}
      <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>

        {/* Logo — Link to home */}
        <Link to="/" className="nav-logo" style={{ textDecoration: "none" }}>
          <div className="nav-logo-icon">🚀</div>
          <span className="nav-logo-text">RoadmapAI</span>
        </Link>

        {/* ── Desktop nav links ──────────────────── */}
        <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: "4px", marginLeft: "auto" }}>
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`nav-link ${isActive(to) ? "active" : ""}`}
              style={{ textDecoration: "none" }}
            >
              {label}
            </Link>
          ))}

          {/* Recent Searches button + dropdown */}
          <div ref={recentRef} style={{ position: "relative", marginLeft: "8px" }}>
            <button
              className="nav-link"
              onClick={() => setRecentOpen(v => !v)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: recentOpen ? "rgba(191,90,242,0.1)" : "transparent",
                color: recentOpen ? "var(--neon-purple)" : undefined,
                border: "none",
                cursor: "pointer",
              }}
            >
              {/* Clock icon */}
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              Recent
              {/* Chevron */}
              <svg
                width="10" height="10" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                style={{ transition: "transform 0.2s", transform: recentOpen ? "rotate(180deg)" : "rotate(0deg)" }}
              >
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>

            {/* Dropdown panel */}
            {recentOpen && (
              <RecentDropdown
                recents={recents}
                onSelect={handleSelectRecent}
                onClear={handleClearRecent}
              />
            )}
          </div>
        </div>

        {/* ── Mobile hamburger ───────────────────── */}
        <button
          className={`nav-hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* ══════════════════════════════════════════════
          Mobile Drawer
      ══════════════════════════════════════════════ */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        {navLinks.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className="mobile-nav-link"
            style={{
              textDecoration: "none",
              display: "block",
              color: isActive(to) ? "var(--neon-cyan)" : undefined,
              background: isActive(to) ? "rgba(0,245,255,0.06)" : undefined,
            }}
          >
            {label}
          </Link>
        ))}

        {/* Mobile: Recent Searches section */}
        <MobileRecentSection
          onSelect={handleSelectRecent}
          read={read}
          clear={clear}
        />
      </div>
    </>
  );
}

// ── Desktop Recent Searches Dropdown ─────────────────────
function RecentDropdown({ recents, onSelect, onClear }) {
  return (
    <div
      style={{
        position: "absolute",
        top: "calc(100% + 10px)",
        right: 0,
        width: "240px",
        background: "rgba(6, 9, 20, 0.98)",
        border: "1px solid rgba(191,90,242,0.2)",
        borderRadius: "14px",
        padding: "8px 0",
        zIndex: 300,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(191,90,242,0.05)",
        animation: "fadeIn 0.15s ease",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "6px 14px 10px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          marginBottom: "4px",
        }}
      >
        <span style={{ fontSize: "0.62rem", color: "rgba(191,90,242,0.6)", fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Recent Searches
        </span>
        {recents.length > 0 && (
          <button
            onClick={onClear}
            style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.3)", background: "none", border: "none", cursor: "pointer", padding: "0", transition: "color 0.2s" }}
            onMouseEnter={e => e.target.style.color = "#ff6b6b"}
            onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.3)"}
          >
            Clear all
          </button>
        )}
      </div>

      {/* List */}
      {recents.length === 0 ? (
        <div style={{ padding: "12px 14px", fontSize: "0.8rem", color: "rgba(255,255,255,0.25)", textAlign: "center" }}>
          No recent searches
        </div>
      ) : (
        recents.map((topic, i) => (
          <button
            key={i}
            onClick={() => onSelect(topic)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "9px 14px",
              background: "none",
              border: "none",
              color: "rgba(220,228,245,0.75)",
              fontSize: "0.83rem",
              cursor: "pointer",
              textAlign: "left",
              transition: "background 0.15s, color 0.15s",
              borderRadius: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(191,90,242,0.08)"; e.currentTarget.style.color = "#eef2ff"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "rgba(220,228,245,0.75)"; }}
          >
            {/* History icon */}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(191,90,242,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {topic}
            </span>
          </button>
        ))
      )}
    </div>
  );
}

// ── Mobile Recent Searches Section ───────────────────────
function MobileRecentSection({ onSelect, read, clear }) {
  const [recents, setRecents] = useState(() => read());

  const handleClear = () => {
    clear();
    setRecents([]);
  };

  return (
    <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: "8px", paddingTop: "12px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px 8px" }}>
        <span style={{ fontSize: "0.62rem", color: "rgba(191,90,242,0.6)", fontFamily: "JetBrains Mono, monospace", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Recent Searches
        </span>
        {recents.length > 0 && (
          <button onClick={handleClear} style={{ fontSize: "0.62rem", color: "rgba(255,255,255,0.3)", background: "none", border: "none", cursor: "pointer" }}>
            Clear
          </button>
        )}
      </div>
      {recents.length === 0 ? (
        <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.22)", padding: "8px 16px" }}>
          No recent searches
        </p>
      ) : (
        recents.map((t, i) => (
          <button
            key={i}
            onClick={() => onSelect(t)}
            className="mobile-nav-link"
            style={{ color: "rgba(191,90,242,0.75)", fontSize: "0.83rem", textDecoration: "none", display: "block", width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer" }}
          >
            🕐 {t}
          </button>
        ))
      )}
    </div>
  );
}
