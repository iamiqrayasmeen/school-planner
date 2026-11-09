import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Plus,
  CheckCircle2,
  Trash2,
  Edit3,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Sparkles,
  Award,
} from 'lucide-react';
import { DailyPlan, Subject, Priority } from '../types';
import { getTodayDateString, getOffsetDateString } from '../data/initialData';
import { HexagonBadge, WashiTape, FloralSprigCorner } from './FloralDecorations';

interface DailyPlannerSectionProps {
  subjects: Subject[];
  dailyPlans: DailyPlan[];
  onAddPlan: (plan: Omit<DailyPlan, 'id' | 'completed'>) => void;
  onEditPlan: (id: string, updated: Partial<DailyPlan>) => void;
  onDeletePlan: (id: string) => void;
  onTogglePlan: (id: string) => void;
}

export const DailyPlannerSection: React.FC<DailyPlannerSectionProps> = ({
  subjects,
  dailyPlans,
  onAddPlan,
  onEditPlan,
  onDeletePlan,
  onTogglePlan,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingPlan, setEditingPlan] = useState<DailyPlan | null>(null);

  // Daily reflection notes saved in LocalStorage per date
  const [dailyReflection, setDailyReflection] = useState<string>(() => {
    return localStorage.getItem(`reflection_${selectedDate}`) || 'Felt focused today. Made steady progress on core topics.';
  });

  // Form states
  const [subjectId, setSubjectId] = useState<string>(subjects[0]?.id || '');
  const [topic, setTopic] = useState<string>('');
  const [studyTime, setStudyTime] = useState<string>('09:00 - 10:30');
  const [durationMinutes, setDurationMinutes] = useState<number>(90);
  const [priority, setPriority] = useState<Priority>('High');
  const [notes, setNotes] = useState<string>('');

  const plansForSelectedDate = dailyPlans.filter((p) => p.date === selectedDate);
  const completedPlansCount = plansForSelectedDate.filter((p) => p.completed).length;

  const navigateDay = (offset: number) => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + offset);
    const nextDate = current.toISOString().split('T')[0];
    setSelectedDate(nextDate);
    setDailyReflection(localStorage.getItem(`reflection_${nextDate}`) || '');
  };

  const handleReflectionChange = (val: string) => {
    setDailyReflection(val);
    localStorage.setItem(`reflection_${selectedDate}`, val);
  };

  const openAddModal = () => {
    setEditingPlan(null);
    setSubjectId(subjects[0]?.id || '');
    setTopic('');
    setStudyTime('09:00 - 10:30');
    setDurationMinutes(90);
    setPriority('High');
    setNotes('');
    setShowAddModal(true);
  };

  const openEditModal = (plan: DailyPlan) => {
    setEditingPlan(plan);
    setSubjectId(plan.subjectId);
    setTopic(plan.topic);
    setStudyTime(plan.studyTime);
    setDurationMinutes(plan.durationMinutes);
    setPriority(plan.priority);
    setNotes(plan.notes);
    setShowAddModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    if (editingPlan) {
      onEditPlan(editingPlan.id, {
        subjectId,
        topic: topic.trim(),
        studyTime,
        durationMinutes: Number(durationMinutes) || 60,
        priority,
        notes: notes.trim(),
      });
    } else {
      onAddPlan({
        date: selectedDate,
        subjectId,
        topic: topic.trim(),
        studyTime,
        durationMinutes: Number(durationMinutes) || 60,
        priority,
        notes: notes.trim(),
      });
    }

    setShowAddModal(false);
  };

  const formattedDateHeader = new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Date Switcher Toolbar */}
      <div className="relative bg-[#FFFDF9] border border-[#E8DCCF] rounded-3xl p-6 shadow-sm overflow-hidden">
        <div className="absolute top-0 right-0 pointer-events-none">
          <FloralSprigCorner flipped className="opacity-75 -mt-3 -mr-3" />
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <WashiTape text="Daily Journal Page" variant="peach" />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#3E2723]">
              Daily Study Planner
            </h2>
            <p className="text-xs sm:text-sm text-[#7D6B62] mt-0.5">
              Plan specific topics, time blocks, and priorities for each study day.
            </p>
          </div>

          {/* Date Selector Controls */}
          <div className="flex flex-wrap items-center gap-2 bg-[#FAF4ED] p-2 rounded-2xl border border-[#E8DACB] shrink-0">
            <button
              type="button"
              onClick={() => navigateDay(-1)}
              className="p-1.5 rounded-xl bg-white hover:bg-[#FAF4ED] text-[#4E342E] shadow-2xs transition-colors"
              title="Previous Day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                const today = getTodayDateString();
                setSelectedDate(today);
                setDailyReflection(localStorage.getItem(`reflection_${today}`) || '');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedDate === getTodayDateString()
                  ? 'bg-[#F4ACB7] text-[#4A1D28] shadow-2xs'
                  : 'bg-white text-[#6D5A50] hover:bg-[#FFFDF9]'
              }`}
            >
              Today
            </button>

            <button
              type="button"
              onClick={() => {
                const tomorrow = getOffsetDateString(1);
                setSelectedDate(tomorrow);
                setDailyReflection(localStorage.getItem(`reflection_${tomorrow}`) || '');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedDate === getOffsetDateString(1)
                  ? 'bg-[#A3B899] text-white shadow-2xs'
                  : 'bg-white text-[#6D5A50] hover:bg-[#FFFDF9]'
              }`}
            >
              Tomorrow
            </button>

            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                if (e.target.value) {
                  setSelectedDate(e.target.value);
                  setDailyReflection(localStorage.getItem(`reflection_${e.target.value}`) || '');
                }
              }}
              className="px-2.5 py-1.5 rounded-xl border border-[#D8C7B5] bg-white text-xs font-semibold text-[#4E342E] focus:outline-none focus:border-[#A3B899]"
            />

            <button
              type="button"
              onClick={() => navigateDay(1)}
              className="p-1.5 rounded-xl bg-white hover:bg-[#FAF4ED] text-[#4E342E] shadow-2xs transition-colors"
              title="Next Day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Selected Date Indicator Banner */}
        <div className="mt-4 pt-4 border-t border-[#F0E6D8] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <HexagonBadge variant="grid" size="sm">
              <span className="text-xs font-bold">{new Date(selectedDate + 'T00:00:00').getDate()}</span>
            </HexagonBadge>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#3E2723]">{formattedDateHeader}</h3>
              <p className="text-xs text-[#7D6B62]">
                {completedPlansCount} of {plansForSelectedDate.length} sessions completed
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2 bg-[#F4ACB7] hover:bg-[#EB97A4] text-[#4A1D28] text-xs font-bold rounded-xl shadow-xs transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Study Topic</span>
          </button>
        </div>
      </div>

      {/* Main Journal Spread: Two Column Physical Planner Look */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Page: Study Schedule & Time Blocks (8 cols) */}
        <div className="lg:col-span-8 bg-[#FFFDF9] bg-lined-paper border border-[#E8DCCF] rounded-3xl p-6 sm:p-7 shadow-sm relative">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8DACB] mb-5">
            <div className="flex items-center gap-2">
              <span className="text-xl">✍️</span>
              <h3 className="font-serif font-bold text-lg text-[#3E2723]">Study Schedule & Topics</h3>
            </div>
            <span className="text-xs font-handwriting text-[#8D6E63] text-base">
              Stick to your plan ✨
            </span>
          </div>

          {plansForSelectedDate.length === 0 ? (
            <div className="py-12 px-6 text-center">
              <span className="text-4xl">🌸</span>
              <h4 className="font-serif font-bold text-base text-[#4E342E] mt-3">
                No study plans set for this day yet.
              </h4>
              <p className="text-xs text-[#7D6B62] mt-1 max-w-sm mx-auto">
                Schedule your study topics, allocate time blocks, and stay ahead of your coursework!
              </p>
              <button
                type="button"
                onClick={openAddModal}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-[#A3B899] hover:bg-[#8DA382] text-white text-xs font-bold rounded-xl shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Plan Topic for {formattedDateHeader.split(',')[0]}</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {plansForSelectedDate.map((plan) => {
                const sub = subjects.find((s) => s.id === plan.subjectId);
                return (
                  <div
                    key={plan.id}
                    className={`relative p-4 rounded-2xl border transition-all ${
                      plan.completed
                        ? 'bg-[#F7F9F6] border-[#DCE5DC] opacity-80'
                        : 'bg-[#FFFDF9] border-[#E8DACB] hover:shadow-xs hover:border-[#D4C3AF]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        {/* Checkbox button */}
                        <button
                          type="button"
                          onClick={() => onTogglePlan(plan.id)}
                          className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center transition-all shrink-0 ${
                            plan.completed
                              ? 'bg-[#A3B899] text-white shadow-2xs'
                              : 'border-2 border-[#D8C7B5] hover:border-[#A3B899] bg-white'
                          }`}
                          title={plan.completed ? 'Mark incomplete' : 'Mark completed'}
                        >
                          {plan.completed && <CheckCircle2 className="w-4 h-4" />}
                        </button>

                        <div className="min-w-0">
                          {/* Subject & Time Badges */}
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span
                              className="text-[11px] font-bold px-2 py-0.5 rounded-md border text-[#3E2723]"
                              style={{ backgroundColor: sub?.color || '#FFE5D9' }}
                            >
                              {sub?.name || 'General Subject'}
                            </span>
                            <span className="text-xs text-[#7D6B62] font-mono flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-[#A3B899]" />
                              {plan.studyTime} ({plan.durationMinutes}m)
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                plan.priority === 'High'
                                  ? 'bg-[#FDE2E4] text-[#8C3A4D]'
                                  : plan.priority === 'Medium'
                                  ? 'bg-[#FFF0D4] text-[#7A4B1A]'
                                  : 'bg-[#E5F4EC] text-[#245239]'
                              }`}
                            >
                              {plan.priority} Priority
                            </span>
                          </div>

                          <h4
                            className={`text-base font-semibold text-[#3E2723] ${
                              plan.completed ? 'line-through text-[#8D7B74]' : ''
                            }`}
                          >
                            {plan.topic}
                          </h4>

                          {plan.notes && (
                            <p className="text-xs text-[#6D5A50] mt-1 bg-[#FAF4ED] p-2 rounded-lg border border-[#F0E5D8]">
                              {plan.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Edit / Delete actions */}
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => openEditModal(plan)}
                          className="p-1.5 rounded-lg text-[#8D6E63] hover:bg-[#FAF4ED] transition-colors"
                          title="Edit plan"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeletePlan(plan.id)}
                          className="p-1.5 rounded-lg text-[#8D6E63] hover:text-[#9C324E] hover:bg-[#FCE4EC] transition-colors"
                          title="Delete plan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Page: Daily Reflection & Study Habit Checklist (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Daily Reflection Journal Box */}
          <div className="bg-[#FFFDF9] bg-dot-paper border border-[#E8DCCF] rounded-3xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#F0E6D8]">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#D87093]" />
                <h3 className="font-serif font-bold text-base text-[#3E2723]">Daily Reflection</h3>
              </div>
              <span className="text-[11px] font-handwriting text-[#8D6E63] text-sm">auto-saved</span>
            </div>
            <p className="text-xs text-[#7D6B62] mb-2">
              How did today&apos;s study go? What key concept did you master?
            </p>
            <textarea
              value={dailyReflection}
              onChange={(e) => handleReflectionChange(e.target.value)}
              placeholder="Write your study wins, challenges overcome, or notes for tomorrow..."
              rows={5}
              className="w-full p-3 rounded-xl border border-[#D8C7B5] bg-white/90 text-xs text-[#3E2723] focus:outline-none focus:border-[#A3B899] shadow-2xs leading-relaxed"
            />
          </div>

          {/* Daily Study Routine Checklist */}
          <div className="bg-[#FAF4ED] border border-[#E8DACB] rounded-3xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-4 h-4 text-[#A3B899]" />
              <h4 className="font-serif font-bold text-sm text-[#3E2723]">Daily Study Ritual</h4>
            </div>
            <ul className="space-y-2 text-xs text-[#5C4537]">
              <li className="flex items-center gap-2">
                <span className="text-xs">💧</span>
                <span>Stay hydrated (keep water bottle full)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-xs">📵</span>
                <span>Phone on do-not-disturb while studying</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-xs">✏️</span>
                <span>Summarize notes in your own words</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-xs">🌙</span>
                <span>Pack bag and organize tomorrow&apos;s topics</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Add / Edit Daily Plan Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-[#FFFDF9] rounded-3xl border border-[#E8DCCF] max-w-lg w-full p-6 shadow-2xl relative animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0E6D8] mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌸</span>
                <h3 className="font-serif font-bold text-lg text-[#3E2723]">
                  {editingPlan ? 'Edit Study Session' : 'Plan Study Topic'}
                </h3>
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
              {/* Subject */}
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

              {/* Study Topic */}
              <div>
                <label className="block text-xs font-bold text-[#5C4537] mb-1">
                  Study Topic / Target Objective *
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Chapter 4 problem set, Mitosis flashcards"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D8C7B5] bg-white text-xs text-[#3E2723] focus:outline-none focus:border-[#A3B899]"
                  required
                />
              </div>

              {/* Time Slot & Duration */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#5C4537] mb-1">
                    Study Time / Slot
                  </label>
                  <input
                    type="text"
                    value={studyTime}
                    onChange={(e) => setStudyTime(e.target.value)}
                    placeholder="e.g. 09:00 - 10:30"
                    className="w-full px-3 py-2 rounded-xl border border-[#D8C7B5] bg-white text-xs text-[#3E2723] focus:outline-none focus:border-[#A3B899]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5C4537] mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    min={15}
                    max={360}
                    step={15}
                    className="w-full px-3 py-2 rounded-xl border border-[#D8C7B5] bg-white text-xs text-[#3E2723] focus:outline-none focus:border-[#A3B899]"
                  />
                </div>
              </div>

              {/* Priority */}
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

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-[#5C4537] mb-1">
                  Study Notes / Reminders
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Materials needed, textbook pages, specific questions..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl border border-[#D8C7B5] bg-white text-xs text-[#3E2723] focus:outline-none focus:border-[#A3B899]"
                />
              </div>

              {/* Actions */}
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
                  className="px-5 py-2 rounded-xl bg-[#A3B899] hover:bg-[#8DA382] text-white text-xs font-bold shadow-xs transition-transform active:scale-95"
                >
                  {editingPlan ? 'Save Changes' : 'Save Study Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
