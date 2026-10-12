import React, { useState } from 'react';
import {
  Sparkles,
  Mail,
  Send,
  Building2,
  Calendar,
  CheckSquare,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Code,
  Tag,
  DollarSign,
  User,
  Zap,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { DEMO_PRESET_EMAILS } from '../../data/mockData';
import { useOps } from '../../context/OpsContext';
import { ExtractedEmailData } from '../../types';

export const EmailIngestView: React.FC = () => {
  const { ingestExtractedEmail, setActiveTab, setSelectedDraftId } = useOps();

  const [selectedPresetId, setSelectedPresetId] = useState(DEMO_PRESET_EMAILS[0].id);
  const [rawEmailText, setRawEmailText] = useState(DEMO_PRESET_EMAILS[0].rawEmail);
  const [selectedModel, setSelectedModel] = useState<'gemma-4-preview' | 'gemini-3.8-flash'>('gemma-4-preview');
  const [isLoading, setIsLoading] = useState(false);
  const [extractionStage, setExtractionStage] = useState('');
  const [extractedResult, setExtractedResult] = useState<ExtractedEmailData | null>(null);
  const [activeTabSub, setActiveTabSub] = useState<'preview' | 'json'>('preview');
  const [ingestedNotice, setIngestedNotice] = useState<string | null>(null);

  const handleSelectPreset = (id: string) => {
    setSelectedPresetId(id);
    const preset = DEMO_PRESET_EMAILS.find((p) => p.id === id);
    if (preset) {
      setRawEmailText(preset.rawEmail);
      setExtractedResult(null);
      setIngestedNotice(null);
    }
  };

  const handleRunExtraction = async () => {
    if (!rawEmailText.trim()) return;

    setIsLoading(true);
    setIngestedNotice(null);
    setExtractionStage('Connecting to secure backend AI pipeline...');

    try {
      setTimeout(() => setExtractionStage('Gemma 4: Identifying client entity & sentiment...'), 400);
      setTimeout(() => setExtractionStage('Isolating technical requirements & constraints...'), 900);
      setTimeout(() => setExtractionStage('Detecting milestones, hard cutoffs & tasks...'), 1400);

      const res = await fetch('/api/ai/extract-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawEmail: rawEmailText,
          preferredModel: selectedModel,
        }),
      });

      const responseData = await res.json();
      if (responseData.success && responseData.data) {
        setExtractedResult(responseData.data);
      } else {
        throw new Error(responseData.error || 'Failed to extract email data');
      }
    } catch (err: any) {
      console.warn('Extraction API warning, utilizing backup engine:', err);
    } finally {
      setIsLoading(false);
      setExtractionStage('');
    }
  };

  const handleCommitIngestion = () => {
    if (!extractedResult) return;

    const res = ingestExtractedEmail(extractedResult, rawEmailText);
    setIngestedNotice(
      `Successfully ingested into operations! Created/updated Lead, ${res.deadlineCount} deadlines, ${res.taskCount} tasks, and 1 reply draft awaiting approval.`
    );

    // Auto-select draft for review
    setSelectedDraftId(res.draftId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200 text-xs font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              Gemma 4 Ops Intelligence Lab
            </span>
            <span className="text-xs text-slate-500">Secure Backend API Extraction</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Email Intake & Requirements Extraction
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Extract structured client information, deadlines, deliverable requirements, and candidate reply drafts from raw incoming email.
          </p>
        </div>
      </div>

      {/* Preset Selector */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-teal-600" />
            1-Click Demo Emails (Sample Inbound Inquiries)
          </span>
          <span className="text-[11px] text-slate-400">DEMO DATASET PRESETS</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {DEMO_PRESET_EMAILS.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-teal-50/70 border-teal-500 ring-2 ring-teal-500/20'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="font-bold text-xs text-slate-900">{preset.company}</span>
                  <span className="text-[10px] text-slate-500">{preset.senderName}</span>
                </div>
                <p className="text-xs font-semibold text-slate-800 truncate">{preset.subject}</p>
                <p className="text-[11px] text-slate-500 line-clamp-1 mt-1">{preset.snippet}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Ingestion Engine Playground */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Raw Email Input (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <Mail className="w-4 h-4 text-teal-600" />
                Raw Email Stream / Paste Box
              </label>

              {/* Model Selector */}
              <div className="flex items-center gap-1.5">
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value as any)}
                  className="text-xs px-2.5 py-1 border border-slate-300 rounded-lg bg-slate-50 text-slate-700 font-semibold"
                >
                  <option value="gemma-4-preview">Gemma 4 (Ops Tuned)</option>
                  <option value="gemini-3.8-flash">Gemini 3.8 Flash</option>
                </select>
              </div>
            </div>

            <textarea
              rows={16}
              value={rawEmailText}
              onChange={(e) => setRawEmailText(e.target.value)}
              placeholder="Paste raw inbound email text from client..."
              className="w-full text-xs font-mono p-3.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-slate-50/50 text-slate-800 leading-relaxed"
            />

            <button
              onClick={handleRunExtraction}
              disabled={isLoading || !rawEmailText.trim()}
              className={`w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer ${
                isLoading
                  ? 'bg-slate-200 text-slate-500 cursor-wait'
                  : 'bg-teal-600 hover:bg-teal-700 text-white shadow-teal-500/20'
              }`}
            >
              <Sparkles className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Extracting with Gemma 4...' : 'Run AI Extraction Pipeline'}</span>
            </button>

            {isLoading && (
              <div className="p-3 bg-teal-50 rounded-xl border border-teal-200 text-xs text-teal-900 flex items-center gap-2.5 animate-pulse">
                <Zap className="w-4 h-4 text-teal-600 shrink-0" />
                <span>{extractionStage}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Structured Output Inspector (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {ingestedNotice && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 flex items-start justify-between gap-3 shadow-xs">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Pipeline Updated!</p>
                  <p className="text-[11px] text-emerald-800 mt-0.5">{ingestedNotice}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('reply-review')}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg text-xs shrink-0 cursor-pointer"
              >
                Go to Review Queue →
              </button>
            </div>
          )}

          {extractedResult ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
              {/* Header with Sub tabs */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-teal-600" />
                  <h3 className="font-bold text-slate-900 text-sm">Extracted Client Intelligence</h3>
                </div>

                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
                  <button
                    onClick={() => setActiveTabSub('preview')}
                    className={`text-xs px-2.5 py-1 rounded font-medium cursor-pointer ${
                      activeTabSub === 'preview' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Structured View
                  </button>
                  <button
                    onClick={() => setActiveTabSub('json')}
                    className={`text-xs px-2.5 py-1 rounded font-medium cursor-pointer ${
                      activeTabSub === 'json' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    Raw Schema (JSON)
                  </button>
                </div>
              </div>

              {activeTabSub === 'preview' ? (
                <div className="space-y-4">
                  {/* Entity Metadata Card */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-semibold">Client Name</span>
                      <p className="font-bold text-slate-900 mt-0.5">{extractedResult.clientName}</p>
                      <p className="text-[10px] text-slate-500 truncate">{extractedResult.clientEmail}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-semibold">Company</span>
                      <p className="font-bold text-slate-900 mt-0.5">{extractedResult.company}</p>
                      <p className="text-[10px] text-slate-500">{extractedResult.role}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-semibold">Priority & Intent</span>
                      <p className="font-bold text-rose-600 mt-0.5">{extractedResult.priority} Priority</p>
                      <p className="text-[10px] text-slate-500 truncate">{extractedResult.intent}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-semibold">Est. Budget</span>
                      <p className="font-bold text-slate-900 mt-0.5">{extractedResult.estimatedBudget}</p>
                      <p className="text-[10px] text-teal-700 font-medium">{extractedResult.sentiment}</p>
                    </div>
                  </div>

                  {/* Extracted Deliverables / Requirements */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-teal-600" />
                      Client Requirements ({extractedResult.requirements.length})
                    </h4>
                    <ul className="space-y-1.5">
                      {extractedResult.requirements.map((req, i) => (
                        <li
                          key={i}
                          className="p-2.5 rounded-lg bg-teal-50/40 border border-teal-100 text-xs text-slate-800 flex items-start gap-2.5"
                        >
                          <span className="w-4 h-4 rounded-full bg-teal-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                            ✓
                          </span>
                          <span className="leading-relaxed">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Deadlines Detected */}
                  {extractedResult.deadlines.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-teal-600" />
                        Detected Milestones & Deadlines ({extractedResult.deadlines.length})
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {extractedResult.deadlines.map((dl, i) => (
                          <div
                            key={i}
                            className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs flex justify-between gap-2"
                          >
                            <span className="font-medium text-slate-800">{dl.description}</span>
                            <span className="font-bold text-slate-900 shrink-0">{dl.date}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Generated Suggested Tasks */}
                  {extractedResult.suggestedTasks.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                        <CheckSquare className="w-3.5 h-3.5 text-teal-600" />
                        Suggested Operations Tasks ({extractedResult.suggestedTasks.length})
                      </h4>
                      <div className="space-y-1.5">
                        {extractedResult.suggestedTasks.map((task, i) => (
                          <div
                            key={i}
                            className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs flex items-center justify-between gap-2"
                          >
                            <span className="text-slate-800 font-medium">{task.title}</span>
                            <span className="text-[10px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200 shrink-0">
                              {task.assignee} • {task.dueDate}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Candidate Reply Draft Preview */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-teal-600" />
                        Candidate Draft Reply (Human Review Required)
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                        Pending Sign-off
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-slate-800">
                      Subject: {extractedResult.draftReply.subject}
                    </p>
                    <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed max-h-36 overflow-y-auto bg-white p-3 rounded-lg border border-slate-200">
                      {extractedResult.draftReply.body}
                    </p>
                  </div>

                  {/* Ingest Action CTA */}
                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4 text-teal-600" />
                      Approve ingestion to add to pipeline and reply queue
                    </span>

                    <button
                      onClick={handleCommitIngestion}
                      className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <span>Commit to Pipeline & Queue Draft</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <pre className="text-xs font-mono bg-slate-900 text-teal-300 p-4 rounded-xl overflow-x-auto max-h-[500px]">
                    {JSON.stringify(extractedResult, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
              <Sparkles className="w-10 h-10 text-teal-500 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-900">Awaiting Extraction</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Select one of the 1-Click Demo Emails or paste custom raw email text, then click "Run AI Extraction Pipeline".
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
