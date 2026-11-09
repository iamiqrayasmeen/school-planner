import { Subject, DailyPlan, TimetableEntry, Task, Exam, StudyNote, GoalsData, StudySessionLog } from '../types';

export const PASTEL_COLORS = [
  { name: 'Blush Rose', hex: '#F4ACB7', text: '#592532' },
  { name: 'Peach Cream', hex: '#FFE5D9', text: '#5C382A' },
  { name: 'Sage Green', hex: '#D8E2DC', text: '#2D4537' },
  { name: 'Dusty Mint', hex: '#B8D8D8', text: '#1E3F3F' },
  { name: 'Buttercup', hex: '#FDE2BD', text: '#5E401B' },
  { name: 'Lavender Mist', hex: '#E8D7F1', text: '#452C54' },
  { name: 'Soft Sky', hex: '#D0E1FD', text: '#213E6B' },
  { name: 'Warm Taupe', hex: '#E5D4C0', text: '#4A3B2C' },
];

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'sub-1',
    name: 'Cell Biology & Genetics',
    color: '#D8E2DC', // Sage Green
    description: 'Cell structure, organelle mechanisms, DNA replication, and Mendelian genetics.',
    teacher: 'Dr. Evelyn Reed',
    room: 'Science Hall 302',
    createdAt: '2026-10-01',
  },
  {
    id: 'sub-2',
    name: 'Calculus & Statistics',
    color: '#F4ACB7', // Blush Rose
    description: 'Integral calculus applications, series convergence, and inferential probability.',
    teacher: 'Prof. Marcus Chen',
    room: 'Math Building 104',
    createdAt: '2026-10-01',
  },
  {
    id: 'sub-3',
    name: 'World History & Civilizations',
    color: '#FFE5D9', // Peach
    description: 'Industrial revolution, post-war diplomatic treaties, and socio-economic shifts.',
    teacher: 'Dr. Katherine Brooks',
    room: 'Humanities Wing 210',
    createdAt: '2026-10-01',
  },
  {
    id: 'sub-4',
    name: 'English Literature & Poetry',
    color: '#E8D7F1', // Lavender
    description: 'Romantic poetry analysis, narrative structures, and contemporary comparative essays.',
    teacher: 'Prof. Alistair Finch',
    room: 'Library Seminar 4',
    createdAt: '2026-10-01',
  },
];

