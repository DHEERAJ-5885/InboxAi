import React from 'react';
import { Database, RotateCcw, ShieldCheck } from 'lucide-react';
import { useOps } from '../context/OpsContext';

export const DemoBanner: React.FC = () => {
  const { resetToDemoData } = useOps();

  return (
    <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 font-semibold text-[11px]">
          <Database className="w-3 h-3" />
          DEMO DATASET ACTIVE
        </span>
        <span className="hidden sm:inline text-slate-600">
          Sample leads, requirements, and drafts are provided for preview. All changes persist in your session.
        </span>
        <span className="inline-flex items-center gap-1 text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded font-medium">
          <ShieldCheck className="w-3 h-3 text-teal-600" />
          Autonomous Send Disabled: Human Approval Required
        </span>
      </div>

      <button
        onClick={resetToDemoData}
        className="inline-flex items-center gap-1.5 text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-300 px-2.5 py-1 rounded transition-colors shadow-xs text-xs font-medium cursor-pointer"
        title="Reset mock leads, tasks, and drafts to default initial values"
      >
        <RotateCcw className="w-3 h-3 text-slate-500" />
        Reset Demo Data
      </button>
    </div>
  );
};
