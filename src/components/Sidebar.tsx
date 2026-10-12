import React from 'react';
import {
  LayoutDashboard,
  Users,
  CalendarClock,
  CheckSquare,
  MailCheck,
  Sparkles,
  History,
  ShieldCheck,
  X,
  ChevronRight,
  UserCheck,
} from 'lucide-react';
import { useOps } from '../context/OpsContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { activeTab, setActiveTab, leads, tasks, deadlines, drafts } = useOps();

  const pendingApprovalsCount = drafts.filter((d) => d.status === 'awaiting_approval').length;
  const pendingTasksCount = tasks.filter((t) => !t.completed).length;
  const upcomingDeadlinesCount = deadlines.filter((d) => d.status === 'upcoming' || d.status === 'due_soon').length;

  const navItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutDashboard,
      badge: null,
      description: 'Executive dashboard & KPIs',
    },
    {
      id: 'leads',
      label: 'Leads & Clients',
      icon: Users,
      badge: leads.length,
      badgeColor: 'bg-slate-100 text-slate-700',
      description: 'Pipeline & client requirements',
    },
    {
      id: 'deadlines',
      label: 'Requirements & Deadlines',
      icon: CalendarClock,
      badge: upcomingDeadlinesCount,
      badgeColor: 'bg-amber-100 text-amber-800',
      description: 'Milestones & deliverables schedule',
    },
    {
      id: 'tasks',
      label: 'Task Operations',
      icon: CheckSquare,
      badge: pendingTasksCount,
      badgeColor: 'bg-teal-100 text-teal-800',
      description: 'Operational work & assignees',
    },
    {
      id: 'reply-review',
      label: 'Reply Review Center',
      icon: MailCheck,
      badge: pendingApprovalsCount > 0 ? `${pendingApprovalsCount} pending` : null,
      badgeColor: 'bg-amber-500 text-white font-bold',
      highlight: pendingApprovalsCount > 0,
      description: 'Human approval queue for drafts',
    },
    {
      id: 'email-ingest',
      label: 'AI Ingestion Lab',
      icon: Sparkles,
      badge: 'Gemma 4',
      badgeColor: 'bg-teal-50 text-teal-700 border border-teal-300 font-semibold',
      description: 'Extract client specs & drafts',
    },
    {
      id: 'activity',
      label: 'Activity History',
      icon: History,
      badge: null,
      description: 'Audit trail of client actions',
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 z-40 md:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed md:sticky top-0 md:top-16 z-50 md:z-20 h-full md:h-[calc(100vh-4rem)] w-72 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Mobile Header in Drawer */}
        <div className="flex md:hidden items-center justify-between px-5 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-teal-400 font-bold text-sm">
              IO
            </div>
            <span className="font-bold text-slate-900">InboxOps AI</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section title */}
        <div className="px-5 pt-5 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-600">
          Operations Navigation
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  onClose();
                }}
                className={`w-full group flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left cursor-pointer ${
                  isActive
                    ? 'bg-teal-50/80 text-teal-900 font-semibold shadow-xs border-l-4 border-teal-600'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-teal-600' : 'text-slate-500 group-hover:text-slate-700'
                    }`}
                  />
                  <div className="truncate">
                    <span className="block truncate">{item.label}</span>
                  </div>
                </div>

                {item.badge !== null && item.badge !== undefined && (
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full shrink-0 ${
                      item.badgeColor || 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Human Operator Trust Panel */}
        <div className="p-4 mx-3 mb-3 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2 mb-1.5 text-xs font-semibold text-slate-900">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>Human In The Loop</span>
          </div>
          <p className="text-[11px] text-slate-700 leading-relaxed">
            AI extracts requirements and drafts replies. Emails are never dispatched without human authorization.
          </p>
        </div>

        {/* Operator Profile Card */}
        <div className="p-4 border-t border-slate-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-900 text-teal-300 flex items-center justify-center font-bold text-xs ring-2 ring-teal-500/30">
              AM
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900 truncate">Alex Morgan</span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-teal-500" />
              </div>
              <p className="text-[11px] text-slate-500 truncate">Ops Lead (Human Reviewer)</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