// Helper to get today's date formatted as YYYY-MM-DD
export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getOffsetDateString(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const INITIAL_DAILY_PLANS: DailyPlan[] = [
  {
    id: 'plan-1',
    date: getTodayDateString(),
    subjectId: 'sub-1',
    topic: 'Mitochondrial respiration & ATP synthesis cycle',
    studyTime: '09:00 - 10:30',
    durationMinutes: 90,
    priority: 'High',
    notes: 'Draw electron transport chain diagrams on lined flashcards.',
    completed: true,
  },
  {
    id: 'plan-2',
    date: getTodayDateString(),
    subjectId: 'sub-2',
    topic: 'Integration by parts & trigonometric substitutions',
    studyTime: '11:00 - 12:30',
    durationMinutes: 90,
    priority: 'High',
    notes: 'Solve problem set 4 exercises 12 through 24.',
    completed: false,
  },
  {
    id: 'plan-3',
    date: getTodayDateString(),
    subjectId: 'sub-4',
    topic: 'Keats Ode on a Grecian Urn thematic analysis',
    studyTime: '14:30 - 16:00',
    durationMinutes: 90,
    priority: 'Medium',
    notes: 'Draft 500-word comparative thesis outline.',
    completed: false,
  },
  {
    id: 'plan-4',
    date: getOffsetDateString(1),
    subjectId: 'sub-3',
    topic: 'Treaty of Versailles impact on Weimar Germany',
    studyTime: '10:00 - 11:30',
    durationMinutes: 90,
    priority: 'Medium',
    notes: 'Read chapter 9 and summarize economic reparations.',
    completed: false,
  },
];

export const INITIAL_TIMETABLE: TimetableEntry[] = [
  {
    id: 'tt-1',
    day: 'Monday',
    subjectId: 'sub-1',
    startTime: '09:00',
    endTime: '10:45',
    location: 'Lab Room 302',
    notes: 'Bring lab coat and safety goggles',
  },
  {
    id: 'tt-2',
    day: 'Monday',
    subjectId: 'sub-2',
    startTime: '13:00',
    endTime: '14:30',
    location: 'Math Hall 104',
    notes: 'Weekly quiz revision',
  },
  {
    id: 'tt-3',
    day: 'Tuesday',
    subjectId: 'sub-3',
    startTime: '10:00',
    endTime: '11:30',
    location: 'Humanities 210',
    notes: 'Discussion seminar on primary sources',
  },
  {
    id: 'tt-4',
    day: 'Tuesday',
    subjectId: 'sub-4',
    startTime: '14:00',
    endTime: '15:30',
    location: 'Library Seminar 4',
    notes: 'Peer review workshop',
  },
  {
    id: 'tt-5',
    day: 'Wednesday',
    subjectId: 'sub-1',
    startTime: '09:30',
    endTime: '11:00',
    location: 'Hall B',
    notes: 'Midterm review lecture',
  },
  {
    id: 'tt-6',
    day: 'Wednesday',
    subjectId: 'sub-2',
    startTime: '13:30',
    endTime: '15:00',
    location: 'Math Hall 104',
    notes: 'Problem solving clinic',
  },
  {
    id: 'tt-7',
    day: 'Thursday',
    subjectId: 'sub-3',
    startTime: '11:00',
    endTime: '12:30',
    location: 'Humanities 210',
    notes: 'Documentary screening',
  },
  {
    id: 'tt-8',
    day: 'Friday',
    subjectId: 'sub-4',
    startTime: '10:00',
    endTime: '12:00',
    location: 'Library Seminar 4',
    notes: 'Final essay presentations & tea',
  },
  {
    id: 'tt-9',
    day: 'Saturday',
    subjectId: 'sub-1',
    startTime: '10:00',
    endTime: '12:00',
    location: 'Home Desk',
    notes: 'Weekly summary & flashcard review',
  },
  {
    id: 'tt-10',
    day: 'Sunday',
    subjectId: 'sub-2',
    startTime: '15:00',
    endTime: '16:30',
    location: 'Coffee Shop / Study Desk',
    notes: 'Next week prep & math drills',
  },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Complete Genetics practice sheet 5',
    subjectId: 'sub-1',
    dueDate: getTodayDateString(),
    priority: 'High',
    completed: true,
    notes: 'Double check dihybrid cross ratios.',
    createdAt: '2026-11-01',
  },
  {
    id: 'task-2',
    title: 'Calculate 10 integration by parts questions',
    subjectId: 'sub-2',
    dueDate: getTodayDateString(),
    priority: 'High',
    completed: false,
    notes: 'Focus on recursive integration reduction formulas.',
    createdAt: '2026-11-02',
  },
  {
    id: 'task-3',
    title: 'Write draft introduction for Romantic Poetry essay',
    subjectId: 'sub-4',
    dueDate: getOffsetDateString(2),
    priority: 'Medium',
    completed: false,
    notes: 'Quote William Wordsworth and John Keats.',
    createdAt: '2026-11-03',
  },
  {
    id: 'task-4',
    title: 'Read chapter 12 on post-WWI economic treaties',
    subjectId: 'sub-3',
    dueDate: getOffsetDateString(3),
    priority: 'Low',
    completed: false,
    notes: 'Highlight key tariff policies and dates.',
    createdAt: '2026-11-04',
  },
  {
    id: 'task-5',
    title: 'Prepare flashcards for Biology midterm',
    subjectId: 'sub-1',
    dueDate: getOffsetDateString(5),
    priority: 'High',
    completed: false,
    notes: '50 terms: enzymes, membrane pumps, glycolysis.',
    createdAt: '2026-11-04',
  },
];

