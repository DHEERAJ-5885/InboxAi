import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  Sparkles,
  Calendar,
  User,
  Trash2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useOps } from '../../context/OpsContext';
import { PriorityLevel } from '../../types';

interface TasksViewProps {
  onOpenNewTask: () => void;
}

export const TasksView: React.FC<TasksViewProps> = ({ onOpenNewTask }) => {
  const { tasks, toggleTask, deleteTask, leads } = useOps();
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterAssignee, setFilterAssignee] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.company && t.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
      t.assignee.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === 'all'
        ? true
        : filterStatus === 'completed'
        ? t.completed
        : !t.completed;

    const matchesPriority = filterPriority === 'all' || t.priority === filterPriority;
    const matchesAssignee = filterAssignee === 'all' || t.assignee === filterAssignee;

    return matchesSearch && matchesStatus && matchesPriority && matchesAssignee;
  });

  const assignees = Array.from(new Set(tasks.map((t) => t.assignee)));
  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.filter((t) => !t.completed).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Task Operations & Execution</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage actionable deliverables derived from client communications and operational milestones.
          </p>
        </div>

        <button
          onClick={onOpenNewTask}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Task</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks, client names, or assignees..."
              className="w-full text-xs pl-9 pr-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-slate-50/50"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="text-xs px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-700"
            >
              <option value="all">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            <select
              value={filterAssignee}
              onChange={(e) => setFilterAssignee(e.target.value)}
              className="text-xs px-3 py-2 border border-slate-300 rounded-xl bg-white text-slate-700"
            >
              <option value="all">All Assignees</option>
              {assignees.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status Pill Tabs */}
        <div className="flex items-center gap-2 border-t border-slate-100 pt-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              filterStatus === 'all'
                ? 'bg-slate-900 text-white font-semibold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Tasks ({tasks.length})
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              filterStatus === 'pending'
                ? 'bg-teal-600 text-white font-semibold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              filterStatus === 'completed'
                ? 'bg-slate-700 text-white font-semibold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
          <CheckSquare className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-900">No tasks found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Create a task manually or run AI Email Extraction to automatically generate tasks from inbound client requirements.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`p-4 rounded-xl border transition-all flex items-start sm:items-center justify-between gap-3 group ${
                task.completed
                  ? 'bg-slate-50/70 border-slate-200'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  className="mt-0.5 sm:mt-0 rounded text-teal-600 focus:ring-teal-500 w-4 h-4 cursor-pointer shrink-0"
                />

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-0.5">
                    <span
                      className={`text-xs font-semibold ${
                        task.completed ? 'line-through text-slate-400' : 'text-slate-900'
                      }`}
                    >
                      {task.title}
                    </span>

                    {task.source === 'ai_extracted' ? (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-teal-50 text-teal-700 border border-teal-200 flex items-center gap-1 font-semibold">
                        <Sparkles className="w-2.5 h-2.5" />
                        AI Extracted
                      </span>
                    ) : (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium">
                        Manual
                      </span>
                    )}

                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                        task.priority === 'High'
                          ? 'bg-rose-100 text-rose-800'
                          : task.priority === 'Medium'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 flex items-center gap-2">
                    {task.company && <span className="font-medium text-slate-700">{task.company}</span>}
                    {task.company && <span>•</span>}
                    <span>Assigned to {task.assignee}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-800 block">Due {task.dueDate}</span>
                </div>

                <button
                  onClick={() => deleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 p-1.5 rounded transition-all cursor-pointer"
                  title="Delete task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
