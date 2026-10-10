import React from 'react';
import { 
  Bot, 
  Search, 
  TrendingUp, 
  Swords, 
  Target, 
  Loader2, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function AgentProgressModal({ isOpen, currentStep, companyName, competitors }) {
  if (!isOpen) return null;

  const steps = [
    {
      id: 1,
      name: 'Research Agent',
      icon: Search,
      action: 'Scraping public sources & extracting factual developments...',
      detail: 'Filtering corporate releases, verifying publication dates, and recording evidence citations.'
    },
    {
      id: 2,
      name: 'Market Intelligence Agent',
      icon: TrendingUp,
      action: 'Analyzing market signals & trends...',
      detail: 'Differentiating verified facts from market assumptions and scoring commercial impacts.'
    },
    {
      id: 3,
      name: 'Competitor Analysis Agent',
      icon: Swords,
      action: `Benchmarking ${companyName} vs ${competitors?.join(', ') || 'Competitors'}...`,
      detail: 'Evaluating products, positioning, and tagging unverified pricing as Unknown.'
    },
    {
      id: 4,
      name: 'Strategy Agent',
      icon: Target,
      action: 'Synthesizing actionable executive recommendations...',
      detail: 'Formulating prioritized moves with supporting evidence audit trails and risk mitigations.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-1.5">
          <div className="inline-flex p-3 rounded-2xl bg-blue-50 text-blue-600 mb-1 border border-blue-100 shadow-xs">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
            Multi-Agent Intelligence Orchestration
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Autonomous sequential pipeline analyzing <span className="font-semibold text-slate-800">{companyName}</span> against rivals
          </p>
        </div>

        {/* Steps List */}
        <div className="space-y-3">
          {steps.map((step) => {
            const Icon = step.icon;
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            const isPending = currentStep < step.id;

            return (
              <div
                key={step.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  isCurrent
                    ? 'border-blue-400 bg-blue-50/60 ring-2 ring-blue-100 shadow-xs'
                    : isCompleted
                    ? 'border-emerald-200 bg-emerald-50/40 text-slate-700'
                    : 'border-slate-200 bg-slate-50/50 text-slate-400 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      isCompleted 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : isCurrent 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-slate-200 text-slate-500'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-200/60 text-slate-700">
                          Step {step.id} of 4
                        </span>
                        <h4 className="text-xs font-bold text-slate-900">{step.name}</h4>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5 font-medium">
                        {isCompleted ? 'Completed' : step.action}
                      </p>
                    </div>
                  </div>

                  <div>
                    {isCompleted && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                    {isCurrent && <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />}
                    {isPending && <Clock className="w-4 h-4 text-slate-300" />}
                  </div>
                </div>

                {isCurrent && (
                  <div className="mt-2.5 pt-2 border-t border-blue-200/60 text-[11px] text-blue-900 leading-snug">
                    {step.detail}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-center text-[11px] text-slate-500">
          Enforcing Pydantic JSON schema validation and evidence chain-of-custody across all agents.
        </div>
      </div>
    </div>
  );
}
