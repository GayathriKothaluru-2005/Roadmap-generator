// ================================================================
// utils/downloadPdf.js  —  Clean Programmatic PDF (Final)
// ================================================================
// Pure jsPDF text API only. No html2canvas. No DOM capture.
// No alignment issues. No background. No CSS variable problems.
//
// How it works:
//   1. Takes roadmap JSON directly (no DOM scraping needed)
//   2. Draws everything with jsPDF's coordinate system (mm)
//   3. Measures every text block BEFORE drawing the card box
//   4. Draws box first, then text on top — always perfectly aligned
//   5. Checks if card fits on current page; if not → new page
// ================================================================

import jsPDF from "jspdf";

// ── Page dimensions (A4 in mm) ─────────────────────────────────
const PAGE_W  = 210;
const PAGE_H  = 297;
const MARGIN  = 20;                       // 20 mm safe zone on every side
const COL_W   = PAGE_W - MARGIN * 2;     // 170 mm usable content width
const MAX_Y   = PAGE_H - MARGIN - 12;    // bottom trigger for new page

// ── Stage colour palette ───────────────────────────────────────
const STAGE = {
  beginner: {
    title:    "Beginner",
    subtitle: "Foundation & Core Concepts",
    r: 22,  g: 163, b: 74,          // green-600
    br: 220, bg: 252, bb: 231,      // green-100 (card bg)
    lr: 187, lg: 247, lb: 208,      // green-200 (left stripe)
  },
  intermediate: {
    title:    "Intermediate",
    subtitle: "Building Real Skills",
    r: 2,   g: 132, b: 199,         // sky-600
    br: 224, bg: 242, bb: 254,      // sky-100
    lr: 186, lg: 230, lb: 253,      // sky-200
  },
  advanced: {
    title:    "Advanced",
    subtitle: "Industry-Level Mastery",
    r: 124, g: 58,  b: 237,         // violet-600
    br: 245, bg: 243, bb: 255,      // violet-100
    lr: 221, lg: 214, lb: 254,      // violet-200
  },
};

// ── Line-height constants (mm) ─────────────────────────────────
const LH = {
  topic:       5.8,   // line height for topic name text (10pt bold)
  explanation: 4.8,   // line height for explanation text (8.5pt)
  tools:       4.2,   // line height for tools text (7.5pt)
};

// ── Internal page/cursor state ─────────────────────────────────
let _pdf, _y, _topic;

function newPage() {
  drawFooter();
  _pdf.addPage();
  _y = MARGIN;
}

// Ensure at least `need` mm remains before page break
function ensureSpace(need) {
  if (_y + need > MAX_Y) newPage();
}

// ================================================================
//  MAIN EXPORT FUNCTION
// ================================================================

/**
 * Generate and download a clean white PDF of the roadmap.
 *
 * @param {string} topic    Roadmap topic name  (e.g. "Python")
 * @param {object} roadmap  { beginner:[], intermediate:[], advanced:[] }
 */
export async function downloadRoadmapAsPdf(topic = "roadmap", roadmap = null) {
  if (!roadmap) {
    alert("No roadmap data found. Please generate a roadmap first.");
    return;
  }

  // ── Initialise PDF ────────────────────────────────────────────
  _pdf   = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  _y     = MARGIN;
  _topic = topic;

  // Page 1: white fill + document header
  fillPageWhite();
  drawHeader(topic);

  // ── Draw each stage ───────────────────────────────────────────
  const stageKeys = ["beginner", "intermediate", "advanced"];

  for (const key of stageKeys) {
    const items = roadmap[key];
    if (!items || items.length === 0) continue;

    drawStageHeading(key, items.length);

    for (let i = 0; i < items.length; i++) {
      drawCard(items[i], i, key);
    }

    _y += 8;  // gap between stages
  }

  // Footer on the last page
  drawFooter();

  // ── Download ──────────────────────────────────────────────────
  const filename = topic
    .trim()
    .replace(/[^a-z0-9 ]/gi, "")
    .replace(/\s+/g, "_")
    .toLowerCase() || "roadmap";

  _pdf.save(`${filename}_roadmap.pdf`);
}


// ================================================================
//  INTERNAL DRAWING FUNCTIONS
//  (Each function uses _pdf and _y from module scope)
// ================================================================

// ── White page fill ───────────────────────────────────────────
function fillPageWhite() {
  _pdf.setFillColor(255, 255, 255);
  _pdf.rect(0, 0, PAGE_W, PAGE_H, "F");
}

