import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  Pin,
  Trash2,
  Edit2,
  BookOpen,
  Copy,
  Check,
  Calendar,
} from 'lucide-react';
import { StudyNote, Subject } from '../types';
import { WashiTape, FloralSprigCorner } from './FloralDecorations';

interface StudyNotesSectionProps {
  subjects: Subject[];
  notes: StudyNote[];
  onAddNote: (note: Omit<StudyNote, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onEditNote: (id: string, updated: Partial<StudyNote>) => void;
  onDeleteNote: (id: string) => void;
  onTogglePin: (id: string) => void;
}

export const StudyNotesSection: React.FC<StudyNotesSectionProps> = ({
  subjects,
  notes,
  onAddNote,
  onEditNote,
  onDeleteNote,
  onTogglePin,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingNote, setEditingNote] = useState<StudyNote | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState<string>('');
  const [subjectId, setSubjectId] = useState<string>(subjects[0]?.id || '');
  const [content, setContent] = useState<string>('');
  const [paperStyle, setPaperStyle] = useState<'lined' | 'grid' | 'blank'>('lined');
  const [isPinned, setIsPinned] = useState<boolean>(false);

  const openAddModal = () => {
    setEditingNote(null);
    setTitle('');
    setSubjectId(subjects[0]?.id || '');
    setContent('');
    setPaperStyle('lined');
    setIsPinned(false);
    setShowModal(true);
  };

  const openEditModal = (note: StudyNote) => {
    setEditingNote(note);
    setTitle(note.title);
    setSubjectId(note.subjectId);
    setContent(note.content);
    setPaperStyle(note.paperStyle);
    setIsPinned(note.isPinned);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingNote) {
      onEditNote(editingNote.id, {
        title: title.trim(),
        subjectId,
        content: content.trim(),
        paperStyle,
        isPinned,
        updatedAt: new Date().toISOString(),
      });
    } else {
      onAddNote({
        title: title.trim(),
        subjectId,
        content: content.trim(),
        paperStyle,
        isPinned,
      });
    }

    setShowModal(false);
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredNotes = notes.filter((n) => {
    if (selectedSubjectFilter !== 'all' && n.subjectId !== selectedSubjectFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = n.title.toLowerCase().includes(q);
      const matchContent = n.content.toLowerCase().includes(q);
      const subName = subjects.find((s) => s.id === n.subjectId)?.name.toLowerCase();
      return matchTitle || matchContent || subName?.includes(q);
    }
    return true;
  });

  // Sort notes: pinned first, then newest
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
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
              <WashiTape text="Study Journal Notes" variant="peach" />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#3E2723]">
              Study Notes & Summaries
            </h2>
            <p className="text-xs sm:text-sm text-[#7D6B62] mt-0.5">
              Capture key lecture insights, formulas, flash summaries, and revision cheat sheets.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-[#A3B899] hover:bg-[#8DA382] text-white font-semibold text-sm shadow-sm transition-all shrink-0 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Write New Note</span>
          </button>
        </div>
      </div>

      {/* Search & Subject Filter Bar */}
      <div className="bg-[#FFFDF9] border border-[#E8DCCF] rounded-2xl p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#8D6E63] absolute left-3.5 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes by keywords, equations, or subjects..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#D8C7B5] bg-white text-xs text-[#3E2723] focus:outline-none focus:border-[#A3B899]"
          />
        </div>

        <select
          value={selectedSubjectFilter}
          onChange={(e) => setSelectedSubjectFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-[#D8C7B5] bg-[#FAF4ED] text-xs font-semibold text-[#4E342E] focus:outline-none"
        >
          <option value="all">All Subjects ({notes.length})</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {/* Notes Grid (Aesthetic Physical Journal Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedNotes.map((note) => {
          const sub = subjects.find((s) => s.id === note.subjectId);
          const paperBgClass =
            note.paperStyle === 'lined'
              ? 'bg-lined-paper'
              : note.paperStyle === 'grid'
              ? 'bg-grid-paper'
              : 'bg-[#FFFDF9]';

          return (
            <div
              key={note.id}
              className={`relative rounded-3xl border border-[#E8DCCF] p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between ${paperBgClass}`}
            >
              {/* Pinned status tag / washi tape */}
              {note.isPinned && (
                <div className="absolute -top-2.5 left-6 -rotate-2">
                  <WashiTape text="PINNED" variant="floral" className="text-xs py-0.5" />
                </div>
              )}

              <div>
                {/* Header: Subject & Note Actions */}
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#E8DACB] pt-2">
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-md border text-[#3E2723] truncate max-w-[150px]"
                    style={{ backgroundColor: sub?.color || '#FFE5D9' }}
                  >
                    {sub?.name || 'General'}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onTogglePin(note.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        note.isPinned
                          ? 'bg-[#FCE4EC] text-[#D87093]'
                          : 'text-[#8D6E63] hover:bg-[#FAF4ED]'
                      }`}
                      title={note.isPinned ? 'Unpin note' : 'Pin note to top'}
                    >
                      <Pin className="w-3.5 h-3.5 fill-current" />
                    </button>
                    <button
                      type="button"
                      onClick={() => openEditModal(note)}
                      className="p-1.5 rounded-lg text-[#8D6E63] hover:bg-[#FAF4ED]"
                      title="Edit note"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(note.id, `${note.title}\n\n${note.content}`)}
                      className="p-1.5 rounded-lg text-[#8D6E63] hover:bg-[#FAF4ED]"
                      title="Copy note content"
                    >
                      {copiedId === note.id ? (
                        <Check className="w-3.5 h-3.5 text-[#5B7B6D]" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteNote(note.id)}
                      className="p-1.5 rounded-lg text-[#8D6E63] hover:text-[#9C324E] hover:bg-[#FCE4EC]"
                      title="Delete note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-serif font-bold text-lg text-[#3E2723] leading-snug">
                  {note.title}
                </h3>

                {/* Content */}
                <div className="mt-2 text-xs text-[#5C4537] leading-relaxed whitespace-pre-line line-clamp-8 font-sans">
                  {note.content}
                </div>
              </div>

              {/* Note Footer */}
              <div className="mt-4 pt-3 border-t border-[#F0E6D8] flex items-center justify-between text-[10px] text-[#8D6E63]">
                <span className="flex items-center gap-1 font-mono">
                  <Calendar className="w-3 h-3 text-[#A3B899]" />
                  {new Date(note.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
                <span className="capitalize">{note.paperStyle} Paper</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Note Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-[#FFFDF9] rounded-3xl border border-[#E8DCCF] max-w-lg w-full p-6 shadow-2xl relative animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0E6D8] mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">📝</span>
                <h3 className="font-serif font-bold text-lg text-[#3E2723]">
                  {editingNote ? 'Edit Study Note' : 'Write Study Note'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-xs font-semibold text-[#8D6E63] hover:text-[#3E2723] px-2 py-1 rounded-lg bg-[#FAF4ED]"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-[#5C4537] mb-1">
                  Note Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Photosynthesis Reactions Summary, Newton Laws"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#D8C7B5] bg-white text-xs text-[#3E2723] focus:outline-none focus:border-[#A3B899]"
                  required
                />
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-bold text-[#5C4537] mb-1">
                  Subject *
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

              {/* Paper Style */}
              <div>
                <label className="block text-xs font-bold text-[#5C4537] mb-1">
                  Paper Style
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['lined', 'grid', 'blank'] as const).map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setPaperStyle(style)}
                      className={`py-1.5 rounded-xl text-xs font-bold capitalize border transition-all ${
                        paperStyle === style
                          ? 'bg-[#FAF2EB] border-[#D87093] text-[#7A2C3E] shadow-2xs'
                          : 'bg-white border-[#E5D7C5] text-[#7D6B62]'
                      }`}
                    >
                      {style} Paper
                    </button>
                  ))}
                </div>
              </div>

              {/* Note Content */}
              <div>
                <label className="block text-xs font-bold text-[#5C4537] mb-1">
                  Note Content & Formulas *
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write formulas, definitions, key takeaways, diagrams in markdown or bullet points..."
                  rows={8}
                  className="w-full p-3 rounded-xl border border-[#D8C7B5] bg-white text-xs text-[#3E2723] focus:outline-none focus:border-[#A3B899] leading-relaxed"
                  required
                />
              </div>

              {/* Pin Checkbox */}
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#5C4537]">
                <input
                  type="checkbox"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="rounded border-[#D8C7B5] text-[#D87093] focus:ring-0"
                />
                <span>Pin this note to the top of my journal</span>
              </label>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F0E6D8]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#FAF4ED] text-[#6D5A50] hover:bg-[#F0E5D8] text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#F4ACB7] hover:bg-[#EB97A4] text-[#4A1D28] text-xs font-bold shadow-xs transition-transform active:scale-95"
                >
                  {editingNote ? 'Save Changes' : 'Save Note'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
