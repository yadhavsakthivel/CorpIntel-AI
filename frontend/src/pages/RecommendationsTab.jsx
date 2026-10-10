import React, { useState } from 'react';
import { 
  Target, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  ShieldAlert, 
  TrendingUp, 
  Building2,
  Filter,
  Sparkles
} from 'lucide-react';

export default function RecommendationsTab({ strategyData, companyName, onSelectRecommendation }) {
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [pillarFilter, setPillarFilter] = useState('all');

  if (!strategyData) {
    return <div className="p-8 text-center text-slate-400">No strategy recommendations loaded.</div>;
  }

  const { recommendations, critical_risks_to_monitor } = strategyData;

  const filteredRecs = recommendations?.filter(r => {
    const matchPriority = priorityFilter === 'all' || r.priority === priorityFilter;
    const matchPillar = pillarFilter === 'all' || r.strategic_pillar === pillarFilter;
    return matchPriority && matchPillar;
  }) || [];

  const priorityStyles = {
    urgent: 'bg-rose-100 text-rose-800 border-rose-300',
    high: 'bg-amber-100 text-amber-800 border-amber-300',
    medium: 'bg-blue-100 text-blue-800 border-blue-300',
    low: 'bg-slate-100 text-slate-800 border-slate-300',
  };

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-600" />
          <span>Prioritized Strategic Recommendations for {companyName}</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Synthesized by the Strategy Agent by evaluating research developments, market shifts, and competitor vulnerabilities. Every initiative includes an evidence audit trail, expected payoff, and risk profile.
        </p>

        {/* Filter Controls */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          {/* Priority filter */}
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-slate-600">Priority:</span>
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
              {['all', 'urgent', 'high', 'medium'].map(p => (
                <button
                  key={p}
                  onClick={() => setPriorityFilter(p)}
                  className={`px-2.5 py-1 rounded-md font-semibold capitalize transition-all ${
                    priorityFilter === p ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Pillar filter */}
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-slate-600">Pillar:</span>
            <select
              value={pillarFilter}
              onChange={(e) => setPillarFilter(e.target.value)}
              className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs text-slate-700 bg-white"
            >
              <option value="all">All Strategic Pillars</option>
              <option value="Go-To-Market">Go-To-Market</option>
              <option value="Product Differentiation">Product Differentiation</option>
              <option value="Defensive Moat">Defensive Moat</option>
              <option value="Pricing">Pricing</option>
            </select>
          </div>
        </div>
      </div>

      {/* Recommendations Cards Grid */}
      <div className="space-y-4">
        {filteredRecs.map((rec) => {
          const confidencePct = Math.round((rec.confidence_score || 0.85) * 100);

          return (
            <div
              key={rec.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs hover:border-blue-300 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Meta Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                      {rec.id}
                    </span>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${priorityStyles[rec.priority] || priorityStyles.high}`}>
                      {rec.priority} Priority
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {rec.strategic_pillar}
                    </span>
                  </div>

                  {rec.target_competitor && (
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <span>Counters:</span>
                      <strong className="text-slate-900">{rec.target_competitor}</strong>
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-slate-900 mt-1">{rec.title}</h3>

                {/* Rationale */}
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {rec.rationale}
                </p>

                {/* Payoff box */}
                <div className="mt-3 p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 text-xs text-emerald-900 leading-snug">
                  <span className="font-bold block mb-0.5">Expected Commercial Payoff:</span>
                  {rec.expected_benefit}
                </div>
              </div>

              {/* Bottom Meta & Inspect Button */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px]">AI Confidence:</span>
                    <span className="font-bold font-mono text-slate-900">{confidencePct}%</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{rec.execution_horizon}</span>
                  </div>
                </div>

                <button
                  onClick={() => onSelectRecommendation(rec)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-600 hover:text-white hover:bg-blue-600 border border-blue-200 hover:border-transparent transition-all flex items-center gap-1 shadow-2xs"
                >
                  <span>Inspect Evidence & Rationale</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Critical Risks to Monitor */}
      {critical_risks_to_monitor && critical_risks_to_monitor.length > 0 && (
        <div className="p-5 bg-rose-50/50 border border-rose-200 rounded-2xl">
          <h3 className="text-xs font-bold text-rose-900 uppercase tracking-wider flex items-center gap-2 mb-2">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>Critical Strategic Risks & Competitor Retaliation to Monitor</span>
          </h3>
          <p className="text-xs text-rose-800 mb-3">
            Early warning triggers identified by the Strategy Agent that could jeopardize execution:
          </p>
          <div className="space-y-2">
            {critical_risks_to_monitor.map((risk, idx) => (
              <div key={idx} className="p-3 bg-white/90 rounded-xl border border-rose-200/80 text-xs text-slate-800 flex items-start gap-2">
                <span className="text-rose-600 font-bold">•</span>
                <span>{risk}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
