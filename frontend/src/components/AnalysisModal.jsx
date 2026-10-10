import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Plus, 
  Trash2, 
  Globe, 
  FileText, 
  Database, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Building2,
  Swords,
  Layers,
  ArrowRight
} from 'lucide-react';
import { fetchPresets, testExtractUrl } from '../services/api';

export default function AnalysisModal({ isOpen, onClose, onRunAnalysis, isAnalyzing }) {
  const [activeTab, setActiveTab] = useState('preset'); // 'preset' or 'custom'
  const [presets, setPresets] = useState([]);
  const [selectedPresetId, setSelectedPresetId] = useState('retail_tech');
  
  // Custom form fields
  const [companyName, setCompanyName] = useState('ShelfEdge AI');
  const [competitor1, setCompetitor1] = useState('Trax Retail');
  const [competitor2, setCompetitor2] = useState('Standard AI');
  const [industry, setIndustry] = useState('Retail Automation & Computer Vision');
  const [urls, setUrls] = useState(['https://www.retaildive.com/news/trax-retail-smart-shelf-compliance-expansion-2025/710294/']);
  const [sourcesText, setSourcesText] = useState('');
  
  // URL test fetch state
  const [testingUrl, setTestingUrl] = useState(false);
  const [urlTestResult, setUrlTestResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadPresetsList();
    }
  }, [isOpen]);

  const loadPresetsList = async () => {
    try {
      const data = await fetchPresets();
      setPresets(data);
    } catch (e) {
      console.warn("Could not load presets list:", e);
    }
  };

  if (!isOpen) return null;

  const handleAddUrl = () => {
    setUrls([...urls, '']);
  };

  const handleUrlChange = (index, value) => {
    const updated = [...urls];
    updated[index] = value;
    setUrls(updated);
  };

  const handleRemoveUrl = (index) => {
    const updated = urls.filter((_, i) => i !== index);
    setUrls(updated);
  };

  const handleTestUrl = async (url) => {
    if (!url || !url.trim()) return;
    setTestingUrl(true);
    setUrlTestResult(null);
    setErrorMsg('');
    try {
      const res = await testExtractUrl(url.trim());
      setUrlTestResult(res);
    } catch (err) {
      setErrorMsg(`URL Test failed: ${err.message}`);
    } finally {
      setTestingUrl(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (activeTab === 'preset') {
      const preset = presets.find(p => p.id === selectedPresetId);
      onRunAnalysis({
        company_name: preset ? preset.company_name : 'ShelfEdge AI',
        competitor_names: preset ? preset.competitor_names : ['Trax Retail', 'Standard AI'],
        industry: preset ? preset.industry : 'Retail Automation',
        use_sample_data: true,
        sample_dataset_id: selectedPresetId,
        sources_text: '',
        sources_urls: []
      });
    } else {
      if (!companyName.trim()) {
        setErrorMsg('Please specify target company name.');
        return;
      }
      if (!competitor1.trim()) {
        setErrorMsg('Please specify at least Competitor 1.');
        return;
      }

      const validUrls = urls.filter(u => u && u.trim().length > 0);
      const competitors = [competitor1.trim()];
      if (competitor2.trim()) competitors.push(competitor2.trim());

      onRunAnalysis({
        company_name: companyName.trim(),
        competitor_names: competitors,
        industry: industry.trim() || 'General Enterprise',
        use_sample_data: false,
        sample_dataset_id: null,
        sources_text: sourcesText.trim(),
        sources_urls: validUrls
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#0B132B] to-[#1C2541] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Configure Corporate Intelligence Run</h2>
              <p className="text-xs text-slate-300">Choose verified hackathon benchmarks or enter live company sources</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isAnalyzing}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('preset')}
            className={`pb-3 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'preset'
                ? 'border-blue-600 text-blue-600 bg-white rounded-t-lg border-t border-x border-slate-200 -mb-px'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Pre-Verified Benchmark Presets (Recommended for Judges)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('custom')}
            className={`pb-3 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'custom'
                ? 'border-blue-600 text-blue-600 bg-white rounded-t-lg border-t border-x border-slate-200 -mb-px'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Custom Live Research (URLs & Text)</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {activeTab === 'preset' ? (
            <div className="space-y-4">
              <div className="text-xs text-slate-600 bg-blue-50 border border-blue-200 p-3 rounded-xl flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-blue-900">High-Fidelity Benchmark Datasets:</span>
                  <p className="text-blue-800 mt-0.5">
                    Preloaded with verified real-world press releases, competitor metrics, and market dynamics. Perfect for evaluating the 4-agent synthesis without web-scraping latency or API key setup.
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                {presets.map((preset) => (
                  <label
                    key={preset.id}
                    className={`block p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedPresetId === preset.id
                        ? 'border-blue-500 bg-blue-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="presetChoice"
                          value={preset.id}
                          checked={selectedPresetId === preset.id}
                          onChange={() => setSelectedPresetId(preset.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300"
                        />
                        <div>
                          <p className="text-sm font-bold text-slate-900">{preset.name}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{preset.description}</p>
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        {preset.industry}
                      </span>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-600">
                      <span className="font-medium text-blue-700">Target: {preset.company_name}</span>
                      <span>vs</span>
                      <span className="font-medium text-slate-700">{preset.competitor_names.join(', ')}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Companies Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. ShelfEdge AI"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Competitor 1 *
                  </label>
                  <input
                    type="text"
                    required
                    value={competitor1}
                    onChange={(e) => setCompetitor1(e.target.value)}
                    placeholder="e.g. Trax Retail"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Competitor 2 (Optional)
                  </label>
                  <input
                    type="text"
                    value={competitor2}
                    onChange={(e) => setCompetitor2(e.target.value)}
                    placeholder="e.g. Standard AI"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Industry / Category
                </label>
                <input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="e.g. Retail Computer Vision & Smart Shelves"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Public URLs */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-blue-600" />
                    <span>Public Article & Press Release URLs</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAddUrl}
                    className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add URL</span>
                  </button>
                </div>
                
                <div className="space-y-2">
                  {urls.map((url, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => handleUrlChange(idx, e.target.value)}
                        placeholder="https://techcrunch.com/news/article-headline..."
                        className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-mono"
                      />
                      {url && (
                        <button
                          type="button"
                          onClick={() => handleTestUrl(url)}
                          disabled={testingUrl}
                          className="px-2.5 py-1.5 text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-200 shrink-0"
                          title="Verify if this public URL is fetchable"
                        >
                          {testingUrl ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Test Fetch'}
                        </button>
                      )}
                      {urls.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveUrl(idx)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {urlTestResult && (
                  <div className={`mt-2 p-2.5 rounded-lg border text-xs ${
                    urlTestResult.verified ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-amber-50 border-amber-200 text-amber-800'
                  }`}>
                    <p className="font-semibold flex items-center gap-1.5">
                      {urlTestResult.verified ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <AlertCircle className="w-3.5 h-3.5 text-amber-600" />}
                      <span>{urlTestResult.title}</span>
                    </p>
                    <p className="text-[11px] mt-1 opacity-90 line-clamp-2">{urlTestResult.snippet}</p>
                  </div>
                )}
              </div>

              {/* Text Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  <span>Direct Intelligence Notes or Press Text (Optional)</span>
                </label>
                <textarea
                  rows={3}
                  value={sourcesText}
                  onChange={(e) => setSourcesText(e.target.value)}
                  placeholder="Paste press releases, quarterly earnings excerpts, or product announcements..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isAnalyzing}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isAnalyzing}
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md shadow-blue-600/30 flex items-center gap-2 disabled:opacity-50 transition-all active:scale-[0.98]"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Orchestrating 4 Agents...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Run Intelligence Analysis</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
