# 🗺️ AI-Powered Student Roadmap Generator

A full-stack BTech Final Year Project that generates structured learning roadmaps using **Groq AI**, **React**, and **Express**.

---

## 📁 Project Structure

```
roadmap-generator/
│
├── backend/                     # Express.js server
│   ├── server.js                # Main API server
│   ├── package.json
│   ├── .env.example             # Copy this to .env
│   └── .env                     # ← YOU CREATE THIS (not committed to git)
│
└── frontend/                    # React.js app
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Header.jsx           # Top branding bar
    │   │   ├── SearchInput.jsx      # Topic input + generate button
    │   │   ├── LoadingSpinner.jsx   # Loading animation
    │   │   ├── ErrorMessage.jsx     # Error display
    │   │   ├── RoadmapDisplay.jsx   # Full roadmap + PDF button
    │   │   ├── RoadmapSection.jsx   # One stage (Beginner/etc.)
    │   │   └── RoadmapCard.jsx      # Individual topic card
    │   ├── hooks/
    │   │   └── useRoadmap.js        # API logic + localStorage
    │   ├── utils/
    │   │   └── downloadPdf.js       # html2canvas + jsPDF export
    │   ├── App.jsx                  # Root component
    │   ├── index.js                 # React entry point
    │   └── index.css                # Global styles + glassmorphism
    ├── tailwind.config.js
    └── package.json
```

---

## ⚙️ Prerequisites

Make sure you have these installed:

| Tool | Version | Check |
|------|---------|-------|
| Node.js | v18+ | `node -v` |
| npm | v9+ | `npm -v` |
| Groq API Key | free | [console.groq.com](https://console.groq.com) |

---

## 🚀 Step-by-Step Setup

### Step 1 — Get Your Free Groq API Key

1. Go to **[https://console.groq.com](https://console.groq.com)**
2. Sign up / Log in
3. Click **"API Keys"** → **"Create API Key"**
4. Copy the key (starts with `gsk_...`)

---

### Step 2 — Set Up the Backend

```bash
# Navigate to backend folder
cd roadmap-generator/backend

# Install dependencies
npm install

# Create your .env file from the example
cp .env.example .env
```

Now open `.env` and paste your Groq API key:

```env
GROQ_API_KEY=gsk_your_actual_key_here
PORT=5000
```

Start the backend server:

```bash
# Development mode (auto-restarts on changes)
npm run dev

# OR production mode
npm start
```

✅ You should see:
```
🚀 Server running at http://localhost:5000
   POST /generate-roadmap — ready
```

---

### Step 3 — Set Up the Frontend

Open a **new terminal tab/window**:

```bash
# Navigate to frontend folder
cd roadmap-generator/frontend

# Install dependencies
npm install

# Start React development server
npm start
```

✅ Browser opens automatically at **[http://localhost:3000](http://localhost:3000)**

---

## 🔌 How They Connect

The React frontend sends requests to Express backend:

```
React (port 3000)  →  POST /generate-roadmap  →  Express (port 5000)  →  Groq API
```

The `"proxy": "http://localhost:5000"` in `frontend/package.json` handles this automatically in development — no CORS issues!

---

## 🧪 Testing the Backend (Optional)

Test the API directly with curl or Postman:

```bash
curl -X POST http://localhost:5000/generate-roadmap \
  -H "Content-Type: application/json" \
  -d '{"topic": "Python"}'
```

Expected response:
```json
{
  "topic": "Python",
  "roadmap": {
    "beginner": [
      {
        "topic": "Python Basics",
        "explanation": "Learn syntax, variables, and data types...",
        "tools": ["Python 3", "VS Code", "IDLE"]
      }
    ],
    "intermediate": [ ... ],
    "advanced": [ ... ]
  }
}
```

---

## 🌟 Features

| Feature | Details |
|---------|---------|
| 🤖 AI Roadmap Generation | Groq LLaMA 3 model generates structured paths |
| 🎨 Glassmorphism Dark UI | Neon cyan/purple futuristic design |
| ⚡ Instant Results | Groq API is extremely fast (~1-2 seconds) |
| 📥 PDF Download | Export roadmap via html2canvas + jsPDF |
| 💾 localStorage Cache | Last roadmap persists across page refreshes |
| ❌ Error Handling | User-friendly error messages throughout |
| 📱 Responsive | Works on mobile, tablet, and desktop |
| ⌨️ Keyboard Support | Press Enter to generate |
| 🏷️ Example Chips | Click quick-fill topic chips |

---

## 🛠️ Tech Stack

### Backend
- **Express.js** — REST API server
- **groq-sdk** — Official Groq Node.js SDK
- **dotenv** — Environment variable management
- **cors** — Cross-Origin Resource Sharing
- **nodemon** — Hot reload in development

### Frontend
- **React 18** — UI library
- **Tailwind CSS** — Utility-first styling
- **html2canvas** — DOM-to-canvas screenshot
- **jsPDF** — PDF generation from canvas
- **CSS Variables** — Theming system

---

## 🔧 Troubleshooting

**"Network error. Is the backend running?"**
→ Make sure you started the backend (`npm run dev` in `/backend`)

**"Invalid Groq API key"**
→ Check your `.env` file has the correct key with no extra spaces

**PDF is blank or looks wrong**
→ Make sure you're generating a roadmap before clicking Download

**Port 5000 already in use**
→ Change `PORT=5001` in your `.env` and update `"proxy"` in frontend `package.json`

**React app won't start**
→ Delete `node_modules` and run `npm install` again

---

## 📦 Build for Production

```bash
# Build React app
cd frontend
npm run build

# The /build folder contains the static site
# Serve it with Express or deploy to Vercel/Netlify
```

---

## 🌐 Deployment Options

| Service | What to deploy |
|---------|---------------|
| **Render** | Backend (Express) — free tier |
| **Vercel** | Frontend (React) — free tier |
| **Railway** | Backend with env variables |
| **Netlify** | Frontend static build |

---

## 📝 .env Reference

```env
# Required — your Groq API key
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxx

# Optional — defaults to 5000
PORT=5000
```

---

## 👨‍💻 Project Credits

Built as a **BTech Final Year Project** demonstrating:
- Full-stack JavaScript development
- REST API design
- AI/LLM API integration
- Modern UI/UX with React
- PDF generation in the browser

---

*Powered by [Groq](https://groq.com) · Built with React + Express*
