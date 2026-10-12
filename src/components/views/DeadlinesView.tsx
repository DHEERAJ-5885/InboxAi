import React, { useState } from 'react';
import {
  CalendarClock,
  Plus,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Building2,
  Calendar,
  Tag,
  Check,
} from 'lucide-react';
import { useOps } from '../../context/OpsContext';
import { DeadlineItem, DeadlineType, DeadlineUrgency } from '../../types';

interface DeadlinesViewProps {
  onOpenNewDeadline: () => void;
}

export const DeadlinesView: React.FC<DeadlinesViewProps> = ({ onOpenNewDeadline }) => {
  const { deadlines, updateDeadlineStatus, setSelectedLeadId, leads } = useOps();
  const [filterType, setFilterType] = useState<string>('all');
  const [filterUrgency, setFilterUrgency] = useState<string>('all');

  const filteredDeadlines = deadlines.filter((d) => {
    const matchesType = filterType === 'all' || d.type === filterType;
    const matchesUrgency = filterUrgency === 'all' || d.urgency === filterUrgency;
    return matchesType && matchesUrgency;
  });

  const getDaysDiff = (dateStr: string) => {
    const target = new Date(dateStr);
    const now = new Date();
    // Normalize to date only
    target.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const dueSoon = filteredDeadlines.filter((d) => {
    const days = getDaysDiff(d.date);
    return days <= 4 && days >= 0;
  });

  const upcoming = filteredDeadlines.filter((d) => {
    const days = getDaysDiff(d.date);
    return days > 4;
  });

  const pastOrDone = filteredDeadlines.filter((d) => {
    const days = getDaysDiff(d.date);
    return days < 0 || d.status === 'completed';
  });

  const renderDeadlineCard = (item: DeadlineItem) => {
    const days = getDaysDiff(item.date);
    const isCompleted = item.status === 'completed';

    return (
      <div
        key={item.id}
        className={`p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
          isCompleted
            ? 'bg-slate-50 border-slate-200 opacity-70'
            : days <= 2
            ? 'bg-rose-50/50 border-rose-200 hover:border-rose-300'
            : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
        }`}
      >
        <div>
          <div className="flex items-start justify-between gap-2 mb-2">
            <span className="text-xs font-bold text-slate-900 truncate">
              {item.company || 'Client Operation'}
            </span>
            <div className="flex items-center gap-1.5 shrink-0">
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                  item.urgency === 'High'
                    ? 'bg-rose-100 text-rose-800'
                    : item.urgency === 'Medium'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {item.urgency}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                {item.type}
              </span>
            </div>
          </div>

          <p className="text-xs font-semibold text-slate-800 leading-snug">{item.description}</p>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-600">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-900">{item.date}</span>
            <span className="text-slate-400">•</span>
            <span
              className={`text-[11px] font-semibold ${
                days < 0
                  ? 'text-slate-400'
                  : days <= 2
                  ? 'text-rose-600'
                  : days <= 7
                  ? 'text-amber-600'
                  : 'text-teal-700'
              }`}
            >
              {days < 0 ? 'Passed' : days === 0 ? 'Due Today' : days === 1 ? 'Due Tomorrow' : `In ${days} days`}
            </span>
          </div>

          <button
            onClick={() =>
              updateDeadlineStatus(item.id, isCompleted ? 'upcoming' : 'completed')
            }
            className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
              isCompleted
                ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                : 'bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200'
            }`}
          >
            <Check className="w-3 h-3" />
            <span>{isCompleted ? 'Completed' : 'Mark Done'}</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Client Requirements & Milestones Schedule
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track key client commitments, hard delivery cutoffs, SOW review windows, and milestone sign-offs.
          </p>
        </div>

        <button
          onClick={onOpenNewDeadline}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Milestone</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <CalendarClock className="w-4 h-4 text-teal-600" />
          <span className="text-xs font-bold text-slate-900">Total Tracked: {deadlines.length}</span>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="text-xs px-3 py-1.5 border border-slate-300 rounded-lg bg-white text-slate-700"
          >
            <option value="all">All Types</option>
            <option value="Hard Deadline">Hard Deadline</option>
            <option value="Milestone">Milestone</option>
            <option value="Review Window">Review Window</option>
            <option value="Compliance">Compliance</option>
          </select>

          <select
            value={filterUrgency}
            onChange={(e) => setFilterUrgency(e.target.value)}
            className="text-xs px-3 py-1.5 border border-slate-300 rounded-lg bg-white text-slate-700"
          >
            <option value="all">All Urgencies</option>
            <option value="High">High Urgency</option>
            <option value="Medium">Medium Urgency</option>
            <option value="Low">Low Urgency</option>
          </select>
        </div>
      </div>

      {/* Group 1: Critical (Due Within 4 Days) */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-500" />
          <h2 className="text-sm font-bold text-slate-900">Critical & Due Soon ({dueSoon.length})</h2>
          <span className="text-[11px] text-slate-500">Requires immediate engineering / ops attention</span>
        </div>

        {dueSoon.length === 0 ? (
          <p className="text-xs text-slate-400 italic bg-white p-4 rounded-xl border border-slate-200">
            No critical deadlines due in the next 4 days.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {dueSoon.map(renderDeadlineCard)}
          </div>
        )}
      </div>

      {/* Group 2: Upcoming Milestones */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-teal-600" />
          <h2 className="text-sm font-bold text-slate-900">Upcoming Deliverable Milestones ({upcoming.length})</h2>
        </div>

        {upcoming.length === 0 ? (
          <p className="text-xs text-slate-400 italic bg-white p-4 rounded-xl border border-slate-200">
            No upcoming milestones in this filter.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {upcoming.map(renderDeadlineCard)}
          </div>
        )}
      </div>

      {/* Requirements Matrix Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Tag className="w-4 h-4 text-teal-600" />
          <span>Client Requirements Matrix by Account</span>
        </h3>

        <div className="space-y-4 divide-y divide-slate-100">
          {leads.map((lead) => (
            <div key={lead.id} className="pt-3 first:pt-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-900">{lead.company}</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-xs text-slate-600">{lead.name}</span>
                </div>
                <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                  {lead.requirements.length} deliverables tracked
                </span>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {lead.requirements.map((req, idx) => (
                  <li
                    key={idx}
                    className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 flex items-start gap-2"
                  >
                    <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
