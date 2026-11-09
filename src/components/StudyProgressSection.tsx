import React, { useState } from 'react';
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  Calendar,
  Flame,
  Plus,
  BookOpen,
  Award,
  Sparkles,
} from 'lucide-react';
import { Subject, Task, StudySessionLog, DailyPlan } from '../types';
import { getTodayDateString, getOffsetDateString } from '../data/initialData';
import { HexagonBadge, WashiTape, FloralSprigCorner } from './FloralDecorations';

interface StudyProgressSectionProps {
  subjects: Subject[];
  tasks: Task[];
  studyLogs: StudySessionLog[];
  dailyPlans: DailyPlan[];
  onLogStudySession: (subjectId: string, minutes: number, topic: string, date?: string) => void;
}

export const StudyProgressSection: React.FC<StudyProgressSectionProps> = ({
  subjects,
  tasks,
  studyLogs,
  dailyPlans,
  onLogStudySession,
}) => {
  const [showLogModal, setShowLogModal] = useState<boolean>(false);
  const todayStr = getTodayDateString();

  // Form states for manual log
  const [logSubjectId, setLogSubjectId] = useState<string>(subjects[0]?.id || '');
  const [logMinutes, setLogMinutes] = useState<number>(60);
  const [logTopic, setLogTopic] = useState<string>('');
  const [logDate, setLogDate] = useState<string>(todayStr);

  const handleManualLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logSubjectId || logMinutes <= 0) return;
    onLogStudySession(logSubjectId, Number(logMinutes), logTopic.trim() || 'Study Session', logDate);
    setLogTopic('');
    setShowLogModal(false);
  };

  // Calculations:
  // 1. Total study hours
  const totalLoggedMinutes = studyLogs.reduce((acc, curr) => acc + curr.minutes, 0);
  const totalHours = (totalLoggedMinutes / 60).toFixed(1);

  // 2. Today's study hours
  const todayMinutes = studyLogs
    .filter((l) => l.date === todayStr)
    .reduce((acc, curr) => acc + curr.minutes, 0);
  const todayHours = (todayMinutes / 60).toFixed(1);

  // 3. This week's study hours (last 7 days)
  const last7DaysStrings = Array.from({ length: 7 }).map((_, i) => getOffsetDateString(i - 6));
  const weekMinutes = studyLogs
    .filter((l) => last7DaysStrings.includes(l.date))
    .reduce((acc, curr) => acc + curr.minutes, 0);
  const weekHours = (weekMinutes / 60).toFixed(1);

  // 4. Completed tasks percentage
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const taskPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // 5. Chart data: last 7 days daily breakdown
  const dailyChartData = last7DaysStrings.map((dateStr) => {
    const mins = studyLogs
      .filter((l) => l.date === dateStr)
      .reduce((sum, curr) => sum + curr.minutes, 0);
    const dateObj = new Date(dateStr + 'T00:00:00');
    const label = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
    return {
      dateStr,
      label,
      hours: mins / 60,
    };
  });
  const maxDailyHours = Math.max(...dailyChartData.map((d) => d.hours), 4);

  // 6. Subject breakdown distribution
  const subjectDistribution = subjects.map((sub) => {
    const mins = studyLogs
      .filter((l) => l.subjectId === sub.id)
      .reduce((sum, curr) => sum + curr.minutes, 0);
    return {
      subject: sub,
      minutes: mins,
      hours: (mins / 60).toFixed(1),
      percentage: totalLoggedMinutes > 0 ? Math.round((mins / totalLoggedMinutes) * 100) : 0,
    };
  });

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
              <WashiTape text="Productivity Journal" variant="sage" />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#3E2723]">
              Study Progress & Analytics
            </h2>
            <p className="text-xs sm:text-sm text-[#7D6B62] mt-0.5">
              Monitor daily study time, weekly consistency, task completion ratios, and course dedication.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowLogModal(true)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-[#A3B899] hover:bg-[#8DA382] text-white font-semibold text-sm shadow-sm transition-all shrink-0 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Log Study Hours</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Progress Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Daily Progress */}
        <div className="bg-[#FFFDF9] border border-[#E8DCCF] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#6D5A50] mb-2 font-semibold">
            <span>Today&apos;s Focus</span>
            <span className="text-base">🌸</span>
          </div>
          <div className="font-serif font-bold text-3xl text-[#3E2723] tabular-nums">
            {todayHours}h
          </div>
          <div className="text-xs text-[#7D6B62] mt-1">
            Goal: 4.0h ({Math.min(100, Math.round((todayMinutes / 240) * 100))}%)
          </div>
          <div className="w-full h-1.5 bg-[#F0E6D8] rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-[#F4ACB7] rounded-full"
              style={{ width: `${Math.min(100, (todayMinutes / 240) * 100)}%` }}
            />
          </div>
        </div>

        {/* Weekly Progress */}
        <div className="bg-[#FFFDF9] border border-[#E8DCCF] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#6D5A50] mb-2 font-semibold">
            <span>Past 7 Days</span>
            <span className="text-base">📅</span>
          </div>
          <div className="font-serif font-bold text-3xl text-[#3E2723] tabular-nums">
            {weekHours}h
          </div>
          <div className="text-xs text-[#7D6B62] mt-1">
            Weekly target: 24h
          </div>
          <div className="w-full h-1.5 bg-[#F0E6D8] rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-[#A3B899] rounded-full"
              style={{ width: `${Math.min(100, (weekMinutes / (24 * 60)) * 100)}%` }}
            />
          </div>
        </div>

        {/* Task Completion Percentage */}
        <div className="bg-[#FFFDF9] border border-[#E8DCCF] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#6D5A50] mb-2 font-semibold">
            <span>Task Completion</span>
            <span className="text-base">✅</span>
          </div>
          <div className="font-serif font-bold text-3xl text-[#3E2723] tabular-nums">
            {taskPercent}%
          </div>
          <div className="text-xs text-[#7D6B62] mt-1">
            {completedTasks} of {totalTasks} finished
          </div>
          <div className="w-full h-1.5 bg-[#F0E6D8] rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#D4A373] to-[#A3B899] rounded-full"
              style={{ width: `${taskPercent}%` }}
            />
          </div>
        </div>

        {/* Study Streak */}
        <div className="bg-[#FFFDF9] border border-[#E8DCCF] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#6D5A50] mb-2 font-semibold">
            <span>Study Streak</span>
            <span className="text-base">🔥</span>
          </div>
          <div className="font-serif font-bold text-3xl text-[#E65F78] tabular-nums">
            6 Days
          </div>
          <div className="text-xs text-[#7D6B62] mt-1">
            Consistent learning momentum ✨
          </div>
          <div className="w-full h-1.5 bg-[#F0E6D8] rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-[#E65F78] rounded-full" style={{ width: '85%' }} />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Weekly Hours Bar Chart (8 cols) */}
        <div className="lg:col-span-8 bg-[#FFFDF9] bg-grid-paper border border-[#E8DCCF] rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between pb-3 mb-6 border-b border-[#F0E6D8]">
            <div>
              <h3 className="font-serif font-bold text-lg text-[#3E2723]">
                7-Day Study Hours Trend
              </h3>
              <p className="text-xs text-[#7D6B62]">
                Daily hours logged over the current week
              </p>
            </div>
            <span className="font-handwriting text-base text-[#D87093]">Keep it up! 🌸</span>
          </div>

          {/* SVG Bar Chart */}
          <div className="relative h-56 flex items-end justify-between gap-2 sm:gap-4 px-2 pt-6">
            {dailyChartData.map((d, idx) => {
              const heightPercent = Math.min(100, Math.max(10, (d.hours / maxDailyHours) * 100));
              const isToday = d.dateStr === todayStr;

              return (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono font-bold bg-[#3E2723] text-white px-2 py-0.5 rounded shadow-sm mb-1 whitespace-nowrap">
                    {d.hours.toFixed(1)} hrs
                  </div>

                  {/* The bar */}
                  <div
                    className="w-full max-w-[42px] rounded-t-xl transition-all duration-500 group-hover:brightness-95"
                    style={{
                      height: `${heightPercent}%`,
                      backgroundColor: isToday ? '#F4ACB7' : idx % 2 === 0 ? '#A3B899' : '#D8E2DC',
                      border: '1px solid rgba(0,0,0,0.06)',
                    }}
                  />

                  {/* Day label */}
                  <span
                    className={`text-[11px] font-semibold mt-2 ${
                      isToday ? 'text-[#D87093] font-bold' : 'text-[#7D6B62]'
                    }`}
                  >
                    {d.label}
                  </span>
                  <span className="text-[9px] font-mono text-[#8D6E63] tabular-nums">
                    {d.hours.toFixed(1)}h
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Subject Breakdown Distribution (4 cols) */}
        <div className="lg:col-span-4 bg-[#FFFDF9] border border-[#E8DCCF] rounded-3xl p-6 shadow-sm">
          <div className="pb-3 mb-4 border-b border-[#F0E6D8]">
            <h3 className="font-serif font-bold text-lg text-[#3E2723]">
              Subject Distribution
            </h3>
            <p className="text-xs text-[#7D6B62]">
              Study hours breakdown by course
            </p>
          </div>

          <div className="space-y-4">
            {subjectDistribution.map((item) => (
              <div key={item.subject.id}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-[#3E2723] flex items-center gap-1.5 truncate max-w-[150px]">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: item.subject.color }}
                    />
                    <span>{item.subject.name}</span>
                  </span>
                  <span className="font-mono text-[#6D5A50] tabular-nums">
                    {item.hours}h ({item.percentage}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-[#F0E6D8] rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-500 rounded-full"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.subject.color,
                      filter: 'saturate(1.2) brightness(0.95)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Motivational note */}
          <div className="mt-6 p-3.5 bg-[#FAF4ED] border border-[#E8DACB] rounded-2xl text-xs text-[#5C4537] flex items-center gap-2">
            <span className="text-lg">🌿</span>
            <p className="leading-tight">
              A balanced study diet creates long-term academic excellence.
            </p>
          </div>
        </div>
      </div>

      {/* Manual Study Session Logger Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-[#FFFDF9] rounded-3xl border border-[#E8DCCF] max-w-md w-full p-6 shadow-2xl relative animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0E6D8] mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">⏱️</span>
                <h3 className="font-serif font-bold text-lg text-[#3E2723]">Log Study Session</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowLogModal(false)}
                className="text-xs font-semibold text-[#8D6E63] hover:text-[#3E2723] px-2 py-1 rounded-lg bg-[#FAF4ED]"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleManualLog} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#5C4537] mb-1">
                  Subject *
                </label>
                <select
                  value={logSubjectId}
                  onChange={(e) => setLogSubjectId(e.target.value)}
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#5C4537] mb-1">
                    Duration (Minutes) *
                  </label>
                  <input
                    type="number"
                    value={logMinutes}
                    onChange={(e) => setLogMinutes(Number(e.target.value))}
                    min={5}
                    max={600}
                    step={5}
                    className="w-full px-3 py-2 rounded-xl border border-[#D8C7B5] bg-white text-xs text-[#3E2723] focus:outline-none focus:border-[#A3B899]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5C4537] mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={logDate}
                    onChange={(e) => setLogDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D8C7B5] bg-white text-xs text-[#3E2723] focus:outline-none focus:border-[#A3B899]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5C4537] mb-1">
                  Topic / Summary
                </label>
                <input
                  type="text"
                  value={logTopic}
                  onChange={(e) => setLogTopic(e.target.value)}
                  placeholder="e.g. Chapter 4 problem set review"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D8C7B5] bg-white text-xs text-[#3E2723] focus:outline-none focus:border-[#A3B899]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F0E6D8]">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#FAF4ED] text-[#6D5A50] hover:bg-[#F0E5D8] text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#A3B899] hover:bg-[#8DA382] text-white text-xs font-bold shadow-xs transition-transform active:scale-95"
                >
                  Log Hours
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
