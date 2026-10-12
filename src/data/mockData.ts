import { Lead, TaskItem, DeadlineItem, ReplyDraft, ActivityEvent } from '../types';

export const DEMO_PRESET_EMAILS = [
  {
    id: 'email-1',
    subject: 'Urgent: Infrastructure Migration Milestone 2 Deliverables & API Rate Limit Requirements',
    senderName: 'Marcus Vance',
    senderEmail: 'marcus.vance@acmecloud.io',
    company: 'Acme Cloud Systems',
    snippet: 'We need to confirm the Redis cluster failover specs before Thursday noon...',
    rawEmail: `From: Marcus Vance <marcus.vance@acmecloud.io>
To: operations@inboxops.ai
Subject: Urgent: Infrastructure Migration Milestone 2 Deliverables & API Rate Limit Requirements
Date: Mon, 12 Oct 2026 09:15:22 -0700

Hi Team,

Following up on our sprint review last Friday. We are approaching Milestone 2 for the cloud infrastructure cutover and have a few urgent requirements that need sign-off:

1. We require mutual TLS and Redis enterprise cluster failover latency under 15ms.
2. The client-facing rate limiter must support 25,000 requests/minute during high traffic events.
3. Need final architecture topology diagram submitted by this Thursday, Oct 15, 2026 at 5:00 PM EST.
4. Our VP of Engineering expects a dry-run staging migration before next Monday, Oct 19.

Our budget allocation for this migration phase is capped at $45,000. Please confirm your team's availability to run the staging test this weekend and send over the updated deliverable checklist.

Regards,
Marcus Vance
Director of Cloud Infrastructure
Acme Cloud Systems`,
  },
  {
    id: 'email-2',
    subject: 'RFP: Real-time Wealth Dashboard & SOC2 Compliance Scope',
    senderName: 'Elena Rostova',
    senderEmail: 'elena.rostova@heliosfintech.com',
    company: 'Helios Fintech',
    snippet: 'Looking for a vetted engineering partner for our wealth management portal...',
    rawEmail: `From: Elena Rostova <elena.rostova@heliosfintech.com>
To: inquiries@inboxops.ai
Subject: RFP: Real-time Wealth Dashboard & SOC2 Compliance Scope
Date: Sun, 11 Oct 2026 18:42:10 -0400

Dear Client Solutions Team,

Helios Fintech is soliciting proposals for a modern, responsive web application for our institutional wealth clients. 

Key Requirements:
• Real-time portfolio rebalancing engine with WebSockets streaming
• Full SOC2 Type II compliance controls and audit logging
• Biometric 2FA and Plaid Open Banking API integration
• Target MVP launch date is November 30, 2026

We have an approved budget of $80,000 - $110,000 for Phase 1. Please provide a formal response including team profiles and milestone timeline by Friday, October 23.

Best regards,
Elena Rostova
Head of Product Innovation
Helios Fintech`,
  },
  {
    id: 'email-3',
    subject: 'Scope Expansion: HIPAA Compliant Patient Booking Widget by Oct 28',
    senderName: 'Dr. David Chen',
    senderEmail: 'dchen@luminahealth.org',
    company: 'Lumina Health',
    snippet: 'Can we add doctor calendar sync and SMS reminders to the portal build?',
    rawEmail: `From: Dr. David Chen <dchen@luminahealth.org>
To: team@inboxops.ai
Subject: Scope Expansion: HIPAA Compliant Patient Booking Widget by Oct 28
Date: Mon, 12 Oct 2026 11:02:45 -0500

Hi InboxOps Ops,

Our clinical advisory committee met this morning. We decided we cannot launch the portal without:
1. Patient self-scheduling calendar integrated directly with Epic EHR
2. Automated SMS appointment reminders with HIPAA consent capture
3. Multi-language support (English, Spanish, Mandarin)

Can we incorporate this into the existing Phase 1 scope without delaying our Oct 28 patient testing window? We have an additional $20,000 discretionary budget approved for this expansion. 

Please send an updated statement of work for my signature by tomorrow afternoon.

Thank you,
Dr. David Chen
Chief Medical Officer, Lumina Health`,
  },
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-1',
    name: 'Marcus Vance',
    email: 'marcus.vance@acmecloud.io',
    company: 'Acme Cloud Systems',
    role: 'Director of Cloud Infrastructure',
    stage: 'in_progress',
    priority: 'High',
    budget: '$45,000',
    intent: 'Milestone 2 Migration & Architecture Verification',
    sentiment: 'Urgent & Action-Oriented',
    isDemo: true,
    requirements: [
      'Mutual TLS and Redis cluster failover latency < 15ms',
      'Rate limiter supporting 25,000 req/min peak traffic',
      'Architecture topology diagram and SOW sign-off',
      'Dry-run staging migration protocol and weekend staffing',
    ],
    deadlines: [
      {
        id: 'dl-1',
        leadId: 'lead-1',
        clientName: 'Marcus Vance',
        company: 'Acme Cloud Systems',
        description: 'Submit Architecture Topology Diagram',
        date: '2026-10-15',
        urgency: 'High',
        type: 'Hard Deadline',
        status: 'due_soon',
      },
      {
        id: 'dl-2',
        leadId: 'lead-1',
        clientName: 'Marcus Vance',
        company: 'Acme Cloud Systems',
        description: 'Staging Cutover Dry-Run Migration',
        date: '2026-10-19',
        urgency: 'High',
        type: 'Milestone',
        status: 'upcoming',
      },
    ],
    tasks: [],
    createdAt: '2026-10-10T14:30:00Z',
    lastInteraction: '2026-10-12T09:15:00Z',
    notes: 'Key enterprise account. VP expects seamless staging dry-run before production window.',
  },
  {
    id: 'lead-2',
    name: 'Elena Rostova',
    email: 'elena.rostova@heliosfintech.com',
    company: 'Helios Fintech',
    role: 'Head of Product Innovation',
    stage: 'scoping',
    priority: 'High',
    budget: '$80,000 - $110,000',
    intent: 'RFP Proposal for Wealth Management Portal',
    sentiment: 'Formal & Collaborative',
    isDemo: true,
    requirements: [
      'Real-time portfolio rebalancing engine with WebSockets',
      'SOC2 Type II compliance controls & immutable audit logging',
      'Biometric 2FA + Plaid Open Banking integration',
      'Target MVP launch window Nov 30, 2026',
    ],
    deadlines: [
      {
        id: 'dl-3',
        leadId: 'lead-2',
        clientName: 'Elena Rostova',
        company: 'Helios Fintech',
        description: 'Formal RFP Response & Team Profiles Submission',
        date: '2026-10-23',
        urgency: 'High',
        type: 'Hard Deadline',
        status: 'upcoming',
      },
      {
        id: 'dl-4',
        leadId: 'lead-2',
        clientName: 'Elena Rostova',
        company: 'Helios Fintech',
        description: 'Target MVP Launch Window',
        date: '2026-11-30',
        urgency: 'Medium',
        type: 'Milestone',
        status: 'upcoming',
      },
    ],
    tasks: [],
    createdAt: '2026-10-11T18:42:00Z',
    lastInteraction: '2026-10-11T18:42:00Z',
    notes: 'High budget tier. Demands SOC2 audit trail compliance documentation.',
  },
  {
    id: 'lead-3',
    name: 'Dr. David Chen',
    email: 'dchen@luminahealth.org',
    company: 'Lumina Health',
    role: 'Chief Medical Officer',
    stage: 'proposal_sent',
    priority: 'High',
    budget: '$20,000 Expansion (Total $65k)',
    intent: 'Scope Expansion: Patient Booking Widget',
    sentiment: 'Time-Sensitive & Urgent',
    isDemo: true,
    requirements: [
      'Epic EHR bi-directional calendar sync',
      'Automated SMS reminders with HIPAA consent capture',
      'Trilingual interface (English, Spanish, Mandarin)',
      'Deliver SOW amendment by tomorrow afternoon',
    ],
    deadlines: [
      {
        id: 'dl-5',
        leadId: 'lead-3',
        clientName: 'Dr. David Chen',
        company: 'Lumina Health',
        description: 'Deliver SOW Amendment for CMO Signature',
        date: '2026-10-13',
        urgency: 'High',
        type: 'Hard Deadline',
        status: 'due_soon',
      },
      {
        id: 'dl-6',
        leadId: 'lead-3',
        clientName: 'Dr. David Chen',
        company: 'Lumina Health',
        description: 'Patient Testing Window Kickoff',
        date: '2026-10-28',
        urgency: 'Medium',
        type: 'Milestone',
        status: 'upcoming',
      },
    ],
    tasks: [],
    createdAt: '2026-10-09T10:00:00Z',
    lastInteraction: '2026-10-12T11:02:00Z',
    notes: 'Approved $20k additional budget for widget expansion. Urgent sign-off required.',
  },
  {
    id: 'lead-4',
    name: 'Sophia Sterling',
    email: 'sophia@novacreative.studio',
    company: 'Nova Creative Studio',
    role: 'Creative Operations Director',
    stage: 'new_inquiry',
    priority: 'Medium',
    budget: '$28,000',
    intent: 'Interactive Brand Asset Management Platform',
    sentiment: 'Curious & Exploratory',
    isDemo: true,
    requirements: [
      'Figma plugin integration for cloud asset sync',
      'Client guest review portal with pin-point annotations',
      'Role-based permissions for external contractors',
    ],
    deadlines: [
      {
        id: 'dl-7',
        leadId: 'lead-4',
        clientName: 'Sophia Sterling',
        company: 'Nova Creative Studio',
        description: 'Preliminary Architecture Discovery Call',
        date: '2026-10-16',
        urgency: 'Medium',
        type: 'Review Window',
        status: 'upcoming',
      },
    ],
    tasks: [],
    createdAt: '2026-10-11T16:20:00Z',
    lastInteraction: '2026-10-11T16:20:00Z',
    notes: 'Found us via referral. Interested in high polish UI and Figma integration.',
  },
  {
    id: 'lead-5',
    name: 'Tariq Al-Mansoor',
    email: 'tariq@vertexlogistics.ae',
    company: 'Vertex Global Logistics',
    role: 'Operations VP',
    stage: 'closed_won',
    priority: 'Low',
    budget: '$95,000',
    intent: 'Fleet Telematics Real-time Tracking Dashboard',
    sentiment: 'Satisfied & Ongoing',
    isDemo: true,
    requirements: [
      'MQTT GPS stream ingestion for 1,200 vehicles',
      'Geofencing automated driver alert triggers',
      'Custom KPI export to Snowflake data warehouse',
    ],
    deadlines: [
      {
        id: 'dl-8',
        leadId: 'lead-5',
        clientName: 'Tariq Al-Mansoor',
        company: 'Vertex Global Logistics',
        description: 'Phase 2 Telematics Live Handover',
        date: '2026-11-15',
        urgency: 'Medium',
        type: 'Milestone',
        status: 'upcoming',
      },
    ],
    tasks: [],
    createdAt: '2026-09-15T08:00:00Z',
    lastInteraction: '2026-10-08T14:10:00Z',
    notes: 'Contract signed and active. Milestone 1 successfully deployed.',
  },
];

