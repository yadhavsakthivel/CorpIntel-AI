# CorpIntel AI — Multi-Agent Corporate Intelligence & Competitive Monitoring Platform

> **ForgeHacks Online 2026** — *AI + Business Track*  
> An autonomous multi-agent platform that turns public disclosures, earnings calls, and news into evidence-backed strategic recommendations and head-to-head competitive monitoring.

---

## 🌟 Executive Overview

In fast-moving enterprise markets, executives and strategy teams spend hundreds of hours manually tracking competitor product releases, parsing press releases, and filtering marketing noise. Traditional tools either deliver raw unverified alerts or hallucinate strategic advice disconnected from source citations.

**CorpIntel AI** solves this through a **sequential four-agent corporate intelligence pipeline**:
1. **Research Agent**: Scrapes and ingests public URLs and disclosures, extracting only verifiable factual developments while cataloging data gaps.
2. **Market Intelligence Agent**: Identifies macro industry trends, commercial opportunities, and existential threats, enforcing a strict boundary between proven evidence and forward-looking hypotheses.
3. **Competitor Analysis Agent**: Benchmarks the company head-to-head against two rivals across positioning, products, and quantitative performance metrics, strictly flagging unverified pricing or features as **"Unknown / Not Disclosed"**.
4. **Strategy Agent**: Formulates prioritized, high-leverage strategic recommendations with supporting evidence audit trails, expected payoffs, and competitive retaliation risk matrices.

---

## 🚀 Key Features

- **Sequential Multi-Agent Orchestration**: Real pipeline with separate prompts and Pydantic schemas, passing validated structured JSON from agent to agent.
- **Strict Evidence Chain-of-Custody**: Every strategic recommendation links directly back to verified source quotes, publication dates, and source URLs.
- **Zero-Hallucination Pricing**: If competitor pricing is not explicitly verified in public disclosures, it is marked *"Unknown / Not Disclosed in Sources"* rather than hallucinating subscription tiers.
- **Hypothesis vs. Evidence Boundary**: Visual audit table separating proven market realities from industry speculation.
- **Live AI & Demo Dual-Engine**:
  - **Live AI Mode**: Powered by Google Gemini (`gemini-1.5-flash` or `gemini-2.0-flash`) or any OpenAI-compatible provider via backend-only environment variables.
  - **High-Fidelity Demo Mode**: If no API key is provided, the platform automatically runs using pre-verified benchmark datasets (Retail Tech, Cloud Security, AI DevTools) with explicit visual labels. Never misleads users or judges.
- **Enterprise SaaS Dashboard**:
  - Navy sidebar with active provider health status
  - Recharts competitive benchmark bar charts (0-100 scale)
  - Interactive recommendation drawer explaining "Why this was generated"
  - Source inspection modal auditing raw excerpts and URLs
  - Printable executive dossier and JSON export

---

## 🏗️ Architecture & Technology Stack

```
                        ┌───────────────────────────────────────────────┐
                        │               React + Vite Frontend           │
                        │ (Tailwind CSS, Lucide Icons, Recharts, Modals)│
                        └───────────────────────┬───────────────────────┘
                                                │ REST API (JSON)
                                                ▼
                        ┌───────────────────────────────────────────────┐
                        │             FastAPI Backend Engine            │
                        │    (Pydantic Schemas, CORS, Error Handlers)   │
                        └───────────────────────┬───────────────────────┘
                                                │
                 ┌──────────────────────────────┼──────────────────────────────┐
                 ▼                              ▼                              ▼
        ┌──────────────────┐           ┌──────────────────┐           ┌──────────────────┐
        │  Research Agent  │           │  Web Scraper /   │           │    LLM Client    │
        │  & Orchestrator  │           │  Source Parser   │           │ (Gemini / OpenAI │
        │  (agents.py)     │           │  (research.py)   │           │  / Demo Engine)  │
        └──────────────────┘           └──────────────────┘           └──────────────────┘
```

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, Recharts.
- **Backend**: Python 3.10+, FastAPI, Pydantic v2, HTTPX, BeautifulSoup4, python-dotenv.
- **AI Models**: Google Gemini API (REST over HTTPX) with JSON schema enforcement; fallback to demo simulation.

---

## 📂 Project Structure

