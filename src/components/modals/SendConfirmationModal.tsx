import React, { useState } from 'react';
import { X, Send, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { ReplyDraft } from '../../types';

interface SendConfirmationModalProps {
  isOpen: boolean;
  draft: ReplyDraft | null;
  onClose: () => void;
  onConfirmSend: () => void;
}

export const SendConfirmationModal: React.FC<SendConfirmationModalProps> = ({
  isOpen,
  draft,
  onClose,
  onConfirmSend,
}) => {
  const [operatorInitials, setOperatorInitials] = useState('AM');
  const [confirmedChecked, setConfirmedChecked] = useState(false);
  const [sending, setSending] = useState(false);

  if (!isOpen || !draft) return null;

  const handleSend = () => {
    setSending(true);
    setTimeout(() => {
      setSending(false);
      onConfirmSend();
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Human Approval & Send Authorization</h3>
              <p className="text-[11px] text-slate-500">Autonomous sending disabled • Explicit authorization required</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Recipient:</span>
              <span className="font-semibold text-slate-900">{draft.clientName} &lt;{draft.clientEmail}&gt;</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Organization:</span>
              <span className="font-semibold text-slate-900">{draft.company}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Subject:</span>
              <span className="font-semibold text-slate-900 truncate max-w-[260px]">{draft.subject}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Draft Confidence:</span>
              <span className="font-semibold text-teal-700">{(draft.confidenceScore * 100).toFixed(0)}% AI Confidence</span>
            </div>
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Reviewer Checklist Reminder</p>
              <p className="text-[11px] text-amber-800 mt-0.5">{draft.notesForReviewer}</p>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={confirmedChecked}
                onChange={(e) => setConfirmedChecked(e.target.checked)}
                className="mt-0.5 rounded text-teal-600 focus:ring-teal-500 w-4 h-4 cursor-pointer"
              />
              <span>
                I verify that I have reviewed the tone, commitments, deadlines, and pricing in this draft, and approve it for transmission.
              </span>
            </label>

            <div className="flex items-center gap-3 pt-2">
              <span className="text-xs text-slate-600 font-medium">Authorized Operator:</span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={operatorInitials}
                  onChange={(e) => setOperatorInitials(e.target.value)}
                  className="w-16 text-xs px-2 py-1 border border-slate-300 rounded font-semibold text-center uppercase"
                  placeholder="Initials"
                />
                <span className="text-xs text-slate-500">(Alex Morgan - Ops Lead)</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={sending}
              className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!confirmedChecked || sending}
              onClick={handleSend}
              className={`px-4 py-2 rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                confirmedChecked && !sending
                  ? 'bg-teal-600 hover:bg-teal-700 text-white'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>{sending ? 'Transmitting Email...' : 'Authorize & Dispatch Email'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
