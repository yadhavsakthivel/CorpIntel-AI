import React from 'react';
import { 
  X, 
  Target, 
  ShieldAlert, 
  TrendingUp, 
  Sparkles, 
  CheckCircle2, 
  FileCheck,
  Clock,
  Award
} from 'lucide-react';

export default function RecommendationModal({ isOpen, onClose, recommendation, companyName }) {
  if (!isOpen || !recommendation) return null;

  const priorityStyles = {
    urgent: 'bg-rose-100 text-rose-800 border-rose-300',
    high: 'bg-amber-100 text-amber-800 border-amber-300',
    medium: 'bg-blue-100 text-blue-800 border-blue-300',
    low: 'bg-slate-100 text-slate-800 border-slate-300',
  };

  const confidencePct = Math.round((recommendation.confidence_score || 0.85) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-[#0B132B] to-[#1C2541] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 font-mono font-bold text-sm">
              {recommendation.id}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${priorityStyles[recommendation.priority] || priorityStyles.high}`}>
                  {recommendation.priority} Priority
                </span>
                <span className="text-xs text-slate-300">• {recommendation.strategic_pillar}</span>
              </div>
              <h2 className="text-base font-bold mt-1 text-white line-clamp-1">{recommendation.title}</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-5">
          {/* Target Counter */}
          {recommendation.target_competitor && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Counters Competitor Move:</span>
              <span className="font-bold text-slate-900 px-2 py-0.5 rounded bg-white border border-slate-300">
                {recommendation.target_competitor}
              </span>
            </div>
          )}

          {/* Strategic Rationale */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-blue-600" />
              <span>Strategic Rationale</span>
            </h4>
            <div className="p-3.5 bg-blue-50/50 border border-blue-100 rounded-xl text-xs text-slate-700 leading-relaxed">
              {recommendation.rationale}
            </div>
          </div>

          {/* Supporting Evidence Chain */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              <span>Verifiable Supporting Evidence (Audit Trail)</span>
            </h4>
            <div className="space-y-2">
              {recommendation.supporting_evidence && recommendation.supporting_evidence.length > 0 ? (
                recommendation.supporting_evidence.map((ev, i) => (
                  <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{ev}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400">Synthesized from primary research telemetry.</p>
              )}
            </div>
          </div>

          {/* Expected Business Payoff */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              <span>Expected Business Benefit</span>
            </h4>
            <div className="p-3.5 bg-emerald-50/50 border border-emerald-100 rounded-xl text-xs text-emerald-900 leading-relaxed font-medium">
              {recommendation.expected_benefit}
            </div>
          </div>

          {/* Risks & Mitigation */}
          {recommendation.potential_risks && recommendation.potential_risks.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>Identified Execution & Backlash Risks</span>
              </h4>
              <ul className="space-y-1.5">
                {recommendation.potential_risks.map((risk, i) => (
                  <li key={i} className="text-xs text-slate-600 flex items-start gap-2 p-2 bg-rose-50/40 rounded-lg border border-rose-100">
                    <span className="text-rose-500 font-bold">•</span>
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Meta Confidence & Horizon */}
          <div className="pt-3 border-t border-slate-200 grid grid-cols-2 gap-4">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] text-slate-500 block">AI Strategic Confidence:</span>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full"
                    style={{ width: `${confidencePct}%` }}
                  ></div>
                </div>
                <span className="text-xs font-bold font-mono text-slate-900">{confidencePct}%</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500 block">Execution Horizon:</span>
                <span className="text-xs font-bold text-slate-900 mt-0.5 block flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-blue-500" />
                  {recommendation.execution_horizon || 'Immediate (0-30 Days)'}
                </span>
              </div>
              <Award className="w-6 h-6 text-blue-500/30" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-600/30"
          >
            Done Reviewing
          </button>
        </div>
      </div>
    </div>
  );
}