// ── Document header (first page only) ────────────────────────
function drawHeader(topic) {
  // Top accent bar
  _pdf.setFillColor(14, 165, 233);    // sky-500
  _pdf.rect(0, 0, PAGE_W, 1.8, "F");

  // Brand name
  _pdf.setFont("helvetica", "bold");
  _pdf.setFontSize(10);
  _pdf.setTextColor(14, 165, 233);
  _pdf.text("RoadmapAI", MARGIN, 13);

  // Date (right-aligned)
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
  _pdf.setFont("helvetica", "normal");
  _pdf.setFontSize(7.5);
  _pdf.setTextColor(148, 163, 184);   // slate-400
  _pdf.text(date, PAGE_W - MARGIN, 13, { align: "right" });

  // Horizontal rule
  _pdf.setDrawColor(226, 232, 240);   // slate-200
  _pdf.setLineWidth(0.3);
  _pdf.line(MARGIN, 16, PAGE_W - MARGIN, 16);

  // Topic title
  _pdf.setFont("helvetica", "bold");
  _pdf.setFontSize(22);
  _pdf.setTextColor(15, 23, 42);      // slate-950
  const titleLines = _pdf.splitTextToSize(topic, COL_W);
  _pdf.text(titleLines, MARGIN, 28);

  // Subtitle
  const subY = 28 + titleLines.length * 9.5;
  _pdf.setFont("helvetica", "normal");
  _pdf.setFontSize(9);
  _pdf.setTextColor(100, 116, 139);   // slate-500
  _pdf.text("Complete Learning Roadmap  ·  Beginner → Advanced", MARGIN, subY);

  // Move cursor below header
  _y = subY + 12;
}

// ── Stage section heading ─────────────────────────────────────
function drawStageHeading(key, count) {
  const s = STAGE[key];
  ensureSpace(28);

  // Left colour bar
  _pdf.setFillColor(s.r, s.g, s.b);
  _pdf.rect(MARGIN, _y, 3, 14, "F");

  // Stage name
  _pdf.setFont("helvetica", "bold");
  _pdf.setFontSize(13);
  _pdf.setTextColor(s.r, s.g, s.b);
  _pdf.text(s.title, MARGIN + 7, _y + 6.5);

  // Stage subtitle
  _pdf.setFont("helvetica", "normal");
  _pdf.setFontSize(8);
  _pdf.setTextColor(100, 116, 139);
  _pdf.text(s.subtitle, MARGIN + 7, _y + 12);

  // Topic count badge (right-aligned)
  _pdf.setFontSize(7.5);
  _pdf.setTextColor(148, 163, 184);
  _pdf.text(`${count} topic${count !== 1 ? "s" : ""}`, PAGE_W - MARGIN, _y + 6.5, { align: "right" });

  _y += 18;

  // Thin divider line
  _pdf.setDrawColor(226, 232, 240);
  _pdf.setLineWidth(0.25);
  _pdf.line(MARGIN, _y, PAGE_W - MARGIN, _y);
  _y += 5;
}

