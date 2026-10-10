from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field

# ----------------- Request Schemas -----------------

class AnalyzeRequest(BaseModel):
    company_name: str = Field(..., description="Target company name under analysis", min_length=1, max_length=100)
    competitor_names: List[str] = Field(..., description="List of competitor names (up to 2)", min_items=1, max_items=2)
    industry: Optional[str] = Field(default="Technology & Enterprise Software", description="Industry or market category")
    sources_text: Optional[str] = Field(default="", description="User supplied raw text, news summaries, or press releases")
    sources_urls: Optional[List[str]] = Field(default=[], description="Public URLs to scrape and extract research evidence from")
    use_sample_data: Optional[bool] = Field(default=False, description="If true, uses rich pre-verified benchmark dataset")
    sample_dataset_id: Optional[str] = Field(default=None, description="Optional preset dataset key (e.g. retail_tech, cyber_sec, dev_ai)")

# ----------------- Research Agent Schemas -----------------

class SourceItem(BaseModel):
    id: str = Field(..., description="Unique source identifier")
    url: Optional[str] = Field(default=None, description="Source URL if available")
    title: str = Field(..., description="Document or article headline")
    snippet: str = Field(..., description="Direct quote or extracted evidence excerpt")
    publication_date: Optional[str] = Field(default="Recent (2025/2026)", description="Estimated or verified publication date")
    domain: Optional[str] = Field(default="Public Domain", description="Website domain or publisher")
    verified: bool = Field(default=True, description="Whether the source was verified and accessible")

class ResearchFinding(BaseModel):
    company: str = Field(..., description="Subject company")
    title: str = Field(..., description="Headline of the factual development")
    key_development: str = Field(..., description="Summary of factual announcement, release, or pivot")
    evidence_snippets: List[str] = Field(default=[], description="Direct textual evidence citations")
    source_ref: str = Field(default="Source #1", description="Reference ID to SourceItem")
    missing_information: List[str] = Field(default=[], description="Critical data points missing from public disclosure")

class ResearchAgentOutput(BaseModel):
    summary: str = Field(..., description="High-level factual research summary")
    findings: List[ResearchFinding] = Field(default=[], description="Extracted corporate developments")
    data_gaps: List[str] = Field(default=[], description="Unverified or missing industry indicators")
    sources_processed: List[SourceItem] = Field(default=[], description="Catalog of processed intelligence sources")

# ----------------- Market Intelligence Agent Schemas -----------------

class MarketSignal(BaseModel):
    type: str = Field(..., description="'trend' | 'opportunity' | 'threat' | 'market_signal'")
    title: str = Field(..., description="Headline of the signal")
    description: str = Field(..., description="Deep dive into the market movement")
    evidence_type: str = Field(..., description="'verified_evidence' | 'hypothesis' | 'market_assumption'")
    impact_level: str = Field(..., description="'low' | 'medium' | 'high' | 'critical'")
    time_horizon: str = Field(..., description="'immediate' | 'short_term' | 'medium_term' | 'long_term'")

class MarketIntelligenceOutput(BaseModel):
    market_summary: str = Field(..., description="Overview of prevailing industry conditions")
    macro_trends: List[str] = Field(default=[], description="Key macro and structural trends identified")
    signals: List[MarketSignal] = Field(default=[], description="Opportunities, threats, and market signals")
    assumptions_vs_evidence: List[Dict[str, str]] = Field(
        default=[],
        description="Explicit breakdown differentiating proven market facts from forward-looking hypotheses"
    )

# ----------------- Competitor Analysis Agent Schemas -----------------

class CompetitorScoreMetric(BaseModel):
    metric_name: str = Field(..., description="Dimension name, e.g. 'AI Model Accuracy', 'Enterprise Readiness'")
    company_score: int = Field(..., ge=0, le=100, description="Score for user's company")
    comp1_score: int = Field(..., ge=0, le=100, description="Score for competitor 1")
    comp2_score: int = Field(..., ge=0, le=100, description="Score for competitor 2")
    metric_explanation: str = Field(..., description="Factual justification for this scoring comparison")

class CompetitorComparisonOutput(BaseModel):
    company_name: str
    comp1_name: str
    comp2_name: str
    products_services: Dict[str, str] = Field(..., description="Product portfolio breakdown per entity")
    market_positioning: Dict[str, str] = Field(..., description="Core go-to-market and brand positioning")
    pricing_strategy: Dict[str, str] = Field(
        ...,
        description="Pricing model when verified; explicitly marked 'Unknown / Not Disclosed' if unverified"
    )
    strengths: Dict[str, List[str]] = Field(..., description="Key enterprise advantages per company")
    weaknesses: Dict[str, List[str]] = Field(..., description="Identified competitive vulnerabilities per company")
    metrics: List[CompetitorScoreMetric] = Field(default=[], description="Comparative benchmark metrics for charts")
    unknown_factors: List[str] = Field(default=[], description="Explicitly unverified areas requiring confidential discovery")

# ----------------- Strategy Agent Schemas -----------------

class StrategicRecommendation(BaseModel):
    id: str = Field(..., description="Unique recommendation ID, e.g., REC-01")
    title: str = Field(..., description="Actionable recommendation headline")
    priority: str = Field(..., description="'urgent' | 'high' | 'medium' | 'low'")
    strategic_pillar: str = Field(..., description="'Product Differentiation' | 'Go-To-Market' | 'Defensive Moat' | 'Pricing'")
    target_competitor: Optional[str] = Field(default=None, description="Competitor this move specifically counters")
    rationale: str = Field(..., description="Strategic logic connecting market findings to recommendation")
    supporting_evidence: List[str] = Field(default=[], description="Direct facts and source references backing the decision")
    expected_benefit: str = Field(..., description="Quantifiable or strategic business payoff")
    potential_risks: List[str] = Field(default=[], description="Execution, financial, or competitive backlash risks")
    confidence_score: float = Field(..., ge=0.0, le=1.0, description="Confidence score from 0.0 to 1.0")
    execution_horizon: str = Field(..., description="e.g. '0-30 Days', 'Q1-Q2', '6+ Months'")

class StrategyAgentOutput(BaseModel):
    executive_summary: str = Field(..., description="Synthesis and strategic executive briefing")
    recommendations: List[StrategicRecommendation] = Field(default=[], description="Ranked strategic actions")
    critical_risks_to_monitor: List[str] = Field(default=[], description="Key indicators to track to avoid disruptions")

# ----------------- Orchestration & Consolidated Report Schemas -----------------

class AgentStatus(BaseModel):
    agent_id: str
    agent_name: str
    role_description: str
    status: str = Field(..., description="'pending' | 'running' | 'completed' | 'failed'")
    execution_time_ms: int = Field(default=0)
    message: str = Field(default="")

class ConsolidatedReport(BaseModel):
    analysis_id: str
    created_at: str
    is_demo_mode: bool
    provider_used: str
    company_name: str
    competitor_names: List[str]
    industry: str
    research_data: ResearchAgentOutput
    market_data: MarketIntelligenceOutput
    competitor_data: CompetitorComparisonOutput
    strategy_data: StrategyAgentOutput
    agent_execution_statuses: List[AgentStatus]
    sources: List[SourceItem]

class HealthResponse(BaseModel):
    status: str
    service: str
    version: str
    ai_provider_configured: bool
    ai_model: str
    environment: str
