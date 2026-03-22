// ============================================================
// backend/explainRoute.js  — AI Tutor v2
// POST /api/explain  →  { explanation, code }
// Returns 10-12 rich bullet points + a code example
// ============================================================

const express = require("express");
const Groq    = require("groq-sdk");

const router = express.Router();
const groq   = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ── System Prompt ─────────────────────────────────────────
// Key design: ask for JSON inline, keep the format minimal
// so the model doesn't wrap it in markdown.
const SYSTEM_PROMPT = `You are an expert Computer Science tutor. Your job is to explain programming and technology topics clearly to students.

When given a topic, respond with ONLY a raw JSON object — no markdown, no code fences, no text before or after the JSON.

Use this exact format:
{"explanation":"• point 1\n• point 2\n• point 3\n• point 4\n• point 5\n• point 6\n• point 7\n• point 8\n• point 9\n• point 10","code":"your code here"}

Rules:
- explanation: EXACTLY 10-12 bullet points. Each bullet starts with "• " and is separated by \\n (newline character in JSON).
  Make each point informative (1-2 sentences). Cover: definition, why it matters, how it works, common use cases, best practices, pitfalls, tools/libraries, and real-world examples.
- code: ONE clean, working code example (10-20 lines). Add short comments on key lines. If the topic has no code (e.g. "Agile methodology"), use "".
- Respond with { at the very start and } at the very end. Nothing else.`;

// ── Multi-strategy JSON extractor ─────────────────────────
function extractJSON(raw) {
  if (!raw) return null;

  // Strategy 1: Direct parse
  try { return JSON.parse(raw.trim()); } catch (_) {}

  // Strategy 2: Strip markdown fences
  try {
    return JSON.parse(
      raw.replace(/^```(?:json)?\s*/im, "").replace(/\s*```\s*$/m, "").trim()
    );
  } catch (_) {}

  // Strategy 3: Extract first { ... } block
  try {
    const s = raw.indexOf("{"), e = raw.lastIndexOf("}");
    if (s !== -1 && e > s) return JSON.parse(raw.slice(s, e + 1));
  } catch (_) {}

  // Strategy 4: Collapse literal newlines inside strings then parse
  try {
    const s = raw.indexOf("{"), e = raw.lastIndexOf("}");
    if (s !== -1 && e > s) {
      // Replace bare newlines outside string literals with space
      const fixed = raw.slice(s, e + 1).replace(
        /("(?:[^"\\]|\\.)*")|[\r\n]+/g,
        (m, str) => str || " "
      );
      return JSON.parse(fixed);
    }
  } catch (_) {}

  // Strategy 5: Regex field extraction
  try {
    const expMatch  = raw.match(/"explanation"\s*:\s*"([\s\S]*?)"\s*(?:,|\})/);
    const codeMatch = raw.match(/"code"\s*:\s*"([\s\S]*?)"\s*\}/);
    if (expMatch) {
      return {
        explanation: expMatch[1].replace(/\\n/g, "\n").replace(/\\"/g, '"'),
        code: codeMatch ? codeMatch[1].replace(/\\n/g, "\n").replace(/\\"/g, '"') : "",
      };
    }
  } catch (_) {}

  return null;
}

// ── Plain-text fallback (if JSON fails entirely) ──────────
async function fallbackPlainText(topic) {
  const resp = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{
      role: "user",
      content: `Explain "${topic}" with exactly 10-12 bullet points (each starting with • symbol). Then show a short code example. Plain text only.`,
    }],
    temperature: 0.4,
    max_tokens: 1200,
  });

  const text  = resp.choices[0]?.message?.content || "";
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);

  // Identify bullet lines
  const bullets = lines
    .filter(l => l.startsWith("•") || l.startsWith("-") || l.startsWith("*"))
    .map(l => l.startsWith("•") ? l : "• " + l.replace(/^[-*]\s*/, ""));

  // Identify code block
  const codeStart = lines.findIndex(l =>
    l.startsWith("```") || l.includes("function ") ||
    l.includes("class ") || l.includes("def ") ||
    l.startsWith("//") || l.startsWith("#")
  );
  const code = codeStart > -1
    ? lines.slice(codeStart).join("\n").replace(/```\w*/g, "").trim()
    : "";

  return {
    explanation: bullets.length > 0 ? bullets.join("\n") : lines.slice(0, 10).map(l => `• ${l}`).join("\n"),
    code,
  };
}

// ── POST /api/explain ─────────────────────────────────────
router.post("/", async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic || typeof topic !== "string" || !topic.trim()) {
      return res.status(400).json({ error: "Please provide a valid topic." });
    }

    const cleanTopic = topic.trim();
    console.log(`[TUTOR] ▶ "${cleanTopic}"`);

    // Primary: ask for JSON
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user",   content: `Explain this topic: "${cleanTopic}"` },
      ],
      temperature: 0.35,
      max_tokens:  1800,   // more tokens = room for 10-12 detailed bullets + code
    });

    const raw = completion.choices[0]?.message?.content || "";
    console.log(`[TUTOR] Raw preview: ${raw.slice(0, 120)}…`);

    let result = extractJSON(raw);

    // Fallback if JSON fails
    if (!result?.explanation) {
      console.warn("[TUTOR] JSON failed — using plain text fallback");
      try {
        result = await fallbackPlainText(cleanTopic);
      } catch (fbErr) {
        console.error("[TUTOR] Fallback failed:", fbErr.message);
        return res.status(500).json({ error: "Could not generate explanation. Please try again." });
      }
    }

    console.log(`[TUTOR] ✅ "${cleanTopic}" — ${result.explanation.split("\n").length} bullets`);

    return res.status(200).json({
      explanation: result.explanation || "No explanation available.",
      code:        result.code        || "",
    });

  } catch (err) {
    console.error("[TUTOR ERROR]", err.message);
    return res.status(500).json({ error: "Server error. Please try again." });
  }
});

module.exports = router;
