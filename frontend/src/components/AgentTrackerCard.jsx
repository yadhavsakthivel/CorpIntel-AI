import React from 'react';
import { 
  Bot, 
  CheckCircle2, 
  Clock, 
  Loader2, 
  AlertCircle, 
  Search, 
  TrendingUp, 
  Swords, 
  Target,
  ArrowRight
} from 'lucide-react';

export default function AgentTrackerCard({ statuses, isAnalyzing }) {
  const agentIcons = {
    'AGT-01': Search,
    'AGT-02': TrendingUp,
    'AGT-03': Swords,
    'AGT-04': Target,
  };

  const defaultAgents = [
    {
      agent_id: 'AGT-01',
      agent_name: '1. Research Agent',
      role_description: 'Extracts verifiable developments & captures evidence quotes',
      status: isAnalyzing ? 'running' : 'completed',
      execution_time_ms: 180,
      message: 'Ingested public disclosures and categorized factual data gaps.'
    },
    {
      agent_id: 'AGT-02',
      agent_name: '2. Market Intelligence Agent',
      role_description: 'Evaluates trends, opportunities, threats & tests assumptions',
      status: isAnalyzing ? 'pending' : 'completed',
      execution_time_ms: 220,
      message: 'Synthesized macro trends and differentiated evidence from hypotheses.'
    },
    {
      agent_id: 'AGT-03',
      agent_name: '3. Competitor Analysis Agent',
      role_description: 'Head-to-head benchmarking & flags unverified pricing as unknown',
      status: isAnalyzing ? 'pending' : 'completed',
      execution_time_ms: 260,
      message: 'Benchmarked 3 corporate profiles across key comparative metrics.'
    },
    {
      agent_id: 'AGT-04',
      agent_name: '4. Strategy Agent',
      role_description: 'Formulates prioritized strategic actions with risk matrices',
      status: isAnalyzing ? 'pending' : 'completed',
      execution_time_ms: 310,
      message: 'Generated prioritized recommendations linked to verified evidence.'
    }
  ];

  const displayAgents = statuses && statuses.length > 0 ? statuses : defaultAgents;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Multi-Agent Orchestration Pipeline</h3>
            <p className="text-xs text-slate-500">Sequential autonomous processing & evidence chain-of-custody</p>
          </div>
        </div>

        {isAnalyzing ? (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Orchestrating Pipeline...</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Total execution: {displayAgents.reduce((sum, a) => sum + (a.execution_time_ms || 0), 0)}ms</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {displayAgents.map((agent, idx) => {
          const Icon = agentIcons[agent.agent_id] || Bot;
          const isDone = agent.status === 'completed';
          const isRun = agent.status === 'running';
          const isFail = agent.status === 'failed';

          return (
            <div
              key={agent.agent_id || idx}
              className={`p-3.5 rounded-xl border transition-all ${
                isDone
                  ? 'border-emerald-200 bg-emerald-50/30'
                  : isRun
                  ? 'border-blue-400 bg-blue-50/50 shadow-xs ring-2 ring-blue-100'
                  : isFail
                  ? 'border-rose-200 bg-rose-50/40'
                  : 'border-slate-200 bg-slate-50/50 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-1.5 rounded-md ${
                  isDone ? 'bg-emerald-100 text-emerald-700' : isRun ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                
                {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                {isRun && <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />}
                {isFail && <AlertCircle className="w-4 h-4 text-rose-600" />}
                {!isDone && !isRun && !isFail && <span className="text-[10px] uppercase font-bold text-slate-400">Queue</span>}
              </div>

              <p className="text-xs font-bold text-slate-900 truncate">{agent.agent_name}</p>
              <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">
                {agent.role_description}
              </p>

              <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span className="capitalize font-semibold text-slate-700">{agent.status}</span>
                <span>{agent.execution_time_ms ? `${agent.execution_time_ms}ms` : '—'}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
