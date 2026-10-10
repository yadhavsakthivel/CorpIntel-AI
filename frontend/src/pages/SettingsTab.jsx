import React, { useState } from 'react';
import { 
  Settings, 
  Key, 
  ShieldCheck, 
  Server, 
  Sparkles, 
  Database, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  Code
} from 'lucide-react';

export default function SettingsTab({ health, onRefreshHealth }) {
  const [copiedKeyGuide, setCopiedKeyGuide] = useState(false);

  const sampleEnv = `# CorpIntel AI Backend Configuration (.env)
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash

# Allowed CORS Origins
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
PORT=8000
ENVIRONMENT=development`;

  const handleCopyEnv = () => {
    navigator.clipboard.writeText(sampleEnv);
    setCopiedKeyGuide(true);
    setTimeout(() => setCopiedKeyGuide(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Overview Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-600" />
          <span>Platform Settings & AI Provider Architecture</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Inspect backend connectivity, verify LLM configuration, and understand security guarantees.
        </p>
      </div>

      {/* System Status Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Server className="w-4 h-4 text-blue-600" />
            <span>Backend Engine Health & AI Provider Status</span>
          </h3>
          <button
            onClick={onRefreshHealth}
            className="text-xs font-semibold text-blue-600 hover:underline"
          >
            Refresh Status
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-500 font-medium">Service Status:</span>
            <div className="flex items-center gap-2 mt-1">
              <span className={`w-2.5 h-2.5 rounded-full ${health?.status === 'healthy' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
              <span className="text-xs font-bold text-slate-900 capitalize">{health?.status || 'Unknown'}</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1 font-mono">{health?.service || 'CorpIntel Backend'}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-500 font-medium">Active AI Provider:</span>
            <div className="flex items-center gap-1.5 mt-1">
              {health?.ai_provider_configured ? (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-emerald-700">Live LLM Configured</span>
                </>
              ) : (
                <>
                  <Database className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-bold text-amber-700">High-Fidelity Demo Mode</span>
                </>
              )}
            </div>
            <p className="text-[10px] text-slate-500 mt-1 truncate">{health?.ai_model}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-500 font-medium">Environment:</span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-xs font-bold font-mono text-slate-900">{health?.environment || 'development'}</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">v{health?.version || '1.0.0'}</p>
          </div>
        </div>
      </div>

      {/* AI Provider Setup Guide */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Key className="w-4 h-4 text-blue-600" />
            <span>Configuring Live Google Gemini or OpenAI Provider</span>
          </h3>
          <button
            onClick={handleCopyEnv}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            {copiedKeyGuide ? 'Copied snippet!' : 'Copy .env snippet'}
          </button>
        </div>

        <p className="text-xs text-slate-600 mb-3 leading-relaxed">
          CorpIntel AI is designed to run seamlessly out-of-the-box in <strong>explicitly-labeled High-Fidelity Demo Mode</strong> using pre-verified hackathon datasets. If you wish to activate live autonomous LLM extraction with Gemini:
        </p>

        <ol className="list-decimal list-inside text-xs text-slate-700 space-y-2 mb-4">
          <li>Create or edit the <code className="bg-slate-100 px-1 py-0.5 rounded text-blue-600 font-mono">CorpIntel-AI/backend/.env</code> file.</li>
          <li>Insert your Google Gemini API key: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">GEMINI_API_KEY=your_gemini_api_key_here</code></li>
          <li>Save the file and restart the backend server. The system automatically elevates from Demo Mode to Live AI Analysis!</li>
        </ol>

        <div className="p-3 bg-slate-900 text-slate-200 rounded-xl font-mono text-xs overflow-x-auto">
          <pre>{sampleEnv}</pre>
        </div>
      </div>

      {/* Security & Isolation */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Security & Architectural Principles (Hackathon Compliance)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-600">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-bold text-slate-900 block mb-1">Zero Key Exposure:</span>
            API keys are strictly backend-only environment variables. The frontend client never has access to, nor renders, any raw API credentials.
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-bold text-slate-900 block mb-1">Transparent Demo Labeling:</span>
            When running without an active API key or with preset sample data, the platform explicitly badges the run as "Sample Benchmark Mode" rather than fabricating live research.
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-bold text-slate-900 block mb-1">Factual Integrity:</span>
            Public research scraper preserves source URLs and quotes. Unverified competitor pricing is explicitly flagged as "Unknown / Not Disclosed" instead of hallucinating.
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-bold text-slate-900 block mb-1">Modular Orchestration:</span>
            Each of the 4 agents operates with a dedicated system prompt and strict Pydantic JSON schema validation.
          </div>
        </div>
      </div>
    </div>
  );
}
