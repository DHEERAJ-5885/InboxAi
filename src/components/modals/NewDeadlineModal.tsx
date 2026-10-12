import React, { useState } from 'react';
import { X, CalendarClock } from 'lucide-react';
import { useOps } from '../../context/OpsContext';
import { DeadlineType, DeadlineUrgency } from '../../types';

interface NewDeadlineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewDeadlineModal: React.FC<NewDeadlineModalProps> = ({ isOpen, onClose }) => {
  const { addDeadline, leads } = useOps();

  const [description, setDescription] = useState('');
  const [selectedLeadId, setSelectedLeadId] = useState(leads[0]?.id || '');
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [urgency, setUrgency] = useState<DeadlineUrgency>('High');
  const [type, setType] = useState<DeadlineType>('Hard Deadline');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !date) return;

    const lead = leads.find((l) => l.id === selectedLeadId);

    addDeadline({
      leadId: lead?.id,
      clientName: lead?.name,
      company: lead?.company,
      description: description.trim(),
      date,
      urgency,
      type,
      status: 'upcoming',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarClock className="w-5 h-5 text-teal-600" />
            <h3 className="font-bold text-slate-900 text-base">Schedule Client Milestone</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Milestone Description *</label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Milestone 2 Cutover Architecture Approval"
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Associated Client Lead</label>
            <select
              value={selectedLeadId}
              onChange={(e) => setSelectedLeadId(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white"
            >
              <option value="">General Project Deliverable</option>
              {leads.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.company} ({l.name})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Milestone Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as DeadlineType)}
                className="w-full text-xs px-2.5 py-2 border border-slate-300 rounded-lg bg-white"
              >
                <option value="Hard Deadline">Hard Deadline</option>
                <option value="Milestone">Milestone</option>
                <option value="Review Window">Review Window</option>
                <option value="Compliance">Compliance</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Urgency</label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as DeadlineUrgency)}
                className="w-full text-xs px-2.5 py-2 border border-slate-300 rounded-lg bg-white"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Due Date</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg"
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
              Save Milestone
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
