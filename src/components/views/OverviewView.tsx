import React from 'react';
import {
  Users,
  Clock,
  CheckSquare,
  MailCheck,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Calendar,
  ShieldCheck,
  Plus,
  Activity,
  CheckCircle2,
  DollarSign,
} from 'lucide-react';
import { useOps } from '../../context/OpsContext';

interface OverviewViewProps {
  onOpenNewLead: () => void;
  onOpenNewTask: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ onOpenNewLead, onOpenNewTask }) => {
  const {
    leads,
    tasks,
    deadlines,
    drafts,
    activities,
    setActiveTab,
    setSelectedLeadId,
    setSelectedDraftId,
    toggleTask,
  } = useOps();

  const pendingDrafts = drafts.filter((d) => d.status === 'awaiting_approval');
  const activeTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);
  const completionRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  const urgentDeadlines = deadlines.filter((d) => d.status === 'due_soon' || d.urgency === 'High').slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Top Banner: Human Safety & Ops Readiness */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              Human-in-the-Loop Gateway
            </span>
            <span className="text-xs text-slate-400">Client Operations v2.4</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Executive Operations Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            InboxOps AI automatically ingests inbound client communications, parses deliverable requirements and deadlines, and prepares high-confidence drafts. Autonomous sending is strictly disabled.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setActiveTab('email-ingest')}
            className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>AI Email Extraction</span>
          </button>
          <button
            onClick={onOpenNewLead}
            className="px-3.5 py-2.5 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-xl text-xs transition-colors border border-white/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Leads */}
        <div
          onClick={() => setActiveTab('leads')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Active Client Pipeline</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 group-hover:bg-slate-200 transition-colors">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{leads.length}</span>
            <span className="text-xs text-teal-700 font-medium">Clients tracked</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 truncate">
            {leads.filter((l) => l.stage === 'in_progress').length} currently in progress
          </p>
        </div>

        {/* Card 2: Pending Human Approvals */}
        <div
          onClick={() => setActiveTab('reply-review')}
          className={`p-5 rounded-2xl border transition-all cursor-pointer group ${
            pendingDrafts.length > 0
              ? 'bg-amber-50/60 border-amber-200 hover:border-amber-300'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-700">Awaiting Human Approval</span>
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                pendingDrafts.length > 0
                  ? 'bg-amber-500 text-white font-bold'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              <MailCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span
              className={`text-2xl font-bold ${
                pendingDrafts.length > 0 ? 'text-amber-900' : 'text-slate-900'
              }`}
            >
              {pendingDrafts.length}
            </span>
            <span className="text-xs text-amber-800 font-semibold">Drafts pending review</span>
          </div>
          <p className="text-[11px] text-slate-600 mt-2">
            Requires human authorization before send
          </p>
        </div>

        {/* Card 3: Upcoming Deadlines */}
        <div
          onClick={() => setActiveTab('deadlines')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Upcoming Deadlines</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-700 group-hover:bg-teal-100 transition-colors">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{deadlines.length}</span>
            <span className="text-xs text-teal-700 font-semibold">Active milestones</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 truncate">
            {deadlines.filter((d) => d.urgency === 'High').length} marked as High Urgency
          </p>
        </div>

        {/* Card 4: Task Completion */}
        <div
          onClick={() => setActiveTab('tasks')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500">Task Velocity</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700 group-hover:bg-slate-200 transition-colors">
              <CheckSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{completionRate}%</span>
            <span className="text-xs text-slate-500">
              ({completedTasks.length}/{tasks.length} done)
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="bg-teal-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Priority Queues & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Approvals & Deadlines */}
        <div className="lg:col-span-2 space-y-6">
          {/* Priority Review Queue */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Email Drafts Requiring Human Approval</h2>
                  <p className="text-[11px] text-slate-500">Review AI-generated replies and authorize dispatch</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('reply-review')}
                className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1 cursor-pointer"
              >
                <span>View all ({drafts.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {pendingDrafts.length === 0 ? (
              <div className="p-6 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <CheckCircle2 className="w-8 h-8 text-teal-600 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-800">All Reply Drafts Approved or Dispatched</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Use the AI Ingestion Lab to extract new incoming emails.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingDrafts.slice(0, 3).map((draft) => (
                  <div
                    key={draft.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-900">{draft.company}</span>
                        <span className="text-slate-400">•</span>
                        <span className="text-xs text-slate-600">{draft.clientName}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold ml-auto sm:ml-0">
                          Awaiting Review
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-800 truncate">{draft.subject}</p>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-1">{draft.body}</p>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedDraftId(draft.id);
                        setActiveTab('reply-review');
                      }}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shrink-0 cursor-pointer transition-colors shadow-xs"
                    >
                      Review & Authorize
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Urgent Deadlines & Deliverables */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Critical Client Deadlines & Milestones</h2>
                  <p className="text-[11px] text-slate-500">Key dates extracted from client requirements</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('deadlines')}
                className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1 cursor-pointer"
              >
                <span>Calendar Matrix</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {urgentDeadlines.map((dl) => (
                <div
                  key={dl.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-bold text-slate-900 truncate">{dl.company || 'Client'}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                        {dl.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium truncate">{dl.description}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-bold text-slate-900 block text-xs">{dl.date}</span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full inline-block mt-0.5 ${
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
          </div>

          {/* Quick Active Tasks Preview */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center">
                  <CheckSquare className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Active Operational Tasks</h2>
                  <p className="text-[11px] text-slate-500">Deliverables assigned across engineering and ops</p>
                </div>
              </div>
              <button
                onClick={onOpenNewTask}
                className="text-xs font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Task</span>
              </button>
            </div>

            <div className="space-y-2">
              {activeTasks.slice(0, 4).map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className="p-3 rounded-xl border border-slate-200 hover:border-slate-300 transition-all flex items-center justify-between gap-3 text-xs cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => {}}
                      className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4 cursor-pointer"
                    />
                    <div className="min-w-0">
                      <p className="font-medium text-slate-900 truncate group-hover:text-teal-900">
                        {task.title}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {task.company} • Assigned to {task.assignee}
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded shrink-0">
                    Due {task.dueDate}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 col): Live Operations Feed & Quick Actions */}
        <div className="space-y-6">
          {/* Quick Actions Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Operations Quick Actions
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => setActiveTab('email-ingest')}
                className="w-full p-3 rounded-xl bg-teal-50 hover:bg-teal-100/70 border border-teal-200 text-teal-900 font-semibold text-xs flex items-center justify-between transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-teal-700" />
                  <span>Parse Client Email with AI</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-teal-700" />
              </button>

              <button
                onClick={onOpenNewLead}
                className="w-full p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-semibold text-xs flex items-center justify-between transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-slate-600" />
                  <span>Register Client Lead</span>
                </div>
                <Plus className="w-3.5 h-3.5 text-slate-500" />
              </button>

              <button
                onClick={onOpenNewTask}
                className="w-full p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-semibold text-xs flex items-center justify-between transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <CheckSquare className="w-4 h-4 text-slate-600" />
                  <span>Create Operational Task</span>
                </div>
                <Plus className="w-3.5 h-3.5 text-slate-500" />
              </button>
            </div>
          </div>

          {/* Activity Timeline Mini */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-teal-600" />
                <h3 className="text-sm font-bold text-slate-900">Audit & Activity Log</h3>
              </div>
              <button
                onClick={() => setActiveTab('activity')}
                className="text-xs font-semibold text-teal-700 hover:text-teal-900"
              >
                Full Trail
              </button>
            </div>

            <div className="space-y-4">
              {activities.slice(0, 5).map((act) => (
                <div key={act.id} className="relative pl-5 pb-1 border-l-2 border-slate-200 text-xs">
                  <div className="absolute -left-[5px] top-0.5 w-2 h-2 rounded-full bg-teal-500 ring-2 ring-white" />
                  <div className="flex items-baseline justify-between gap-1 mb-0.5">
                    <span className="font-semibold text-slate-900 truncate">{act.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">{act.description}</p>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                    <span>{new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span>•</span>
                    <span className="font-medium text-slate-500">{act.actor}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
