import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Search,
  CheckCircle2,
  Trash2,
  Clock,
  AlertCircle,
  Filter,
  Check,
  Calendar,
} from 'lucide-react';
import { Task, Subject, Priority } from '../types';
import { getTodayDateString } from '../data/initialData';
import { WashiTape, FloralSprigCorner } from './FloralDecorations';

interface TaskManagerSectionProps {
  subjects: Subject[];
  tasks: Task[];
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  soundEnabled: boolean;
}

export const TaskManagerSection: React.FC<TaskManagerSectionProps> = ({
  subjects,
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  soundEnabled,
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('all');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // Form states
  const [title, setTitle] = useState<string>('');
  const [subjectId, setSubjectId] = useState<string>(subjects[0]?.id || '');
  const [dueDate, setDueDate] = useState<string>(getTodayDateString());
  const [priority, setPriority] = useState<Priority>('High');
  const [notes, setNotes] = useState<string>('');

  const handleToggle = (id: string) => {
    onToggleTask(id);
    if (soundEnabled && typeof window !== 'undefined' && (window as any).StudyPlannerAudio) {
      (window as any).StudyPlannerAudio.playPaperRustle();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      title: title.trim(),
      subjectId,
      dueDate,
      priority,
      completed: false,
      notes: notes.trim(),
    });

    setTitle('');
    setNotes('');
    setShowAddModal(false);
  };

  const filteredTasks = tasks.filter((t) => {
    if (filterStatus === 'pending' && t.completed) return false;
    if (filterStatus === 'completed' && !t.completed) return false;
    if (selectedSubjectFilter !== 'all' && t.subjectId !== selectedSubjectFilter) return false;
    if (selectedPriorityFilter !== 'all' && t.priority !== selectedPriorityFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchNotes = t.notes?.toLowerCase().includes(q);
      const subName = subjects.find((s) => s.id === t.subjectId)?.name.toLowerCase();
      const matchSub = subName?.includes(q);
      return matchTitle || matchNotes || matchSub;
    }
    return true;
  });

  const totalTasks = tasks.length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = totalTasks - completedCount;
  const completionPercentage = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="relative bg-[#FFFDF9] border border-[#E8DCCF] rounded-3xl p-6 sm:p-8 shadow-sm overflow-hidden">
        <div className="absolute top-0 right-0 pointer-events-none">
          <FloralSprigCorner flipped className="opacity-75 -mt-3 -mr-3" />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <WashiTape text="To-Do List" variant="floral" />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#3E2723]">
              Study Task Manager
            </h2>
            <p className="text-xs sm:text-sm text-[#7D6B62] mt-0.5">
              Break down homework, readings, and assignment deadlines into achievable tasks.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-[#A3B899] hover:bg-[#8DA382] text-white font-semibold text-sm shadow-sm transition-all shrink-0 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Task</span>
          </button>
        </div>

        {/* Task Progress Bar */}
        <div className="mt-6 pt-5 border-t border-[#F0E6D8]">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-[#5C4537] flex items-center gap-1.5">
              <span>🌸</span>
              <span>Task Completion Progress</span>
            </span>
            <span className="font-mono font-bold text-[#3E2723] tabular-nums">
              {completedCount} / {totalTasks} tasks ({completionPercentage}%)
            </span>
          </div>
          <div className="w-full h-2.5 bg-[#F0E6D8] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#F4ACB7] to-[#A3B899] transition-all duration-500 rounded-full"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#FFFDF9] border border-[#E8DCCF] rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#8D6E63] absolute left-3.5 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search study tasks, topics, or notes..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#D8C7B5] bg-white text-xs text-[#3E2723] focus:outline-none focus:border-[#A3B899]"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status buttons */}
          <div className="flex items-center bg-[#FAF4ED] p-1 rounded-xl border border-[#E8DACB]">
            <button
              type="button"
              onClick={() => setFilterStatus('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                filterStatus === 'all' ? 'bg-white text-[#3E2723] shadow-2xs' : 'text-[#7D6B62]'
              }`}
            >
              All ({totalTasks})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus('pending')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                filterStatus === 'pending' ? 'bg-white text-[#8C3A4D] shadow-2xs' : 'text-[#7D6B62]'
              }`}
            >
              Pending ({pendingCount})
            </button>
            <button
              type="button"
              onClick={() => setFilterStatus('completed')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                filterStatus === 'completed' ? 'bg-white text-[#2C4A3A] shadow-2xs' : 'text-[#7D6B62]'
              }`}
            >
              Done ({completedCount})
            </button>
          </div>

          {/* Subject Filter */}
          <select
            value={selectedSubjectFilter}
            onChange={(e) => setSelectedSubjectFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-[#D8C7B5] bg-[#FAF4ED] text-xs font-semibold text-[#4E342E] focus:outline-none"
          >
            <option value="all">All Subjects</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={selectedPriorityFilter}
            onChange={(e) => setSelectedPriorityFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-[#D8C7B5] bg-[#FAF4ED] text-xs font-semibold text-[#4E342E] focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Task List (Lined Notebook Style) */}
      <div className="bg-[#FFFDF9] bg-lined-paper border border-[#E8DCCF] rounded-3xl p-6 shadow-sm">
        {filteredTasks.length === 0 ? (
          <div className="py-12 text-center">
            <span className="text-3xl">🌸</span>
            <h4 className="font-serif font-bold text-base text-[#4E342E] mt-2">
              No tasks match your filter.
            </h4>
            <p className="text-xs text-[#7D6B62] mt-1">
              Add a new task or adjust your search parameters.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTasks.map((task) => {
              const sub = subjects.find((s) => s.id === task.subjectId);
              const isToday = task.dueDate === getTodayDateString();

              return (
                <div
                  key={task.id}
                  className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                    task.completed
                      ? 'bg-[#F9FAF8] border-[#DCE5DC] opacity-75'
                      : 'bg-[#FFFDF9] border-[#E8DACB] hover:shadow-xs hover:border-[#D4C3AF]'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <button
                      type="button"
                      onClick={() => handleToggle(task.id)}
                      className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center transition-all shrink-0 ${
                        task.completed
                          ? 'bg-[#A3B899] text-white shadow-2xs'
                          : 'border-2 border-[#D8C7B5] hover:border-[#A3B899] bg-white'
                      }`}
                      title={task.completed ? 'Mark incomplete' : 'Mark completed'}
                    >
                      {task.completed && <CheckCircle2 className="w-4 h-4" />}
                    </button>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-md border text-[#3E2723]"
                          style={{ backgroundColor: sub?.color || '#FFE5D9' }}
                        >
                          {sub?.name || 'General Subject'}
                        </span>

                        <span
                          className={`text-xs flex items-center gap-1 font-mono ${
                            isToday ? 'text-[#C93B57] font-bold' : 'text-[#7D6B62]'
                          }`}
                        >
                          <Calendar className="w-3 h-3 text-[#A3B899]" />
                          {isToday ? 'Due Today' : `Due: ${task.dueDate}`}
                        </span>

                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            task.priority === 'High'
                              ? 'bg-[#FDE2E4] text-[#8C3A4D]'
                              : task.priority === 'Medium'
                              ? 'bg-[#FFF0D4] text-[#7A4B1A]'
                              : 'bg-[#E5F4EC] text-[#245239]'
                          }`}
                        >
                          {task.priority} Priority
                        </span>
                      </div>

                      <h4
                        className={`text-sm sm:text-base font-semibold text-[#3E2723] ${
                          task.completed ? 'line-through text-[#8D7B74]' : ''
                        }`}
                      >
                        {task.title}
                      </h4>

                      {task.notes && (
                        <p className="text-xs text-[#7D6B62] mt-1 bg-[#FAF6EE] p-2 rounded-lg border border-[#F0E5D8]">
                          {task.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onDeleteTask(task.id)}
                    className="p-1.5 rounded-lg text-[#8D6E63] hover:text-[#9C324E] hover:bg-[#FCE4EC] transition-colors shrink-0"
                    title="Delete task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-[#FFFDF9] rounded-3xl border border-[#E8DCCF] max-w-md w-full p-6 shadow-2xl relative animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0E6D8] mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌸</span>
                <h3 className="font-serif font-bold text-lg text-[#3E2723]">Add New Study Task</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-xs font-semibold text-[#8D6E63] hover:text-[#3E2723] px-2 py-1 rounded-lg bg-[#FAF4ED]"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#5C4537] mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Read Chapter 5, Finish practice problems"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D8C7B5] bg-white text-xs text-[#3E2723] focus:outline-none focus:border-[#A3B899]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5C4537] mb-1">
                  Select Subject *
                </label>
                <select
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#D8C7B5] bg-white text-xs text-[#3E2723] focus:outline-none focus:border-[#A3B899]"
                  required
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5C4537] mb-1">
                  Due Date *
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#D8C7B5] bg-white text-xs text-[#3E2723] focus:outline-none focus:border-[#A3B899]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5C4537] mb-1.5">
                  Priority Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['High', 'Medium', 'Low'] as Priority[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        priority === p
                          ? p === 'High'
                            ? 'bg-[#FDE2E4] border-[#F48FB1] text-[#8C3A4D]'
                            : p === 'Medium'
                            ? 'bg-[#FFF0D4] border-[#E8B86D] text-[#7A4B1A]'
                            : 'bg-[#E5F4EC] border-[#A3B899] text-[#245239]'
                          : 'bg-white border-[#E5D7C5] text-[#7D6B62]'
                      }`}
                    >
                      {p} Priority
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5C4537] mb-1">
                  Task Details / Reminders
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Pages, references, steps..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl border border-[#D8C7B5] bg-white text-xs text-[#3E2723] focus:outline-none focus:border-[#A3B899]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F0E6D8]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#FAF4ED] text-[#6D5A50] hover:bg-[#F0E5D8] text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#F4ACB7] hover:bg-[#EB97A4] text-[#4A1D28] text-xs font-bold shadow-xs transition-transform active:scale-95"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
