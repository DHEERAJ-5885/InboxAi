import React, { useState } from 'react';
import {
  X,
  Building2,
  Mail,
  User,
  DollarSign,
  Calendar,
  CheckSquare,
  Sparkles,
  Plus,
  Trash2,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Tag,
  CheckCircle2,
} from 'lucide-react';
import { useOps } from '../../context/OpsContext';
import { LeadStage, PriorityLevel } from '../../types';

interface LeadDetailDrawerProps {
  leadId: string | null;
  onClose: () => void;
}

export const LeadDetailDrawer: React.FC<LeadDetailDrawerProps> = ({ leadId, onClose }) => {
  const {
    leads,
    updateLeadStage,
    updateLead,
    tasks,
    deadlines,
    drafts,
    toggleTask,
    addTask,
    addDeadline,
    setActiveTab,
    setSelectedDraftId,
  } = useOps();

  const [newRequirement, setNewRequirement] = useState('');
  const [showAddTask, setShowAddTask] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskAssignee, setTaskAssignee] = useState('Lead Engineer');
  const [taskDueDate, setTaskDueDate] = useState('');

  if (!leadId) return null;
  const lead = leads.find((l) => l.id === leadId);
  if (!lead) return null;

  const leadTasks = tasks.filter((t) => t.leadId === lead.id || t.company === lead.company);
  const leadDeadlines = deadlines.filter((d) => d.leadId === lead.id || d.company === lead.company);
  const leadDrafts = drafts.filter((d) => d.leadId === lead.id || d.company === lead.company);

  const stages: { id: LeadStage; label: string }[] = [
    { id: 'new_inquiry', label: 'New Inquiry' },
    { id: 'scoping', label: 'Scoping' },
    { id: 'proposal_sent', label: 'Proposal Sent' },
    { id: 'in_progress', label: 'In Progress' },
    { id: 'closed_won', label: 'Closed-Won' },
  ];

  const handleAddRequirement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRequirement.trim()) return;
    const updated = [...lead.requirements, newRequirement.trim()];
    updateLead(lead.id, { requirements: updated });
    setNewRequirement('');
  };

  const handleRemoveRequirement = (idx: number) => {
    const updated = lead.requirements.filter((_, i) => i !== idx);
    updateLead(lead.id, { requirements: updated });
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    addTask({
      leadId: lead.id,
      clientName: lead.name,
      company: lead.company,
      title: taskTitle.trim(),
      assignee: taskAssignee,
      priority: lead.priority,
      dueDate: taskDueDate || new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
      completed: false,
      source: 'manual',
    });
    setTaskTitle('');
    setShowAddTask(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-2xl bg-white shadow-2xl flex flex-col border-l border-slate-200">
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                  {lead.company}
                </span>
                {lead.isDemo && (
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                    DEMO DATA
                  </span>
                )}
                <span className="text-xs text-slate-500">Created {new Date(lead.createdAt).toLocaleDateString()}</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 truncate">{lead.name}</h2>
              <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                <span>{lead.role}</span>
                <span>•</span>
                <span className="text-slate-700 font-medium">{lead.email}</span>
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Stage Selector */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Pipeline Lifecycle Stage
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                {stages.map((s) => {
                  const isCurrent = lead.stage === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => updateLeadStage(lead.id, s.id)}
                      className={`text-xs py-2 px-1.5 rounded-lg font-medium text-center transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-teal-600 text-white font-semibold shadow-xs ring-2 ring-teal-500/30'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                      }`}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-500 font-medium">Estimated Budget</span>
                <p className="text-sm font-bold text-slate-900 mt-0.5">{lead.budget || 'Not specified'}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-500 font-medium">Priority</span>
                <p className="text-sm font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      lead.priority === 'High' ? 'bg-rose-500' : lead.priority === 'Medium' ? 'bg-amber-500' : 'bg-slate-400'
                    }`}
                  />
                  {lead.priority}
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-500 font-medium">Detected Intent</span>
                <p className="text-xs font-semibold text-slate-900 mt-0.5 truncate" title={lead.intent}>
                  {lead.intent || 'General Inquiry'}
                </p>
              </div>
            </div>

            {/* Client Requirements List */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-teal-600" />
                  <h3 className="text-sm font-bold text-slate-900">Extracted Client Requirements</h3>
                  <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-semibold">
                    {lead.requirements.length}
                  </span>
                </div>
              </div>

              {lead.requirements.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-2">No requirements recorded yet.</p>
              ) : (
                <ul className="space-y-2 mb-4">
                  {lead.requirements.map((req, idx) => (
                    <li
                      key={idx}
                      className="group flex items-start justify-between gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800"
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 font-semibold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed">{req}</span>
                      </div>
                      <button
                        onClick={() => handleRemoveRequirement(idx)}
                        className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 transition-opacity p-1"
                        title="Remove requirement"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {/* Add requirement form */}
              <form onSubmit={handleAddRequirement} className="flex gap-2">
                <input
                  type="text"
                  value={newRequirement}
                  onChange={(e) => setNewRequirement(e.target.value)}
                  placeholder="Add custom client requirement or deliverable..."
                  className="flex-1 text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add
                </button>
              </form>
            </div>

            {/* Milestones & Deadlines */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-teal-600" />
                  <h3 className="text-sm font-bold text-slate-900">Deliverable Deadlines & Milestones</h3>
                  <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-semibold">
                    {leadDeadlines.length}
                  </span>
                </div>
              </div>

              {leadDeadlines.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-2">No deadlines tracked for this lead.</p>
              ) : (
                <div className="space-y-2">
                  {leadDeadlines.map((dl) => (
                    <div
                      key={dl.id}
                      className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <p className="font-semibold text-slate-900">{dl.description}</p>
                        <span className="text-slate-500 text-[11px]">{dl.type}</span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="font-bold text-slate-800 block">{dl.date}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                            dl.urgency === 'High'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {dl.urgency} Urgency
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Operational Tasks */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-teal-600" />
                  <h3 className="text-sm font-bold text-slate-900">Operational Tasks</h3>
                  <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-semibold">
                    {leadTasks.length}
                  </span>
                </div>
                <button
                  onClick={() => setShowAddTask(!showAddTask)}
                  className="text-xs text-teal-700 hover:text-teal-900 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Task
                </button>
              </div>

              {showAddTask && (
                <form onSubmit={handleCreateTask} className="mb-3 p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                  <input
                    type="text"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    placeholder="Task title (e.g. Prepare architecture diagram)"
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                    required
                  />
                  <div className="flex gap-2">
                    <select
                      value={taskAssignee}
                      onChange={(e) => setTaskAssignee(e.target.value)}
                      className="text-xs px-2 py-1 border border-slate-300 rounded bg-white flex-1"
                    >
                      <option value="Lead Engineer">Lead Engineer</option>
                      <option value="Project Lead">Project Lead</option>
                      <option value="Account Exec">Account Exec</option>
                      <option value="Operations Specialist">Operations Specialist</option>
                    </select>
                    <input
                      type="date"
                      value={taskDueDate}
                      onChange={(e) => setTaskDueDate(e.target.value)}
                      className="text-xs px-2 py-1 border border-slate-300 rounded bg-white flex-1"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1 bg-teal-600 text-white rounded text-xs font-semibold cursor-pointer"
                    >
                      Save
                    </button>
                  </div>
                </form>
              )}

              {leadTasks.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-2">No tasks assigned yet.</p>
              ) : (
                <div className="space-y-1.5">
                  {leadTasks.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => toggleTask(t.id)}
                      className={`p-2.5 rounded-lg border transition-all flex items-center justify-between gap-3 text-xs cursor-pointer ${
                        t.completed
                          ? 'bg-slate-50/60 border-slate-200 opacity-60'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <input
                          type="checkbox"
                          checked={t.completed}
                          onChange={() => {}}
                          className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4 cursor-pointer"
                        />
                        <span className={`truncate font-medium ${t.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                          {t.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] text-slate-500">{t.assignee}</span>
                        <span className="text-[10px] font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                          {t.dueDate}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Email Drafts Associated */}
            {leadDrafts.length > 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-teal-600" />
                    <h3 className="text-sm font-bold text-slate-900">Reply Drafts for Review</h3>
                  </div>
                </div>
                <div className="space-y-2">
                  {leadDrafts.map((d) => (
                    <div
                      key={d.id}
                      className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 truncate">{d.subject}</p>
                        <span className="text-[11px] text-slate-500">Status: {d.status.replace('_', ' ').toUpperCase()}</span>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedDraftId(d.id);
                          setActiveTab('reply-review');
                          onClose();
                        }}
                        className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-semibold rounded text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <span>Open Review</span>
                        <ExternalLink className="w-3 h-3 text-slate-500" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
