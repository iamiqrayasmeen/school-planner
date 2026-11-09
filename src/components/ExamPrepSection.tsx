import React, { useState } from 'react';
import {
  GraduationCap,
  Plus,
  Clock,
  CheckCircle2,
  Calendar,
  MapPin,
  Trash2,
  Check,
  Flame,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { Exam, Subject, ExamTopic } from '../types';
import { getTodayDateString } from '../data/initialData';
import { HexagonBadge, WashiTape, FloralSprigCorner } from './FloralDecorations';

interface ExamPrepSectionProps {
  subjects: Subject[];
  exams: Exam[];
  onAddExam: (exam: Omit<Exam, 'id'>) => void;
  onToggleTopic: (examId: string, topicId: string) => void;
  onAddTopicToExam: (examId: string, topicName: string) => void;
  onDeleteTopicFromExam: (examId: string, topicId: string) => void;
  onDeleteExam: (examId: string) => void;
}

export const ExamPrepSection: React.FC<ExamPrepSectionProps> = ({
  subjects,
  exams,
  onAddExam,
  onToggleTopic,
  onAddTopicToExam,
  onDeleteTopicFromExam,
  onDeleteExam,
}) => {
  const todayStr = getTodayDateString();
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newTopicInputs, setNewTopicInputs] = useState<Record<string, string>>({});

  // Form states for new exam
  const [examName, setExamName] = useState<string>('');
  const [subjectId, setSubjectId] = useState<string>(subjects[0]?.id || '');
  const [examDate, setExamDate] = useState<string>(todayStr);
  const [examTime, setExamTime] = useState<string>('09:00');
  const [venue, setVenue] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [rawTopics, setRawTopics] = useState<string>(
    'Unit 1 Fundamentals\nUnit 2 Core Concepts\nProblem Solving Practice'
  );

  const calculateDaysLeft = (dateStr: string) => {
    const target = new Date(dateStr + 'T00:00:00').getTime();
    const now = new Date(todayStr + 'T00:00:00').getTime();
    const diffDays = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examName.trim()) return;

    const topicLines = rawTopics
      .split('\n')
      .map((t) => t.trim())
      .filter(Boolean);

    const topics: ExamTopic[] = topicLines.map((t, idx) => ({
      id: `topic-${Date.now()}-${idx}`,
      name: t,
      completed: false,
    }));

    onAddExam({
      name: examName.trim(),
      subjectId,
      examDate,
      examTime,
      venue: venue.trim(),
      notes: notes.trim(),
      topics,
    });

    setExamName('');
    setVenue('');
    setNotes('');
    setShowAddModal(false);
  };

  const handleAddNewTopic = (examId: string) => {
    const text = newTopicInputs[examId]?.trim();
    if (!text) return;
    onAddTopicToExam(examId, text);
    setNewTopicInputs((prev) => ({ ...prev, [examId]: '' }));
  };

  const sortedExams = [...exams].sort(
    (a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime()
  );

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
              <WashiTape text="Exam Master Plan" variant="floral" />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#3E2723]">
              Exam Preparation & Syllabus Tracker
            </h2>
            <p className="text-xs sm:text-sm text-[#7D6B62] mt-0.5">
              Keep track of exam dates, countdown timers, and check off syllabus topics as you revise.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-[#A3B899] hover:bg-[#8DA382] text-white font-semibold text-sm shadow-sm transition-all shrink-0 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule New Exam</span>
          </button>
        </div>
      </div>

      {/* Exam Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sortedExams.map((exam) => {
          const sub = subjects.find((s) => s.id === exam.subjectId);
          const daysLeft = calculateDaysLeft(exam.examDate);
          const totalTopics = exam.topics.length;
          const completedTopics = exam.topics.filter((t) => t.completed).length;
          const syllabusProgress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

          return (
            <div
              key={exam.id}
              className="bg-[#FFFDF9] border border-[#E8DCCF] rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header: Badge, Title & Countdown */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#F0E6D8]">
                  <div className="min-w-0">
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-md border text-[#3E2723] inline-block mb-1.5"
                      style={{ backgroundColor: sub?.color || '#FFE5D9' }}
                    >
                      {sub?.name || 'Subject'}
                    </span>
                    <h3 className="font-serif font-bold text-lg text-[#3E2723] leading-snug">
                      {exam.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#7D6B62] mt-1 font-mono">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#A3B899]" />
                        {exam.examDate}
                      </span>
                      {exam.examTime && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#A3B899]" />
                          {exam.examTime}
                        </span>
                      )}
                      {exam.venue && (
                        <span className="flex items-center gap-1 font-sans">
                          <MapPin className="w-3.5 h-3.5 text-[#D87093]" />
                          {exam.venue}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Countdown Badge */}
                  <div className="flex flex-col items-center shrink-0">
                    <HexagonBadge
                      variant={daysLeft <= 7 ? 'pink' : daysLeft <= 14 ? 'sage' : 'cream'}
                      size="md"
                    >
                      <div className="text-center">
                        <span className="text-base font-bold block leading-none">
                          {daysLeft < 0 ? 'Passed' : daysLeft === 0 ? 'Today' : daysLeft}
                        </span>
                        {daysLeft > 0 && <span className="text-[9px] uppercase font-semibold">days</span>}
                      </div>
                    </HexagonBadge>
                  </div>
                </div>

                {/* Syllabus Progress Bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-[#5C4537]">
                      Syllabus Mastery ({completedTopics}/{totalTopics} topics)
                    </span>
                    <span className="font-mono font-bold text-[#3E2723] tabular-nums">
                      {syllabusProgress}%
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-[#F0E6D8] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#F4ACB7] to-[#A3B899] transition-all duration-300 rounded-full"
                      style={{ width: `${syllabusProgress}%` }}
                    />
                  </div>
                </div>

                {/* Syllabus Topics Checklist */}
                <div className="mt-4 pt-3 border-t border-[#F0E6D8]">
                  <h4 className="text-xs font-bold text-[#6D5A50] mb-2 uppercase tracking-wider">
                    Syllabus Topics Checklist
                  </h4>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {exam.topics.map((t) => (
                      <div
                        key={t.id}
                        className="flex items-center justify-between p-2 rounded-xl bg-[#FAF6EE] hover:bg-[#F5EFE6] transition-colors text-xs"
                      >
                        <button
                          type="button"
                          onClick={() => onToggleTopic(exam.id, t.id)}
                          className="flex items-center gap-2 text-left min-w-0 flex-1"
                        >
                          <div
                            className={`w-4 h-4 rounded-md flex items-center justify-center transition-colors shrink-0 ${
                              t.completed
                                ? 'bg-[#A3B899] text-white'
                                : 'border border-[#C8B8A6] bg-white'
                            }`}
                          >
                            {t.completed && <Check className="w-3 h-3" />}
                          </div>
                          <span
                            className={`truncate ${
                              t.completed ? 'line-through text-[#8D7B74]' : 'text-[#3E2723]'
                            }`}
                          >
                            {t.name}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onDeleteTopicFromExam(exam.id, t.id)}
                          className="p-1 text-[#A0887A] hover:text-[#9C324E] transition-colors"
                          title="Remove topic"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add topic input row */}
                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[#F0E6D8]">
                    <input
                      type="text"
                      value={newTopicInputs[exam.id] || ''}
                      onChange={(e) =>
                        setNewTopicInputs({ ...newTopicInputs, [exam.id]: e.target.value })
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddNewTopic(exam.id);
                        }
                      }}
                      placeholder="Add another syllabus topic..."
                      className="flex-1 px-3 py-1.5 rounded-xl border border-[#D8C7B5] bg-white text-xs text-[#3E2723] focus:outline-none focus:border-[#A3B899]"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddNewTopic(exam.id)}
                      className="px-3 py-1.5 rounded-xl bg-[#FAF2EB] hover:bg-[#EFE6DA] text-xs font-bold text-[#5C4537] border border-[#E8DACB]"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Card Footer: Exam Delete */}
              <div className="mt-4 pt-3 border-t border-[#F0E6D8] flex items-center justify-between text-xs text-[#8D6E63]">
                {exam.notes ? (
                  <span className="italic truncate max-w-xs">{exam.notes}</span>
                ) : (
                  <span>Keep practicing! 🌸</span>
                )}
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Delete "${exam.name}"?`)) {
                      onDeleteExam(exam.id);
                    }
                  }}
                  className="text-xs font-semibold text-[#A64B5E] hover:underline"
                >
                  Delete Exam
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Exam Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-[#FFFDF9] rounded-3xl border border-[#E8DCCF] max-w-lg w-full p-6 shadow-2xl relative animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0E6D8] mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎯</span>
                <h3 className="font-serif font-bold text-lg text-[#3E2723]">Schedule Exam</h3>
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
                  Exam Title / Examination Name *
                </label>
                <input
                  type="text"
                  value={examName}
                  onChange={(e) => setExamName(e.target.value)}
                  placeholder="e.g. Organic Chemistry Midterm"
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#5C4537] mb-1">
                    Exam Date *
                  </label>
                  <input
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D8C7B5] bg-white text-xs text-[#3E2723] focus:outline-none focus:border-[#A3B899]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5C4537] mb-1">
                    Exam Time
                  </label>
                  <input
                    type="time"
                    value={examTime}
                    onChange={(e) => setExamTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D8C7B5] bg-white text-xs text-[#3E2723] focus:outline-none focus:border-[#A3B899]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5C4537] mb-1">
                  Venue / Location / Hall
                </label>
                <input
                  type="text"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="e.g. Science Auditorium Room 102"
                  className="w-full px-3 py-2 rounded-xl border border-[#D8C7B5] bg-white text-xs text-[#3E2723] focus:outline-none focus:border-[#A3B899]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5C4537] mb-1">
                  Syllabus Topics (One per line)
                </label>
                <textarea
                  value={rawTopics}
                  onChange={(e) => setRawTopics(e.target.value)}
                  placeholder="Enter each topic on a new line..."
                  rows={4}
                  className="w-full p-3 rounded-xl border border-[#D8C7B5] bg-white text-xs text-[#3E2723] focus:outline-none focus:border-[#A3B899]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5C4537] mb-1">
                  Exam Notes & Weighting
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Worth 25%, formula sheet provided"
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
                  Schedule Exam
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
