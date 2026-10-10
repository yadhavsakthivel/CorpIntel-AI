import React, { useState } from 'react';
import { 
  Bot, 
  Search, 
  TrendingUp, 
  Swords, 
  Target, 
  Clock, 
  CheckCircle2, 
  Code, 
  Copy, 
  ChevronDown, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export default function AgentsTab({ report }) {
  const [expandedAgent, setExpandedAgent] = useState('AGT-01');
  const [copiedId, setCopiedId] = useState(null);

  if (!report) {
    return <div className="p-8 text-center text-slate-400">No agent telemetry loaded.</div>;
  }

  const {
    research_data,
    market_data,
    competitor_data,
    strategy_data,
    agent_execution_statuses
  } = report;

  const agentsConfig = [
    {
      id: 'AGT-01',
      name: 'Research Agent',
      role: 'Factual Corporate Ingestion & Evidence Quote Capture',
      icon: Search,
      systemObjective: 'Ingests public documents and press releases. Extracts verifiable factual events and evidence snippets. Catalogues data gaps and unverified metrics.',
      outputData: research_data,
      metricsSummary: `${research_data?.findings?.length || 0} developments extracted across ${research_data?.sources_processed?.length || 0} sources`
    },
    {
      id: 'AGT-02',
      name: 'Market Intelligence Agent',
      role: 'Trend Analysis, Signal Radar & Assumption Boundary Enforcement',
      icon: TrendingUp,
      systemObjective: 'Evaluates the research output for broader market trends, opportunities, and threats. Strictly distinguishes proven facts from forward-looking hypotheses.',
      outputData: market_data,
      metricsSummary: `${market_data?.signals?.length || 0} signals identified; ${market_data?.assumptions_vs_evidence?.length || 0} assumption boundaries drawn`
    },
    {
      id: 'AGT-03',
      name: 'Competitor Analysis Agent',
      role: 'Head-to-Head Benchmarking & Unknown Factor Tagging',
      icon: Swords,
      systemObjective: 'Compares products, positioning, pricing, strengths, and weaknesses. Crucially flags unverified pricing or features as Unknown to eliminate hallucinations. Calculates 0-100 benchmark scores.',
      outputData: competitor_data,
      metricsSummary: `Benchmarked 3 corporate entities across ${competitor_data?.metrics?.length || 0} quantitative dimensions`
    },
    {
      id: 'AGT-04',
      name: 'Strategy Agent',
      role: 'Actionable Executive Advisory & Prioritized Recommendations',
      icon: Target,
      systemObjective: 'Synthesizes all 3 previous agent deliverables into prioritized, high-leverage business moves with explicit evidence citations, expected benefits, and risk matrices.',
      outputData: strategy_data,
      metricsSummary: `${strategy_data?.recommendations?.length || 0} prioritized strategic initiatives with audit trails`
    }
  ];

  const handleCopyJson = (id, data) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Bot className="w-5 h-5 text-blue-600" />
          <span>Specialized Multi-Agent Architecture & Chain-of-Custody</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Four distinct autonomous agents execute sequentially. Each agent receives the validated structured payload of its predecessor, ensuring end-to-end evidence chain-of-custody without prompt dilution.
        </p>
      </div>

      {/* Agents Deep Dive List */}
      <div className="space-y-4">
        {agentsConfig.map((agent) => {
          const Icon = agent.icon;
          const statusObj = agent_execution_statuses?.find(s => s.agent_id === agent.id);
          const isExpanded = expandedAgent === agent.id;

          return (
            <div
              key={agent.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden transition-all"
            >
              {/* Agent Header */}
              <div
                onClick={() => setExpandedAgent(isExpanded ? null : agent.id)}
                className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/60 transition-colors select-none"
              >
                <div className="flex items-center gap-3.5">
                  <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {agent.id}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900">{agent.name}</h3>
                      <span className="text-xs text-slate-400 hidden sm:inline">• {agent.role}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{agent.metricsSummary}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Completed ({statusObj?.execution_time_ms || 200}ms)</span>
                  </div>
                  {isExpanded ? <ChevronDown className="w-5 h-5 text-slate-400" /> : <ChevronRight className="w-5 h-5 text-slate-400" />}
                </div>
              </div>

              {/* Collapsible Details */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-100 space-y-4">
                  {/* System Objective */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
                    <span className="font-bold text-slate-900 block mb-1">System Prompt Directive:</span>
                    {agent.systemObjective}
                  </div>

                  {/* Status message */}
                  {statusObj?.message && (
                    <div className="text-xs text-slate-600 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span className="font-semibold">Runtime Output:</span>
                      <span>{statusObj.message}</span>
                    </div>
                  )}

                  {/* Raw Structured JSON Viewer */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <Code className="w-3.5 h-3.5 text-blue-600" />
                        <span>Structured Schema Output (Pydantic Validated)</span>
                      </span>
                      <button
                        onClick={() => handleCopyJson(agent.id, agent.outputData)}
                        className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{copiedId === agent.id ? 'Copied JSON!' : 'Copy JSON'}</span>
                      </button>
                    </div>

                    <pre className="p-3 bg-slate-900 text-emerald-400 rounded-xl font-mono text-[11px] overflow-x-auto max-h-64 scrollbar-thin">
                      {JSON.stringify(agent.outputData, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
