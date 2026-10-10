import sys
from pathlib import Path

# Add backend directory to path
backend_dir = Path(__file__).resolve().parent
sys.path.insert(0, str(backend_dir))

from fastapi.testclient import TestClient
from app.main import app

def test_corpintel_pipeline():
    client = TestClient(app)
    
    # 1. Test Health
    health_resp = client.get("/health")
    assert health_resp.status_code == 200, f"Health check failed: {health_resp.text}"
    health_data = health_resp.json()
    print("Health Check:", health_data)
    assert health_data["status"] == "healthy"

    # 2. Test Presets
    presets_resp = client.get("/api/presets")
    assert presets_resp.status_code == 200
    presets = presets_resp.json()
    print(f"Loaded {len(presets)} presets:")
    for p in presets:
        print(f" - [{p['id']}] {p['name']} ({p['company_name']})")
    assert len(presets) >= 3

    # 3. Test Analyze with Preset Data (Retail Tech)
    analyze_payload = {
        "company_name": "ShelfEdge AI",
        "competitor_names": ["Trax Retail", "Standard AI"],
        "industry": "Retail Automation & Computer Vision",
        "use_sample_data": True,
        "sample_dataset_id": "retail_tech"
    }
    analyze_resp = client.post("/api/analyze", json=analyze_payload)
    assert analyze_resp.status_code == 200, f"Analysis failed: {analyze_resp.text}"
    report = analyze_resp.json()
    print("\n--- Analysis Report Received ---")
    print(f"Analysis ID: {report['analysis_id']}")
    print(f"Is Demo Mode: {report['is_demo_mode']}")
    print(f"Provider Used: {report['provider_used']}")
    print(f"Company: {report['company_name']}")
    print(f"Competitors: {report['competitor_names']}")
    print(f"Agents Executed: {[a['agent_name'] for a in report['agent_execution_statuses']]}")
    print(f"Research Findings Count: {len(report['research_data']['findings'])}")
    print(f"Market Signals Count: {len(report['market_data']['signals'])}")
    print(f"Competitor Metrics Count: {len(report['competitor_data']['metrics'])}")
    print(f"Recommendations Count: {len(report['strategy_data']['recommendations'])}")
    
    assert len(report["agent_execution_statuses"]) == 4
    for a in report["agent_execution_statuses"]:
        assert a["status"] == "completed"
    assert len(report["strategy_data"]["recommendations"]) >= 1

    print("\nALL BACKEND API TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    test_corpintel_pipeline()
