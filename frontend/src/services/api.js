const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:8000';
const API_BASE_URL = rawBaseUrl.replace(/\/+$/, '');

export async function fetchHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    if (!res.ok) throw new Error(`Health check failed (${res.status})`);
    return await res.json();
  } catch (err) {
    console.warn("Backend health check failed:", err.message);
    return {
      status: "disconnected",
      service: "CorpIntel AI Backend",
      version: "1.0.0",
      ai_provider_configured: false,
      ai_model: "Offline / Demo Fallback",
      environment: "client-only",
      error: err.message
    };
  }
}

export async function fetchPresets() {
  const res = await fetch(`${API_BASE_URL}/api/presets`);
  if (!res.ok) throw new Error(`Failed to load presets (${res.status})`);
  return await res.json();
}

export async function fetchPresetDetail(presetId) {
  const res = await fetch(`${API_BASE_URL}/api/presets/${presetId}`);
  if (!res.ok) throw new Error(`Failed to load preset ${presetId} (${res.status})`);
  return await res.json();
}

export async function testExtractUrl(url) {
  const res = await fetch(`${API_BASE_URL}/api/extract-url`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url })
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `URL fetch failed with status ${res.status}`);
  }
  return await res.json();
}

export async function analyzeCompany(payload) {
  const res = await fetch(`${API_BASE_URL}/api/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Analysis request failed with status ${res.status}`);
  }

  return await res.json();
}