// ── Topic card ────────────────────────────────────────────────
// STRATEGY: measure all text blocks first → calculate exact card height
//           → draw box → draw text on top. Never misaligns.
function drawCard(item, idx, stageKey) {
  const s = STAGE[stageKey];

  // ── Step 1: Measure all text blocks ──────────────────────

  // Topic name: bold 10pt, fits in COL_W minus index badge (14mm) and padding
  _pdf.setFont("helvetica", "bold");
  _pdf.setFontSize(10);
  const topicLines = _pdf.splitTextToSize(
    item.topic || "",
    COL_W - 18    // 3mm left stripe + 5mm padding + 10mm badge = 18mm
  );

  // Explanation: normal 8.5pt, full content width minus side padding
  _pdf.setFont("helvetica", "normal");
  _pdf.setFontSize(8.5);
  const expLines = item.explanation
    ? _pdf.splitTextToSize(item.explanation, COL_W - 10)
    : [];

  // Tools: normal 7.5pt, full content width minus "Tools: " label space
  _pdf.setFont("helvetica", "normal");
  _pdf.setFontSize(7.5);
  const toolsStr   = item.tools?.length ? item.tools.join("  ·  ") : "";
  const toolsLines = toolsStr
    ? _pdf.splitTextToSize(toolsStr, COL_W - 10)
    : [];

  // ── Step 2: Calculate exact card height ──────────────────
  const PAD_TOP    = 5;
  const PAD_BOT    = 5;
  const GAP        = 3;    // vertical gap between text sections

  const topicBlockH = topicLines.length * LH.topic;
  const expBlockH   = expLines.length   > 0 ? expLines.length   * LH.explanation + GAP : 0;
  const toolsBlockH = toolsLines.length > 0 ? toolsLines.length * LH.tools       + GAP : 0;

  const cardH = PAD_TOP + topicBlockH + expBlockH + toolsBlockH + PAD_BOT;

  // ── Step 3: If card doesn't fit, start a new page ────────
  ensureSpace(cardH + 5);
  const cardTop = _y;

  // ── Step 4: Draw card background box ─────────────────────
  _pdf.setFillColor(s.br, s.bg, s.bb);       // light stage colour
  _pdf.setDrawColor(s.lr, s.lg, s.lb);        // slightly darker border
  _pdf.setLineWidth(0.3);
  _pdf.roundedRect(MARGIN, cardTop, COL_W, cardH, 2, 2, "FD");

  // Left colour stripe (visual indicator of stage)
  _pdf.setFillColor(s.r, s.g, s.b);
  _pdf.rect(MARGIN, cardTop, 3, cardH, "F");

  // ── Step 5: Draw index number ─────────────────────────────
  // Small pill badge top-left of card
  _pdf.setFillColor(255, 255, 255);
  _pdf.setDrawColor(s.lr, s.lg, s.lb);
  _pdf.setLineWidth(0.2);
  _pdf.roundedRect(MARGIN + 5, cardTop + 4, 9, 5.5, 1, 1, "FD");

  _pdf.setFont("helvetica", "bold");
  _pdf.setFontSize(6);
  _pdf.setTextColor(s.r, s.g, s.b);
  _pdf.text(
    String(idx + 1).padStart(2, "0"),
    MARGIN + 9.5,
    cardTop + 8,
    { align: "center" }
  );

  // ── Step 6: Draw topic name ───────────────────────────────
  // X = MARGIN + 3 (stripe) + 5 (gap) + 9 (badge) + 2 (gap) = MARGIN + 19
  // Y starts at cardTop + PAD_TOP + first line baseline
  _pdf.setFont("helvetica", "bold");
  _pdf.setFontSize(10);
  _pdf.setTextColor(15, 23, 42);   // near-black for maximum readability

  const topicX = MARGIN + 19;
  const topicY = cardTop + PAD_TOP + LH.topic * 0.85;   // 0.85 = ascent offset

  _pdf.text(topicLines, topicX, topicY);

  // ── Step 7: Draw explanation ──────────────────────────────
  if (expLines.length > 0) {
    _pdf.setFont("helvetica", "normal");
    _pdf.setFontSize(8.5);
    _pdf.setTextColor(51, 65, 85);   // slate-700

    const expX = MARGIN + 6;
    const expY = cardTop + PAD_TOP + topicBlockH + GAP + LH.explanation * 0.85;

    _pdf.text(expLines, expX, expY);
  }

  // ── Step 8: Draw tools ────────────────────────────────────
  if (toolsLines.length > 0) {
    const toolsY = cardTop + PAD_TOP + topicBlockH + expBlockH + GAP + LH.tools * 0.85;

    // "Tools:" label in stage colour
    _pdf.setFont("helvetica", "bold");
    _pdf.setFontSize(7.5);
    _pdf.setTextColor(s.r, s.g, s.b);
    const labelW = _pdf.getTextWidth("Tools: ");
    _pdf.text("Tools: ", MARGIN + 6, toolsY);

    // Tools list in dark grey
    _pdf.setFont("helvetica", "normal");
    _pdf.setTextColor(71, 85, 105);   // slate-600
    _pdf.text(toolsLines, MARGIN + 6 + labelW, toolsY);
  }

  // Advance cursor past this card + gap
  _y = cardTop + cardH + 4;
}

// ── Page footer ───────────────────────────────────────────────
function drawFooter() {
  const pageNum = _pdf.internal.getNumberOfPages();

  _pdf.setDrawColor(226, 232, 240);
  _pdf.setLineWidth(0.25);
  _pdf.line(MARGIN, PAGE_H - 12, PAGE_W - MARGIN, PAGE_H - 12);

  _pdf.setFont("helvetica", "normal");
  _pdf.setFontSize(7);
  _pdf.setTextColor(148, 163, 184);

  _pdf.text(`RoadmapAI  ·  ${_topic}`, MARGIN, PAGE_H - 8);
  _pdf.text(`Page ${pageNum}`, PAGE_W - MARGIN, PAGE_H - 8, { align: "right" });
}
