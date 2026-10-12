import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Menu,
  ShieldCheck,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Mail,
} from 'lucide-react';
import { useOps } from '../context/OpsContext';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { drafts, setActiveTab } = useOps();
  const pendingApprovalsCount = drafts.filter((d) => d.status === 'awaiting_approval').length;
  const [backendStatus, setBackendStatus] = useState<{
    healthy: boolean;
    activeModel: string;
    hasKey: boolean;
  }>({
    healthy: true,
    activeModel: 'Gemma 4 / Gemini',
    hasKey: false,
  });

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        setBackendStatus({
          healthy: data.status === 'healthy',
          activeModel: data.activeModel === 'gemini-3.8-flash' ? 'Gemini 3.8 Flash' : 'Gemma 4 Ops Engine',
          hasKey: data.aiConfigured,
        });
      })
      .catch(() => {
        // Dev fallback
      });
  }, []);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 sm:px-6 h-16">
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center text-teal-400 font-bold shadow-xs">
              <span className="text-lg tracking-tighter">IO</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-lg tracking-tight">InboxOps</span>
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                  AI Ops
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">Client Operations & Requirement Intelligence</p>
            </div>
          </div>
        </div>

        {/* Center: System Status Indicator */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-full border border-slate-200 text-xs text-slate-700">
            <Cpu className="w-3.5 h-3.5 text-teal-600" />
            <span className="text-slate-500">Model Engine:</span>
            <span className="font-medium text-slate-900">{backendStatus.activeModel}</span>
            <span className="inline-block w-2 h-2 rounded-full bg-teal-500 animate-pulse ml-0.5" />
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 bg-teal-50/60 rounded-full border border-teal-200/60 text-xs text-teal-900">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span className="font-medium">Human-in-the-Loop Enforced</span>
          </div>
        </div>

        {/* Right: Quick actions */}
        <div className="flex items-center gap-2.5">
          {pendingApprovalsCount > 0 && (
            <button
              onClick={() => setActiveTab('reply-review')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold hover:bg-amber-100 transition-colors cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>{pendingApprovalsCount} Draft{pendingApprovalsCount > 1 ? 's' : ''} Awaiting Review</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('email-ingest')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs hover:shadow-sm transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-100" />
            <span className="hidden sm:inline">AI Email Extraction</span>
            <span className="sm:hidden">Extract</span>
          </button>
        </div>
      </div>
    </header>
  );
};
