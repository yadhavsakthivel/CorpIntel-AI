import React from 'react';
import { 
  LayoutDashboard, 
  Users2, 
  TrendingUp, 
  Bot, 
  Target, 
  Settings, 
  Sparkles,
  ShieldCheck,
  Building2,
  ChevronRight,
  Database
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, report, onOpenNewAnalysis, health }) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'competitors', label: 'Competitor Intelligence', icon: Users2, badge: report?.competitor_names?.length || 2 },
    { id: 'market', label: 'Market Insights', icon: TrendingUp, badge: report?.market_data?.signals?.length },
    { id: 'agents', label: 'AI Agents', icon: Bot, badge: '4' },
    { id: 'recommendations', label: 'Strategic Recommendations', icon: Target, badge: report?.strategy_data?.recommendations?.length },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-72 bg-[#0B132B] text-slate-200 flex flex-col shrink-0 border-r border-slate-800 select-none min-h-screen">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white font-bold text-lg">
            CI
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-white text-lg tracking-tight">CorpIntel</span>
              <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">AI</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium tracking-wide">ForgeHacks 2026 • AI + Business</p>
          </div>
        </div>

        {/* Quick Launch CTA */}
        <button
          onClick={onOpenNewAnalysis}
          className="mt-4 w-full py-2.5 px-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-blue-600/25 transition-all duration-150 active:scale-[0.98]"
        >
          <Sparkles className="w-4 h-4 text-blue-200" />
          <span>New Intelligence Run</span>
        </button>
      </div>

      {/* Monitored Subject Brief */}
      {report && (
        <div className="mx-4 my-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium mb-1.5">
            <span className="uppercase tracking-wider">Monitored Target</span>
            <Building2 className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <p className="text-sm font-bold text-white truncate">{report.company_name}</p>
          <p className="text-[11px] text-slate-400 truncate mt-0.5">{report.industry}</p>
          
          <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">vs Competitors:</span>
            <span className="text-slate-200 font-medium truncate max-w-[120px]">
              {report.competitor_names?.join(', ')}
            </span>
          </div>
        </div>
      )}

      {/* Nav Menu */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Intelligence Suite
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                  : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    isActive
                      ? 'bg-blue-700/80 text-blue-100'
                      : 'bg-slate-800 text-slate-400 border border-slate-700/50'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Backend Engine Status Footer */}
      <div className="p-3 m-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${health?.status === 'healthy' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`}></span>
            <span className="font-semibold text-slate-200 text-[11px]">
              {health?.ai_provider_configured ? 'Live AI Active' : 'Demo Dataset Mode'}
            </span>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
            v1.0
          </span>
        </div>
        <p className="text-[10px] text-slate-400 mt-1 truncate">
          {health?.ai_model || 'Demo Benchmark Engine'}
        </p>
      </div>
    </aside>
  );
}