export const INITIAL_EXAMS: Exam[] = [
  {
    id: 'exam-1',
    name: 'Cell Biology Midterm Examination',
    subjectId: 'sub-1',
    examDate: getOffsetDateString(12),
    examTime: '10:00',
    venue: 'Auditorium Hall A',
    notes: 'Covers Chapters 1-6. Worth 30% of final grade.',
    topics: [
      { id: 'top-1', name: 'Prokaryotic vs Eukaryotic organelles', completed: true },
      { id: 'top-2', name: 'Phospholipid bilayer & active transport', completed: true },
      { id: 'top-3', name: 'Cellular respiration & Krebs cycle', completed: false },
      { id: 'top-4', name: 'Photosynthesis light & dark reactions', completed: false },
      { id: 'top-5', name: 'Mitosis and Meiosis checkpoints', completed: false },
    ],
  },
  {
    id: 'exam-2',
    name: 'Calculus II Comprehensive Test',
    subjectId: 'sub-2',
    examDate: getOffsetDateString(19),
    examTime: '13:30',
    venue: 'Math Hall 201',
    notes: 'Formula sheet will be provided. No graphing calculator.',
    topics: [
      { id: 'top-6', name: 'Integration techniques & substitutions', completed: true },
      { id: 'top-7', name: 'Improper integrals & convergence tests', completed: false },
      { id: 'top-8', name: 'Taylor and Maclaurin polynomial series', completed: false },
      { id: 'top-9', name: 'Differential equations first order', completed: false },
    ],
  },
  {
    id: 'exam-3',
    name: 'Modern World History Term Paper Due',
    subjectId: 'sub-3',
    examDate: getOffsetDateString(26),
    examTime: '23:59',
    venue: 'Online Portal Submission',
    notes: '3,000 words in Chicago citation format with 8 primary sources.',
    topics: [
      { id: 'top-10', name: 'Outline annotated bibliography', completed: true },
      { id: 'top-11', name: 'Primary source archival research', completed: true },
      { id: 'top-12', name: 'Draft sections 1 to 3', completed: false },
      { id: 'top-13', name: 'Proofreading & formatting bibliography', completed: false },
    ],
  },
];

export const INITIAL_NOTES: StudyNote[] = [
  {
    id: 'note-1',
    title: '🌿 Cellular Respiration Master Summary',
    subjectId: 'sub-1',
    paperStyle: 'lined',
    isPinned: true,
    content: `Glycolysis: Occurs in cytoplasm. Net 2 ATP, 2 NADH, 2 Pyruvate.
Pyruvate Oxidation: Enters mitochondrial matrix via transport protein. Yields Acetyl-CoA.
Citric Acid Cycle (Krebs): 2 turns per glucose. Yields 6 NADH, 2 FADH2, 2 ATP, 4 CO2.
Oxidative Phosphorylation: Inner membrane cristae. Chemiosmosis driven by ATP synthase.
Proton gradient pH difference drives rotational catalytic site! Total yield ~30-32 ATP.`,
    createdAt: '2026-11-03T10:30:00Z',
    updatedAt: '2026-11-04T12:00:00Z',
  },
  {
    id: 'note-2',
    title: '📐 Calculus Integration Cheatsheet',
    subjectId: 'sub-2',
    paperStyle: 'grid',
    isPinned: true,
    content: `Integration by Parts: ∫ u dv = uv - ∫ v du
LIATE Rule for picking u:
  L - Logarithmic (ln x)
  I - Inverse trig (arctan x)
  A - Algebraic (x², 3x)
  T - Trigonometric (sin x)
  E - Exponential (eˣ)

Trig identities: sin²x + cos²x = 1, tan²x + 1 = sec²x
Half-angle formulas: sin²x = (1 - cos 2x)/2`,
    createdAt: '2026-11-02T14:15:00Z',
    updatedAt: '2026-11-02T14:15:00Z',
  },
  {
    id: 'note-3',
    title: '🌸 Literary Devices in Romantic Poetry',
    subjectId: 'sub-4',
    paperStyle: 'lined',
    isPinned: false,
    content: `1. Negative Capability (Keats) - The capacity to exist in uncertainties and mysteries without irritable reaching after fact & reason.
2. Sublime (Wordsworth, Burke) - Feeling of overwhelming awe tinged with terror when contemplating infinite nature.
3. Synesthesia - Blending of sensory descriptions ("soft fragrance of twilight sounds").`,
    createdAt: '2026-11-05T09:20:00Z',
    updatedAt: '2026-11-05T09:20:00Z',
  },
];

