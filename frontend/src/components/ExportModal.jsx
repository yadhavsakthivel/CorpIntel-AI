import React from 'react';
import { X, Download, Printer, FileText, CheckCircle2 } from 'lucide-react';

export default function ExportModal({ isOpen, onClose, report }) {
  if (!isOpen || !report) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `CorpIntel_${report.company_name.replace(/\s+/g, '_')}_Dossier.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden my-8">
        <div className="p-5 bg-gradient-to-r from-[#0B132B] to-[#1C2541] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold">Export Corporate Intelligence Dossier</h2>
              <p className="text-xs text-slate-300">Executive Briefing & Competitive Audit Trail for {report.company_name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Preview */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-5 print:max-h-none text-slate-800">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-[11px] font-mono font-bold text-blue-600 uppercase tracking-wider">
              CONFIDENTIAL STRATEGIC INTELLIGENCE DOSSIER • {report.analysis_id}
            </span>
            <h1 className="text-xl font-black text-slate-900 mt-1">
              {report.company_name} — Competitive Audit & Strategic Analysis
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Audited against {report.competitor_names?.join(' & ')} • Generated {report.created_at}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1">
              Executive Briefing Synthesis
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
              {report.strategy_data?.executive_summary}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
              Prioritized Strategic Action Plan
            </h3>
            <div className="space-y-2">
              {report.strategy_data?.recommendations?.map((r, i) => (
                <div key={i} className="p-3 border border-slate-200 rounded-lg text-xs">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span>{r.id}: {r.title}</span>
                    <span className="text-[10px] uppercase px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded">
                      {r.priority}
                    </span>
                  </div>
                  <p className="text-slate-600 mt-1">{r.rationale}</p>
                  <p className="text-emerald-700 font-semibold mt-1">Payoff: {r.expected_benefit}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
              Audited Public Sources Catalog ({report.sources?.length})
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-600">
              {report.sources?.map((s, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="font-mono text-slate-400">[{s.id}]</span>
                  <span>{s.title} ({s.domain}, {s.publication_date})</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Mode: {report.is_demo_mode ? 'Sample Benchmark' : 'Live AI Generation'}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg flex items-center gap-1.5 shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={handleDownloadJson}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-1.5 shadow-sm shadow-blue-600/30"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download JSON</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