```
CorpIntel-AI/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py          # FastAPI application & endpoints (/health, /api/analyze, /api/presets)
│   │   ├── agents.py        # 4 specialized agents + sequential orchestrator
│   │   ├── research.py      # Public URL fetching & BeautifulSoup text extraction
│   │   ├── schemas.py       # Pydantic v2 validation models
│   │   ├── config.py        # Settings & environment variable loader
│   │   └── llm_client.py    # Isolated LLM provider client (Gemini / OpenAI / Demo)
│   ├── test_api.py          # Automated integration test script
│   ├── requirements.txt     # Python dependencies
│   └── .env.example         # Template for environment variables
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx              # Navy navigation bar with health chip
│   │   │   ├── Navbar.jsx               # Breadcrumbs, Live vs Demo badge, action buttons
│   │   │   ├── AnalysisModal.jsx        # Benchmark presets & custom live research modal
│   │   │   ├── AgentTrackerCard.jsx     # Visual agent timeline & execution timers
│   │   │   ├── MetricCharts.jsx         # Recharts 0-100 comparative scoring
│   │   │   ├── RecommendationModal.jsx  # Evidence rationale inspection drawer
│   │   │   ├── SourceModal.jsx          # Audited public source links & excerpts
│   │   │   └── ExportModal.jsx          # Printable executive dossier
│   │   ├── pages/
│   │   │   ├── OverviewTab.jsx          # Executive KPI briefing & charts
│   │   │   ├── CompetitorsTab.jsx       # Head-to-head positioning, pricing & matrix
│   │   │   ├── MarketTab.jsx            # Macro trends & signals radar
│   │   │   ├── AgentsTab.jsx            # Deep-dive into prompts & raw agent JSON
│   │   │   ├── RecommendationsTab.jsx   # Prioritized actions & risk mitigations
│   │   │   └── SettingsTab.jsx          # API keys & security disclosures
│   │   ├── services/
│   │   │   └── api.js                   # Fetch API wrapper
│   │   ├── App.jsx                      # Main coordinate component
│   │   ├── index.css                    # Tailwind CSS configuration
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── sample_data/
│   ├── retail_tech.json     # ShelfEdge AI vs Trax Retail vs Standard AI
│   ├── cybersecurity.json   # CloudArmor Sentinel vs Wiz vs Orca Security
│   └── cloud_devtools.json  # DevPulse Copilot vs GitHub Copilot vs Cursor AI
├── README.md
└── .gitignore
```

---

## ⚡ Quickstart Guide (Windows PowerShell)

### Prerequisites
- Python 3.10+ (Tested on Python 3.14)
- Node.js 18+ & npm

### Quick 1-Click Launch (Recommended)
From the `CorpIntel-AI` directory:
```powershell
.\run_app.ps1
```
This automatically launches both the FastAPI backend and Vite frontend in dedicated PowerShell windows!

### Manual Startup Option

#### 1. Start the Backend Server
Open a Windows PowerShell terminal:
```powershell
cd "c:\Users\VICTUS\Downloads\AI Pow - Retail Shelf\CorpIntel-AI\backend"

# (Optional) Create and activate a virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install requirements
pip install -r requirements.txt

# (Optional) Configure Gemini API Key
# Copy the template and add your GEMINI_API_KEY if desired:
# cp .env.example .env

# Start FastAPI server on port 8000
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

*Backend Swagger documentation will be available at:*  
👉 **http://127.0.0.1:8000/docs**

### 2. Start the Frontend Server

Open a second Windows PowerShell terminal:

```powershell
# Navigate to frontend directory
cd "c:\Users\VICTUS\Downloads\AI Pow - Retail Shelf\CorpIntel-AI\frontend"

# Install frontend dependencies
npm install

# Start Vite development server
npm run dev
```

*Open your browser and navigate to:*  
👉 **http://localhost:5173**

---

## 🧪 Testing the API & Pipeline

You can run the end-to-end integration test with:

```powershell
python test_api.py
```

This validates:
- `GET /health`: Checks system readiness and configured AI provider.
- `GET /api/presets`: Verifies preloaded benchmark catalogs.
- `POST /api/analyze`: Executes all 4 agents in sequence and validates output schemas.

---

## 🔒 Security & Privacy Guarantees

- **No Exposed Credentials**: API keys are strictly loaded in backend environment variables. The frontend client never touches raw API keys.
- **Transparent Labelling**: When running without an API key, the platform explicitly displays a **"Sample Benchmark Mode"** badge on the dashboard.
- **Respectful Web Ingestion**: Web scrapers utilize custom user-agent headers, respect timeout constraints, and sanitize raw HTML to prevent script injection.
- **No Hallucinated Pricing**: Any competitor pricing not verified in public press releases is marked *"Unknown / Not Disclosed"* rather than guessed.

---

## 📊 Evaluation Walkthrough for Hackathon Judges

1. **Launch the platform** at `http://localhost:5173`.
2. Notice the initial dashboard loads the **Retail Intelligence (ShelfEdge AI vs Trax vs Standard AI)** benchmark dataset immediately.
3. Inspect the **Recharts benchmark chart** to compare Deployment Velocity and Cloud Cost Efficiency.
4. Click **"Inspect Evidence & Rationale"** on any recommendation (e.g. `REC-01`) to view the exact audit trail and risk matrix.
5. Switch to **Competitor Intelligence** to see how unverified competitor pricing is transparently flagged as *Unknown*.
6. Switch to **Market Insights** to view the *Evidence vs. Assumptions Boundary* table.
7. Switch to **AI Agents** to inspect each agent's system prompt directive and raw Pydantic JSON payload.
8. Click **"New Run"** in the top-right navbar to test the **Cloud Security (Wiz vs Orca)** preset, or type in your own custom company and test live URL fetching!
9. Click **"Export Dossier"** to preview or print the executive summary.

---

## ⚖️ Limitations & Roadmap

- **Paywalled Disclosures**: Financial databases (e.g. Bloomberg Terminal, PitchBook) requiring paid enterprise authentication cannot be scraped publicly; users should supply excerpts via the text input area.
- **Real-Time Web Search**: Integration with Google Search Grounding API can be added in `research.py` for automated continuous news streaming.
- **PDF Ingestion**: Native PDF parsing for 10-K and 10-Q SEC annual reports is planned for v1.1.
