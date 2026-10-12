import React, { useState } from 'react';
import {
  History,
  Mail,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Send,
  Users,
  AlertTriangle,
  Clock,
  Filter,
} from 'lucide-react';
import { useOps } from '../../context/OpsContext';
import { ActivityEvent } from '../../types';

export const ActivityView: React.FC = () => {
  const { activities } = useOps();
  const [filterType, setFilterType] = useState<string>('all');

  const filteredActivities = activities.filter((act) => {
    if (filterType === 'all') return true;
    if (filterType === 'human_approved') return act.type === 'human_approved' || act.type === 'email_sent';
    if (filterType === 'email') return act.type === 'email_ingested' || act.type === 'email_sent';
    if (filterType === 'tasks') return act.type === 'task_created' || act.type === 'task_completed';
    if (filterType === 'leads') return act.type === 'lead_created' || act.type === 'status_changed';
    return true;
  });

  const getEventIcon = (type: ActivityEvent['type']) => {
    switch (type) {
      case 'human_approved':
        return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
      case 'email_sent':
        return <Send className="w-4 h-4 text-teal-600" />;
      case 'email_ingested':
        return <Mail className="w-4 h-4 text-blue-600" />;
      case 'ai_extracted':
      case 'draft_generated':
        return <Sparkles className="w-4 h-4 text-purple-600" />;
      case 'task_completed':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'task_created':
        return <Clock className="w-4 h-4 text-amber-600" />;
      default:
        return <Users className="w-4 h-4 text-slate-600" />;
    }
  };

  const getEventBg = (type: ActivityEvent['type']) => {
    switch (type) {
      case 'human_approved':
      case 'task_completed':
        return 'bg-emerald-100 text-emerald-800';
      case 'email_sent':
        return 'bg-teal-100 text-teal-800';
      case 'email_ingested':
        return 'bg-blue-100 text-blue-800';
      case 'ai_extracted':
      case 'draft_generated':
        return 'bg-purple-100 text-purple-800';
      case 'task_created':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Activity Timeline & Operations Audit Trail
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Full compliance record of inbound messages, AI extraction events, human approval decisions, and client status updates.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto bg-white p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setFilterType('all')}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium cursor-pointer ${
              filterType === 'all' ? 'bg-slate-900 text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Activity
          </button>
          <button
            onClick={() => setFilterType('human_approved')}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium cursor-pointer ${
              filterType === 'human_approved' ? 'bg-teal-600 text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Human Approvals
          </button>
          <button
            onClick={() => setFilterType('email')}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium cursor-pointer ${
              filterType === 'email' ? 'bg-slate-900 text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Emails & Ingestion
          </button>
          <button
            onClick={() => setFilterType('tasks')}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium cursor-pointer ${
              filterType === 'tasks' ? 'bg-slate-900 text-white font-semibold' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Tasks Executed
          </button>
        </div>
      </div>

      {/* Timeline Stream */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        {filteredActivities.length === 0 ? (
          <div className="p-12 text-center">
            <History className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-700">No activity logged in this view</p>
          </div>
        ) : (
          <div className="space-y-6 relative before:absolute before:inset-0 before:left-4 before:w-0.5 before:bg-slate-200">
            {filteredActivities.map((act) => (
              <div key={act.id} className="relative flex items-start gap-4 group">
                {/* Node icon */}
                <div className="w-8 h-8 rounded-full bg-white border-2 border-slate-300 flex items-center justify-center shrink-0 z-10 group-hover:border-teal-500 transition-colors shadow-xs">
                  {getEventIcon(act.type)}
                </div>

                {/* Content */}
                <div className="flex-1 bg-slate-50/70 hover:bg-slate-50 border border-slate-200 p-4 rounded-xl transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{act.title}</span>
                      {act.badge && (
                        <span className={`text-[10px] px-2 py-0.2 rounded-full font-semibold ${getEventBg(act.type)}`}>
                          {act.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {new Date(act.timestamp).toLocaleString()}
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">{act.description}</p>

                  <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center gap-3 text-[11px] text-slate-500">
                    <span>
                      Actor: <strong className="text-slate-700 font-medium">{act.actor}</strong>
                    </span>
                    {act.company && (
                      <>
                        <span>•</span>
                        <span>
                          Organization: <strong className="text-slate-700 font-medium">{act.company}</strong>
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
