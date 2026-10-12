import React, { useState } from 'react';
import { X, Building2, User, Mail, DollarSign, Tag } from 'lucide-react';
import { useOps } from '../../context/OpsContext';
import { PriorityLevel, LeadStage } from '../../types';

interface NewLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewLeadModal: React.FC<NewLeadModalProps> = ({ isOpen, onClose }) => {
  const { addLead } = useOps();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('Product / Tech Lead');
  const [stage, setStage] = useState<LeadStage>('new_inquiry');
  const [priority, setPriority] = useState<PriorityLevel>('High');
  const [budget, setBudget] = useState('$30,000 - $50,000');
  const [requirementsText, setRequirementsText] = useState('');
  const [intent, setIntent] = useState('New Client Project Scoping');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !company.trim()) return;

    const requirements = requirementsText
      .split('\n')
      .map((r) => r.trim())
      .filter(Boolean);

    addLead({
      name: name.trim(),
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@${company.toLowerCase().replace(/\s+/g, '')}.com`,
      company: company.trim(),
      role: role.trim(),
      stage,
      priority,
      budget,
      intent,
      sentiment: 'Collaborative & Inquiring',
      requirements: requirements.length > 0 ? requirements : ['Deliver initial architecture proposal and timeline estimation'],
      isDemo: false,
      notes: 'Manually created lead in InboxOps dashboard.',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-slate-900 text-base">Add New Client Lead</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Client Contact Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rachel Adams"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Company / Organization *</label>
              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Apex BioTech"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rachel@apexbio.com"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Role / Title</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. VP of Product"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Pipeline Stage</label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as LeadStage)}
                className="w-full text-xs px-2.5 py-2 border border-slate-300 rounded-lg bg-white"
              >
                <option value="new_inquiry">New Inquiry</option>
                <option value="scoping">Scoping</option>
                <option value="proposal_sent">Proposal Sent</option>
                <option value="in_progress">In Progress</option>
                <option value="closed_won">Closed-Won</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                className="w-full text-xs px-2.5 py-2 border border-slate-300 rounded-lg bg-white"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Budget Allocation</label>
              <input
                type="text"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="$40,000"
                className="w-full text-xs px-2.5 py-2 border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Client Requirements (one per line)
            </label>
            <textarea
              rows={3}
              value={requirementsText}
              onChange={(e) => setRequirementsText(e.target.value)}
              placeholder="e.g.&#10;Implement OAuth2 single sign-on&#10;Deliver architecture wireframes by Oct 30&#10;Support real-time data sync"
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-mono"
            />
          </div>

          <div className="pt-2 border-t border-slate-200 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-xs cursor-pointer"
            >
              Save Client Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
