import React from 'react';
import { 
  Building2, 
  Sparkles, 
  Database, 
  Download, 
  ExternalLink, 
  Layers, 
  Calendar,
  ShieldCheck,
  FileText
} from 'lucide-react';

export default function Navbar({ report, onOpenNewAnalysis, onOpenSources, onExportReport }) {
  const isDemo = report?.is_demo_mode;

  return (
    <header className="bg-white border-b border-slate-200/80 px-6 py-3.5 sticky top-0 z-30 flex flex-wrap items-center justify-between gap-4">
      {/* Target Info */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Analysis Target:</span>
          <span className="text-base font-bold text-slate-900 flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-blue-600" />
            {report?.company_name || 'ShelfEdge AI'}
          </span>
        </div>

        <span className="text-slate-300">|</span>

        {/* Competitors Tagged */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-600">
          <span>vs</span>
          {report?.competitor_names?.map((c, i) => (
            <span key={i} className="px-2 py-0.5 rounded-full bg-slate-100 font-medium text-slate-700 border border-slate-200">
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Live vs Demo Badge */}
        {isDemo ? (
          <div 
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold shadow-xs"
            title={`Active Engine: ${report?.provider_used || 'Sample Benchmark'}`}
          >
            <Database className="w-3.5 h-3.5 text-amber-600" />
            <span>Sample Benchmark Mode</span>
          </div>
        ) : (
          <div 
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold shadow-xs"
            title={`Active Provider: ${report?.provider_used || 'Live AI'}`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Live AI Generated ({report?.provider_used})</span>
          </div>
        )}

        {/* Sources Button */}
        <button
          onClick={onOpenSources}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
          title="Inspect ingested sources and evidence citations"
        >
          <FileText className="w-3.5 h-3.5 text-slate-500" />
          <span>Sources ({report?.sources?.length || 0})</span>
        </button>

        {/* Export Report */}
        <button
          onClick={onExportReport}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors shadow-2xs"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Export Dossier</span>
        </button>

        {/* Trigger New Analysis */}
        <button
          onClick={onOpenNewAnalysis}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm shadow-blue-600/30 active:scale-[0.98]"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>New Run</span>
        </button>
      </div>
    </header>
  );
}
