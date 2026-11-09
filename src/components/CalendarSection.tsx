import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Plus,
  Clock,
  GraduationCap,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { Task, Exam, DailyPlan, Subject } from '../types';
import { getTodayDateString } from '../data/initialData';
import { HexagonBadge, WashiTape, FloralSprigCorner } from './FloralDecorations';

interface CalendarSectionProps {
  subjects: Subject[];
  tasks: Task[];
  exams: Exam[];
  dailyPlans: DailyPlan[];
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onAddExam: (exam: Omit<Exam, 'id'>) => void;
}

export const CalendarSection: React.FC<CalendarSectionProps> = ({
  subjects,
  tasks,
  exams,
  dailyPlans,
  onAddTask,
  onAddExam,
}) => {
  const todayStr = getTodayDateString();
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDayString, setSelectedDayString] = useState<string>(todayStr);

  const [showEventModal, setShowEventModal] = useState<boolean>(false);
  const [eventType, setEventType] = useState<'task' | 'exam'>('task');

  // Form states
  const [eventTitle, setEventTitle] = useState<string>('');
  const [eventSubjectId, setEventSubjectId] = useState<string>(subjects[0]?.id || '');
  const [eventDate, setEventDate] = useState<string>(selectedDayString);
  const [eventTime, setEventTime] = useState<string>('10:00');
  const [eventVenue, setEventVenue] = useState<string>('');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-11

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0=Sun, 1=Mon, etc.
  // We want Monday as index 0:
  const startingDayIndex = (firstDayOfMonth + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleTodayJump = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDayString(todayStr);
  };

  // Find events for selected day
  const selectedDayTasks = tasks.filter((t) => t.dueDate === selectedDayString);
  const selectedDayExams = exams.filter((e) => e.examDate === selectedDayString);
  const selectedDayPlans = dailyPlans.filter((p) => p.date === selectedDayString);

  const openAddModal = (dateStr: string, type: 'task' | 'exam' = 'task') => {
    setEventDate(dateStr);
    setEventType(type);
    setEventTitle('');
    setEventSubjectId(subjects[0]?.id || '');
    setEventVenue('');
    setShowEventModal(true);
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;

    if (eventType === 'task') {
      onAddTask({
        title: eventTitle.trim(),
        subjectId: eventSubjectId,
        dueDate: eventDate,
        priority: 'High',
        completed: false,
      });
    } else {
      onAddExam({
        name: eventTitle.trim(),
        subjectId: eventSubjectId,
        examDate: eventDate,
        examTime: eventTime,
        venue: eventVenue.trim(),
        topics: [{ id: `top-${Date.now()}`, name: 'Key Syllabus Concepts', completed: false }],
      });
    }

    setShowEventModal(false);
  };

  // Generate calendar grid cells (42 cells: 6 weeks x 7 days)
  const calendarCells = [];
  // Previous month trailing days
  for (let i = startingDayIndex - 1; i >= 0; i--) {
    const dayNum = daysInPrevMonth - i;
    const prevMonthDate = new Date(year, month - 1, dayNum);
    const dateStr = prevMonthDate.toISOString().split('T')[0];
    calendarCells.push({
      dateStr,
      dayNum,
      isCurrentMonth: false,
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = new Date(year, month, d);
    // Format YYYY-MM-DD
    const mStr = String(month + 1).padStart(2, '0');
    const dStr = String(d).padStart(2, '0');
    const dateStr = `${year}-${mStr}-${dStr}`;
    calendarCells.push({
      dateStr,
      dayNum: d,
      isCurrentMonth: true,
    });
  }

  // Next month leading days to complete grid
  const remainingCells = 42 - calendarCells.length;
  for (let d = 1; d <= remainingCells; d++) {
    const nextMonthDate = new Date(year, month + 1, d);
    const dateStr = nextMonthDate.toISOString().split('T')[0];
    calendarCells.push({
      dateStr,
      dayNum: d,
      isCurrentMonth: false,
    });
  }

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
              <WashiTape text="Monthly Calendar" variant="sage" />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#3E2723]">
              Study Calendar & Exam Deadlines
            </h2>
            <p className="text-xs sm:text-sm text-[#7D6B62] mt-0.5">
              Visualize your upcoming exam dates, assignment due dates, and study sessions at a glance.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => openAddModal(selectedDayString, 'exam')}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#FCE4EC] hover:bg-[#F8BBD0] text-[#7A2C3E] text-xs font-bold rounded-xl border border-[#F48FB1] transition-all"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>+ Add Exam Date</span>
            </button>
            <button
              type="button"
              onClick={() => openAddModal(selectedDayString, 'task')}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#A3B899] hover:bg-[#8DA382] text-white text-xs font-bold rounded-xl shadow-xs transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Task Due</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Calendar View: Month Grid + Day Agenda Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Month Calendar Grid (8 cols) */}
        <div className="lg:col-span-8 bg-[#FFFDF9] border border-[#E8DCCF] rounded-3xl p-5 sm:p-6 shadow-sm">
          {/* Calendar Header Navigation */}
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#F0E6D8]">
            <div className="flex items-center gap-3">
              <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#3E2723]">
                {monthNames[month]} {year}
              </h3>
              <span className="text-base">🌸</span>
            </div>

            <div className="flex items-center gap-1.5 bg-[#FAF4ED] p-1 rounded-xl border border-[#E8DACB]">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1.5 rounded-lg text-[#6D5A50] hover:bg-white transition-colors"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleTodayJump}
                className="px-2.5 py-1 text-xs font-bold text-[#4E342E] hover:bg-white rounded-lg transition-colors"
              >
                Today
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1.5 rounded-lg text-[#6D5A50] hover:bg-white transition-colors"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday Labels (Mon-Sun) */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs font-bold text-[#8D6E63] uppercase tracking-wider mb-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((dayName) => (
              <div key={dayName} className="py-1">
                {dayName}
              </div>
            ))}
          </div>

          {/* 42 Day Cells Grid */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {calendarCells.map((cell, idx) => {
              const isToday = cell.dateStr === todayStr;
              const isSelected = cell.dateStr === selectedDayString;

              const cellTasks = tasks.filter((t) => t.dueDate === cell.dateStr);
              const cellExams = exams.filter((e) => e.examDate === cell.dateStr);
              const cellPlans = dailyPlans.filter((p) => p.date === cell.dateStr);

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedDayString(cell.dateStr)}
                  className={`min-h-[75px] sm:min-h-[92px] p-1.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#FFF9F2] border-[#D87093] ring-2 ring-[#F4ACB7]/40 shadow-xs'
                      : isToday
                      ? 'bg-[#FAF4ED] border-[#A3B899] font-bold'
                      : cell.isCurrentMonth
                      ? 'bg-[#FFFDF9] border-[#EAE0D5] hover:bg-[#FAF6EE] hover:border-[#D4C3AF]'
                      : 'bg-[#F9F6F0] border-[#EFE8DF] opacity-45'
                  }`}
                >
                  {/* Top row: day number & today indicator */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-mono tabular-nums ${
                        isToday
                          ? 'w-5 h-5 rounded-full bg-[#D87093] text-white flex items-center justify-center font-bold shadow-2xs'
                          : cell.isCurrentMonth
                          ? 'text-[#3E2723] font-semibold'
                          : 'text-[#A0887A]'
                      }`}
                    >
                      {cell.dayNum}
                    </span>

                    {/* Quick exam alert icon */}
                    {cellExams.length > 0 && (
                      <span className="text-[10px]" title="Exam scheduled!">
                        🎯
                      </span>
                    )}
                  </div>

                  {/* Event indicators / dots / mini badges */}
                  <div className="space-y-1 mt-1 overflow-hidden">
                    {/* Exam badge */}
                    {cellExams.slice(0, 1).map((e) => (
                      <div
                        key={e.id}
                        className="text-[9px] font-bold px-1 py-0.5 rounded bg-[#FDE2E4] text-[#8C3A4D] border border-[#F48FB1]/50 truncate"
                        title={e.name}
                      >
                        Exam: {e.name}
                      </div>
                    ))}

                    {/* Tasks mini pill */}
                    {cellTasks.slice(0, 1).map((t) => (
                      <div
                        key={t.id}
                        className={`text-[9px] px-1 py-0.5 rounded truncate font-medium ${
                          t.completed
                            ? 'bg-[#E5F4EC] text-[#245239] line-through opacity-70'
                            : 'bg-[#FFE5D9] text-[#6B3A26]'
                        }`}
                        title={t.title}
                      >
                        {t.title}
                      </div>
                    ))}

                    {/* Overflow count if more events exist */}
                    {cellTasks.length + cellExams.length + cellPlans.length > 2 && (
                      <div className="text-[9px] text-[#8D6E63] font-medium text-center">
                        +{cellTasks.length + cellExams.length + cellPlans.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Day Agenda Drawer / Journal Card (4 cols) */}
        <div className="lg:col-span-4 bg-[#FFFDF9] bg-lined-paper border border-[#E8DCCF] rounded-3xl p-5 sm:p-6 shadow-sm relative">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0E6D8] mb-4">
            <div>
              <span className="text-xs font-bold text-[#8D6E63] uppercase tracking-wider block">
                Selected Day Agenda
              </span>
              <h4 className="font-serif font-bold text-lg text-[#3E2723]">
                {new Date(selectedDayString + 'T00:00:00').toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                })}
              </h4>
            </div>

            <HexagonBadge variant="pink" size="sm">
              <span className="text-xs font-bold">{new Date(selectedDayString + 'T00:00:00').getDate()}</span>
            </HexagonBadge>
          </div>

          {/* Agenda Items */}
          <div className="space-y-4">
            {/* 1. Exams scheduled */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#8C3A4D] flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-[#E65F78]" />
                  <span>Exams & Tests ({selectedDayExams.length})</span>
                </span>
                <button
                  type="button"
                  onClick={() => openAddModal(selectedDayString, 'exam')}
                  className="text-[11px] font-bold text-[#D87093] hover:underline"
                >
                  + Add Exam
                </button>
              </div>

              {selectedDayExams.length === 0 ? (
                <p className="text-[11px] text-[#8D7B74] italic bg-[#FAF6EE] p-2 rounded-xl">
                  No exams on this date.
                </p>
              ) : (
                <div className="space-y-2">
                  {selectedDayExams.map((ex) => (
                    <div
                      key={ex.id}
                      className="p-3 bg-[#FFF5F7] border border-[#F4ACB7] rounded-xl text-xs"
                    >
                      <div className="font-bold text-[#4E1E28]">{ex.name}</div>
                      <div className="text-[11px] text-[#7D6B62] mt-0.5 flex items-center gap-2">
                        {ex.examTime && <span>⏰ {ex.examTime}</span>}
                        {ex.venue && <span>📍 {ex.venue}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Tasks Due */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#5C4537] flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-[#D4A373]" />
                  <span>Tasks Due ({selectedDayTasks.length})</span>
                </span>
                <button
                  type="button"
                  onClick={() => openAddModal(selectedDayString, 'task')}
                  className="text-[11px] font-bold text-[#A3B899] hover:underline"
                >
                  + Add Task
                </button>
              </div>

              {selectedDayTasks.length === 0 ? (
                <p className="text-[11px] text-[#8D7B74] italic bg-[#FAF6EE] p-2 rounded-xl">
                  No tasks due on this date.
                </p>
              ) : (
                <div className="space-y-2">
                  {selectedDayTasks.map((t) => (
                    <div
                      key={t.id}
                      className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                        t.completed
                          ? 'bg-[#F7F9F6] border-[#DCE5DC] opacity-75'
                          : 'bg-white border-[#E8DACB]'
                      }`}
                    >
                      <span className={t.completed ? 'line-through text-[#8D7B74]' : 'font-medium text-[#3E2723]'}>
                        {t.title}
                      </span>
                      <span className="text-[10px] text-[#8D6E63] font-bold">{t.priority}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Study Sessions Planned */}
            <div>
              <span className="text-xs font-bold text-[#2D4537] flex items-center gap-1 mb-2">
                <Clock className="w-3.5 h-3.5 text-[#A3B899]" />
                <span>Study Sessions ({selectedDayPlans.length})</span>
              </span>

              {selectedDayPlans.length === 0 ? (
                <p className="text-[11px] text-[#8D7B74] italic bg-[#FAF6EE] p-2 rounded-xl">
                  No study sessions scheduled.
                </p>
              ) : (
                <div className="space-y-2">
                  {selectedDayPlans.map((p) => (
                    <div
                      key={p.id}
                      className="p-2.5 bg-white border border-[#E8DACB] rounded-xl text-xs"
                    >
                      <div className="font-semibold text-[#3E2723]">{p.topic}</div>
                      <div className="text-[10px] text-[#7D6B62] mt-0.5 font-mono">
                        {p.studyTime} ({p.durationMinutes}m)
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Calendar Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-[#FFFDF9] rounded-3xl border border-[#E8DCCF] max-w-md w-full p-6 shadow-2xl relative animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0E6D8] mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">{eventType === 'exam' ? '🎯' : '✅'}</span>
                <h3 className="font-serif font-bold text-lg text-[#3E2723]">
                  {eventType === 'exam' ? 'Add Exam Date' : 'Add Task Due Date'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowEventModal(false)}
                className="text-xs font-semibold text-[#8D6E63] hover:text-[#3E2723] px-2 py-1 rounded-lg bg-[#FAF4ED]"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="space-y-4">
              {/* Type Switcher */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-[#FAF4ED] rounded-xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setEventType('task')}
                  className={`py-1.5 rounded-lg transition-all ${
                    eventType === 'task' ? 'bg-white text-[#3E2723] shadow-2xs' : 'text-[#7D6B62]'
                  }`}
                >
                  Task Due Date
                </button>
                <button
                  type="button"
                  onClick={() => setEventType('exam')}
                  className={`py-1.5 rounded-lg transition-all ${
                    eventType === 'exam' ? 'bg-[#FCE4EC] text-[#8C3A4D] shadow-2xs' : 'text-[#7D6B62]'
                  }`}
                >
                  Exam / Test Date
                </button>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-[#5C4537] mb-1">
                  {eventType === 'exam' ? 'Exam Name *' : 'Task / Assignment Title *'}
                </label>
                <input
                  type="text"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder={eventType === 'exam' ? 'e.g. Midterm Physics Exam' : 'e.g. Submit Literature Essay'}
                  className="w-full px-3 py-2 rounded-xl border border-[#D8C7B5] bg-white text-xs text-[#3E2723] focus:outline-none focus:border-[#A3B899]"
                  required
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-bold text-[#5C4537] mb-1">
                  Subject *
                </label>
                <select
                  value={eventSubjectId}
                  onChange={(e) => setEventSubjectId(e.target.value)}
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

              {/* Date */}
              <div>
                <label className="block text-xs font-bold text-[#5C4537] mb-1">
                  Date *
                </label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#D8C7B5] bg-white text-xs text-[#3E2723] focus:outline-none focus:border-[#A3B899]"
                  required
                />
              </div>

              {/* Exam specific time & venue */}
              {eventType === 'exam' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#5C4537] mb-1">
                      Exam Time
                    </label>
                    <input
                      type="time"
                      value={eventTime}
                      onChange={(e) => setEventTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#D8C7B5] bg-white text-xs text-[#3E2723] focus:outline-none focus:border-[#A3B899]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#5C4537] mb-1">
                      Venue / Room
                    </label>
                    <input
                      type="text"
                      value={eventVenue}
                      onChange={(e) => setEventVenue(e.target.value)}
                      placeholder="e.g. Hall A"
                      className="w-full px-3 py-2 rounded-xl border border-[#D8C7B5] bg-white text-xs text-[#3E2723] focus:outline-none focus:border-[#A3B899]"
                    />
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F0E6D8]">
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#FAF4ED] text-[#6D5A50] hover:bg-[#F0E5D8] text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#A3B899] hover:bg-[#8DA382] text-white text-xs font-bold shadow-xs transition-transform active:scale-95"
                >
                  Save to Calendar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
