import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { BarChart3, Info } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const rawData = payload[0].payload;
    return (
      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-700 max-w-xs text-xs">
        <p className="font-bold text-sm text-blue-400 mb-1.5">{label}</p>
        <div className="space-y-1 mb-2">
          {payload.map((item, index) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                <span className="text-slate-300">{item.name}:</span>
              </span>
              <span className="font-bold font-mono text-white">{item.value} / 100</span>
            </div>
          ))}
        </div>
        {rawData.metric_explanation && (
          <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
            <span className="font-semibold text-slate-300">Analysis: </span>
            {rawData.metric_explanation}
          </div>
        )}
      </div>
    );
  }
  return null;
};

export default function MetricCharts({ competitorData }) {
  if (!competitorData || !competitorData.metrics || competitorData.metrics.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center text-slate-400">
        No comparative benchmarking metrics available yet.
      </div>
    );
  }

  const { company_name, comp1_name, comp2_name, metrics } = competitorData;

  const chartData = metrics.map(m => ({
    metric: m.metric_name,
    [company_name]: m.company_score,
    [comp1_name]: m.comp1_score,
    [comp2_name]: m.comp2_score,
    metric_explanation: m.metric_explanation
  }));

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-600" />
            <span>Competitive Performance Benchmarks (0 - 100 Scale)</span>
          </h3>
          <p className="text-xs text-slate-500">
            Synthesized by Competitor Analysis Agent across key operational dimensions
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-blue-600"></span>
            <span className="font-semibold text-slate-900">{company_name}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-slate-400"></span>
            <span className="text-slate-600">{comp1_name}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-indigo-500"></span>
            <span className="text-slate-600">{comp2_name}</span>
          </div>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis 
              dataKey="metric" 
              tick={{ fontSize: 11, fill: '#64748B' }} 
              interval={0}
              angle={-10}
              textAnchor="end"
            />
            <YAxis 
              domain={[0, 100]} 
              tick={{ fontSize: 11, fill: '#64748B' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey={company_name} fill="#2563EB" radius={[4, 4, 0, 0]} maxBarSize={36} />
            <Bar dataKey={comp1_name} fill="#94A3B8" radius={[4, 4, 0, 0]} maxBarSize={36} />
            <Bar dataKey={comp2_name} fill="#6366F1" radius={[4, 4, 0, 0]} maxBarSize={36} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-500">
        <Info className="w-3.5 h-3.5 text-blue-500 shrink-0" />
        <span>Hover over individual bars to inspect the evidence-based rationale behind each quantitative score.</span>
      </div>
    </div>
  );
}