export const INITIAL_TASKS: TaskItem[] = [
  {
    id: 'task-1',
    leadId: 'lead-1',
    clientName: 'Marcus Vance',
    company: 'Acme Cloud Systems',
    title: 'Review Redis Enterprise failover spec & latency thresholds (<15ms)',
    assignee: 'Lead Engineer',
    priority: 'High',
    dueDate: '2026-10-14',
    completed: false,
    source: 'ai_extracted',
    createdAt: '2026-10-12T09:16:00Z',
  },
  {
    id: 'task-2',
    leadId: 'lead-1',
    clientName: 'Marcus Vance',
    company: 'Acme Cloud Systems',
    title: 'Generate architecture topology diagram for Oct 15 client submission',
    assignee: 'Lead Engineer',
    priority: 'High',
    dueDate: '2026-10-15',
    completed: false,
    source: 'ai_extracted',
    createdAt: '2026-10-12T09:16:00Z',
  },
  {
    id: 'task-3',
    leadId: 'lead-3',
    clientName: 'Dr. David Chen',
    company: 'Lumina Health',
    title: 'Draft SOW Amendment for $20k patient booking widget scope expansion',
    assignee: 'Account Exec',
    priority: 'High',
    dueDate: '2026-10-13',
    completed: false,
    source: 'ai_extracted',
    createdAt: '2026-10-12T11:05:00Z',
  },
  {
    id: 'task-4',
    leadId: 'lead-2',
    clientName: 'Elena Rostova',
    company: 'Helios Fintech',
    title: 'Prepare SOC2 Type II compliance controls overview packet',
    assignee: 'Project Lead',
    priority: 'High',
    dueDate: '2026-10-18',
    completed: false,
    source: 'ai_extracted',
    createdAt: '2026-10-11T18:45:00Z',
  },
  {
    id: 'task-5',
    leadId: 'lead-1',
    clientName: 'Marcus Vance',
    company: 'Acme Cloud Systems',
    title: 'Confirm team weekend staging on-call rota for Oct 18-19 cutover test',
    assignee: 'Operations Specialist',
    priority: 'Medium',
    dueDate: '2026-10-16',
    completed: true,
    source: 'manual',
    createdAt: '2026-10-12T09:30:00Z',
  },
  {
    id: 'task-6',
    leadId: 'lead-4',
    clientName: 'Sophia Sterling',
    company: 'Nova Creative Studio',
    title: 'Send calendar invite with agenda for Figma integration review',
    assignee: 'Account Exec',
    priority: 'Medium',
    dueDate: '2026-10-14',
    completed: true,
    source: 'manual',
    createdAt: '2026-10-11T16:30:00Z',
  },
  {
    id: 'task-7',
    leadId: 'lead-2',
    clientName: 'Elena Rostova',
    company: 'Helios Fintech',
    title: 'Assemble technical proposal slide deck & engineering team bios',
    assignee: 'Project Lead',
    priority: 'Medium',
    dueDate: '2026-10-20',
    completed: false,
    source: 'ai_extracted',
    createdAt: '2026-10-11T18:45:00Z',
  },
];

