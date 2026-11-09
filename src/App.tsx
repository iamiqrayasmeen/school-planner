/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Subject,
  DailyPlan,
  TimetableEntry,
  Task,
  Exam,
  StudyNote,
  GoalsData,
  StudySessionLog,
} from './types';
import {
  INITIAL_SUBJECTS,
  INITIAL_DAILY_PLANS,
  INITIAL_TIMETABLE,
  INITIAL_TASKS,
  INITIAL_EXAMS,
  INITIAL_NOTES,
  INITIAL_GOALS,
  INITIAL_STUDY_LOGS,
  getTodayDateString,
} from './data/initialData';
import { Navigation, NavTabId } from './components/Navigation';
import { HomeSection } from './components/HomeSection';
import { SubjectsSection } from './components/SubjectsSection';
import { DailyPlannerSection } from './components/DailyPlannerSection';
import { WeeklyTimetableSection } from './components/WeeklyTimetableSection';
import { TaskManagerSection } from './components/TaskManagerSection';
import { CalendarSection } from './components/CalendarSection';
import { StudyNotesSection } from './components/StudyNotesSection';
import { ExamPrepSection } from './components/ExamPrepSection';
import { StudyProgressSection } from './components/StudyProgressSection';
import { StudyGoalsSection } from './components/StudyGoalsSection';
import { Footer } from './components/Footer';
import { InspirationModal } from './components/InspirationModal';
import { DiscboundRings } from './components/FloralDecorations';

// LocalStorage Keys
const STORAGE_KEYS = {
  SUBJECTS: 'my_study_planner_subjects_v1',
  PLANS: 'my_study_planner_daily_plans_v1',
  TIMETABLE: 'my_study_planner_timetable_v1',
  TASKS: 'my_study_planner_tasks_v1',
  EXAMS: 'my_study_planner_exams_v1',
  NOTES: 'my_study_planner_notes_v1',
  GOALS: 'my_study_planner_goals_v1',
  LOGS: 'my_study_planner_logs_v1',
  SOUND: 'my_study_planner_sound_v1',
  TAB: 'my_study_planner_active_tab_v1',
};

