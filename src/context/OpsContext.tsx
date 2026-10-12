import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Lead,
  TaskItem,
  DeadlineItem,
  ReplyDraft,
  ActivityEvent,
  ExtractedEmailData,
  DeadlineStatus,
} from '../types';
import {
  INITIAL_LEADS,
  INITIAL_TASKS,
  INITIAL_DRAFTS,
  INITIAL_ACTIVITIES,
} from '../data/mockData';

interface OpsContextType {
  leads: Lead[];
  tasks: TaskItem[];
  deadlines: DeadlineItem[];
  drafts: ReplyDraft[];
  activities: ActivityEvent[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedLeadId: string | null;
  setSelectedLeadId: (id: string | null) => void;
  selectedDraftId: string | null;
  setSelectedDraftId: (id: string | null) => void;
  
  // Operations Actions
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'lastInteraction' | 'deadlines' | 'tasks'>) => Lead;
  updateLeadStage: (id: string, stage: Lead['stage']) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  
  addTask: (task: Omit<TaskItem, 'id' | 'createdAt'>) => TaskItem;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  
  addDeadline: (deadline: Omit<DeadlineItem, 'id'>) => DeadlineItem;
  updateDeadlineStatus: (id: string, status: DeadlineStatus) => void;
  
  updateDraftContent: (id: string, subject: string, body: string, notes?: string) => void;
  approveDraft: (id: string, approverName?: string) => void;
  sendApprovedDraft: (id: string) => void;
  rejectDraft: (id: string, reason: string) => void;
  createNewDraft: (draft: Omit<ReplyDraft, 'id' | 'createdAt'>) => ReplyDraft;
  
  ingestExtractedEmail: (extracted: ExtractedEmailData, rawEmail: string) => {
    leadId: string;
    draftId: string;
    taskCount: number;
    deadlineCount: number;
  };
  
  resetToDemoData: () => void;
}

const OpsContext = createContext<OpsContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'inboxops_v1_store';

