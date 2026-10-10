import React from 'react';
import { X, Globe, CheckCircle2, AlertCircle, ExternalLink, Calendar, FileText } from 'lucide-react';

export default function SourceModal({ isOpen, onClose, sources }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden my-8">
        <div className="p-5 bg-gradient-to-r from-[#0B132B] to-[#1C2541] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold">Research Evidence & Sources Catalog</h2>
              <p className="text-xs text-slate-300">Audited public filings, press releases, and articles ingested into the Research Agent</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
          {(!sources || sources.length === 0) ? (
            <p className="text-center text-slate-400 text-sm py-8">No external sources ingested.</p>
          ) : (
            sources.map((src, idx) => (
              <div key={src.id || idx} className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white transition-all">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-100 text-blue-800">
                      {src.id}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {src.domain || 'Direct Input'}
                    </span>
                    {src.verified ? (
                      <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verified Public Page</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] text-amber-700 font-medium">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Access Restricted / Fallback</span>
                      </span>
                    )}
                  </div>

                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>{src.publication_date || 'Recent'}</span>
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 mt-2">{src.title}</h4>

                <div className="mt-2 p-3 bg-slate-50 rounded-lg border border-slate-200/80 text-xs text-slate-700 leading-relaxed italic">
                  "{src.snippet}"
                </div>

                {src.url && (
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-1 font-mono text-[11px] truncate max-w-lg"
                    >
                      <Globe className="w-3 h-3 shrink-0" />
                      <span className="truncate">{src.url}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg shadow-2xs"
          >
            Close Catalog
          </button>
        </div>
      </div>
    </div>
  );
}
