import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Building2,
  Calendar,
  CheckSquare,
  Tag,
  ArrowRight,
  ExternalLink,
  DollarSign,
  AlertCircle,
} from 'lucide-react';
import { useOps } from '../../context/OpsContext';
import { LeadStage, PriorityLevel } from '../../types';

interface LeadsViewProps {
  onOpenNewLead: () => void;
}

export const LeadsView: React.FC<LeadsViewProps> = ({ onOpenNewLead }) => {
  const { leads, setSelectedLeadId, tasks, deadlines } = useOps();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.requirements.some((r) => r.toLowerCase().includes(searchQuery.toLowerCase())) ||
      lead.intent.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStage = selectedStage === 'all' || lead.stage === selectedStage;
    const matchesPriority = selectedPriority === 'all' || lead.priority === selectedPriority;

    return matchesSearch && matchesStage && matchesPriority;
  });

  const stageTabs: { id: string; label: string }[] = [
    { id: 'all', label: 'All Leads' },
    { id: 'new_inquiry', label: 'New Inquiry' },
    { id: 'scoping', label: 'Scoping' },
    { id: 'proposal_sent', label: 'Proposal Sent' },
    { id: 'in_progress', label: 'In Progress' },
    { id: 'closed_won', label: 'Closed-Won' },
  ];

  const getStageColor = (stage: LeadStage) => {
    switch (stage) {
      case 'new_inquiry':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'scoping':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'proposal_sent':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'in_progress':
        return 'bg-teal-50 text-teal-800 border-teal-200';
      case 'closed_won':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Client Operations & Leads Pipeline</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage incoming prospects, scoping requirements, deliverable agreements, and active clients.
          </p>
        </div>

        <button
          onClick={onOpenNewLead}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Client Lead</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by client, organization, or requirement keywords..."
              className="w-full text-xs pl-9 pr-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-slate-50/50"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="text-xs px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-700 focus:outline-none"
            >
              <option value="all">All Priorities</option>
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>
        </div>

        {/* Stage Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 border-t border-slate-100">
          {stageTabs.map((tab) => {
            const count =
              tab.id === 'all'
                ? leads.length
                : leads.filter((l) => l.stage === tab.id).length;
            const isActive = selectedStage === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setSelectedStage(tab.id)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-slate-900 text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-slate-700 text-slate-200' : 'bg-slate-200/70 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Leads Grid */}
      {filteredLeads.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <Users className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-900">No client leads match your filters</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search terms or register a new client using the Add Client Lead button.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLeads.map((lead) => {
            const leadTasks = tasks.filter((t) => t.leadId === lead.id || t.company === lead.company);
            const leadDeadlines = deadlines.filter((d) => d.leadId === lead.id || d.company === lead.company);

            return (
              <div
                key={lead.id}
                onClick={() => setSelectedLeadId(lead.id)}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  {/* Top Bar: Company & Badges */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-slate-900 group-hover:text-teal-700 transition-colors truncate">
                      {lead.company}
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {lead.isDemo && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                          Demo
                        </span>
                      )}
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${getStageColor(
                          lead.stage
                        )}`}
                      >
                        {lead.stage.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <h3 className="text-sm font-bold text-slate-900">{lead.name}</h3>
                  <p className="text-xs text-slate-500 mb-3 truncate">
                    {lead.role} • {lead.email}
                  </p>

                  {/* Budget & Intent */}
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs mb-3 space-y-1">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-500">Budget:</span>
                      <span className="font-semibold text-slate-900">{lead.budget}</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-500">Priority:</span>
                      <span
                        className={`font-semibold flex items-center gap-1 ${
                          lead.priority === 'High'
                            ? 'text-rose-600'
                            : lead.priority === 'Medium'
                            ? 'text-amber-600'
                            : 'text-slate-600'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            lead.priority === 'High'
                              ? 'bg-rose-500'
                              : lead.priority === 'Medium'
                              ? 'bg-amber-500'
                              : 'bg-slate-400'
                          }`}
                        />
                        {lead.priority}
                      </span>
                    </div>
                  </div>

                  {/* Requirements Snippet */}
                  <div className="space-y-1 mb-4">
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-700">
                      <Tag className="w-3 h-3 text-teal-600" />
                      <span>Requirements ({lead.requirements.length})</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {lead.requirements.slice(0, 2).map((req, i) => (
                        <span
                          key={i}
                          className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md truncate max-w-[200px]"
                          title={req}
                        >
                          {req}
                        </span>
                      ))}
                      {lead.requirements.length > 2 && (
                        <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md">
                          +{lead.requirements.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer: Deadlines, Tasks count & Open action */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{leadDeadlines.length} Milestones</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckSquare className="w-3.5 h-3.5 text-slate-400" />
                      <span>{leadTasks.length} Tasks</span>
                    </span>
                  </div>

                  <span className="text-teal-700 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5 text-xs">
                    View
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
