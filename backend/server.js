// ============================================================
// backend/server.js — RoadmapAI + AI Tutor
// ============================================================

const express    = require("express");
const cors       = require("cors");
const dotenv     = require("dotenv");
const Groq       = require("groq-sdk");

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ── Groq client ───────────────────────────────────────────
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ── System prompt for roadmap generation ─────────────────
const ROADMAP_PROMPT = `You are an expert career mentor and curriculum designer.
When given a technology keyword, generate a structured learning roadmap with three stages.
Return ONLY valid JSON — no markdown, no extra text:
{
  "beginner":     [{ "topic": "...", "explanation": "...", "tools": ["..."] }],
  "intermediate": [{ "topic": "...", "explanation": "...", "tools": ["..."] }],
  "advanced":     [{ "topic": "...", "explanation": "...", "tools": ["..."] }]
}
Each stage: 4-6 modules. Each module has topic, 1-2 sentence explanation, and tools array.`;

// ── POST /generate-roadmap ────────────────────────────────
app.post("/generate-roadmap", async (req, res) => {
  try {
    const { topic } = req.body;
    if (!topic?.trim()) return res.status(400).json({ error: "Please provide a topic." });

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: ROADMAP_PROMPT },
        { role: "user",   content: `Generate a complete learning roadmap for: "${topic.trim()}"` },
      ],
      temperature: 0.7,
      max_tokens:  2048,
    });

    const raw = completion.choices[0]?.message?.content || "";
    let roadmap;

    try {
      // Strip fences if present
      const cleaned = raw.replace(/^```(?:json)?\s*/im, "").replace(/\s*```\s*$/m, "").trim();
      roadmap = JSON.parse(cleaned);
    } catch {
      return res.status(500).json({ error: "AI returned invalid format. Please try again." });
    }

    if (!roadmap.beginner || !roadmap.intermediate || !roadmap.advanced) {
      return res.status(500).json({ error: "Incomplete roadmap structure. Please try again." });
    }

    return res.status(200).json({ topic: topic.trim(), roadmap });
  } catch (err) {
    console.error("[ROADMAP ERROR]", err.message);
    return res.status(500).json({ error: "Server error. Please try again later." });
  }
});

// ── POST /api/explain  (AI Tutor) ────────────────────────
const explainRoute = require("./explainRoute");
app.use("/api/explain", explainRoute);

// ── Health check ──────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ status: "OK", routes: ["/generate-roadmap", "/api/explain"] });
});

// ── Start ─────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Server → http://localhost:${PORT}`);
  console.log(`   POST /generate-roadmap   — Roadmap generator`);
  console.log(`   POST /api/explain        — AI Tutor\n`);
});
