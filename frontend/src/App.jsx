import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  Sparkles, 
  AlertCircle, 
  Loader2, 
  CheckCircle2, 
  Database 
} from 'lucide-react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import AnalysisModal from './components/AnalysisModal';
import SourceModal from './components/SourceModal';
import RecommendationModal from './components/RecommendationModal';
import ExportModal from './components/ExportModal';
import AgentProgressModal from './components/AgentProgressModal';

import OverviewTab from './pages/OverviewTab';
import CompetitorsTab from './pages/CompetitorsTab';
import MarketTab from './pages/MarketTab';
import AgentsTab from './pages/AgentsTab';
import RecommendationsTab from './pages/RecommendationsTab';
import SettingsTab from './pages/SettingsTab';

import { fetchHealth, analyzeCompany, fetchPresetDetail } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [report, setReport] = useState(null);
  const [health, setHealth] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Modals
  const [analysisModalOpen, setAnalysisModalOpen] = useState(false);
  const [sourcesModalOpen, setSourcesModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [selectedRec, setSelectedRec] = useState(null);
  const [progressModalOpen, setProgressModalOpen] = useState(false);
  const [progressStep, setProgressStep] = useState(1);
  const [analyzingTarget, setAnalyzingTarget] = useState({ company: '', competitors: [] });

  useEffect(() => {
    initApp();
  }, []);

  const initApp = async () => {
    setIsLoading(true);
    try {
      const h = await fetchHealth();
      setHealth(h);

      // Load initial benchmark report so judges have immediate data on screen
      const initialReport = await analyzeCompany({
        company_name: 'ShelfEdge AI',
        competitor_names: ['Trax Retail', 'Standard AI'],
        industry: 'Retail Automation & Computer Vision',
        use_sample_data: true,
        sample_dataset_id: 'retail_tech'
      });
      setReport(initialReport);
    } catch (err) {
      console.warn("Initial load fallback triggered:", err.message);
      setErrorMsg(`Could not connect to backend server: ${err.message}. Please ensure the backend is running at http://localhost:8000.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshHealth = async () => {
    const h = await fetchHealth();
    setHealth(h);
  };

  const handleRunAnalysis = async (payload) => {
    setIsAnalyzing(true);
    setErrorMsg(null);
    setAnalysisModalOpen(false);
    setAnalyzingTarget({
      company: payload.company_name,
      competitors: payload.competitor_names
    });
    setProgressModalOpen(true);
    setProgressStep(1);

    // Progressive agent step progression timer
    const stepTimer = setInterval(() => {
      setProgressStep((prev) => (prev < 4 ? prev + 1 : prev));
    }, 650);

    try {
      const newReport = await analyzeCompany(payload);
      clearInterval(stepTimer);
      setProgressStep(5); // all completed
      // Brief pause to display completion state
      setTimeout(() => {
        setReport(newReport);
        setProgressModalOpen(false);
        setActiveTab('overview');
      }, 500);
    } catch (err) {
      clearInterval(stepTimer);
      setProgressModalOpen(false);
      setErrorMsg(`Analysis failed: ${err.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectRecommendation = (rec) => {
    setSelectedRec(rec);
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden text-slate-900 font-sans">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex shrink-0">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          report={report}
          health={health}
          onOpenNewAnalysis={() => setAnalysisModalOpen(true)}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-slate-900/60 backdrop-blur-xs">
          <div className="w-72 bg-[#0B132B] h-full flex flex-col shadow-2xl">
            <div className="p-4 flex justify-end">
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <Sidebar
              activeTab={activeTab}
              setActiveTab={(tab) => {
                setActiveTab(tab);
                setMobileSidebarOpen(false);
              }}
              report={report}
              health={health}
              onOpenNewAnalysis={() => {
                setAnalysisModalOpen(true);
                setMobileSidebarOpen(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header Bar */}
        <div className="lg:hidden bg-[#0B132B] text-white p-3.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="p-1 rounded-md text-slate-300 hover:text-white"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="font-bold text-sm tracking-tight">CorpIntel AI</span>
          </div>

          <button
            onClick={() => setAnalysisModalOpen(true)}
            className="px-2.5 py-1 text-xs font-semibold bg-blue-600 rounded-lg text-white"
          >
            New Run
          </button>
        </div>

        {/* Global Desktop Navbar */}
        <Navbar
          report={report}
          onOpenNewAnalysis={() => setAnalysisModalOpen(true)}
          onOpenSources={() => setSourcesModalOpen(true)}
          onExportReport={() => setExportModalOpen(true)}
        />

        {/* Scrollable View Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6">
          {errorMsg && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between gap-3 text-rose-800 text-xs shadow-xs">
              <div className="flex items-center gap-2.5">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
              <button
                onClick={() => setErrorMsg(null)}
                className="text-rose-600 hover:text-rose-800 font-bold"
              >
                Dismiss
              </button>
            </div>
          )}

          {isLoading ? (
            <div className="h-96 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-sm font-semibold text-slate-600">Booting CorpIntel AI Orchestration Engine...</p>
            </div>
          ) : (
            <>
              {activeTab === 'overview' && (
                <OverviewTab
                  report={report}
                  isAnalyzing={isAnalyzing}
                  onOpenSources={() => setSourcesModalOpen(true)}
                  onSelectRecommendation={handleSelectRecommendation}
                  setActiveTab={setActiveTab}
                />
              )}

              {activeTab === 'competitors' && (
                <CompetitorsTab 
                  competitorData={report?.competitor_data} 
                  isDemoMode={report?.is_demo_mode} 
                />
              )}

              {activeTab === 'market' && (
                <MarketTab marketData={report?.market_data} />
              )}

              {activeTab === 'agents' && (
                <AgentsTab report={report} />
              )}

              {activeTab === 'recommendations' && (
                <RecommendationsTab
                  strategyData={report?.strategy_data}
                  companyName={report?.company_name}
                  onSelectRecommendation={handleSelectRecommendation}
                />
              )}

              {activeTab === 'settings' && (
                <SettingsTab
                  health={health}
                  onRefreshHealth={handleRefreshHealth}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Global Modals */}
      <AnalysisModal
        isOpen={analysisModalOpen}
        onClose={() => setAnalysisModalOpen(false)}
        onRunAnalysis={handleRunAnalysis}
        isAnalyzing={isAnalyzing}
      />

      <SourceModal
        isOpen={sourcesModalOpen}
        onClose={() => setSourcesModalOpen(false)}
        sources={report?.sources}
      />

      <RecommendationModal
        isOpen={Boolean(selectedRec)}
        onClose={() => setSelectedRec(null)}
        recommendation={selectedRec}
        companyName={report?.company_name}
      />

      <ExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        report={report}
      />

      <AgentProgressModal
        isOpen={progressModalOpen}
        currentStep={progressStep}
        companyName={analyzingTarget.company || report?.company_name}
        competitors={analyzingTarget.competitors || report?.competitor_names}
      />
    </div>
  );
}
