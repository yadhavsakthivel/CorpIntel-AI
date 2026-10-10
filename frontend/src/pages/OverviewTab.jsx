import React from 'react';
import { 
  Building2, 
  Users2, 
  TrendingUp, 
  Target, 
  ShieldAlert, 
  ArrowUpRight, 
  FileText, 
  CheckCircle2, 
  Sparkles,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Database
} from 'lucide-react';
import AgentTrackerCard from '../components/AgentTrackerCard';
import MetricCharts from '../components/MetricCharts';

export default function OverviewTab({ report, isAnalyzing, onOpenSources, onSelectRecommendation, setActiveTab }) {
  if (!report) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <Sparkles className="w-8 h-8 text-blue-500 mx-auto mb-2 animate-pulse" />
        <h3 className="text-base font-bold text-slate-800">No Intelligence Report Loaded</h3>
        <p className="text-xs text-slate-500 mt-1">Click "New Intelligence Run" to start an analysis.</p>
      </div>
    );
  }

  const {
    company_name,
    competitor_names,
    industry,
    research_data,
    market_data,
    competitor_data,
    strategy_data,
    agent_execution_statuses,
    sources
  } = report;

  const urgentRecs = strategy_data?.recommendations?.filter(r => r.priority === 'urgent' || r.priority === 'high') || [];
  const opportunities = market_data?.signals?.filter(s => s.type === 'opportunity') || [];
  const threats = market_data?.signals?.filter(s => s.type === 'threat') || [];

  return (
    <div className="space-y-6">
      {/* 4 Agent Orchestration Tracker */}
      <AgentTrackerCard statuses={agent_execution_statuses} isAnalyzing={isAnalyzing} />

      {/* Explicit Sample Data Disclaimer Banner */}
      {report?.is_demo_mode && (
        <div className="p-4 bg-amber-50/90 border border-amber-300 rounded-2xl flex items-start gap-3 shadow-2xs">
          <Database className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold text-amber-900 block text-sm mb-0.5">
              Sample Benchmark Dataset Mode (Demo Only)
            </span>
            <p className="text-amber-800 leading-relaxed">
              The intelligence findings and competitor metrics below are generated from sample benchmark data. 
              <strong> These are demonstration metrics and not presented as live verified market facts.</strong> 
              To activate live AI extraction from web sources, provide a valid <code className="font-mono bg-amber-100/80 px-1 py-0.5 rounded text-amber-900">GEMINI_API_KEY</code> in the backend environment.
            </p>
          </div>
        </div>
      )}

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Strategic Moves</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{strategy_data?.recommendations?.length || 0}</span>
            <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
              {urgentRecs.length} High Priority
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Prioritized executive actions</p>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Market Signals</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{market_data?.signals?.length || 0}</span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
              {opportunities.length} Opportunities
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Differentiated from assumptions</p>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Critical Threats</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{threats.length}</span>
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
              Monitored
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Direct competitor moats</p>
        </div>

        {/* KPI 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Audited Evidence</span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900">{sources?.length || 0}</span>
            <button
              onClick={onOpenSources}
              className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-0.5"
            >
              <span>Inspect All</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-1">Articles & press disclosures</p>
        </div>
      </div>

      {/* Executive Briefing Banner */}
      <div className="bg-gradient-to-br from-slate-900 to-[#101B3A] text-white rounded-2xl p-6 shadow-md border border-slate-800">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Strategy Agent Executive Synthesis</span>
        </div>
        <h3 className="text-lg font-bold text-white mb-2">
          Competitive Positioning & Market Opportunity for {company_name}
        </h3>
        <p className="text-xs md:text-sm text-slate-300 leading-relaxed max-w-4xl">
          {strategy_data?.executive_summary}
        </p>
      </div>

      {/* Grid: Charts + Top Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Benchmarking Charts (7 cols) */}
        <div className="lg:col-span-7">
          <MetricCharts competitorData={competitor_data} />
        </div>

        {/* Top Priority Strategic Actions (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-blue-600" />
                <span>Priority Strategic Actions</span>
              </h3>
              <button
                onClick={() => setActiveTab('recommendations')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
              >
                <span>View All ({strategy_data?.recommendations?.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {strategy_data?.recommendations?.slice(0, 3).map((rec, i) => (
                <div
                  key={rec.id || i}
                  onClick={() => onSelectRecommendation(rec)}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/20 cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                      {rec.id}
                    </span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      rec.priority === 'urgent' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {rec.priority}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 mt-1.5 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {rec.title}
                  </h4>

                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                    {rec.expected_benefit}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-medium text-slate-600">{rec.strategic_pillar}</span>
                    <span className="text-blue-600 font-semibold group-hover:underline flex items-center gap-0.5">
                      Inspect Why
                      <ArrowUpRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-center">
            <button
              onClick={() => setActiveTab('recommendations')}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Examine full strategic roadmaps & risk matrices →
            </button>
          </div>
        </div>
      </div>

      {/* Recent Intelligence Findings & Evidence Excerpts */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Recent Evidence-Backed Findings (Research Agent)</span>
            </h3>
            <p className="text-xs text-slate-500">Verified corporate developments extracted directly from public sources</p>
          </div>
          <button
            onClick={onOpenSources}
            className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
          >
            <span>Audit All Sources ({sources?.length})</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {research_data?.findings?.map((finding, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-slate-900 px-2 py-0.5 rounded bg-white border border-slate-200">
                    {finding.company}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    {finding.source_ref}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-800 line-clamp-1 mt-1">{finding.title}</h4>
                <p className="text-xs text-slate-600 mt-1 line-clamp-3 leading-relaxed">
                  {finding.key_development}
                </p>

                {finding.evidence_snippets && finding.evidence_snippets.length > 0 && (
                  <div className="mt-2.5 p-2 bg-white rounded-lg border border-slate-200/80 text-[11px] text-slate-600 italic">
                    "{finding.evidence_snippets[0]}"
                  </div>
                )}
              </div>

              {finding.missing_information && finding.missing_information.length > 0 && (
                <div className="mt-3 pt-2 border-t border-slate-200/80 text-[10px] text-amber-700 flex items-center gap-1">
                  <HelpCircle className="w-3 h-3 shrink-0" />
                  <span className="truncate">Missing: {finding.missing_information[0]}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
