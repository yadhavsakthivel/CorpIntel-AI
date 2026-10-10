import logging
from typing import List, Dict, Any
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .schemas import (
    AnalyzeRequest,
    ConsolidatedReport,
    HealthResponse
)
from .agents import run_orchestration_pipeline, SAMPLE_DATA_DIR, load_preset_sample_dataset
from .research import fetch_url_content
from .llm_client import llm_client

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("corpintel.main")

app = FastAPI(
    title="CorpIntel AI - Corporate Intelligence Platform",
    description="Multi-Agent Corporate Intelligence & Competitive Monitoring Platform for ForgeHacks 2026",
    version="1.0.0"
)

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list + ["*"], # permissive in development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health", response_model=HealthResponse, tags=["System"])
async def health_check():
    """Health check endpoint displaying system readiness and AI provider status."""
    return HealthResponse(
        status="healthy",
        service="CorpIntel AI Backend",
        version="1.0.0",
        ai_provider_configured=llm_client.has_active_provider,
        ai_model=llm_client.active_provider_name,
        environment=settings.ENVIRONMENT
    )

@app.get("/api/presets", tags=["Datasets"])
async def get_sample_presets() -> List[Dict[str, Any]]:
    """Returns catalog of high-fidelity pre-verified demo datasets for quick hackathon review."""
    presets = [
        {
            "id": "retail_tech",
            "name": "Retail Intelligence & Smart Shelf Computer Vision",
            "company_name": "ShelfEdge AI",
            "competitor_names": ["Trax Retail", "Standard AI"],
            "industry": "Retail Automation & Edge AI",
            "description": "On-rail low-power sensors vs ceiling cameras and legacy CPG audit platforms."
        },
        {
            "id": "cybersecurity",
            "name": "Cloud Security & CNAPP Autonomous Remediation",
            "company_name": "CloudArmor Sentinel",
            "competitor_names": ["Wiz", "Orca Security"],
            "industry": "Cloud Infrastructure Security",
            "description": "Deterministic GitOps remediation vs alert-overloaded cloud risk graphs."
        },
        {
            "id": "cloud_devtools",
            "name": "AI Developer Tools & Code Assistants",
            "company_name": "DevPulse Copilot",
            "competitor_names": ["GitHub Copilot", "Cursor AI"],
            "industry": "Developer Productivity & Code AI",
            "description": "Sandbox-verified unit test execution vs IDE forks and standard autocompletion."
        }
    ]
    return presets

@app.get("/api/presets/{preset_id}", tags=["Datasets"])
async def get_preset_detail(preset_id: str) -> Dict[str, Any]:
    """Returns raw preset data for prefilling inputs."""
    data = load_preset_sample_dataset(preset_id)
    if not data:
        raise HTTPException(status_code=404, detail=f"Preset {preset_id} not found.")
    return data

@app.post("/api/extract-url", tags=["Research"])
async def test_url_extraction(payload: Dict[str, str]) -> Dict[str, Any]:
    """Helper endpoint to test live public URL retrieval and preview extracted text."""
    url = payload.get("url", "").strip()
    if not url:
        raise HTTPException(status_code=400, detail="Missing 'url' field.")
    return await fetch_url_content(url)

@app.post("/api/analyze", response_model=ConsolidatedReport, tags=["Intelligence Orchestration"])
async def analyze_company(request: AnalyzeRequest) -> ConsolidatedReport:
    """
    Main Multi-Agent Corporate Intelligence Orchestration Endpoint.
    Sequentially runs:
    1. Research Agent
    2. Market Intelligence Agent
    3. Competitor Analysis Agent
    4. Strategy Agent
    """
    if not request.company_name or not request.company_name.strip():
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Target company name cannot be blank."
        )

    if not request.competitor_names or len(request.competitor_names) < 1:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="At least one competitor name must be specified (up to 2)."
        )

    try:
        report = await run_orchestration_pipeline(request)
        return report
    except Exception as e:
        logger.error(f"Orchestration pipeline execution error: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Intelligence Orchestrator Error: {str(e)}"
        )
