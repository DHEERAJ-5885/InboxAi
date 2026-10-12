export type LeadStage = 'new_inquiry' | 'scoping' | 'proposal_sent' | 'in_progress' | 'closed_won';
export type PriorityLevel = 'High' | 'Medium' | 'Low';
export type DeadlineUrgency = 'High' | 'Medium' | 'Low';
export type DeadlineType = 'Milestone' | 'Hard Deadline' | 'Review Window' | 'Compliance';
export type DeadlineStatus = 'upcoming' | 'due_soon' | 'completed' | 'at_risk';
export type DraftStatus = 'awaiting_approval' | 'approved' | 'rejected' | 'sent';

export interface DeadlineItem {
  id: string;
  leadId?: string;
  clientName?: string;
  company?: string;
  description: string;
  date: string;
  urgency: DeadlineUrgency;
  type: DeadlineType;
  status: DeadlineStatus;
}

export interface TaskItem {
  id: string;
  leadId?: string;
  clientName?: string;
  company?: string;
  title: string;
  assignee: string;
  priority: PriorityLevel;
  dueDate: string;
  completed: boolean;
  source: 'ai_extracted' | 'manual';
  createdAt: string;
}

export interface ReplyDraft {
  id: string;
  leadId?: string;
  clientName: string;
  clientEmail: string;
  company: string;
  subject: string;
  body: string;
  status: DraftStatus;
  confidenceScore: number;
  notesForReviewer: string;
  tone: 'consultative' | 'firm' | 'urgent' | 'warm';
  createdAt: string;
  approvedBy?: string;
  approvedAt?: string;
  sentAt?: string;
  auditLog?: string[];
  rejectionReason?: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  role: string;
  stage: LeadStage;
  priority: PriorityLevel;
  budget: string;
  intent: string;
  sentiment: string;
  requirements: string[];
  deadlines: DeadlineItem[];
  tasks: TaskItem[];
  createdAt: string;
  lastInteraction: string;
  isDemo?: boolean;
  notes?: string;
}

export interface ActivityEvent {
  id: string;
  timestamp: string;
  type:
    | 'email_ingested'
    | 'ai_extracted'
    | 'task_created'
    | 'task_completed'
    | 'draft_generated'
    | 'human_approved'
    | 'email_sent'
    | 'status_changed'
    | 'lead_created';
  title: string;
  description: string;
  actor: string;
  leadName?: string;
  company?: string;
  badge?: string;
}

export interface ExtractedEmailData {
  clientName: string;
  clientEmail: string;
  company: string;
  role: string;
  subject: string;
  intent: string;
  priority: PriorityLevel;
  estimatedBudget: string;
  sentiment: string;
  clientTone: string;
  requirements: string[];
  deadlines: Array<{
    description: string;
    date: string;
    urgency: DeadlineUrgency;
    type: DeadlineType;
  }>;
  suggestedTasks: Array<{
    title: string;
    assignee: string;
    priority: PriorityLevel;
    dueDate: string;
  }>;
  recommendedAction: string;
  draftReply: {
    subject: string;
    body: string;
    confidenceScore: number;
    notesForHumanReviewer: string;
  };
}