export const INITIAL_DRAFTS: ReplyDraft[] = [
  {
    id: 'draft-1',
    leadId: 'lead-1',
    clientName: 'Marcus Vance',
    clientEmail: 'marcus.vance@acmecloud.io',
    company: 'Acme Cloud Systems',
    subject: 'Re: Urgent: Infrastructure Migration Milestone 2 Deliverables & API Rate Limit Requirements',
    body: `Hi Marcus,

Thank you for the detailed breakdown on Milestone 2 deliverables.

Our systems engineering team has reviewed your specifications:
1. We have validated the Redis enterprise cluster failover configuration; our test benchmarks consistently maintain under 12ms failover latency.
2. The rate-limiter architecture is benchmarked to sustain 30,000 req/min with token-bucket Redis pooling, well exceeding your 25,000 threshold.
3. The finalized architecture topology diagram is currently undergoing peer review and will be delivered to your inbox ahead of Thursday's 5:00 PM EST deadline.
4. Our senior devops engineers are booked for the Saturday evening staging cutover dry-run.

Could we schedule a 15-minute alignment check this Wednesday at 2:00 PM EST to verify staging access credentials before the weekend test?

Best regards,
Client Operations Team`,
    status: 'awaiting_approval',
    confidenceScore: 0.96,
    notesForReviewer: 'High-priority enterprise client. Please verify engineer weekend on-call roster before clicking Approve & Send.',
    tone: 'consultative',
    createdAt: '2026-10-12T09:16:30Z',
  },
  {
    id: 'draft-2',
    leadId: 'lead-3',
    clientName: 'Dr. David Chen',
    clientEmail: 'dchen@luminahealth.org',
    company: 'Lumina Health',
    subject: 'Re: Scope Expansion: HIPAA Compliant Patient Booking Widget by Oct 28',
    body: `Dear Dr. Chen,

Thank you for your update regarding the clinical advisory committee's feedback.

We completely agree that seamless Epic EHR calendar synchronization and HIPAA-compliant SMS reminders are critical for patient engagement. We have mapped out the necessary sprint adjustments:
• The additional $20,000 budget covers the Epic SMART on FHIR integration module and multilingual localized string bundles (English, Spanish, Mandarin).
• By dedicating two additional frontend engineers, we can absorb this expansion without altering your October 28 patient testing milestone.

Our legal and operations leads are finalizing the formal SOW amendment now. We will deliver it to your inbox tomorrow before 1:00 PM for your signature.

Warm regards,
Client Operations Partner`,
    status: 'awaiting_approval',
    confidenceScore: 0.94,
    notesForReviewer: 'Ensure SOW amendment document is attached to the client file before approving this draft.',
    tone: 'warm',
    createdAt: '2026-10-12T11:04:10Z',
  },
  {
    id: 'draft-3',
    leadId: 'lead-2',
    clientName: 'Elena Rostova',
    clientEmail: 'elena.rostova@heliosfintech.com',
    company: 'Helios Fintech',
    subject: 'Re: RFP: Real-time Wealth Dashboard & SOC2 Compliance Scope',
    body: `Dear Elena,

Thank you for considering our team for Helios Fintech's institutional wealth dashboard.

We have reviewed your RFP requirements with our principal architect:
• Our real-time engine leverages robust WebSocket multiplexing designed for sub-100ms portfolio updates.
• Our infrastructure deployment pipeline is pre-configured with SOC2 Type II compliance audit controls and automated secret scanning.
• We have completed multiple Plaid Open Banking production integrations with biometric authentication flows.

We are preparing our comprehensive proposal package, milestone schedules, and team bios to deliver well ahead of your October 23 submission deadline.

Sincerely,
Client Solutions Team`,
    status: 'approved',
    confidenceScore: 0.93,
    notesForReviewer: 'Approved by Operations Director. Draft marked as ready to transmit.',
    tone: 'consultative',
    createdAt: '2026-10-11T18:44:00Z',
    approvedBy: 'Alex Morgan (Ops Lead)',
    approvedAt: '2026-10-12T08:30:00Z',
  },
  {
    id: 'draft-4',
    leadId: 'lead-4',
    clientName: 'Sophia Sterling',
    clientEmail: 'sophia@novacreative.studio',
    company: 'Nova Creative Studio',
    subject: 'Re: Welcome to InboxOps - Discovery Call Setup',
    body: `Hi Sophia,

Thrilled to connect! We would love to explore building your interactive brand asset management platform.

I have set aside 30 minutes on Friday, Oct 16 at 11:00 AM EST to discuss the Figma plugin workflow and contractor permission tiers. Let us know if that time works or if you prefer an afternoon window.

Looking forward to speaking,
Client Operations Team`,
    status: 'sent',
    confidenceScore: 0.98,
    notesForReviewer: 'Sent after human authorization.',
    tone: 'warm',
    createdAt: '2026-10-11T16:25:00Z',
    approvedBy: 'Alex Morgan (Ops Lead)',
    approvedAt: '2026-10-11T16:30:00Z',
    sentAt: '2026-10-11T16:31:00Z',
  },
];

