import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  AlertCircle,
  PlusCircle,
  CalendarCheck,
  FileEdit,
  Sparkles,
  ArrowRight,
  Flame,
  Award,
} from 'lucide-react';
import { Subject, DailyPlan, Task, Exam } from '../types';
import { PomodoroTimer } from './PomodoroTimer';
import {
  WashiTape,
  HexagonBadge,
  FlowerMasonJar,
  FloralSprigCorner,
  SleepMaskSticker,
} from './FloralDecorations';
import { MOTIVATIONAL_QUOTES, getTodayDateString } from '../data/initialData';
import { NavTabId } from './Navigation';

interface HomeSectionProps {
  subjects: Subject[];
  dailyPlans: DailyPlan[];
  tasks: Task[];
  exams: Exam[];
  totalStudyMinutes: number;
  onNavigate: (tab: NavTabId) => void;
  onToggleTask: (taskId: string) => void;
  onTogglePlan: (planId: string) => void;
  onLogSession: (subjectId: string, minutes: number, topic: string) => void;
  soundEnabled: boolean;
}

export const HomeSection: React.FC<HomeSectionProps> = ({
  subjects,
  dailyPlans,
  tasks,
  exams,
  totalStudyMinutes,
  onNavigate,
  onToggleTask,
  onTogglePlan,
  onLogSession,
  soundEnabled,
}) => {
  const todayStr = getTodayDateString();
  const [currentDateFormatted, setCurrentDateFormatted] = useState<string>('');
  const [currentTimeFormatted, setCurrentTimeFormatted] = useState<string>('');
  const [quoteIndex, setQuoteIndex] = useState<number>(0);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentDateFormatted(
        now.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      );
      setCurrentTimeFormatted(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const nextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
  };

  // Calculations for daily summary
  const totalSubjectsCount = subjects.length;
  const pendingTasksCount = tasks.filter((t) => !t.completed).length;
  const completedTasksCount = tasks.filter((t) => t.completed).length;
  const totalStudyHoursFormatted = (totalStudyMinutes / 60).toFixed(1);

  // Today's study plans & tasks
  const todaysPlans = dailyPlans.filter((p) => p.date === todayStr);
  const todaysTasks = tasks.filter((t) => t.dueDate === todayStr);

  // Next upcoming exam
  const sortedExams = [...exams].sort(
    (a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime()
  );
  const nextExam = sortedExams.find((e) => new Date(e.examDate) >= new Date(todayStr)) || sortedExams[0];

  const daysUntilNextExam = nextExam
    ? Math.max(
        0,
        Math.ceil((new Date(nextExam.examDate).getTime() - new Date(todayStr).getTime()) / (1000 * 60 * 60 * 24))
      )
    : null;

  return (
    <div className="space-y-6 pb-8">
      {/* 1. Beautiful Welcome Hero Section (Journal Double-Page Spread Inspiration) */}
      <div className="relative bg-[#FFFDF9] border border-[#E8DCCF] rounded-3xl p-6 sm:p-8 shadow-sm overflow-hidden">
        {/* Decorative corner sprigs & tape */}
        <div className="absolute top-0 right-0 pointer-events-none">
          <FloralSprigCorner flipped className="opacity-90 -mr-2 -mt-1" />
        </div>
        <div className="absolute top-3 left-6 -rotate-2">
          <WashiTape text="March Spread" variant="floral" />
        </div>

        <div className="relative pt-6 sm:pt-4 z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#F0E6D8] pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-2xl animate-bounce">🌸</span>
                <span className="font-handwriting text-xl text-[#D87093] font-bold">
                  Welcome to your study sanctuary
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#3E2723] tracking-tight">
                Plan Your Study, Achieve Your Dreams
              </h2>
              <p className="text-sm text-[#7D6B62] mt-1.5 max-w-xl">
                Stay organized, balance your daily study goals, and watch your academic journey bloom one page at a time.
              </p>
            </div>

            {/* Date & Time aesthetic stamp */}
            <div className="bg-[#FAF4ED] border border-[#E8DACB] rounded-2xl p-4 text-center sm:text-right shrink-0 shadow-xs relative">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#9C7A68]">Today&apos;s Date</div>
              <div className="font-serif font-bold text-lg text-[#3E2723]">{currentDateFormatted || 'Loading date...'}</div>
              <div className="font-mono text-xs text-[#8D6E63] mt-0.5 flex items-center justify-center sm:justify-end gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#A3B899]" />
                <span>{currentTimeFormatted}</span>
                <span className="text-[#D87093]">🌸</span>
              </div>
            </div>
          </div>

          {/* 4 Summary Metric Cards (Total Subjects, Pending Tasks, Completed Tasks, Study Hours) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6">
            {/* 1: Total Subjects */}
            <div
              onClick={() => onNavigate('subjects')}
              className="group cursor-pointer bg-[#FFFDF9] bg-grid-paper border border-[#E8DACB] rounded-2xl p-4 transition-all hover:-translate-y-1 hover:shadow-md hover:border-[#A3B899]"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#6D5A50] uppercase tracking-wider">Subjects</span>
                <div className="w-8 h-8 rounded-full bg-[#E8F0EC] text-[#2D4537] flex items-center justify-center text-sm group-hover:scale-110 transition-transform">
                  <BookOpen className="w-4 h-4" />
                </div>
              </div>
              <div className="font-serif font-bold text-2xl sm:text-3xl text-[#3E2723] tabular-nums">
                {totalSubjectsCount}
              </div>
              <div className="text-[11px] text-[#7D6B62] mt-1 flex items-center gap-1">
                <span>Active courses</span>
                <ArrowRight className="w-3 h-3 text-[#A3B899] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>

            {/* 2: Pending Tasks */}
            <div
              onClick={() => onNavigate('tasks')}
              className="group cursor-pointer bg-[#FFFDF9] bg-lined-paper border border-[#E8DACB] rounded-2xl p-4 transition-all hover:-translate-y-1 hover:shadow-md hover:border-[#F4ACB7]"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#8C485A] uppercase tracking-wider">Pending</span>
                <div className="w-8 h-8 rounded-full bg-[#FCE4EC] text-[#8C485A] flex items-center justify-center text-sm group-hover:scale-110 transition-transform">
                  <AlertCircle className="w-4 h-4" />
                </div>
              </div>
              <div className="font-serif font-bold text-2xl sm:text-3xl text-[#7A2C3E] tabular-nums">
                {pendingTasksCount}
              </div>
              <div className="text-[11px] text-[#8C485A] mt-1 flex items-center gap-1">
                <span>Tasks to finish</span>
                <ArrowRight className="w-3 h-3 text-[#F4ACB7] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>

            {/* 3: Completed Tasks */}
            <div
              onClick={() => onNavigate('tasks')}
              className="group cursor-pointer bg-[#FFFDF9] border border-[#E8DACB] rounded-2xl p-4 transition-all hover:-translate-y-1 hover:shadow-md hover:border-[#A3B899]"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#2C4A3A] uppercase tracking-wider">Completed</span>
                <div className="w-8 h-8 rounded-full bg-[#E2EBE0] text-[#2C4A3A] flex items-center justify-center text-sm group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="font-serif font-bold text-2xl sm:text-3xl text-[#2C4A3A] tabular-nums">
                {completedTasksCount}
              </div>
              <div className="text-[11px] text-[#557564] mt-1 flex items-center gap-1">
                <span>Tasks checked off</span>
                <ArrowRight className="w-3 h-3 text-[#A3B899] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>

            {/* 4: Study Hours */}
            <div
              onClick={() => onNavigate('progress')}
              className="group cursor-pointer bg-[#FFFDF9] border border-[#E8DACB] rounded-2xl p-4 transition-all hover:-translate-y-1 hover:shadow-md hover:border-[#D8A47F]"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#664635] uppercase tracking-wider">Study Time</span>
                <div className="w-8 h-8 rounded-full bg-[#FFE5D9] text-[#664635] flex items-center justify-center text-sm group-hover:scale-110 transition-transform">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="font-serif font-bold text-2xl sm:text-3xl text-[#4A3225] tabular-nums">
                {totalStudyHoursFormatted}h
              </div>
              <div className="text-[11px] text-[#7A5B49] mt-1 flex items-center gap-1">
                <span>Total hours logged</span>
                <ArrowRight className="w-3 h-3 text-[#D8A47F] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Desk Section: Two Column Aesthetic Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Today's Agenda & Quick Action Planner (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Quick Action Ribbon */}
          <div className="flex flex-wrap items-center gap-2 p-3 bg-[#FAF2EB] border border-[#E8DACB] rounded-2xl">
            <span className="text-xs font-semibold text-[#7D6B62] px-2 flex items-center gap-1">
              <span>✏️</span> Quick Actions:
            </span>
            <button
              type="button"
              onClick={() => onNavigate('daily')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#FFFDF9] text-xs font-semibold text-[#4E342E] border border-[#E5D2C0] shadow-2xs hover:shadow-xs transition-all"
            >
              <CalendarCheck className="w-3.5 h-3.5 text-[#D87093]" />
              <span>Plan Today</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('tasks')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#FFFDF9] text-xs font-semibold text-[#4E342E] border border-[#E5D2C0] shadow-2xs hover:shadow-xs transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#5B7B6D]" />
              <span>New Task</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('notes')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#FFFDF9] text-xs font-semibold text-[#4E342E] border border-[#E5D2C0] shadow-2xs hover:shadow-xs transition-all"
            >
              <FileEdit className="w-3.5 h-3.5 text-[#7A5B49]" />
              <span>Write Note</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('goals')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#FFFDF9] text-xs font-semibold text-[#4E342E] border border-[#E5D2C0] shadow-2xs hover:shadow-xs transition-all"
            >
              <Award className="w-3.5 h-3.5 text-[#D4A373]" />
              <span>Set Goals</span>
            </button>
          </div>

          {/* Today's Study Plans Card (Styled like ruled planner spread in photo) */}
          <div className="bg-[#FFFDF9] border border-[#E8DCCF] rounded-2xl p-5 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#F0E6D8]">
              <div className="flex items-center gap-2">
                <span className="text-lg">📖</span>
                <h3 className="font-serif text-lg font-bold text-[#3E2723]">Today&apos;s Study Plans</h3>
                <span className="text-xs font-medium text-[#7D6B62] bg-[#FAF2EB] px-2 py-0.5 rounded-full">
                  {todaysPlans.length} sessions
                </span>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('daily')}
                className="text-xs font-semibold text-[#D87093] hover:text-[#B34568] flex items-center gap-1"
              >
                <span>View Full Daily Plan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {todaysPlans.length === 0 ? (
              <div className="p-8 text-center bg-lined-paper rounded-xl border border-dashed border-[#E5D2C0]">
                <span className="text-3xl">🌸</span>
                <p className="font-serif text-sm font-semibold text-[#4E342E] mt-2">No study sessions planned for today yet.</p>
                <p className="text-xs text-[#7D6B62] mt-1">Take a moment to plan your key topics and priorities!</p>
                <button
                  type="button"
                  onClick={() => onNavigate('daily')}
                  className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-[#F4ACB7] hover:bg-[#EB97A4] text-[#4A1D28] text-xs font-bold rounded-xl shadow-xs"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Add First Study Session</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {todaysPlans.map((plan) => {
                  const sub = subjects.find((s) => s.id === plan.subjectId);
                  return (
                    <div
                      key={plan.id}
                      className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all ${
                        plan.completed
                          ? 'bg-[#F9FAF8] border-[#DCE5DC] opacity-75'
                          : 'bg-[#FFFDF9] bg-lined-paper border-[#E8DACB] hover:shadow-xs'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => onTogglePlan(plan.id)}
                        className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center transition-colors shrink-0 ${
                          plan.completed
                            ? 'bg-[#A3B899] text-white'
                            : 'border-2 border-[#D8C7B5] hover:border-[#A3B899] bg-white'
                        }`}
                        title={plan.completed ? 'Mark as incomplete' : 'Mark as completed'}
                      >
                        {plan.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span
                            className="text-[10px] font-bold px-2 py-0.5 rounded-md border"
                            style={{
                              backgroundColor: sub?.color || '#FFE5D9',
                              borderColor: 'rgba(0,0,0,0.08)',
                            }}
                          >
                            {sub?.name || 'General'}
                          </span>
                          <span className="text-xs text-[#8D6E63] font-mono flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {plan.studyTime || 'Anytime'}
                          </span>
                          <span
                            className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
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
                          className={`text-sm font-semibold text-[#3E2723] ${
                            plan.completed ? 'line-through text-[#8D7B74]' : ''
                          }`}
                        >
                          {plan.topic}
                        </h4>
                        {plan.notes && <p className="text-xs text-[#7D6B62] mt-0.5">{plan.notes}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Today's Tasks & Urgent Deadlines Card */}
          <div className="bg-[#FFFDF9] border border-[#E8DCCF] rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#F0E6D8]">
              <div className="flex items-center gap-2">
                <span className="text-lg">✅</span>
                <h3 className="font-serif text-lg font-bold text-[#3E2723]">Today&apos;s Due Tasks</h3>
                <span className="text-xs font-medium text-[#7D6B62] bg-[#FAF2EB] px-2 py-0.5 rounded-full">
                  {todaysTasks.length} tasks
                </span>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('tasks')}
                className="text-xs font-semibold text-[#D87093] hover:text-[#B34568] flex items-center gap-1"
              >
                <span>Task Manager</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {todaysTasks.length === 0 ? (
              <div className="p-6 text-center bg-[#FAF6EE] rounded-xl border border-dashed border-[#E5D2C0]">
                <p className="text-xs text-[#7D6B62]">All caught up on today&apos;s due dates! ✨</p>
                <button
                  type="button"
                  onClick={() => onNavigate('tasks')}
                  className="mt-2 text-xs font-semibold text-[#D87093] hover:underline"
                >
                  + Add a new task
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {todaysTasks.map((task) => {
                  const sub = subjects.find((s) => s.id === task.subjectId);
                  return (
                    <div
                      key={task.id}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                        task.completed
                          ? 'bg-[#F9FAF8] border-[#DCE5DC] opacity-75'
                          : 'bg-[#FFFDF9] border-[#E8DACB]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <button
                          type="button"
                          onClick={() => onToggleTask(task.id)}
                          className={`w-4 h-4 rounded flex items-center justify-center transition-colors shrink-0 ${
                            task.completed
                              ? 'bg-[#A3B899] text-white'
                              : 'border-2 border-[#D8C7B5] hover:border-[#A3B899] bg-white'
                          }`}
                        >
                          {task.completed && <CheckCircle2 className="w-3 h-3" />}
                        </button>
                        <div className="min-w-0">
                          <p
                            className={`text-xs font-semibold text-[#3E2723] truncate ${
                              task.completed ? 'line-through text-[#8D7B74]' : ''
                            }`}
                          >
                            {task.title}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-[#7D6B62]">{sub?.name || 'General'}</span>
                            <span className="text-[10px] text-[#9C7A68]">·</span>
                            <span
                              className={`text-[9px] font-bold ${
                                task.priority === 'High' ? 'text-[#C93B57]' : 'text-[#8D6E63]'
                              }`}
                            >
                              {task.priority} Priority
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Pomodoro Desk Timer, Exam Countdown, Motivational Sticky (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Aesthetic Pomodoro Study Timer */}
          <PomodoroTimer
            subjects={subjects}
            onLogSession={onLogSession}
            soundEnabled={soundEnabled}
          />

          {/* Upcoming Exam Countdown Banner */}
          {nextExam && (
            <div
              onClick={() => onNavigate('exams')}
              className="cursor-pointer group relative bg-gradient-to-br from-[#FFF8F0] to-[#FCE4EC] border border-[#F4ACB7]/60 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all"
            >
              <div className="absolute top-3 right-4 -rotate-3">
                <WashiTape text="Exam Alert" variant="peach" />
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#A63A50] uppercase tracking-wider mb-2">
                <Flame className="w-4 h-4 text-[#E65F78] animate-pulse" />
                <span>Next Upcoming Exam</span>
              </div>
              <h4 className="font-serif font-bold text-base text-[#3E2723] group-hover:text-[#A63A50] transition-colors">
                {nextExam.name}
              </h4>
              <p className="text-xs text-[#7D6B62] mt-1">
                Scheduled for {nextExam.examDate} {nextExam.examTime ? `at ${nextExam.examTime}` : ''}
              </p>

              <div className="mt-4 flex items-center justify-between pt-3 border-t border-[#F2D6DC]">
                <div className="flex items-center gap-2">
                  <HexagonBadge variant="pink" size="sm">
                    <span className="text-xs font-bold">{daysUntilNextExam}</span>
                  </HexagonBadge>
                  <div className="text-xs">
                    <span className="font-bold text-[#3E2723]">
                      {daysUntilNextExam === 0 ? 'Today!' : `${daysUntilNextExam} days left`}
                    </span>
                    <span className="block text-[11px] text-[#7D6B62]">Review syllabus</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#D87093] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Open Prep</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          )}

          {/* Motivational Study Quote Sticky Note */}
          <div className="relative bg-[#FFFBF0] border border-[#EADBBD] rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#7E5739]">
                <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" />
                <span>Daily Study Affirmation</span>
              </div>
              <button
                type="button"
                onClick={nextQuote}
                className="text-[11px] font-medium text-[#A67C52] hover:text-[#5C381E] bg-[#F7EED8] hover:bg-[#EFE2C5] px-2 py-0.5 rounded-md transition-colors"
              >
                New Quote ↻
              </button>
            </div>
            <p className="font-handwriting text-lg text-[#4E342E] leading-relaxed italic">
              &ldquo;{MOTIVATIONAL_QUOTES[quoteIndex].quote}&rdquo;
            </p>
            <div className="text-right text-xs font-semibold text-[#8D6E63] mt-2">
              — {MOTIVATIONAL_QUOTES[quoteIndex].author}
            </div>
          </div>

          {/* Cute Notebook Vignette (Mason Jar Flower & Sleep mask directly from user photo) */}
          <div className="grid grid-cols-2 gap-3 items-center bg-[#FAF4ED] p-4 rounded-2xl border border-[#E8DACB]">
            <div className="flex justify-center">
              <FlowerMasonJar size={75} />
            </div>
            <div>
              <SleepMaskSticker />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
