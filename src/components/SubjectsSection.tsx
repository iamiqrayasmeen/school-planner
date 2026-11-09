import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Check,
  User,
  MapPin,
  Clock,
  CheckCircle2,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import { Subject, Task, DailyPlan, StudyNote } from '../types';
import { PASTEL_COLORS } from '../data/initialData';
import { WashiTape, FloralSprigCorner } from './FloralDecorations';

interface SubjectsSectionProps {
  subjects: Subject[];
  tasks: Task[];
  dailyPlans: DailyPlan[];
  notes: StudyNote[];
  onAddSubject: (subject: Omit<Subject, 'id' | 'createdAt'>) => void;
  onEditSubject: (id: string, updated: Partial<Subject>) => void;
  onDeleteSubject: (id: string) => void;
}

export const SubjectsSection: React.FC<SubjectsSectionProps> = ({
  subjects,
  tasks,
  dailyPlans,
  notes,
  onAddSubject,
  onEditSubject,
  onDeleteSubject,
}) => {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  // Form states
  const [name, setName] = useState<string>('');
  const [color, setColor] = useState<string>(PASTEL_COLORS[0].hex);
  const [description, setDescription] = useState<string>('');
  const [teacher, setTeacher] = useState<string>('');
  const [room, setRoom] = useState<string>('');
  const [error, setError] = useState<string>('');

  const openAddModal = () => {
    setEditingSubject(null);
    setName('');
    setColor(PASTEL_COLORS[Math.floor(Math.random() * PASTEL_COLORS.length)].hex);
    setDescription('');
    setTeacher('');
    setRoom('');
    setError('');
    setShowAddModal(true);
  };

  const openEditModal = (sub: Subject) => {
    setEditingSubject(sub);
    setName(sub.name);
    setColor(sub.color);
    setDescription(sub.description);
    setTeacher(sub.teacher || '');
    setRoom(sub.room || '');
    setError('');
    setShowAddModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a subject name.');
      return;
    }

    if (editingSubject) {
      onEditSubject(editingSubject.id, {
        name: name.trim(),
        color,
        description: description.trim(),
        teacher: teacher.trim(),
        room: room.trim(),
      });
    } else {
      onAddSubject({
        name: name.trim(),
        color,
        description: description.trim(),
        teacher: teacher.trim(),
        room: room.trim(),
      });
    }

    setShowAddModal(false);
  };

  const handleDelete = (id: string, subName: string) => {
    if (window.confirm(`Are you sure you want to delete "${subName}"? Tasks and plans associated with it will remain.`)) {
      onDeleteSubject(id);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="relative bg-[#FFFDF9] border border-[#E8DCCF] rounded-3xl p-6 sm:p-8 shadow-sm overflow-hidden">
        <div className="absolute top-0 right-0 pointer-events-none">
          <FloralSprigCorner flipped className="opacity-75 -mt-2 -mr-2" />
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <WashiTape text="Academic Subjects" variant="sage" />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#3E2723]">
              My Study Subjects & Courses
            </h2>
            <p className="text-sm text-[#7D6B62] mt-1">
              Organize your curriculum, track tasks by course, and personalize your color-coded binders.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-[#A3B899] hover:bg-[#8DA382] text-white font-semibold text-sm shadow-sm hover:shadow transition-all shrink-0 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Subject</span>
          </button>
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {subjects.map((sub) => {
          const subTasks = tasks.filter((t) => t.subjectId === sub.id);
          const subCompletedTasks = subTasks.filter((t) => t.completed).length;
          const subPlans = dailyPlans.filter((p) => p.subjectId === sub.id);
          const subNotes = notes.filter((n) => n.subjectId === sub.id);

          return (
            <div
              key={sub.id}
              className="relative bg-[#FFFDF9] rounded-2xl border border-[#E8DCCF] p-6 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between overflow-hidden"
            >
              {/* Top colored washi tab matching subject color */}
              <div
                className="absolute top-0 left-0 right-0 h-3"
                style={{ backgroundColor: sub.color }}
              />

              <div>
                <div className="flex items-start justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-10 h-10 rounded-xl border border-black/10 flex items-center justify-center font-bold text-base shadow-2xs"
                      style={{ backgroundColor: sub.color }}
                    >
                      <BookOpen className="w-5 h-5 text-[#3E2723]" />
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-lg text-[#3E2723] group-hover:text-[#8C3A4D] transition-colors">
                        {sub.name}
                      </h3>
                      {(sub.teacher || sub.room) && (
                        <div className="flex items-center gap-3 text-xs text-[#7D6B62] mt-0.5">
                          {sub.teacher && (
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3 text-[#A3B899]" />
                              {sub.teacher}
                            </span>
                          )}
                          {sub.room && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-[#D87093]" />
                              {sub.room}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions: Edit & Delete */}
                  <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => openEditModal(sub)}
                      className="p-1.5 rounded-lg bg-[#FAF4ED] hover:bg-[#F0E5D8] text-[#6D5A50] transition-colors"
                      title="Edit subject"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(sub.id, sub.name)}
                      className="p-1.5 rounded-lg bg-[#FAF4ED] hover:bg-[#FCE4EC] text-[#8C3A4D] transition-colors"
                      title="Delete subject"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Description */}
                {sub.description && (
                  <p className="text-xs text-[#6D5A50] mt-3 line-clamp-2 leading-relaxed bg-[#FAF6EE] p-3 rounded-xl border border-[#F0E5D8]">
                    {sub.description}
                  </p>
                )}
              </div>

              {/* Subject Stats Strip */}
              <div className="mt-5 pt-4 border-t border-[#F0E6D8] grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-[#FAF6EE] p-2 rounded-xl">
                  <div className="text-[10px] text-[#8D6E63] font-medium flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-[#5B7B6D]" />
                    <span>Tasks</span>
                  </div>
                  <div className="font-bold text-[#3E2723] mt-0.5 tabular-nums">
                    {subCompletedTasks}/{subTasks.length}
                  </div>
                </div>

                <div className="bg-[#FAF6EE] p-2 rounded-xl">
                  <div className="text-[10px] text-[#8D6E63] font-medium flex items-center justify-center gap-1">
                    <Clock className="w-3 h-3 text-[#664635]" />
                    <span>Sessions</span>
                  </div>
                  <div className="font-bold text-[#3E2723] mt-0.5 tabular-nums">
                    {subPlans.length}
                  </div>
                </div>

                <div className="bg-[#FAF6EE] p-2 rounded-xl">
                  <div className="text-[10px] text-[#8D6E63] font-medium flex items-center justify-center gap-1">
                    <FileText className="w-3 h-3 text-[#D87093]" />
                    <span>Notes</span>
                  </div>
                  <div className="font-bold text-[#3E2723] mt-0.5 tabular-nums">
                    {subNotes.length}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-[#FFFDF9] rounded-3xl border border-[#E8DCCF] max-w-lg w-full p-6 shadow-2xl relative overflow-hidden animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0E6D8] mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌸</span>
                <h3 className="font-serif font-bold text-lg text-[#3E2723]">
                  {editingSubject ? 'Edit Subject' : 'Add New Subject'}
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

            {error && (
              <div className="mb-4 p-2.5 bg-[#FDE2E4] border border-[#F48FB1] rounded-xl text-xs text-[#8C2C40] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Subject Name */}
              <div>
                <label className="block text-xs font-bold text-[#5C4537] mb-1">
                  Subject Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError('');
                  }}
                  placeholder="e.g. Organic Chemistry, European History"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8C7B5] bg-white text-sm text-[#3E2723] focus:outline-none focus:border-[#A3B899] shadow-2xs"
                  required
                />
              </div>

              {/* Color Picker */}
              <div>
                <label className="block text-xs font-bold text-[#5C4537] mb-1.5">
                  Subject Theme Color (Pastel)
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {PASTEL_COLORS.map((c) => (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => setColor(c.hex)}
                      style={{ backgroundColor: c.hex }}
                      className={`h-9 rounded-xl border-2 flex items-center justify-center transition-transform hover:scale-105 shadow-2xs ${
                        color === c.hex ? 'border-[#3E2723] scale-105' : 'border-black/10'
                      }`}
                      title={c.name}
                    >
                      {color === c.hex && <Check className="w-4 h-4 text-[#3E2723]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-[#5C4537] mb-1">
                  Subject Description / Syllabus Focus
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What topics or units are covered in this course?"
                  rows={2}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D8C7B5] bg-white text-xs text-[#3E2723] focus:outline-none focus:border-[#A3B899] shadow-2xs"
                />
              </div>

              {/* Teacher and Room */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#5C4537] mb-1">
                    Teacher / Professor
                  </label>
                  <input
                    type="text"
                    value={teacher}
                    onChange={(e) => setTeacher(e.target.value)}
                    placeholder="e.g. Dr. Watson"
                    className="w-full px-3 py-2 rounded-xl border border-[#D8C7B5] bg-white text-xs text-[#3E2723] focus:outline-none focus:border-[#A3B899]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5C4537] mb-1">
                    Room / Link
                  </label>
                  <input
                    type="text"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    placeholder="e.g. Science 302 or Zoom"
                    className="w-full px-3 py-2 rounded-xl border border-[#D8C7B5] bg-white text-xs text-[#3E2723] focus:outline-none focus:border-[#A3B899]"
                  />
                </div>
              </div>

              {/* Buttons */}
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
                  {editingSubject ? 'Save Changes' : 'Create Subject'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