export default function App() {
  // Navigation & UI State
  const [activeTab, setActiveTab] = useState<NavTabId>(() => {
    return (localStorage.getItem(STORAGE_KEYS.TAB) as NavTabId) || 'home';
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SOUND);
    return saved !== null ? saved === 'true' : true;
  });
  const [isInspirationOpen, setIsInspirationOpen] = useState<boolean>(false);

  // Core Data States with LocalStorage Initialization
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
      return saved ? JSON.parse(saved) : INITIAL_SUBJECTS;
    } catch {
      return INITIAL_SUBJECTS;
    }
  });

  const [dailyPlans, setDailyPlans] = useState<DailyPlan[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PLANS);
      return saved ? JSON.parse(saved) : INITIAL_DAILY_PLANS;
    } catch {
      return INITIAL_DAILY_PLANS;
    }
  });

  const [timetable, setTimetable] = useState<TimetableEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TIMETABLE);
      return saved ? JSON.parse(saved) : INITIAL_TIMETABLE;
    } catch {
      return INITIAL_TIMETABLE;
    }
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
      return saved ? JSON.parse(saved) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  const [exams, setExams] = useState<Exam[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EXAMS);
      return saved ? JSON.parse(saved) : INITIAL_EXAMS;
    } catch {
      return INITIAL_EXAMS;
    }
  });

  const [notes, setNotes] = useState<StudyNote[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTES);
      return saved ? JSON.parse(saved) : INITIAL_NOTES;
    } catch {
      return INITIAL_NOTES;
    }
  });

  const [goals, setGoals] = useState<GoalsData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GOALS);
      return saved ? JSON.parse(saved) : INITIAL_GOALS;
    } catch {
      return INITIAL_GOALS;
    }
  });

  const [studyLogs, setStudyLogs] = useState<StudySessionLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LOGS);
      return saved ? JSON.parse(saved) : INITIAL_STUDY_LOGS;
    } catch {
      return INITIAL_STUDY_LOGS;
    }
  });

  // LocalStorage Synchronization Effects
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TAB, activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SOUND, String(soundEnabled));
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(dailyPlans));
  }, [dailyPlans]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TIMETABLE, JSON.stringify(timetable));
  }, [timetable]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(exams));
  }, [exams]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(studyLogs));
  }, [studyLogs]);

  // Audio helper
  const triggerAudio = (type: 'chime' | 'rustle') => {
    if (!soundEnabled || typeof window === 'undefined') return;
    const audio = (window as any).StudyPlannerAudio;
    if (audio) {
      if (type === 'chime') audio.playChime();
      else if (type === 'rustle') audio.playPaperRustle();
    }
  };

  // Subject Handlers
  const handleAddSubject = (newSubject: Omit<Subject, 'id' | 'createdAt'>) => {
    const sub: Subject = {
      ...newSubject,
      id: `sub-${Date.now()}`,
      createdAt: getTodayDateString(),
    };
    setSubjects((prev) => [...prev, sub]);
    triggerAudio('chime');
  };

  const handleEditSubject = (id: string, updated: Partial<Subject>) => {
    setSubjects((prev) => prev.map((s) => (s.id === id ? { ...s, ...updated } : s)));
    triggerAudio('rustle');
  };

  const handleDeleteSubject = (id: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
    triggerAudio('rustle');
  };

  // Daily Plan Handlers
  const handleAddPlan = (newPlan: Omit<DailyPlan, 'id' | 'completed'>) => {
    const plan: DailyPlan = {
      ...newPlan,
      id: `plan-${Date.now()}`,
      completed: false,
    };
    setDailyPlans((prev) => [...prev, plan]);
    triggerAudio('chime');
  };

  const handleEditPlan = (id: string, updated: Partial<DailyPlan>) => {
    setDailyPlans((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)));
    triggerAudio('rustle');
  };

  const handleDeletePlan = (id: string) => {
    setDailyPlans((prev) => prev.filter((p) => p.id !== id));
    triggerAudio('rustle');
  };

  const handleTogglePlan = (id: string) => {
    setDailyPlans((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextState = !p.completed;
          if (nextState) triggerAudio('chime');
          return { ...p, completed: nextState };
        }
        return p;
      })
    );
  };

  // Timetable Handlers
  const handleAddTimetableEntry = (newEntry: Omit<TimetableEntry, 'id'>) => {
    const entry: TimetableEntry = {
      ...newEntry,
      id: `tt-${Date.now()}`,
    };
    setTimetable((prev) => [...prev, entry]);
    triggerAudio('chime');
  };

  const handleEditTimetableEntry = (id: string, updated: Partial<TimetableEntry>) => {
    setTimetable((prev) => prev.map((t) => (t.id === id ? { ...t, ...updated } : t)));
    triggerAudio('rustle');
  };

  const handleDeleteTimetableEntry = (id: string) => {
    setTimetable((prev) => prev.filter((t) => t.id !== id));
    triggerAudio('rustle');
  };

  // Task Handlers
  const handleAddTask = (newTask: Omit<Task, 'id' | 'createdAt'>) => {
    const task: Task = {
      ...newTask,
      id: `task-${Date.now()}`,
      createdAt: getTodayDateString(),
    };
    setTasks((prev) => [task, ...prev]);
    triggerAudio('chime');
  };

  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextState = !t.completed;
          if (nextState) triggerAudio('chime');
          return { ...t, completed: nextState };
        }
        return t;
      })
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    triggerAudio('rustle');
  };

  // Exam Handlers
  const handleAddExam = (newExam: Omit<Exam, 'id'>) => {
    const exam: Exam = {
      ...newExam,
      id: `exam-${Date.now()}`,
    };
    setExams((prev) => [...prev, exam]);
    triggerAudio('chime');
  };

  const handleToggleExamTopic = (examId: string, topicId: string) => {
    setExams((prev) =>
      prev.map((e) => {
        if (e.id === examId) {
          const updatedTopics = e.topics.map((top) =>
            top.id === topicId ? { ...top, completed: !top.completed } : top
          );
          triggerAudio('chime');
          return { ...e, topics: updatedTopics };
        }
        return e;
      })
    );
  };

  const handleAddTopicToExam = (examId: string, topicName: string) => {
    setExams((prev) =>
      prev.map((e) => {
        if (e.id === examId) {
          const newTopic = {
            id: `topic-${Date.now()}`,
            name: topicName,
            completed: false,
          };
          return { ...e, topics: [...e.topics, newTopic] };
        }
        return e;
      })
    );
  };

  const handleDeleteTopicFromExam = (examId: string, topicId: string) => {
    setExams((prev) =>
      prev.map((e) => {
        if (e.id === examId) {
          return { ...e, topics: e.topics.filter((top) => top.id !== topicId) };
        }
        return e;
      })
    );
  };

  const handleDeleteExam = (examId: string) => {
    setExams((prev) => prev.filter((e) => e.id !== examId));
    triggerAudio('rustle');
  };

  // Note Handlers
  const handleAddNote = (newNote: Omit<StudyNote, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const note: StudyNote = {
      ...newNote,
      id: `note-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    setNotes((prev) => [note, ...prev]);
    triggerAudio('chime');
  };

  const handleEditNote = (id: string, updated: Partial<StudyNote>) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...updated, updatedAt: new Date().toISOString() } : n))
    );
    triggerAudio('rustle');
  };

  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    triggerAudio('rustle');
  };

  const handleTogglePinNote = (id: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isPinned: !n.isPinned } : n))
    );
    triggerAudio('rustle');
  };

  // Study Session Log Handler
  const handleLogStudySession = (
    subjectId: string,
    minutes: number,
    topic: string,
    date?: string
  ) => {
    const newLog: StudySessionLog = {
      id: `log-${Date.now()}`,
      date: date || getTodayDateString(),
      subjectId,
      minutes,
      topic: topic || 'Study Session',
    };
    setStudyLogs((prev) => [...prev, newLog]);
    triggerAudio('chime');
  };

  // Reset to Sample Data
  const handleResetData = () => {
    if (
      window.confirm(
        'Reset your study planner to the beautiful initial sample data? This will replace any custom entries with the default starter set.'
      )
    ) {
      setSubjects(INITIAL_SUBJECTS);
      setDailyPlans(INITIAL_DAILY_PLANS);
      setTimetable(INITIAL_TIMETABLE);
      setTasks(INITIAL_TASKS);
      setExams(INITIAL_EXAMS);
      setNotes(INITIAL_NOTES);
      setGoals(INITIAL_GOALS);
      setStudyLogs(INITIAL_STUDY_LOGS);
      triggerAudio('chime');
    }
  };

  // Export / Backup Data to JSON
  const handleExportData = () => {
    const backup = {
      version: 1,
      exportedAt: new Date().toISOString(),
      subjects,
      dailyPlans,
      timetable,
      tasks,
      exams,
      notes,
      goals,
      studyLogs,
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `my-study-planner-backup-${getTodayDateString()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Total Study Minutes calculated from logs
  const totalStudyMinutes = studyLogs.reduce((acc, curr) => acc + curr.minutes, 0);

  return (
    <div className="min-h-screen bg-[#F8F4ED] text-[#4A3B32] flex flex-col font-sans selection:bg-[#FAD2E1] selection:text-[#503038]">
      {/* Top Navigation & Binder Tabs */}
      <Navigation
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          triggerAudio('rustle');
        }}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        onOpenInspiration={() => setIsInspirationOpen(true)}
        onResetData={handleResetData}
        onExportData={handleExportData}
      />

      {/* Main Journal Page Container with physical planner layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6">
        <div className="relative flex">
          {/* Decorative discbound rings spine along the desktop left margin */}
          <div className="hidden 2xl:block w-10 shrink-0 mr-4">
            <DiscboundRings count={10} className="fixed top-28 left-6" />
          </div>

          {/* Active Journal Tab View */}
          <div className="flex-1 min-w-0 transition-opacity duration-200">
            {activeTab === 'home' && (
              <HomeSection
                subjects={subjects}
                dailyPlans={dailyPlans}
                tasks={tasks}
                exams={exams}
                totalStudyMinutes={totalStudyMinutes}
                onNavigate={(t) => {
                  setActiveTab(t);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onToggleTask={handleToggleTask}
                onTogglePlan={handleTogglePlan}
                onLogSession={handleLogStudySession}
                soundEnabled={soundEnabled}
              />
            )}

            {activeTab === 'subjects' && (
              <SubjectsSection
                subjects={subjects}
                tasks={tasks}
                dailyPlans={dailyPlans}
                notes={notes}
                onAddSubject={handleAddSubject}
                onEditSubject={handleEditSubject}
                onDeleteSubject={handleDeleteSubject}
              />
            )}

            {activeTab === 'daily' && (
              <DailyPlannerSection
                subjects={subjects}
                dailyPlans={dailyPlans}
                onAddPlan={handleAddPlan}
                onEditPlan={handleEditPlan}
                onDeletePlan={handleDeletePlan}
                onTogglePlan={handleTogglePlan}
              />
            )}

            {activeTab === 'weekly' && (
              <WeeklyTimetableSection
                subjects={subjects}
                timetable={timetable}
                onAddEntry={handleAddTimetableEntry}
                onEditEntry={handleEditTimetableEntry}
                onDeleteEntry={handleDeleteTimetableEntry}
              />
            )}

            {activeTab === 'tasks' && (
              <TaskManagerSection
                subjects={subjects}
                tasks={tasks}
                onAddTask={handleAddTask}
                onToggleTask={handleToggleTask}
                onDeleteTask={handleDeleteTask}
                soundEnabled={soundEnabled}
              />
            )}

            {activeTab === 'calendar' && (
              <CalendarSection
                subjects={subjects}
                tasks={tasks}
                exams={exams}
                dailyPlans={dailyPlans}
                onAddTask={handleAddTask}
                onAddExam={handleAddExam}
              />
            )}

            {activeTab === 'notes' && (
              <StudyNotesSection
                subjects={subjects}
                notes={notes}
                onAddNote={handleAddNote}
                onEditNote={handleEditNote}
                onDeleteNote={handleDeleteNote}
                onTogglePin={handleTogglePinNote}
              />
            )}

            {activeTab === 'exams' && (
              <ExamPrepSection
                subjects={subjects}
                exams={exams}
                onAddExam={handleAddExam}
                onToggleTopic={handleToggleExamTopic}
                onAddTopicToExam={handleAddTopicToExam}
                onDeleteTopicFromExam={handleDeleteTopicFromExam}
                onDeleteExam={handleDeleteExam}
              />
            )}

            {activeTab === 'progress' && (
              <StudyProgressSection
                subjects={subjects}
                tasks={tasks}
                studyLogs={studyLogs}
                dailyPlans={dailyPlans}
                onLogStudySession={handleLogStudySession}
              />
            )}

            {activeTab === 'goals' && (
              <StudyGoalsSection
                goals={goals}
                onUpdateGoals={(newGoals) => {
                  setGoals(newGoals);
                  triggerAudio('rustle');
                }}
              />
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer
        onNavigate={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenInspiration={() => setIsInspirationOpen(true)}
      />

      {/* Inspiration Modal */}
      <InspirationModal
        isOpen={isInspirationOpen}
        onClose={() => setIsInspirationOpen(false)}
      />
    </div>
  );
}
