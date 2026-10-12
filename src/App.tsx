/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { OpsProvider, useOps } from './context/OpsContext';
import { DemoBanner } from './components/DemoBanner';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { OverviewView } from './components/views/OverviewView';
import { LeadsView } from './components/views/LeadsView';
import { DeadlinesView } from './components/views/DeadlinesView';
import { TasksView } from './components/views/TasksView';
import { ReplyReviewView } from './components/views/ReplyReviewView';
import { EmailIngestView } from './components/views/EmailIngestView';
import { ActivityView } from './components/views/ActivityView';
import { NewLeadModal } from './components/modals/NewLeadModal';
import { NewTaskModal } from './components/modals/NewTaskModal';
import { NewDeadlineModal } from './components/modals/NewDeadlineModal';
import { LeadDetailDrawer } from './components/modals/LeadDetailDrawer';

function DashboardContent() {
  const { activeTab, selectedLeadId, setSelectedLeadId } = useOps();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNewLeadOpen, setIsNewLeadOpen] = useState(false);
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [isNewDeadlineOpen, setIsNewDeadlineOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans text-slate-900 antialiased selection:bg-teal-100 selection:text-teal-900">
      {/* Demo dataset & safety banner */}
      <DemoBanner />

      {/* Main navigation header */}
      <Header onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      {/* Main dashboard body with sidebar */}
      <div className="flex-1 flex max-w-[1700px] w-full mx-auto">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Dynamic content view */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {activeTab === 'overview' && (
            <OverviewView
              onOpenNewLead={() => setIsNewLeadOpen(true)}
              onOpenNewTask={() => setIsNewTaskOpen(true)}
            />
          )}

          {activeTab === 'leads' && (
            <LeadsView onOpenNewLead={() => setIsNewLeadOpen(true)} />
          )}

          {activeTab === 'deadlines' && (
            <DeadlinesView onOpenNewDeadline={() => setIsNewDeadlineOpen(true)} />
          )}

          {activeTab === 'tasks' && (
            <TasksView onOpenNewTask={() => setIsNewTaskOpen(true)} />
          )}

          {activeTab === 'reply-review' && <ReplyReviewView />}

          {activeTab === 'email-ingest' && <EmailIngestView />}

          {activeTab === 'activity' && <ActivityView />}
        </main>
      </div>

      {/* Modals & Drawers */}
      <NewLeadModal
        isOpen={isNewLeadOpen}
        onClose={() => setIsNewLeadOpen(false)}
      />

      <NewTaskModal
        isOpen={isNewTaskOpen}
        onClose={() => setIsNewTaskOpen(false)}
      />

      <NewDeadlineModal
        isOpen={isNewDeadlineOpen}
        onClose={() => setIsNewDeadlineOpen(false)}
      />

      <LeadDetailDrawer
        leadId={selectedLeadId}
        onClose={() => setSelectedLeadId(null)}
      />
    </div>
  );
}

export default function App() {
  return (
    <OpsProvider>
      <DashboardContent />
    </OpsProvider>
  );
}