export const OpsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Extract all deadlines from initial leads
  const initialDeadlines: DeadlineItem[] = INITIAL_LEADS.flatMap((l) => l.deadlines);

  const [leads, setLeads] = useState<Lead[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_leads`);
      return saved ? JSON.parse(saved) : INITIAL_LEADS;
    } catch {
      return INITIAL_LEADS;
    }
  });

  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_tasks`);
      return saved ? JSON.parse(saved) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  const [deadlines, setDeadlines] = useState<DeadlineItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_deadlines`);
      return saved ? JSON.parse(saved) : initialDeadlines;
    } catch {
      return initialDeadlines;
    }
  });

  const [drafts, setDrafts] = useState<ReplyDraft[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_drafts`);
      return saved ? JSON.parse(saved) : INITIAL_DRAFTS;
    } catch {
      return INITIAL_DRAFTS;
    }
  });

  const [activities, setActivities] = useState<ActivityEvent[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_activities`);
      return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
    } catch {
      return INITIAL_ACTIVITIES;
    }
  });

  const [activeTab, setActiveTab] = useState<string>('overview');
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [selectedDraftId, setSelectedDraftId] = useState<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_leads`, JSON.stringify(leads));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_tasks`, JSON.stringify(tasks));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_deadlines`, JSON.stringify(deadlines));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_drafts`, JSON.stringify(drafts));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_activities`, JSON.stringify(activities));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }, [leads, tasks, deadlines, drafts, activities]);

  const logActivity = (event: Omit<ActivityEvent, 'id' | 'timestamp'>) => {
    const newEvent: ActivityEvent = {
      ...event,
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
    };
    setActivities((prev) => [newEvent, ...prev]);
  };

  const addLead = (leadData: Omit<Lead, 'id' | 'createdAt' | 'lastInteraction' | 'deadlines' | 'tasks'>): Lead => {
    const now = new Date().toISOString();
    const newLead: Lead = {
      ...leadData,
      id: `lead-${Date.now()}`,
      deadlines: [],
      tasks: [],
      createdAt: now,
      lastInteraction: now,
    };

    setLeads((prev) => [newLead, ...prev]);
    logActivity({
      type: 'lead_created',
      title: `New Client Lead Created: ${newLead.name}`,
      description: `Added ${newLead.company} to pipeline at stage ${newLead.stage}.`,
      actor: 'Human Operator',
      leadName: newLead.name,
      company: newLead.company,
      badge: 'Lead Created',
    });
    return newLead;
  };

  const updateLeadStage = (id: string, stage: Lead['stage']) => {
    setLeads((prev) =>
      prev.map((l) => {
        if (l.id === id) {
          logActivity({
            type: 'status_changed',
            title: `Pipeline Stage Updated for ${l.company}`,
            description: `Moved from ${l.stage} to ${stage}.`,
            actor: 'Human Operator',
            leadName: l.name,
            company: l.company,
            badge: 'Stage Updated',
          });
          return { ...l, stage, lastInteraction: new Date().toISOString() };
        }
        return l;
      })
    );
  };

  const updateLead = (id: string, updates: Partial<Lead>) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, ...updates, lastInteraction: new Date().toISOString() } : l))
    );
  };

  const deleteLead = (id: string) => {
    const lead = leads.find((l) => l.id === id);
    setLeads((prev) => prev.filter((l) => l.id !== id));
    if (lead) {
      logActivity({
        type: 'status_changed',
        title: `Client Lead Removed: ${lead.name}`,
        description: `Deleted ${lead.company} from active operations.`,
        actor: 'Human Operator',
        leadName: lead.name,
        company: lead.company,
        badge: 'Lead Removed',
      });
    }
  };

  const addTask = (taskData: Omit<TaskItem, 'id' | 'createdAt'>): TaskItem => {
    const newTask: TaskItem = {
      ...taskData,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
    logActivity({
      type: 'task_created',
      title: `Task Created: ${newTask.title}`,
      description: `Assigned to ${newTask.assignee} with priority ${newTask.priority} (Due: ${newTask.dueDate})`,
      actor: newTask.source === 'ai_extracted' ? 'Gemma 4 / Ops AI' : 'Human Operator',
      leadName: newTask.clientName,
      company: newTask.company,
      badge: 'Task Added',
    });
    return newTask;
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextCompleted = !t.completed;
          logActivity({
            type: 'task_completed',
            title: nextCompleted ? `Task Completed: ${t.title}` : `Task Reopened: ${t.title}`,
            description: `Status toggled by human operator for ${t.company || 'Operations'}.`,
            actor: 'Human Operator',
            leadName: t.clientName,
            company: t.company,
            badge: nextCompleted ? 'Task Done' : 'Task Reopened',
          });
          return { ...t, completed: nextCompleted };
        }
        return t;
      })
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const addDeadline = (deadlineData: Omit<DeadlineItem, 'id'>): DeadlineItem => {
    const newDeadline: DeadlineItem = {
      ...deadlineData,
      id: `dl-${Date.now()}`,
    };
    setDeadlines((prev) => [newDeadline, ...prev]);
    return newDeadline;
  };

  const updateDeadlineStatus = (id: string, status: DeadlineStatus) => {
    setDeadlines((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status } : d))
    );
  };

  const updateDraftContent = (id: string, subject: string, body: string, notes?: string) => {
    setDrafts((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          return {
            ...d,
            subject,
            body,
            notesForReviewer: notes || d.notesForReviewer,
          };
        }
        return d;
      })
    );
  };

  const approveDraft = (id: string, approverName: string = 'Alex Morgan (Ops Lead)') => {
    const now = new Date().toISOString();
    setDrafts((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          logActivity({
            type: 'human_approved',
            title: `Reply Draft Approved: ${d.company}`,
            description: `Authorized by ${approverName}. Ready for human-initiated dispatch.`,
            actor: approverName,
            leadName: d.clientName,
            company: d.company,
            badge: 'Human Approved',
          });
          return {
            ...d,
            status: 'approved',
            approvedBy: approverName,
            approvedAt: now,
          };
        }
        return d;
      })
    );
  };

  const sendApprovedDraft = (id: string) => {
    const now = new Date().toISOString();
    setDrafts((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          logActivity({
            type: 'email_sent',
            title: `Email Dispatched: Re: ${d.company}`,
            description: `Human-approved email transmitted to ${d.clientEmail}.`,
            actor: d.approvedBy || 'Alex Morgan (Ops Lead)',
            leadName: d.clientName,
            company: d.company,
            badge: 'Email Sent',
          });
          return {
            ...d,
            status: 'sent',
            sentAt: now,
          };
        }
        return d;
      })
    );
  };

  const rejectDraft = (id: string, reason: string) => {
    setDrafts((prev) =>
      prev.map((d) => {
        if (d.id === id) {
          logActivity({
            type: 'status_changed',
            title: `Reply Draft Rejected for Revision`,
            description: `Reason: ${reason || 'Requires substantive adjustments'}`,
            actor: 'Human Operator',
            leadName: d.clientName,
            company: d.company,
            badge: 'Draft Rejected',
          });
          return {
            ...d,
            status: 'rejected',
            rejectionReason: reason,
          };
        }
        return d;
      })
    );
  };

  const createNewDraft = (draftData: Omit<ReplyDraft, 'id' | 'createdAt'>): ReplyDraft => {
    const newDraft: ReplyDraft = {
      ...draftData,
      id: `draft-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setDrafts((prev) => [newDraft, ...prev]);
    return newDraft;
  };

  const ingestExtractedEmail = (extracted: ExtractedEmailData, rawEmail: string) => {
    const now = new Date().toISOString();
    let existingLead = leads.find(
      (l) => l.email.toLowerCase() === extracted.clientEmail.toLowerCase() ||
             l.company.toLowerCase() === extracted.company.toLowerCase()
    );

    let targetLeadId: string;

    if (existingLead) {
      targetLeadId = existingLead.id;
      // Merge requirements
      const combinedReqs = Array.from(new Set([...existingLead.requirements, ...extracted.requirements]));
      updateLead(existingLead.id, {
        requirements: combinedReqs,
        intent: extracted.intent,
        sentiment: extracted.sentiment,
        priority: extracted.priority,
        lastInteraction: now,
        notes: `${existingLead.notes || ''}\n[${new Date().toLocaleDateString()}] Received new email: ${extracted.subject}`.trim(),
      });
    } else {
      const newLead: Lead = {
        id: `lead-${Date.now()}`,
        name: extracted.clientName,
        email: extracted.clientEmail,
        company: extracted.company,
        role: extracted.role || 'Client Stakeholder',
        stage: 'new_inquiry',
        priority: extracted.priority,
        budget: extracted.estimatedBudget,
        intent: extracted.intent,
        sentiment: extracted.sentiment,
        requirements: extracted.requirements,
        deadlines: [],
        tasks: [],
        createdAt: now,
        lastInteraction: now,
        isDemo: false,
        notes: `Extracted via Gemma 4 / AI Extraction pipeline. Subject: ${extracted.subject}`,
      };
      setLeads((prev) => [newLead, ...prev]);
      targetLeadId = newLead.id;
    }

    // Add deadlines
    let deadlineCount = 0;
    if (extracted.deadlines && extracted.deadlines.length > 0) {
      const newDeadlines: DeadlineItem[] = extracted.deadlines.map((d, idx) => ({
        id: `dl-${Date.now()}-${idx}`,
        leadId: targetLeadId,
        clientName: extracted.clientName,
        company: extracted.company,
        description: d.description,
        date: d.date,
        urgency: d.urgency,
        type: d.type,
        status: 'upcoming',
      }));
      setDeadlines((prev) => [...newDeadlines, ...prev]);
      deadlineCount = newDeadlines.length;
    }

    // Add tasks
    let taskCount = 0;
    if (extracted.suggestedTasks && extracted.suggestedTasks.length > 0) {
      const newTasks: TaskItem[] = extracted.suggestedTasks.map((t, idx) => ({
        id: `task-${Date.now()}-${idx}`,
        leadId: targetLeadId,
        clientName: extracted.clientName,
        company: extracted.company,
        title: t.title,
        assignee: t.assignee,
        priority: t.priority,
        dueDate: t.dueDate,
        completed: false,
        source: 'ai_extracted',
        createdAt: now,
      }));
      setTasks((prev) => [...newTasks, ...prev]);
      taskCount = newTasks.length;
    }

    // Create Draft Reply with awaiting_approval
    const draftId = `draft-${Date.now()}`;
    const newDraft: ReplyDraft = {
      id: draftId,
      leadId: targetLeadId,
      clientName: extracted.clientName,
      clientEmail: extracted.clientEmail,
      company: extracted.company,
      subject: extracted.draftReply.subject,
      body: extracted.draftReply.body,
      status: 'awaiting_approval',
      confidenceScore: extracted.draftReply.confidenceScore || 0.94,
      notesForReviewer: extracted.draftReply.notesForHumanReviewer || 'Extracted automatically. Require human sign-off before dispatch.',
      tone: 'consultative',
      createdAt: now,
    };
    setDrafts((prev) => [newDraft, ...prev]);

    // Log Activity
    logActivity({
      type: 'email_ingested',
      title: `Email Ingested & Parsed: ${extracted.company}`,
      description: `Gemma 4 isolated ${extracted.requirements.length} requirements, ${deadlineCount} deadlines, ${taskCount} tasks, and 1 draft reply.`,
      actor: 'Gemma 4 Engine',
      leadName: extracted.clientName,
      company: extracted.company,
      badge: 'AI Extracted',
    });

    logActivity({
      type: 'draft_generated',
      title: `Draft Reply Queued for Human Review`,
      description: `Awaiting human operator approval for ${extracted.company}. Auto-send disabled.`,
      actor: 'Human-in-the-Loop Gateway',
      leadName: extracted.clientName,
      company: extracted.company,
      badge: 'Awaiting Approval',
    });

    return {
      leadId: targetLeadId,
      draftId,
      taskCount,
      deadlineCount,
    };
  };

  const resetToDemoData = () => {
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_leads`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_tasks`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_deadlines`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_drafts`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_activities`);
    setLeads(INITIAL_LEADS);
    setTasks(INITIAL_TASKS);
    setDeadlines(initialDeadlines);
    setDrafts(INITIAL_DRAFTS);
    setActivities(INITIAL_ACTIVITIES);
    setSelectedLeadId(null);
    setSelectedDraftId(null);
  };

  return (
    <OpsContext.Provider
      value={{
        leads,
        tasks,
        deadlines,
        drafts,
        activities,
        activeTab,
        setActiveTab,
        selectedLeadId,
        setSelectedLeadId,
        selectedDraftId,
        setSelectedDraftId,
        addLead,
        updateLeadStage,
        updateLead,
        deleteLead,
        addTask,
        toggleTask,
        deleteTask,
        addDeadline,
        updateDeadlineStatus,
        updateDraftContent,
        approveDraft,
        sendApprovedDraft,
        rejectDraft,
        createNewDraft,
        ingestExtractedEmail,
        resetToDemoData,
      }}
    >
      {children}
    </OpsContext.Provider>
  );
};

export const useOps = () => {
  const context = useContext(OpsContext);
  if (!context) {
    throw new Error('useOps must be used within an OpsProvider');
  }
  return context;
};
