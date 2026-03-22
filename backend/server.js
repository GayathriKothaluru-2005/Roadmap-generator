// server.js — RoadmapAI Backend
// Works on Render (production) and localhost (development)

const express = require("express");
const cors    = require("cors");
const dotenv  = require("dotenv");
const Groq    = require("groq-sdk");

// Load .env file in development (Render sets env vars directly)
dotenv.config();

const app  = express();

// Render assigns its own PORT — always use process.env.PORT
const PORT = process.env.PORT || 10000;

// ── CORS ──────────────────────────────────────────────────────
// origin: "*" allows all origins (simplest fix for deployment)
// If you want to restrict later, replace "*" with your Vercel URL
app.use(cors({ origin: "*" }));

// ── Body parser ───────────────────────────────────────────────
app.use(express.json());

// ── Groq client ───────────────────────────────────────────────
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ── System prompt for roadmap ─────────────────────────────────
const ROADMAP_PROMPT = `You are an expert career mentor and curriculum designer.
When given a technology keyword, generate a structured learning roadmap with three stages.
Return ONLY valid JSON — no markdown, no extra text:
{
  "beginner":     [{ "topic": "...", "explanation": "...", "tools": ["..."] }],
  "intermediate": [{ "topic": "...", "explanation": "...", "tools": ["..."] }],
  "advanced":     [{ "topic": "...", "explanation": "...", "tools": ["..."] }]
}
Each stage: 4-6 modules. Each module: topic (string), 1-2 sentence explanation, tools array.`;

// ── Safe JSON parser (strips markdown fences if any) ─────────
function safeParseGroq(raw) {
  if (!raw) return null;
  const cleaned = raw
    .replace(/^```(?:json)?\s*/im, "")
    .replace(/\s*```\s*$/m, "")
    .trim();
  try { return JSON.parse(cleaned); } catch { return null; }
}

// ── POST /generate-roadmap ────────────────────────────────────
app.post("/generate-roadmap", async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic || !topic.trim()) {
      return res.status(400).json({ error: "Please provide a topic." });
    }

    const completion = await groq.chat.completions.create({
      model:       "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: ROADMAP_PROMPT },
        { role: "user",   content: `Generate a learning roadmap for: "${topic.trim()}"` },
      ],
      temperature: 0.7,
      max_tokens:  2048,
    });

    const raw     = completion.choices[0]?.message?.content;
    const roadmap = safeParseGroq(raw);

    if (!roadmap?.beginner || !roadmap?.intermediate || !roadmap?.advanced) {
      return res.status(500).json({ error: "AI returned invalid format. Please try again." });
    }

    return res.status(200).json({ topic: topic.trim(), roadmap });

  } catch (err) {
    console.error("[ROADMAP ERROR]", err.message);
    return res.status(500).json({ error: "Server error. Please try again later." });
  }
});

// ── POST /api/explain  (AI Tutor) ────────────────────────────
const explainRoute = require("./explainRoute");
app.use("/api/explain", explainRoute);

// ── Health check ──────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ status: "OK", message: "RoadmapAI API is running." });
});

// ── Start server ──────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