export const INITIAL_GOALS: GoalsData = {
  dailyTargetHours: 4,
  weeklyTargetHours: 24,
  dailyGoals: [
    { id: 'dg-1', title: 'Complete 3 focused Pomodoro sessions (90 mins total)', completed: true, target: '3 sessions' },
    { id: 'dg-2', title: 'Review today\'s biology lecture notes and sketch diagrams', completed: true, target: 'Biology' },
    { id: 'dg-3', title: 'Solve 10 calculus integral problems without solutions', completed: false, target: 'Calculus' },
    { id: 'dg-4', title: 'Read 20 pages of History Chapter 9 before 9 PM', completed: false, target: 'History' },
  ],
  weeklyGoals: [
    { id: 'wg-1', title: 'Achieve 20+ total study hours logged this week', completed: true, target: '20 hrs' },
    { id: 'wg-2', title: 'Finish biology midterm syllabus topic 3 and 4', completed: false, target: 'Syllabus' },
    { id: 'wg-3', title: 'Draft poetry essay thesis and outline', completed: false, target: 'Essay' },
    { id: 'wg-4', title: 'Organize study desk, binders & wash water bottle on Sunday', completed: false, target: 'Routine' },
  ],
};

export const INITIAL_STUDY_LOGS: StudySessionLog[] = [
  { id: 'log-1', date: getOffsetDateString(-6), subjectId: 'sub-1', minutes: 120, topic: 'Cell division & cytokinesis' },
  { id: 'log-2', date: getOffsetDateString(-5), subjectId: 'sub-2', minutes: 150, topic: 'Integration techniques' },
  { id: 'log-3', date: getOffsetDateString(-4), subjectId: 'sub-3', minutes: 90, topic: 'WWI treaty summaries' },
  { id: 'log-4', date: getOffsetDateString(-3), subjectId: 'sub-4', minutes: 110, topic: 'Romantic poetry analysis' },
  { id: 'log-5', date: getOffsetDateString(-2), subjectId: 'sub-1', minutes: 135, topic: 'Enzyme kinetics & thermodynamics' },
  { id: 'log-6', date: getOffsetDateString(-1), subjectId: 'sub-2', minutes: 180, topic: 'Taylor polynomials problem set' },
  { id: 'log-7', date: getTodayDateString(), subjectId: 'sub-1', minutes: 90, topic: 'Mitochondrial respiration' },
];

export const MOTIVATIONAL_QUOTES = [
  { quote: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" },
  { quote: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
  { quote: "There are no secrets to success. It is the result of preparation, hard work, and learning from failure.", author: "Colin Powell" },
  { quote: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
  { quote: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { quote: "Bloom where you are planted, and study with patience.", author: "Aesthetic Journal Note 🌸" },
  { quote: "You don't have to be extreme, just consistent.", author: "Study Reminder ✨" },
  { quote: "The future belongs to those who prepare for it today.", author: "Malcolm X" },
];
