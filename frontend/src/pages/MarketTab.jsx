import React, { useState } from 'react';
import { 
  TrendingUp, 
  Lightbulb, 
  ShieldAlert, 
  Zap, 
  Radio, 
  CheckCircle2, 
  HelpCircle, 
  Clock,
  Filter
} from 'lucide-react';

export default function MarketTab({ marketData }) {
  const [filterType, setFilterType] = useState('all');

  if (!marketData) {
    return <div className="p-8 text-center text-slate-400">No market intelligence loaded.</div>;
  }

  const { market_summary, macro_trends, signals, assumptions_vs_evidence } = marketData;

  const filteredSignals = signals?.filter(s => {
    if (filterType === 'all') return true;
    return s.type === filterType;
  }) || [];

  const getSignalBadge = (type) => {
    switch (type) {
      case 'opportunity':
        return { label: 'Opportunity', bg: 'bg-emerald-100 text-emerald-800 border-emerald-300', icon: Lightbulb };
      case 'threat':
        return { label: 'Threat', bg: 'bg-rose-100 text-rose-800 border-rose-300', icon: ShieldAlert };
      case 'trend':
        return { label: 'Macro Trend', bg: 'bg-blue-100 text-blue-800 border-blue-300', icon: TrendingUp };
      default:
        return { label: 'Market Signal', bg: 'bg-indigo-100 text-indigo-800 border-indigo-300', icon: Radio };
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <span>Market Intelligence & Signal Radar</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Synthesized by the Market Intelligence Agent. Evaluates emerging competitive shifts while maintaining a strict evidentiary boundary between facts and industry assumptions.
        </p>

        <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
          <span className="font-bold text-slate-900 block mb-1">Prevailing Market Dynamics:</span>
          {market_summary}
        </div>
      </div>

      {/* Macro Structural Trends */}
      {macro_trends && macro_trends.length > 0 && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Macro Industry Catalysts</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {macro_trends.map((trend, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-amber-50/40 border border-amber-200/70 text-xs text-slate-700 flex items-start gap-2.5">
                <span className="font-mono font-bold text-amber-700 text-xs mt-0.5">#{i+1}</span>
                <span className="font-medium leading-relaxed">{trend}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Signals Section with Filter */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Radio className="w-4 h-4 text-blue-600" />
              <span>Identified Opportunities, Threats & Market Signals</span>
            </h3>
            <p className="text-xs text-slate-500">Classified by evidence status and commercial impact level</p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg text-xs">
            {['all', 'opportunity', 'threat', 'trend', 'market_signal'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-2.5 py-1 rounded-md font-semibold capitalize transition-all ${
                  filterType === type ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {type === 'all' ? 'All Signals' : type.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSignals.map((signal, idx) => {
            const badge = getSignalBadge(signal.type);
            const Icon = badge.icon;
            const isProven = signal.evidence_type === 'verified_evidence';

            return (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border flex items-center gap-1 ${badge.bg}`}>
                      <Icon className="w-3 h-3" />
                      <span>{badge.label}</span>
                    </span>

                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      signal.impact_level === 'critical'
                        ? 'bg-rose-100 text-rose-800 font-bold'
                        : signal.impact_level === 'high'
                        ? 'bg-amber-100 text-amber-800 font-bold'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {signal.impact_level} impact
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 mt-1">{signal.title}</h4>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{signal.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1">
                    {isProven ? (
                      <span className="flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Verified Evidence</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-indigo-700 font-semibold bg-indigo-50 px-2 py-0.5 rounded">
                        <HelpCircle className="w-3 h-3" />
                        <span>Forward Hypothesis</span>
                      </span>
                    )}
                  </div>

                  <span className="text-slate-400 font-mono text-[10px] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{signal.time_horizon?.replace('_', ' ')}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Assumptions vs Proven Evidence Table */}
      {assumptions_vs_evidence && assumptions_vs_evidence.length > 0 && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="mb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Evidence vs. Forward-Looking Assumptions Boundary</span>
            </h3>
            <p className="text-xs text-slate-500">
              Strict governance layer ensuring strategic choices are grounded in verifiable reality rather than hype.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70">
                  <th className="py-2.5 px-3 font-bold text-slate-700 w-1/4">Domain / Dimension</th>
                  <th className="py-2.5 px-3 font-bold text-emerald-800 bg-emerald-50/40 w-3/8">
                    Verified Public Evidence
                  </th>
                  <th className="py-2.5 px-3 font-bold text-indigo-800 bg-indigo-50/40 w-3/8">
                    Forward-Looking Hypothesis / Assumption
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80">
                {assumptions_vs_evidence.map((row, idx) => (
                  <tr key={idx}>
                    <td className="py-3 px-3 font-semibold text-slate-900">
                      {row.category}
                    </td>
                    <td className="py-3 px-3 text-emerald-900 bg-emerald-50/20 leading-relaxed">
                      {row.verified_evidence}
                    </td>
                    <td className="py-3 px-3 text-indigo-900 bg-indigo-50/20 leading-relaxed italic">
                      {row.forward_looking_hypothesis}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