export const INITIAL_ACTIVITIES: ActivityEvent[] = [
  {
    id: 'act-1',
    timestamp: '2026-10-12T11:04:10Z',
    type: 'draft_generated',
    title: 'AI Draft Generated Awaiting Approval',
    description: 'Extracted response draft for Dr. David Chen (Lumina Health) regarding Epic EHR scope expansion.',
    actor: 'Gemma 4 / Ops AI',
    leadName: 'Dr. David Chen',
    company: 'Lumina Health',
    badge: 'Draft Pending',
  },
  {
    id: 'act-2',
    timestamp: '2026-10-12T11:02:45Z',
    type: 'email_ingested',
    title: 'Inbound Client Email Ingested',
    description: 'Received email from Dr. David Chen with $20k scope expansion and SMS reminders requirement.',
    actor: 'Email Gateway',
    leadName: 'Dr. David Chen',
    company: 'Lumina Health',
    badge: 'Email Received',
  },
  {
    id: 'act-3',
    timestamp: '2026-10-12T09:30:00Z',
    type: 'task_completed',
    title: 'Task Completed: Staging On-Call Rota',
    description: 'Confirmed weekend staging on-call engineering coverage for Acme Cloud cutover test.',
    actor: 'Alex Morgan (Ops Lead)',
    leadName: 'Marcus Vance',
    company: 'Acme Cloud Systems',
    badge: 'Task Done',
  },
  {
    id: 'act-4',
    timestamp: '2026-10-12T09:16:30Z',
    type: 'draft_generated',
    title: 'AI Draft Generated Awaiting Approval',
    description: 'Draft reply generated for Marcus Vance regarding Redis failover benchmarks and topology diagram.',
    actor: 'Gemma 4 / Ops AI',
    leadName: 'Marcus Vance',
    company: 'Acme Cloud Systems',
    badge: 'Draft Pending',
  },
  {
    id: 'act-5',
    timestamp: '2026-10-12T09:15:22Z',
    type: 'email_ingested',
    title: 'Inbound Client Email Ingested',
    description: 'Received urgent email from Marcus Vance regarding Milestone 2 rate limit & Redis failover.',
    actor: 'Email Gateway',
    leadName: 'Marcus Vance',
    company: 'Acme Cloud Systems',
    badge: 'Email Received',
  },
  {
    id: 'act-6',
    timestamp: '2026-10-12T08:30:00Z',
    type: 'human_approved',
    title: 'Draft Approved by Human Operator',
    description: 'Alex Morgan approved response to Elena Rostova (Helios Fintech RFP). Marked ready for dispatch.',
    actor: 'Alex Morgan (Ops Lead)',
    leadName: 'Elena Rostova',
    company: 'Helios Fintech',
    badge: 'Human Approved',
  },
  {
    id: 'act-7',
    timestamp: '2026-10-11T18:45:00Z',
    type: 'task_created',
    title: 'Operational Tasks Auto-Extracted',
    description: 'Created 2 tasks for SOC2 documentation and technical proposal deck for Helios Fintech.',
    actor: 'Gemma 4 / Ops AI',
    leadName: 'Elena Rostova',
    company: 'Helios Fintech',
    badge: 'Tasks Created',
  },
  {
    id: 'act-8',
    timestamp: '2026-10-11T16:31:00Z',
    type: 'email_sent',
    title: 'Email Sent Following Human Approval',
    description: 'Authorized welcome and discovery invite dispatched to Sophia Sterling (Nova Creative Studio).',
    actor: 'Alex Morgan (Ops Lead)',
    leadName: 'Sophia Sterling',
    company: 'Nova Creative Studio',
    badge: 'Email Dispatched',
  },
];
