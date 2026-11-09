import React, { useState } from 'react';
import {
  Clock,
  Plus,
  MapPin,
  Edit2,
  Trash2,
  Calendar,
  Grid,
  List,
} from 'lucide-react';
import { TimetableEntry, Subject, DayOfWeek } from '../types';
import { WashiTape, HexagonBadge, FloralSprigCorner } from './FloralDecorations';

const DAYS_OF_WEEK: DayOfWeek[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

interface WeeklyTimetableSectionProps {
  subjects: Subject[];
  timetable: TimetableEntry[];
  onAddEntry: (entry: Omit<TimetableEntry, 'id'>) => void;
  onEditEntry: (id: string, updated: Partial<TimetableEntry>) => void;
  onDeleteEntry: (id: string) => void;
}

export const WeeklyTimetableSection: React.FC<WeeklyTimetableSectionProps> = ({
  subjects,
  timetable,
  onAddEntry,
  onEditEntry,
  onDeleteEntry,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedDayFilter, setSelectedDayFilter] = useState<string>('All');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingEntry, setEditingEntry] = useState<TimetableEntry | null>(null);

  // Form states
  const [day, setDay] = useState<DayOfWeek>('Monday');
  const [subjectId, setSubjectId] = useState<string>(subjects[0]?.id || '');
  const [startTime, setStartTime] = useState<string>('09:00');
  const [endTime, setEndTime] = useState<string>('10:30');
  const [location, setLocation] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const openAddModal = (defaultDay?: DayOfWeek) => {
    setEditingEntry(null);
    setDay(defaultDay || 'Monday');
    setSubjectId(subjects[0]?.id || '');
    setStartTime('09:00');
    setEndTime('10:30');
    setLocation('');
    setNotes('');
    setShowModal(true);
  };

  const openEditModal = (entry: TimetableEntry) => {
    setEditingEntry(entry);
    setDay(entry.day);
    setSubjectId(entry.subjectId);
    setStartTime(entry.startTime);
    setEndTime(entry.endTime);
    setLocation(entry.location || '');
    setNotes(entry.notes || '');
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEntry) {
      onEditEntry(editingEntry.id, {
        day,
        subjectId,
        startTime,
        endTime,
        location: location.trim(),
        notes: notes.trim(),
      });
    } else {
      onAddEntry({
        day,
        subjectId,
        startTime,
        endTime,
        location: location.trim(),
        notes: notes.trim(),
      });
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this timetable class/session?')) {
      onDeleteEntry(id);
    }
  };

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
              <WashiTape text="Weekly Schedule" variant="dots" />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#3E2723]">
              Weekly Study Timetable
            </h2>
            <p className="text-xs sm:text-sm text-[#7D6B62] mt-0.5">
              Plan your regular classes, study blocks, and weekend review routines across Monday to Sunday.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-[#FAF4ED] p-1 rounded-xl border border-[#E8DACB]">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  viewMode === 'grid' ? 'bg-white text-[#3E2723] shadow-2xs' : 'text-[#7D6B62]'
                }`}
                title="Spread Grid View (like notebook photo)"
              >
                <Grid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Grid Spread</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  viewMode === 'list' ? 'bg-white text-[#3E2723] shadow-2xs' : 'text-[#7D6B62]'
                }`}
                title="List View"
              >
                <List className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">List View</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => openAddModal()}
              className="flex items-center gap-2 px-4 py-2 bg-[#F4ACB7] hover:bg-[#EB97A4] text-[#4A1D28] text-xs font-bold rounded-xl shadow-xs transition-transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Class / Block</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid Spread View (Inspired directly by the notebook picture's weekly columns!) */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {DAYS_OF_WEEK.map((d, index) => {
            const dayEntries = timetable
              .filter((entry) => entry.day === d)
              .sort((a, b) => a.startTime.localeCompare(b.startTime));

            return (
              <div
                key={d}
                className="bg-[#FFFDF9] bg-lined-paper border border-[#E8DCCF] rounded-2xl p-4 shadow-sm flex flex-col justify-between min-h-[260px] relative overflow-hidden group hover:border-[#D4C3AF] transition-all"
              >
                {/* Day Header with Hexagon sticker or Washi label */}
                <div>
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#E8DACB]">
                    <div className="flex items-center gap-2">
                      <HexagonBadge
                        variant={index % 2 === 0 ? 'pink' : 'sage'}
                        size="sm"
                        className="scale-90"
                      >
                        <span className="text-[11px] font-bold">{d.slice(0, 3)}</span>
                      </HexagonBadge>
                      <h3 className="font-serif font-bold text-sm text-[#3E2723]">{d}</h3>
                    </div>

                    <button
                      type="button"
                      onClick={() => openAddModal(d)}
                      className="p-1 rounded-lg text-[#8D6E63] hover:text-[#3E2723] hover:bg-[#FAF2EB] transition-colors"
                      title={`Add entry for ${d}`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Day Entries List */}
                  {dayEntries.length === 0 ? (
                    <div className="py-8 text-center text-xs text-[#8D7B74]">
                      <span className="text-xl block mb-1">🌿</span>
                      <span>No classes scheduled</span>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {dayEntries.map((item) => {
                        const sub = subjects.find((s) => s.id === item.subjectId);
                        return (
                          <div
                            key={item.id}
                            className="p-2.5 rounded-xl border border-[#E8DACB] bg-white/90 shadow-2xs group/item hover:border-[#D8C7B5] transition-all"
                          >
                            <div className="flex items-start justify-between gap-1">
                              <span
                                className="text-[10px] font-bold px-1.5 py-0.5 rounded border text-[#3E2723] truncate max-w-[130px]"
                                style={{ backgroundColor: sub?.color || '#FFE5D9' }}
                              >
                                {sub?.name || 'Class'}
                              </span>

                              <div className="flex items-center gap-0.5 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                <button
                                  type="button"
                                  onClick={() => openEditModal(item)}
                                  className="p-1 text-[#8D6E63] hover:text-[#3E2723]"
                                >
                                  <Edit2 className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDelete(item.id)}
                                  className="p-1 text-[#8D6E63] hover:text-[#9C324E]"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 text-[11px] font-mono text-[#664635] mt-1.5">
                              <Clock className="w-3 h-3 text-[#A3B899]" />
                              <span>
                                {item.startTime} - {item.endTime}
                              </span>
                            </div>

                            {item.location && (
                              <div className="flex items-center gap-1 text-[10px] text-[#7D6B62] mt-1">
                                <MapPin className="w-2.5 h-2.5 text-[#D87093]" />
                                <span className="truncate">{item.location}</span>
                              </div>
                            )}

                            {item.notes && (
                              <p className="text-[10px] text-[#8D7B74] mt-1 italic border-t border-[#F5EDE3] pt-1">
                                {item.notes}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Bottom Day Footer */}
                <div className="mt-3 pt-2 border-t border-[#F0E6D8] text-[10px] text-[#8D6E63] flex justify-between items-center">
                  <span>{dayEntries.length} {dayEntries.length === 1 ? 'session' : 'sessions'}</span>
                  <span className="font-handwriting text-sm text-[#D87093]">🌸</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="bg-[#FFFDF9] border border-[#E8DCCF] rounded-2xl p-6 shadow-sm">
          {/* Day Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-4 border-b border-[#F0E6D8]">
            {['All', ...DAYS_OF_WEEK].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setSelectedDayFilter(d)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedDayFilter === d
                    ? 'bg-[#A3B899] text-white shadow-2xs'
                    : 'bg-[#FAF4ED] text-[#6D5A50] hover:bg-[#F0E5D8]'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          <div className="divide-y divide-[#F0E6D8]">
            {timetable
              .filter((e) => selectedDayFilter === 'All' || e.day === selectedDayFilter)
              .sort((a, b) => {
                const dayIndexA = DAYS_OF_WEEK.indexOf(a.day);
                const dayIndexB = DAYS_OF_WEEK.indexOf(b.day);
                return dayIndexA - dayIndexB || a.startTime.localeCompare(b.startTime);
              })
              .map((item) => {
                const sub = subjects.find((s) => s.id === item.subjectId);
                return (
                  <div key={item.id} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <HexagonBadge variant="sage" size="sm" className="scale-75">
                        <span className="text-[10px] font-bold">{item.day.slice(0, 3)}</span>
                      </HexagonBadge>
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className="text-xs font-bold px-2 py-0.5 rounded-md border text-[#3E2723]"
                            style={{ backgroundColor: sub?.color || '#FFE5D9' }}
                          >
                            {sub?.name || 'Class'}
                          </span>
                          <span className="text-xs text-[#664635] font-mono flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#A3B899]" />
                            {item.startTime} - {item.endTime}
                          </span>
                        </div>
                        {item.location && (
                          <div className="text-xs text-[#7D6B62] mt-0.5 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#D87093]" />
                            <span>{item.location}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => openEditModal(item)}
                        className="p-1.5 rounded-lg text-[#8D6E63] hover:bg-[#FAF4ED]"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 rounded-lg text-[#8D6E63] hover:text-[#9C324E] hover:bg-[#FCE4EC]"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Add / Edit Timetable Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-[#FFFDF9] rounded-3xl border border-[#E8DCCF] max-w-md w-full p-6 shadow-2xl relative animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0E6D8] mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">🗓️</span>
                <h3 className="font-serif font-bold text-lg text-[#3E2723]">
                  {editingEntry ? 'Edit Class Schedule' : 'Add Weekly Schedule'}
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
              {/* Day of Week */}
              <div>
                <label className="block text-xs font-bold text-[#5C4537] mb-1">
                  Day of the Week *
                </label>
                <select
                  value={day}
                  onChange={(e) => setDay(e.target.value as DayOfWeek)}
                  className="w-full px-3 py-2 rounded-xl border border-[#D8C7B5] bg-white text-xs text-[#3E2723] focus:outline-none focus:border-[#A3B899]"
                  required
                >
                  {DAYS_OF_WEEK.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
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

              {/* Start Time & End Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#5C4537] mb-1">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D8C7B5] bg-white text-xs text-[#3E2723] focus:outline-none focus:border-[#A3B899]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#5C4537] mb-1">
                    End Time *
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#D8C7B5] bg-white text-xs text-[#3E2723] focus:outline-none focus:border-[#A3B899]"
                    required
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-bold text-[#5C4537] mb-1">
                  Location / Classroom
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Science Lab 302 or Online"
                  className="w-full px-3 py-2 rounded-xl border border-[#D8C7B5] bg-white text-xs text-[#3E2723] focus:outline-none focus:border-[#A3B899]"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-[#5C4537] mb-1">
                  Preparation / Notes
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Bring calculator, review readings"
                  className="w-full px-3 py-2 rounded-xl border border-[#D8C7B5] bg-white text-xs text-[#3E2723] focus:outline-none focus:border-[#A3B899]"
                />
              </div>

              {/* Buttons */}
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
                  {editingEntry ? 'Save Changes' : 'Add to Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
