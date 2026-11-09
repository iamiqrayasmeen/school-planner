/**
 * My Study Planner 🌸 - Data Types & Models
 */

export type Priority = 'High' | 'Medium' | 'Low';

export interface Subject {
  id: string;
  name: string;
  color: string;
  description: string;
  teacher?: string;
  room?: string;
  createdAt: string;
}

export interface DailyPlan {
  id: string;
  date: string; // YYYY-MM-DD
  subjectId: string;
  topic: string;
  studyTime: string; // e.g. "09:00 - 10:30" or "14:00"
  durationMinutes: number; // e.g. 60
  priority: Priority;
  notes: string;
  completed: boolean;
}

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface TimetableEntry {
  id: string;
  day: DayOfWeek;
  subjectId: string;
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  location?: string;
  notes?: string;
}

export interface Task {
  id: string;
  title: string;
  subjectId: string;
  dueDate: string; // YYYY-MM-DD
  priority: Priority;
  completed: boolean;
  notes?: string;
  createdAt: string;
}

export interface ExamTopic {
  id: string;
  name: string;
  completed: boolean;
}

export interface Exam {
  id: string;
  name: string;
  subjectId: string;
  examDate: string; // YYYY-MM-DD
  examTime?: string; // HH:MM
  venue?: string;
  topics: ExamTopic[];
  notes?: string;
}

export interface StudyNote {
  id: string;
  title: string;
  subjectId: string;
  content: string;
  paperStyle: 'lined' | 'grid' | 'blank';
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GoalItem {
  id: string;
  title: string;
  completed: boolean;
  target?: string;
}

export interface GoalsData {
  dailyTargetHours: number;
  weeklyTargetHours: number;
  dailyGoals: GoalItem[];
  weeklyGoals: GoalItem[];
}

export interface StudySessionLog {
  id: string;
  date: string; // YYYY-MM-DD
  subjectId: string;
  minutes: number;
  topic: string;
}
